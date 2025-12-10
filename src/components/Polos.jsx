import Logo from "../assets/images/Educore_Logo_White.png";

export default function Polos() {
  return (
    <header className="bg-[#27B4E3] w-full text-white fixed top-0 left-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-6 md:px-10 py-3 flex items-center justify-between">
        {/* LOGO */}
        <img src={Logo} alt="Educore Logo" className="h-20 w-auto" />
      </nav>
    </header>
  );
}
