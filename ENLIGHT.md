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

### ตัวแปรของ Worker (Settings → Variables and Secrets)

| ชื่อ | ชนิด | ค่า |
|---|---|---|
| `NUXT_SITE_TOKEN` | Secret | รหัสสำรองของแอดมิน + salt ของรหัสผู้เข้าชม (เปลี่ยนแล้วสถิติ "ผู้เข้าชมไม่ซ้ำ" ของวันนั้นนับใหม่) |
| `NUXT_CF_ACCOUNT_ID` | Variable | `99435c5c35e892dd881591254fd1415c` |
| `NUXT_CF_API_TOKEN` | Secret | กุญแจ Account Analytics: Read อย่างเดียว |
| `NUXT_CF_ACCESS_TEAM_DOMAIN` | Variable | `https://<ทีม>.cloudflareaccess.com` |
| `NUXT_CF_ACCESS_AUD` | Variable | AUD ของแอป Access `go.enlight.ac` |
| `NUXT_REDIRECT_STATUS_CODE` | Variable | `302` — QR ต้องเปลี่ยนปลายทางได้ (301 เบราว์เซอร์จำถาวร) |
| `NUXT_PUBLIC_HOME_URL` | Variable | `https://enlight.ac` — หน้าแรกพาไปเว็บมูลนิธิแทนหน้าแนะนำ Sink |
| `NUXT_DISABLE_BOT_ACCESS_LOG` | Variable | `true` |
| `NUXT_DISABLE_AUTO_BACKUP` | Variable | `true` |

### Cloudflare Access

แอป self-hosted `go.enlight.ac` กันเส้นทาง `/dashboard` · `/api` · `/_docs` · ลิงก์ย่อ `/<slug>` เปิดสาธารณะ · Cookie Path ไม่จำกัด

## อัปเกรดเป็นรุ่นใหม่ของ Sink

1. อ่าน release notes ที่ `miantiao-me/Sink` และ `docs/deployment/upgrading.md`
2. `git fetch upstream --tags && git switch -c upgrade-<รุ่น> enlight && git merge <tag>` · แก้ชนใน `wrangler.jsonc` ให้คงส่วน `Enlight:`
3. `pnpm install && pnpm build && pnpm exec vitest run tests/unit tests/redirect.spec.ts` (เทสต์ `tests/api` บางข้อต้องต่อ Cloudflare จริงหรือ Workers AI → ล้มในเครื่องเป็นปกติ)
4. PR เข้า `enlight` · merge = ขึ้นเว็บ

## สำรอง

ลิงก์อยู่ใน D1 → กู้ย้อนได้ 30 วันด้วย D1 Time Travel (`wrangler d1 time-travel restore enlight-go-db --timestamp=<เวลา>`) · ปุ่ม Export ในหน้าแอดมินได้ JSON ทุกลิงก์
