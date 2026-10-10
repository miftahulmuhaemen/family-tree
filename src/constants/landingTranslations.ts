export interface LandingContent {
  nav: {
    brand: string;
    tagline: string;
    openApp: string;
    switchLang: string;
  };
  hero: {
    titleLine1: string;
    titleLine2: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    highlights: string[];
  };
  featuresList: {
    tag: string;
    title: string;
    description: string;
    items: Array<{
      id: string;
      number: string;
      title: string;
      description: string;
      assetLabel: string;
    }>;
  };
  problem: {
    title: string;
    description: string;
    editorialQuote: string;
    items: Array<{
      category: string;
      title: string;
      description: string;
    }>;
  };
  scenario: {
    title: string;
    description: string;
    contextLabel: string;
    gatheringContext: string;
    dilemmaQuestion: string;
    titlesLabel: string;
    titles: string[];
    resolutionTitle: string;
    resolution: string;
  };
  pillars: {
    title: string;
    description: string;
    primary: {
      tag: string;
      title: string;
      description: string;
      points: string[];
    };
    supporting: Array<{
      tag: string;
      title: string;
      description: string;
    }>;
  };
  roadmap: {
    title: string;
    description: string;
    items: Array<{
      tag: string;
      title: string;
      description: string;
      status: string;
    }>;
  };
  footer: {
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
    copyright: string;
    gedcomBadge: string;
    privacyBadge: string;
  };
}

