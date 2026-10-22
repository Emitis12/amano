
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const testMode = Deno.env.get("HOTEL_BOOKING_TEST_MODE") === "true";

const RECEIPT_BUCKET = "amano-hotel-receipts";
const MAX_RECEIPT_SIZE = 10 * 1024 * 1024;

// Administrator booking email configuration.
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const BOOKING_ADMIN_EMAIL = Deno.env.get("BOOKING_ADMIN_EMAIL");
const BOOKING_FROM_EMAIL = Deno.env.get("BOOKING_FROM_EMAIL");

const ALLOWED_RECEIPT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const RECEIPT_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable.",
  );
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normaliseEmail(value: unknown): string {
  return typeof value === "string"
    ? value.trim().toLowerCase()
    : "";
}

function escapeEmailHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

function throwDatabaseError(context: string, error: unknown): never {
  if (error && typeof error === "object") {
    const dbError = error as {
      message?: unknown;
      code?: unknown;
      details?: unknown;
      hint?: unknown;
    };

    const details = [
      context,
      typeof dbError.message === "string"
        ? dbError.message
        : "Unknown database error",
      dbError.code ? `code=${String(dbError.code)}` : "",
      dbError.details ? `details=${String(dbError.details)}` : "",
      dbError.hint ? `hint=${String(dbError.hint)}` : "",
    ].filter(Boolean);

    throw new Error(details.join(" | "));
  }

  throw new Error(`${context}: ${String(error)}`);
}

/**
 * Sends a notification to the AMANO booking administrator.
 *
 * This function never throws an email-delivery error into the
 * booking creation flow. A failed email must not undo a saved booking.
 */
async function sendAdminBookingAlert(details: {
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  hotelName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  roomCount: number;
  numberOfNights: number;
  totalAmount: number;
  testMode: boolean;
}): Promise<boolean> {
  if (
    !RESEND_API_KEY ||
    !BOOKING_ADMIN_EMAIL ||
    !BOOKING_FROM_EMAIL
  ) {
    console.error(
      "Admin booking alert not sent: missing email configuration.",
      {
        hasApiKey: Boolean(RESEND_API_KEY),
        hasAdminEmail: Boolean(BOOKING_ADMIN_EMAIL),
        hasFromEmail: Boolean(BOOKING_FROM_EMAIL),
        bookingReference: details.bookingReference,
      },
    );

    return false;
  }

  if (!validEmail(BOOKING_ADMIN_EMAIL)) {
    console.error(
      "Admin booking alert not sent: invalid administrator email.",
      {
        bookingReference: details.bookingReference,
      },
    );

    return false;
  }

  const e = escapeEmailHtml;

  const amount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(details.totalAmount);

  const subject =
    `New AMANO Hotel Booking - ${details.bookingReference}`;

  const text = [
    "A new AMANO hotel booking has been submitted.",
    "",
    `Booking reference: ${details.bookingReference}`,
    `Guest: ${details.guestName}`,
    `Email: ${details.guestEmail}`,
    `Phone: ${details.guestPhone}`,
    `Hotel: ${details.hotelName}`,
    `Room: ${details.roomName}`,
    `Check-in: ${details.checkIn}`,
    `Check-out: ${details.checkOut}`,
    `Nights: ${details.numberOfNights}`,
    `Guests: ${details.guestCount}`,
    `Rooms: ${details.roomCount}`,
    `Total amount: ${amount}`,
    "Booking status: PENDING",
    "Payment status: PENDING",
    details.testMode
      ? "NOTICE: This booking was created in TEST MODE."
      : "",
    "",
    "Please sign in to the AMANO administration dashboard to review this booking.",
  ].filter(Boolean).join("\n");

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New AMANO Hotel Booking</title>
      </head>
      <body style="margin:0;padding:20px;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
          <div style="background:#002B5C;color:#ffffff;padding:24px;">
            <h2 style="margin:0;">AMANO Hotel Bookings</h2>
            <p style="margin:8px 0 0;">New booking request received</p>
          </div>

          <div style="padding:24px;">
            <p>A new hotel booking has been submitted and is awaiting review.</p>

            ${
              details.testMode
                ? `<p style="background:#fff7ed;padding:12px;color:#9a3412;">
                    <strong>TEST MODE:</strong> This is a test booking.
                  </p>`
                : ""
            }

            <p>
              <strong>Booking reference:</strong>
              ${e(details.bookingReference)}
            </p>

            <h3>Guest details</h3>
            <p>
              <strong>Name:</strong> ${e(details.guestName)}<br>
              <strong>Email:</strong> ${e(details.guestEmail)}<br>
              <strong>Phone:</strong> ${e(details.guestPhone)}
            </p>

            <h3>Reservation details</h3>
            <p>
              <strong>Hotel:</strong> ${e(details.hotelName)}<br>
              <strong>Room:</strong> ${e(details.roomName)}<br>
              <strong>Check-in:</strong> ${e(details.checkIn)}<br>
              <strong>Check-out:</strong> ${e(details.checkOut)}<br>
              <strong>Nights:</strong> ${e(details.numberOfNights)}<br>
              <strong>Guests:</strong> ${e(details.guestCount)}<br>
              <strong>Rooms:</strong> ${e(details.roomCount)}
            </p>

            <p style="font-size:18px;">
              <strong>Total amount:</strong> ${e(amount)}
            </p>

            <p>
              <strong>Booking status:</strong> Pending<br>
              <strong>Payment status:</strong> Pending
            </p>

            <p>
              Please sign in to the AMANO administration dashboard
              to review this booking.
            </p>

            <p style="color:#6b7280;font-size:12px;">
              Automated notification from the AMANO Convention hotel booking system.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: BOOKING_FROM_EMAIL,
        to: [BOOKING_ADMIN_EMAIL],
        subject,
        html,
        text,
      }),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Admin booking alert failed:", {
        status: res.status,
        error: result,
        bookingReference: details.bookingReference,
      });

      return false;
    }

    console.info("Admin booking alert accepted by Resend:", {
      bookingReference: details.bookingReference,
      emailId: result?.id ?? null,
    });

    return true;
  } catch (error) {
    console.error("Admin booking alert request failed:", {
      bookingReference: details.bookingReference,
      error: error instanceof Error
        ? error.message
        : String(error),
    });

    return false;
  }
}

