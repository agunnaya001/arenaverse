const isExporting =
  typeof window !== "undefined" &&
  window.location.pathname.toLowerCase().includes("allslides");
const a = (n: number) => (isExporting ? "" : `anim-${n}`);

export default function Slide03HowItWorks() {
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

      <div className={`${a(0)}`}>
        <p
          className="font-body uppercase tracking-widest"
          style={{ fontSize: "2vw", color: "var(--slide-accent)", letterSpacing: "0.3em", marginBottom: "1.5vh" }}
        >
          Game Loop
        </p>
        <h2
          className="font-display title-underline text-primary"
          style={{ fontSize: "5.5vw", fontWeight: 800, lineHeight: 1, marginBottom: "3vh" }}
        >
          HOW IT WORKS
        </h2>
        <p className="font-body" style={{ fontSize: "3vw", color: "var(--slide-muted)", marginBottom: "5vh" }}>
          Four steps: Mint → Stake → Battle → Earn
        </p>
      </div>

      {/* Step cards */}
      <div className="flex flex-row flex-1" style={{ gap: "2vw" }}>
        {/* Step 01 */}
        <div
          className={`flex flex-col flex-1 ${a(1)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "1vw",
            padding: "3vh 2.5vw",
            borderTop: "0.4vh solid var(--slide-accent)",
            position: "relative",
          }}
        >
          <span
            className="font-display font-bold"
            style={{ fontSize: "8vw", color: "#1a2540", lineHeight: 1, marginBottom: "1vh", letterSpacing: "-0.02em" }}
          >
            01
          </span>
          <h3 className="font-display font-bold text-primary" style={{ fontSize: "3.5vw", lineHeight: 1, marginBottom: "2vh" }}>
            MINT
          </h3>
          <p className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)", lineHeight: 1.4, textWrap: "pretty" }}>
            Choose Warrior, Mage, or Rogue. Each NFT fighter has randomized on-chain stats.
          </p>
        </div>

        {/* Arrow */}
        <div className={`flex items-center ${a(1)}`} style={{ color: "var(--slide-accent)", fontSize: "4vw", fontWeight: 700 }}>
          →
        </div>

        {/* Step 02 */}
        <div
          className={`flex flex-col flex-1 ${a(2)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "1vw",
            padding: "3vh 2.5vw",
            borderTop: "0.4vh solid var(--slide-accent2)",
          }}
        >
          <span
            className="font-display font-bold"
            style={{ fontSize: "8vw", color: "#1a2540", lineHeight: 1, marginBottom: "1vh", letterSpacing: "-0.02em" }}
          >
            02
          </span>
          <h3 className="font-display font-bold text-primary" style={{ fontSize: "3.5vw", lineHeight: 1, marginBottom: "2vh" }}>
            STAKE
          </h3>
          <p className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)", lineHeight: 1.4, textWrap: "pretty" }}>
            Stake ARENA tokens to enter the combat queue and raise the stakes.
          </p>
        </div>

        {/* Arrow */}
        <div className={`flex items-center ${a(2)}`} style={{ color: "var(--slide-accent)", fontSize: "4vw", fontWeight: 700 }}>
          →
        </div>

        {/* Step 03 */}
        <div
          className={`flex flex-col flex-1 ${a(3)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "1vw",
            padding: "3vh 2.5vw",
            borderTop: "0.4vh solid var(--slide-accent)",
          }}
        >
          <span
            className="font-display font-bold"
            style={{ fontSize: "8vw", color: "#1a2540", lineHeight: 1, marginBottom: "1vh", letterSpacing: "-0.02em" }}
          >
            03
          </span>
          <h3 className="font-display font-bold text-primary" style={{ fontSize: "3.5vw", lineHeight: 1, marginBottom: "2vh" }}>
            BATTLE
          </h3>
          <p className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)", lineHeight: 1.4, textWrap: "pretty" }}>
            Battle resolves on-chain. Watch your fighter clash in a live 3D arena.
          </p>
        </div>

        {/* Arrow */}
        <div className={`flex items-center ${a(3)}`} style={{ color: "var(--slide-accent)", fontSize: "4vw", fontWeight: 700 }}>
          →
        </div>

        {/* Step 04 */}
        <div
          className={`flex flex-col flex-1 ${a(4)}`}
          style={{
            background: "var(--slide-surface)",
            borderRadius: "1vw",
            padding: "3vh 2.5vw",
            borderTop: "0.4vh solid var(--slide-accent2)",
          }}
        >
          <span
            className="font-display font-bold"
            style={{ fontSize: "8vw", color: "#1a2540", lineHeight: 1, marginBottom: "1vh", letterSpacing: "-0.02em" }}
          >
            04
          </span>
          <h3 className="font-display font-bold text-primary" style={{ fontSize: "3.5vw", lineHeight: 1, marginBottom: "2vh" }}>
            EARN
          </h3>
          <p className="font-body" style={{ fontSize: "2.8vw", color: "var(--slide-muted)", lineHeight: 1.4, textWrap: "pretty" }}>
            Winners claim rewards. Stats record to the on-chain leaderboard.
          </p>
        </div>
      </div>
    </div>
  );
}
