import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed left-0 top-0 flex w-full items-center justify-between bg-gray-900 px-6 py-4 text-white">
            <div className="font-orbitron text-2xl">aetherwave.rm</div>

            <div className="hidden space-x-8 md:flex">
                <a href="#" className="font-exo transition hover:text-blue-400">Home</a>
                <a href="#" className="font-exo transition hover:text-blue-400">About</a>
                <a href="#" className="font-exo transition hover:text-blue-400">Services</a>
                <a href="#" className="font-exo transition hover:text-blue-400">Contact</a>
            </div>
            // burger menu for mobile
            <button
                className="focus:outline-none md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute left-0 top-16 z-50 flex w-full flex-col items-center space-y-4 bg-gray-800 py-6 md:hidden">
                    <a href="#" className="transition hover:text-blue-400">Home</a>
                    <a href="#" className="transition hover:text-blue-400">About</a>
                    <a href="#" className="transition hover:text-blue-400">Plugins</a>
                    <a href="#" className="transition hover:text-blue-400">Feedback</a>
                </div>
            )}
        </nav>
    );
}
