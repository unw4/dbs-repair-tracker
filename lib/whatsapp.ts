// WhatsApp Message Template names — must match exactly what's approved in Meta WhatsApp Manager.
// Template "servis_kayit": body text + URL button pointing to APP_URL/track/{{1}}
// Template "servis_hazir": body text + URL button pointing to APP_URL/track/{{1}}
const TEMPLATE_TRACKING = "servis_kayit";
const TEMPLATE_READY = "servis_hazir";

async function sendWhatsAppTemplate(
  phone: string,
  templateName: string,
  components: object[]
) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) return;

  const normalized = phone
    .replace(/\s+/g, "")
    .replace(/^\+/, "")
    .replace(/^0/, "90");

  const res = await fetch(
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
        type: "template",
        template: {
          name: templateName,
          language: { code: "tr" },
          components,
        },
      }),
    }
  );
  const data = await res.json();
  console.log("[WhatsApp]", templateName, res.status, JSON.stringify(data));
}

export async function sendTrackingMessage(phone: string, ticketId: string) {
  await sendWhatsAppTemplate(phone, TEMPLATE_TRACKING, [
    {
      type: "button",
      sub_type: "url",
      index: 0,
      parameters: [{ type: "text", text: ticketId }],
    },
  ]);
}

export async function sendReadyMessage(phone: string, ticketId: string) {
  await sendWhatsAppTemplate(phone, TEMPLATE_READY, []);
}
