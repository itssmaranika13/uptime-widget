// api/uptime.js
//
// Deployed on Vercel, this endpoint computes elapsed time from a fixed
// start date FRESH on every request and returns an SVG image styled like
// the "SYSTEM INFO" panel. Because it's calculated at request time (not
// pre-generated), the numbers are accurate to the second whenever this
// URL is loaded or refreshed.

const START = new Date(Date.UTC(2011, 0, 1, 9, 0, 0)); // 9:00 AM, Jan 1 2011 (UTC)
const BUILD = "11.1.1";
const STATUS = "Online";

function pad(n) {
  return String(n).padStart(2, "0");
}

function calcUptime(start, now) {
  let years = now.getUTCFullYear() - start.getUTCFullYear();
  let months = now.getUTCMonth() - start.getUTCMonth();
  let days = now.getUTCDate() - start.getUTCDate();
  let hours = now.getUTCHours() - start.getUTCHours();
  let minutes = now.getUTCMinutes() - start.getUTCMinutes();
  let seconds = now.getUTCSeconds() - start.getUTCSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    const prevMonthLastDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 0)).getUTCDate();
    days += prevMonthLastDay;
    months--;
  }
  if (months < 0) { months += 12; years--; }

  return { years, months, days, hours, minutes, seconds };
}

function buildSvg({ years, months, days, hours, minutes, seconds }) {
  const VERSION = `${years}.${months}.${days}`; // e.g. "15.8.25" = 15 yrs, 8 months, 25 days old
  const values = [years, months, days, hours, minutes, seconds];
  const labels = ["Years", "Months", "Days", "Hours", "Minutes", "Seconds"];

  const segW = 78;
  const sepW = 24;
  const startX = 20;
  const counterY = 205;
  const labelY = 232;

  let counterParts = [];
  let labelParts = [];
  let x = startX;

  values.forEach((val, i) => {
    const cx = x + segW / 2;
    counterParts.push(
      `<text x="${cx.toFixed(1)}" y="${counterY}" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="34" font-weight="bold" fill="#f0f2f5">${pad(val)}</text>`
    );
    labelParts.push(
      `<text x="${cx.toFixed(1)}" y="${labelY}" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="13" fill="#b6bcc6">${labels[i]}</text>`
    );
    x += segW;
    if (i !== values.length - 1) {
      const scx = x + sepW / 2;
      counterParts.push(
        `<text x="${scx.toFixed(1)}" y="${counterY}" text-anchor="middle" font-family="Verdana, Arial, sans-serif" font-size="34" font-weight="bold" fill="#b6bcc6">:</text>`
      );
      x += sepW;
    }
  });

  const totalWidth = x + 20;

  return `<svg width="${totalWidth}" height="270" viewBox="0 0 ${totalWidth} 270" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#0d1117" rx="6"/>
  <text x="20" y="45" font-family="Verdana, Arial, sans-serif" font-size="30" font-weight="bold" fill="#f0f2f5">SYSTEM INFO</text>
  <line x1="20" y1="65" x2="${totalWidth - 20}" y2="65" stroke="#2a2f3a" stroke-width="1"/>
  <text x="20" y="100" font-family="Verdana, Arial, sans-serif" font-size="16" fill="#f0f2f5">Build : ${BUILD}</text>
  <text x="220" y="100" font-family="Verdana, Arial, sans-serif" font-size="16" fill="#f0f2f5">Version : ${VERSION}</text>
  <text x="420" y="100" font-family="Verdana, Arial, sans-serif" font-size="16" fill="#f0f2f5">Status : ${STATUS}</text>
  <text x="20" y="140" font-family="Verdana, Arial, sans-serif" font-size="16" fill="#f0f2f5">Uptime:</text>
  <g>${counterParts.join("")}</g>
  <g>${labelParts.join("")}</g>
  <line x1="20" y1="255" x2="${totalWidth - 20}" y2="255" stroke="#2a2f3a" stroke-width="1"/>
</svg>`;
}

export default function handler(req, res) {
  const now = new Date();
  const uptime = calcUptime(START, now);
  const svg = buildSvg(uptime);

  res.setHeader("Content-Type", "image/svg+xml");
  // Prevent caching so each load/refresh recomputes the live value
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.status(200).send(svg);
}
