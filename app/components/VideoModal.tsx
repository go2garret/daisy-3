import { useModal } from "./ModalContext";
import { useEffect } from "react";

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1` : url;
}

export default function VideoModal() {
  const { activeModal, selectedFilm, closeModal } = useModal();
  const isOpen = activeModal === "video";
  const film = selectedFilm;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeModal]);

  return (
    <div
      onClick={closeModal}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflowY: "auto",
        padding: "2rem 1rem",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "all" : "none",
        transition: "opacity 0.3s ease",
      }}
    >
      {/* Modal card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          borderRadius: "4px",
          width: "100%",
          maxWidth: "860px",
          overflow: "hidden",
          position: "relative",
          border: "1px solid var(--border)",
          transform: isOpen ? "translateY(0)" : "translateY(24px)",
          transition: "transform 0.35s ease",
        }}
      >

        {/* ── Close button ── */}
        <button
          onClick={closeModal}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            zIndex: 10,
            width: "36px",
            minWidth: "36px",
            height: "36px",
            borderRadius: "50%",
            padding: 0,
            background: "rgba(0,0,0,0.5)",
            color: "var(--text)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            backdropFilter: "blur(4px)",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = film?.accentColor
              ? `rgba(${film.accentColor},0.3)`
              : "rgba(255,255,255,0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.5)";
          }}
        >
          ✕
        </button>

        {film && (
          <>
            {/* ── HERO: Full-bleed video background + title ── */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16/7",
                background: "#000",
                overflow: "hidden",
              }}
            >
              <video
                src={film.movie}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.55,
                }}
              />
              {/* Gradient scrim */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.4) 100%)",
                }}
              />
              {/* Title centered */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  padding: "2rem",
                  textAlign: "center",
                  gap: "0.4rem",
                }}
              >

                <h2
                  style={{
                    margin: "0 0 10px",
                    fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
                    color: "var(--off-white)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    textShadow: "0 2px 20px rgba(0,0,0,0.8)",
                  }}
                >
                  {film.title}
                </h2>
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
              </div>
            </div>

            {/* ── BODY: Poster + Details ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                padding: "2rem",
                borderBottom: "1px solid var(--border)",
                justifyContent: "center",
                alignItems: "center"
              }}
              className="film-body-grid"
            >
              {/* Poster */}
              <img
                src={film.image}
                alt={`${film.title} poster`}
                style={{
                  width: "calc(100% - 40px)",
                  maxWidth: "380px",
                  minWidth: "200px",
                  margin: "8px auto 0",
                  borderRadius: "1px",
                  objectFit: "cover",
                  border: "1px solid var(--dark-gray)",
                  flexShrink: 0,
                  display: "block",
                }}
              />

              {/* Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p
                  style={{
                    margin: "0 auto",
                    textAlign: "center",
                    maxWidth: "600px",
                    color: "var(--text-muted)",
                    fontSize: "1rem",
                    lineHeight: 1.75,
                  }}
                >
                  {film.desc}
                </p>
              </div>


                <div
                    style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "0",
                    borderTop: "1px solid var(--border)",
                    paddingTop: "1rem",
                    width: "100%"
                    }}
                >
                    {[
                    { label: "Runtime",    value: film.runtime    },
                    { label: "Director", value: film.director },
                    { label: "Stars",    value: film.stars.slice(0, 2).join(", ") },
                    ].map(({ label, value }) => (
                    <div key={label} style={{ padding: "0.5rem 0.75rem 0.5rem 0" }}>
                        <div
                        style={{
                            color: `rgba(${film.accentColor}, 0.85)`,
                            marginBottom: "0.25rem",
                        }}
                        className="section-label"
                        >
                        {label}
                        </div>
                        <div
                        style={{
                            color: "var(--text-muted)",
                            fontSize: "0.9rem",
                            lineHeight: 1.4,
                        }}
                        >
                        {value}
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            {/* ── TRAILER ── */}
            <div
              style={{
                padding: "1.75rem 2rem 2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    color: `rgba(${film.accentColor}, 0.85)`,
                  }}
                className="section-label"
                >
                  Trailer
                </span>
              </div>

              <div
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  borderRadius: "2px",
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                }}
              >
                <iframe
                  src={isOpen ? getYouTubeEmbedUrl(film.trailer) : ""}
                  title={`${film.title} – trailer`}
                  style={{ width: "100%", height: "100%", display: "block", border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}