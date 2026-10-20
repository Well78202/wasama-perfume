
import { ArrowUpLeft, ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import type { Locale } from "@/lib/translations";

type ContactProps = {
  locale: Locale;
};

export default function Contact({ locale }: ContactProps) {
  const isArabic = locale === "ar";
  const ArrowIcon = isArabic ? ArrowUpLeft : ArrowUpRight;

  const phone = "01204791050";
  const whatsappMessage = encodeURIComponent(
    isArabic
      ? "أهلاً وسامة برفيوم، محتاج أستفسر عن العطور."
      : "Hello Wasama Perfume, I have a question about your fragrances."
  );

  const whatsappUrl = `https://wa.me/201204791050?text=${whatsappMessage}`;

  return (
    <section
      id="contact"
      dir={isArabic ? "rtl" : "ltr"}
      className="relative isolate w-full overflow-hidden bg-white text-[#191714]"
    >
      {/* Top separator */}
      <div className="mx-auto h-px max-w-7xl bg-[#eee8df]" />

      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        {/* Section label */}
        <div className="mb-12 flex items-center gap-3">
          <span className="h-px w-9 bg-[#b38a55]" />
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#a37d4d]">
            WASAMA PERFUME / CONTACT
          </span>
        </div>

        {/* Contact content */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {/* Text */}
          <div className="w-full min-w-0 lg:w-[55%]">
            <h2 className="m-0 text-[42px] font-extrabold leading-[1.35] tracking-tight text-[#191714] sm:text-[58px] lg:text-[72px]">
              {isArabic ? (
                <>
                  عطرك القادم
                  <span className="block text-[#b38a55]">
                    يبدأ من هنا.
                  </span>
                </>
              ) : (
                <>
                  Your next fragrance
                  <span className="block text-[#b38a55]">
                    starts here.
                  </span>
                </>
              )}
            </h2>

            <p className="mt-7 max-w-lg text-[15px] leading-8 text-[#77716b] sm:text-base">
              {isArabic
                ? "بتدور على عطر يعبّر عنك؟ محتاج ترشيح، أو عندك استفسار عن طلبك أو أسعار الجملة؟ فريق وسامة جاهز يساعدك تختار بثقة."
                : "Looking for a fragrance that feels like you? Need a recommendation, order assistance, or wholesale pricing? We're here to help."}
            </p>
          </div>

          {/* Actions */}
          <div className="w-full min-w-0 lg:w-[38%]">
            <div className="border-t border-[#d9c9b3] pt-7">
              <p className="mb-6 text-sm font-semibold text-[#a37d4d]">
                {isArabic
                  ? "خلّينا نساعدك تختار"
                  : "LET US HELP YOU CHOOSE"}
              </p>

              <div className="flex flex-col gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-[64px] w-full items-center justify-between gap-4 bg-[#191714] px-6 py-4 text-white transition-colors duration-300 hover:bg-[#a37d4d]"
                >
                  <span className="flex items-center gap-3">
                    <MessageCircle size={21} strokeWidth={1.8} />
                    <span className="text-sm font-bold sm:text-base">
                      {isArabic
                        ? "تواصل معنا على واتساب"
                        : "Chat with us on WhatsApp"}
                    </span>
                  </span>

                  <ArrowIcon
                    size={21}
                    className="shrink-0 transition-transform duration-300 group-hover:-translate-y-1"
                  />
                </a>

                <a
                  href={`tel:+201204791050`}
                  className="flex min-h-[64px] w-full items-center justify-between gap-4 border border-[#ded6ca] bg-white px-6 py-4 text-[#191714] transition-colors duration-300 hover:border-[#b38a55] hover:bg-[#faf7f2]"
                >
                  <span className="flex items-center gap-3">
                    <Phone size={20} strokeWidth={1.8} />
                    <span className="text-sm font-bold sm:text-base">
                      {isArabic ? "اتصل بنا" : "Call us"}
                    </span>
                  </span>

                  <span dir="ltr" className="text-sm font-medium">
                    {phone}
                  </span>
                </a>
              </div>

              <p className="mt-5 text-xs leading-6 text-[#9a938b]">
                {isArabic
                  ? "للاستفسارات والطلبات ومبيعات الجملة والقطاعي"
                  : "For inquiries, orders, wholesale and retail"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final closing line */}
      <div className="border-t border-[#eee8df] bg-[#faf8f5]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-7 text-center sm:flex-row sm:px-8 lg:px-12">
          <span className="text-xs font-bold tracking-[0.2em] text-[#a37d4d]">
            WASAMA PERFUME
          </span>

          <span className="text-xs text-[#77716b]">
            {isArabic
              ? "لأن حضورك يستحق عطرًا لا يُنسى."
              : "Because your presence deserves an unforgettable scent."}
          </span>
        </div>
      </div>
    </section>
  );
}
