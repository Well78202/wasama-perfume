
import Image from "next/image";
import Link from "next/link";

import MobileMenu from "@/app/components/layout/MobileMenu";
import LanguageSwitcher from "@/app/components/layout/LanguageSwitcher";
import WishlistHeaderButton from "@/app/components/layout/WishlistHeaderButton";
import CartHeaderButton from "@/app/components/cart/CartHeaderButton";

import { getMessages, type Locale } from "@/lib/translations";

type HeaderProps = {
  locale: Locale;
};

export default function Header({ locale }: HeaderProps) {
  const t = getMessages(locale).Header;

  const isArabic = locale === "ar";
  const prefix = isArabic ? "" : "/en";

  const navigation = [
    {
      name: t.home,
      href: isArabic ? "/" : "/en",
    },
    {
      name: t.products,
      href: `${prefix}/products`,
    },
    {
      name: t.men,
      href: `${prefix}/categories/men`,
    },
    {
      name: t.women,
      href: `${prefix}/categories/women`,
    },
    {
      name: t.oriental,
      href: `${prefix}/categories/oriental`,
    },
    {
      name: t.brands,
      href: `${prefix}/brands`,
    },
    {
      name: t.offers,
      href: `${prefix}/offers`,
    },
  ];

  return (
    <header className="relative z-50 w-full bg-[#fffaf3]">
      <div className="border-b border-black/10">
        <div
          className="
            mx-auto
            flex h-[72px] w-full
            max-w-[1440px]
            items-center
            justify-between
            gap-2
            px-3
            sm:h-[78px]
            sm:gap-4
            sm:px-5
            lg:h-[82px]
            lg:px-8
          "
        >
          {/* MOBILE MENU */}
          <div className="flex shrink-0 items-center lg:hidden">
            <MobileMenu
              navigation={navigation}
              isArabic={isArabic}
            />
          </div>

          {/* LOGO */}
          <Link
            href={isArabic ? "/" : "/en"}
            aria-label={
              isArabic
                ? "وسامة برفيوم - الرئيسية"
                : "Wasama Perfume - Home"
            }
            className="
              relative
              block
              min-w-0
              shrink
              lg:shrink-0
            "
          >
            <Image
              src="/images/logo.jpeg"
              alt={
                isArabic
                  ? "وسامة برفيوم"
                  : "Wasama Perfume"
              }
              width={180}
              height={70}
              priority
              className="
                h-auto
                w-[82px]
                max-w-full
                object-contain
                min-[380px]:w-[95px]
                sm:w-[110px]
                lg:w-[120px]
              "
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            aria-label={
              isArabic
                ? "القائمة الرئيسية"
                : "Main navigation"
            }
            className="
              hidden
              min-w-0
              flex-1
              items-center
              justify-center
              lg:flex
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                gap-4
                xl:gap-8
                2xl:gap-9
              "
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    relative
                    whitespace-nowrap
                    py-2
                    text-[13px]
                    font-semibold
                    text-[#171717]
                    transition-colors
                    duration-300
                    hover:text-[#9b6938]
                    xl:text-sm

                    after:absolute
                    after:bottom-0
                    after:start-0
                    after:h-px
                    after:w-0
                    after:bg-[#a66d36]
                    after:transition-all
                    after:duration-300

                    hover:after:w-full
                  "
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* ACTIONS */}
          <div
            className="
              flex
              shrink-0
              items-center
              justify-end
              gap-0.5
              min-[380px]:gap-1
              sm:gap-2
              lg:gap-3
            "
          >
            {/* LANGUAGE */}
            <div className="flex shrink-0 items-center">
              <LanguageSwitcher locale={locale} />
            </div>

            {/* WISHLIST */}
            <div className="flex shrink-0 items-center">
              <WishlistHeaderButton locale={locale} />
            </div>

            {/* CART WITH LIVE COUNTER */}
            <div className="flex shrink-0 items-center">
              <CartHeaderButton locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
