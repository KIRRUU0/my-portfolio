export const projects = [
  {
    id: 1,
    title: "E-Commerce Platform Modern",
    slug: "ecommerce-platform-modern",
    description: "Platform e-commerce lengkap dengan fitur real-time inventory management, payment gateway integration, dan admin dashboard.",
    content: "Platform e-commerce ini dibangun dengan arsitektur microservices. Menggunakan Go untuk backend API, React untuk frontend, dan PostgreSQL untuk database. Fitur termasuk: manajemen produk real-time, keranjang belanja, integrasi pembayaran dengan Midtrans, dashboard admin untuk manajemen toko, dan laporan penjualan interaktif.",
    image_url: "/images/projects/ecommerce.jpg", // Foto utama untuk home
    images: [ // Array foto untuk popup
      "/images/projects/ecommerce-1.jpg",
      "/images/projects/ecommerce-2.jpg",
      "/images/projects/ecommerce-3.jpg",
      "/images/projects/ecommerce-4.jpg"
    ],
    tech_stack: ["Go", "React", "PostgreSQL", "Redis", "Docker", "Kafka"],
    github_link: "https://github.com/username/ecommerce-platform",
    live_link: "https://ecommerce-demo.com",
    featured: true,
    status: "published",
    views: 1247,
    created_at: "2025-05-15T00:00:00Z",
    categories: ["fullstack", "ecommerce"]
  },
  {
    id: 2,
    title: "Sistem Manajemen Konten API",
    slug: "cms-api",
    description: "RESTful API untuk sistem manajemen konten dengan fitur autentikasi JWT, role-based access control, dan dokumentasi Swagger.",
    content: "API CMS yang dibangun dengan Go menggunakan framework Gin. Mendukung multi-tenant, rate limiting, caching dengan Redis, dan dokumentasi otomatis dengan Swagger.",
    image_url: "/images/projects/cms-api.jpg",
    images: [ // Array foto untuk popup
      "/images/projects/cms-api-1.jpg",
      "/images/projects/cms-api-2.jpg"
    ],
    tech_stack: ["Go", "JWT", "PostgreSQL", "Redis", "Swagger"],
    github_link: "https://github.com/username/cms-api",
    live_link: "https://api.cms-demo.com",
    featured: true,
    status: "published",
    views: 892,
    created_at: "2025-02-10T00:00:00Z",
    categories: ["backend", "api"]
  },
  {
    id: 3,
    title: "Aplikasi Mobile Todo List",
    slug: "mobile-todo-app",
    description: "Aplikasi mobile untuk manajemen tugas sehari-hari dengan fitur reminder, kategori, dan sinkronasi cloud.",
    content: "Aplikasi mobile cross-platform dibangun dengan React Native. Fitur: create/read/update/delete tugas, reminder notifikasi, kategori tugas, sinkronasi dengan cloud, dan dark mode.",
    image_url: "/images/projects/todo-app.jpg",
    images: [ // Array foto untuk popup
      "/images/projects/todo-app-1.jpg",
      "/images/projects/todo-app-2.jpg",
      "/images/projects/todo-app-3.jpg"
    ],
    tech_stack: ["React Native", "Firebase", "Redux"],
    github_link: "https://github.com/username/todo-app",
    live_link: null,
    featured: false,
    status: "published",
    views: 456,
    created_at: "2025-08-22T00:00:00Z",
    categories: ["mobile"]
  },
  {
    id: 4,
    title: "Dashboard Analitik Real-time",
    slug: "analytics-dashboard",
    description: "Dashboard interaktif untuk visualisasi data real-time dengan WebSocket dan chart interaktif.",
    content: "Dashboard analitik yang menampilkan data real-time menggunakan WebSocket. Dibangun dengan Go untuk backend dan React untuk frontend.",
    image_url: "/images/projects/analytics.jpg",
    images: [ // Array foto untuk popup (bisa 1 foto saja)
      "/images/projects/analytics-1.jpg"
    ],
    tech_stack: ["Go", "React", "WebSocket", "Chart.js", "PostgreSQL"],
    github_link: "https://github.com/username/analytics-dashboard",
    live_link: "https://analytics-demo.com",
    featured: true,
    status: "published",
    views: 1567,
    created_at: "2025-11-10T00:00:00Z",
    categories: ["fullstack", "analytics"]
  },
  {
    id: 5,
    title: "Sistem Reservasi Restoran",
    slug: "restaurant-reservation",
    description: "Aplikasi pemesanan meja restoran online dengan fitur pemilihan meja interaktif dan notifikasi SMS.",
    content: "Sistem reservasi restoran yang memudahkan pelanggan memesan meja secara online.",
    image_url: "/images/projects/reservation.jpg",
    images: [ // Bisa juga tidak punya multiple images
      "/images/projects/reservation.jpg"
    ],
    tech_stack: ["Go", "React", "MySQL", "Twilio"],
    github_link: "https://github.com/username/reservation-system",
    live_link: "https://reservation-demo.com",
    featured: false,
    status: "published",
    views: 678,
    created_at: "2025-03-05T00:00:00Z",
    categories: ["fullstack"]
  }
];