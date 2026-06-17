const isExporting =
  typeof window !== "undefined" &&
  window.location.pathname.toLowerCase().includes("allslides");
const a = (n: number) => (isExporting ? "" : `anim-${n}`);

export default function Slide01Title() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center dot-grid"
      style={{ background: "linear-gradient(160deg, #080c14 60%, #0b1420 100%)" }}
    >
      {/* Corner accent lines */}
      <div
        className="absolute top-0 left-0"
        style={{ width: "12vw", height: "0.4vh", background: "var(--slide-accent)" }}
      />
      <div
        className="absolute top-0 left-0"
        style={{ width: "0.4vh", height: "12vh", background: "var(--slide-accent)" }}
      />
      <div
        className="absolute bottom-0 right-0"
        style={{ width: "12vw", height: "0.4vh", background: "var(--slide-accent)" }}
      />
      <div
        className="absolute bottom-0 right-0"
        style={{ width: "0.4vh", height: "12vh", background: "var(--slide-accent)" }}
      />

      {/* Content */}
      <div className="flex flex-col items-center" style={{ gap: "1.5vh" }}>
        <p
          className={`font-body tracking-widest uppercase ${a(0)}`}
          style={{ fontSize: "2vw", color: "var(--slide-accent)", letterSpacing: "0.4em", marginBottom: "1vh" }}
        >
          Base Mainnet · Blockchain Battle Game
        </p>

        <h1
          className={`font-display tracking-tighter leading-none text-primary ${a(1)}`}
          style={{ fontSize: "14vw", fontWeight: 800, lineHeight: 0.9 }}
        >
          ARENA
        </h1>
        <h1
          className={`font-display tracking-tighter leading-none ${a(2)}`}
          style={{ fontSize: "14vw", fontWeight: 800, lineHeight: 0.9, color: "var(--slide-accent)" }}
        >
          BATTLE
        </h1>

        <div
          className={`${a(3)}`}
          style={{ width: "8vw", height: "0.4vh", background: "var(--slide-accent)", margin: "2vh 0" }}
        />

        <p
          className={`font-body text-primary ${a(4)}`}
          style={{ fontSize: "3.2vw", fontWeight: 600, opacity: 0.9 }}
        >
          3D Blockchain Battle Game on Base Mainnet
        </p>
        <p
          className={`font-body ${a(5)}`}
          style={{ fontSize: "2.6vw", color: "var(--slide-muted)", letterSpacing: "0.05em" }}
        >
          Mint fighters · Stake tokens · Win on-chain
        </p>
      </div>
    </div>
  );
}
