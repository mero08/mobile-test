import { describe, it, expect, vi, beforeEach } from "vitest";

describe("getEmailJsConfig", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns config when all env vars are set", async () => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "service_test");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "template_test");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "key_test");
    const { getEmailJsConfig } = await import("@/config/email");
    expect(getEmailJsConfig()).toEqual({
      serviceId: "service_test",
      templateId: "template_test",
      publicKey: "key_test",
    });
  });

  it("throws when env vars are missing", async () => {
    vi.stubEnv("VITE_EMAILJS_SERVICE_ID", "");
    vi.stubEnv("VITE_EMAILJS_TEMPLATE_ID", "");
    vi.stubEnv("VITE_EMAILJS_PUBLIC_KEY", "");
    const { getEmailJsConfig } = await import("@/config/email");
    expect(() => getEmailJsConfig()).toThrow(/EmailJS/);
  });
});
