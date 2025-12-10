import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/Educore_Logo_White.png";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="w-full px-10 py-3 flex justify-between items-center bg-transparent">
      <nav className="max-w-7xl mx-auto px-10 md:px-10 py-3 flex items-center">
        {/* LOGO */}
        <button
          onClick={() => navigate("/")}
          className="focus:outline-none hover:opacity-80 transition"
        >
          <img src={Logo} alt="Educore Logo" className="h-50 w-auto" />
        </button>
      </nav>
    </header>
  );
}
