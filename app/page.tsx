"use client";

import { useState, useEffect, useRef } from "react";
import ScrollReveal from "./components/ScrollReveal";
import { DraftModeProvider } from "next/dist/server/async-storage/draft-mode-provider";

/* ─── Google Fonts ─── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');

    :root {
      --bg: #000000;
      --surface: #0A0A0A;
      --surface-hover: #141414;
      --text: #ffffff;
      --text-muted: rgba(255,255,255,0.6);
      --border: rgba(255,255,255,0.1);
      --cyan: #00f0ff;
      --magenta: #ff00aa;
      --gold: #ffd700;
      --cyan-rgb: 0,240,255;
      --magenta-rgb: 255,0,170;
      --gold-rgb: 255,215,0;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      overflow-x: hidden;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--magenta); border-radius: 4px; }

    /* Reveal animations */
    .reveal { opacity: 0; transition: opacity 0.9s cubic-bezier(.16,1,.3,1), transform 0.9s cubic-bezier(.16,1,.3,1); }
    .reveal.from-left  { transform: translateX(-60px); }
    .reveal.from-right { transform: translateX(60px); }
    .reveal.from-bottom{ transform: translateY(50px); }
    .reveal.visible    { opacity: 1; transform: translate(0,0); }

    /* Daisy logo mark */
    .daisy-mark {
      width: 28px;
      height: 28px;
      background: url(daisy-64.webp);
      background-size: contain;
      background-position: center center;
      flex-shrink: 0;
    }
    @keyframes spinMark { to { transform: rotate(360deg); } }

    /* Hero orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }

    /* Nav glass */
    // .nav-glass {
    //   backdrop-filter: blur(20px) saturate(180%);
    //   -webkit-backdrop-filter: blur(20px) saturate(180%);
    //   background: rgba(0,0,0,0.65);
    //   border-bottom: 1px solid var(--border);
    // }

    /* Film card */
    .film-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      transition: transform 0.45s cubic-bezier(.16,1,.3,1), box-shadow 0.45s ease, border-color 0.3s ease;
      cursor: pointer;
    }

    .film-card:hover {
      /*transform: translateY(-10px) scale(1.015);
      border-color: rgba(255,255,255,0.22); */
      box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(0,240,255,0.08);
    }
    .film-card .poster {
      position: relative;
      overflow: hidden;
    }
    .film-card .poster img {
      width: 100%; height: 100%;
      object-fit: cover;
      display: block;
      /*transition: transform 0.6s cubic-bezier(.16,1,.3,1);*/
    }
    /* .film-card:hover .poster img { transform: scale(1.07); } */


    /* Play button overlay */
    .card-play {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%) scale(0.7);
      width: 56px; height: 56px;
      border: 1px solid rgba(200, 169, 110, 0.5);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      opacity: 0;
      transition: opacity .4s, transform .4s cubic-bezier(.16,1,.3,1);
      backdrop-filter: blur(8px);
      background: rgba(200, 169, 110, 0.1);
      z-index: 100;
    }
    .card-play svg { margin-left: 4px; fill: var(--gold); }
    .film-card:hover .card-play {
      opacity: 1; transform: translate(-50%, -50%) scale(1);
    }

    .film-card .poster::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%);
    }

    /* Poster overlay badge */
    .rating-badge {
      position: absolute;
      top: 14px; right: 14px;
      z-index: 2;
      font-family: 'Outfit', sans-serif;
      font-size: 11px; font-weight: 700;
      padding: 4px 10px;
      border-radius: 100px;
      border: 1px solid;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    /* Accent line */
    .accent-line {
      height: 2px;
      border-radius: 2px;
      background: linear-gradient(90deg, var(--cyan), var(--magenta));
    }

    /* Gradient text */
    .grad-cyan-mag {
      background: linear-gradient(135deg, var(--cyan) 0%, var(--magenta) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .grad-gold {
      background: linear-gradient(135deg, var(--gold) 0%, #ffb347 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Marquee */
    .marquee-track {
      display: flex; gap: 0;
      animation: marquee 28s linear infinite;
      width: max-content;
    }
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

    /* Stat counter */
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 28px 24px;
      text-align: center;
      transition: border-color 0.3s, background 0.3s;
    }
    .stat-card:hover { background: var(--surface-hover); border-color: rgba(255,255,255,0.2); }

    /* Floating label pill */
    .pill {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(255,255,255,0.06);
      border: 1px solid var(--border);
      border-radius: 100px;
      padding: 6px 16px;
      font-size: 12px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--text-muted);
      font-family: 'Outfit', sans-serif;
      font-weight: 500;
    }
    .pill .dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--cyan);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.6)} }

    /* Scroll cue */
    .scroll-cue {
      width: 28px; height: 44px;
      border: 2px solid rgba(255,255,255,0.25);
      border-radius: 20px;
      display: flex; align-items: flex-start; justify-content: center;
      padding-top: 8px;
    }
    .scroll-cue .dot {
      width: 4px; height: 8px;
      background: white;
      border-radius: 4px;
      animation: scrollDot 2s ease-in-out infinite;
    }
    @keyframes scrollDot { 0%{transform:translateY(0);opacity:1} 80%{transform:translateY(12px);opacity:0} 100%{transform:translateY(0);opacity:0} }

    /* Team card */
    .team-card {
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 32px 28px;
      background: var(--surface);
      transition: transform 0.4s cubic-bezier(.16,1,.3,1), border-color 0.3s;
    }
    .team-card:hover { transform: translateY(-6px); border-color: rgba(255,255,255,0.22); }

    /* Star icon */
    .star { color: var(--gold); font-size: 13px; }

    /* Footer link */
    .footer-link {
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.2s;
      font-size: 14px;
    }
    .footer-link:hover { color: var(--cyan); }

    /* Section heading */
    .section-label {
      font-family: 'Outfit', sans-serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--cyan);
    }
  `}</style>
);

/* ─── useReveal hook ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ─── Nav ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="nav-glass"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "padding 0.3s",
        padding: scrolled ? "14px 32px" : "22px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}
    >
      {/* Logo */}
      <a href="#" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
        <div className="daisy-mark" />
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.02em", color: "white" }}>
          <span style={{color: "var(--gold)"}}>Daisy 3</span> Pictures
        </span>
      </a>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: "36px", alignItems: "center" }}>
        {["Films", "About", "Team", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500, fontSize: "14px",
              color: "rgba(255,255,255,0.7)",
              textDecoration: "none",
              letterSpacing: "0.01em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "white")}
            onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.7)")}
          >
            {item}
          </a>
        ))}
        <a
          href="#films"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600, fontSize: "13px",
            padding: "9px 22px",
            borderRadius: "100px",
            background: "var(--gold)",
            color: "#000",
            textDecoration: "none",
            letterSpacing: "0.04em",
            transition: "opacity 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => { e.target.style.opacity = "0.85"; e.target.style.transform = "scale(1.03)"; }}
          onMouseLeave={(e) => { e.target.style.opacity = "1"; e.target.style.transform = "scale(1)"; }}
        >
          Watch Now
        </a>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden",
        padding: "120px 40px 80px",
        textAlign: "center",
      }}
    >
      {/* BG Orbs */}
      <div className="orb" style={{ width: 600, height: 600, top: "-10%", left: "-15%", background: "rgba(0,240,255,0.07)" }} />
      <div className="orb" style={{ width: 500, height: 500, bottom: "-5%", right: "-10%", background: "rgba(255,0,170,0.07)" }} />
      <div className="orb" style={{ width: 300, height: 300, top: "40%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(255,215,0,0.04)" }} />

      {/* Subtle grid overlay */}
    <div className="fade-in"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        maskImage: "radial-gradient(ellipse 80% 60% at center, black 40%, transparent 100%)",
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      >
        <source src="/ready-ok-trailer-xs.mp4" type="video/mp4" />
      </video>
    </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: 900 }}>
        <div className="reveal from-bottom" style={{ animationDelay: "0.1s", marginBottom: 28 }}>
          <span className="pill">
            <span className="dot" />
            Independent Film · San Diego, CA
          </span>
        </div>

        <h1
          className="reveal from-bottom text-shadow-lg"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(52px, 10vw, 110px)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            marginBottom: 32,
          }}
        >
          <span style={{ display: "block", color: "var(--magenta)" }}>Daisy 3</span>
          <span style={{ display: "block", color: "var(--gold)" }}>Pictures</span>
        </h1>

        {/* <p
          className="reveal from-bottom textsh-md"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "rgba(255,255,255,0.65)",
            maxWidth: 560,
            margin: "0 auto 44px",
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Funny, heartfelt, and unflinchingly human — Daisy 3 Pictures has been crafting
          independent cinema with soul since 2004.
        </p> */}

        <div className="reveal from-bottom" style={{
          display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
          marginTop: "80px"
        }}>
          <a
            href="#films"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700, fontSize: "15px",
              padding: "15px 34px",
              borderRadius: "100px",
              background: "var(--gold)",
              color: "#000",
              textDecoration: "none",
              letterSpacing: "0.02em",
              transition: "transform 0.25s, box-shadow 0.25s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => { e.target.style.transform = "scale(1.04)"; e.target.style.boxShadow = "0 0 40px rgba(255,255,255,0.15)"; }}
            onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
          >
            Explore Our Films
          </a>
          {/* <a
            href="#about"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600, fontSize: "15px",
              padding: "14px 34px",
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              textDecoration: "none",
              letterSpacing: "0.02em",
              transition: "border-color 0.25s, background 0.25s",
              display: "inline-block",
              background: "transparent",
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.5)"; e.target.style.background = "rgba(255,255,255,0.05)"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.background = "transparent"; }}
          >
            Our Story
          </a> */}
        </div>

        {/* Stats row */}
        {/* <div className="reveal from-bottom" style={{ display: "flex", gap: 40, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
          {[
            { value: "20+", label: "Years of Storytelling", color: "var(--cyan)" },
            { value: "4", label: "Feature Films", color: "var(--magenta)" },
            { value: "2", label: "Award-Winning Directors", color: "var(--gold)" },
          ].map(({ value, label, color }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 36, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 6, letterSpacing: "0.05em", fontFamily: "'Plus Jakarta Sans'" }}>{label}</div>
            </div>
          ))}
        </div> */}
      </div>

      {/* Scroll cue */}
      {/* <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div className="scroll-cue"><div className="dot" /></div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Outfit'" }}>Scroll</span>
      </div> */}
    </section>
  );
}

/* ─── Marquee Banner ─── */
function MarqueeBanner() {
  const items = ["29th & Gay", "That's What She Said", "Ready? OK!", "Feet of Clay", "Award-Winning Cinema", "Independent Spirit", "San Diego, CA", "Since 2004"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "14px 0", background: "var(--surface)" }}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: i % 2 === 0 ? "rgba(255,255,255,0.9)" : "var(--magenta)", whiteSpace: "nowrap", padding: "0 32px" }}>
            {item}{i % 2 === 0 ? "" : " ✦"}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Films ─── */
const FILMS = [
  {
    title: "That's What She Said",
    year: "2012",
    rating: "R",
    runtime: "1h 25m",
    genre: "Comedy · Romance",
    director: "Carrie Preston",
    stars: ["Anne Heche", "Marcia DeBonis", "Alia Shawkat"],
    desc: "A down-and-dirty, quirky look at female friendship that doesn't shy away from the crudely honest reality of relationships in the 21st century.",
    image: "https://cdn.theplaylist.net/wp-content/uploads/2012/01/15051056/000008.26639.twss_1sht_FINAL_27x40_LobbyPoster-header.jpg",
    movie: "thats-what-she-said-trailer-xxs.mp4",
    accentColor: "var(--magenta-rgb)",
    reviewStar: "★★★★",
  },
  {
    title: "29th and Gay",
    year: "2005",
    rating: "NR",
    runtime: "1h 24m",
    genre: "Comedy",
    director: "Carrie Preston",
    stars: ["James Vasquez", "Nicole Marcks", "David McBean"],
    desc: "Following a year in the life of James Sanchez — a guy rapidly approaching 30 without a six-pack, a full head of hair, or a boyfriend.",
    image: "29th-and-gay-screen.webp",
    movie: "29th-and-gay-trailer-xxs.mp4",
    accentColor: "var(--cyan-rgb)",
    reviewStar: "★★★½",
  },
  {
    title: "Ready? OK!",
    year: "2008",
    rating: "PG-13",
    runtime: "1h 31m",
    genre: "Comedy · Drama",
    director: "James Vasquez",
    stars: ["Carrie Preston", "Michael Emerson", "Lurie Poston"],
    desc: "A single mom struggles to understand her young son's obsession with dresses, dolls, and girls' cheerleading — a poignant comedy about family and acceptance.",
    image: "ready-ok-screen-rev.webp",
    movie: "ready-ok-trailer-xxs.mp4",
    accentColor: "var(--gold-rgb)",
    reviewStar: "★★★★",
    fallbackImage: "ready-ok-screen-rev.webp",
  },
];

function FilmCard({ film, index }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`film-card reveal`}
      style={{
        position: "relative",
        minWidth: 500,
        width: "100%",
        maxWidth: 900,
        height: 400,
        borderRadius: 10,
        overflow: "hidden",
        cursor: "pointer",
        flexShrink: 0,
        transitionDelay: `${index * 0.12}s`,
      }}
    >
      {/* Background media */}

      <img
        src={imgError && film.fallbackImage ? film.fallbackImage : film.image}
        alt={film.title}
        loading="lazy"
        onError={() => setImgError(true)}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top",
          zIndex: 1,
        }}
      />

      {film.movie && !imgError ? (
        <video
          src={film.movie}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
            zIndex: 2,
          }}
        />
      ) : ""
      }
      {/* Accent gradient overlay — solid on left, fades right */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            30deg,
            rgba(${film.accentColor},1) 0%,
            rgba(${film.accentColor},1) 15%,
            rgba(${film.accentColor},0.4) 30%,
            rgba(${film.accentColor},0.2) 45%,
            transparent 85%
          )`,
          zIndex: 3,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            to right,
            rgba(${film.accentColor},1) 0%,
            rgba(${film.accentColor},0.5) 5%,
            rgba(${film.accentColor},0.4) 20%,
            rgba(${film.accentColor},0.2) 30%,
            transparent 85%
          )`,
          zIndex: 3,
        }}
      />

      {/* Dark bottom scrim for text legibility */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
        zIndex: 3,
      }} />

      {/* Content */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 4,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        maxWidth: "55%",
      }}>
        {/* Top label */}
        {/* <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.85)",
        }}>
          For fans of {film.genre.split(",")[0].trim()}
        </div> */}
        <div></div>

        {/* Title */}
        <div>
          <h3 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "white",
            margin: "0 0 10px",
            textShadow: "0 2px 12px rgba(0,0,0,0.4)",
          }}>
            {film.title}
          </h3>

          {/* Meta row */}
          <div style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.75)",
            display: "flex",
            gap: 6,
            alignItems: "center",
            flexWrap: "wrap",
          }}>
            <span style={{
              border: "1px solid rgba(255,255,255,0.6)",
              padding: "1px 5px",
              borderRadius: 3,
              fontSize: 11,
              fontWeight: 600,
            }}>
              {film.rating}
            </span>
            <span>·</span>
            <span>{film.genre}</span>
            <span>·</span>
            <span>{film.year}</span>
          </div>
          <div style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.75)",
            lineHeight: "9px",
            marginTop: "14px",
          }}>
            <div className="block">
              <span>Starring {film.stars?.join(", ")}</span>
            </div><br />
            <div className="block">
              <span>Directed by {film.director}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="card-play">
        <svg width="14" height="16" viewBox="0 0 14 16"><path d="M0 0L14 8L0 16V0Z"/></svg>
      </div>
    </div>
  );
}

function FilmsSection() {
  return (
    <section id="films" style={{ padding: "120px 40px", background: "var(--bg)" }}>
      <div style={{ margin: "0 auto" }}>
        <div style={{ marginBottom: 72 }}>

          <ScrollReveal direction="left">
            <div className=""
            style={{ marginBottom: 16 }}>
              <span className="section-label">Our Films</span>
            </div>
            <h2
              className=""
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(38px, 6vw, 72px)",
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                color: "white",
                maxWidth: 640,
              }}
            >
              Heart. Humor.
              <br />
              <span className="grad-gold">Human Truth.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="left">
            <p
              className=""
              style={{
                fontFamily: "'Plus Jakarta Sans'",
                fontSize: 16, color: "rgba(255,255,255,0.55)",
                maxWidth: 480, marginTop: 20, lineHeight: 1.6,
                transitionDelay: "0.1s",
              }}
            >
              Each Daisy 3 film dares to explore the full spectrum of human experience —
              with comedy, compassion, and uncompromising honesty.
            </p>
          </ScrollReveal>
        </div>

        {/* Cards container — flex row wrap, justify start */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "flex-start",
        }}>
          {FILMS.map((film, i) => (
            <FilmCard key={film.title} film={film} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── About ─── */
function AboutSection() {
  return (
    <section id="about" style={{ padding: "120px 40px", position: "relative", overflow: "hidden" }}>
      {/* BG accent */}
      <div className="orb" style={{ width: 400, height: 400, top: "-100px", right: "-100px", background: "rgba(255,0,170,0.05)" }} />


        <div style={{display: "flex", justifyContent: "center", margin: "0 auto"}}>
          <ScrollReveal direction="bottom" style={{margin: "0 auto", textAlign: "center"}}>
            <div className=""
            style={{ marginBottom: 16 }}>
              <span className="section-label">Our Story</span>
            </div>
            <h2
            className="reveal from-left"
            style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(38px, 6vw, 72px)",
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                color: "white",
                maxWidth: 640,
            }}
          >
            Born from{" "}
            <span className="text-[var(--magenta)]">Passion</span>
            ,<br />Built on{" "}
            <span className="text-[var(--gold)]">Craft</span>.
            </h2>
          </ScrollReveal>
        </div>

      <div style={{ margin: "0 auto", textAlign: "center", maxWidth: "1160px" }}>
        <div style={{margin: "30px auto", textAlign: "center"}}>

          <ScrollReveal direction="left" style={{margin: "0 auto", textAlign: "center"}}>
            <p
              className=""
              style={{ fontFamily: "'Plus Jakarta Sans'", maxWidth: "840px", margin: "0 auto 20px", fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 20, transitionDelay: "0.1s" }}
            >
              Founded in 2004 by producer <strong style={{ color: "white" }}>Mark Holmes</strong>,
              writer-director <strong style={{ color: "white" }}>James Vasquez</strong>, and
              actress <strong style={{ color: "white" }}>Carrie Preston</strong>, Daisy 3 Pictures
              emerged from a shared belief: that the most compelling stories live at the intersection
              of comedy and real human longing.
            </p>
            </ScrollReveal>

            <ScrollReveal direction="right" style={{margin: "0 auto", textAlign: "center"}}>
            <p
              className=""
              style={{ fontFamily: "'Plus Jakarta Sans'", maxWidth: "840px",  margin: "0 auto", fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, transitionDelay: "0.2s" }}
            >
              Based in San Diego, California, the studio has spent two decades proving that
              independent film can punch above its weight — with sharp writing, star performances,
              and stories that endure.
            </p>
          </ScrollReveal>

          {/* <div className="" style={{ marginTop: 40, display: "flex", gap: 16, transitionDelay: "0.3s" }}>
            <div style={{ padding: "18px 24px", background: "rgba(0,240,255,0.06)", border: "1px solid rgba(0,240,255,0.15)", borderRadius: 14 }}>
              <div style={{ fontFamily: "'Outfit'", fontWeight: 800, fontSize: 28, color: "var(--cyan)" }}>2004</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Studio Founded</div>
            </div>
            <div style={{ padding: "18px 24px", background: "rgba(255,0,170,0.06)", border: "1px solid rgba(255,0,170,0.15)", borderRadius: 14 }}>
              <div style={{ fontFamily: "'Outfit'", fontWeight: 800, fontSize: 28, color: "var(--magenta)" }}>4+</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Productions</div>
            </div>
            <div style={{ padding: "18px 24px", background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: 14 }}>
              <div style={{ fontFamily: "'Outfit'", fontWeight: 800, fontSize: 28, color: "var(--gold)" }}>SDQ</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>San Diego, CA</div>
            </div>
          </div> */}
        </div>

        {/* Right — team */}
        <div id="team">
          <div className="reveal from-right" style={{ marginBottom: 24 }}>
            <span className="section-label">The Founders</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { name: "Mark Holmes", role: "Producer & Co-Founder", desc: "The creative engine behind Daisy 3's production philosophy — championing stories that challenge and delight.", color: "var(--cyan)" },
              { name: "James Vasquez", role: "Writer, Director & Co-Founder", desc: "The visionary storyteller whose personal voice defines the studio's comedic and deeply human aesthetic.", color: "var(--magenta)" },
              { name: "Carrie Preston", role: "Actress, Director & Co-Founder", desc: "Multi-talented actress and director whose fearless performances and creative direction elevated every project.", color: "var(--gold)" },
            ].map((person, i) => (
              <div
                key={person.name}
                className={`team-card reveal ${i % 2 === 0 ? "from-right" : "from-left"}`}
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${person.color}40, ${person.color}15)`,
                    border: `1.5px solid ${person.color}60`,
                    flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Outfit'", fontWeight: 700, fontSize: 16,
                    color: person.color,
                  }}>
                    {person.name.split(" ").map(w => w[0]).join("")}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Outfit'", fontWeight: 700, fontSize: 16, color: "white", marginBottom: 3 }}>{person.name}</div>
                    <div style={{ fontSize: 11, color: person.color, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "'Outfit'", fontWeight: 600, marginBottom: 8 }}>{person.role}</div>
                    <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>{person.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact / CTA ─── */
function CTASection() {
  return (
    <section id="contact" style={{ padding: "120px 40px", background: "var(--bg)", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div className="orb" style={{ width: 600, height: 600, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "rgba(255,215,0,0.04)" }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
        <div className="reveal from-bottom" style={{ marginBottom: 20 }}>
          <span className="pill"><span className="dot" style={{ background: "var(--gold)" }} />Let's Make Something</span>
        </div>
        <h2
          className="reveal from-bottom"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(38px, 6vw, 76px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
            marginBottom: 24,
          }}
        >
          Got a story<br />worth telling?
        </h2>
        <p
          className="reveal from-bottom"
          style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 40px", transitionDelay: "0.1s" }}
        >
          Daisy 3 Pictures is always looking for bold voices, brave projects, and partnerships
          built on great storytelling.
        </p>
        <div className="reveal from-bottom" style={{ transitionDelay: "0.2s" }}>
          <a
            href="mailto:hello@daisy3pictures.com"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700, fontSize: 16,
              padding: "17px 44px",
              borderRadius: "100px",
              background: "linear-gradient(135deg, var(--cyan), var(--magenta))",
              color: "#000",
              textDecoration: "none",
              display: "inline-block",
              letterSpacing: "0.02em",
              transition: "transform 0.25s, box-shadow 0.25s",
            }}
            onMouseEnter={(e) => { e.target.style.transform = "scale(1.04)"; e.target.style.boxShadow = "0 0 60px rgba(0,240,255,0.2)"; }}
            onMouseLeave={(e) => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "none"; }}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "48px 40px 36px" }}>
      <div style={{ margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div className="daisy-mark" style={{ width: 22, height: 22 }} />
              <span style={{ fontFamily: "'Outfit'", fontWeight: 700, fontSize: 16, color: "white" }}>
                Daisy <span className="grad-cyan-mag">3</span> Pictures
              </span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, maxWidth: 240 }}>
              Independent film production.<br />San Diego, California. Est. 2004.
            </div>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Films</div>
              {["That's What She Said", "29th and Gay", "Ready? OK!", "Feet of Clay"].map((f) => (
                <div key={f} style={{ marginBottom: 8 }}><a href="#films" className="footer-link">{f}</a></div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit'", fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>Studio</div>
              {["About", "Team", "Contact", "Press"].map((l) => (
                <div key={l} style={{ marginBottom: 8 }}><a href={`#${l.toLowerCase()}`} className="footer-link">{l}</a></div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>© {new Date().getFullYear()} Daisy 3 Pictures. All rights reserved.</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Founded by Mark Holmes, James Vasquez & Carrie Preston</div>
        </div>
      </div>
    </footer>
  );
}

/* ─── App ─── */
export default function App() {
  useReveal();

  return (
    <>
      <FontLoader />
      <Nav />
      <Hero />
      <MarqueeBanner />
      <FilmsSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </>
  );
}