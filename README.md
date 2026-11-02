# Smile Corner Shop

Independent bookstore and creative studio site. Static HTML, CSS, and JavaScript, with no backend or payment collection.

## Pages
- `index.html`: public home and project highlights
- `books.html`: searchable book catalog with categories
- `book-how-to-build-a-pc.html`, `book-poisonous-plants.html`: existing book-detail pages
- `ai-studio.html`, `ai-studio.js`: local-only creative brief maker (no AI API)
- `404.html`: missing-page navigation
- `style.css`: responsive visual theme

## Publication
For GitHub Pages: repository Settings → Pages → **Deploy from a branch** → `main` → `/(root)` → Save. GitHub Pages deployment must be confirmed in settings and at the public website; pushing these files alone does not verify publication.

## Before promoting the site
1. Open the site on mobile and desktop and test navigation, book search, and AI Studio.
2. Replace cover placeholders with cleared, properly licensed original images.
3. Verify the correct author name and each Amazon product link. Never label drafts as published.
4. Add a real contact channel and appropriate privacy/policy pages before accepting submissions or payments.
5. Direct checkout is **not configured**. Do not collect card information on this static site.
6. Do not publish confidential technology research or unpublished manuscript contents without approval.

Status: site code and navigation prepared; live hosting and public URL not yet verified.



## 2026-11-03 catalog, contact and local AI

- `catalog.json` records 9 title/ASIN mappings from the owner's publication records. `books.html` contains 15 direct edition links and Amazon-provided covers. Price and availability remain on Amazon. One conflicting author/title mapping is left pending.
- `contact-config.json`: set `email` only to the owner's expressly approved public business address. Empty by default. `contact.js` validates the address and keeps the mail button disabled until configured. The visitor must send the message in their email app; the site never claims delivery.
- `local-ai.js` and `local-ai-worker.js`: WebLLM 0.2.87, Qwen2.5 0.5B, real local WebGPU inference in a Worker. No API key or paid inference service. Model download begins only after the visitor clicks start. Includes progress, streaming, stop, recent context, copy/export and compatibility/error states. Chat is tab-memory only; model cache may persist.
- Lightweight model output needs review. This is not a server, autonomous publisher, or replacement for a large hosted model. The preview environment did not expose WebGPU, so a real-device generation check is still required.
- UI checks covered search, edition URLs, contact summary generation, missing recipient behavior and unsupported-GPU behavior. All changed JS passed syntax checks.
- External AI runtime: https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.87/+esm ; official documentation: https://webllm.mlc.ai/docs/user/basic_usage.html .
