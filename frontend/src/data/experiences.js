// data/experiences.js
export const experiences = [
  {
    id: 1,
    company: "PT Teknologi Maju",
    position: "Senior Backend Developer",
    description: "Bertanggung jawab mengembangkan dan memelihara microservices untuk platform fintech dengan skalabilitas tinggi.",
    location: "Jakarta, Indonesia",
    start_date: "2024-01-01T00:00:00Z",
    end_date: null,
    current: true,
    achievements: [
      "Mendesain arsitektur microservices untuk menangani 10.000+ request per detik",
      "Mengimplementasikan caching dengan Redis yang mengurangi response time hingga 40%",
      "Memimpin tim 5 developer dalam pengembangan fitur baru"
    ]
  },
  {
    id: 2,
    company: "Startup Digital Kreatif",
    position: "Full Stack Developer",
    description: "Mengembangkan aplikasi web dan mobile untuk berbagai klien dari berbagai industri.",
    location: "Bandung, Indonesia",
    start_date: "2022-06-01T00:00:00Z",
    end_date: "2023-12-31T00:00:00Z",
    current: false,
    achievements: [
      "Membangun REST API dengan Go untuk aplikasi e-commerce",
      "Mengembangkan frontend React dengan performa optimal",
      "Mengintegrasikan payment gateway Midtrans dan Stripe"
    ]
  },
  {
    id: 3,
    company: "Tech Company Global",
    position: "Backend Engineer",
    description: "Bergabung dengan tim platform untuk mengembangkan layanan backend yang melayani jutaan pengguna.",
    location: "Singapore (Remote)",
    start_date: "2021-01-01T00:00:00Z",
    end_date: "2022-05-31T00:00:00Z",
    current: false,
    achievements: [
      "Mengembangkan API service dengan Go dan gRPC",
      "Mengimplementasikan sistem autentikasi terpusat dengan JWT",
      "Optimasi query database yang meningkatkan performa 300%"
    ]
  },
  {
    id: 4,
    company: "Agency Kreatif",
    position: "Frontend Developer",
    description: "Membangun antarmuka pengguna yang responsif dan interaktif untuk berbagai website perusahaan.",
    location: "Yogyakarta, Indonesia",
    start_date: "2019-08-01T00:00:00Z",
    end_date: "2020-12-31T00:00:00Z",
    current: false,
    achievements: [
      "Membangun component library dengan React dan Storybook",
      "Mengimplementasikan desain sistem untuk konsistensi UI"
    ]
  }
];