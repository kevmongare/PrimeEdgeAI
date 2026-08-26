import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";

/* ─────────────────────────────────────────
   IMAGES
───────────────────────────────────────── */
const IMG = {
  logo:      "/PrimeEdge_AI_Logo-removebg-preview.png",   // ← place your logo in /public
  hero:      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1800&q=85&auto=format&fit=crop",
  ai:        "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&q=80&auto=format&fit=crop",
  training:  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&q=80&auto=format&fit=crop",
  web:       "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&q=80&auto=format&fit=crop",
  analytics: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop",
  about:     "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80&auto=format&fit=crop",
  divider:   "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1800&q=80&auto=format&fit=crop",
};

const PRIMARY_COLOR = "#6B8CFF";
const SECONDARY_COLOR = "#C9A84C";

/* ─────────────────────────────────────────
   SINGLE SOURCE OF TRUTH FOR CONTACT INFO
   (fixes the mismatched UK/Kenya numbers)
   Replace with your real, verified details.
───────────────────────────────────────── */
const CONTACT = {
  location: "Nairobi, Kenya",
  phone: "+254 735 159 159",
  phoneHref: "tel:+254735159159",
  whatsappHref: "https://wa.me/254735159159?text=Hello%21%20I%27m%20interested%20in%20your%20services.",
  email: "info@primeedgeai.com",
  hours: "Mon–Fri, 8am–6pm EAT",
  formEndpoint: "https://primeedgeai.app.n8n.cloud/webhook/contact",
};

function openContactSession(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const open = () => window.dispatchEvent(new Event("primeedge:open-contact"));
  if (window.location.pathname !== "/") {
    window.history.pushState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.setTimeout(open, 0);
  } else {
    open();
  }
}

function servicePath(id: string) {
  const item = SERVICE_NAV_ITEMS.find(service => service.id === id);
  return `/${item?.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ?? id}`;
}

function navigateService(id: string) {
  window.history.pushState({}, "", servicePath(id));
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openServicePage(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  navigateService(id);
}

const SERVICE_NAV_ITEMS = [
  { id: "ai-education", label: "AI Education & Training" },
  { id: "ai-consulting", label: "AI Implementation Consulting" },
  { id: "ai-automation", label: "AI Automation" },
  { id: "ai-saas", label: "Custom AI SaaS" },
  { id: "website-creation", label: "Website Creation" },
  { id: "data-analytics", label: "Data Analytics" },
];

/* ─────────────────────────────────────────
   FONT INJECTION  (Space Grotesk + Inter + Cormorant Garamond)
   Cormorant Garamond was referenced in CSS but never loaded before —
   every serif/italic headline was silently falling back to Georgia.
───────────────────────────────────────── */
if (!document.head.querySelector("[data-pe-fonts]")) {
  const l = document.createElement("link");
  l.setAttribute("data-pe-fonts", "true");
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap";
  document.head.appendChild(l);
}

/* Custom CSS injected once for things Tailwind can't express inline */
if (!document.head.querySelector("[data-pe-css]")) {
  const style = document.createElement("style");
  style.setAttribute("data-pe-css", "true");
  style.textContent = `
    :root { scroll-behavior: smooth; color-scheme: dark; }
    html, body, #root { background-color: #080810 !important; color: #F0F0F8; }
    body  { overflow-x: hidden; margin: 0; padding: 0; }
    .font-brand   { font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif !important; }
    .font-serif   { font-family: 'Cormorant Garamond', Georgia, serif !important; }
    .font-sans-pe { font-family: 'Inter', system-ui, sans-serif !important; }
    .hero-grad-l  { background: linear-gradient(105deg, rgba(8,8,16,.98) 38%, rgba(8,8,16,.6) 65%, transparent 100%); }
    .hero-grad-b  { background: linear-gradient(to top, rgba(8,8,16,1) 0%, transparent 100%); }
    .hero-glow    { background: radial-gradient(ellipse, rgba(107,140,255,.18) 0%, transparent 65%); }
    .img-dark     { filter: saturate(.4) brightness(.22); }
    .glass-panel  { background: rgba(0,0,0,.56); border: 1px solid rgba(0,0,0,.24); backdrop-filter: blur(30px); box-shadow: 0 48px 150px rgba(0,0,0,.60); }
    .glass-panel::before { content: ""; position: absolute; inset: 0; border-radius: 36px; pointer-events: none; background: linear-gradient(150deg, rgba(0,0,0,.08), rgba(0,0,0,.24)); opacity: .18; }
    .glass-panel::after { content: ""; position: absolute; inset: 0; border-radius: 36px; pointer-events: none; box-shadow: inset 0 0 0 1px rgba(0,0,0,.28), inset 0 0 28px rgba(0,0,0,.20); }
    .navbar-panel { background: rgba(0,0,0,.78); border: 1px solid rgba(0,0,0,.24); backdrop-filter: blur(32px); box-shadow: 0 24px 110px rgba(0,0,0,.54); }
    .navbar-panel::before { content: ""; position: absolute; inset: 0; border-radius: 999px; pointer-events: none; background: linear-gradient(120deg, rgba(0,0,0,.08), rgba(0,0,0,0)); }
    .navbar-ambient { position: absolute; inset: 0; pointer-events: none; }
    .navbar-ambient .orb { position: absolute; border-radius: 999px; filter: blur(80px); opacity: .65; }
    .navbar-ambient .orb-purple { background: rgba(115,105,255,.32); }
    .navbar-ambient .orb-indigo { background: rgba(45,55,160,.26); }
    .nav-link-hover { color: rgba(255,255,255,.75); }
    .nav-link-hover:hover { color: #ffffff !important; text-shadow: 0 0 18px rgba(107,140,255,.22); }
    .nav-cta { transition: box-shadow .3s ease, transform .3s ease, background .2s ease, color .2s ease; }
    .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 22px 70px rgba(62,88,255,.28); background: ${PRIMARY_COLOR} !important; color: #fff !important; }
    .nav-cta:active { transform: translateY(0); }
    .btn-accent { transition: background .2s ease, box-shadow .2s ease; }
    .btn-accent:hover   { background: #4a6ef0 !important; box-shadow: 0 12px 48px rgba(107,140,255,.35); }
    .btn-outline:hover  { border-color: rgba(255,255,255,.4) !important; color: #F0F0F8 !important; }
    .logo-pill { box-shadow: inset 0 0 0 1px rgba(255,255,255,.07); }
    .section-panel { background: rgba(0,0,0,.64); border: 1px solid rgba(255,255,255,.05); backdrop-filter: blur(30px); box-shadow: 0 28px 100px rgba(0,0,0,.42); }
    .section-panel::before { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; background: linear-gradient(135deg, rgba(255,255,255,.04), rgba(255,255,255,0)); opacity: .08; }
    .section-panel::after { content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; box-shadow: inset 0 0 0 1px rgba(255,255,255,.025), inset 0 0 24px rgba(255,255,255,.02); }
    .img-service  { filter: brightness(.65) saturate(.5); transition: filter .4s, transform .5s; }
    .service-card:hover .img-service { filter: brightness(.85) saturate(.75); transform: scale(1.04); }
    .img-about    { filter: brightness(.65) saturate(.5); }
    .img-divider  { filter: brightness(.2) saturate(.3); }
    .footer-link:hover    { color: #F0F0F8 !important; }
    .process-step:hover   { background: #0e0e1a !important; }
    .wa-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(37,211,102,.5); }
    .faq-trigger:hover { color: #F0F0F8 !important; }
    input:focus, select:focus, textarea:focus { border-color: ${PRIMARY_COLOR} !important; }
    .contact-modal-backdrop { animation: contact-fade-in .22s ease-out both; }
    .contact-modal-card { animation: contact-rise-in .3s cubic-bezier(.2,.8,.2,1) both; }
    .contact-modal-card input, .contact-modal-card select, .contact-modal-card textarea { border-radius: 10px !important; background: rgba(255,255,255,.045) !important; border-color: rgba(255,255,255,.1) !important; }
    .contact-modal-card input:hover, .contact-modal-card select:hover, .contact-modal-card textarea:hover { border-color: rgba(255,255,255,.22) !important; }
    .contact-modal-card button[type="submit"] { border-radius: 10px !important; }
    @keyframes contact-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes contact-rise-in { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .service-page-enter { animation: service-page-enter .55s cubic-bezier(.2,.8,.2,1) both; }
    @keyframes service-page-enter { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
    @media (prefers-reduced-motion: reduce) {
      * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
    }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────
   SCROLL-REVEAL HOOK
───────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis] as const;
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(24px)",
        transition: `opacity .7s ease ${delay}s, transform .7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   KICKER  (gold line + label)
───────────────────────────────────────── */
function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="inline-block w-6 h-px bg-[#C9A84C]" />
      <span className="text-[#C9A84C] text-[0.64rem] font-medium tracking-[.2em] uppercase font-sans-pe">
        {children}
      </span>
    </div>
  );
}