type GuestBookingRequest = Record<string, unknown>;

async function findGuestBooking(body: GuestBookingRequest) {
  const bookingId =
    typeof body.booking_id === "string"
      ? body.booking_id.trim()
      : "";

  const bookingReference =
    typeof body.booking_reference === "string"
      ? body.booking_reference.trim()
      : "";

  const guestEmail = normaliseEmail(body.guest_email);

  if (
    !guestEmail ||
    !validEmail(guestEmail) ||
    (!bookingId && !bookingReference)
  ) {
    throw new Error(
      "A valid guest email and booking ID or booking reference are required.",
    );
  }

  if (
    bookingId &&
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      .test(bookingId)
  ) {
    throw new Error("Invalid booking ID.");
  }

  let query = supabase
    .from("hotel_bookings")
    .select(
      "id, booking_reference, guest_email, booking_status, payment_status",
    );

  query = bookingId
    ? query.eq("id", bookingId)
    : query.eq("booking_reference", bookingReference);

  const { data: booking, error } = await query.maybeSingle();

  if (error) {
    throwDatabaseError("Guest booking lookup failed", error);
  }

  if (
    !booking ||
    normaliseEmail(booking.guest_email) !== guestEmail
  ) {
    throw new Error(
      "Booking not found. Check your booking reference and email address.",
    );
  }

  if (
    ["rejected", "cancelled"].includes(
      String(booking.booking_status).toLowerCase(),
    )
  ) {
    throw new Error(
      "A receipt cannot be submitted for a cancelled or rejected booking.",
    );
  }

  return booking;
}

