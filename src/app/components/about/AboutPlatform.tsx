export default function AboutPlatform() {
  return (
    <section className="bg-[#f7f8f5] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-16">
          {/* Left Column */}
          <div className="lg:col-span-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#de7a49]">
              01 &mdash; THE PLATFORM
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-[1.2]">
              One place to find, request, track, <br className="hidden sm:inline" />
              and pay for repair work.
            </h2>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-6 lg:pt-8">
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Customers can explore approved services, choose a suitable
              technician, and describe their problem before the appointment.
              Technicians manage their own listings and job progress, while
              administrators keep the marketplace organized and trustworthy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
