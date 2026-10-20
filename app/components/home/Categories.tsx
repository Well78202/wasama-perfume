import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Category } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getMessages, type Locale } from "@/lib/translations";

type CategoriesProps = {
  locale: Locale;
};

type CategoryCard = {
  id: string;
  title: string;
  description: string;
  slug: string;
  href: string;
  image: string;
};

export default async function Categories({ locale }: CategoriesProps) {
  const t = getMessages(locale).Categories;

  const isArabic = locale === "ar";
  const prefix = isArabic ? "" : "/en";
  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight;

  const dbCategories: Category[] = await prisma.category.findMany({
    where: {
      isActive: true,
      slug: {
        in: ["men", "women", "oriental"],
      },
    },
  });

  const categoryOrder = ["men", "women", "oriental"];

  const categories: CategoryCard[] = dbCategories
    .sort((a: Category, b: Category) => categoryOrder.indexOf(a.slug) - categoryOrder.indexOf(b.slug))
    .map((category: Category) => {
      const title = isArabic ? category.nameAr : category.nameEn;

      const description = isArabic ? category.descriptionAr : category.descriptionEn;

      const href = `${prefix}/categories/${category.slug}`;

      return {
        id: category.id,
        title,
        description: description ?? "",
        slug: category.slug,
        href,
        image: category.image ?? "/images/categories/placeholder.jpg",
      };
    });

  return (
    <section className="bg-[#fffaf3] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-360 px-5 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[#a66d36]">{t.eyebrow}</p>

          <h2 className="text-3xl font-extrabold text-[#171717] sm:text-4xl lg:text-5xl">{t.title}</h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-neutral-600">{t.description}</p>
        </div>

        {/* Categories */}
        <div className="grid gap-5 md:grid-cols-3">
          {categories.map((category: CategoryCard, index: number) => (
            <Link
              key={category.id}
              href={category.href}
              className="
                  group relative
                  h-107.5
                  overflow-hidden
                  bg-[#171717]
                  sm:h-120
                  lg:h-130
                "
            >
              {/* Image */}
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
              />

              {/* Overlay */}
              <div
                className="
                    absolute inset-0
                    bg-linear-to-t
                    from-black/90
                    via-black/25
                    to-black/5
                    transition-all
                    duration-500
                    group-hover:from-black/95
                  "
              />

              {/* Gold Border */}
              <div
                className="
                    pointer-events-none
                    absolute inset-3
                    border
                    border-transparent
                    transition-all
                    duration-500
                    group-hover:inset-4
                    group-hover:border-[#d5a86e]/60
                  "
              />

              {/* Number */}
              <span
                className="
                    absolute inset-e-5 top-5
                    text-xs font-medium
                    tracking-[0.2em]
                    text-white/60
                  "
              >
                0{index + 1}
              </span>

              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 lg:p-8">
                <h3 className="text-2xl font-bold text-white lg:text-3xl">{category.title}</h3>

                <p className="mt-2 max-w-[320px] text-sm leading-6 text-white/65">{category.description}</p>

                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[#e1b77f]">
                  <span>{t.explore}</span>

                  <ArrowIcon
                    size={17}
                    className={`transition-transform duration-300 ${
                      isArabic ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
