const isExporting =
  typeof window !== "undefined" &&
  window.location.pathname.toLowerCase().includes("allslides");
const a = (n: number) => (isExporting ? "" : `anim-${n}`);

export default function Slide04FighterClasses() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden dot-grid flex flex-col"
      style={{ background: "#080c14", paddingLeft: "6vw", paddingRight: "6vw", paddingTop: "7vh", paddingBottom: "7vh" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "0.5vh", background: "linear-gradient(90deg, var(--slide-accent), transparent)" }}
      />

      <div className={`${a(0)}`} style={{ marginBottom: "5vh" }}>
        <p
          className="font-body uppercase tracking-widest"
          style={{ fontSize: "2vw", color: "var(--slide-accent)", letterSpacing: "0.3em", marginBottom: "1.5vh" }}
        >
          NFT Roster
        </p>
        <h2
          className="font-display title-underline text-primary"
          style={{ fontSize: "5.5vw", fontWeight: 800, lineHeight: 1 }}
        >
          FIGHTER CLASSES
        </h2>
      </div>

      <div className="flex flex-row flex-1" style={{ gap: "3vw" }}>
        {/* Warrior */}
        <div
          className={`flex flex-col flex-1 ${a(1)}`}
          style={{
            background: "linear-gradient(160deg, #0e1525 0%, #0a1020 100%)",
            borderRadius: "1vw",
            padding: "4vh 2.5vw",
            border: "0.15vh solid #1e2a40",
          }}
        >
          <div
            className="font-display font-bold text-center"
            style={{
              fontSize: "5vw",
              color: "var(--slide-accent)",
              marginBottom: "2vh",
              paddingBottom: "2vh",
              borderBottom: "0.15vh solid #1e2a40",
            }}
          >
            WARRIOR
          </div>
          <p className="font-body text-center" style={{ fontSize: "2.8vw", color: "var(--slide-muted)", marginBottom: "3vh", lineHeight: 1.4 }}>
            High defense, balanced attack. Built to survive.
          </p>
          <div style={{ marginTop: "auto" }}>
            <div style={{ marginBottom: "2vh" }}>
              <div className="flex justify-between" style={{ marginBottom: "0.8vh" }}>
                <span className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>ATK</span>
                <span className="font-body font-semibold" style={{ fontSize: "2.5vw", color: "var(--slide-primary)" }}>65</span>
              </div>
              <div style={{ background: "#1e2a40", borderRadius: "0.5vw", height: "1vh" }}>
                <div style={{ background: "var(--slide-accent)", width: "65%", height: "100%", borderRadius: "0.5vw" }} />
              </div>
            </div>
            <div style={{ marginBottom: "2vh" }}>
              <div className="flex justify-between" style={{ marginBottom: "0.8vh" }}>
                <span className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>DEF</span>
                <span className="font-body font-semibold" style={{ fontSize: "2.5vw", color: "var(--slide-primary)" }}>85</span>
              </div>
              <div style={{ background: "#1e2a40", borderRadius: "0.5vw", height: "1vh" }}>
                <div style={{ background: "var(--slide-accent)", width: "85%", height: "100%", borderRadius: "0.5vw" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between" style={{ marginBottom: "0.8vh" }}>
                <span className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>SPD</span>
                <span className="font-body font-semibold" style={{ fontSize: "2.5vw", color: "var(--slide-primary)" }}>50</span>
              </div>
              <div style={{ background: "#1e2a40", borderRadius: "0.5vw", height: "1vh" }}>
                <div style={{ background: "var(--slide-accent)", width: "50%", height: "100%", borderRadius: "0.5vw" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Mage */}
        <div
          className={`flex flex-col flex-1 ${a(2)}`}
          style={{
            background: "linear-gradient(160deg, #0e1525 0%, #0a1020 100%)",
            borderRadius: "1vw",
            padding: "4vh 2.5vw",
            border: "0.15vh solid var(--slide-accent)",
          }}
        >
          <div
            className="font-display font-bold text-center"
            style={{
              fontSize: "5vw",
              color: "var(--slide-accent2)",
              marginBottom: "2vh",
              paddingBottom: "2vh",
              borderBottom: "0.15vh solid #1e2a40",
            }}
          >
            MAGE
          </div>
          <p className="font-body text-center" style={{ fontSize: "2.8vw", color: "var(--slide-muted)", marginBottom: "3vh", lineHeight: 1.4 }}>
            Low defense, devastating spell power. High risk.
          </p>
          <div style={{ marginTop: "auto" }}>
            <div style={{ marginBottom: "2vh" }}>
              <div className="flex justify-between" style={{ marginBottom: "0.8vh" }}>
                <span className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>ATK</span>
                <span className="font-body font-semibold" style={{ fontSize: "2.5vw", color: "var(--slide-primary)" }}>95</span>
              </div>
              <div style={{ background: "#1e2a40", borderRadius: "0.5vw", height: "1vh" }}>
                <div style={{ background: "var(--slide-accent2)", width: "95%", height: "100%", borderRadius: "0.5vw" }} />
              </div>
            </div>
            <div style={{ marginBottom: "2vh" }}>
              <div className="flex justify-between" style={{ marginBottom: "0.8vh" }}>
                <span className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>DEF</span>
                <span className="font-body font-semibold" style={{ fontSize: "2.5vw", color: "var(--slide-primary)" }}>30</span>
              </div>
              <div style={{ background: "#1e2a40", borderRadius: "0.5vw", height: "1vh" }}>
                <div style={{ background: "var(--slide-accent2)", width: "30%", height: "100%", borderRadius: "0.5vw" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between" style={{ marginBottom: "0.8vh" }}>
                <span className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>SPD</span>
                <span className="font-body font-semibold" style={{ fontSize: "2.5vw", color: "var(--slide-primary)" }}>70</span>
              </div>
              <div style={{ background: "#1e2a40", borderRadius: "0.5vw", height: "1vh" }}>
                <div style={{ background: "var(--slide-accent2)", width: "70%", height: "100%", borderRadius: "0.5vw" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Rogue */}
        <div
          className={`flex flex-col flex-1 ${a(3)}`}
          style={{
            background: "linear-gradient(160deg, #0e1525 0%, #0a1020 100%)",
            borderRadius: "1vw",
            padding: "4vh 2.5vw",
            border: "0.15vh solid #1e2a40",
          }}
        >
          <div
            className="font-display font-bold text-center"
            style={{
              fontSize: "5vw",
              color: "var(--slide-accent)",
              marginBottom: "2vh",
              paddingBottom: "2vh",
              borderBottom: "0.15vh solid #1e2a40",
            }}
          >
            ROGUE
          </div>
          <p className="font-body text-center" style={{ fontSize: "2.8vw", color: "var(--slide-muted)", marginBottom: "3vh", lineHeight: 1.4 }}>
            Speed-first assassin. Strikes before the enemy can react.
          </p>
          <div style={{ marginTop: "auto" }}>
            <div style={{ marginBottom: "2vh" }}>
              <div className="flex justify-between" style={{ marginBottom: "0.8vh" }}>
                <span className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>ATK</span>
                <span className="font-body font-semibold" style={{ fontSize: "2.5vw", color: "var(--slide-primary)" }}>75</span>
              </div>
              <div style={{ background: "#1e2a40", borderRadius: "0.5vw", height: "1vh" }}>
                <div style={{ background: "var(--slide-accent)", width: "75%", height: "100%", borderRadius: "0.5vw" }} />
              </div>
            </div>
            <div style={{ marginBottom: "2vh" }}>
              <div className="flex justify-between" style={{ marginBottom: "0.8vh" }}>
                <span className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>DEF</span>
                <span className="font-body font-semibold" style={{ fontSize: "2.5vw", color: "var(--slide-primary)" }}>50</span>
              </div>
              <div style={{ background: "#1e2a40", borderRadius: "0.5vw", height: "1vh" }}>
                <div style={{ background: "var(--slide-accent)", width: "50%", height: "100%", borderRadius: "0.5vw" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between" style={{ marginBottom: "0.8vh" }}>
                <span className="font-body" style={{ fontSize: "2.5vw", color: "var(--slide-muted)" }}>SPD</span>
                <span className="font-body font-semibold" style={{ fontSize: "2.5vw", color: "var(--slide-primary)" }}>95</span>
              </div>
              <div style={{ background: "#1e2a40", borderRadius: "0.5vw", height: "1vh" }}>
                <div style={{ background: "var(--slide-accent)", width: "95%", height: "100%", borderRadius: "0.5vw" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
