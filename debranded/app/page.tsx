"use client";

import { useState, useEffect, useRef, startTransition } from "react";
import Image from "next/image";

// ─── 10-day rolling countdown (auto-restarts) ───────────────────────────────
const DURATION_MS = 10 * 24 * 60 * 60 * 1000;

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function msToTimeLeft(ms: number): TimeLeft {
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(ms / 86_400_000),
    hours:   Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000)  / 60_000),
    seconds: Math.floor((ms % 60_000)     / 1_000),
  };
}

function initTarget(): number {
  const stored = localStorage.getItem("db_launch_target");
  const parsed = stored ? Number(stored) : NaN;
  if (!isNaN(parsed) && parsed > Date.now()) return parsed;
  const target = Date.now() + DURATION_MS;
  localStorage.setItem("db_launch_target", String(target));
  return target;
}

const pad = (n: number) => String(n).padStart(2, "0");

// ─── Progress Items ──────────────────────────────────────────────────────────
const PROGRESS_ITEMS = [
  { label: "Platform Infrastructure",     pct: 85 },
  { label: "Brand Architecture",          pct: 93 },
  { label: "Growth Engine (Antigravity)", pct: 68 },
];
const OVERALL_PCT = Math.round(
  PROGRESS_ITEMS.reduce((s, i) => s + i.pct, 0) / PROGRESS_ITEMS.length
);

