const logs = [
  { user: 'Henar.Yc', message: 'Creative vision is unmatched. Pure cinematic excellence.', time: '14:22:07' },
  { user: 'Nouran Waleed', message: 'Great communication and excellent final result.', time: '09:15:33' },
  { user: 'Doaaboellazm', message: 'Best cinematographer I\'ve worked with. Incredible eye.', time: '21:03:44' },
  { user: 'Abu_Hanay', message: ' You really understood the vision and made it even better.', time: '16:47:19' },
  { user: 'Issa_400', message: 'Fares brings ideas to life like no one else can.', time: '11:38:52' },
  { user: 'Abdullah Arafa', message: 'On time, on budget, and always over-delivering quality.', time: '08:01:17' },
];

const doubled = [...logs, ...logs];

export default function SystemLogs() {
  return (
    <section id="logs" className="relative z-20 py-32 overflow-hidden">
      <div className="px-6 md:pl-24 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-primary" />
          <span className="font-mono text-xs text-primary tracking-[0.3em] uppercase">System Logs</span>
        </div>
      </div>

      <div className="relative">
        <div className="marquee-track">
          {doubled.map((log, i) => (
            <div
              key={i}
              className="glass-card terminal-bg flex-shrink-0 w-80 mx-3 p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-mono text-xs text-primary">{log.user}</span>
                <span className="font-mono text-[10px] text-muted-foreground ml-auto">{log.time}</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{log.message}</p>
              <div className="mt-3 font-mono text-[10px] text-muted-foreground">
                {'>'} DECRYPTED · VERIFIED · ARCHIVED
              </div>
            </div>
          ))}
        </div>

        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
