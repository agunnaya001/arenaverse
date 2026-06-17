const isExporting =
  typeof window !== "undefined" &&
  window.location.pathname.toLowerCase().includes("allslides");
const a = (n: number) => (isExporting ? "" : `anim-${n}`);

export default function Slide05BattleArena() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden dot-grid flex flex-row"
      style={{ background: "#080c14" }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "0.5vh", background: "linear-gradient(90deg, var(--slide-accent), transparent)" }}
      />

      {/* Left: Text content */}
      <div
        className="flex flex-col justify-center"
        style={{ width: "52%", paddingLeft: "8vw", paddingRight: "4vw", paddingTop: "8vh", paddingBottom: "8vh" }}
      >
        <p
          className={`font-body uppercase tracking-widest ${a(0)}`}
          style={{ fontSize: "2vw", color: "var(--slide-accent)", letterSpacing: "0.3em", marginBottom: "1.5vh" }}
        >
          Visual Engine
        </p>
        <h2
          className={`font-display title-underline text-primary ${a(1)}`}
          style={{ fontSize: "5.5vw", fontWeight: 800, lineHeight: 1, marginBottom: "5vh" }}
        >
          3D BATTLE ARENA
        </h2>

        <div className={`flex flex-col ${a(2)}`} style={{ gap: "2.8vh" }}>
          <div className="flex items-start" style={{ gap: "2vw" }}>
            <div
              style={{
                width: "0.5vw",
                height: "3.5vh",
                background: "var(--slide-accent)",
                borderRadius: "0.3vw",
                flexShrink: 0,
                marginTop: "0.4vh",
              }}
            />
            <p className="font-body text-primary" style={{ fontSize: "3vw", lineHeight: 1.4 }}>
              WebGL scene powered by Three.js & React Three Fiber
            </p>
          </div>
          <div className="flex items-start" style={{ gap: "2vw" }}>
            <div
              style={{
                width: "0.5vw",
                height: "3.5vh",
                background: "var(--slide-accent)",
                borderRadius: "0.3vw",
                flexShrink: 0,
                marginTop: "0.4vh",
              }}
            />
            <p className="font-body text-primary" style={{ fontSize: "3vw", lineHeight: 1.4 }}>
              Real-time HP bars drain during simulated combat rounds
            </p>
          </div>
          <div className="flex items-start" style={{ gap: "2vw" }}>
            <div
              style={{
                width: "0.5vw",
                height: "3.5vh",
                background: "var(--slide-accent2)",
                borderRadius: "0.3vw",
                flexShrink: 0,
                marginTop: "0.4vh",
              }}
            />
            <p className="font-body text-primary" style={{ fontSize: "3vw", lineHeight: 1.4 }}>
              Victory explosion effects with Framer Motion overlays
            </p>
          </div>
          <div className="flex items-start" style={{ gap: "2vw" }}>
            <div
              style={{
                width: "0.5vw",
                height: "3.5vh",
                background: "var(--slide-accent2)",
                borderRadius: "0.3vw",
                flexShrink: 0,
                marginTop: "0.4vh",
              }}
            />
            <p className="font-body text-primary" style={{ fontSize: "3vw", lineHeight: 1.4 }}>
              Arena pillars, dynamic lighting, animated fighter models
            </p>
          </div>
        </div>
      </div>

      {/* Right: Geometric arena visualization */}
      <div
        className={`flex flex-col items-center justify-center ${a(3)}`}
        style={{
          width: "48%",
          background: "linear-gradient(160deg, #0a1020 0%, #080c14 100%)",
          borderLeft: "0.15vh solid #1e2a40",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid floor lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${50 + i * 6}%`,
              left: "0",
              right: "0",
              height: "0.1vh",
              background: `rgba(0, 200, 160, ${0.06 + i * 0.01})`,
            }}
          />
        ))}
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              bottom: "0",
              left: `${10 + i * 13}%`,
              width: "0.1vh",
              background: `rgba(0, 200, 160, 0.07)`,
              transform: `perspective(40vw) rotateX(60deg)`,
            }}
          />
        ))}

        {/* Arena hexagon */}
        <div style={{ position: "relative", width: "30vw", height: "30vw" }}>
          {/* Outer ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "0.2vh solid rgba(0,200,160,0.2)",
            }}
          />
          {/* Middle ring */}
          <div
            style={{
              position: "absolute",
              inset: "15%",
              borderRadius: "50%",
              border: "0.2vh solid rgba(0,200,160,0.35)",
            }}
          />
          {/* Inner platform */}
          <div
            style={{
              position: "absolute",
              inset: "30%",
              borderRadius: "50%",
              background: "rgba(0,200,160,0.08)",
              border: "0.3vh solid var(--slide-accent)",
            }}
          />
          {/* Center dot */}
          <div
            style={{
              position: "absolute",
              inset: "46%",
              borderRadius: "50%",
              background: "var(--slide-accent)",
            }}
          />

          {/* Pillar dots at cardinal points */}
          {[0, 60, 120, 180, 240, 300].map((deg, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "1.5vw",
                height: "1.5vw",
                borderRadius: "50%",
                background: i % 2 === 0 ? "var(--slide-accent)" : "var(--slide-accent2)",
                transform: `translate(-50%, -50%) rotate(${deg}deg) translateX(12vw)`,
              }}
            />
          ))}
        </div>

        {/* Labels */}
        <div className="absolute" style={{ top: "8vh", left: "2vw" }}>
          <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-accent)", fontWeight: 600 }}>
            WebGL
          </span>
        </div>
        <div className="absolute" style={{ top: "8vh", right: "2vw" }}>
          <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-accent)", fontWeight: 600 }}>
            Three.js
          </span>
        </div>
        <div className="absolute" style={{ bottom: "8vh", left: "2vw" }}>
          <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-accent2)", fontWeight: 600 }}>
            HP Bars
          </span>
        </div>
        <div className="absolute" style={{ bottom: "8vh", right: "2vw" }}>
          <span className="font-body" style={{ fontSize: "2.2vw", color: "var(--slide-accent2)", fontWeight: 600 }}>
            Victory FX
          </span>
        </div>
      </div>
    </div>
  );
}
