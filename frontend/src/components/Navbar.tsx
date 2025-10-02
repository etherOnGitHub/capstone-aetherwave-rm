import { useState } from "react";

export default function Navbar() {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed left-0 top-0 flex w-full items-center justify-between bg-black px-6 py-3 text-white">
            {/* logo with gradient */  }
            <div className="font-orbitron relative inline-block animate-bounce text-3xl font-bold">
                <span className="animate-gradient-x absolute inset-0 select-none bg-gradient-to-r from-brandOrange via-brandSage to-brandBlue bg-clip-text text-transparent opacity-70 blur-md">
                    aetherwave.rm
                </span>
                    <span className="  animate-gradient-x relative bg-gradient-to-r from-brandOrange via-brandSage to-brandBlue bg-clip-text text-transparent">
                        aetherwave.rm
                    </span>
            </div>

            <div className="hidden space-x-8 md:flex">
                <a href="#" className="font-orbitron animate-gradient-x relative bg-gradient-to-r from-brandOrange via-brandSage to-brandBlue bg-clip-text text-transparent">Home</a>
                <a href="#" className="font-orbitron animate-gradient-x relative bg-gradient-to-r from-brandOrange via-brandSage to-brandBlue bg-clip-text text-transparent">About</a>
                <a href="#" className="font-orbitron animate-gradient-x relative bg-gradient-to-r from-brandOrange via-brandSage to-brandBlue bg-clip-text text-transparent">Plugins</a>
                <a href="#" className="font-orbitron animate-gradient-x relative bg-gradient-to-r from-brandOrange via-brandSage to-brandBlue bg-clip-text text-transparent">Feedback</a>
            </div>

            {/* burger menu for mobile*/}

            <button
                className="focus:outline-none md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        // when burger is open, change to X
                        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 top-16 z-50 flex w-full flex-col items-center space-y-4 py-6 backdrop-blur-sm md:hidden">
                    <a href="#" className="animate-gradient-x relative bg-gradient-to-r from-brandOrange via-brandSage to-brandBlue bg-clip-text text-transparent">Home</a>
                    <a href="#" className="animate-gradient-x relative bg-gradient-to-r from-brandOrange via-brandSage to-brandBlue bg-clip-text text-transparent">About</a>
                    <a href="#" className="animate-gradient-x relative bg-gradient-to-r from-brandOrange via-brandSage to-brandBlue bg-clip-text text-transparent">Plugins</a>
                    <a href="#" className="animate-gradient-x relative bg-gradient-to-r from-brandOrange via-brandSage to-brandBlue bg-clip-text text-transparent">Feedback</a>
                </div>
            )}
        </nav>
    );
}
