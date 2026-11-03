export type Language = 'km' | 'en';

export interface LetterItem {
  id: string;
  char: string;
  charKm?: string;
  nameKm: string;
  nameEn: string;
  phonicsKm: string;
  phonicsEn: string;
  series?: 'or' | 'our'; // Khmer consonants belong to either អ (1st series) or អ៊ (2nd series)
  subConsonant?: string; // ជើងអក្សរ
  exampleWordKm: string;
  exampleWordEn: string;
  exampleIcon: string;
  exampleTranslit: string;
  // SVG path for tracing (normalized to 300x300 viewBox)
  svgPath: string;
  guidePoints: { x: number; y: number }[];
}

export interface NumberItem {
  number: number;
  khmerNumeral: string; // ០, ១, ២...
  khmerWord: string; // សូន្យ, មួយ, ពីរ...
  englishWord: string; // Zero, One, Two...
  khmerPronunciation: string; // Mouy, Pii, Bei...
  svgPath: string;
  guidePoints: { x: number; y: number }[];
  itemIcon: string;
  itemColor: string;
  itemLabelKm: string;
  itemLabelEn: string;
}

export interface VocabularyItem {
  id: string;
  category: 'animals' | 'fruits' | 'colors' | 'shapes';
  wordKm: string;
  wordEn: string;
  transliteration: string;
  emoji: string;
  color?: string;
  funFactKm: string;
  funFactEn: string;
}

export interface StickerItem {
  id: string;
  nameKm: string;
  nameEn: string;
  emoji: string;
  category: 'animals' | 'nature' | 'stars' | 'culture';
  unlocked: boolean;
}

export interface ParentRecording {
  id: string;
  itemId: string;
  itemLabel: string;
  author: 'Mom' | 'Dad' | 'Grandma' | 'Teacher';
  audioBlobUrl: string;
  durationSec: number;
  timestamp: string;
}

export interface ChildProgress {
  starsEarned: number;
  bananasEarned: number;
  mascotHappiness: number; // 0 to 100
  itemsPracticed: Record<string, { attempts: number; successes: number; lastScore: number }>;
  stickersUnlocked: string[];
}

export type BrushTexture = 'solid' | 'fur' | 'leather' | 'feathers' | 'sparkle' | 'rainbow';

export interface AnimalRegion {
  id: string;
  nameKm: string;
  nameEn: string;
  defaultColor: string;
  realisticColor: string;
  svgPath: string;
  textureEffect?: BrushTexture;
}

export interface RealisticAnimalTemplate {
  id: string;
  nameKm: string;
  nameEn: string;
  scientificName: string;
  icon: string;
  habitatKm: string;
  habitatEn: string;
  soundType: 'trumpet' | 'roar' | 'peacock' | 'rabbit' | 'dolphin';
  funFactKm: string;
  funFactEn: string;
  viewBox: string;
  regions: AnimalRegion[];
}

