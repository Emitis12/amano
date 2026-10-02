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
            A Message from the Chairman, Planning Committee
          </h2>
        </div>

        {/* =========================================================
            MAIN CONTENT
        ========================================================= */}
        <div className="grid items-start gap-12 lg:grid-cols-[350px_1fr] lg:gap-16">

          {/* =======================================================
              CHAIRMAN IMAGE
          ======================================================= */}
        {/* <div className="relative">

            {/* Decorative Gold Corner */}
            <div className="absolute -bottom-4 -left-4 z-0 h-24 w-24 border-b-[4px] border-l-[4px] border-[#FFD21F]" /> */}

            {/* Image Container */}
           {/* <div className="relative z-10 overflow-hidden rounded-xl bg-[#002B5C] shadow-xl">
              <img
                src="/speaker53.png"
                alt="National Chairman of AMANO"
                className="h-[440px] w-full object-cover object-top"
              />
            </div> */}

            {/* Chairman Details */}
            {/* <div className="relative z-10 mt-5">
              <h3 className="text-xl font-bold text-[#002B5C]">
                Mr. Agassi Jonathan Peter
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-500">
                Chairman, AMANO Convention Planning Committee 
              </p>
            </div>
          </div> */}

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
              Welcome to Our AMANO National Convention 2026
            </h3>

            {/* Message */}
            <div className="space-y-5 text-[15px] leading-7 text-slate-600">

              <p>
                Dear AMANO Family,
              </p>

              <p>
                It gives me great pleasure to welcome you to the AMANO Stakeholders Engagement and Convention 2026, themed:

“From Policy to Practice: Executing Maritime Excellence through Professional Capability and Real-World Results.”
              </p>

              <p>
                This convention is more than a gathering; it is an opportunity for us, as professionals and stakeholders in the maritime sector, to connect, share knowledge, strengthen partnerships, and translate sound policies into measurable impact.
              </p>

              <p>
                As alumni of the Maritime Academy of Nigeria, Oron, we have a shared responsibility to uphold professional excellence, promote continuous development, and contribute meaningfully to the growth of Nigeria’s maritime industry.

I strongly encourage every AMANO member, stakeholder, and invited participant to register now and secure your place at this important convention. Your presence, experience, ideas, and professional network will help make AMANO 2026 a meaningful platform for collaboration and real-world results.
              </p>

              <p>
                Don’t just hear about it, be part of it. Register today, and let us shape the future of maritime excellence together.

I look forward to welcoming you to AMANO Convention 2026.
              </p>

            </div>

            {/* =====================================================
                SIGNATURE
            ===================================================== */}
            <div className="mt-9 border-t border-slate-200 pt-6">

              <p className="text-lg font-bold text-[#002B5C]">
                Mr. Agassi Jonathan Peter 
              </p>

              <p className="mt-1 text-sm text-slate-500">
                National Chairman
              </p>

              <p className="text-sm font-semibold text-[#002B5C]">
                AMANO Convention Planning Committee 
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