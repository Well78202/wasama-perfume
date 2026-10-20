import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  getMessages,
  type Locale,
} from "@/lib/translations";

type FooterProps = {
  locale: Locale;
};

function InstagramIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function FacebookIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M13.5 21v-8h2.8l.4-3h-3.2V8.1c0-.9.3-1.6 1.7-1.6H17V3.8c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v3h3v8h3.5Z" />
    </svg>
  );
}

export default function Footer({
  locale,
}: FooterProps) {
  const t = getMessages(locale).Footer;

  const isArabic = locale === "ar";
  const prefix = isArabic ? "" : "/en";

  const shopLinks = [
    {
      name: t.allProducts,
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
      name: t.offers,
      href: `${prefix}/offers`,
    },
  ];

  const companyLinks = [
    {
      name: t.about,
      href: `${prefix}/about`,
    },
    {
      name: t.contact,
      href: `${prefix}/contact`,
    },
    {
      name: t.shipping,
      href: `${prefix}/shipping`,
    },
    {
      name: t.returns,
      href: `${prefix}/returns`,
    },
  ];

  const legalLinks = [
    {
      name: t.privacy,
      href: `${prefix}/privacy-policy`,
    },
    {
      name: t.terms,
      href: `${prefix}/terms`,
    },
  ];

  return (
    <footer className="bg-[#11100e] text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-360 px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
        <div
          className="
            grid gap-12
            sm:grid-cols-2
            lg:grid-cols-12
            lg:gap-8
          "
        >
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              href={isArabic ? "/" : "/en"}
              aria-label={
                isArabic
                  ? "وسامة برفيوم - الرئيسية"
                  : "Wasama Perfume - Home"
              }
              className="inline-block"
            >
              <div className="relative h-20 w-40 overflow-hidden bg-[#fffaf3]">
                <Image
                  src="/images/logo.jpeg"
                  alt={
                    isArabic
                      ? "وسامة برفيوم"
                      : "Wasama Perfume"
                  }
                  fill
                  sizes="160px"
                  className="object-contain p-2"
                />
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
              {t.description}
            </p>

            {/* Social */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://instagram.com/wasamaperfume?obrf=MThiMGF5b3I4Z2VqZg%3D%3D"
                aria-label="Instagram"
                className="
                  flex h-10 w-10
                  items-center justify-center
                  border border-white/15
                  text-white/70
                  transition-all duration-300
                  hover:border-[#d5a86e]
                  hover:bg-[#d5a86e]
                  hover:text-[#171411]
                "
              >
                <InstagramIcon className="h-4.5 w-4.5" />
              </a>

              <a
                href="https://www.facebook.com/share/1GZvWgDfTm/"
                aria-label="Facebook"
                className="
                  flex h-10 w-10
                  items-center justify-center
                  border border-white/15
                  text-white/70
                  transition-all duration-300
                  hover:border-[#d5a86e]
                  hover:bg-[#d5a86e]
                  hover:text-[#171411]
                "
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-[#d5a86e]">
              {t.shop}
            </h3>

            <ul className="mt-6 space-y-4">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="
                      text-sm text-white/55
                      transition-colors
                      hover:text-[#d5a86e]
                    "
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-[#d5a86e]">
              {t.help}
            </h3>

            <ul className="mt-6 space-y-4">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="
                      text-sm text-white/55
                      transition-colors
                      hover:text-[#d5a86e]
                    "
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="text-sm font-bold text-[#d5a86e]">
              {t.contactTitle}
            </h3>

            <div className="mt-6 space-y-5">
              <a
                href="tel:+201204791050"
                className="
                  flex items-start gap-3
                  text-sm text-white/55
                  transition-colors
                  hover:text-white
                "
              >
                <Phone
                  size={18}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-[#d5a86e]"
                />

                <span dir="ltr">
                  +201204791050
                </span>
              </a>

              <a
                href="mailto:info@wasamaperfume.com"
                className="
                  flex items-start gap-3
                  text-sm text-white/55
                  transition-colors
                  hover:text-white
                "
              >
                <Mail
                  size={18}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-[#d5a86e]"
                />

                <span>
                  info@wasamaperfume.com
                </span>
              </a>

              <div className="flex items-start gap-3 text-sm leading-7 text-white/55">
                <MapPin
                  size={18}
                  strokeWidth={1.5}
                  className="mt-1 shrink-0 text-[#d5a86e]"
                />

                <span>{t.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div
          className="
            mx-auto flex max-w-360
            flex-col gap-5
            px-5 py-6
            text-xs text-white/40
            sm:flex-row
            sm:items-center
            sm:justify-between
            lg:px-8
          "
        >
          <p>
            © {new Date().getFullYear()} {t.copyright}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[#d5a86e]"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}