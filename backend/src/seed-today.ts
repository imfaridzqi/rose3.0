import "dotenv/config"
import { db } from "./db"
import { users, jadwals } from "./db/schema"

// jam_masuk per shift_id (hanya working shift)
const jamMasukByShift: Record<number, string> = {
  1: "07:00:00", 2: "08:00:00", 3: "13:00:00", 4: "22:00:00",
  11: "10:00:00", 13: "11:00:00", 14: "09:00:00", 16: "20:00:00", 17: "12:00:00",
}

function ketText(shiftId: number, offsetSec: number): string {
  if (!jamMasukByShift[shiftId]) return ""
  if (offsetSec === 0) return "Tepat waktu"
  const abs = Math.abs(offsetSec)
  const h = Math.floor(abs / 3600)
  const m = Math.floor((abs % 3600) / 60)
  const s = abs % 60
  const t = `${h} jam ${m} menit ${s} detik`
  return offsetSec < 0 ? `Lebih cepat ${t}` : `Terlambat ${t}`
}

// 39 users baru (id 12–50)
const newUsers = [
  { nik: "400001", name: "Agus Budianto",     email: "agus.budianto@mail.com",    jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "L"  },
  { nik: "400002", name: "Ratna Dewi",         email: "ratna.dewi@mail.com",        jk: "P", agama: "Islam",   role: "agent", ukuranBaju: "S"  },
  { nik: "400003", name: "Faisal Akbar",       email: "faisal.akbar@mail.com",      jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "M"  },
  { nik: "400004", name: "Citra Puspita",      email: "citra.puspita@mail.com",     jk: "P", agama: "Islam",   role: "agent", ukuranBaju: "S"  },
  { nik: "400005", name: "Teguh Santoso",      email: "teguh.santoso@mail.com",     jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "XL" },
  { nik: "400006", name: "Nur Syahroni",       email: "nur.syahroni@mail.com",      jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "M"  },
  { nik: "400007", name: "Laila Fitriani",     email: "laila.fitriani@mail.com",    jk: "P", agama: "Islam",   role: "agent", ukuranBaju: "S"  },
  { nik: "400008", name: "Hendri Kurnia",      email: "hendri.kurnia@mail.com",     jk: "L", agama: "Kristen", role: "agent", ukuranBaju: "L"  },
  { nik: "400009", name: "Novita Sari",        email: "novita.sari@mail.com",       jk: "P", agama: "Islam",   role: "agent", ukuranBaju: "M"  },
  { nik: "400010", name: "Rudi Hartono",       email: "rudi.hartono@mail.com",      jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "L"  },
  { nik: "400011", name: "Suci Ramadhani",     email: "suci.ramadhani@mail.com",    jk: "P", agama: "Islam",   role: "agent", ukuranBaju: "S"  },
  { nik: "400012", name: "Boby Laksono",       email: "boby.laksono@mail.com",      jk: "L", agama: "Kristen", role: "agent", ukuranBaju: "M"  },
  { nik: "400013", name: "Elsa Octavia",       email: "elsa.octavia@mail.com",      jk: "P", agama: "Kristen", role: "agent", ukuranBaju: "S"  },
  { nik: "400014", name: "Fandi Ahmad",        email: "fandi.ahmad@mail.com",       jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "L"  },
  { nik: "400015", name: "Gina Mustika",       email: "gina.mustika@mail.com",      jk: "P", agama: "Islam",   role: "agent", ukuranBaju: "S"  },
  { nik: "400016", name: "Hamdan Maulana",     email: "hamdan.maulana@mail.com",    jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "XL" },
  { nik: "400017", name: "Ira Kusuma",         email: "ira.kusuma@mail.com",        jk: "P", agama: "Hindu",   role: "agent", ukuranBaju: "M"  },
  { nik: "400018", name: "Jauhari Aziz",       email: "jauhari.aziz@mail.com",      jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "M"  },
  { nik: "400019", name: "Karina Putri",       email: "karina.putri@mail.com",      jk: "P", agama: "Islam",   role: "agent", ukuranBaju: "S"  },
  { nik: "400020", name: "Lukman Hakim",       email: "lukman.hakim@mail.com",      jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "L"  },
  { nik: "400021", name: "Monica Dewi",        email: "monica.dewi@mail.com",       jk: "P", agama: "Katolik", role: "agent", ukuranBaju: "S"  },
  { nik: "400022", name: "Noval Rizki",        email: "noval.rizki@mail.com",       jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "M"  },
  { nik: "400023", name: "Ovin Rachmawati",    email: "ovin.rachmawati@mail.com",   jk: "P", agama: "Islam",   role: "agent", ukuranBaju: "S"  },
  { nik: "400024", name: "Prima Yudha",        email: "prima.yudha@mail.com",       jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "M"  },
  { nik: "400025", name: "Ragil Saputro",      email: "ragil.saputro@mail.com",     jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "L"  },
  { nik: "400026", name: "Sinta Permata",      email: "sinta.permata@mail.com",     jk: "P", agama: "Islam",   role: "agent", ukuranBaju: "M"  },
  { nik: "400027", name: "Teri Oktaviani",     email: "teri.oktaviani@mail.com",    jk: "P", agama: "Kristen", role: "agent", ukuranBaju: "S"  },
  { nik: "400028", name: "Usman Hadi",         email: "usman.hadi@mail.com",        jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "XL" },
  { nik: "400029", name: "Vita Kusumadewi",    email: "vita.kusumadewi@mail.com",   jk: "P", agama: "Hindu",   role: "agent", ukuranBaju: "S"  },
  { nik: "400030", name: "Wawan Setiabudi",    email: "wawan.setiabudi@mail.com",   jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "L"  },
  { nik: "400031", name: "Yoga Pratama",       email: "yoga.pratama@mail.com",      jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "M"  },
  { nik: "400032", name: "Zaki Mubarak",       email: "zaki.mubarak@mail.com",      jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "M"  },
  { nik: "400033", name: "Aisyah Nurul",       email: "aisyah.nurul@mail.com",      jk: "P", agama: "Islam",   role: "agent", ukuranBaju: "S"  },
  { nik: "400034", name: "Bambang Irawan",     email: "bambang.irawan@mail.com",    jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "XL" },
  { nik: "400035", name: "Candra Wibawa",      email: "candra.wibawa@mail.com",     jk: "L", agama: "Kristen", role: "agent", ukuranBaju: "L"  },
  { nik: "400036", name: "Dwi Anggraini",      email: "dwi.anggraini@mail.com",     jk: "P", agama: "Islam",   role: "agent", ukuranBaju: "M"  },
  { nik: "400037", name: "Eko Prasetyo",       email: "eko.prasetyo@mail.com",      jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "L"  },
  { nik: "400038", name: "Farida Yusuf",       email: "farida.yusuf@mail.com",      jk: "P", agama: "Islam",   role: "agent", ukuranBaju: "S"  },
  { nik: "400039", name: "Galih Permana",      email: "galih.permana@mail.com",     jk: "L", agama: "Islam",   role: "agent", ukuranBaju: "M"  },
]

