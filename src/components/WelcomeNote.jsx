const WelcomeNote = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-10">

        {/* =========================================================
            SECTION HEADER
        ========================================================= */}
        <div className="mb-12 lg:mb-14">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-[3px] w-8 rounded-full bg-[#FFD21F]" />
            <span className="h-[3px] w-3 rounded-full bg-[#FFD21F]" />
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#002B5C]">
            Chairman's Welcome
          </p>

          <h2 className="max-w-[650px] text-3xl font-extrabold leading-tight text-[#002B5C] sm:text-4xl lg:text-[42px]">
            A Message from the National Chairman
          </h2>
        </div>

        {/* =========================================================
            MAIN CONTENT
        ========================================================= */}
        <div className="grid items-start gap-12 lg:grid-cols-[350px_1fr] lg:gap-16">

          {/* =======================================================
              CHAIRMAN IMAGE
          ======================================================= */}
          <div className="relative">

            {/* Decorative Gold Corner */}
            <div className="absolute -bottom-4 -left-4 z-0 h-24 w-24 border-b-[4px] border-l-[4px] border-[#FFD21F]" />

            {/* Image Container */}
            <div className="relative z-10 overflow-hidden rounded-xl bg-[#002B5C] shadow-xl">
              <img
                src="/speaker53.png"
                alt="National Chairman of AMANO"
                className="h-[440px] w-full object-cover object-top"
              />
            </div>

            {/* Chairman Details */}
            <div className="relative z-10 mt-5">
              <h3 className="text-xl font-bold text-[#002B5C]">
                Vhairman
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-500">
                National Chairman, AMANO
              </p>
            </div>
          </div>

          {/* =======================================================
              WELCOME MESSAGE
          ======================================================= */}
          <div className="lg:pt-1">

            {/* Small Label */}
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#002B5C]">
                Welcome Note
              </span>

              <div className="mt-3 h-[2px] w-14 bg-[#FFD21F]" />
            </div>

            {/* Heading */}
            <h3 className="mb-7 max-w-[700px] text-2xl font-extrabold leading-tight text-[#002B5C] sm:text-3xl">
              Welcome to Our AMANO National Convention
            </h3>

            {/* Message */}
            <div className="space-y-5 text-[15px] leading-7 text-slate-600">

              <p>
                Dear AMANO Family,
              </p>

              <p>
                It gives me great pleasure to welcome you all to the
                AMANO National Convention. This gathering provides us
                with another valuable opportunity to come together,
                reconnect, and strengthen the bonds that unite us as
                alumni of the Maritime Academy of Nigeria, Oron.
              </p>

              <p>
                Our convention is more than a gathering. It is an
                opportunity to exchange ideas, build meaningful
                relationships, celebrate our shared heritage, and
                explore new ways of contributing to the growth and
                development of our association.
              </p>

              <p>
                I encourage every member to participate actively,
                connect with fellow alumni, engage in the conversations,
                and make the most of the opportunities that this
                convention presents.
              </p>

              <p>
                I look forward to welcoming you all to Lagos as we
                reconnect, network, build, and advance together.
              </p>

            </div>

            {/* =====================================================
                SIGNATURE
            ===================================================== */}
            <div className="mt-9 border-t border-slate-200 pt-6">

              <p className="text-lg font-bold text-[#002B5C]">
                Vhairman
              </p>

              <p className="mt-1 text-sm text-slate-500">
                National Chairman
              </p>

              <p className="text-sm font-semibold text-[#002B5C]">
                AMANO
              </p>

            </div>
          </div>
        </div>
      </div>

      {/* ===========================================================
          SUBTLE BACKGROUND DECORATION
      =========================================================== */}
      <div className="pointer-events-none absolute -right-24 top-20 hidden h-64 w-64 rounded-full border border-[#002B5C]/5 lg:block" />

      <div className="pointer-events-none absolute -right-16 top-28 hidden h-40 w-40 rounded-full border border-[#FFD21F]/20 lg:block" />

    </section>
  );
};

export default WelcomeNote;