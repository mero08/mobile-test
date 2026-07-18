import { useState, useRef } from 'react';
import { Mail, ArrowUpRight, MessageCircle, Send, Terminal, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { getEmailJsConfig, isEmailJsConfigured } from '@/config/email';

export default function ContactSection() {
  const emailConfigured = isEmailJsConfigured();
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus('sending');

    try {
      const { serviceId, templateId, publicKey } = getEmailJsConfig();
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
      setStatus('sent');
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section id="contact" className="relative z-20 py-32 px-6 md:pl-24 pointer-events-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase">Contact</span>
          <div className="w-8 h-px bg-primary" />
        </div>

        <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-center">
          Let's create something <span className="text-gold-gradient">extraordinary</span>
        </h2>
        <p className="text-muted-foreground mb-12 max-w-lg mx-auto text-center">
          Available for freelance projects, collaborations, and creative partnerships.
        </p>

        {/* Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="https://wa.me/201032044045"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-hover
            className="relative z-30 pointer-events-auto inline-flex items-center gap-3 px-8 py-4 glass-card group hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_30px_hsl(43_100%_55%/0.15)]"
          >
            <MessageCircle className="w-5 h-5 text-primary" />
            <span className="font-mono text-sm text-foreground tracking-wide">Message on WhatsApp</span>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=faresmohmed20168@gmail.com&su=طلب%20مشروع%20جديد&body=أهلاً%20فارس،%0D%0A%0D%0Aأنا%20حابب%20أتكلم%20معاك%20بخصوص..."
                data-mailto="mailto:faresmohmed20168@gmail.com?subject=Portfolio%20Inquiry%20-%20New%20Project&body=Hello%20Fares%2C%0D%0A%0D%0AI%20found%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.%0D%0A%0D%0AProject%20Details%3A%0D%0A-%20%0D%0A%0D%0ABudget%3A%0D%0A-%20%0D%0A%0D%0ADeadline%3A%0D%0A-%20%0D%0A%0D%0AThank%20you!"
                target="_blank"
            data-cursor-hover
            className="relative z-30 pointer-events-auto inline-flex items-center gap-3 px-8 py-4 glass-card group hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_30px_hsl(43_100%_55%/0.15)]"
          >
            <Mail className="w-5 h-5 text-primary" />
            <span className="font-mono text-sm text-foreground tracking-wide">Direct Email</span>
            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
          </a>
        </div>

        {/* Terminal Contact Form */}
        {!emailConfigured && (
          <p className="text-center font-mono text-xs text-destructive mb-4">
            Contact form disabled: EmailJS env vars not set.
          </p>
        )}
        <div className="relative z-30 pointer-events-auto max-w-2xl mx-auto glass-card terminal-bg overflow-hidden crt-flicker">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-primary/40" />
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
            <span className="ml-3 font-mono text-xs text-muted-foreground tracking-wide flex items-center gap-2">
              <Terminal className="w-3 h-3" /> contact_terminal.sh
            </span>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
            <div>
              <label className="font-mono text-xs text-primary mb-2 block tracking-wide">
                {'>'} NAME
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Fares Azab"
                className="relative z-40 pointer-events-auto w-full bg-transparent border border-border rounded-lg px-4 py-3 text-base md:text-sm text-foreground font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_hsl(43_100%_55%/0.15)] transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="font-mono text-xs text-primary mb-2 block tracking-wide">
                  {'>'} EMAIL
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  placeholder="you@example.com"
                  className="relative z-40 pointer-events-auto w-full bg-transparent border border-border rounded-lg px-4 py-3 text-base md:text-sm text-foreground font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_hsl(43_100%_55%/0.15)] transition-all duration-300"
                />
              </div>
              <div>
                <label className="font-mono text-xs text-primary mb-2 block tracking-wide">
                  {'>'} PHONE
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="+20 xxx xxx xxxx"
                  className="relative z-40 pointer-events-auto w-full bg-transparent border border-border rounded-lg px-4 py-3 text-base md:text-sm text-foreground font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_hsl(43_100%_55%/0.15)] transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-primary mb-2 block tracking-wide">
                {'>'} MESSAGE
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                maxLength={1000}
                rows={4}
                placeholder="Tell me about your project..."
                className="relative z-40 pointer-events-auto w-full bg-transparent border border-border rounded-lg px-4 py-3 text-base md:text-sm text-foreground font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:shadow-[0_0_15px_hsl(43_100%_55%/0.15)] transition-all duration-300 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending' || !emailConfigured}
              data-cursor-hover
              className="relative z-40 pointer-events-auto w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-mono text-sm uppercase tracking-widest rounded-lg hover:shadow-[0_0_30px_hsl(43_100%_55%/0.25)] transition-all duration-500 disabled:opacity-60"
            >
              {status === 'sending' && <Send className="w-4 h-4 animate-pulse" />}
              {status === 'sent' && <CheckCircle className="w-4 h-4" />}
              {status === 'error' && <AlertCircle className="w-4 h-4" />}
              {status === 'idle' && <Send className="w-4 h-4" />}
              {status === 'idle' && 'SEND TRANSMISSION'}
              {status === 'sending' && 'TRANSMITTING...'}
              {status === 'sent' && 'TRANSMISSION SENT'}
              {status === 'error' && 'TRANSMISSION FAILED'}
            </button>
          </form>
        </div>

        <div className="mt-20 pt-8 border-t border-border text-center">
          <p className="font-mono text-xs text-muted-foreground tracking-widest">
            © 2025 FARES AZAB · POWERED BY MARWAN ELMOHAMMADI
          </p>
        </div>
      </div>
    </section>
  );
}
