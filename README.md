# GreenWaste - Smart Waste Sorting Dashboard

Aplikasi web dashboard monitoring dan kontrol IoT untuk sistem pemilah sampah pintar berbasis Edge AI dan aktuator pneumatic/servo multi-bin.

## 🛠️ Stack & Teknologi

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS (Dark/Modern Clean Industrial SCADA UI)
- **Icons**: Lucide React (`lucide-react`)
- **Data Visualization**: Recharts (`recharts`)
- **Utilities**: `clsx`, `tailwind-merge` (`cn` helper)

## 🎨 Color-Coding Paten 6 Kelas Sampah

| Kategori | Nama Inggris | Color Code | Tailwind / Hex |
| :--- | :--- | :--- | :--- |
| **Kaca** | Glass | `cyan-500` | `#06b6d4` |
| **Kardus** | Cardboard | `amber-700 / orange-600` | `#d97706` |
| **Kertas** | Paper | `sky-500` | `#0ea5e9` |
| **Logam** | Metal | `slate-500` | `#64748b` |
| **Organik** | Organic | `emerald-500` | `#10b981` |
| **Plastik** | Plastic | `amber-500` | `#f59e0b` |

## 🚀 Fitur Utama

1. **Header / Navbar**:
   - Status Koneksi Device: Live/Online (indikator hijau berkedip), Jitter Latensi (10–18ms), Camera FPS (27–30 FPS).
   - Mode Toggle: "Auto Mode" vs "Manual Override".
   - Emergency Stop Button: Pemutus sirkuit darurat interaktif dengan modal konfirmasi dan status "EMERGENCY HALTED".
   - Kontrol Simulasi: Tombol Play/Pause dan kecepatan simulasi (1x, 2x) untuk kemudahan demo.

2. **Panel Kiri (Monitoring Kamera & Kontrol Aktuator)**:
   - Viewport Live Camera Feed berasio 16:9 dengan simulasi conveyor belt bergerak.
   - Dynamic Laser Scanner Sweep & Optical ROI Grid.
   - Real-Time Bounding Box AI Vision Overlay (YOLOv8 Edge): Label kelas, Confidence Score (e.g., `Plastik - 96%`), estimasi berat, dan koordinat dinamis.
   - Actuator Status Card: Kecepatan conveyor (cm/s), sudut defleksi servo (-75° s/d +75°), dan siklus operasi.
   - Manual Override Controls: 6 tombol aksi instan untuk memicu aktuator servo secara langsung ke masing-masing bin (hanya dapat ditekan saat mode Manual aktif).

3. **Panel Kanan (Metrik Kapasitas & Telemetri Wadah)**:
   - 6 Cards Kapasitas Bin: Indikator persentase volume (0–100%), berat sampah vs kapasitas maksimal, badge status ("Aman", "Hampir Penuh" >80%, "Penuh!" >95%), dan tombol reset/kosongkan wadah.
   - Total Counter Card: Total sampah terpilah hari ini, kategori paling dominan (% share), dan throughput sortir per jam.
   - Chart Komposisi: Recharts interaktif yang dapat diubah antara Donut Chart dan Bar Chart dengan custom glassmorphism tooltip.

4. **Panel Bawah (Recent Event Logs)**:
   - Tabel audit trail real-time: Timestamp, Event ID, nama item, badge kategori warna paten, confidence bar, target bin, dan status pemilahan.
   - Filter cepat kategori (Semua, Kaca, Kardus, Kertas, Logam, Organik, Plastik).
   - Fitur pencarian teks dan tombol export ke CSV.

5. **Mock / Simulation Engine**:
   - Built-in React Hook (`useWasteSimulation`) yang mensimulasikan aliran item sampah, pergerakan aktuator, pengisian wadah, dan update log secara otomatis.

## 💻 Cara Menjalankan

```bash
# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.