async function prepareReceiptUpload(body: GuestBookingRequest) {
  const booking = await findGuestBooking(body);

  const contentType =
    typeof body.content_type === "string"
      ? body.content_type.trim().toLowerCase()
      : "";

  const fileSize = Number(body.file_size_bytes);

  if (!ALLOWED_RECEIPT_TYPES.has(contentType)) {
    throw new Error("Upload a JPG, PNG, WEBP, or PDF receipt.");
  }

  if (
    !Number.isSafeInteger(fileSize) ||
    fileSize <= 0 ||
    fileSize > MAX_RECEIPT_SIZE
  ) {
    throw new Error(
      "Receipt must be greater than zero bytes and no larger than 10 MB.",
    );
  }

  const extension = RECEIPT_EXTENSIONS[contentType];
  const storagePath =
    `${booking.id}/${crypto.randomUUID()}.${extension}`;

  const { data, error } = await supabase.storage
    .from(RECEIPT_BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error || !data?.token) {
    console.error("Signed receipt upload creation failed:", error);

    throw new Error(
      "Could not prepare the receipt upload. Please try again.",
    );
  }

  return {
    booking_id: booking.id,
    storage_path: storagePath,
    token: data.token,
    signed_url: data.signedUrl,
  };
}

/**
 * Marks a booking as having a submitted receipt.
 *
 * This does NOT verify payment or confirm the booking.
 * A previously verified payment is never downgraded.
 */
async function markBookingPaymentSubmitted(bookingId: string) {
  const { error } = await supabase
    .from("hotel_bookings")
    .update({
      payment_status: "submitted",
    })
    .eq("id", bookingId)
    .neq("payment_status", "verified");

  if (error) {
    throwDatabaseError(
      "Booking payment status update failed",
      error,
    );
  }
}

