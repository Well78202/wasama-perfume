import {
  BadgeCheck,
  Headphones,
  PackageCheck,
  Sparkles,
} from "lucide-react";

import {
  getMessages,
  type Locale,
} from "@/lib/translations";

type FeaturesProps = {
  locale: Locale;
};

export default function Features({
  locale,
}: FeaturesProps) {
  const t = getMessages(locale).Features;

  const features = [
    {
      icon: BadgeCheck,
      title: t.qualityTitle,
      description: t.qualityDescription,
      number: "01",
    },
    {
      icon: Sparkles,
      title: t.selectionTitle,
      description: t.selectionDescription,
      number: "02",
    },
    {
      icon: PackageCheck,
      title: t.deliveryTitle,
      description: t.deliveryDescription,
      number: "03",
    },
    {
      icon: Headphones,
      title: t.supportTitle,
      description: t.supportDescription,
      number: "04",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#171411] py-20 text-white sm:py-24 lg:py-28">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -start-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#b8844f]/10 blur-[100px]" />

      <div className="pointer-events-none absolute -end-32 top-0 h-80 w-80 rounded-full bg-[#d5a86e]/8 blur-[100px]" />

      <div className="relative mx-auto max-w-360 px-5 lg:px-8">
        {/* Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#d5a86e]" />

            <p className="text-xs font-bold tracking-[0.2em] text-[#d5a86e]">
              {t.eyebrow}
            </p>

            <span className="h-px w-8 bg-[#d5a86e]" />
          </div>

          <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            {t.title}
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-white/60">
            {t.description}
          </p>
        </div>

        {/* Features */}
        <div className="grid border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.number}
                className="
                  group relative
                  min-h-70
                  border-b border-white/10
                  p-7
                  transition-colors duration-500
                  hover:bg-white/[0.04]
                  sm:p-8
                  lg:border-b-0
                  lg:border-e
                  lg:last:border-e-0
                "
              >
                {/* Number */}
                <span className="absolute end-6 top-6 text-xs font-medium tracking-[0.2em] text-white/20">
                  {feature.number}
                </span>

                {/* Icon */}
                <div
                  className="
                    mb-8 flex h-14 w-14
                    items-center justify-center
                    border border-[#d5a86e]/30
                    bg-[#d5a86e]/5
                    text-[#d5a86e]
                    transition-all duration-500
                    group-hover:border-[#d5a86e]
                    group-hover:bg-[#d5a86e]
                    group-hover:text-[#171411]
                  "
                >
                  <Icon
                    size={25}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Text */}
                <h3 className="text-lg font-bold sm:text-xl">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/55">
                  {feature.description}
                </p>

                {/* Gold Line */}
                <div className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-[#d5a86e] transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}