import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { HERO_BOTANICAL_IMAGE } from '../data/initialData';
import { translations } from '../i18n/translations';
import { Language } from '../types';
import { AmbientAurora } from './AmbientAurora';
import { BotanicalSprig, WaxSealHeart } from './BotanicalOrnaments';
import { ResilientImage } from './ResilientImage';

interface WelcomePageProps {
  recipientName: string;
  language: Language;
  onEnterWorld: () => void;
  onNeedHug: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  recipientName,
  language,
  onEnterWorld,
  onNeedHug,
}) => {
  const t = translations[language];

  return (
    <div className="min-h-screen w-full bg-transparent text-[#51434A] flex flex-col justify-between relative overflow-hidden animate-page-enter">
      <AmbientAurora mode="gate" />

      {/* Top Bar Contract: 3 zones */}
      <header className="relative z-10 w-full rose-glass-chrome border-b border-white/65">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-8 px-5 sm:px-8 py-5">
          <span className="font-serif-editorial text-xl sm:text-2xl font-normal tracking-tight text-[#51434A] whitespace-nowrap shrink-0">
            {t.brandName}
          </span>

          <div className="hidden md:flex items-center gap-6 text-xs tracking-wide text-[#7D6B74]">
            <span className="whitespace-nowrap shrink-0">
              {t.home.forRecipient(recipientName)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap shrink-0">
              {t.secondaryTagline}
            </span>
          </div>

          <button
            onClick={onNeedHug}
            className="min-h-[44px] px-4 py-2 rounded-full border border-[#E8A2B5]/70 bg-white/75 backdrop-blur-md text-xs font-medium text-[#51434A] hover:bg-[#F4DDE3]/55 active:scale-[0.98] transition-all duration-150 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
          >
            <Heart className="w-3.5 h-3.5 text-[#C97A92] fill-[#F4DDE3]" />
            <span>{t.common.needAHug}</span>
          </button>
        </div>
      </header>

      {/* Main Editorial Centerpiece */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-5 sm:px-8 py-10 md:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Emotional Editorial Typography & Primary Call-to-Action */}
        <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
          <div className="flex flex-col items-center lg:items-start gap-3">
            <BotanicalSprig className="w-32 h-7" />
            <div className="inline-flex items-center gap-2 text-xs tracking-wide text-[#7D6B74]">
              <span>{t.personalEdition}</span>
              <span aria-hidden="true">·</span>
              <span>{t.home.forRecipient(recipientName)}</span>
              <span aria-hidden="true">·</span>
              <span>{t.tagline}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[3.65rem] font-normal text-[#51434A] tracking-tight leading-[1.12]">
              {language === 'fr'
                ? `Bonjour, ${recipientName} ♡`
                : `Hello, ${recipientName} ♡`}
            </h1>

            <p className="font-serif-editorial italic text-xl sm:text-2xl lg:text-[1.65rem] text-[#51434A]/90 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              “{t.welcomeSubtext}”
            </p>
          </div>

          <p className="text-base sm:text-[17px] text-[#7D6B74] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {t.welcomeBody}
          </p>

          {/* Premium Editorial Call-To-Action */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
            <button
              onClick={onEnterWorld}
              className="group w-full sm:w-auto min-h-[52px] px-9 py-4 rounded-2xl bg-[#51434A] text-[#FFF9F6] text-base font-medium hover:bg-[#3E3238] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3.5 shadow-md shadow-[#51434A]/10 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{t.enterWorldBtn}</span>
              <ArrowRight className="w-4 h-4 text-[#E8A2B5] group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <div className="flex items-center gap-2.5 text-xs text-[#7D6B74]">
              <WaxSealHeart className="w-8 h-8 shrink-0" />
              <span className="font-serif-editorial italic text-sm text-[#51434A]/85">
                {t.secondaryTagline}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Fine-Art Framed Botanical Heart Print */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md rounded-[2rem] rose-glass-cream rose-glass-sheen p-3 sm:p-4">
            <div className="rounded-[1.5rem] editorial-stationary rose-glass-sheen p-4 sm:p-6">
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#FFF9F6] border border-[#F3E9DD]">
                <ResilientImage
                  src={HERO_BOTANICAL_IMAGE}
                  alt="Fine art watercolor botanical peony and heart illustration on warm cotton paper"
                  className="w-full h-full object-cover animate-float-slow"
                  fallbackTitle="Her Little Heart · Botanical Edition"
                  priority
                />
              </div>
              <div className="pt-5 mt-2 flex items-center justify-between text-xs text-[#7D6B74] border-t border-[#EAE0D8]/80">
                <span className="font-serif-editorial italic text-sm text-[#51434A]">
                  {t.exLibris} · {recipientName}
                </span>
                <span>{t.thirdYearMedicine}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Discreet Creator Credit Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-5 sm:px-8 py-6 border-t border-[#EAE0D8]/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7D6B74]">
        <p className="font-serif-editorial italic text-sm text-[#51434A]">
          {t.creatorCredit}
        </p>
        <p>
          {t.brandName} · {t.privateSanctuaryEdition}
        </p>
      </footer>
    </div>
  );
};