// ─── Social Links ────────────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  {
    name: "Instagram",
    handle: "@scalewithdebranded",
    href: "https://instagram.com/scalewithdebranded",
    color: "#E1306C",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    handle: "@scalewithdebranded",
    href: "https://tiktok.com/@scalewithdebranded",
    color: "#69C9D0",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.73a8.19 8.19 0 004.84 1.56V6.85a4.85 4.85 0 01-1.07-.16z" />
      </svg>
    ),
  },
  {
    name: "X / Twitter",
    handle: "@debranded_hq",
    href: "https://x.com/debranded_hq",
    color: "#FFFFFF",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    handle: "@DEBRANDED",
    href: "https://youtube.com/@DEBRANDED",
    color: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    handle: "DEBRANDED",
    href: "https://wa.me/message/debranded",
    color: "#25D366",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    handle: "@debranded",
    href: "https://facebook.com/debranded",
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

// ─── Sparkle positions (deterministic) ──────────────────────────────────────
const SPARKLES = Array.from({ length: 16 }, (_, i) => ({
  left:     `${(i * 6.7 + 2.1) % 95}%`,
  top:      `${(i * 11.3 + 4.7) % 90}%`,
  delay:    `${(i * 0.55) % 5}s`,
  duration: `${2.8 + (i % 5) * 0.6}s`,
  size:     i % 3 === 0 ? "3px" : "2px",
}));

// ─── Countdown Tile ──────────────────────────────────────────────────────────
function CountdownTile({ value, label, delay }: { value: number; label: string; delay: string }) {
  return (
    <div className={`glass-card animate-fade-up ${delay} flex flex-col items-center justify-center px-3 py-4 lg:px-5 lg:py-5 flex-1 min-w-0`}>
      <div className="overflow-hidden h-12 lg:h-16 flex items-center justify-center" style={{ perspective: "600px" }}>
        <span
          key={value}
          className="animate-flip-in block font-black text-4xl lg:text-5xl leading-none tracking-tight text-white tabular-nums"
          style={{ textShadow: "0 0 30px rgba(255,255,255,0.30), 0 0 60px rgba(0,212,255,0.15)" }}
        >
          {pad(value)}
        </span>
      </div>
      <span className="mt-1.5 text-[9px] lg:text-[10px] font-bold tracking-[0.28em] uppercase text-white/50">
        {label}
      </span>
    </div>
  );
}

// ─── Progress Bar ────────────────────────────────────────────────────────────
function ProgressBar({ pct, delay }: { pct: number; delay: string }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="relative h-1.5 w-full rounded-full bg-white/6 overflow-hidden">
      <div
        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-2000 ease-out neon-bar-fill ${delay}`}
        style={{ width: animated ? `${pct}%` : "0%" }}
      />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 10, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const targetRef = useRef(0);

  useEffect(() => {
    startTransition(() => setMounted(true));
    targetRef.current = initTarget();
    setTimeLeft(msToTimeLeft(targetRef.current - Date.now()));

    const id = setInterval(() => {
      const remaining = targetRef.current - Date.now();
      if (remaining <= 1000) {
        const next = Date.now() + DURATION_MS;
        targetRef.current = next;
        localStorage.setItem("db_launch_target", String(next));
      }
      setTimeLeft(msToTimeLeft(targetRef.current - Date.now()));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="relative w-full overflow-hidden flex flex-col"
      style={{ background: "#06060e", minHeight: "100vh" }}
    >
      {/* Scan line */}
      <div className="scan-line" />

      {/* Background grid */}
      <div className="grid-bg absolute inset-0 pointer-events-none" />

      {/* Sparkles */}
      {SPARKLES.map((s, i) => (
        <div key={i} className="sparkle" style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.duration }} />
      ))}

      {/* Ambient blobs */}
      <div className="blob animate-blob" style={{ width: "640px", height: "640px", background: "rgba(0,212,255,0.08)",   top: "-18%", left: "-12%",  animationDelay: "0s",  animationDuration: "12s" }} />
      <div className="blob animate-blob" style={{ width: "520px", height: "520px", background: "rgba(139,92,246,0.10)", top: "28%",  right: "-14%", animationDelay: "4s",  animationDuration: "10s" }} />
      <div className="blob animate-blob" style={{ width: "420px", height: "420px", background: "rgba(236,72,153,0.07)", bottom: "4%", left: "28%",  animationDelay: "8s",  animationDuration: "14s" }} />
      <div className="blob animate-blob" style={{ width: "280px", height: "280px", background: "rgba(255,255,255,0.025)", top: "55%", left: "10%",  animationDelay: "2s",  animationDuration: "9s" }} />

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col w-full max-w-7xl mx-auto px-6 lg:px-14 pt-8 lg:pt-10 pb-6 flex-1">

        {/* LOGO HEADER */}
        <header className="flex flex-col items-center mb-8 lg:mb-10">
          <div className="flex flex-col items-center gap-4 mb-2">
            <div
              className="relative rounded-2xl overflow-hidden flex-shrink-0"
              style={{
                width: "96px",
                height: "96px",
                border: "2px solid rgba(255,255,255,0.40)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.10), 0 0 40px rgba(255,255,255,0.18), 0 0 80px rgba(255,255,255,0.06), 0 12px 40px rgba(0,0,0,0.70)",
              }}
            >
              <Image
                src="/logo-mark.png"
                alt="DEBRANDED logo"
                width={96}
                height={96}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <h1
              className="text-3xl lg:text-4xl font-black tracking-[0.22em] text-white text-center animate-glow-white"
              style={{ textShadow: "0 0 28px rgba(255,255,255,0.50), 0 0 64px rgba(255,255,255,0.18)" }}
            >
              DEBRANDED
            </h1>
          </div>
          <p className="text-[10px] font-bold tracking-[0.38em] uppercase text-white/50 text-center">
            Tech Growth Architects
          </p>
        </header>

        {/* TWO-COLUMN GRID */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 w-full items-center flex-1">

          {/* LEFT — COMING SOON + tagline */}
          <div className="flex flex-col">
            <h2
              className="font-black uppercase leading-[0.88] tracking-tight animate-fade-up delay-100"
              style={{ fontSize: "clamp(3.5rem, 8vw, 7.5rem)" }}
            >
              <span className="text-gradient block">COMING</span>
              <span className="text-stroke-white block mt-1">SOON</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm lg:text-[15px] text-white/65 leading-[1.7] animate-fade-up delay-200">
              We are putting the finishing touches on something that will completely{" "}
              <span className="text-white font-semibold">redefine</span> how tech
              products grow.{" "}
              <span className="text-white/80">The wait is almost over.</span>
            </p>
          </div>

          {/* RIGHT — Countdown + Progress + Social */}
          <div className="flex flex-col gap-6">

            {/* COUNTDOWN */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.32em] uppercase text-white/45 mb-3 animate-fade-up delay-300">
                LAUNCHING IN
              </p>
              <div className="flex items-stretch gap-2.5 w-full">
                <CountdownTile value={timeLeft.days}    label="Days"    delay="delay-400" />
                <div className="flex items-center font-black text-2xl select-none self-center text-white/15">:</div>
                <CountdownTile value={timeLeft.hours}   label="Hours"   delay="delay-500" />
                <div className="flex items-center font-black text-2xl select-none self-center text-white/15">:</div>
                <CountdownTile value={timeLeft.minutes} label="Minutes" delay="delay-600" />
                <div className="flex items-center font-black text-2xl select-none self-center text-white/15">:</div>
                <CountdownTile value={timeLeft.seconds} label="Seconds" delay="delay-700" />
              </div>
            </div>

            {/* LAUNCH PROGRESS */}
            <div className="glass-card p-5 animate-fade-up delay-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/55">
                  Launch Readiness
                </span>
                <span className="text-sm font-black text-white">{OVERALL_PCT}%</span>
              </div>
              <ProgressBar pct={OVERALL_PCT} delay="delay-800" />
              <div className="mt-4 space-y-3">
                {PROGRESS_ITEMS.map((item, i) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-white/55">{item.label}</span>
                      <span className="text-[10px] font-bold text-white">{item.pct}%</span>
                    </div>
                    <ProgressBar pct={item.pct} delay={`delay-${800 + i * 100}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* SOCIAL HANDLES */}
            <div className="animate-fade-up delay-1000">
              <p className="text-[10px] font-bold tracking-[0.32em] uppercase text-white/45 mb-3">
                JOIN THE MOVEMENT
              </p>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${social.name} — ${social.handle}`}
                    className="group social-pill glass-card flex items-center gap-2 px-3 py-2
                      transition-all duration-300 hover:scale-105 hover:border-white/20"
                    style={{ borderRadius: "100px" }}
                  >
                    <span
                      className="transition-all duration-300 text-white/35 group-hover:scale-110"
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = social.color)}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "")}
                    >
                      {social.icon}
                    </span>
                    <span className="text-[11px] font-semibold text-white/55 group-hover:text-white transition-colors duration-300">
                      {social.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/5 py-4">
        <p className="text-center text-[10px] text-white/20 tracking-widest uppercase">
          © 2026 DEBRANDED · All rights reserved · Built by{" "}
          <span className="text-white/35">Kingsley Maduabuchi</span>
        </p>
      </footer>
    </div>
  );
}
