export async function sendTrackingMessage(phone: string, ticketId: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const appUrl = process.env.APP_URL;

  if (!phoneNumberId || !accessToken || !appUrl) return;

  // Türkiye numaralarını uluslararası formata çevir (05XX → 905XX)
  const normalized = phone
    .replace(/\s+/g, "")
    .replace(/^\+/, "")
    .replace(/^0/, "90");

  const trackingUrl = `${appUrl}/track/${ticketId}`;
  const body =
    `Merhaba! Cihazınız servis takip sistemimize kaydedildi.\n\n` +
    `Takip linkiniz: ${trackingUrl}\n\n` +
    `Bu link üzerinden servis durumunuzu anlık takip edebilirsiniz.\n` +
    `— Denizli Bilgisayar Sistemleri`;

  await fetch(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: normalized,
        type: "text",
        text: { body },
      }),
    }
  );
}

export async function sendReadyMessage(phone: string, ticketId: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const appUrl = process.env.APP_URL;

  if (!phoneNumberId || !accessToken || !appUrl) return;

  const normalized = phone
    .replace(/\s+/g, "")
    .replace(/^\+/, "")
    .replace(/^0/, "90");

  const trackingUrl = `${appUrl}/track/${ticketId}`;
  const body =
    `Merhaba! Cihazınız servisten çıkmış ve teslime hazır durumdadır. 🎉\n\n` +
    `Takip linkiniz: ${trackingUrl}\n\n` +
    `Cihazınızı mesai saatlerimiz içinde teslim alabilirsiniz.\n` +
    `— Denizli Bilgisayar Sistemleri`;

  await fetch(
    `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: normalized,
        type: "text",
        text: { body },
      }),
    }
  );
}
