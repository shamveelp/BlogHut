import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-background flex flex-col items-center justify-center pt-20 overflow-hidden" aria-label="Blog hero">
      <div className="w-full max-w-[1200px] px-8 flex items-center justify-center">
        <h1 className="font-black tracking-[-0.04em] text-foreground leading-[0.9] uppercase whitespace-nowrap m-0 max-sm:whitespace-normal text-[clamp(80px,15vw,180px)] max-sm:text-[clamp(52px,18vw,90px)]">BLOG HUT</h1>
      </div>
      <div className="w-full h-px bg-border mt-[60px]" aria-hidden="true" />
    </section>
  );
}
