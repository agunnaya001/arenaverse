const isExporting =
  typeof window !== "undefined" &&
  window.location.pathname.toLowerCase().includes("allslides");
const a = (n: number) => (isExporting ? "" : `anim-${n}`);

export default function Slide02Opportunity() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden dot-grid"
      style={{ background: "#080c14" }}
    >
      {/* Large watermark number */}
      <div
        className="absolute right-0 top-0 font-display font-bold select-none pointer-events-none"
        style={{
          fontSize: "28vw",
          color: "#0e1525",
          lineHeight: 1,
          right: "-2vw",
          top: "-2vh",
          letterSpacing: "-0.05em",
        }}
      >
        02
      </div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "0.5vh", background: "linear-gradient(90deg, var(--slide-accent), transparent)" }}
      />

      <div
        className="flex flex-col justify-center h-full"
        style={{ paddingLeft: "8vw", paddingRight: "45vw", paddingTop: "6vh", paddingBottom: "6vh" }}
      >
        <p
          className={`font-body uppercase tracking-widest ${a(0)}`}
          style={{ fontSize: "2vw", color: "var(--slide-accent)", letterSpacing: "0.3em", marginBottom: "2vh" }}
        >
          Market Context
        </p>

        <h2
          className={`font-display title-underline text-primary ${a(1)}`}
          style={{ fontSize: "6vw", fontWeight: 800, lineHeight: 1, marginBottom: "5vh", textWrap: "balance" }}
        >
          THE OPPORTUNITY
        </h2>

        <div className={`flex flex-col ${a(2)}`} style={{ gap: "3.5vh" }}>
          <div className="flex items-start" style={{ gap: "2vw" }}>
            <span className="font-display font-bold shrink-0" style={{ fontSize: "3.5vw", color: "var(--slide-accent)", lineHeight: 1.1 }}>
              →
            </span>
            <p className="font-body text-primary" style={{ fontSize: "3.2vw", lineHeight: 1.4, textWrap: "pretty" }}>
              Web3 games lack real on-chain mechanics — most are UX wrappers
            </p>
          </div>

          <div className="flex items-start" style={{ gap: "2vw" }}>
            <span className="font-display font-bold shrink-0" style={{ fontSize: "3.5vw", color: "var(--slide-accent)", lineHeight: 1.1 }}>
              →
            </span>
            <p className="font-body text-primary" style={{ fontSize: "3.2vw", lineHeight: 1.4, textWrap: "pretty" }}>
              Base Mainnet: low fees, fast finality, EVM-compatible
            </p>
          </div>

          <div className="flex items-start" style={{ gap: "2vw" }}>
            <span className="font-display font-bold shrink-0" style={{ fontSize: "3.5vw", color: "var(--slide-accent)", lineHeight: 1.1 }}>
              →
            </span>
            <p className="font-body text-primary" style={{ fontSize: "3.2vw", lineHeight: 1.4, textWrap: "pretty" }}>
              Players want ownership: NFT fighters, earned tokens, verifiable results
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
