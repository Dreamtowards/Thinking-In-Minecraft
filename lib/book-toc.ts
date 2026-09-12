export type TocAudience = 'both' | 'fan' | 'dev';

export type TocChapter = {
  id: string;
  title: string;
  audience: TocAudience;
  desc: string;
  question: string;
  sections: string[];
  tags: string[];
  href: string | null;
  written: boolean;
};

export type TocPart = {
  title: string;
  span: string;
  intent: string;
  chapters: TocChapter[];
};

export type TocVolume = {
  id: string;
  roman: string;
  short: string;
  english: string;
  color: string;
  heading: string;
  thesis: string;
  payoffFan: string;
  payoffDev: string;
  parts: TocPart[];
};

export type BookTocData = {
  thesis: string;
  volumes: TocVolume[];
};
