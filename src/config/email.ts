export interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export function getEmailJsConfig(): EmailJsConfig {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error(
      "EmailJS is not configured. Set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY in .env.local"
    );
  }

  return { serviceId, templateId, publicKey };
}

export function isEmailJsConfigured(): boolean {
  try {
    getEmailJsConfig();
    return true;
  } catch {
    return false;
  }
}
