import { useModal } from "./ModalContext";

export default function ContactModal() {
  const { activeModal, closeModal } = useModal();
  const isOpen = activeModal === "contact";

  return (
    <div
      onClick={closeModal}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        overflowY: "auto",
        padding: "2rem 1rem",
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? "all" : "none",
        transition: "opacity 0.3s ease",
      }}
      className="items-start! lg:items-center!"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 860,
          margin: "0 auto",
          display: "grid",
          minHeight: 560,
          background: "#0d0d0d",
          boxShadow:
            "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,169,110,0.12)",
          overflow: "hidden",
        }}
        className="contact-grid"
      >
        <style>{`
          .contact-grid {
            grid-template-columns: 1fr 1fr;
          }

          @media (max-width: 900px) {
            .contact-grid {
              grid-template-columns: 1fr;
            }
            .contact-left {
              display: none;
            }
          }

          .contact-left {
            background: linear-gradient(160deg, #111008 0%, #0a0a08 100%);
            padding: 56px 48px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-right: 1px solid rgba(200,169,110,0.1);
            position: relative;
            overflow: hidden;
          }

          .contact-left::before {
            content:'';
            position:absolute;
            bottom:-80px;
            left:-80px;
            width:320px;
            height:320px;
            background: radial-gradient(circle, rgba(200,169,110,0.07) 0%, transparent 70%);
          }

          .contact-right {
            background:#080808;
            padding:56px 48px;
            display:flex;
            flex-direction:column;
            justify-content:center;
          }

          .field-wrap {
            position:relative;
            margin-bottom:40px;
          }

          .field-wrap input,
          .field-wrap textarea {
            width:100%;
            background:none;
            border:none;
            border-bottom:1px solid rgba(200,169,110,0.18);
            padding:14px 0 10px;
            font-size:14px;
            letter-spacing:0.04em;
            color:var(--off-white);
            outline:none;
            resize:none;
            display:block;
            transition:border-color .3s;
          }

          .field-wrap textarea{
            height:90px;
            padding-top:18px;
          }

          .field-wrap input::placeholder,
          .field-wrap textarea::placeholder{
            color:transparent;
          }

          .field-line{
            position:absolute;
            bottom:0;
            left:0;
            height:1px;
            width:0;
            background:var(--gold);
            transition:width .45s cubic-bezier(.16,1,.3,1);
          }

          .field-wrap input:focus ~ .field-line,
          .field-wrap textarea:focus ~ .field-line{
            width:100%;
          }

          .field-label{
            position:absolute;
            top:14px;
            left:0;
            font-size:11px;
            letter-spacing:.26em;
            text-transform:uppercase;
            color:var(--light-gray);
            pointer-events:none;
            transition:all .3s cubic-bezier(.16,1,.3,1);
          }

          .field-wrap input:focus ~ .field-line ~ .field-label,
          .field-wrap input:not(:placeholder-shown) ~ .field-line ~ .field-label,
          .field-wrap textarea:focus ~ .field-line ~ .field-label,
          .field-wrap textarea:not(:placeholder-shown) ~ .field-line ~ .field-label{
            top:-6px;
            font-size:9px;
            color:var(--gold);
            letter-spacing:.32em;
          }

          .contact-submit{
            width:100%;
            background:var(--gold);
            border:none;
            border-radius: 2rem;
            padding: 20px 16px;
            font-size:16px;
            letter-spacing: 0.02em;
            color:#080808;
            cursor:pointer;
            position:relative;
            overflow:hidden;
            margin-top:8px;
            font-weight: 700;
            font-family: var(--font-title);
          }

          .contact-submit::before{
            content:'';
            position:absolute;
            inset:0;
            background:rgba(255,255,255,0.12);
            transform:translateX(-100%);
            transition:transform .4s cubic-bezier(.16,1,.3,1);
          }

          .contact-submit:hover::before{
            transform:translateX(0);
          }

          .contact-close{
            position:absolute;
            top:20px;
            right:20px;
            min-width:36px;
            width:36px;
            height:36px;
            background:none;
            color:var(--light-gray);
            font-size:18px;
            cursor:pointer;
            display:flex;
            align-items:center;
            justify-content:center;
            transition: background .3s ease;
            z-index:10;
            border-radius: 100%;
            padding: 0;
          }

          .contact-close:hover{
            color:var(--off-white);
            background: rgba(var(--gold-rgb), 0.15);
          }
        `}</style>

        {/* CLOSE BUTTON */}
        <button className="contact-close" onClick={closeModal}>
          ✕
        </button>

        {/* LEFT PANEL */}
        <div className="contact-left">
          <div>
            <div
              style={{
                color: "var(--light-gray)",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
              className="section-label"
            >
              Independent Film Production · San Diego
            </div>

            <div
              style={{
                fontFamily: "var(--font-title)",
                fontSize: "clamp(24px,3.5vw,36px)",
                fontWeight: 800,
                lineHeight: 1.1,
                color: "var(--gold)",
                marginBottom: 24,
              }}
            >
              Daisy 3
              <span style={{ color: "var(--off-white)" }}> Pictures</span>
            </div>

            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                lineHeight: 1.8,
                letterSpacing: "0.01em",
                width: "100%",
              }}
              className="max-w-[400px] lg:max-w-[260px]"
            >
              Independent film production studio creating narrative films,
              documentaries, and cinematic storytelling from San Diego,
              California.
            </p>
          </div>

          {/* <div
            style={{
              borderTop: "1px solid rgba(200,169,110,0.1)",
              paddingTop: 28,
            }}
          >
            {[
              "Narrative Film Production",
              "Documentary Projects",
              "Cinematography & Direction",
              "Post-Production Editing",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 11,
                  color: "var(--muted)",
                  letterSpacing: "0.06em",
                  padding: "7px 0",
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--gold)",
                    opacity: 0.6,
                    flexShrink: 0,
                  }}
                />
                {item}
              </div>
            ))}
          </div> */}
        </div>

        {/* RIGHT PANEL */}
        <div className="contact-right">
          <div
            style={{
              fontFamily: "var(--font-title)",
              fontSize: "clamp(28px,3vw,36px)",
              fontWeight: 800,
              color: "var(--off-white)",
              marginBottom: 40,
              lineHeight: "1.1",
              display: "inline",
            }}
          >
            <span>Send us a </span><span style={{ color: "var(--gold)" }}>message</span>
          </div>

          <div className="field-wrap">
            <input type="text" placeholder="Name" required />
            <span className="field-line" />
            <label className="field-label">Your Name</label>
          </div>

          <div className="field-wrap">
            <input type="email" placeholder="Email" required />
            <span className="field-line" />
            <label className="field-label">Email Address</label>
          </div>

          <div className="field-wrap">
            <textarea placeholder="Message" required />
            <span className="field-line" />
            <label className="field-label">Your Message</label>
          </div>

          <button className="contact-submit hover-shadow-lg shadow-gold">
            Send Message
          </button>

          <div
            style={{
              marginTop: 20,
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "var(--muted)",
              textAlign: "center",
            }}
          >
            We'll get back to you soon
          </div>
        </div>
      </div>
    </div>
  );
}