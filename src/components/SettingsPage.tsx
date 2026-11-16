import React, { useEffect, useState } from 'react';
import {
  Check,
  Download,
  Globe,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sliders,
  Trash2,
} from 'lucide-react';
import { translations } from '../i18n/translations';
import { AppSettings, Language } from '../types';

interface SettingsPageProps {
  settings: AppSettings;
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onResetToSampleData: () => void;
  onClearAllData: () => void;
  onExportBackup: () => void;
  onLockSanctuary?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onResetToSampleData,
  onClearAllData,
  onExportBackup,
  onLockSanctuary,
}) => {
  const t = translations[settings.language];

  const [recipientDraft, setRecipientDraft] = useState(settings.recipientName);
  const [focusMinsDraft, setFocusMinsDraft] = useState(settings.focusMinutes);
  const [shortBreakDraft, setShortBreakDraft] = useState(
    settings.shortBreakMinutes
  );
  const [longBreakDraft, setLongBreakDraft] = useState(
    settings.longBreakMinutes
  );
  const [savedBanner, setSavedBanner] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<'reset' | 'clear' | null>(
    null
  );

  useEffect(() => {
    setRecipientDraft(settings.recipientName);
    setFocusMinsDraft(settings.focusMinutes);
    setShortBreakDraft(settings.shortBreakMinutes);
    setLongBreakDraft(settings.longBreakMinutes);
  }, [
    settings.recipientName,
    settings.focusMinutes,
    settings.shortBreakMinutes,
    settings.longBreakMinutes,
  ]);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      recipientName: recipientDraft.trim() || 'Rania',
      focusMinutes: Math.max(1, Math.min(120, Number(focusMinsDraft) || 25)),
      shortBreakMinutes: Math.max(
        1,
        Math.min(60, Number(shortBreakDraft) || 5)
      ),
      longBreakMinutes: Math.max(
        1,
        Math.min(90, Number(longBreakDraft) || 15)
      ),
    });
    setSavedBanner(t.settings.preferencesSavedBanner);
    setTimeout(() => setSavedBanner(null), 3500);
  };

  const handleLanguageChange = (lang: Language) => {
    onUpdateSettings({ language: lang });
    setSavedBanner(translations[lang].settings.languageUpdatedBanner);
    setTimeout(() => setSavedBanner(null), 3500);
  };

  return (
    <div className="space-y-10 pb-12 max-w-4xl animate-page-enter">
      {/* Header */}
      <section className="pb-6 border-b border-[#EAE0D8] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs text-[#7D6B74] mb-1">{t.settings.badge}</p>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#51434A]">
            {t.settings.title}
          </h1>
          <p className="text-sm text-[#7D6B74] mt-1">{t.settings.subtitle}</p>
        </div>

        {onLockSanctuary && (
          <button
            type="button"
            onClick={onLockSanctuary}
            className="min-h-[42px] px-4 py-2 rounded-xl border border-[#EAE0D8] bg-white hover:bg-[#FFF9F6] text-xs font-medium text-[#51434A] flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#C97A92]" />
            <span>{t.nav.lockSanctuary}</span>
          </button>
        )}
      </section>

      {savedBanner && (
        <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-medium text-[#14532D] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#15803D]" />
          <span>{savedBanner}</span>
        </div>
      )}

      {/* Privacy & Server-Side Protection Notice */}
      <section className="rounded-2xl bg-[#F3E9DD]/65 border border-[#EAE0D8] p-6 flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-[#C97A92] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#51434A] leading-relaxed">
          <h2 className="font-semibold text-sm">{t.settings.securityTitle}</h2>
          <p>{t.settings.securityBody}</p>
        </div>
      </section>

      {/* Localization / Language Selector */}
      <section className="rounded-2xl bg-white border border-[#EAE0D8] p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#C97A92]" />
          <h2 className="font-serif-editorial text-xl font-normal text-[#51434A]">
            {t.settings.languageHeading}
          </h2>
        </div>
        <p className="text-xs text-[#7D6B74]">{t.settings.languageSubtitle}</p>

        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`min-h-[44px] px-5 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              settings.language === 'en'
                ? 'bg-[#51434A] text-[#FFF9F6] border-[#51434A]'
                : 'bg-[#FFF9F6] text-[#51434A] border-[#EAE0D8] hover:border-[#E8A2B5]'
            }`}
          >
            {t.settings.englishBtn}
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('fr')}
            className={`min-h-[44px] px-5 py-2 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              settings.language === 'fr'
                ? 'bg-[#51434A] text-[#FFF9F6] border-[#51434A]'
                : 'bg-[#FFF9F6] text-[#51434A] border-[#EAE0D8] hover:border-[#E8A2B5]'
            }`}
          >
            {t.settings.frenchBtn}
          </button>
        </div>
      </section>

      {/* General & Pomodoro Timer Preferences */}
      <form
        onSubmit={handleSavePreferences}
        className="rounded-2xl bg-white border border-[#EAE0D8] p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-[#EAE0D8]">
          <Sliders className="w-4 h-4 text-[#C97A92]" />
          <h2 className="font-serif-editorial text-xl font-normal text-[#51434A]">
            {t.settings.defaultsHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-[#51434A] mb-1.5">
              {t.settings.recipientNameLabel}
            </label>
            <input
              type="text"
              value={recipientDraft}
              onChange={(e) => setRecipientDraft(e.target.value)}
              className="w-full max-w-sm min-h-[44px] px-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-sm text-[#51434A]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#51434A] mb-1.5">
              {t.settings.focusDurationLabel}
            </label>
            <input
              type="number"
              min={1}
              max={120}
              value={focusMinsDraft}
              onChange={(e) => setFocusMinsDraft(Number(e.target.value))}
              className="w-full min-h-[44px] px-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] font-mono-tabular text-sm text-[#51434A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#51434A] mb-1.5">
              {t.settings.shortBreakLabel}
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={shortBreakDraft}
              onChange={(e) => setShortBreakDraft(Number(e.target.value))}
              className="w-full min-h-[44px] px-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] font-mono-tabular text-sm text-[#51434A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#51434A] mb-1.5">
              {t.settings.longBreakLabel}
            </label>
            <input
              type="number"
              min={1}
              max={90}
              value={longBreakDraft}
              onChange={(e) => setLongBreakDraft(Number(e.target.value))}
              className="w-full min-h-[44px] px-4 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] font-mono-tabular text-sm text-[#51434A]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#51434A] text-[#FFF9F6] text-xs font-medium hover:bg-[#3E3238] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{t.settings.savePreferencesBtn}</span>
          </button>
        </div>
      </form>

      {/* Data Backup & Reset Section */}
      <section className="rounded-2xl bg-white border border-[#EAE0D8] p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-serif-editorial text-xl font-normal text-[#51434A]">
            {t.settings.backupHeading}
          </h2>
          <p className="text-xs text-[#7D6B74] mt-1">
            {t.settings.backupSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onExportBackup}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-xs font-medium text-[#51434A] hover:bg-[#F3E9DD]/60 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#C97A92]" />
            <span>{t.settings.exportJsonBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmAction('reset')}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#EAE0D8] bg-[#FFF9F6] text-xs font-medium text-[#51434A] hover:bg-[#F3E9DD]/60 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#C97A92]" />
            <span>{t.settings.restoreSamplesBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmAction('clear')}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#FECACA] bg-[#FEF2F2] text-xs font-medium text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.settings.clearAllBtn}</span>
          </button>
        </div>

        {confirmAction && (
          <div className="p-4 rounded-xl bg-[#FFF9F6] border border-[#E8A2B5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs text-[#51434A]">
              {confirmAction === 'reset'
                ? t.settings.confirmResetMsg
                : t.settings.confirmClearMsg}
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="min-h-[38px] px-3.5 py-1.5 rounded-lg border border-[#EAE0D8] text-xs text-[#7D6B74]"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmAction === 'reset') {
                    onResetToSampleData();
                    setSavedBanner(t.settings.restoredBanner);
                  } else {
                    onClearAllData();
                    setSavedBanner(t.settings.clearedBanner);
                  }
                  setConfirmAction(null);
                  setTimeout(() => setSavedBanner(null), 3500);
                }}
                className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#51434A] text-[#FFF9F6] text-xs font-medium"
              >
                {t.common.confirm}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
