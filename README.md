# NMACC — Manufacturing Automation Systems

A single-page, static site for NMACC. Dark, brutalist/industrial aesthetic —
the same design system as the founder profile at
[loay.nmacc.com.au](https://loay.nmacc.com.au), so the two read as siblings.
No build step, no dependencies.

## Structure
```
index.html        All content + markup
css/main.css      Design tokens (dark + light/orange themes), components, responsive
js/main.js        Theme toggle, mobile nav, scroll-reveal, contact-form handler
assets/           OG preview card (+ source HTML)
CNAME             Custom domain for GitHub Pages (nmacc.com.au)
```

## Run locally
```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (GitHub Pages + Cloudflare DNS)
1. Push to a GitHub repo, enable Pages from `main` (root). The `CNAME` file sets
   the custom domain to `nmacc.com.au`.
2. In Cloudflare DNS for `nmacc.com.au`:
   - Apex `nmacc.com.au` → the four GitHub Pages `A` records (185.199.108–111.153)
     and the matching `AAAA` records, **or** an `ALIAS`/`CNAME` flattening to
     `sudipc07.github.io`. Set these records to **DNS only** (grey cloud), not proxied.
   - `loay` subdomain → `CNAME loay` → `sudipc07.github.io` (DNS only) for the
     founder profile site.
3. In the repo settings, tick **Enforce HTTPS** once the cert provisions.

## Contact form (Formspree)
The form is Formspree-ready but not yet connected. Until an endpoint is added,
submitting shows a "not connected" message instead of failing silently. To wire
it: create a form at https://formspree.io and set the `action` on
`#inquiry-form` in `index.html` to `https://formspree.io/f/YOUR_FORM_ID`.

## Notes
- No fabricated client names, staff counts, or contact details by design.
  "Bigger than one person" is carried by the senior-network model, not invented
  headcount.
- Outcome figures come from the founder's real record — update with final
  approved numbers before launch.
