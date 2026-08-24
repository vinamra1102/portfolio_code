export default function Footer() {
  return (
    <footer className="w-full border-t-[0.5px] border-[#1a1a1a] bg-canvas px-6 py-8 md:px-[60px]">
      <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between">
        <p className="text-[13px] text-[#555555]">Anant Pandey</p>
        <p className="text-[12px] text-[#333333]">
          Built with Next.js and Framer Motion
        </p>
        <p className="text-[13px] text-[#555555]">2025</p>
      </div>
    </footer>
  );
}