async function recordReceiptUpload(body: GuestBookingRequest) {
  const booking = await findGuestBooking(body);

  const storagePath =
    typeof body.storage_path === "string"
      ? body.storage_path.trim()
      : "";

  const contentType =
    typeof body.content_type === "string"
      ? body.content_type.trim().toLowerCase()
      : "";

  const fileSize = Number(body.file_size_bytes);

  const originalFilename =
    typeof body.original_filename === "string"
      ? body.original_filename
          .trim()
          .replace(/[\\/\u0000-\u001f]/g, "_")
          .slice(0, 255)
      : "";

  if (
    !storagePath.startsWith(`${booking.id}/`) ||
    storagePath.includes("..") ||
    storagePath.includes("\\") ||
    storagePath.split("/").length !== 2
  ) {
    throw new Error("Invalid receipt upload path.");
  }

  if (!ALLOWED_RECEIPT_TYPES.has(contentType)) {
    throw new Error("Unsupported receipt file type.");
  }

  if (
    !Number.isSafeInteger(fileSize) ||
    fileSize <= 0 ||
    fileSize > MAX_RECEIPT_SIZE
  ) {
    throw new Error("Invalid receipt file size.");
  }

  const filename = storagePath.split("/").pop();

  if (!filename) {
    throw new Error("Invalid receipt file path.");
  }

  const expectedExtension = `.${RECEIPT_EXTENSIONS[contentType]}`;

  if (!filename.toLowerCase().endsWith(expectedExtension)) {
    throw new Error("Receipt file type does not match its upload path.");
  }

  const { data: objects, error: listError } = await supabase.storage
    .from(RECEIPT_BUCKET)
    .list(booking.id, {
      search: filename,
      limit: 100,
    });

  if (listError) {
    throwDatabaseError("Receipt object lookup failed", listError);
  }

  const uploadedObject = objects?.find(
    (object) => object.name === filename,
  );

  if (!uploadedObject) {
    throw new Error(
      "The uploaded receipt was not found. Please upload it again.",
    );
  }

  const actualSize = uploadedObject.metadata?.size;

  if (
    actualSize != null &&
    Number(actualSize) !== fileSize
  ) {
    throw new Error("Uploaded receipt size does not match.");
  }

  const { data: existing, error: existingError } = await supabase
    .from("hotel_payment_receipts")
    .select("id, booking_id, storage_path")
    .eq("storage_path", storagePath)
    .maybeSingle();

  if (existingError) {
    throwDatabaseError("Receipt record lookup failed", existingError);
  }

  if (existing) {
    if (existing.booking_id !== booking.id) {
      throw new Error(
        "This receipt is already associated with another booking.",
      );
    }

    await markBookingPaymentSubmitted(booking.id);

    return {
      receipt_id: existing.id,
      booking_id: booking.id,
      payment_status: "submitted",
      already_recorded: true,
      message: "Receipt already recorded and booking status updated.",
    };
  }

  const { data: receipt, error: insertError } = await supabase
    .from("hotel_payment_receipts")
    .insert({
      booking_id: booking.id,
      storage_path: storagePath,
      original_filename: originalFilename || filename,
      content_type: contentType,
      file_size_bytes: fileSize,
    })
    .select("id")
    .single();

  if (insertError) {
    throwDatabaseError("Receipt metadata insert failed", insertError);
  }

  await markBookingPaymentSubmitted(booking.id);

  console.info("Receipt recorded and booking status updated", {
    booking_id: booking.id,
    booking_reference: booking.booking_reference,
    receipt_id: receipt.id,
  });

  return {
    receipt_id: receipt.id,
    booking_id: booking.id,
    payment_status: "submitted",
    already_recorded: false,
    message:
      "Receipt recorded successfully. Payment is awaiting verification.",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return response({ error: "Method not allowed." }, 405);
  }

  try {
    let body: Record<string, unknown>;

    try {
      const parsedBody: unknown = await req.json();

      if (
        !parsedBody ||
        typeof parsedBody !== "object" ||
        Array.isArray(parsedBody)
      ) {
        return response(
          { error: "Request body must be a JSON object." },
          400,
        );
      }

      body = parsedBody as Record<string, unknown>;
    } catch {
      return response({ error: "Invalid JSON request body." }, 400);
    }

    // Receipt upload preparation.
    if (body.action === "prepare_receipt_upload") {
      try {
        return response(await prepareReceiptUpload(body), 200);
      } catch (error) {
        console.error(
          "prepare_receipt_upload failed:",
          error instanceof Error ? error.message : String(error),
        );

        return response(
          {
            error: error instanceof Error
              ? error.message
              : "Unable to prepare receipt upload.",
          },
          400,
        );
      }
    }

    // Receipt metadata recording and payment-status update.
    if (body.action === "record_receipt_upload") {
      try {
        return response(await recordReceiptUpload(body), 200);
      } catch (error) {
        const message = error instanceof Error
          ? error.message
          : String(error);

        console.error("record_receipt_upload failed:", message);

        const isDatabaseError =
          message.includes("code=") ||
          message.includes("database") ||
          message.includes("lookup failed") ||
          message.includes("insert failed") ||
          message.includes("update failed");

        return response(
          {
            error: isDatabaseError
              ? "The receipt may have been uploaded, but the booking could not be fully updated. Please retry the submission before uploading another file."
              : message,
            details: isDatabaseError ? message : undefined,
          },
          isDatabaseError ? 500 : 400,
        );
      }
    }

    // Existing hotel booking creation flow.
    const guestName =
      typeof body.guest_name === "string"
        ? body.guest_name.trim()
        : "";

    const guestEmail =
      typeof body.guest_email === "string"
        ? body.guest_email.trim().toLowerCase()
        : "";

    const guestPhone =
      typeof body.guest_phone === "string"
        ? body.guest_phone.trim()
        : "";

    const hotelId = body.hotel_id;
    const roomId = body.room_id;
    const checkIn = body.check_in;
    const checkOut = body.check_out;
    const guestCount = body.guest_count;
    const roomCount = body.room_count;

    const guestNotes =
      typeof body.guest_notes === "string"
        ? body.guest_notes.trim()
        : "";

    if (
      !guestName ||
      guestName.length > 150 ||
      !validEmail(guestEmail) ||
      guestEmail.length > 254 ||
      !guestPhone ||
      guestPhone.length > 40
    ) {
      return response(
        { error: "Enter a valid name, email address, and phone number." },
        400,
      );
    }

    if (
      typeof hotelId !== "string" ||
      typeof roomId !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(hotelId) ||
      !/^[0-9a-f-]{36}$/i.test(roomId)
    ) {
      return response({ error: "Select a valid hotel and room." }, 400);
    }

    if (
      typeof checkIn !== "string" ||
      typeof checkOut !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(checkIn) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)
    ) {
      return response(
        { error: "Enter valid check-in and check-out dates." },
        400,
      );
    }

    const checkInDate = new Date(`${checkIn}T00:00:00.000Z`);
    const checkOutDate = new Date(`${checkOut}T00:00:00.000Z`);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime()) ||
      checkInDate.toISOString().slice(0, 10) !== checkIn ||
      checkOutDate.toISOString().slice(0, 10) !== checkOut ||
      checkInDate < today ||
      checkOutDate <= checkInDate
    ) {
      return response(
        {
          error:
            "Check-in must be today or later, and check-out must be after check-in.",
        },
        400,
      );
    }

    if (
      !Number.isSafeInteger(guestCount) ||
      (guestCount as number) < 1 ||
      (guestCount as number) > 100 ||
      !Number.isSafeInteger(roomCount) ||
      (roomCount as number) < 1 ||
      (roomCount as number) > 20
    ) {
      return response({ error: "Check guest and room quantities." }, 400);
    }

    if (guestNotes.length > 2000) {
      return response({ error: "Guest notes are too long." }, 400);
    }

    const numberOfNights = Math.round(
      (checkOutDate.getTime() - checkInDate.getTime()) /
        (24 * 60 * 60 * 1000),
    );

    const { data: hotel, error: hotelError } = await supabase
      .from("hotel_listings")
      .select("id, name, is_published, slug")
      .eq("id", hotelId)
      .maybeSingle();

    if (hotelError) {
      throwDatabaseError("Hotel lookup failed", hotelError);
    }

    if (
      !hotel ||
      (!hotel.is_published &&
        !(testMode && hotel.slug === "amano-test-hotel-do-not-book"))
    ) {
      return response(
        { error: "This hotel is not available for booking." },
        404,
      );
    }

    const { data: room, error: roomError } = await supabase
      .from("hotel_rooms")
      .select(
        "id, hotel_id, room_name, price_per_night, max_guests, total_rooms",
      )
      .eq("id", roomId)
      .eq("hotel_id", hotelId)
      .eq("is_available", true)
      .maybeSingle();

    if (roomError) {
      throwDatabaseError("Room lookup failed", roomError);
    }

    if (!room) {
      return response({ error: "This room type is not available." }, 404);
    }

    const totalRooms = Number(room.total_rooms);
    const maxGuests = Number(room.max_guests);

    if (
      !Number.isSafeInteger(totalRooms) ||
      totalRooms < 1 ||
      !Number.isSafeInteger(maxGuests) ||
      maxGuests < 1
    ) {
      return response(
        { error: "This room is not configured for booking." },
        409,
      );
    }

    if ((guestCount as number) > maxGuests * (roomCount as number)) {
      return response(
        {
          error: `This room type accommodates up to ${maxGuests} guest(s) per room.`,
        },
        400,
      );
    }

    if ((roomCount as number) > totalRooms) {
      return response(
        {
          error:
            "The requested number of rooms exceeds this room type's inventory.",
        },
        400,
      );
    }

    const pricePerNight = Number(room.price_per_night);

    if (!Number.isFinite(pricePerNight) || pricePerNight <= 0) {
      return response(
        { error: "This room's price is not configured correctly." },
        409,
      );
    }

    // Preliminary availability check; not atomic.
    const { data: overlappingBookings, error: inventoryError } =
      await supabase
        .from("hotel_bookings")
        .select("room_count")
        .eq("room_id", roomId)
        .eq("payment_status", "verified")
        .lt("check_in", checkOut)
        .gt("check_out", checkIn)
        .not("booking_status", "in", '("rejected","cancelled")');

    if (inventoryError) {
      throwDatabaseError("Inventory lookup failed", inventoryError);
    }

    const roomsInUse = (overlappingBookings ?? []).reduce(
      (total, booking) => total + Number(booking.room_count || 0),
      0,
    );

    const availableRooms = Math.max(0, totalRooms - roomsInUse);

    if ((roomCount as number) > availableRooms) {
      return response(
        {
          error:
            "There are not enough rooms currently available for those dates.",
          available_rooms: availableRooms,
        },
        409,
      );
    }

    const priceKobo = Math.round(pricePerNight * 100);
    const totalKobo =
      priceKobo * numberOfNights * (roomCount as number);

    if (
      !Number.isSafeInteger(priceKobo) ||
      !Number.isSafeInteger(totalKobo) ||
      totalKobo <= 0
    ) {
      return response(
        { error: "Unable to calculate the booking total." },
        400,
      );
    }

    const { data: bank, error: bankError } = await supabase
      .from("hotel_bank_settings")
      .select(
        "bank_name, account_name, account_number, transfer_instructions",
      )
      .eq("is_active", true)
      .maybeSingle();

    if (bankError) {
      throwDatabaseError("Bank settings lookup failed", bankError);
    }

    if (!bank && !testMode) {
      return response(
        {
          error:
            "Bank-transfer payments are not configured yet. Please try again later.",
        },
        503,
      );
    }

    const dateStamp = new Date()
      .toISOString()
      .slice(0, 10)
      .replaceAll("-", "");

    const randomPart = crypto.randomUUID()
      .replaceAll("-", "")
      .slice(0, 10)
      .toUpperCase();

    const bookingReference = `AMH-${dateStamp}-${randomPart}`;

    const { data: booking, error: insertError } = await supabase
      .from("hotel_bookings")
      .insert({
        booking_reference: bookingReference,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        hotel_id: hotelId,
        room_id: roomId,
        check_in: checkIn,
        check_out: checkOut,
        guest_count: guestCount,
        room_count: roomCount,
        room_price_per_night: priceKobo / 100,
        number_of_nights: numberOfNights,
        total_amount: totalKobo / 100,
        booking_status: "pending",
        payment_status: "pending",
        guest_notes: guestNotes || null,
      })
      .select(
        "id, booking_reference, guest_name, guest_email, hotel_id, room_id, check_in, check_out, guest_count, room_count, room_price_per_night, number_of_nights, total_amount, booking_status, payment_status",
      )
      .single();

    if (insertError) {
      throwDatabaseError("Booking insert failed", insertError);
    }

    console.info("Hotel booking created successfully", {
      booking_reference: booking.booking_reference,
      test_mode: testMode,
    });

    // Notify the administrator only after the booking is saved.
    const adminEmailSent = await sendAdminBookingAlert({
      bookingReference: booking.booking_reference,
      guestName,
      guestEmail,
      guestPhone,
      hotelName: hotel.name,
      roomName: room.room_name,
      checkIn,
      checkOut,
      guestCount: guestCount as number,
      roomCount: roomCount as number,
      numberOfNights,
      totalAmount: totalKobo / 100,
      testMode,
    });

    console.info("Admin booking notification result", {
      booking_reference: booking.booking_reference,
      email_sent: adminEmailSent,
    });

    return response(
      {
        message: testMode
          ? "TEST MODE: Booking creation was successful. No payment has been made."
          : "Booking request created. Complete your bank transfer and submit your receipt for verification.",
        booking,
        hotel_name: hotel.name,
        room_name: room.room_name,
        admin_notification_sent: adminEmailSent,
        ...(bank
          ? {
              bank_transfer: {
                bank_name: bank.bank_name,
                account_name: bank.account_name,
                account_number: bank.account_number,
                transfer_instructions: bank.transfer_instructions,
              },
            }
          : {}),
        payment_note: testMode
          ? "Testing only. This is not a real reservation or payment confirmation."
          : "Your room is not reserved yet. Payment and availability must be verified by AMANO before your booking can be confirmed.",
      },
      201,
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("create-hotel-booking failed:", error.message);
      console.error("Error stack:", error.stack ?? "No stack available");
    } else {
      console.error("create-hotel-booking failed:", String(error));
    }

    return response(
      {
        error:
          "Unable to create your booking right now. Please try again later.",
      },
      500,
    );
  }
});
