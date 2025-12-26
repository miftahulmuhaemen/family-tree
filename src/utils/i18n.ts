export type Language = 'id' | 'en';

export const TERMS = {
  en: {
    // App / Global
    config_failed: "Failed to load configuration",
    config_saved: "Configuration Saved",
    loading: "Loading...",
    
    // Editor Sidebar
    configuration: "Configuration",
    valid_config: "Valid Configuration",
    invalid_config: "Invalid YAML",
    save_config: "Save Configuration",
    share_config: "Share Configuration",
    saving: "Saving...",
    generating_link: "Generating Link...",
    locked: "Locked",
    unlocked: "Unlocked",
    enter_token: "Enter Edit Token to Unlock",
    unlock: "Unlock",
    load_config: "Load Config by ID",
    sync: "Sync",
    last_saved: "Last saved:",
    locked_readonly: "Locked (Read Only)",
    id: "ID:",
    
    // Share Modal
    config_shared: "Configuration Shared",
    save_token_warning: "You must save the Edit Token below. Without it, you will not be able to make changes to this configuration later.",
    share_link: "Share Link",
    edit_token: "Edit Token",
    copy_details: "Copy Details to Clipboard",
    copied: "Copied!",
    
    // Detail Drawer
    family_detail: "Family Details",
    short_bio: "Short Biography",
    no_bio: "No biography.",
    contact: "Contact",
    no_phone: "No phone number.",
    location: "Location",
    no_address: "No address.",
    view_maps: "View on Google Maps",
    birth_date: "Birth Date",
    gender: "Gender",
    male: "Male",
    female: "Female",
    deceased: "Deceased",
    alive: "Alive",
    years: "Years",
    
    // Welcome Toast
    welcome_title: "Welcome to Family Tree!",
    welcome_message: "Interactive family visualization. Use controls to explore.",
    questions_email: "If you have questions, email",
    
    // Tooltips
    toggle_dark_mode: "Toggle Dark Mode",
    minimize: "Minimize",
    open_editor: "Open Editor",
    
    // Control Panel
    lang_label: "LANG",
    accent_label: "ACCENT",
    control_panel: "Control Panel",
    view_details: "View Details",
    
    // Relationships (already partially in FamilyTree, can consolidate here if needed)
    married: "Married",
    divorced: "Divorced",
    not_married: "Not Married",
    foster: "Fostered"
  },
  id: {
    // App / Global
    config_failed: "Gagal memuat konfigurasi",
    config_saved: "Konfigurasi Disimpan",
    loading: "Memuat...",
    
    // Editor Sidebar
    configuration: "Konfigurasi",
    valid_config: "Konfigurasi Valid",
    invalid_config: "YAML Tidak Valid",
    save_config: "Simpan Konfigurasi",
    share_config: "Bagikan Konfigurasi",
    saving: "Menyimpan...",
    generating_link: "Membuat Tautan...",
    locked: "Terkunci",
    unlocked: "Terbuka",
    enter_token: "Masukkan Token Edit untuk Membuka",
    unlock: "Buka",
    load_config: "Muat Konfigurasi dengan ID",
    sync: "Sinkron",
    last_saved: "Terakhir disimpan:",
    locked_readonly: "Terkunci (Hanya Baca)",
    id: "ID:",
    
    // Share Modal
    config_shared: "Konfigurasi Dibagikan",
    save_token_warning: "Anda harus menyimpan Token Edit di bawah ini. Tanpa itu, Anda tidak akan dapat mengubah konfigurasi ini nanti.",
    share_link: "Tautan Berbagi",
    edit_token: "Token Edit",
    copy_details: "Salin Detail ke Clipboard",
    copied: "Disalin!",
    
    // Detail Drawer
    family_detail: "Detail Keluarga",
    short_bio: "Biografi Singkat",
    no_bio: "Tidak ada biografi.",
    contact: "Kontak",
    no_phone: "Tidak ada nomor telepon.",
    location: "Lokasi",
    no_address: "Tidak ada alamat.",
    view_maps: "Lihat di Google Maps",
    birth_date: "Tanggal Lahir",
    gender: "Jenis Kelamin",
    male: "Laki-laki",
    female: "Perempuan",
    deceased: "Meninggal Dunia",
    alive: "Hidup",
    years: "Tahun",
    
    // Welcome Toast
    welcome_title: "Selamat Datang di Sanak Keluarga!",
    welcome_message: "Visualisasi keluarga interaktif. Gunakan kontrol untuk menjelajah.",
    questions_email: "Jika ada pertanyaan, kirim email ke",
    
    // Tooltips
    toggle_dark_mode: "Mode Gelap",
    minimize: "Minimalkan",
    open_editor: "Buka Editor",
    
    // Control Panel
    lang_label: "BAHASA",
    accent_label: "AKSEN",
    control_panel: "Panel Kontrol",
    view_details: "Lihat Detail",
    
    // Relationships
    married: "Menikah",
    divorced: "Cerai",
    not_married: "Tidak Menikah",
    foster: "Anak Angkat"
  }
};

export const KINSHIP_ID_MAPPING: Record<string, string> = {
  'Me': 'Diri Sendiri',
  'Parent': 'Orang Tua',
  'Father': 'Ayah',
  'Mother': 'Ibu',
  'Foster Father': 'Ayah Angkat',
  'Foster Mother': 'Ibu Angkat',
  'Child': 'Anak',
  'Son': 'Putra',
  'Daughter': 'Putri',
  'Foster Child': 'Anak Angkat',
  'Grandfather': 'Kakek',
  'Grandmother': 'Nenek',
  'Grandchild': 'Cucu',
  'Grandson': 'Cucu Laki-laki',
  'Granddaughter': 'Cucu Perempuan',
  'Great-Grandparent': 'Buyut',
  'Great-Grandchild': 'Cicit',
  'Great-Great-Grandparent': 'Canggah',
  'Great-Great-Great-Grandparent': 'Wareng',
  'Sibling': 'Saudara Kandung',
  'Brother': 'Saudara Laki-laki',
  'Sister': 'Saudara Perempuan',
  'Uncle': 'Paman',
  'Aunt': 'Bibi',
  'Niece/Nephew': 'Keponakan',
  'Nephew': 'Keponakan Laki-laki',
  'Niece': 'Keponakan Perempuan',
  'Cousin': 'Sepupu',
  'Grandnephew/niece': 'Cucu Keponakan',
  'Husband': 'Suami',
  'Wife': 'Istri',
  'Parent-in-Law': 'Mertua',
  'Son/Daughter-in-Law': 'Menantu',
  'Sibling-in-Law': 'Ipar',
  'Co-Parent-in-Law': 'Besan',
  'Ex-Husband': 'Mantan Suami',
  'Ex-Wife': 'Mantan Istri',
  'Grandfather-in-Law': 'Kakek Mertua',
  'Grandmother-in-Law': 'Nenek Mertua',
  'Cousin-in-Law': 'Sepupu Ipar',
  'Grandchild-in-Law': 'Cucu Menantu',
  'Great-Grandchild-in-Law': 'Cicit Menantu',
  'Great-Grandfather': 'Kakek Buyut',
  'Great-Grandmother': 'Nenek Buyut',
  'Relative': 'Kerabat'
};
