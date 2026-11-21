import type { ProjectItem } from '../types';

export const PROFILE_INFO = {
  name: 'Muhamad Eldi',
  alias: 'POPELL',
  fullLabel: 'Muhamad Eldi (aka POPELL)',
  title: 'Full-Stack Developer • Creative Technologist • AI Explorer',
  role: 'PT Pos Indonesia — Operations Control Intern (PKL 2026)',
  school: 'SMK Wiraswasta Kota Cimahi — Rekayasa Perangkat Lunak (RPL)',
  location: 'Bandung, West Java, Indonesia',
  coordinates: "6°54'53.0\"S 107°36'35.0\"E",
  bio: `Student developer & creative technologist yang hobi ngulik teknologi dari nol—menggabungkan rekayasa sistem logistik nasional (PT Pos Indonesia), UI interaktif yang halus, dan eksperimen AI lokal (Ollama + MongoDB).`,
  portraitImage: new URL('../assets/images/eldi_real_original.webp', import.meta.url).href,
  personaPortraitImage: new URL('../assets/images/eldi_aibel_persona.webp', import.meta.url).href,
  email: 'muheldinug122@gmail.com',
  github: 'https://github.com/Meldi0',
  instagram: 'https://www.instagram.com/_kubill/',
  instagramHandle: '@_kubill',
  tiktok: 'https://www.tiktok.com/@_ldii1',
  tiktokHandle: '@_ldii1',
};

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'ipos5-tarif-wilayah',
    number: '01',
    code: 'POS-TRF-025',
    title: 'iPOS5 Pengelolaan Tarif & Master Wilayah',
    subtitle: 'POS INDONESIA SHIPPING RATES CALCULATOR · KEPMENDAGRI 2025 DATASET',
    category: 'posind',
    categoryLabel: 'PT Pos Indonesia',
    client: 'PT Pos Indonesia (PKL 2026)',
    role: 'Full-Stack Laravel Developer',
    year: 'Nov 2026',
    status: 'Latest Build',
    description:
      'Aplikasi web kalkulator tarif pengiriman resmi PT Pos Indonesia berbasis Laravel 12 & MySQL yang memuat dataset lengkap Kepmendagri 2025: 38 provinsi, 514 kab/kota, 7.285 kecamatan, 83.762 desa/kelurahan, 8.352 kantor, serta 9.002 matriks tarif.',
    fullCaseStudy: {
      overview:
        'Dirancang untuk mempercepat kalkulasi tarif pengiriman, estimasi SLA, pencatatan produksi layanan (PAID, UNPAID, COD, KORPORAT), serta perbandingan multi-ekspedisi dalam antarmuka modern yang responsif.',
      challenge:
        'Mengindeks dan menyaring 83.762 baris data wilayah + kode pos Kepmendagri 2025 secara instan tanpa lag saat operator mengetik desa/kelurahan atau kode pos.',
      architectureSolution:
        'Membangun backend Laravel 12 + MySQL dengan query relasional terindeks, pencarian cepat wilayah yang otomatis mengisi 4 tingkat administratif tujuan, serta frontend reaktif Tailwind CSS + Alpine.js.',
      keyAchievements: [
        'Integrasi 100% dataset Kepmendagri 2025: 38 Provinsi, 514 Kab/Kota, 7.285 Kecamatan, 83.762 Desa/Kelurahan.',
        'Pencarian cepat wilayah/kode pos dengan auto-fill 4 tingkat administratif secara real-time.',
        'Kalkulasi otomatis tarif dasar, estimasi SLA 45 Zona × 8 Layanan, serta pencatatan Dashboard Produksi Layanan.',
        'Dilengkapi modul Multi-Ekspedisi dan panel Admin Ekspedisi.',
      ],
      metrics: [
        { label: 'Desa / Kelurahan', value: '83.762' },
        { label: 'Master Kantor', value: '8.352' },
        { label: 'Matriks Tarif', value: '9.002' },
        { label: 'Cakupan Zona', value: '45 × 8' },
      ],
    },
    technologies: ['Laravel 12', 'MySQL', 'Tailwind CSS', 'Alpine.js', 'Kepmendagri 2025'],
    metrics: '83.762 Desa/Kel · 8.352 Kantor · Laravel 12',
    image: './lampiran/ipos5-tarif-wilayah.webp',
    attachments: [
      {
        src: './lampiran/ipos5-tarif-wilayah.webp',
        label: 'Kalkulator Tarif',
        caption: 'Antarmuka Cek Tarif Pengiriman iPOS5 & Referensi Wilayah Kepmendagri 2025',
        kind: 'ui',
      },
    ],
    aspect: 'landscape',
    githubUrl: 'https://github.com/Meldi0',
  },
  {
    id: 'prisma-pos-helpdesk',
    number: '02',
    code: 'PRISMA-V2.7',
    title: 'PRISMA POS (POSO) — Enterprise Helpdesk',
    subtitle: 'INTEGRATED SERVICE MANAGEMENT, KANBAN, MFA OTP & UBUNTU DEPLOYMENT',
    category: 'posind',
    categoryLabel: 'PT Pos Indonesia',
    client: 'PT Pos Indonesia — Kantor Pusat Bandung',
    role: 'Full-Stack Developer & Server Setup',
    year: 'Sep–Okt 2026',
    status: 'Deployed on Ubuntu',
    description:
      'Sistem Helpdesk & Manajemen Tiket Terpadu kedinasan PT Pos Indonesia yang menghubungkan KCU/KC/KCP, Regional, dan Kantor Pusat. Dilengkapi Kanban Board, Universal Attachment Viewer, Telegram Bot Gateway, MFA OTP Email, Dynamic DB Switcher, serta server lokal Ubuntu kantor.',
    fullCaseStudy: {
      overview:
        'Berawal dari sistem POSO hingga rebranding resmi menjadi PRISMA POS (Pos Resolution & Integrated Service Management Application) versi 2.7.0 untuk mengelola pelaporan kendala operasional secara terstruktur dan terukur SLA-nya.',
      challenge:
        'Eskalasi kendala dari ratusan agen dan kantor cabang sering tersebar di chat tidak terstruktur tanpa pelacakan status, audit operator, atau peringatan batas SLA.',
      architectureSolution:
        'Membangun full-stack React + TypeScript + Vite + Node.js + MySQL (Cloud & Dynamic Online/Offline Switcher) dengan 3 peran utama (Admin, Petugas UPT, Agen Pos), MFA 2FA, Telegram Bot Gateway, dan deployment lokal pada komputer kantor bersistem operasi Ubuntu.',
      keyAchievements: [
        'Portal Mitra Agen Pos terverifikasi dengan 2FA/MFA OTP Email dan persistensi sesi aman.',
        'Dashboard operator & staf UPT lengkap dengan Kanban Board, chat real-time, dan Lightbox Attachment Viewer.',
        'Monitoring SLA real-time, rekap produktivitas operator, serta fitur Reopen Tiket Release.',
        'Di-deploy pada komputer kantor berbasis Ubuntu sebagai server lokal jaringan internal.',
      ],
      metrics: [
        { label: 'App Version', value: 'v2.7.0' },
        { label: 'Access Roles', value: '3 RBAC' },
        { label: 'Security', value: 'MFA + OTP' },
        { label: 'Hosting', value: 'Ubuntu Local' },
      ],
    },
    technologies: ['React', 'TypeScript', 'Vite', 'Node.js', 'MySQL', 'Telegram Bot', 'Ubuntu Server'],
    metrics: 'v2.7.0 · MFA OTP · Ubuntu Local Server',
    image: './lampiran/prisma-dashboard.webp',
    attachments: [
      {
        src: './lampiran/prisma-dashboard.webp',
        label: 'Incident Center',
        caption: 'Dashboard Penanganan Tiket, SLA Alert & Manajemen Role PRISMA POS',
        kind: 'ui',
      },
      {
        src: './lampiran/prisma-portal-login.webp',
        label: 'Portal Masuk',
        caption: 'Halaman Portal Masuk Mitra Agen Pos Indonesia — PRISMA POS',
        kind: 'ui',
      },
      {
        src: './lampiran/prisma-partner-gateway.webp',
        label: 'Partner Gateway',
        caption: 'Tampilan Gateway Verifikasi Dua Langkah Mitra Agen Pos',
        kind: 'ui',
      },
      {
        src: './lampiran/prisma-system-flow.webp',
        label: 'Alur Sistem',
        caption: 'Diagram Alur Sistem Helpdesk POSO / PRISMA POS (Login MFA hingga Reopen Tiket)',
        kind: 'diagram',
      },
    ],
    aspect: 'landscape',
    githubUrl: 'https://github.com/Meldi0',
  },
  {
    id: 'ipos5-delivery-suite',
    number: '03',
    code: 'IPOS5-CORE',
    title: 'iPOS5 — Cimahi Origin Delivery & Simulator',
    subtitle: 'MILK RUN ROUTING ENGINE, CONNOTE PIPELINE, MONGODB SIMULATOR & MASTER KANTOR',
    category: 'posind',
    categoryLabel: 'PT Pos Indonesia',
    client: 'PT Pos Indonesia — KCU Cimahi & SPP Bandung',
    role: 'Full-Stack & Systems Developer',
    year: 'Jul–Okt 2026',
    status: 'Flagship PKL',
    description:
      'Proyek terpanjang selama PKL: desain ulang sistem logistik iPOS5 meliputi Milk Run Routing Engine, pelacakan connote real-time (Linear Pipeline), filter harian (filter per day), simulator suntik resi MongoDB Live Cluster, standalone Dashboard Analytics, dan integrasi GeoJSON Master Kantor.',
    fullCaseStudy: {
      overview:
        'Ekosistem iPOS5 dikembangkan secara iteratif dari Juli hingga Oktober 2026 untuk memodernisasi pemantauan rute pengiriman KCU Cimahi 40511 & SPP Bandung 40400 dalam satu suite yang terdiri dari Web App Redesign, Logistics Simulator (MongoDB), Gateway RBAC, dan versi Standalone Analytics.',
      challenge:
        'Menyelaraskan status kiriman real-time dengan database MongoDB/MySQL, menangani filter transaksi harian yang akurat, dan memetakan data master kantor dengan data wilayah resmi Kepmendagri.',
      architectureSolution:
        'Arsitektur modular React + Vite + Node.js + MongoDB dengan Linear Pipeline State tracking, bulk parcel generator simulator untuk uji beban 18 kantor pos & 3 armada, serta halaman Master Kantor (/kantor) berbasis data wilayah resmi.',
      keyAchievements: [
        'Menyatukan 4 modul inti (Catalog, Tracking, Invoices, Analytics) + panel Warta POSIND.',
        'Membangun iPOS5 Logistics Simulator (MongoDB Live Cluster) untuk suntik resi massal & live telemetry stream.',
        'Menambahkan filter data per hari (filter per day), pagination tabel, daily routing checker, dan RBAC Gateway.',
        'Membuat kloning mandiri 1 halaman (LayoutDashbIpos5) + dokumentasi lengkap BRD, PRD & Flowchart.',
      ],
      metrics: [
        { label: 'Core Modules', value: '4 Pillars' },
        { label: 'Coverage Hub', value: 'KCU 40511' },
        { label: 'Live Simulator', value: 'MongoDB' },
        { label: 'Auth Gateway', value: 'Multi-RBAC' },
      ],
    },
    technologies: ['React', 'Vite', 'TypeScript', 'Node.js', 'MongoDB', 'GeoJSON', 'Milk Run'],
    metrics: 'Flagship Suite · MongoDB Simulator · 4 Lampiran',
    image: './lampiran/ipos5-analytics-dark.webp',
    attachments: [
      {
        src: './lampiran/ipos5-analytics-dark.webp',
        label: 'Analytics Dark',
        caption: 'Dashboard Analytics & Sales/Freight Volume iPOS5 (5 Kategori Layanan)',
        kind: 'ui',
      },
      {
        src: './lampiran/ipos5-analytics-live.webp',
        label: 'Redesign + Filter',
        caption: 'Antarmuka iPOS5 Redesign dengan Filter Tanggal Harian & Live Connotes Telemetry',
        kind: 'ui',
      },
      {
        src: './lampiran/ipos5-simulator-mongo.webp',
        label: 'MongoDB Simulator',
        caption: 'iPOS5 Logistics Simulator — Bulk Parcel Generator & Live Stream Injector (MongoDB)',
        kind: 'ui',
      },
      {
        src: './lampiran/ipos5-gateway-auth.webp',
        label: 'RBAC Gateway',
        caption: 'Portal Autentikasi & Quick-Role Switch Admin / Supervisor iPOS5',
        kind: 'ui',
      },
    ],
    aspect: 'landscape',
    githubUrl: 'https://github.com/Meldi0',
  },
  {
    id: 'war-room-control-tower',
    number: '04',
    code: 'WR-TOWER-18',
    title: 'War Room Logistics Control Tower & Field App',
    subtitle: 'INTEGRATED FLEET BALANCE, 18 NOPEN HUBS & FAST INGESTION PORTAL',
    category: 'posind',
    categoryLabel: 'PT Pos Indonesia',
    client: 'PT Pos Indonesia — War Room Bandung',
    role: 'Lead Full-Stack & Systems Architect',
    year: 'Agt 2026',
    status: 'Full-Stack Prototype',
    description:
      'Pusat komando War Room PT Pos Indonesia untuk mengawasi distribusi paket, beban muatan 4 armada kendaraan, rute dinamis Milk Run, jaringan 18 Kantor Pos (NOPEN) area Bandung–Cimahi, deteksi anomali, lengkap dengan modul aplikasi lapangan (Field Operations & Fast Ingestion Hub).',
    fullCaseStudy: {
      overview:
        'Menggabungkan War Room Dashboard dengan pos_field_app sehingga petugas loket/lapangan dapat menyuntikkan data paket secara real-time melalui REST API langsung ke database MySQL War Room.',
      challenge:
        'Ketidakseimbangan kapasitas muatan antar armada (KG) dan waktu tunggu (dwell time) di hub sortir memerlukan visualisasi komando yang langsung memperlihatkan titik anomali.',
      architectureSolution:
        'Full-stack React + Node.js + MySQL dengan What-If Simulator (Milk Run Load Optimizer), perbandingan kapasitas terisi vs sisa kapasitas 4 armada, dan console live API ingestion pada port terdedikasi.',
      keyAchievements: [
        'Memantau akumulasi jaringan hingga 613.3K KG tonase kargo lintas 18 Office Hubs (NOPEN).',
        'Modul Field Operations & Fast Ingestion Hub dengan 1-Click Mass Generator, Scanner & Live API Console.',
        'Atribusi kunjungan & resi multi-channel (Loket, Tokopedia, Shopee, TikTok Shop, Blibli).',
        'Lengkap dengan dokumentasi API, skema database, arsitektur sistem, dan deck presentasi War Room.',
      ],
      metrics: [
        { label: 'Office Hubs', value: '18 NOPEN' },
        { label: 'Active Fleets', value: '4 Armada' },
        { label: 'Network Tonnage', value: '613.3K KG' },
        { label: 'Field Portal', value: 'Live API' },
      ],
    },
    technologies: ['React', 'Node.js', 'MySQL', 'REST API', 'Field App', 'Milk Run'],
    metrics: '18 NOPEN Hubs · 4 Armada · Field Ingestion App',
    image: './lampiran/warroom-control-tower-v1.webp',
    attachments: [
      {
        src: './lampiran/warroom-control-tower-v1.webp',
        label: 'Control Tower Live',
        caption: 'POSIND Control Tower — Revenue Tracking, 613.3K KG Tonnage & Fleet Balance',
        kind: 'ui',
      },
      {
        src: './lampiran/warroom-control-tower-v2.webp',
        label: 'War Room v2',
        caption: 'Tampilan War Room Control Tower Monitoring 18 NOPEN & Beban Muatan 4 Armada',
        kind: 'ui',
      },
      {
        src: './lampiran/warroom-field-app.webp',
        label: 'Field Ingestion Hub',
        caption: 'Field Operations & Fast Ingestion Hub — Generator Transaksi Massal & Live API Console',
        kind: 'ui',
      },
    ],
    aspect: 'landscape',
    githubUrl: 'https://github.com/Meldi0',
  },
  {
    id: 'regional-performance-dashboard',
    number: '05',
    code: 'REG-Q1-2026',
    title: 'Dashboard Kinerja Produk Regional POSIND',
    subtitle: '6 NATIONAL REGIONALS (R1–R6) · 4 CORE SERVICES · DUAL LAYOUT ENGINE',
    category: 'posind',
    categoryLabel: 'PT Pos Indonesia',
    client: 'PT Pos Indonesia (PKL 2026)',
    role: 'Frontend & Data Visualization Engineer',
    year: 'Okt 2026',
    status: 'Completed',
    description:
      'Dashboard satu halaman berbasis React & TypeScript untuk memantau 14,36 juta+ volume kiriman dari 6 regional nasional (Regional 1 Medan – Regional 6 Makassar) pada 4 layanan utama (Q9, PKH, EC3, PE) periode Q1 2026, lengkap dengan 2 mode tampilan instan.',
    fullCaseStudy: {
      overview:
        'Menyajikan data kinerja regional yang kompleks menjadi satu antarmuka bersih yang mendukung perpindahan instan antara tampilan Kisi 6 Regional (3×2) dan tampilan perbandingan detail per layanan.',
      challenge:
        'Data kinerja regional dalam spreadsheet panjang menyulitkan pimpinan membandingkan tren bulanan Januari–Maret 2026 dan tingkat ketepatan waktu (on-time rate 94,8%) antar wilayah.',
      architectureSolution:
        'React + TypeScript + Vite + Tailwind CSS dengan arsitektur data terverifikasi, identitas warna khas tiap regional, filter bulan interaktif, dan combo chart tren bulanan.',
      keyAchievements: [
        'Memvisualisasikan 14.360.172 total kiriman Q1 2026 across 6 Regional (R1 Medan s/d R6 Makassar).',
        'Dua versi tata letak lengkap (Grid 6 Regional & Detail Sidebar View) yang dapat di-switch instan.',
        'Rincian 4 produk utama (PKH Pos Reguler, EC3 Marketplace, PE, Q9) lengkap dengan on-time rate.',
        'Dilengkapi spesifikasi lengkap: BRD, PRD, DASHBOARD_SPEC, dan DATA_DICTIONARY.',
      ],
      metrics: [
        { label: 'Total Volume Q1', value: '14.36M' },
        { label: 'On-Time Rate', value: '94.8%' },
        { label: 'Regional Scope', value: 'R1 – R6' },
        { label: 'View Modes', value: '2 Layouts' },
      ],
    },
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Data Viz'],
    metrics: '14.36M Shipments · 6 Regional · 2 Switchable Views',
    image: './lampiran/regional-dashboard-main.webp',
    attachments: [
      {
        src: './lampiran/regional-dashboard-main.webp',
        label: 'Sidebar Detail View',
        caption: 'Dashboard Kinerja Regional — Total 14.360.172 Kiriman, Tren Bulanan & 4 Layanan',
        kind: 'ui',
      },
      {
        src: './lampiran/regional-dashboard-grid.webp',
        label: '6-Regional Grid View',
        caption: 'Mode Tampilan Kisi 6 Regional (R1–R6) dengan Identitas Warna & Combo Chart',
        kind: 'ui',
      },
    ],
    aspect: 'landscape',
    githubUrl: 'https://github.com/Meldi0',
  },
  {
    id: 'top20-and-pos-insight',
    number: '06',
    code: 'POS-BI-TOP20',
    title: 'Top 20 Marketplace & POS Insight BI Suite',
    subtitle: 'PHP PDO ANALYTICS, LARAVEL 12 + REACT SANCTUM & INDONESIA HUB MAP',
    category: 'posind',
    categoryLabel: 'PT Pos Indonesia',
    client: 'PT Pos Indonesia (PKL Juli 2026)',
    role: 'Full-Stack Web Developer',
    year: 'Jul 2026',
    status: '3-in-1 BI Suite',
    description:
      'Kumpulan sistem Business Intelligence awal PKL: Dashboard Top 20 Pelanggan Marketplace (PHP PDO + MySQL), Template Mandiri POSiND Analytics (HTML tanpa server), serta POS Insight BI (Laravel 12 & Fullstack React + Sanctum) lengkap dengan peta jaringan hub Indonesia.',
    fullCaseStudy: {
      overview:
        'Dimulai dari kebutuhan memantau Top 20 merchant marketplace terbesar (Shopee, Tokopedia, Lazada, TikTok Shop, Bukalapak), kemudian berkembang menjadi template standalone dan platform BI multi-arsitektur.',
      challenge:
        'Menyajikan data transaksi berskala besar (6.000+ seller) secara cepat dengan fitur export PDF/Excel, segmentasi RFM, serta peta sebaran hub nasional yang mudah dipakai tim non-teknis.',
      architectureSolution:
        'Membangun 3 implementasi teruji: (1) PHP 8.2 Native PDO + Chart.js, (2) Standalone HTML/JS tanpa server, dan (3) Laravel 12 + DomPDF + Frontend React (Vite) berbasis Laravel Sanctum API.',
      keyAchievements: [
        'KPI monitoring lengkap: Total Transaksi, Total Bea Kirim, Total Berat, Segmentasi RFM & Anomaly Detection.',
        'Alat operasional terintegrasi: Kalkulator Ongkir, Lacak Resi, Cetak Invoice, Export PDF & Excel.',
        'Versi POS Insight menampilkan peta Indonesia Hub Activity & Marketplace Share secara interaktif.',
        'Template mandiri POSiND Analytics dapat dibuka langsung dari browser tanpa server.',
      ],
      metrics: [
        { label: 'Seller Monitored', value: '6.000+' },
        { label: 'Marketplaces', value: '5 Channels' },
        { label: 'BI Editions', value: '3 Builds' },
        { label: 'Export Formats', value: 'PDF / XLS' },
      ],
    },
    technologies: ['PHP Native (PDO)', 'Laravel 12', 'React (Vite)', 'MySQL', 'Chart.js', 'DomPDF'],
    metrics: '6.000+ Sellers · 3 BI Editions · Hub Map',
    image: './lampiran/posind-top20-marketplace.webp',
    attachments: [
      {
        src: './lampiran/posind-top20-marketplace.webp',
        label: 'Top 20 Marketplace',
        caption: 'Dashboard Top 20 Pelanggan Marketplace POS Indonesia (PHP PDO & MySQL)',
        kind: 'ui',
      },
      {
        src: './lampiran/posind-insight-map.webp',
        label: 'POS Insight Hub Map',
        caption: 'POS Insight Logistics Overview — Peta Aktivitas Hub Indonesia & Marketplace Share',
        kind: 'ui',
      },
      {
        src: './lampiran/posind-template-standalone.webp',
        label: 'Standalone Template',
        caption: 'Template Dashboard POSiND Analytics Mandiri (Tanpa Server / Direct Browser)',
        kind: 'ui',
      },
    ],
    aspect: 'landscape',
    githubUrl: 'https://github.com/Meldi0',
  },
  {
    id: 'shipment-and-mobile-kurir',
    number: '07',
    code: 'UI-DRS-MOB',
    title: 'Shipment Overview, High-Density & Mobile Kurir',
    subtitle: 'MULTI-THEME LOGISTICS UI EXPLORATION & COURIER DRS WORKSPACE',
    category: 'posind',
    categoryLabel: 'PT Pos Indonesia',
    client: 'PT Pos Indonesia (Okt 2026)',
    role: 'UI/UX Engineer & Frontend Developer',
    year: 'Okt 2026',
    status: 'Multi-Theme Pack',
    description:
      'Eksplorasi desain antarmuka logistik lintas tema dan perangkat selaras pengujian RBAC (Distribusi_Web, Mandor, Kurir): Shipment Overview tema terang, Logistics Intelligence tema gelap High-Density, serta antarmuka Mobile Kurir dengan bottom bar untuk Delivery Run Sheet (DRS).',
    fullCaseStudy: {
      overview:
        'Menjawab kebutuhan karakter pengguna yang berbeda—supervisor membutuhkan layar berdensitas data tinggi, sedangkan kurir di lapangan membutuhkan UI mobile satu tangan untuk memindai dan mengantar paket DRS.',
      challenge:
        'Menjaga konsistensi data operasional (COD, rasio pengantaran, provinsi tujuan, status DRS) di tiga paradigma antarmuka yang sangat berbeda: Light Hub, Dark High-Density, dan Mobile-First.',
      architectureSolution:
        'Mengembangkan Shipment Overview & Mobile Kurir dalam single-HTML responsif dengan parser CSV DRS langsung di klien, ditambah aplikasi React + TypeScript untuk tema High-Density.',
      keyAchievements: [
        'Shipment Overview (tema terang & navy) lengkap dengan Import CSV DRS, Dispatch Calendar & COD Overview.',
        'POS IND Logistics Intelligence dengan kontras tinggi untuk analisis tabel masif tanpa scroll berlebih.',
        'Mobile Kurir Workspace dengan bottom bar navigasi (Antaran, Rute, SCAN, Riwayat, Profil) & indikator COD aktif.',
      ],
      metrics: [
        { label: 'UI Themes', value: '3 Systems' },
        { label: 'CSV Parser', value: 'Client-Side' },
        { label: 'Mobile UX', value: 'DRS + Scan' },
        { label: 'Roles Tested', value: '3 RBAC' },
      ],
    },
    technologies: ['HTML5/CSS3', 'React', 'TypeScript', 'Mobile-First UI', 'CSV Parser'],
    metrics: 'Light + Dark High-Density + Mobile Kurir DRS',
    image: './lampiran/shipment-overview-light.webp',
    attachments: [
      {
        src: './lampiran/shipment-overview-light.webp',
        label: 'Shipment Light',
        caption: 'Variasi Desain Dashboard Shipment Overview (Tema Terang + Import CSV DRS)',
        kind: 'ui',
      },
      {
        src: './lampiran/logistics-intelligence-dark.webp',
        label: 'High-Density Dark',
        caption: 'POS IND Logistics Intelligence — Dashboard Tema Gelap Kepadatan Informasi Tinggi',
        kind: 'ui',
      },
      {
        src: './lampiran/mobile-kurir-drs.webp',
        label: 'Mobile Kurir DRS',
        caption: 'Tampilan Mobile Dashboard Kurir (POSIND Antaran DRS) dengan Bottom Bar & Scan',
        kind: 'mobile',
      },
    ],
    aspect: 'landscape',
    githubUrl: 'https://github.com/Meldi0',
  },
  {
    id: 'local-ai-shipment-agent',
    number: '08',
    code: 'AI-OLLAMA-01',
    title: 'Local AI Shipment Agent (Ollama + MongoDB)',
    subtitle: 'CHRONOLOGICAL RESI HISTORY ANALYZER & STUCK PACKAGE DETECTOR',
    category: 'ai',
    categoryLabel: 'AI & R&D Lab',
    client: 'PT Pos Indonesia — Operations Control R&D',
    role: 'AI Engineer & Backend Explorer',
    year: 'Sep–Okt 2026',
    status: 'Local AI Prototype',
    description:
      'Prototipe AI Agent lokal (Ollama + MongoDB) yang membaca rangkaian kronologis riwayat nomor resi, mengidentifikasi lokasi terakhir paket, menghitung lama paket tertahan (stuck), membaca dokumen referensi lokal, dan menyimpulkan tindak lanjut operasional.',
    fullCaseStudy: {
      overview:
        'Terinspirasi langsung dari pekerjaan pemantauan kiriman terbuka di Operations Control, AI Agent ini dirancang agar tim dapat menanyakan kondisi resi bermasalah tanpa harus membaca log panjang secara manual.',
      challenge:
        'Kesimpulan kendala sering keliru jika hanya melihat status terakhir; AI harus membaca urutan kronologis perjalanan resi dari awal hingga akhir serta menjaga privasi data perusahaan secara lokal.',
      architectureSolution:
        'Menggabungkan LLM lokal via Ollama dengan database MongoDB lokal sebagai penyimpanan riwayat resi dan modul pembaca file direktori lokal sebagai konteks aturan operasional.',
      keyAchievements: [
        'Berjalan 100% lokal (privacy-first) menggunakan Ollama + MongoDB tanpa mengirim data resi ke cloud publik.',
        'Mendeteksi otomatis lokasi terakhir, durasi paket stuck, kasus interception, gagal antar, hingga return.',
        'Mampu membaca berkas referensi dari folder lokal untuk memperkaya rekomendasi tindak lanjut.',
      ],
      metrics: [
        { label: 'LLM Runtime', value: 'Ollama Local' },
        { label: 'History Store', value: 'MongoDB' },
        { label: 'Data Privacy', value: '100% Local' },
        { label: 'Analysis Mode', value: 'Chronological' },
      ],
    },
    technologies: ['Python', 'Ollama', 'MongoDB', 'Local LLMs', 'AI Agents', 'Context Reader'],
    metrics: '100% Local AI · Ollama + MongoDB Chronological',
    image: './lampiran/ai-agent-architecture.webp',
    attachments: [
      {
        src: './lampiran/ai-agent-architecture.webp',
        label: 'Arsitektur AI Agent',
        caption: 'Alur Prototipe AI Agent Lokal Analisis Riwayat Kiriman (MongoDB + Deteksi Stuck)',
        kind: 'diagram',
      },
      {
        src: './lampiran/monitoring-kiriman-flow.webp',
        label: 'Alur Monitoring',
        caption: 'Alur Kerja Monitoring dan Tindak Lanjut Kiriman Terbuka Operations Control',
        kind: 'diagram',
      },
    ],
    aspect: 'landscape',
    githubUrl: 'https://github.com/Meldi0',
  },
  {
    id: 'cisspic-photo-studio',
    number: '09',
    code: 'LAB-SNAP-01',
    title: 'SNAPDAYS (CissPic) — Creative Web Photobooth',
    subtitle: 'INTERACTIVE 4-CUT STUDIO, LIVE PHOTO & THEMED FRAMES ON VERCEL',
    category: 'creative',
    categoryLabel: 'Creative & SaaS',
    client: 'Personal Creative Studio (Live)',
    role: 'Creator & Creative Web Developer',
    year: '2026',
    status: 'Live on Vercel',
    description:
      'Berawal dari pertanyaan "What if a web photobooth could feel like a real creative studio?" — SNAPDAYS (CissPic Studio Vol. 01) menghadirkan kamera WebRTC real-time, filter warna, 4-Cut photo strip composer, bingkai bertema, stiker, tipografi kustom, dan mode ala Live Photo 100% on-device.',
    fullCaseStudy: {
      overview:
        'Studio photobooth web interaktif yang bisa langsung diakses di cisspic.vercel.app. Seluruh pemrosesan gambar dilakukan di sisi klien sehingga super cepat dan 100% menjaga privasi pengguna.',
      challenge:
        'Menggabungkan live stream kamera WebRTC dengan efek filter halus, komposisi 4-cut strip beresolusi tinggi, stiker, dan pengalaman editing yang playful namun tetap mulus di browser HP maupun desktop.',
      architectureSolution:
        'React + Vite + WebRTC MediaDevices API + HTML5 Canvas rendering pipeline dengan state editor modular untuk themed templates, stickers, typography, dan instant keepsake export.',
      keyAchievements: [
        'Deployed live dan dapat langsung dicoba publik di cisspic.vercel.app.',
        'Mendukung 4-Cut Photo Strip, themed frames, stiker interaktif, teks kustom, dan eksplorasi Live Photo.',
        '100% privasi terjaga (Local-First processing di browser pengguna tanpa upload server).',
      ],
      metrics: [
        { label: 'Live URL', value: 'Vercel Edge' },
        { label: 'Data Privacy', value: '100% Local' },
        { label: 'Studio Mode', value: '4-Cut + Live' },
        { label: 'Engine', value: 'Canvas+WebRTC' },
      ],
    },
    technologies: ['React', 'JavaScript', 'Vite', 'HTML5 Canvas', 'WebRTC Camera API', 'CSS3'],
    metrics: 'LIVE at cisspic.vercel.app · WebRTC + Canvas',
    image: './lampiran/snapdays-studio.webp',
    attachments: [
      {
        src: './lampiran/snapdays-studio.webp',
        label: 'Studio Preview',
        caption: 'SNAPDAYS (CissPic Studio Vol. 01) — Interactive 4-Cut Photobooth & Keepsake Composer',
        kind: 'ui',
      },
    ],
    aspect: 'landscape',
    liveUrl: 'https://cisspic.vercel.app',
    githubUrl: 'https://github.com/Meldi0',
  },
  {
    id: 'flowbase-enterprise-saas',
    number: '10',
    code: 'UI-SAAS-01',
    title: 'FLOWBASE — Enterprise SaaS Intelligence Suite',
    subtitle: 'HIGH-DENSITY REVENUE ANALYTICS, API TELEMETRY & WORKSPACE OS',
    category: 'creative',
    categoryLabel: 'Creative & SaaS',
    client: 'Product Architecture Concept',
    role: 'Frontend & Systems Architect',
    year: '2026',
    status: 'UI System',
    description:
      'Dashboard manajemen SaaS kelas enterprise bermode gelap yang memadukan analitik pendapatan ($482.9K Revenue, $96.4K MRR), pemantauan server (99.98% Uptime, 8.2M API Requests), manajemen proyek, kalender, billing, command palette ⌘K, dan AI Assistant.',
    fullCaseStudy: {
      overview:
        'Eksplorasi sistem operasi bisnis all-in-one dengan kepadatan informasi tinggi namun tetap lega secara tipografi dan visual.',
      challenge:
        'Menyajikan 8 kartu KPI utama sekaligus grafik Revenue vs Expenses tahunan dan berbagai modul produktivitas tanpa membuat layar terasa sesak atau berat.',
      architectureSolution:
        'Komponen modular React + TypeScript + Tailwind CSS dengan grafik SVG/Canvas ringan, kontras presisi, serta shortcut pencarian global.',
      keyAchievements: [
        '8 kartu KPI dengan sparkline tren pertumbuhan dan indikator delta persentase.',
        'Visualisasi 99.98% uptime & 8.2M API requests dengan pemisahan hierarki informasi yang tegas.',
        'Modul lengkap: Projects, Tasks, Calendar, Invoices & Billing, hingga AI Assistant.',
      ],
      metrics: [
        { label: 'Tracked Rev', value: '$482.9K' },
        { label: 'Server Uptime', value: '99.98%' },
        { label: 'API Volume', value: '8.2M Req' },
        { label: 'UX Paradigm', value: 'Command OS' },
      ],
    },
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Data Visualization', 'REST API'],
    metrics: '99.98% Uptime · 8.2M API Telemetry UI',
    image: './lampiran/flowbase-saas.webp',
    attachments: [
      {
        src: './lampiran/flowbase-saas.webp',
        label: 'SaaS Command OS',
        caption: 'Flowbase Enterprise SaaS Suite — Revenue Intelligence & API Telemetry Dashboard',
        kind: 'ui',
      },
    ],
    aspect: 'landscape',
    githubUrl: 'https://github.com/Meldi0',
  },
  {
    id: 'smart-school-ecosystem',
    number: '11',
    code: 'EDU-OS-V2',
    title: 'SMART SCHOOL ECOSYSTEM V2',
    subtitle: 'MULTI-WORKSPACE SCHOOL OS, QR ATTENDANCE & TOKEN E-VOTING',
    category: 'mobile-school',
    categoryLabel: 'Mobile & School',
    client: 'Digital School Platform',
    role: 'Full-Stack Web Developer',
    year: '2025–2026',
    status: 'v2.0 Complete',
    description:
      'Platform ekosistem sekolah digital berkonsep "Satu platform, beda workspace" yang menyatukan e-voting OSIS berproteksi token satu-kali-pakai, presensi QR code, announcement feed, analitik partisipasi live, dan pusat dokumen untuk siswa, guru, panitia, dan admin.',
    fullCaseStudy: {
      overview:
        'Mentransformasi administrasi dan pemilihan OSIS konvensional menjadi portal sekolah modern berbasis PHP & MySQL yang ringan dijalankan di infrastruktur sekolah.',
      challenge:
        'Pemilihan manual rentan duplikasi suara dan lambat direkap; sekolah juga membutuhkan akses terpisah sesuai peran tanpa harus memakai banyak aplikasi berbeda.',
      architectureSolution:
        'PHP + MySQL Core dengan Role Doorway multi-workspace, Participation Engine real-time, validasi token voting satu-kali-pakai, dan antarmuka responsif.',
      keyAchievements: [
        'Sistem Token Voting terproteksi menjamin pemilihan OSIS jujur dan bebas suara ganda.',
        'Smart School Command panel memantau persentase partisipasi suara secara live.',
        '5 modul terpadu: E-Voting, QR Attendance, Document Center, Announcement Feed, dan Role Workspace.',
      ],
      metrics: [
        { label: 'Version', value: 'v2.0 Live' },
        { label: 'Vote Guard', value: '1x Token' },
        { label: 'Modules', value: '5 Core' },
        { label: 'Backend', value: 'PHP+MySQL' },
      ],
    },
    technologies: ['PHP', 'MySQL', 'JavaScript', 'QR Attendance', 'Token Security', 'Responsive UI'],
    metrics: 'Token-Protected E-Voting · 5 Integrated Modules',
    image: './lampiran/smart-school-v2.webp',
    attachments: [
      {
        src: './lampiran/smart-school-v2.webp',
        label: 'School OS Portal',
        caption: 'Smart School Ecosystem v2 — Multi-Workspace Portal & Token-Protected E-Voting',
        kind: 'ui',
      },
    ],
    aspect: 'landscape',
    githubUrl: 'https://github.com/Meldi0',
  },
  {
    id: 'finora-keuangan-mobile',
    number: '12',
    code: 'MOB-FIN-01',
    title: 'FINORA KEUANGAN — Smart Wallet Tracker',
    subtitle: 'MOBILE-FIRST PERSONAL FINANCE, DAILY CASHFLOW & AUTO WALLET SYNC',
    category: 'mobile-school',
    categoryLabel: 'Mobile & School',
    client: 'Personal Finance App',
    role: 'Mobile UI & Full-Stack Developer',
    year: '2026',
    status: 'Mobile-First PWA',
    description:
      'Aplikasi manajemen keuangan personal berbasis mobile-first untuk memantau saldo aktif, arus kas harian melalui kalender interaktif, grafik pengeluaran mingguan/bulanan, serta indikator kesehatan finansial otomatis dengan navigasi floating dock 1-tap.',
    fullCaseStudy: {
      overview:
        'Membantu pencatatan transaksi harian terasa ringan dan cepat dengan umpan balik visual instan terhadap kondisi saldo pengguna.',
      challenge:
        'Aplikasi keuangan umumnya terlalu kompleks sehingga pengguna malas mencatat pengeluaran harian secara rutin.',
      architectureSolution:
        'UI mobile-first dengan kalender mingguan cepat, kartu arus kas 3 kolom (Masuk, Keluar, Bulan Ini), indikator kesehatan saldo otomatis, dan floating action bar untuk input 1 sentuhan.',
      keyAchievements: [
        'Status kesehatan finansial otomatis (AMAN) dengan progress bar real-time.',
        'Sinkronisasi dompet otomatis untuk pembaruan saldo dan mutasi harian.',
        'Floating bottom dock ergonomis untuk pencatatan transaksi 1-tap di smartphone.',
      ],
      metrics: [
        { label: 'Form Factor', value: 'Mobile-First' },
        { label: 'Entry Speed', value: '1-Tap Add' },
        { label: 'Wallet Sync', value: 'Auto-Update' },
        { label: 'Views', value: 'Day & Month' },
      ],
    },
    technologies: ['React', 'PWA', 'TypeScript', 'Financial Analytics', 'Mobile UI'],
    metrics: 'Mobile-First PWA · 1-Tap Cashflow Tracker',
    image: './lampiran/finora-mobile.webp',
    attachments: [
      {
        src: './lampiran/finora-mobile.webp',
        label: 'Mobile Interface',
        caption: 'Finora Keuangan — Mobile Dashboard Saldo, Kalender Arus Kas & Floating Dock',
        kind: 'mobile',
      },
    ],
    aspect: 'portrait',
    githubUrl: 'https://github.com/Meldi0',
  },
];

export const HOW_I_BUILD = [
  {
    no: '01',
    title: 'Curious by default.',
    body: 'Nggak cuma puas tahu cara pakainya, tapi selalu kepo gimana cara kerjanya behind the scenes dan apakah bisa dibuat lebih cepat & elegan.',
  },
  {
    no: '02',
    title: 'Function + Feeling.',
    body: 'UI cakep tanpa logika kuat cuma pajangan. Sistem jalan tapi kaku juga bikin capek dipakai. Target gue selalu dua-duanya dapet.',
  },
  {
    no: '03',
    title: 'Details change everything.',
    body: 'Tipografi, micro-interaction, loading state, sampai kebersihan skema database 3NF adalah hal kecil yang bikin produk terasa kelas studio.',
  },
  {
    no: '04',
    title: 'Build. Break. Iterate.',
    body: 'Mindset selalu belajar: bangun prototipe cepat, tes pakai data nyata, temukan celahnya, lalu poles sampai matang.',
  },
];