/* Standard CTA copy used everywhere so the ask stays consistent site-wide */
const CTA_LABEL = "Book a Free Consultation";

/* ─────────────────────────────────────────
   LOGO — text-based brand mark matching the sample
───────────────────────────────────────── */
function Logo() {
  return (
    <span className="flex items-center gap-3">
      <img src="/prime_edge_icon_mark_only.png" alt="" className="h-8"/>
      <span className="font-brand text-[1rem] md:text-[1.05rem] font-semibold tracking-[.18em]  text-white">
        Prime Edge
      </span>
      <span className="font-sans-pe text-[.66rem] uppercase tracking-[.24em] text-white/70">
        AI
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────
   NAVBAR — clean floating pill, Optivo-style
───────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const links = [
    { label: "Services", href: "#services" },
    { label: "About",    href: "#about" },
    { label: "Process",  href: "#process" },
    { label: "FAQ",      href: "#faq" },
    { label: "Contact",  href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-[200] px-4 md:px-8 pt-4">
      <div className="relative w-full">
        <div className="navbar-ambient">
          <div className="orb orb-purple" style={{ width: 220, height: 220, top: -70, left: -40 }} />
          <div className="orb orb-indigo" style={{ width: 260, height: 260, top: -40, right: 32 }} />
        </div>

        <nav
          className="navbar-panel relative mx-auto max-w-[1160px] flex items-center justify-between px-4 py-3 md:px-6 md:py-4 transition-all duration-300"
          style={{
            borderRadius: "999px",
            background: scrolled ? "rgba(4,6,10,.78)" : "rgba(4,6,10,.48)",
            // border: "1px solid rgba(255,255,255,.16)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            boxShadow: scrolled ? "0 22px 120px rgba(0,0,0,.38)" : "0 0 0 0 transparent",
          }}
        >
          <a href="#" className="flex items-center gap-2 shrink-0 px-4 py-2 logo-pill" style={{ borderRadius: "999px" }}>
            <Logo />
          </a>

          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-8 items-center">
            {links.map(l => l.label === "Services" ? (
              <div key={l.label} className="group relative py-4">
                <a href={l.href} className="nav-link-hover text-white/65 text-[.82rem] font-sans-pe font-medium uppercase tracking-[.16em] no-underline transition-colors duration-200">
                  Services <span className="ml-1 text-[.65rem] text-[#C9A84C]">+</span>
                </a>
                <div className="absolute left-1/2 top-full w-[270px] -translate-x-1/2 translate-y-2 pointer-events-none opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <div className="mt-2 border border-white/[.1] bg-[#0b0b14]/95 p-2 shadow-[0_24px_70px_rgba(0,0,0,.5)] backdrop-blur-xl" style={{ borderRadius: "14px" }}>
                    {SERVICE_NAV_ITEMS.map(item => (
                      <a key={item.id} href={servicePath(item.id)} onClick={(e) => openServicePage(e, item.id)} className="block px-4 py-3 text-[.76rem] font-sans-pe text-white/65 no-underline transition-colors hover:bg-white/[.06] hover:text-white">
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a key={l.label} href={l.href} className="nav-link-hover text-white/65 text-[.82rem] font-sans-pe font-medium uppercase tracking-[.16em] no-underline transition-colors duration-200">
                {l.label}
              </a>
            ))}
          </div>

          <a href="#contact" onClick={openContactSession}
             className="nav-cta hidden md:inline-flex items-center justify-center text-white text-[.78rem] font-semibold font-sans-pe no-underline
                        px-6 py-2.5 transition-all duration-200"
             style={{ borderRadius: "999px", background: "linear-gradient(135deg, rgba(107,140,255,.2), rgba(107,140,255,.1))", border: `1px solid rgba(255,255,255,.08)`, boxShadow: `0 18px 60px rgba(107,140,255,.2)` }}>
            {CTA_LABEL}
          </a>

          <button
            onClick={() => setOpen(o => !o)}
            className="md:hidden bg-transparent border-none cursor-pointer p-2 text-white/70 hover:text-white transition-colors"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
              {open
                ? <path d="M2 2L20 16M20 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                : <>
                    <line x1="2" y1="2"  x2="20" y2="2"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="2" y1="9"  x2="20" y2="9"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="2" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </>
              }
            </svg>
          </button>
        </nav>
      </div>

      <div
        className={`md:hidden mx-auto max-w-[1160px] overflow-hidden transition-all duration-300 ease-in-out mt-2
                     ${open ? "max-h-[360px] opacity-100" : "max-h-0 opacity-0"}`}
        style={{ borderRadius: "20px", background: "rgba(10,10,20,.95)", border: open ? "1px solid rgba(255,255,255,.08)" : "none" }}
      >
        <div className="px-5 pt-3 pb-5 flex flex-col">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
               className="text-white/65 text-[.9rem] font-sans-pe uppercase tracking-[.08em] no-underline py-3.5 border-b border-white/[.06] hover:text-white transition-colors duration-200">
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={(e) => { setOpen(false); openContactSession(e); }}
             className="mt-4 text-center py-3 text-[.78rem] tracking-[.08em] uppercase font-medium font-sans-pe no-underline text-white bg-[#C9A84C] transition-colors duration-200"
             style={{ borderRadius: "999px" }}>
            {CTA_LABEL}
          </a>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────
   HERO — frosted glass landing card
   Fake-looking "partner logos" replaced with
   honest, verifiable capability stats.
───────────────────────────────────────── */
function Hero() {
  // const stats = [
  //   { value: "3–6 wks", label: "Avg. time to first automation live" },
  //   { value: "24/7",    label: "Systems run unattended, day or night" },
  //   { value: "100%",    label: "Team training included on every build" },
  //   { value: "Free",    label: "Initial AI audit, no obligation" },
  // ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020306] px-4 py--8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-[400px] w-[420px] rounded-full blur-[140px]"
          style={{ background: `radial-gradient(circle at top left, ${PRIMARY_COLOR}33, transparent 58%)`, transform: "translate(-30%, -20%)" }}
        />
        <div
          className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full blur-[140px]"
          style={{ background: `radial-gradient(circle at top right, ${SECONDARY_COLOR}2d, transparent 56%)`, transform: "translate(30%, -20%)" }}
        />
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/10 blur-sm" />
      </div>

      <div className="relative z-[2] w-full max-w-[960px]">
        <div className="relative overflow-hidden rounded-[36px] px-6 py-10 md:px-12 md:py-24">
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute right-[8%] top-24 h-44 w-44 rounded-full bg-[#6B8CFF]/15 blur-[80px]" />
          <div className="absolute left-[10%] bottom-12 h-32 w-32 rounded-full bg-[#C9A84C]/12 blur-[72px]" />

          <div className="relative mx-auto max-w-[720px] text-center">
              <span className="inline-flex items-center justify-center gap-2 rounded-full bg-black/10 px-4 py-2 text-[.72rem] tracking-[.22em] uppercase text-[#C9A84C] font-medium font-sans-pe shadow-[0_0_0_1px_rgba(255,255,255,.06)] backdrop-blur-sm">
                - AI-Powered Business Transformation -
              </span>
            <h1 className="font-brand text-[3rem] md:text-[4rem] leading-[0.98] tracking-[-.04em] text-white/95">
             Intelligence That Drives Real Results.
            </h1>

            <p className="mx-auto mt-5 max-w-[600px] text-[0.94rem] leading-[1.85] text-white/70">
              Prime Edge AI helps businesses worldwide gain a decisive edge through AI education, intelligent automation, and custom AI solutions — built to reduce costs, accelerate growth, and outpace the competition.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <a href="#contact" onClick={openContactSession}
                 className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-12 py-3 text-[.78rem] font-semibold uppercase tracking-[.12em] text-white transition duration-300 hover:bg-white/15 hover:border-white/25 hover:shadow-[0_22px_60px_rgba(255,255,255,.08)]">
                {CTA_LABEL}
              </a>
              <a href="#services"
                 className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-12 py-3 text-[.78rem] font-semibold uppercase tracking-[.12em] text-white/75 transition duration-300 hover:bg-white/10 hover:text-white">
                See How It Works
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SERVICES
   Each service now carries real substance for
   the modal: what's included, timeline, outcome —
   so "Learn more" actually teaches something new.
───────────────────────────────────────── */
const CORE_SERVICES = [
  {
    id: "ai-education",
    tag: "Education & Training",
    title: "AI Education & Training",
    desc: "Hands-on programmes that take your team from AI-curious to AI-capable. We teach practical skills your people can deploy immediately — no theory, no fluff.",
    img: IMG.training,
    includes: [
      "Role-specific workshops (ops, sales, support, leadership)",
      "Hands-on labs using your own tools and data",
      "A private prompt & workflow playbook for your team",
      "30 days of async Q&A support after training",
    ],
    timeline: "1–3 weeks, delivered on-site or remote",
    outcome: "Teams typically leave able to independently build and maintain their own lightweight automations within a month.",
  },
  {
    id: "ai-consulting",
    tag: "Strategic Advisory",
    title: "AI Implementation Consulting",
    desc: "End-to-end guidance on where and how to integrate AI into your operations — from opportunity mapping through to ROI measurement and change management.",
    img: IMG.ai,
    includes: [
      "Operational audit to find highest-leverage automation targets",
      "Prioritised roadmap with effort-vs-impact scoring",
      "Vendor/tooling recommendations, build-vs-buy analysis",
      "ROI tracking framework for each recommended initiative",
    ],
    timeline: "2–4 weeks for the audit and roadmap",
    outcome: "You leave with a prioritised, costed roadmap — whether or not you build with us.",
  },
  {
    id: "ai-automation",
    tag: "Workflow Automation",
    title: "AI Automation",
    desc: "We design and deploy intelligent automation systems that eliminate manual work, reduce errors, and run 24/7 — freeing your team to focus on high-value work.",
    img: IMG.web,
    includes: [
      "Process mapping of the workflow being automated",
      "Custom automation build (integrations, AI logic, monitoring)",
      "Error handling, logging, and alerting built in",
      "Team training + documentation on handover",
    ],
    timeline: "3–6 weeks depending on complexity",
    outcome: "A production automation your team can monitor and adjust without needing to call us for every tweak.",
  },
  {
    id: "ai-saas",
    tag: "Custom Software",
    title: "Custom AI SaaS",
    desc: "Bespoke AI-powered software products built to your specifications — from MVP to production-ready platform, fully owned by you.",
    img: IMG.analytics,
    includes: [
      "Product scoping and technical architecture",
      "MVP build with weekly demos",
      "Full source code and infrastructure ownership on delivery",
      "Optional ongoing maintenance retainer",
    ],
    timeline: "6–12 weeks for an MVP, scope-dependent",
    outcome: "A product you fully own — no vendor lock-in on the codebase or infrastructure.",
  },
];

const OTHER_SERVICES = [
  {
    id: "website-creation",
    tag: "Digital Presence",
    title: "Website Creation",
    desc: "Performance-first, visually striking web experiences built for conversion, credibility, and long-term brand authority.",
    img: IMG.web,
    includes: ["Conversion-focused information architecture", "Responsive visual design and development", "Performance, accessibility, and SEO foundations", "Content guidance and launch support"],
    timeline: "3–6 weeks depending on scope",
    outcome: "A fast, credible digital presence designed to turn attention into qualified conversations.",
  },
  {
    id: "data-analytics",
    tag: "Business Intelligence",
    title: "Data Analytics",
    desc: "Transform fragmented data into unified intelligence — dashboards, forecasting models, and actionable reports.",
    img: IMG.analytics,
    includes: ["Data source audit and cleanup", "Decision-ready dashboards and reporting", "Forecasting and trend analysis", "Documentation your team can maintain"],
    timeline: "2–5 weeks for the first reporting system",
    outcome: "A clearer operating picture that helps your team spot opportunities and act with confidence.",
  },
];

const ALL_SERVICES = [...CORE_SERVICES, ...OTHER_SERVICES];

function Services() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const active = ALL_SERVICES.find(s => s.id === activeModal);

  // Lock body scroll while modal is open, and support Escape to close
  useEffect(() => {
    if (!activeModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveModal(null); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeModal]);

  useEffect(() => {
    const open = (e: Event) => setActiveModal((e as CustomEvent<string>).detail);
    window.addEventListener("primeedge:open-service", open);
    return () => window.removeEventListener("primeedge:open-service", open);
  }, []);

  return (
    <section id="services" className="bg-[#020306] px-6 md:px-12 py-28">
      <div className="section-panel relative max-w-[1160px] mx-auto p-8 md:p-10 rounded-none overflow-hidden">

        {/* ── Header ── */}
        <Reveal>
          <div className="flex flex-wrap justify-between items-end gap-6 mb-16">
            <div>
              <Kicker>Core Disciplines</Kicker>
              <h2 className="font-serif font-light text-[#F0F0F8] leading-[1.15] tracking-[-0.01em]"
                  style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}>
                Four disciplines.<br />
                <em className="italic">One integrated edge.</em>
              </h2>
            </div>
            <p className="font-sans-pe font-light text-white/65 leading-[1.85] text-[.93rem]" style={{ maxWidth: 340 }}>
              Built for organisations ready to move faster, operate smarter, and compete on a global stage.
            </p>
          </div>
        </Reveal>

        {/* ── Core service cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/20 border border-black/20">
          {CORE_SERVICES.map((svc, i) => (
            <Reveal key={svc.id} delay={i * 0.07}>
              <div
                className="service-card bg-[#020306] overflow-hidden cursor-pointer transition-colors duration-300 hover:bg-[#030409] h-full flex flex-col"
                onClick={() => navigateService(svc.id)}
              >
                <div className="overflow-hidden flex-shrink-0">
                  <img src={svc.img} alt={svc.title} className="img-service w-full h-[200px] object-cover" loading="lazy" />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <span className="block text-[#C9A84C] text-[.6rem] font-medium font-sans-pe tracking-[.2em] uppercase mb-2.5">
                    {svc.tag}
                  </span>
                  <div className="font-serif font-normal text-[#F0F0F8] text-[1.4rem] leading-[1.2] mb-3">
                    {svc.title}
                  </div>
                  <p className="font-sans-pe font-light text-white/50 text-[.83rem] leading-[1.78] flex-1">
                    {svc.desc}
                  </p>
                  <button
                    className="mt-5 text-[#6B8CFF] text-[.68rem] font-medium font-sans-pe tracking-[.14em] uppercase text-left bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 hover:text-[#8aaeff]"
                    onClick={(e) => { e.stopPropagation(); navigateService(svc.id); }}
                  >
                    Learn more →
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Other services ── */}
        <Reveal delay={0.1}>
          <div className="mt-20">
            <Kicker>Also Available</Kicker>
            <h3 className="font-serif font-light text-[#F0F0F8] leading-[1.2] mb-10"
                style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)" }}>
              Other services offered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/20 border border-black/20">
              {OTHER_SERVICES.map((svc) => (
                <div key={svc.title} className="bg-[#020306] hover:bg-[#030409] transition-colors duration-300 p-8 cursor-pointer" onClick={() => navigateService(svc.id)}>
                  <span className="block text-[#C9A84C] text-[.6rem] font-medium font-sans-pe tracking-[.2em] uppercase mb-2.5">
                    {svc.tag}
                  </span>
                  <div className="font-serif font-normal text-[#F0F0F8] text-[1.3rem] leading-[1.2] mb-3">
                    {svc.title}
                  </div>
                  <p className="font-sans-pe font-light text-white/50 text-[.83rem] leading-[1.78]">
                    {svc.desc}
                  </p>
                  <button onClick={() => navigateService(svc.id)} className="mt-5 text-[#6B8CFF] text-[.68rem] font-medium font-sans-pe tracking-[.14em] uppercase text-left bg-transparent border-none cursor-pointer p-0 transition-colors duration-200 hover:text-[#8aaeff]">
                    Explore service →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Modal overlay ── */}
      {activeModal && active && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,.88)", backdropFilter: "blur(12px)" }}
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-[#020306] border border-black/20 max-w-[640px] w-full relative max-h-[88vh] overflow-y-auto"
            style={{ borderRadius: "4px" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="overflow-hidden" style={{ height: 200 }}>
              <img src={active.img} alt={active.title} className="w-full h-full object-cover img-service" />
            </div>
            <div className="p-10">
              <span className="block text-[#C9A84C] text-[.6rem] font-medium font-sans-pe tracking-[.2em] uppercase mb-3">
                {active.tag}
              </span>
              <h3 className="font-serif font-light text-[#F0F0F8] text-[2rem] leading-[1.1] mb-5">
                {active.title}
              </h3>
              <p className="font-sans-pe font-light text-white/60 text-[.9rem] leading-[1.85] mb-7">
                {active.desc}
              </p>

              <span className="block font-sans-pe font-medium text-white/45 text-[.62rem] tracking-[.16em] uppercase mb-3">
                What's included
              </span>
              <ul className="mb-7 flex flex-col gap-2">
                {active.includes.map(item => (
                  <li key={item} className="font-sans-pe font-light text-white/60 text-[.83rem] leading-[1.6] flex gap-2.5">
                    <span className="text-[#6B8CFF] mt-[2px]">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 border-t border-white/[.07] pt-6">
                <div>
                  <span className="block font-sans-pe font-medium text-white/45 text-[.62rem] tracking-[.16em] uppercase mb-2">
                    Typical timeline
                  </span>
                  <span className="font-sans-pe font-normal text-[#F0F0F8] text-[.83rem]">{active.timeline}</span>
                </div>
                <div>
                  <span className="block font-sans-pe font-medium text-white/45 text-[.62rem] tracking-[.16em] uppercase mb-2">
                    What you walk away with
                  </span>
                  <span className="font-sans-pe font-normal text-[#F0F0F8] text-[.83rem] leading-[1.6]">{active.outcome}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href="#contact"
                  onClick={(e) => { setActiveModal(null); openContactSession(e); }}
                  className="btn-accent bg-[#6B8CFF] text-white px-7 py-[13px] text-[.74rem] font-medium font-sans-pe tracking-[.1em] uppercase no-underline transition-all duration-200 inline-block"
                  style={{ borderRadius: "4px" }}
                >
                  {CTA_LABEL}
                </a>
                <button
                  className="text-white/40 text-[.74rem] font-sans-pe tracking-[.1em] uppercase bg-transparent border border-white/10 px-7 py-[13px] cursor-pointer transition-colors duration-200 hover:text-white/70 hover:border-white/20"
                  style={{ borderRadius: "4px" }}
                  onClick={() => setActiveModal(null)}
                >
                  Close
                </button>
              </div>
            </div>
            <button
              className="absolute top-4 right-4 text-white/30 hover:text-white/70 bg-transparent border-none cursor-pointer text-xl leading-none transition-colors duration-200"
              onClick={() => setActiveModal(null)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────
   ABOUT
───────────────────────────────────────── */
function About() {
  const points = [
    { n: "01", title: "Goals before technology",       body: "Every engagement starts with your operations — we build what you actually need, not what sounds impressive." },
    { n: "02", title: "Deliver, then transfer knowledge", body: "We train your team on every solution — so results outlast our involvement and adoption is guaranteed." },
    { n: "03", title: "Long-term partnership",         body: "We monitor, optimise, and scale alongside you. We measure success by your growth, not just project delivery." },
  ];

  return (
    <section id="about" className="bg-[#020306] px-6 md:px-12 py-28">
      <div className="section-panel relative max-w-[1160px] mx-auto p-8 md:p-10 rounded-none overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          <Reveal>
            <div className="relative overflow-hidden">
              <img src={IMG.about} alt="Prime Edge AI team" className="img-about w-full object-cover block"
                   style={{ height: 560 }} loading="lazy" />
              <div className="absolute bottom-0 left-0 right-0 h-[35%]"
                   style={{ background: "linear-gradient(to top, #0e0e1a 0%, transparent 100%)" }} />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Kicker>Who We Are</Kicker>
            <h2 className="font-serif font-light text-[#F0F0F8] leading-[1.15] tracking-[-0.01em] mb-4"
                style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}>
              A new kind of<br />
              <em className="italic">AI transformation partner</em>
            </h2>
            <p className="font-sans-pe font-light text-white/55 text-[.93rem] leading-[1.85]" style={{ maxWidth: 480 }}>
              Prime Edge AI is a technology firm helping organisations worldwide adopt AI,
              automate operations, and build intelligent digital infrastructure that creates
              lasting competitive advantage — wherever they operate.
            </p>

            <div className="flex flex-col mt-11">
              {points.map(p => (
                <div key={p.n} className="flex gap-5 items-start py-7 border-b border-white/[.07] first:pt-0">
                  <span className="font-serif font-light italic text-[#C9A84C] text-[1.2rem] leading-[1.4] min-w-[28px]">
                    {p.n}
                  </span>
                  <div>
                    <span className="block font-sans-pe font-medium text-[#F0F0F8] text-[.86rem] tracking-[.02em] mb-1.5">
                      {p.title}
                    </span>
                    <span className="font-sans-pe font-light text-white/50 text-[.83rem] leading-[1.78]">
                      {p.body}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-11">
              <a href="#contact" onClick={openContactSession}
                 className="btn-accent bg-[#6B8CFF] text-white px-9 py-[15px] text-[.78rem] font-medium font-sans-pe
                            tracking-[.1em] uppercase no-underline transition-all duration-200 inline-block"
                 style={{ borderRadius: "4px" }}>
                {CTA_LABEL}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PROCESS
───────────────────────────────────────── */
const STEPS = [
  { n: "01", title: "Discovery",  desc: "Free consultation to understand your goals and where AI creates the most leverage." },
  { n: "02", title: "Strategy",   desc: "Clear roadmap, fixed pricing, delivery timeline — no ambiguity, no hidden scope." },
  { n: "03", title: "Build",      desc: "Agile delivery with weekly check-ins so you see progress continuously." },
  { n: "04", title: "Launch",     desc: "Deployment with full team training to ensure adoption from day one." },
  { n: "05", title: "Scale",      desc: "Ongoing monitoring, optimisation, and scaling as your business evolves." },
];

function Process() {
  return (
    <section id="process" className="bg-[#020306] px-6 md:px-12 py-28">
      <div className="section-panel relative max-w-[1160px] mx-auto p-8 md:p-10 rounded-none overflow-hidden">
        <Reveal>
          <Kicker>How We Work</Kicker>
          <h2 className="font-serif font-light text-[#F0F0F8] leading-[1.15] tracking-[-0.01em] mb-16"
              style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}>
            From first call to<br />
            <em className="italic">full deployment — fast</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-white/[.07] border border-white/[.07]">
          {STEPS.map(s => (
            <div key={s.n}
                 className="process-step bg-[#080810] p-8 transition-colors duration-200 cursor-default">
              <div className="font-serif font-light text-white/[.06] leading-none mb-5 select-none"
                   style={{ fontSize: "3.5rem", letterSpacing: "-0.03em" }}>
                {s.n}
              </div>
              <div className="font-sans-pe font-medium text-[#F0F0F8] text-[.86rem] tracking-[.03em] mb-2.5">
                {s.title}
              </div>
              <p className="font-sans-pe font-light text-white/45 text-[.79rem] leading-[1.78]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PROOF — quantified, honestly-framed example
   of what an engagement looks like in practice.
   Replace the illustrative figures below with
   real client results as soon as you have them
   signed off to share.
───────────────────────────────────────── */
function Proof() {
  const metrics = [
    { value: "18 hrs/wk", label: "Manual invoice work removed" },
    { value: "< 24 hrs",  label: "New-lead response time, from days" },
    { value: "0", label: "Missed follow-ups since go-live" },
  ];

  return (
    <section className="bg-[#020306] px-6 md:px-12 py-28">
      <div className="section-panel relative max-w-[1160px] mx-auto p-8 md:p-10 rounded-none overflow-hidden">
        <Reveal>
          <Kicker>What It Looks Like In Practice</Kicker>
          <h2 className="font-serif font-light text-[#F0F0F8] leading-[1.15] tracking-[-0.01em] mb-10"
              style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}>
            An automation,<br /><em className="italic">not a slide deck</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-14 items-start">
          <Reveal delay={0.05}>
            <p className="font-sans-pe font-light text-white/60 text-[.92rem] leading-[1.9] mb-6" style={{ maxWidth: 560 }}>
              A mid-size distribution client came to us with an ops team spending most of
              their week on invoice entry, lead follow-up, and status updates across three
              disconnected tools. We mapped the workflow, built a system that reads incoming
              orders, reconciles them against inventory, and routes exceptions to a human —
              and trained the team to adjust the rules themselves.
            </p>
            <p className="font-sans-pe font-light text-white/40 text-[.75rem] leading-[1.8] italic">
              Illustrative example based on a representative engagement — client name withheld by request.
              Ask us for reference calls with current clients during your audit.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-col gap-px bg-white/[.07] border border-white/[.07]">
              {metrics.map(m => (
                <div key={m.label} className="bg-[#080810] p-7">
                  <div className="font-brand text-[#C9A84C] text-[1.6rem] font-semibold tracking-[-.02em] mb-1">
                    {m.value}
                  </div>
                  <div className="font-sans-pe text-white/45 text-[.78rem] leading-[1.5]">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   DIVIDER QUOTE
───────────────────────────────────────── */
function Divider() {
  return (
    <div className="relative overflow-hidden" style={{ height: 480 }}>
      <img src={IMG.divider} alt="" aria-hidden
           className="img-divider absolute inset-0 w-full h-full object-cover object-[center_40%] z-0" />
      <div className="absolute inset-0 z-[1]"
           style={{ background: "linear-gradient(to right, rgba(8,8,16,.97) 0%, rgba(8,8,16,.4) 55%, transparent 100%)" }} />
      <div className="absolute inset-0 z-[2] flex items-center px-6 md:px-20">
        <div>
          <blockquote className="font-serif font-light italic text-[#F0F0F8] leading-[1.32] tracking-[-0.01em]"
                      style={{ fontSize: "clamp(1.6rem,3.5vw,2.6rem)", maxWidth: 640 }}>
            "We don't just implement technology — we transform the way your organisation thinks, operates, and competes."
          </blockquote>
          <span className="block font-sans-pe font-medium text-[#C9A84C] text-[.66rem] tracking-[.16em] uppercase mt-6 not-italic">
            Prime Edge AI
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   FAQ — addresses the objections a buyer of
   AI/automation services actually has.
───────────────────────────────────────── */
const FAQS = [
  {
    q: "How much does this cost?",
    a: "It depends on scope. Automation projects are typically fixed-price after the discovery call, so you know the number before we start — no open-ended hourly billing.",
  },
  {
    q: "Will this replace my team?",
    a: "No. Our automations remove repetitive manual work so your team can spend time on judgment calls, relationships, and growth — not data entry.",
  },
  {
    q: "What happens to our data?",
    a: "Your data stays in your own systems or accounts wherever possible. We document every integration and access point, and you can revoke our access at any time after handover.",
  },
  {
    q: "What if we want to change something later?",
    a: "Every build includes documentation and team training so you can make small adjustments yourselves. For larger changes, we offer ongoing support retainers.",
  },
  {
    q: "How long before we see results?",
    a: "Most automation builds go live in 3–6 weeks. You'll see the time savings the week it launches, since the manual work it replaces stops immediately.",
  },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="px-6 md:px-12 py-28">
      <div className="section-panel relative max-w-[820px] mx-auto p-8 md:p-10 rounded-none overflow-hidden">
        <Reveal>
          <Kicker>Common Questions</Kicker>
          <h2 className="font-serif font-light text-[#F0F0F8] leading-[1.15] tracking-[-0.01em] mb-14"
              style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}>
            Before you <em className="italic">reach out</em>
          </h2>
        </Reveal>

        <div className="flex flex-col divide-y divide-white/[.05]">
          {FAQS.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={item.q} className="py-6">
                <button
                  className="faq-trigger w-full flex items-center justify-between gap-6 py-6 text-left bg-transparent border-none cursor-pointer transition-colors duration-200 text-white/75"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-sans-pe font-medium text-[.92rem]">{item.q}</span>
                  <span className="font-brand text-[#6B8CFF] text-[1.1rem] leading-none flex-shrink-0" aria-hidden>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? 200 : 0, opacity: isOpen ? 1 : 0 }}
                >
                  <p className="font-sans-pe font-light text-white/50 text-[.85rem] leading-[1.8] pb-6 pr-8">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CONTACT
   Now a real controlled form with loading /
   success / error states, submitting to
   CONTACT.formEndpoint instead of a fake timer.
───────────────────────────────────────── */
type FormState = "idle" | "sending" | "sent" | "error";

function Contact() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<FormState>("idle");
  const [fields, setFields] = useState({
    firstName: "", lastName: "", email: "", service: "", message: "",
  });

  const update = (key: keyof typeof fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setFields(f => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    const open = () => setIsOpen(true);
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("primeedge:open-contact", open);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("primeedge:open-contact", open);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.firstName || !fields.email || !fields.message) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(CONTACT.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setFields({ firstName: "", lastName: "", email: "", service: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputCls = "w-full bg-[#13131f] border border-white/[.07] text-[#F0F0F8] text-[.87rem] font-sans-pe font-light px-4 py-[13px] outline-none transition-colors duration-200 placeholder:text-white/25";

  return (
    <section id="contact" className="bg-[#020306] px-6 md:px-12 py-28">
      <div className="section-panel relative max-w-[1160px] mx-auto p-8 md:p-10 rounded-none overflow-hidden">
        <Reveal>
          <Kicker>Get In Touch</Kicker>
          <h2 className="font-serif font-light text-[#F0F0F8] leading-[1.15] tracking-[-0.01em] mb-16"
              style={{ fontSize: "clamp(2rem,4vw,3.2rem)" }}>
            Ready to gain<br /><em className="italic">your edge?</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-20 items-start">

          <Reveal>
            <p className="font-sans-pe font-light text-white/50 text-[.9rem] leading-[1.88] mb-10">
              Whether you want to deploy AI, upskill your team, build a custom AI product,
              or automate your workflows — Prime Edge AI is ready. Let's start with a conversation.
            </p>
            <div className="border-l-2 border-[#C9A84C] pl-5 py-2">
              <span className="block font-serif italic text-[#F0F0F8] text-[1.45rem] leading-[1.2] mb-2">Bring us the messy part.</span>
              <span className="block font-sans-pe font-light text-white/45 text-[.82rem] leading-[1.75]">We will help turn it into a focused, measurable next move.</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-[#080810] border border-white/[.07] p-8 md:p-12">
              <span className="block font-sans-pe font-medium text-[#C9A84C] text-[.62rem] tracking-[.16em] uppercase mb-4">Start a conversation</span>
              <h3 className="font-serif font-light text-[#F0F0F8] text-[1.8rem] leading-[1.15] mb-4">Tell us where you want an edge.</h3>
              <p className="font-sans-pe font-light text-white/50 text-[.85rem] leading-[1.8] mb-8">Share a little about your goals and we will get back to you with a useful next step.</p>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="btn-accent bg-[#6B8CFF] text-white px-8 py-[14px] text-[.74rem] font-medium font-sans-pe tracking-[.1em] uppercase border-none cursor-pointer transition-all duration-200"
                style={{ borderRadius: "4px" }}
              >
                {CTA_LABEL}
              </button>
            </div>
          </Reveal>
        </div>

      </div>

      {isOpen && (
        <div
          className="contact-modal-backdrop fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-8"
          style={{ background: "rgba(0,0,0,.88)", backdropFilter: "blur(14px)" }}
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-dialog-title"
        >
          <div
            className="contact-modal-card relative bg-[#0b0b14] border border-white/[.1] max-w-[720px] w-full max-h-[92vh] overflow-y-auto"
            style={{ borderRadius: "18px", boxShadow: "0 30px 120px rgba(0,0,0,.65)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6 px-6 py-6 md:px-10 border-b border-white/[.07]">
              <div>
                <Kicker>Get In Touch</Kicker>
                <h3 id="contact-dialog-title" className="font-serif font-light text-[#F0F0F8] text-[2rem] leading-[1.1]">Let's make it practical.</h3>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="text-white/45 hover:text-white bg-transparent border-none cursor-pointer text-2xl leading-none" aria-label="Close contact form">×</button>
            </div>
            <form className="p-6 md:p-10" onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-[22px]">
                <div>
                  <label className="block font-sans-pe font-medium text-white/45 text-[.6rem] tracking-[.16em] uppercase mb-2">First Name</label>
                  <input type="text" placeholder="John" className={inputCls} style={{ borderRadius: "4px" }}
                         value={fields.firstName} onChange={update("firstName")} required />
                </div>
                <div>
                  <label className="block font-sans-pe font-medium text-white/45 text-[.6rem] tracking-[.16em] uppercase mb-2">Last Name</label>
                  <input type="text" placeholder="Doe" className={inputCls} style={{ borderRadius: "4px" }}
                         value={fields.lastName} onChange={update("lastName")} />
                </div>
              </div>
              <div className="mb-[22px]">
                <label className="block font-sans-pe font-medium text-white/45 text-[.6rem] tracking-[.16em] uppercase mb-2">Email Address</label>
                <input type="email" placeholder="john@company.com" className={inputCls} style={{ borderRadius: "4px" }}
                       value={fields.email} onChange={update("email")} required />
              </div>
              <div className="mb-[22px]">
                <label className="block font-sans-pe font-medium text-white/45 text-[.6rem] tracking-[.16em] uppercase mb-2">Service Interest</label>
                <select className={`${inputCls} appearance-none`} style={{ borderRadius: "4px" }}
                        value={fields.service} onChange={update("service")}>
                  <option value="">Select a service...</option>
                  <option>AI Education &amp; Training</option>
                  <option>AI Implementation Consulting</option>
                  <option>AI Automation</option>
                  <option>Custom AI SaaS</option>
                  <option>Website Creation</option>
                  <option>Data Analytics</option>
                  <option>Multiple Services</option>
                </select>
              </div>
              <div className="mb-[22px]">
                <label className="block font-sans-pe font-medium text-white/45 text-[.6rem] tracking-[.16em] uppercase mb-2">Message</label>
                <textarea
                  placeholder="Tell us about your project or challenge..."
                  className={inputCls}
                  style={{ borderRadius: "4px", minHeight: 120, resize: "vertical" }}
                  value={fields.message} onChange={update("message")} required
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-accent w-full py-[15px] font-sans-pe font-medium text-white text-[.75rem] tracking-[.14em] uppercase border-none transition-all duration-200 mt-2"
                style={{
                  background: status === "sent" ? "#1a7a3c" : status === "error" ? "#8a2f2f" : "#6B8CFF",
                  borderRadius: "4px",
                  cursor: status === "sending" ? "wait" : "pointer",
                  opacity: status === "sending" ? 0.75 : 1,
                }}
              >
                {status === "sending" && "Sending…"}
                {status === "sent" && "Message Sent — We'll Reply Soon"}
                {status === "error" && "Couldn't Send — Try Again"}
                {status === "idle" && "Send Message"}
              </button>

              {status === "error" && (
                <p className="mt-3 font-sans-pe text-[.75rem] text-red-300/80">
                  Please fill in your name, email, and message, or try again in a moment.
                  You can also reach us directly on WhatsApp or by email above.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────
   FOOTER
───────────────────────────────────────── */
function Footer() {
  const cols = [
    { title: "Services",      links: [
        { label: "AI Education & Training", href: "#services" },
        { label: "AI Implementation Consulting", href: "#services" },
        { label: "AI Automation", href: "#services" },
        { label: "Custom AI SaaS", href: "#services" },
      ] },
    { title: "Also Offered",  links: [
        { label: "Website Creation", href: "#services" },
        { label: "Data Analytics", href: "#services" },
      ] },
    { title: "Company",       links: [
        { label: "About Us", href: "#about" },
        { label: "How We Work", href: "#process" },
        { label: "FAQ", href: "#faq" },
        { label: "Contact", href: "#contact" },
      ] },
    { title: "Connect",       links: [
        { label: CONTACT.email, href: `mailto:${CONTACT.email}` },
        { label: CONTACT.phone, href: CONTACT.phoneHref },
        { label: "WhatsApp Us", href: CONTACT.whatsappHref },
      ] },
  ];

  return (
    <footer className="border-t border-black/20 px-6 md:px-12 pt-16 pb-8">
      <div className="section-panel relative max-w-[1160px] mx-auto p-8 md:p-10 rounded-none overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] gap-12 pb-14 mb-8 border-b border-white/[.06]">
          <div>
            <span className="block font-serif font-light text-[#F0F0F8] text-[1.5rem] tracking-[.02em] mb-4">
              Prime <em className="italic text-[#6B8CFF]">Edge</em> AI
            </span>
            <p className="font-sans-pe font-light text-white/40 text-[.82rem] leading-[1.82]" style={{ maxWidth: 260 }}>
              Equipping organisations worldwide with intelligent technology to outperform, outscale, and outlast the competition.
            </p>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <span className="block font-sans-pe font-medium text-[#C9A84C] text-[.6rem] tracking-[.18em] uppercase mb-5">
                {col.title}
              </span>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <a href={l.href}
                       target={l.href.startsWith("http") ? "_blank" : undefined}
                       rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                       className="footer-link font-sans-pe font-light text-white/40 text-[.82rem] no-underline transition-colors duration-200">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3">
          <p className="font-sans-pe font-light text-white/35 text-[.71rem] tracking-[.04em]">
            © {new Date().getFullYear()} Prime Edge AI Limited. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="footer-link font-sans-pe font-light text-white/40 text-[.71rem] no-underline transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="footer-link font-sans-pe font-light text-white/40 text-[.71rem] no-underline transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   WHATSAPP FLOAT
───────────────────────────────────────── */
function WhatsAppFloat() {
  return (
    <a
      href={CONTACT.whatsappHref}
      target="_blank" rel="noopener noreferrer"
      className="wa-btn fixed bottom-7 right-7 z-[300] w-[50px] h-[50px] flex items-center justify-center no-underline transition-all duration-200"
      style={{
        borderRadius: "16px",
        background: "rgba(0,0,0,.55)",
        border: "1px solid rgba(255,255,255,.12)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 18px 60px rgba(0,0,0,.28)",
      }}
      aria-label="Chat on WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
        <path d="M12.04 2.01A10 10 0 0 0 2 12.06a9.84 9.84 0 0 0 1.37 5.09L2 22l5.07-1.33a9.95 9.95 0 0 0 4.96 1.28H12A10 10 0 0 0 12.04 2zM12 20.08a8.07 8.07 0 0 1-4.1-1.13l-.3-.17-3.02.79.8-2.94-.2-.31a8.04 8.04 0 1 1 14.9-4.27 8.03 8.03 0 0 1-8.08 8.03zm4.62-6.03c-.26-.13-1.5-.74-1.73-.83s-.4-.13-.57.13-.66.83-.81 1-.3.2-.56.07a6.6 6.6 0 0 1-1.94-1.2 7.4 7.4 0 0 1-1.37-1.7c-.14-.26 0-.4.12-.53s.26-.3.4-.45c.14-.15.2-.26.3-.43a.5.5 0 0 0-.02-.48c-.07-.14-.57-1.37-.78-1.87s-.4-.42-.56-.43h-.48a.92.92 0 0 0-.67.31 2.78 2.78 0 0 0-.86 2.06c0 1.22.87 2.4 1 2.57.13.17 1.7 2.6 4.13 3.64.58.25 1.04.4 1.4.51a3.35 3.35 0 0 0 1.56.1 2.66 2.66 0 0 0 1.75-1.22c.22-.3.22-.54.16-.74s-.24-.17-.5-.3z"/>
      </svg>
    </a>
  );
}

function ServicePage({ service }: { service: (typeof ALL_SERVICES)[number] }) {
  return (
    <main className="service-page-enter min-h-screen bg-[#020306] px-6 md:px-12 pt-28 pb-24">
      <div className="max-w-[1160px] mx-auto">
        <a href="/" onClick={(e) => { e.preventDefault(); window.history.pushState({}, "", "/"); window.dispatchEvent(new PopStateEvent("popstate")); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="inline-flex items-center gap-2 text-[#C9A84C] text-[.7rem] font-sans-pe font-medium tracking-[.16em] uppercase no-underline mb-16 hover:text-white transition-colors">
          ← All services
        </a>
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-12 lg:gap-24 items-start">
          <div>
            <Kicker>{service.tag}</Kicker>
            <h1 className="font-serif font-light text-[#F0F0F8] text-[clamp(3rem,7vw,6.5rem)] leading-[.92] mb-8">{service.title}</h1>
            <p className="font-sans-pe font-light text-white/60 text-[1rem] leading-[1.9] max-w-[620px] mb-10">{service.desc}</p>
            <a href="#contact" onClick={openContactSession} className="inline-flex items-center justify-center bg-[#6B8CFF] text-white px-8 py-4 text-[.74rem] font-sans-pe font-medium tracking-[.12em] uppercase no-underline" style={{ borderRadius: "4px" }}>{CTA_LABEL}</a>
          </div>
          <div className="border-t border-white/[.12] pt-6">
            <img src={service.img} alt="" className="w-full aspect-[4/3] object-cover mb-10 img-service" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
              <div><span className="block text-[#C9A84C] text-[.62rem] font-sans-pe tracking-[.16em] uppercase mb-3">Typical timeline</span><span className="font-sans-pe text-white/75 text-[.88rem] leading-[1.6]">{service.timeline}</span></div>
              <div><span className="block text-[#C9A84C] text-[.62rem] font-sans-pe tracking-[.16em] uppercase mb-3">The outcome</span><span className="font-sans-pe text-white/75 text-[.88rem] leading-[1.6]">{service.outcome}</span></div>
            </div>
            <span className="block text-white/45 text-[.62rem] font-sans-pe tracking-[.16em] uppercase mb-4">What is included</span>
            <ul className="m-0 p-0 list-none flex flex-col gap-3">{service.includes.map(item => <li key={item} className="font-sans-pe text-white/65 text-[.86rem] leading-[1.6] border-b border-white/[.07] pb-3">{item}</li>)}</ul>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────
   APP ROOT
───────────────────────────────────────── */
export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => {
      setPath(window.location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const service = ALL_SERVICES.find(item => servicePath(item.id) === path);

  return (
    <div
      className="font-sans-pe text-[#F0F0F8] antialiased"
      style={{ backgroundColor: "#080810", color: "#F0F0F8", minHeight: "100vh" }}
    >
      <Navbar />
      {service ? (
        <ServicePage key={path} service={service} />
      ) : (
        <>
          <Hero />
          <About />
          <Services />
          <Process />
          <Proof />
          <Divider />
          <FAQ />
          <Contact />
        </>
      )}
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}