// distribusi shift untuk 50 jadwals
const shiftPool = [1,1,1,2,2,2,2,14,14,11,11,3,3,3,3,13,13,17,4,4,4,16,16,1,2,14,3,13,2,1,4,3,2,1,14,11,3,4,2,13,1,3,2,4,14,3,1,2,13,11]

// offset presensi dalam detik: positif=terlambat, negatif=lebih cepat, null=belum presensi
const offsetPool: (number | null)[] = [
  -468, -720, 0, 1320, -300, null, -540, 900, -180, 0,
  -600, 1080, -420, null, -150, 1500, -900, 300, 0, -480,
  -360, 1200, null, -240, 720, -780, 0, 1800, -120, 600,
  -660, null, -510, 840, -270, 0, 390, -750, null, -630,
  1440, -330, 0, 960, -450, 1260, -570, null, -390, 480,
]

const password = await Bun.password.hash("Password123!")

// 1. Insert 39 users baru
console.log("Menambahkan 39 users baru...\n")
let addedUsers = 0
for (const u of newUsers) {
  try {
    await db.insert(users).values({ ...u, email: u.email, password })
    process.stdout.write(`✓ ${u.name}  `)
    addedUsers++
  } catch (e: any) {
    process.stdout.write(`✗ ${u.name} (skip)  `)
  }
}
console.log(`\n\n${addedUsers}/39 users berhasil.\n`)

// 2. Ambil semua user id (urut by id, max 50)
const allUsers = await db.query.users.findMany({ columns: { id: true }, limit: 50 })
const userIds = allUsers.map(u => u.id)

// 3. Buat jadwal hari ini
const today = new Date().toISOString().split("T")[0]
console.log(`Membuat 50 jadwal untuk tanggal ${today}...\n`)

// team rotation
const teamIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,1,2,3,4,5,6,7,8,9,10,11,12,13,14]

let inserted = 0
for (let i = 0; i < Math.min(userIds.length, 50); i++) {
  const userId = userIds[i]
  const teamId = teamIds[i]
  const shiftId = shiftPool[i]
  const offset = offsetPool[i]
  const ket = offset !== null ? ketText(shiftId, offset) : null

  try {
    await db.insert(jadwals).values({ userId, teamId, shiftId, tglKerja: today, ket })
    inserted++
  } catch (e: any) {
    console.log(`✗ user_id ${userId}: ${e.message}`)
  }
}

console.log(`✓ ${inserted}/50 jadwal berhasil dimasukkan untuk ${today}`)
process.exit(0)
