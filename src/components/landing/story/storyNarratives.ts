// Bilingual Narratives for the 4 Storytelling Slides

export interface StorySlideNarrative {
  title: string;
  desc: string;
}

export const STORY_NARRATIVES: Record<'en' | 'id', StorySlideNarrative[]> = {
  en: [
    {
      title: 'Who is this relative again?',
      desc: 'At family gatherings, distant relatives often greet you warmly, but you are not quite sure who they are or how you are related.',
    },
    {
      title: 'Connecting the branches',
      desc: 'Is she related through your mother or your father? Tracing back through parents quickly narrows down how the family branches connect.',
    },
    {
      title: 'Finding the common ancestor',
      desc: 'Aunt Sarah is your father David’s sister, both children of Grandpa Henry. The relationship is suddenly clear.',
    },
    {
      title: 'Your whole tree in one place',
      desc: 'Every relative, marriage, and generation organized clearly on an interactive canvas that runs entirely in your browser.',
    },
  ],
  id: [
    {
      title: 'Siapa tante ini sebenarnya?',
      desc: 'Di acara kumpul keluarga, kerabat jauh menyapa kita dengan akrab, padahal kita bingung siapa mereka dan dari mana hubungannya.',
    },
    {
      title: 'Mencari sambungan keluarga',
      desc: 'Apakah beliau kerabat dari pihak ibu atau pihak ayah? Melacak lewat orang tua memperjelas dari mana cabang keluarga terhubung.',
    },
    {
      title: 'Menemukan titik temu',
      desc: 'Ternyata Tante Sarah adalah adik dari Ayah David, dan keduanya anak dari Kakek Henry. Hubungannya langsung jelas.',
    },
    {
      title: 'Seluruh silsilah terpetakan rapi',
      desc: 'Semua anggota keluarga, pernikahan, dan lintas generasi tersusun rapi di kanvas interaktif yang berjalan langsung di browser Anda.',
    },
  ],
};
