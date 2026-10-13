
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RECEIPT_BUCKET = "amano-hotel-receipts";

function respond(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function sendBookingConfirmationEmail(
  to: string,
  guestName: string,
  bookingReference: string,
  hotelName: string,
  roomName: string,
  checkIn: string,
  checkOut: string,
  guestCount: number,
  roomCount: number,
  totalAmount: number,
): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("BOOKING_FROM_EMAIL");

  if (
    !apiKey ||
    !from ||
    !to ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)
  ) {
    console.error(
      "Booking confirmation email skipped: email configuration is missing or invalid.",
      {
        hasApiKey: Boolean(apiKey),
        hasFrom: Boolean(from),
        hasRecipient: Boolean(to),
      },
    );
    return false;
  }

  const safeGuestName = escapeHtml(guestName);
  const safeReference = escapeHtml(bookingReference);
  const safeHotelName = escapeHtml(hotelName);
  const safeRoomName = escapeHtml(roomName);
  const safeCheckIn = escapeHtml(checkIn);
  const safeCheckOut = escapeHtml(checkOut);
  const safeGuestCount = escapeHtml(guestCount);
  const safeRoomCount = escapeHtml(roomCount);

  const formattedAmount = escapeHtml(
    Number(totalAmount).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    }),
  );

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#263238;line-height:1.6">
      <div style="background:#002B5C;padding:24px;text-align:center;color:#ffffff">
        <h1 style="margin:0">AMANO National Convention</h1>
        <p style="margin:8px 0 0">Hotel Booking Confirmation</p>
      </div>

      <div style="padding:24px;border:1px solid #e5e7eb">
        <h2 style="color:#16703c">Your booking is confirmed!</h2>

        <p>Dear ${safeGuestName},</p>

        <p>
          We are pleased to confirm your hotel booking for the
          AMANO National Convention. Your payment has been verified
          and your booking is now confirmed.
        </p>

        <div style="background:#f3f6fa;padding:16px;border-radius:8px">
          <p><strong>Booking reference:</strong> ${safeReference}</p>
          <p><strong>Hotel:</strong> ${safeHotelName}</p>
          <p><strong>Room type:</strong> ${safeRoomName}</p>
          <p><strong>Check-in:</strong> ${safeCheckIn}</p>
          <p><strong>Check-out:</strong> ${safeCheckOut}</p>
          <p><strong>Guests:</strong> ${safeGuestCount}</p>
          <p><strong>Rooms:</strong> ${safeRoomCount}</p>
          <p><strong>Total booking amount:</strong> ${formattedAmount}</p>
        </div>

        <p>
          Please keep your booking reference for future enquiries
          and when communicating with the hotel or AMANO booking team.
        </p>

        <p>
          Thank you for choosing AMANO National Convention.
          We look forward to welcoming you.
        </p>

        <p>
          Kind regards,<br />
          <strong>AMANO National Convention Team</strong>
        </p>
      </div>
    </div>
  `;

  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Your AMANO Hotel Booking Is Confirmed — ${bookingReference}`,
        html,
      }),
    });

    const responseText = await result.text();

    if (!result.ok) {
      console.error("Resend rejected confirmation email:", {
        status: result.status,
        response: responseText.slice(0, 1000),
        booking_reference: bookingReference,
      });
      return false;
    }

    console.info("Booking confirmation email accepted by Resend:", {
      booking_reference: bookingReference,
      status: result.status,
      response: responseText.slice(0, 300),
    });

    return true;
  } catch (error) {
    console.error("Booking confirmation email request failed:", {
      booking_reference: bookingReference,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return respond({ error: "Method not allowed." }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const authorization = req.headers.get("Authorization");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      console.error("Required Supabase environment variables are missing.");
      return respond({ error: "Server configuration error." }, 500);
    }

    if (!authorization) {
      return respond({ error: "Authentication is required." }, 401);
    }

    const token = authorization.replace(/^Bearer\s+/i, "");

    const authClient = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: userData, error: authError } =
      await authClient.auth.getUser(token);

    if (authError || !userData.user) {
      return respond(
        { error: "Your session is invalid or has expired." },
        401,
      );
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: access, error: accessError } = await adminClient
      .from("photographer_access")
      .select("staff_role, is_active")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (accessError) {
      console.error("Admin access lookup failed:", accessError.message);
      return respond({ error: "Unable to verify admin access." }, 500);
    }

    if (
      !access ||
      access.staff_role !== "super_admin" ||
      access.is_active !== true
    ) {
      return respond(
        { error: "Active AMANO super-admin access is required." },
        403,
      );
    }

    let body: Record<string, unknown>;

    try {
      const parsed: unknown = await req.json();

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        return respond({ error: "Invalid request body." }, 400);
      }

      body = parsed as Record<string, unknown>;
    } catch {
      return respond({ error: "Invalid JSON request body." }, 400);
    }

    const bookingId =
      typeof body.bookingId === "string"
        ? body.bookingId.trim()
        : "";

    const action =
      typeof body.action === "string"
        ? body.action.trim()
        : "";

    const reason =
      typeof body.reason === "string"
        ? body.reason.trim()
        : "";

    if (!isValidUuid(bookingId)) {
      return respond({ error: "A valid booking ID is required." }, 400);
    }

    const allowedActions = [
      "verify_payment",
      "confirm_booking",
      "reject_payment",
      "reject_booking",
      "delete_booking",
    ];

    if (!allowedActions.includes(action)) {
      return respond({ error: "Unsupported booking action." }, 400);
    }

    if (
      ["reject_payment", "reject_booking"].includes(action) &&
      (reason.length < 5 || reason.length > 1000)
    ) {
      return respond(
        {
          error:
            "Provide a rejection reason between 5 and 1000 characters.",
        },
        400,
      );
    }

    const { data: booking, error: bookingError } = await adminClient
      .from("hotel_bookings")
      .select(
        "id, booking_reference, booking_status, payment_status, admin_notes, guest_name, guest_email, hotel_id, room_id, check_in, check_out, guest_count, room_count, total_amount",
      )
      .eq("id", bookingId)
      .maybeSingle();

    if (bookingError) {
      console.error("Booking lookup failed:", bookingError.message);
      return respond({ error: "Unable to retrieve this booking." }, 500);
    }

    if (!booking) {
      return respond({ error: "Booking not found." }, 404);
    }

    // DELETE BOOKING
    // Only an active AMANO super admin can reach this operation.

    if (action === "delete_booking") {
      const { data: receipts, error: receiptsError } = await adminClient
        .from("hotel_payment_receipts")
        .select("id, storage_path")
        .eq("booking_id", bookingId);

      if (receiptsError) {
        console.error(
          "Booking receipt lookup failed:",
          receiptsError.message,
        );

        return respond(
          { error: "Unable to retrieve the booking's receipt records." },
          500,
        );
      }

      const receiptRows = receipts ?? [];

      const storagePaths = receiptRows
        .map((receipt) => receipt.storage_path)
        .filter(
          (path): path is string =>
            typeof path === "string" &&
            path.startsWith(`${bookingId}/`) &&
            !path.includes("..") &&
            !path.includes("\\") &&
            path.split("/").length === 2,
        );

      if (storagePaths.length !== receiptRows.length) {
        console.error(
          "Unexpected receipt storage path encountered.",
          { bookingId },
        );

        return respond(
          {
            error:
              "A receipt has an unexpected storage path. The booking was not deleted. Please contact the system administrator.",
          },
          409,
        );
      }

      if (storagePaths.length > 0) {
        const { error: storageError } = await adminClient.storage
          .from(RECEIPT_BUCKET)
          .remove(storagePaths);

        if (storageError) {
          console.error(
            "Receipt file deletion failed:",
            storageError.message,
          );

          return respond(
            {
              error:
                "Unable to delete the booking's receipt files. The booking was not deleted.",
            },
            500,
          );
        }
      }

      if (receiptRows.length > 0) {
        const { error: receiptDeleteError } = await adminClient
          .from("hotel_payment_receipts")
          .delete()
          .eq("booking_id", bookingId);

        if (receiptDeleteError) {
          console.error(
            "Receipt metadata deletion failed:",
            receiptDeleteError.message,
          );

          return respond(
            {
              error:
                "Receipt files were removed, but receipt metadata could not be deleted. The booking was not deleted. Please contact the system administrator.",
            },
            500,
          );
        }
      }

      const { data: deletedBooking, error: deleteError } =
        await adminClient
          .from("hotel_bookings")
          .delete()
          .eq("id", bookingId)
          .select("id, booking_reference")
          .maybeSingle();

      if (deleteError) {
        console.error("Booking deletion failed:", deleteError.message);

        return respond(
          {
            error:
              "The receipt records were removed, but the booking could not be deleted. Check whether another database record depends on this booking.",
          },
          500,
        );
      }

      if (!deletedBooking) {
        return respond(
          {
            error:
              "The booking was not deleted. It may have changed or already been removed. Refresh the dashboard.",
          },
          409,
        );
      }

      console.info("Hotel booking deleted", {
        booking_reference: deletedBooking.booking_reference,
        admin_user_id: userData.user.id,
      });

      return respond({
        success: true,
        action: "delete_booking",
        message: `Booking ${deletedBooking.booking_reference} was deleted successfully.`,
        booking: deletedBooking,
      });
    }

    // Existing payment and booking actions

    if (
      ["confirmed", "rejected", "cancelled"].includes(
        booking.booking_status,
      )
    ) {
      return respond(
        { error: `This booking is already ${booking.booking_status}.` },
        409,
      );
    }

    const now = new Date().toISOString();

    const previousNotes =
      typeof booking.admin_notes === "string"
        ? booking.admin_notes.trim()
        : "";

    let update: Record<string, unknown> = {};

    if (action === "verify_payment") {
      const { data: receipt, error: receiptError } = await adminClient
        .from("hotel_payment_receipts")
        .select("id")
        .eq("booking_id", bookingId)
        .limit(1)
        .maybeSingle();

      if (receiptError) {
        console.error("Receipt lookup failed:", receiptError.message);

        return respond(
          { error: "Unable to check the payment receipt." },
          500,
        );
      }

      if (!receipt) {
        return respond(
          { error: "No receipt has been uploaded for this booking." },
          409,
        );
      }

      if (booking.payment_status !== "submitted") {
        console.warn(
          "Receipt exists, but payment status is not submitted:",
          {
            bookingId,
            paymentStatus: booking.payment_status,
          },
        );

        return respond(
          {
            error:
              "A receipt exists, but the booking payment status is not submitted. Refresh the booking and check its payment status before verifying.",
          },
          409,
        );
      }

      update = {
        payment_status: "verified",
        booking_status: "payment_verified",
        payment_verified_by: userData.user.id,
        payment_verified_at: now,
      };
    }

    if (action === "confirm_booking") {
      if (
        booking.payment_status !== "verified" ||
        booking.booking_status !== "payment_verified"
      ) {
        return respond(
          {
            error:
              "Payment must be verified before the booking can be confirmed.",
          },
          409,
        );
      }

      update = {
        booking_status: "confirmed",
        confirmed_at: now,
      };
    }

    if (action === "reject_payment") {
      update = {
        payment_status: "rejected",
        booking_status: "rejected",
        admin_notes: [
          previousNotes,
          `Payment rejected: ${reason}`,
        ].filter(Boolean).join("\n"),
      };
    }

    if (action === "reject_booking") {
      update = {
        booking_status: "rejected",
        admin_notes: [
          previousNotes,
          `Booking rejected: ${reason}`,
        ].filter(Boolean).join("\n"),
      };
    }

    const { data: updatedBooking, error: updateError } =
      await adminClient
        .from("hotel_bookings")
        .update(update)
        .eq("id", bookingId)
        .eq("booking_status", booking.booking_status)
        .select(
          "id, booking_reference, booking_status, payment_status",
        )
        .maybeSingle();

    if (updateError) {
      console.error("Booking update failed:", updateError.message);

      return respond(
        { error: "Unable to update the booking." },
        500,
      );
    }

    if (!updatedBooking) {
      return respond(
        {
          error:
            "The booking changed while this action was processing. Refresh and try again.",
        },
        409,
      );
    }

    // Send the confirmation email only after the database update succeeds.
    // Email failure does not reverse the confirmed booking.
    let confirmationEmailSent: boolean | null = null;

    if (action === "confirm_booking") {
      const { data: hotel, error: hotelError } = await adminClient
        .from("hotel_listings")
        .select("name")
        .eq("id", booking.hotel_id)
        .maybeSingle();

      const { data: room, error: roomError } = await adminClient
        .from("hotel_rooms")
        .select("room_name")
        .eq("id", booking.room_id)
        .maybeSingle();

      if (hotelError || roomError || !hotel || !room) {
        console.error(
          "Booking confirmed, but hotel details could not be retrieved for the confirmation email.",
          {
            booking_reference: booking.booking_reference,
            hotel_error: hotelError?.message,
            room_error: roomError?.message,
          },
        );

        confirmationEmailSent = false;
      } else {
        confirmationEmailSent = await sendBookingConfirmationEmail(
          String(booking.guest_email ?? "").trim().toLowerCase(),
          String(booking.guest_name ?? ""),
          String(booking.booking_reference),
          String(hotel.name),
          String(room.room_name),
          String(booking.check_in ?? ""),
          String(booking.check_out ?? ""),
          Number(booking.guest_count),
          Number(booking.room_count),
          Number(booking.total_amount),
        );
      }
    }

    console.info("Hotel booking action completed", {
      booking_reference: updatedBooking.booking_reference,
      action,
      admin_user_id: userData.user.id,
      ...(action === "confirm_booking"
        ? { confirmation_email_sent: confirmationEmailSent }
        : {}),
    });

    return respond({
      success: true,
      message: action === "confirm_booking"
        ? confirmationEmailSent
          ? "Booking confirmed and confirmation email sent."
          : "Booking confirmed, but the confirmation email could not be sent. Check the function logs."
        : "Booking updated successfully.",
      booking: updatedBooking,
      ...(action === "confirm_booking"
        ? { confirmation_email_sent: confirmationEmailSent }
        : {}),
    });
  } catch (error) {
    console.error(
      "admin-hotel-booking-action failed:",
      error instanceof Error ? error.message : String(error),
    );

    return respond(
      { error: "An unexpected error occurred. Please try again." },
      500,
    );
  }
});
