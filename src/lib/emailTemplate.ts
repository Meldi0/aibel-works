export interface EmailTemplateData {
  name: string;
  email: string;
  location: string;
  timezone: string;
  timestamp: string;
  message: string;
  recipientEmail: string;
}

function stripControlChars(raw: string, maxLen = 200): string {
  return raw.replace(/[\r\n\0\t]+/g, ' ').trim().slice(0, maxLen);
}

function sanitizeEmailAddress(raw: string): string {
  const cleaned = stripControlChars(raw, 120);
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(cleaned) ? cleaned : 'invalid@example.com';
}

/**
 * Generates a modern, Apple/Linear-inspired responsive HTML email template
 * using inline CSS tables compatible with Gmail Desktop & Mobile.
 */
export function buildModernHtmlEmail(data: EmailTemplateData): string {
  const cleanEmailRaw = sanitizeEmailAddress(data.email || '-');
  const safeName = escapeHtml(stripControlChars(data.name || 'Pengunjung Portofolio', 80));
  const safeEmail = escapeHtml(cleanEmailRaw);
  const safeLocation = escapeHtml(stripControlChars(data.location || 'Indonesia', 100));
  const safeTimezone = escapeHtml(stripControlChars(data.timezone || 'Asia/Jakarta', 60));
  const safeTimestamp = escapeHtml(stripControlChars(data.timestamp, 80));
  const safeMessage = escapeHtml((data.message || '').slice(0, 2000)).replace(/\n/g, '<br />');
  const replySubject = encodeURIComponent(`Re: Pesan Anda di Portofolio Muhamad Eldi (AIBEL)`);
  const replyMailto = `mailto:${encodeURIComponent(cleanEmailRaw)}?subject=${replySubject}`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pesan Baru dari ${safeName}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#161719;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f0;padding:36px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e4e4df;box-shadow:0 16px 40px rgba(16,17,21,0.06);">
          
          <!-- Dark Editorial Header -->
          <tr>
            <td style="background-color:#0d0f14;padding:30px 34px;color:#f5f4f0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display:inline-block;padding:5px 12px;border-radius:999px;background-color:rgba(104,135,177,0.18);border:1px solid rgba(156,183,219,0.32);color:#b9d0ee;font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">
                      AIBEL PORTFOLIO • DIRECT INBOX
                    </span>
                    <h1 style="margin:14px 0 6px;font-size:24px;font-weight:700;letter-spacing:-0.03em;color:#ffffff;line-height:1.25;">
                      Pesan Baru dari ${safeName}
                    </h1>
                    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">
                      Diterima pada ${safeTimestamp}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sender Identity & Location Summary Grid -->
          <tr>
            <td style="padding:28px 34px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f8f5;border:1px solid #e6e6e1;border-radius:14px;padding:18px 20px;">
                <tr>
                  <td style="padding-bottom:14px;border-bottom:1px solid #e6e6e1;">
                    <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;margin-bottom:4px;">
                      Gmail / Email Pengirim
                    </div>
                    <a href="mailto:${safeEmail}" style="font-size:15px;font-weight:600;color:#2563eb;text-decoration:none;">
                      ${safeEmail}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:14px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" valign="top" style="padding-right:10px;">
                          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;margin-bottom:4px;">
                            Nama Pengirim
                          </div>
                          <div style="font-size:14px;font-weight:600;color:#161719;">
                            ${safeName}
                          </div>
                        </td>
                        <td width="50%" valign="top" style="padding-left:10px;border-left:1px solid #e6e6e1;">
                          <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;margin-bottom:4px;">
                            Lokasi &amp; Zona Waktu
                          </div>
                          <div style="font-size:14px;font-weight:600;color:#161719;">
                            ${safeLocation} <span style="font-weight:400;color:#6b7280;">(${safeTimezone})</span>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Content Body -->
          <tr>
            <td style="padding:16px 34px 28px;">
              <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin-bottom:10px;">
                Isi Pesan
              </div>
              <div style="background-color:#ffffff;border:1px solid #e4e4df;border-left:4px solid #161719;border-radius:12px;padding:20px 22px;font-size:15px;line-height:1.75;color:#1f2937;">
                ${safeMessage}
              </div>
            </td>
          </tr>

          <!-- Action Button: Reply Directly in Gmail -->
          <tr>
            <td style="padding:0 34px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:999px;background-color:#161719;">
                    <a href="${replyMailto}" style="display:inline-block;padding:13px 26px;font-size:13.5px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">
                      Balas ke ${safeName} (${safeEmail}) &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#fafaf7;border-top:1px solid #eaeae5;padding:18px 34px;font-size:12px;color:#6b7280;line-height:1.5;">
              Dikirim langsung dari <strong>Portofolio Resmi Muhamad Eldi (aka AIBEL)</strong> &bull; ${escapeHtml(data.recipientEmail)}
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const GOOGLE_APPS_SCRIPT_SNIPPET = `function doPost(e) {
  var cache = CacheService.getScriptCache();
  if (cache.get("aibel_rate_lock")) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "rate_limited" }));
  }
  var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  if (data._honey) return ContentService.createTextOutput(JSON.stringify({ ok: false }));

  var esc = function(s, max) {
    return String(s || "").replace(/[\\r\\n\\0]+/g, " ").trim().slice(0, max)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  var rawEmail = String(data.email || "").replace(/[\\r\\n\\0\\s<>]+/g, "").slice(0, 120);
  if (!/^[^\\s@<>]+@[^\\s@<>]+\\.[^\\s@<>]{2,}$/.test(rawEmail)) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "invalid_email" }));
  }

  var safeName = esc(data.name || "Pengunjung Portofolio", 80);
  var safeEmail = esc(rawEmail, 120);
  var safeLoc = esc(data.location || "Indonesia", 120);
  var safeTime = esc(data.timestamp || new Date().toLocaleString("id-ID"), 80);
  var safeMsg = String(data.message || "").slice(0, 2000)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\\n/g, "<br />");

  var htmlBody = "<div style='background:#f4f4f0;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;color:#161719;'>"
    + "<div style='max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e4e4df;'>"
    + "<div style='background:#0d0f14;padding:28px 32px;color:#ffffff;'>"
    + "<div style='display:inline-block;padding:4px 12px;border-radius:999px;background:rgba(104,135,177,0.2);color:#b9d0ee;font-size:11px;font-weight:600;letter-spacing:0.08em;'>AIBEL PORTFOLIO • DIRECT INBOX</div>"
    + "<h2 style='margin:14px 0 6px;font-size:22px;color:#ffffff;'>Pesan Baru dari " + safeName + "</h2>"
    + "<div style='font-size:12px;color:#9ca3af;'>Diterima pada " + safeTime + "</div></div>"
    + "<div style='padding:24px 32px;'>"
    + "<div style='background:#f8f8f5;border:1px solid #e6e6e1;border-radius:14px;padding:16px 18px;margin-bottom:20px;'>"
    + "<div style='font-size:11px;text-transform:uppercase;color:#6b7280;font-weight:600;'>Gmail Pengirim</div>"
    + "<div style='font-size:15px;font-weight:600;color:#2563eb;margin:4px 0 12px;'>" + safeEmail + "</div>"
    + "<div style='font-size:11px;text-transform:uppercase;color:#6b7280;font-weight:600;'>Lokasi Pengirim</div>"
    + "<div style='font-size:14px;font-weight:600;color:#161719;margin-top:4px;'>" + safeLoc + "</div></div>"
    + "<div style='font-size:11px;text-transform:uppercase;color:#6b7280;font-weight:600;margin-bottom:8px;'>Isi Pesan</div>"
    + "<div style='background:#ffffff;border:1px solid #e4e4df;border-left:4px solid #161719;border-radius:12px;padding:18px 20px;font-size:15px;line-height:1.7;color:#1f2937;'>" + safeMsg + "</div>"
    + "</div></div></div>";

  cache.put("aibel_rate_lock", "1", 20);
  MailApp.sendEmail({
    to: "muheldinug122@gmail.com",
    subject: "Pesan Portofolio dari " + safeName + " (" + safeEmail + ") — " + safeLoc,
    htmlBody: htmlBody,
    replyTo: rawEmail,
    name: safeName + " (via Portofolio AIBEL)"
  });
  return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
}`;
