/**
 * POPELL Visitor Tracker & Real-Time Alert System
 * Detects visitor location, device, referrer, and sends instant pings to Discord & Telegram.
 * Supports dual-phase location:
 * Phase 1: Real-time high-accuracy satellite GPS (if permitted) -> street/district/city accuracy.
 * Phase 2: Cellular ISP Gateway IP geolocation fallback (clearly labeled).
 */

export interface VisitorInfo {
  ip: string;
  location: string;
  locationType: 'GPS Real (Satelit Perangkat)' | 'Estimasi IP Gateway ISP';
  coordinates: {
    lat: number;
    lon: number;
  } | null;
  accuracyMeters?: number;
  mapsUrl: string;
  isp: string;
  deviceType: string;
  os: string;
  browser: string;
  resolution: string;
  referrer: string;
  pageUrl: string;
  timestampWIB: string;
}

const ENCODED_DISCORD_WEBHOOK =
  'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTU2ODcyMDEzODUyMDUwMjQwNS9saHlVMzdSV0pZZXlOdGpacnMtU3FTay05WFRCZENvazdEZ2s3Z05fN2VLd0ZkWDFxRlJHX28xQlRtLUxwMHFBQmloTA==';
const DEFAULT_TELEGRAM_BOT_TOKEN = '';
const DEFAULT_TELEGRAM_CHAT_ID = '';

function decodeEndpoint(b64: string): string {
  try {
    if (typeof atob === 'function' && b64) {
      return atob(b64);
    }
  } catch {
    // Ignore decode error
  }
  return '';
}

function getDiscordWebhook(): string {
  try {
    const fromStorage = localStorage.getItem('popell_discord_webhook');
    if (fromStorage && fromStorage.trim().startsWith('https://')) return fromStorage.trim();
    const envVal = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_DISCORD_WEBHOOK_URL;
    if (envVal && envVal.trim().startsWith('https://')) return envVal.trim();
    const decoded = decodeEndpoint(ENCODED_DISCORD_WEBHOOK);
    if (decoded.trim().length > 0) return decoded.trim();
  } catch {
    // Ignore storage errors
  }
  return '';
}

function detectDeviceAndOS(): { deviceType: string; os: string; browser: string } {
  const ua = navigator.userAgent || '';
  let os = 'Unknown OS';
  let deviceType = 'Desktop';
  let browser = 'Unknown Browser';

  if (/iPhone/i.test(ua)) {
    os = 'iOS (iPhone)';
    deviceType = 'Mobile';
  } else if (/iPad/i.test(ua)) {
    os = 'iPadOS';
    deviceType = 'Tablet';
  } else if (/Android/i.test(ua)) {
    deviceType = /Mobile/i.test(ua) ? 'Mobile' : 'Tablet';
    os = 'Android';
  } else if (/Windows NT 10.0/i.test(ua)) {
    os = 'Windows 10 / 11';
  } else if (/Windows/i.test(ua)) {
    os = 'Windows';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    os = 'macOS';
  } else if (/Linux/i.test(ua)) {
    os = 'Linux';
  }

  if (/Edg\//i.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/OPR\/|Opera/i.test(ua)) {
    browser = 'Opera';
  } else if (/SamsungBrowser/i.test(ua)) {
    browser = 'Samsung Internet';
  } else if (/Chrome\//i.test(ua)) {
    if ((navigator as unknown as { brave?: { isBrave?: () => boolean } }).brave) {
      browser = 'Brave Browser';
    } else {
      browser = 'Google Chrome';
    }
  } else if (/Safari\//i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/Firefox\//i.test(ua)) {
    browser = 'Mozilla Firefox';
  }

  return { deviceType, os, browser };
}

