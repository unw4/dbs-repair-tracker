// WhatsApp Message Template names — must match exactly what's approved in Meta WhatsApp Manager.
// Template "servis_kayit": body text + URL button pointing to APP_URL/track/{{1}}
// Template "servis_hazir": body text + URL button pointing to APP_URL/track/{{1}}
const TEMPLATE_TRACKING = "servis_kayit";
const TEMPLATE_READY = "servis_hazir";
const TEMPLATE_DELIVERED = "servis_tesekkur";

function maskPhone(phone: string): string {
  if (phone.length <= 4) return "****";
  return "*".repeat(phone.length - 4) + phone.slice(-4);
}

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

  if (!/^\d{10,15}$/.test(normalized)) {
    console.warn("[WhatsApp] Invalid phone format for template:", templateName);
    return;
  }

  const payload = {
    messaging_product: "whatsapp",
    to: normalized,
    type: "template",
    template: {
      name: templateName,
      language: { code: "tr" },
      components,
    },
  };

  console.log("[WhatsApp] Sending →", {
    template: templateName,
    to: maskPhone(normalized),
    components,
    phoneNumberId,
  });

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    let responseBody: unknown;
    try {
      responseBody = await res.json();
    } catch {
      responseBody = await res.text().catch(() => "(empty)");
    }

    if (res.ok) {
      console.log("[WhatsApp] Success ✓", {
        template: templateName,
        to: maskPhone(normalized),
        status: res.status,
        response: responseBody,
      });
    } else {
      console.error("[WhatsApp] API Error ✗", {
        template: templateName,
        to: maskPhone(normalized),
        status: res.status,
        response: responseBody,
      });
    }
  } catch (e) {
    console.error("[WhatsApp] Network error ✗", {
      template: templateName,
      to: maskPhone(normalized),
      error: e instanceof Error ? e.message : String(e),
    });
  }
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

export async function sendReadyMessage(phone: string, _ticketId: string) {
  await sendWhatsAppTemplate(phone, TEMPLATE_READY, []);
}

export async function sendDeliveredMessage(phone: string) {
  await sendWhatsAppTemplate(phone, TEMPLATE_DELIVERED, []);
}
