# RIO Website — Prototype (Concept G)

Prototype pixel-perfect dựng từ Figma cho **RIO Sustainable Branding**, định vị *Branding · A.Better.World*.
HTML/CSS/JS thuần, không build step.

🔗 Live: https://docteurmeo.github.io/rio-website/

## Trang
| File | Mô tả |
|------|-------|
| `index.html` | Home — hero icon grid, highlight projects, clients, what-we-do, footer |
| `work.html` | Danh sách dự án (gallery masonry + filter) |
| `contact.html` | Form liên hệ |
| `a-better-world.html` | Trải nghiệm A Better World — vành đai SVG 3D + morph snap-scroll R·I·O |

## Cấu trúc
- `assets/` — SVG/PNG export từ Figma, font self-host (`fonts/Anybody.ttf`, `fonts/RIOPHOONGBETA.otf`)
- `output/` — 46 icon SVG dùng cho hero grid
- `server.mjs` — static server đơn giản (chỉ dùng Node built-in), phục vụ local

## Chạy local
```bash
node server.mjs   # → http://127.0.0.1:8899/index.html
```

> Script sinh icon từ Figma (potrace/sharp, figma-plugin…) nằm ngoài repo này, trong `_tooling/` của workspace.
