export default function AboutHero() {
  return (
    <section className="bg-[#173b38] py-16 text-white sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          {/* Eyebrow */}
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#78c8bc]">
            ABOUT FIXMATE
          </p>

          {/* Heading */}
          <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[46px] lg:leading-[1.15]">
            Better repairs begin with a <br className="hidden sm:inline" />
            clearer process.
          </h1>

          {/* Subtitle */}
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            FixMate brings customers and repair professionals together in one
            transparent service experience.
          </p>
        </div>
      </div>
    </section>
  );
}
