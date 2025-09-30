import { useState } from "react";

export default function Navbar() {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed left-0 top-0 flex w-full items-center justify-between px-6 py-3 text-white outline-double outline-brandBlue">
            {/* logo with gradient */  }
            <div className="font-orbitron relative inline-block text-3xl font-bold">
                <span className="animate-gradient-x absolute inset-0 select-none bg-gradient-to-r from-brandOrange via-brandSage to-brandBlue bg-clip-text text-transparent opacity-70 blur-lg">
                    aetherwave.rm
                </span>
                <span className="animate-gradient-x relative bg-gradient-to-r from-brandOrange via-brandSage to-brandBlue bg-clip-text text-transparent">
                    aetherwave.rm
                </span>
            </div>

            <div className="hidden space-x-8 md:flex">
                <a href="#" className="font-orbitron transition hover:text-blue-400">Home</a>
                <a href="#" className="font-orbitron transition hover:text-blue-400">About</a>
                <a href="#" className="font-orbitron transition hover:text-blue-400">Plugins</a>
                <a href="#" className="font-orbitron transition hover:text-blue-400">Feedback</a>
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
                <div className="absolute left-0 top-16 z-50 flex w-full flex-col items-center space-y-4 py-6 outline-2 outline-brandBlue md:hidden">
                    <a href="#" className="transition hover:text-blue-400">Home</a>
                    <a href="#" className="transition hover:text-blue-400">About</a>
                    <a href="#" className="transition hover:text-blue-400">Plugins</a>
                    <a href="#" className="transition hover:text-blue-400">Feedback</a>
                </div>
            )}
        </nav>
    );
}
