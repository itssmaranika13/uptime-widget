# Live Uptime SVG Endpoint

A tiny serverless function that returns an SVG "SYSTEM INFO" panel. The
uptime is calculated fresh on every request (not pre-generated), so it's
accurate to the second whenever the image is loaded or refreshed.

## Deploy to Vercel (free)

1. Create a free account at https://vercel.com (sign in with GitHub).
2. Push this folder to a new GitHub repo (or upload it directly in the
   Vercel dashboard via "Add New Project" → "Import").
3. Vercel auto-detects the `api/uptime.js` file as a serverless function.
   No build config needed — just click Deploy.
4. Once deployed, your endpoint will be live at:
   `https://<your-project-name>.vercel.app/api/uptime`

## Embed it in your README

```html
<img src="https://<your-project-name>.vercel.app/api/uptime" alt="System Info" />
```

## Notes on "live"

- Every time someone loads your GitHub profile, GitHub's image proxy
  (Camo) fetches this URL and the function computes the exact elapsed
  time at that instant — accurate to the second at load time.
- It won't visibly tick while someone stares at the image without
  refreshing (that would require JavaScript, which GitHub strips from
  READMEs) — but every fresh page load shows a fresh, correct value.
- The `Cache-Control: no-store` header tells Camo not to serve a stale
  cached copy, so reloads should reflect updated numbers.
