import type { UiLanguage } from '../game/types'

export const uiStrings: Record<UiLanguage, Record<string, string>> = {
  en: { teacherControls: 'Teacher controls', fullscreen: 'Projector view', pause: 'Pause timer', resume: 'Resume timer', print: 'Print report', newGame: 'New game', quick: 'Quick Play', standard: 'Standard', full: 'Full Challenge' },
  hi: { teacherControls: 'शिक्षक नियंत्रण', fullscreen: 'प्रोजेक्टर दृश्य', pause: 'टाइमर रोकें', resume: 'टाइमर शुरू करें', print: 'रिपोर्ट प्रिंट करें', newGame: 'नया खेल', quick: 'त्वरित खेल', standard: 'मानक', full: 'पूरा चुनौती' },
}

export const getStrings = (language: UiLanguage) => uiStrings[language]
