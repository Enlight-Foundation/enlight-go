# enlight-go — ลิงก์ย่อของมูลนิธิ Enlight (`go.enlight.ac`)

Fork ของ [Sink](https://github.com/miantiao-me/Sink) (AGPL-3.0) ตรึงที่ **v0.3.1** (`bafa4e1`) · กิ่งที่ขึ้นเว็บคือ **`enlight`** · `master` เป็นสำเนา upstream ไว้เทียบเท่านั้น

repo นี้เปิดสาธารณะเพราะ AGPL ให้เปิดโค้ดที่แก้แล้วแก่ผู้ใช้เว็บ · ค่าลับอยู่ใน Worker secret เท่านั้น — ใส่ค่าลับหรือข้อมูลคนใน repo นี้ = รั่วสู่สาธารณะทันที

## ที่แก้จาก upstream

| ไฟล์ | แก้อะไร | ทำไม |
|---|---|---|
| `server/utils/access-log.ts` | ช่อง `ip` เก็บรหัสแฮช 16 ตัวที่เปลี่ยนทุกวัน (SHA-256 ของ `NUXT_SITE_TOKEN` + วันที่เวลาไทย + IP + user-agent) · ช่อง `ua` เก็บว่าง | สถิติต้องไม่เก็บข้อมูลระบุตัวคน (มติ 25 พ.ย. 2569) · ยังนับ "ผู้เข้าชมไม่ซ้ำต่อวัน" ได้ แต่ย้อนเป็น IP ไม่ได้ และเชื่อมคนเดียวกันข้ามวันไม่ได้ |
| `wrangler.jsonc` | ชื่อ Worker `enlight-go` · ปัก `account_id` · ผูกโดเมน `go.enlight.ac` · ถอด Workers AI · `crons: []` · ปิด traces | กติกาบัญชี: ไม่มีงานตั้งเวลาปลุกตัวเอง · ไม่มีค่าตามใช้ที่ไม่ได้ตั้งเพดาน |
| `tests/unit/enlight-anonymous-visitor.spec.ts` | เทสต์ว่าไม่มี IP จริงหลุด | — |

ที่ยังเก็บ: ประเทศ · ภูมิภาค/เมืองโดยประมาณจาก Cloudflare · OS · เบราว์เซอร์ · ชนิดอุปกรณ์ · โดเมนที่มา (referer เฉพาะ host) · ภาษา

## ทรัพยากรบน Cloudflare (บัญชี it@enlightfoundation.net)

| ชนิด | ชื่อ | binding |
|---|---|---|
| Worker | `enlight-go` (Workers Builds ต่อกิ่ง `enlight`) | — |
| D1 | `enlight-go-db` (APAC · `21fda72c-b62f-4cca-8d83-02e8b897339f`) | `DB` — ที่เก็บลิงก์ตัวจริง |
| KV | `enlight-go-cache` (`cc491f4d56544e18b971879a05073b1c`) | `KV` — แคชให้ redirect เร็ว |
| Analytics Engine | dataset `sink` | `ANALYTICS` — สถิติการกด |
| R2 · Workers AI | ไม่ใช้ | — |

### ตัวแปรของ Workers Builds (Settings → Build → Variables)

```
DEPLOY_D1_DATABASE_ID=21fda72c-b62f-4cca-8d83-02e8b897339f
DEPLOY_D1_DATABASE_NAME=enlight-go-db
DEPLOY_KV_NAMESPACE_ID=cc491f4d56544e18b971879a05073b1c
NUXT_PUBLIC_HOME_URL=https://enlight.ac
```

Build command `pnpm build` · Deploy command `pnpm deploy:worker` (รัน migration D1 แล้ว deploy)

### ตัวแปรของ Worker

ค่าที่ไม่ลับอยู่ใน `vars` ของ `wrangler.jsonc` (ขึ้นไปกับทุก deploy): `NUXT_REDIRECT_STATUS_CODE=302` (QR ต้องเปลี่ยนปลายทางได้ · 301 เบราว์เซอร์จำถาวร) · `NUXT_PUBLIC_HOME_URL` · `NUXT_DISABLE_BOT_ACCESS_LOG` · `NUXT_DISABLE_AUTO_BACKUP` · `NUXT_CF_ACCOUNT_ID` · `NUXT_CF_ACCESS_TEAM_DOMAIN` · `NUXT_CF_ACCESS_AUD`

ค่าลับตั้งที่ Worker `enlight-go` → Settings → Variables and Secrets เท่านั้น (`keep_vars: true` กัน deploy ลบทิ้ง):

| ชื่อ | ค่า |
|---|---|
| `NUXT_SITE_TOKEN` | สุ่มตอนติดตั้งโดยไม่มีใครเห็นค่า · ใช้เป็น salt ของรหัสผู้เข้าชม (แอดมินล็อกอินผ่าน Access ไม่ใช้รหัสนี้) · เปลี่ยน = สถิติ "ผู้เข้าชมไม่ซ้ำ" ของวันนั้นนับใหม่ |
| `NUXT_CF_API_TOKEN` | Account API token `enlight-go · Account Analytics Read` (Account Analytics: Read อย่างเดียว) |

### Cloudflare Access

แอป self-hosted `go.enlight.ac · แอดมินลิงก์ย่อ` กันเส้นทาง `/dashboard` · `/api` · `/_docs` · ลิงก์ย่อ `/<slug>` เปิดสาธารณะ · ล็อกอินด้วยปุ่ม Google ตัวเดียวกับเว็บคลังคู่มือเกม · ตั๋ว 24 ชั่วโมง · policy `แอดมินลิงก์ย่อ` (Include → Emails รายคน) · Cookie Path ไม่จำกัด · Worker ตรวจ JWT ของ Access ซ้ำอีกชั้นที่ `/api/*`

## อัปเกรดเป็นรุ่นใหม่ของ Sink

1. อ่าน release notes ที่ `miantiao-me/Sink` และ `docs/deployment/upgrading.md`
2. `git fetch upstream --tags && git switch -c upgrade-<รุ่น> enlight && git merge <tag>` · แก้ชนใน `wrangler.jsonc` ให้คงส่วน `Enlight:`
3. `pnpm install && pnpm build && pnpm exec vitest run tests/unit tests/redirect.spec.ts` (เทสต์ `tests/api` บางข้อต้องต่อ Cloudflare จริงหรือ Workers AI → ล้มในเครื่องเป็นปกติ)
4. PR เข้า `enlight` · merge = ขึ้นเว็บ

## สำรอง

ลิงก์อยู่ใน D1 → กู้ย้อนได้ 30 วันด้วย D1 Time Travel (`wrangler d1 time-travel restore enlight-go-db --timestamp=<เวลา>`) · ปุ่ม Export ในหน้าแอดมินได้ JSON ทุกลิงก์
