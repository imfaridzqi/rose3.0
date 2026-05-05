import "dotenv/config"
import { db } from "./db"
import { users } from "./db/schema"

const dummies = [
  {
    nik: "331021", name: "Andi Kurniawan",       email: "andi.kurniawan@mail.com",
    jk: "L", tempatLahir: "Bandung",    tglLahir: "1995-03-12",
    noHp: "081234567001", noKtp: "3210012345678901",
    agama: "Islam",   alamat: "Jl. Sudirman No. 12, Bandung",
    role: "agent",      statusNikah: "Menikah",   ukuranBaju: "M",
    usernameTele: "@andi_k", idbot: 1001001,
  },
  {
    nik: "441032", name: "Siti Rahayu",           email: "siti.rahayu@mail.com",
    jk: "P", tempatLahir: "Surabaya",   tglLahir: "1997-07-25",
    noHp: "081234567002", noKtp: "3578027512970001",
    agama: "Islam",   alamat: "Jl. Ahmad Yani No. 45, Surabaya",
    role: "agent",      statusNikah: "Belum Menikah", ukuranBaju: "S",
    usernameTele: "@siti_r", idbot: 1001002,
  },
  {
    nik: "552043", name: "Budi Santoso",           email: "budi.santoso@mail.com",
    jk: "L", tempatLahir: "Semarang",   tglLahir: "1993-11-08",
    noHp: "081234567003", noKtp: "3374031108930001",
    agama: "Kristen", alamat: "Jl. Pemuda No. 77, Semarang",
    role: "supervisor", statusNikah: "Menikah",   ukuranBaju: "L",
    usernameTele: "@budi_s", idbot: 1001003,
  },
  {
    nik: "663054", name: "Dewi Lestari",           email: "dewi.lestari@mail.com",
    jk: "P", tempatLahir: "Yogyakarta", tglLahir: "1998-02-14",
    noHp: "081234567004", noKtp: "3401024202980001",
    agama: "Islam",   alamat: "Jl. Malioboro No. 3, Yogyakarta",
    role: "agent",      statusNikah: "Belum Menikah", ukuranBaju: "S",
    usernameTele: "@dewi_l", idbot: 1001004,
  },
  {
    nik: "774065", name: "Rendra Wijaya",          email: "rendra.wijaya@mail.com",
    jk: "L", tempatLahir: "Medan",      tglLahir: "1991-06-30",
    noHp: "081234567005", noKtp: "1271013006910001",
    agama: "Islam",   alamat: "Jl. Gatot Subroto No. 55, Medan",
    role: "agent",      statusNikah: "Menikah",   ukuranBaju: "XL",
    usernameTele: "@rendra_w", idbot: 1001005,
  },
  {
    nik: "885076", name: "Fitri Handayani",        email: "fitri.handayani@mail.com",
    jk: "P", tempatLahir: "Makassar",   tglLahir: "1996-09-05",
    noHp: "081234567006", noKtp: "7371044509960001",
    agama: "Islam",   alamat: "Jl. Sam Ratulangi No. 21, Makassar",
    role: "agent",      statusNikah: "Belum Menikah", ukuranBaju: "M",
    usernameTele: "@fitri_h", idbot: 1001006,
  },
  {
    nik: "996087", name: "Hendra Saputra",         email: "hendra.saputra@mail.com",
    jk: "L", tempatLahir: "Palembang",  tglLahir: "1994-04-18",
    noHp: "081234567007", noKtp: "1671021804940001",
    agama: "Islam",   alamat: "Jl. Demang Lebar Daun No. 9, Palembang",
    role: "agent",      statusNikah: "Menikah",   ukuranBaju: "L",
    usernameTele: "@hendra_s", idbot: 1001007,
  },
  {
    nik: "112198", name: "Yuni Astuti",            email: "yuni.astuti@mail.com",
    jk: "P", tempatLahir: "Denpasar",   tglLahir: "1999-12-01",
    noHp: "081234567008", noKtp: "5171010112990001",
    agama: "Hindu",   alamat: "Jl. Raya Kuta No. 88, Denpasar",
    role: "agent",      statusNikah: "Belum Menikah", ukuranBaju: "S",
    usernameTele: "@yuni_a", idbot: 1001008,
  },
  {
    nik: "223209", name: "Dimas Prasetyo",         email: "dimas.prasetyo@mail.com",
    jk: "L", tempatLahir: "Malang",     tglLahir: "1992-08-22",
    noHp: "081234567009", noKtp: "3573012208920001",
    agama: "Kristen", alamat: "Jl. Ijen No. 14, Malang",
    role: "supervisor", statusNikah: "Cerai",     ukuranBaju: "M",
    usernameTele: "@dimas_p", idbot: 1001009,
  },
  {
    nik: "334210", name: "Rini Oktaviani",         email: "rini.oktaviani@mail.com",
    jk: "P", tempatLahir: "Bekasi",     tglLahir: "2000-10-17",
    noHp: "081234567010", noKtp: "3275034710000001",
    agama: "Islam",   alamat: "Jl. Ahmad Yani No. 30, Bekasi",
    role: "agent",      statusNikah: "Belum Menikah", ukuranBaju: "M",
    usernameTele: "@rini_o", idbot: 1001010,
  },
]

const password = await Bun.password.hash("Password123!")

let inserted = 0
for (const d of dummies) {
  try {
    await db.insert(users).values({
      nik:          d.nik,
      name:         d.name,
      email:        d.email,
      password,
      jk:           d.jk,
      tempatLahir:  d.tempatLahir,
      tglLahir:     d.tglLahir,
      noHp:         d.noHp,
      noKtp:        d.noKtp,
      agama:        d.agama,
      alamat:       d.alamat,
      role:         d.role,
      statusNikah:  d.statusNikah,
      ukuranBaju:   d.ukuranBaju,
      usernameTele: d.usernameTele,
      idbot:        d.idbot,
    })
    console.log(`✓ ${d.name}`)
    inserted++
  } catch (e: any) {
    console.log(`✗ ${d.name} — ${e.message}`)
  }
}

console.log(`\nSelesai: ${inserted}/10 user berhasil dimasukkan.`)
process.exit(0)
