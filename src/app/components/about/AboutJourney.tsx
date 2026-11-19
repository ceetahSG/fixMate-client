const steps = [
  {
    step: "01",
    title: "Choose an approved service",
    description:
      "Compare service details and choose a suitable repair professional.",
  },
  {
    step: "02",
    title: "Submit your repair details",
    description: "Share your preferred date, address, and device problem.",
  },
  {
    step: "03",
    title: "Track technician progress",
    description: "See when the request is accepted, started, and completed.",
  },
  {
    step: "04",
    title: "Pay after completion",
    description: "Review the final amount and pay only when the job is done.",
  },
];

export default function AboutJourney() {
  return (
    <section className="bg-[#edf3f0] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#176b63]">
            THE REPAIR JOURNEY
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-[34px]">
            Four steps. No guesswork.
          </h2>
        </div>

        {/* 4 Steps Columns */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-slate-300/60">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className={`${
                index === 0
                  ? "lg:pr-8"
                  : index === steps.length - 1
                  ? "lg:pl-8"
                  : "lg:px-8"
              } flex flex-col justify-start`}
            >
              <span className="text-xs font-semibold text-[#176b63]">
                {item.step}
              </span>
              <h3 className="mt-6 text-base font-semibold text-slate-900 sm:mt-8">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