export const LANDING_TRANSLATIONS: Record<'en' | 'id', LandingContent> = {
  en: {
    nav: {
      brand: 'Sanak Keluarga',
      tagline: 'Private Lineage Studio',
      openApp: 'Open App',
      switchLang: 'Bahasa Indonesia',
    },
    hero: {
      titleLine1: 'Your Ancestry,',
      titleLine2: 'Kept on Your Terms.',
      description:
        'A private family tree editor that runs entirely in your browser using the open GEDCOM format. No accounts, no subscriptions, and your data never leaves your computer.',
      primaryCta: 'Open Family Tree',
      secondaryCta: 'How It Works',
      highlights: [
        'Runs locally in browser (IndexedDB)',
        'Zero server uploads or tracking',
        'Standard GEDCOM 5.5.1 format',
      ],
    },
    featuresList: {
      tag: 'Capabilities',
      title: 'Engineered for lineage. Private by design.',
      description:
        'An open, private family tree platform combining intuitive visual exploration with standard data portability.',
      items: [
        {
          id: 'gedcom-standard',
          number: '01.',
          title: 'Universal Format Compatibility',
          description:
            'Bring your existing family research without starting over, or move your tree freely between genealogy tools whenever you want. Your records remain yours and are never trapped inside a proprietary database. Supported by full compliance with the industry standard GEDCOM 5.5.1 specification (.ged).',
          assetLabel: 'GEDCOM 5.5.1 Specification & Data Standard',
        },
        {
          id: 'visual-canvas',
          number: '02.',
          title: 'Interactive Visual Canvas',
          description:
            'An intuitive visual space to explore and build your family lineage. Add relatives with a click, connect spouses, trace descendant lines, and navigate large multi-generational branches smoothly with pan and zoom controls. Powered by an automated tree layout engine using orthogonal generational connectors.',
          assetLabel: 'Interactive Graph Canvas & Generational Connectors',
        },
        {
          id: 'monaco-editor',
          number: '03.',
          title: 'Live Code and Data Editor',
          description:
            'For users who want direct inspection over raw records, view and edit your family data as structured text with every change reflected on your tree in real time. Backed by an integrated Monaco editor buffer with two-way synchronized graph validation and instant syntax checks.',
          assetLabel: 'Two-Way Monaco Editor Buffer & Live Parser',
        },
        {
          id: 'device-storage',
          number: '04.',
          title: 'Private On-Device Storage',
          description:
            'Your family records stay strictly on your personal device. There is no account registration, no password to manage, and your personal data never leaves your computer or uploads to a third-party server. Built entirely on client-side execution using persistent browser storage (IndexedDB).',
          assetLabel: 'Zero-Telemetry Local Sandbox Storage (IndexedDB)',
        },
        {
          id: 'gdrive-sync',
          number: '05.',
          title: 'Direct Google Drive Sync and Sharing',
          description:
            'Save your family records directly to your personal Google Drive, and share them with relatives simply by sending them a link. Family members can open and explore the tree immediately in a clean, read-only viewer without needing to register or install software, while trusted collaborators can be granted full editing access.',
          assetLabel: 'Google Drive REST API v3 & Shared Permission Model',
        },
        {
          id: 'kinship-finder',
          number: '06.',
          title: 'Kinship and Perspective Relationship Finder',
          description:
            'Instantly understand how any two people in the family tree are related, or select any member as a reference point to see what they should call everyone else in the family. Calculated through a multi-branch graph traversal engine that resolves lineal, collateral, and affinal kinship lines from any vantage point.',
          assetLabel: 'Multi-Generational Kinship Graph Traversal & Perspective Matrix',
        },
        {
          id: 'rich-profiles',
          number: '07.',
          title: 'Rich Profiles and Direct Family Contact',
          description:
            'Preserve meaningful details beyond basic names and dates. Store burial places, home addresses, phone numbers, and tap directly to start a WhatsApp message or open navigation directions to a family home. Structured with dedicated metadata attributes for Google Maps coordinates and WhatsApp action triggers.',
          assetLabel: 'Rich Member Profile Drawer & Communication Shortcuts',
        },
        {
          id: 'customary-titles',
          number: '08.',
          title: 'Regional and Customary Kinship Titles',
          description:
            'Address your relatives with their proper traditional titles. The system automatically resolves customary address terms across Indonesian traditions, including Banjarese, Dayak, Javanese, Sundanese, Minang, and Batak customs. Driven by a localized kinship dictionary mapped to lineage seniority and family branch.',
          assetLabel: 'Cultural Kinship Dictionary & Regional Address Rules',
        },
      ],
    },
    problem: {
      title: 'Family records belong to families, not subscription services.',
      description:
        'Commercial genealogy websites often charge monthly fees to view your own research, lock data in proprietary formats, and shut down without warning.',
      editorialQuote:
        'When private genealogy services shut down or raise rates, family research collected over decades can disappear overnight.',
      items: [
        {
          category: 'Access fees',
          title: 'Recurring subscriptions for your own work',
          description:
            'Many commercial platforms require ongoing payments simply to view, edit, or export family trees you researched yourself.',
        },
        {
          category: 'Scattered records',
          title: 'Lost across chat groups and old drives',
          description:
            'Important dates, photos, and family stories often get scattered across message threads, forgotten hard drives, and fragile papers.',
        },
        {
          category: 'Service shutdown',
          title: 'Dependent on third-party company survival',
          description:
            'Closed genealogy websites can shut down or change their terms, leaving users with no way to retrieve their records.',
        },
      ],
    },
    scenario: {
      title: 'Who is this relative, and how are we related?',
      description:
        'At family gatherings, from weddings to holiday reunions, we meet extended relatives whose exact connection is difficult to trace on the spot.',
      contextLabel: 'Family gathering scenario',
      gatheringContext:
        'You meet an elder relative at an annual family gathering. Everyone knows they are family, but no one can explain the exact branch of the family tree.',
      dilemmaQuestion:
        '"Is this relative a second cousin, a grand-uncle, or connected through a maternal great-aunt?"',
      titlesLabel: 'Regional kinship titles',
      titles: ['Paman', 'Om', 'Pakde', 'Paklik', 'Mak Tuo', 'Tulang', 'Amangboru'],
      resolutionTitle: 'Direct lineage path',
      resolution:
        'Open your family tree on your phone or laptop, trace back to the shared common ancestor, and see the exact relationship immediately.',
    },
    pillars: {
      title: 'How Sanak Keluarga works',
      description:
        'Built without remote servers or account requirements so your records remain private and accessible.',
      primary: {
        tag: 'Local execution',
        title: '100% private in your browser',
        description:
          'Your family tree is stored on your device using IndexedDB. No files are uploaded to any server, and no analytics track your relatives.',
        points: [
          'No user account or login needed',
          'Works without an active internet connection',
          'Full control over your data files',
        ],
      },
      supporting: [
        {
          tag: 'Open standard',
          title: 'Standard GEDCOM 5.5.1 files',
          description:
            'Open and export standard .GED files compatible with Gramps, Ancestry, and desktop genealogy programs with no conversion needed.',
        },
        {
          tag: 'Direct sharing',
          title: 'Direct file ownership',
          description:
            'Save your tree as a plain file or JSON package. Share it with relatives via USB drive or email without requiring them to sign up.',
        },
      ],
    },
    roadmap: {
      title: 'Planned development',
      description:
        'Work underway to expand regional kinship terminology and optional local AI assistance.',
      items: [
        {
          tag: 'Kinship calculation',
          title: 'Regional Indonesian kinship titles',
          description:
            'Calculate kinship paths and automatically display customary titles across Javanese, Sundanese, Minang, and Batak traditions.',
          status: 'In Design',
        },
        {
          tag: 'Offline AI protocol',
          title: 'Model Context Protocol (MCP) support',
          description:
            'Allow local desktop AI tools to inspect family records and answer historical questions completely offline on your computer.',
          status: 'In Prototyping',
        },
      ],
    },
    footer: {
      ctaTitle: 'Start your family tree today',
      ctaDescription:
        'No sign-up or installation required. Open an existing .GED file or start a new tree directly in your browser.',
      ctaButton: 'Open Family Tree',
      copyright: 'Sanak Keluarga. Free and open source software.',
      gedcomBadge: 'GEDCOM 5.5.1 format',
      privacyBadge: 'Runs locally in browser',
    },
  },
  id: {
    nav: {
      brand: 'Sanak Keluarga',
      tagline: 'Studio Silsilah Privat',
      openApp: 'Buka Aplikasi',
      switchLang: 'English',
    },
    hero: {
      titleLine1: 'Silsilah Keluarga,',
      titleLine2: 'Milik Anda Sepenuhnya.',
      description:
        'Aplikasi pohon keluarga privat yang berjalan sepenuhnya di peramban Anda menggunakan format standar GEDCOM. Tanpa akun, tanpa biaya langganan, dan data Anda tidak pernah keluar dari perangkat.',
      primaryCta: 'Buka Pohon Keluarga',
      secondaryCta: 'Cara Kerja',
      highlights: [
        'Berjalan lokal di peramban (IndexedDB)',
        'Tanpa unggah ke server atau pelacak',
        'Mendukung format standar GEDCOM 5.5.1',
      ],
    },
    featuresList: {
      tag: 'Kemampuan',
      title: 'Dirancang untuk Silsilah. Milik Anda Sepenuhnya.',
      description:
        'Platform silsilah keluarga privat dan terbuka yang memadukan penjelajahan visual intuitif dengan kebebasan data standar.',
      items: [
        {
          id: 'gedcom-standard',
          number: '01.',
          title: 'Kompatibilitas Format Universal',
          description:
            'Gunakan kembali riset silsilah yang sudah Anda miliki tanpa harus memulai dari awal, atau pindahkan data keluarga Anda antaraplikasi genealogi kapan saja. Data keluarga tetap menjadi milik Anda dan tidak terkunci di format tertutup. Didukung kepatuhan penuh terhadap spesifikasi standar industri GEDCOM 5.5.1 (.ged).',
          assetLabel: 'Spesifikasi & Standar Data GEDCOM 5.5.1',
        },
        {
          id: 'visual-canvas',
          number: '02.',
          title: 'Kanvas Visual Interaktif',
          description:
            'Ruang visual intuitif untuk menjelajah dan menyusun garis silsilah keluarga Anda. Tambahkan kerabat cukup dengan satu klik, hubungkan pasangan, telusuri garis keturunan, dan jelajahi cabang keluarga besar dengan kontrol geser dan pembesaran yang halus. Ditenagai mesin penataan otomatis menggunakan garis penghubung generasi ortogonal.',
          assetLabel: 'Kanvas Graf Interaktif & Penghubung Generasi',
        },
        {
          id: 'monaco-editor',
          number: '03.',
          title: 'Editor Kode dan Data Terintegrasi',
          description:
            'Bagi Anda yang menginginkan kendali langsung atas data mentah, lihat dan sunting catatan keluarga sebagai teks terstruktur dengan setiap perubahan langsung tercermin pada pohon silsilah secara seketika. Didukung editor Monaco terintegrasi dengan sinkronisasi dua arah dan validasi sintaks instan.',
          assetLabel: 'Buffer Editor Monaco Dua Arah & Pengurai Langsung',
        },
        {
          id: 'device-storage',
          number: '04.',
          title: 'Penyimpanan Privat di Perangkat Sendiri',
          description:
            'Catatan keluarga Anda tersimpan sepenuhnya di perangkat pribadi Anda. Tanpa pendaftaran akun, tanpa kata sandi, dan data pribadi Anda tidak pernah dikirim ke peladen pihak ketiga. Berjalan murni di sisi peramban menggunakan penyimpanan lokal IndexedDB.',
          assetLabel: 'Penyimpanan Sandbox Lokal Tanpa Telemetri (IndexedDB)',
        },
        {
          id: 'gdrive-sync',
          number: '05.',
          title: 'Sinkronisasi dan Berbagi Google Drive Langsung',
          description:
            'Simpan catatan keluarga langsung ke Google Drive pribadi Anda, dan bagikan kepada sanak saudara cukup dengan mengirimkan sebuah tautan. Anggota keluarga dapat langsung membuka silsilah dalam tampilan baca yang rapi tanpa perlu mendaftar atau memasang aplikasi, sementara kerabat tepercaya dapat diberi akses penyuntingan.',
          assetLabel: 'Google Drive REST API v3 & Model Izin Berbagi',
        },
        {
          id: 'kinship-finder',
          number: '06.',
          title: 'Pencari Hubungan dan Sudut Pandang Kekerabatan',
          description:
            'Ketahui seketika hubungan antara dua anggota keluarga mana pun, atau pilih salah satu anggota sebagai titik acuan untuk melihat panggilan yang tepat kepada seluruh kerabat lainnya. Dihitung melalui mesin penelusuran graf multiranting yang menyelaraskan garis keturunan langsung, menyamping, dan perkawinan dari berbagai sudut pandang.',
          assetLabel: 'Mesin Penelusuran Graf Kekerabatan & Matriks Sudut Pandang',
        },
        {
          id: 'rich-profiles',
          number: '07.',
          title: 'Profil Lengkap dan Komunikasi Keluarga Langsung',
          description:
            'Simpan informasi bermakna melebihi sekadar nama dan tanggal. Catat lokasi pemakaman, alamat tempat tinggal, nomor telepon, dan ketuk langsung untuk mengirim pesan WhatsApp atau membuka petunjuk arah Google Maps ke rumah keluarga. Terstruktur dengan atribut metadata koordinat peta dan pintasan aksi WhatsApp.',
          assetLabel: 'Laci Profil Anggota Lengkap & Pintasan Komunikasi',
        },
        {
          id: 'customary-titles',
          number: '08.',
          title: 'Sapaan Kekerabatan Adat dan Daerah',
          description:
            'Sapa sanak keluarga dengan panggilan adat yang tepat. Sistem secara otomatis menentukan panggilan kekerabatan tradisional di berbagai adat Nusantara, seperti Banjar, Dayak, Jawa, Sunda, Minang, dan Batak. Didasarkan pada kamus kekerabatan terstruktur yang memetakan urutan senioritas dan cabang keluarga.',
          assetLabel: 'Kamus Kekerabatan Adat & Aturan Panggilan Daerah',
        },
      ],
    },
    problem: {
      title: 'Catatan silsilah adalah warisan keluarga, bukan komoditas langganan.',
      description:
        'Layanan genealogi komersial kerap memungut biaya bulanan untuk melihat riset Anda sendiri, mengunci data dalam format tertutup, dan rentan hilang saat layanan ditutup.',
      editorialQuote:
        'Saat situs genealogi daring berhenti beroperasi atau menaikkan tarif, riset silsilah keluarga selama puluhan tahun bisa hilang seketika.',
      items: [
        {
          category: 'Biaya akses',
          title: 'Tagihan berulang untuk riset sendiri',
          description:
            'Banyak platform komersial mewajibkan langganan berulang hanya untuk melihat, menyunting, atau mengunduh pohon keluarga yang Anda susun sendiri.',
        },
        {
          category: 'Catatan tercecer',
          title: 'Tersebar di pesan singkat dan folder acak',
          description:
            'Tanggal penting, foto, dan cerita leluhur sering tercecer di grup pesan WhatsApp, tertimbun di komputer lama, atau tersimpan di lembaran kertas usang.',
        },
        {
          category: 'Layanan tutup',
          title: 'Bergantung pada kelangsungan pihak ketiga',
          description:
            'Situs genealogi tertutup dapat berhenti beroperasi kapan saja, membuat pengguna kesulitan mengambil kembali data keluarga yang tersimpan.',
        },
      ],
    },
    scenario: {
      title: 'Siapa kerabat ini, dan bagaimana garis hubungannya?',
      description:
        'Pada pertemuan keluarga, seperti pesta pernikahan atau silaturahmi hari raya, kita sering bertemu kerabat yang silsilah hubungannya sulit diingat secara langsung.',
      contextLabel: 'Situasi kumpul keluarga',
      gatheringContext:
        'Anda bertemu dengan seorang tetua pada acara keluarga tahunan. Semua orang mengenal beliau sebagai keluarga, tetapi tidak ada yang bisa menjelaskan garis silsilah secara pasti.',
      dilemmaQuestion:
        '"Apakah beliau sepupu dua kali, kakek paman, atau kerabat dari garis nenek buyut?"',
      titlesLabel: 'Sapaan kekerabatan daerah',
      titles: ['Paman', 'Om', 'Pakde', 'Paklik', 'Mak Tuo', 'Tulang', 'Amangboru'],
      resolutionTitle: 'Jalur silsilah langsung',
      resolution:
        'Buka bagan keluarga di ponsel atau laptop, cari leluhur bersama, dan lihat jalur hubungan keluarga secara jelas.',
    },
    pillars: {
      title: 'Cara kerja Sanak Keluarga',
      description:
        'Dirancang tanpa server jauh atau kewajiban membuat akun agar riwayat keluarga tetap privat dan mudah diakses.',
      primary: {
        tag: 'Eksekusi lokal',
        title: '100% privat di peramban Anda',
        description:
          'Pohon keluarga disimpan langsung di perangkat Anda menggunakan IndexedDB. Tidak ada berkas yang dikirim ke server luar, dan tidak ada analitik yang membaca riwayat kerabat Anda.',
        points: [
          'Tanpa perlu membuat akun atau login',
          'Dapat digunakan tanpa koneksi internet aktif',
          'Kendali penuh atas berkas data Anda',
        ],
      },
      supporting: [
        {
          tag: 'Format standar',
          title: 'Format berkas standar GEDCOM 5.5.1',
          description:
            'Buka dan simpan berkas .GED standar yang kompatibel dengan Gramps, Ancestry, dan aplikasi genealogi komputer tanpa perlu konversi berkas.',
        },
        {
          tag: 'Berbagi langsung',
          title: 'Kepemilikan berkas mandiri',
          description:
            'Simpan silsilah dalam bentuk berkas teks atau paket JSON. Bagikan ke kerabat lewat flashdisk atau pesan tanpa memaksa mereka membuat akun baru.',
        },
      ],
    },
    roadmap: {
      title: 'Rencana pengembangan',
      description:
        'Pengembangan lanjutan untuk mendukung istilah kekerabatan daerah dan asisten AI lokal.',
      items: [
        {
          tag: 'Perhitungan kekerabatan',
          title: 'Sapaan kekerabatan bahasa daerah',
          description:
            'Menghitung jalur keluarga dan menampilkan sebutan adat yang sesuai dalam bahasa Jawa, Sunda, Minang, dan Batak.',
          status: 'Tahap Desain',
        },
        {
          tag: 'Protokol AI luring',
          title: 'Dukungan Model Context Protocol (MCP)',
          description:
            'Menghubungkan aplikasi AI lokal untuk memeriksa catatan silsilah dan menjawab pertanyaan riwayat keluarga tanpa internet.',
          status: 'Tahap Prototipe',
        },
      ],
    },
    footer: {
      ctaTitle: 'Mulai susun pohon keluarga Anda',
      ctaDescription:
        'Tanpa perlu membuat akun atau memasang perangkat lunak. Buka berkas .GED atau mulai silsilah baru langsung di peramban.',
      ctaButton: 'Buka Pohon Keluarga',
      copyright: 'Sanak Keluarga. Perangkat lunak bebas dan terbuka.',
      gedcomBadge: 'Format GEDCOM 5.5.1',
      privacyBadge: 'Berjalan lokal di peramban',
    },
  },
};