function parseReferrer(ref: string): string {
  if (!ref || ref.trim().length === 0) {
    return 'Kunjungan Langsung (Direct URL / Bookmark / Bio Link)';
  }
  const lower = ref.toLowerCase();
  if (lower.includes('instagram.com') || lower.includes('ig.me')) {
    return 'Instagram (Profil @_kubill)';
  }
  if (lower.includes('tiktok.com')) {
    return 'TikTok (Profil @_ldii1)';
  }
  if (lower.includes('whatsapp') || lower.includes('wa.me')) {
    return 'WhatsApp Chat / Group';
  }
  if (lower.includes('github.com')) {
    return 'GitHub (Repository / Profile Meldi0)';
  }
  if (lower.includes('google.')) {
    return 'Google Search';
  }
  if (lower.includes('t.co') || lower.includes('twitter.com') || lower.includes('x.com')) {
    return 'X (Twitter)';
  }
  if (lower.includes('linkedin.com')) {
    return 'LinkedIn';
  }
  return ref.slice(0, 100);
}

function formatWibTimestamp(): string {
  try {
    const d = new Date();
    return d.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Reverse geocode latitude & longitude via OpenStreetMap Nominatim
 * Provides street, suburb, district (Kecamatan), city, and province in Indonesia
 */
async function reverseGeocodeNominatim(lat: number, lon: number): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&zoom=16&accept-language=id`,
      {
        signal: controller.signal,
        headers: { 'User-Agent': 'POPELL-Portfolio-Tracker/1.0' },
      }
    );
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      const addr = data?.address || {};
      const road = addr.road || addr.street || '';
      const suburb = addr.suburb || addr.village || '';
      const district = addr.district || addr.city_district || '';
      const city = addr.city || addr.regency || addr.town || addr.county || '';
      const state = addr.state || '';
      const country = addr.country || '';

      const parts = [road, suburb, district, city, state, country].filter(
        (p, idx, arr) => Boolean(p) && arr.indexOf(p) === idx
      );
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
  } catch {
    // Fallback to coordinates
  }
  return '';
}

/**
 * Resolves IP-level details (Gateway ISP, IP Address, ASN)
 */
async function resolveIpDetails(): Promise<{
  ip: string;
  isp: string;
  city: string;
  region: string;
  country: string;
  coords: { lat: number; lon: number } | null;
}> {
  let ip = 'Unknown IP';
  let isp = 'Unknown ISP';
  let city = '';
  let region = '';
  let country = 'Indonesia';
  let coords: { lat: number; lon: number } | null = null;

  try {
    const bdcPromise = fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', {
      headers: { Accept: 'application/json' },
    }).then(r => (r.ok ? r.json() : null));

    const ipwhoPromise = fetch('https://ipwho.is/', {
      headers: { Accept: 'application/json' },
    }).then(r => (r.ok ? r.json() : null));

    const [bdcData, ipwhoData] = await Promise.allSettled([bdcPromise, ipwhoPromise]);

    if (ipwhoData.status === 'fulfilled' && ipwhoData.value) {
      const d = ipwhoData.value;
      if (d.ip) ip = String(d.ip);
      if (d.connection) {
        isp = [d.connection.isp, d.connection.org]
          .filter(Boolean)
          .filter((v, i, a) => a.indexOf(v) === i)
          .join(' / ') || isp;
      }
      if (d.city) city = d.city;
      if (d.region) region = d.region;
      if (d.country) country = d.country;
      if (typeof d.latitude === 'number' && typeof d.longitude === 'number') {
        coords = { lat: d.latitude, lon: d.longitude };
      }
    }

    if (bdcData.status === 'fulfilled' && bdcData.value) {
      const bdc = bdcData.value;
      if (bdc.locality || bdc.city) city = bdc.locality || bdc.city;
      if (bdc.principalSubdivision) region = bdc.principalSubdivision;
      if (bdc.countryName) country = bdc.countryName;
      if (!coords && typeof bdc.latitude === 'number' && typeof bdc.longitude === 'number') {
        coords = { lat: bdc.latitude, lon: bdc.longitude };
      }
    }
  } catch {
    // Ignore error
  }

  return { ip, isp, city, region, country, coords };
}

/**
 * Sends formatted alert to Discord Webhook
 */
async function sendToDiscord(webhookUrl: string, info: VisitorInfo, isGpsUpdate = false): Promise<boolean> {
  try {
    const mapsLink = info.coordinates
      ? `https://www.google.com/maps?q=${info.coordinates.lat},${info.coordinates.lon}`
      : 'https://maps.google.com';

    const coordsDisplay = info.coordinates
      ? `${info.coordinates.lat.toFixed(5)}, ${info.coordinates.lon.toFixed(5)}`
      : 'Tidak tersedia';

    const isGps = info.locationType === 'GPS Real (Satelit Perangkat)';

    const payload = {
      username: 'POPELL Radar',
      avatar_url: 'https://raw.githubusercontent.com/Meldi0/aibel-works/main/public/favicon.ico',
      embeds: [
        {
          title: isGpsUpdate
            ? 'Pembaruan Lokasi Real GPS Terverifikasi!'
            : isGps
              ? 'Pengunjung Baru Terdeteksi (GPS Presisi Tinggi)!'
              : 'Pengunjung Baru Terdeteksi (Estimasi Gateway IP)',
          description: isGps
            ? 'Lokasi berhasil diverifikasi secara akurat dari sensor GPS satelit perangkat pengunjung.'
            : 'Seseorang baru saja membuka website portfolio. Lokasi saat ini berasal dari IP Gateway operator seluler/ISP.',
          color: isGps ? 0x10b981 : 0x2563eb,
          fields: [
            {
              name: isGps ? 'Lokasi Satelit GPS (Akurat)' : 'Lokasi Gateway ISP (Estimasi IP)',
              value: `**${info.location}**`,
              inline: false,
            },
            {
              name: 'Titik Peta / Google Maps',
              value: `[Buka di Google Maps](${mapsLink}) (\`${coordsDisplay}\`${info.accuracyMeters ? ` • Akurasi ±${info.accuracyMeters}m` : ''})`,
              inline: false,
            },
            {
              name: 'Provider / ISP',
              value: info.isp,
              inline: true,
            },
            {
              name: 'IP Pengunjung',
              value: `\`${info.ip}\``,
              inline: true,
            },
            {
              name: 'Perangkat',
              value: `${info.deviceType} • ${info.os}`,
              inline: true,
            },
            {
              name: 'Browser',
              value: info.browser,
              inline: true,
            },
            {
              name: 'Resolusi Layar',
              value: info.resolution,
              inline: true,
            },
            {
              name: 'Sumber Trafik (Referrer)',
              value: info.referrer,
              inline: false,
            },
            {
              name: 'Waktu Kunjungan (WIB)',
              value: `${info.timestampWIB} WIB`,
              inline: false,
            },
            ...(!isGps
              ? [
                  {
                    name: 'Catatan Provider Seluler',
                    value:
                      'IP operator seluler (Telkomsel, Indosat, XL, Biznet) sering kali terpusat di server gateway Tangerang/Jakarta. Jika pengunjung mengizinkan GPS, notifikasi akan langsung diperbarui dengan alamat fisik riil.',
                    inline: false,
                  },
                ]
              : []),
          ],
          footer: {
            text: `POPELL Radar • ${info.locationType}`,
          },
        },
      ],
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return res.ok || res.status === 204;
  } catch (err) {
    console.warn('[POPELL Radar] Discord delivery error:', err);
    return false;
  }
}

/**
 * Main Tracker Entry Point
 * Runs with 2-minute debounce per visitor device.
 * Concurrently triggers device GPS sensor while resolving IP fallback.
 */
export async function initVisitorTracker(): Promise<void> {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;

  // Session check
  if (sessionStorage.getItem('popell_visit_tracked')) {
    return;
  }

  // Debounce check: 2 minutes for the same device
  try {
    const lastVisit = localStorage.getItem('popell_last_visit_time');
    if (lastVisit) {
      const diff = Date.now() - parseInt(lastVisit, 10);
      if (diff < 2 * 60 * 1000) {
        sessionStorage.setItem('popell_visit_tracked', 'true');
        return;
      }
    }
  } catch {
    // Ignore storage errors
  }

  sessionStorage.setItem('popell_visit_tracked', 'true');

  try {
    const { deviceType, os, browser } = detectDeviceAndOS();
    const resolution = `${window.screen.width}x${window.screen.height} (DPR ${window.devicePixelRatio || 1})`;
    const referrer = parseReferrer(document.referrer);
    const timestampWIB = formatWibTimestamp();
    const pageUrl = window.location.href;
    const discordWebhook = getDiscordWebhook();

    // 1. Start fetching IP details immediately
    const ipDetailsPromise = resolveIpDetails();

    // 2. Request GPS location directly from browser sensor
    let gpsResolved = false;

    const requestGps = (): Promise<GeolocationPosition | null> => {
      return new Promise(resolve => {
        if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
          resolve(null);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          pos => resolve(pos),
          () => resolve(null),
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      });
    };

    // Race GPS with a 3.5 second window so initial alert is fast
    const gpsPromise = requestGps();
    const gpsTimeoutPromise = new Promise<null>(resolve => setTimeout(() => resolve(null), 3500));

    const earlyGps = await Promise.race([gpsPromise, gpsTimeoutPromise]);
    const ipDetails = await ipDetailsPromise;

    if (earlyGps) {
      // Real GPS obtained immediately!
      gpsResolved = true;
      const { latitude, longitude, accuracy } = earlyGps.coords;
      const osmPlace = await reverseGeocodeNominatim(latitude, longitude);

      const info: VisitorInfo = {
        ip: ipDetails.ip,
        location: osmPlace || `Koordinat GPS (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
        locationType: 'GPS Real (Satelit Perangkat)',
        coordinates: { lat: latitude, lon: longitude },
        accuracyMeters: Math.round(accuracy || 0),
        mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
        isp: ipDetails.isp,
        deviceType,
        os,
        browser,
        resolution,
        referrer,
        pageUrl,
        timestampWIB,
      };

      if (discordWebhook) {
        await sendToDiscord(discordWebhook, info);
        localStorage.setItem('popell_last_visit_time', Date.now().toString());
      }
    } else {
      // Send initial IP Gateway alert
      const fallbackLocation = [ipDetails.city, ipDetails.region, ipDetails.country].filter(Boolean).join(', ');
      const info: VisitorInfo = {
        ip: ipDetails.ip,
        location: fallbackLocation || 'Indonesia',
        locationType: 'Estimasi IP Gateway ISP',
        coordinates: ipDetails.coords,
        mapsUrl: ipDetails.coords
          ? `https://www.google.com/maps?q=${ipDetails.coords.lat},${ipDetails.coords.lon}`
          : 'https://maps.google.com',
        isp: ipDetails.isp,
        deviceType,
        os,
        browser,
        resolution,
        referrer,
        pageUrl,
        timestampWIB,
      };

      if (discordWebhook) {
        await sendToDiscord(discordWebhook, info);
        localStorage.setItem('popell_last_visit_time', Date.now().toString());
      }

      // 3. Keep waiting for GPS in the background if the user taps "Allow" afterwards
      gpsPromise.then(async lateGps => {
        if (lateGps && !gpsResolved) {
          gpsResolved = true;
          const { latitude, longitude, accuracy } = lateGps.coords;
          const osmPlace = await reverseGeocodeNominatim(latitude, longitude);

          const gpsInfo: VisitorInfo = {
            ip: ipDetails.ip,
            location: osmPlace || `Koordinat GPS (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
            locationType: 'GPS Real (Satelit Perangkat)',
            coordinates: { lat: latitude, lon: longitude },
            accuracyMeters: Math.round(accuracy || 0),
            mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
            isp: ipDetails.isp,
            deviceType,
            os,
            browser,
            resolution,
            referrer,
            pageUrl,
            timestampWIB: formatWibTimestamp(),
          };

          if (discordWebhook) {
            await sendToDiscord(discordWebhook, gpsInfo, true);
          }
        }
      });
    }
  } catch (err) {
    console.warn('[POPELL Radar] Tracker encountered an issue:', err);
  }
}
