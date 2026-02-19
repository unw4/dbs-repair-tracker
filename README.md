# Servis Takip

Denizli Bilgisayar Sistemleri için geliştirilmiş bilgisayar teknik servisi iş takip sistemi.

## Özellikler

- **Müşteri takip portalı** — Takip numarası ile servis durumunu anlık sorgulama
- **Admin paneli** — Form oluşturma, düzenleme, silme ve durum yönetimi
- **WhatsApp bildirimleri** — Form oluşturulduğunda ve cihaz hazır olduğunda otomatik mesaj
- **Durum filtreleme** — Klasör tabanlı sidebar ile statüye göre filtreleme
- **Gecikme uyarısı** — 3 günü geçen formlar için otomatik ⚠ işareti ve filtre
- **Arama** — Müşteri, cihaz, telefon, not ve durum bazlı anlık arama
- **Dark mode** — Sistem tercihi ile uyumlu karanlık tema
- **İş tipine göre akıllı adımlar** — Servis işlemlerinde "Parça Bekleniyor" adımı gösterilmez

## Teknolojiler

- [Next.js 16](https://nextjs.org/) — App Router, Server Actions
- [Prisma 5](https://www.prisma.io/) + SQLite
- [Tailwind CSS v4](https://tailwindcss.com/)
- [iron-session](https://github.com/vvo/iron-session) — Admin oturumu
- [next-themes](https://github.com/pacocoursey/next-themes) — Dark mode
- [Meta Cloud API](https://developers.facebook.com/docs/whatsapp) — WhatsApp bildirimleri

## Kurulum

```bash
git clone https://github.com/unw4/dbs-repair-tracker.git
cd dbs-repair-tracker
npm install
```

`.env.local` oluştur:

```env
DATABASE_URL="file:./dev.db"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="<bcrypt hash — base64 encoded>"
SESSION_SECRET="<32+ karakter rastgele string>"
WHATSAPP_PHONE_NUMBER_ID="<Meta Phone Number ID>"
WHATSAPP_ACCESS_TOKEN="<Meta System User Token>"
APP_URL="http://localhost:3000"
```

```bash
npx prisma db push
npm run dev
```

## Deployment (Railway)

Railway'de aşağıdaki environment variable'ları ekle:

| Değişken | Açıklama |
|---|---|
| `DATABASE_URL` | `file:/app/data/prod.db` (volume bağlı) |
| `ADMIN_USERNAME` | Admin kullanıcı adı |
| `ADMIN_PASSWORD_HASH` | bcrypt hash (base64) |
| `SESSION_SECRET` | Oturum şifreleme anahtarı |
| `WHATSAPP_PHONE_NUMBER_ID` | Meta Cloud API numara ID |
| `WHATSAPP_ACCESS_TOKEN` | Meta System User token |
| `APP_URL` | Railway deployment URL |

## Servis Durumları

| Durum | Açıklama |
|---|---|
| Teslim Alındı | Cihaz servise kabul edildi |
| İşlemde | Teknik çalışma başladı |
| Parça Bekleniyor | Gerekli parça temin ediliyor (parça işlemlerinde) |
| Hazır | Cihaz teslime hazır — WhatsApp bildirimi gönderilir |
| Teslim Edildi | Müşteriye teslim edildi |

## Admin Şifresi Oluşturma

```js
const bcrypt = require("bcryptjs");
const hash = bcrypt.hashSync("şifreniz", 12);
console.log(Buffer.from(hash).toString("base64"));
```

Çıkan değeri `ADMIN_PASSWORD_HASH` olarak kaydet.

---

Tasarım ve geliştirme: [Mert Egemen ÇAR](https://www.linkedin.com/in/mert-egemen-%C3%A7ar-aa8664227/)
