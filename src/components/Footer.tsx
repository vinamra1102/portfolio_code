export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t-[0.5px] border-[#1a1a1a] bg-canvas px-5 py-6 md:px-[60px] md:py-8">
      <div className="relative z-[1] flex flex-col items-center gap-2 text-center md:flex-row md:justify-between md:text-left">
        <p className="text-[13px] text-[#555555]">Anant Pandey</p>
        <p className="text-[12px] text-[#333333]">
          Built with Next.js and Framer Motion
        </p>
        <p className="text-[13px] text-[#555555]">2026</p>
      </div>
    </footer>
  );
}
