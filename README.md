# ห้องเรียนครูเก้า (ACS-SYS)

ระบบเช็คชื่อนักเรียนและจัดการข้อมูลหลังบ้าน — ออกแบบสำหรับมือถือเป็นหลัก รองรับแท็บเล็ตและ PC

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** + **DaisyUI 5** (UI หลัก — card, btn, input, theme)
- **Ant Design** (DatePicker, Select, Modal, Form, Popconfirm)
- **Lucide React** (ไอคอน)

## Features

| หน้า | ความสามารถ |
|------|------------|
| **Dashboard** | สรุปข้อมูลรายเทอม, สถานะเช็คชื่อวันนี้, กราฟอัตราเข้าเรียน |
| **เช็คชื่อ** | เลือกชั้น/ห้อง/วันที่, บันทึก มา / สาย-ลา / ขาด |
| **ตั้งค่า** | CRUD นักเรียน, จัดการชั้นเรียนและห้อง |

## Getting Started

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/
│   ├── layout/       # Sidebar, BottomNav, AppShell
│   ├── dashboard/    # หน้าสรุปข้อมูล
│   ├── attendance/   # หน้าเช็คชื่อ
│   └── management/   # หน้าจัดการข้อมูล
├── data/             # Mock data
├── providers/        # App state + Ant Design config
└── types/            # TypeScript types
```

## Design

- Light luxury + cute rose/pink theme
- Mobile-first with bottom navigation
- Sidebar navigation on tablet/desktop (md+)
- Thai font: Prompt (Google Fonts)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
