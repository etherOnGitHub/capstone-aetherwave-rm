import { useState, useEffect } from "react";

type AuthState = {
    authenticated: boolean;
    username: string | null;
};

export default function Navbar() {
    const [auth, setAuth] = useState<AuthState>({
        authenticated: false,
        username: null,
    });

    useEffect(() => {
        fetch("/api/auth-status/", { credentials: "include" })
            .then((res) => res.json())
            .then(setAuth)
            .catch(console.error);
    }, []);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 flex w-full items-center bg-black px-6 py-3 text-white">
            {/* logo with gradient */  }
            <div className="font-orbitron relative mr-8 inline-block animate-bounce text-3xl font-bold">
                <span className="animate-gradient-x from-brandOrange via-brandSage to-brandBlue absolute inset-0 bg-gradient-to-r bg-clip-text text-transparent opacity-70 blur-md select-none">
                    aetherwave.rm
                </span>
                    <span className="  animate-gradient-x from-brandOrange via-brandSage to-brandBlue relative bg-gradient-to-r bg-clip-text text-transparent">
                        aetherwave.rm
                    </span>
            </div>

            <div className="hidden justify-start space-x-8 md:flex">
                <a href="/" className="font-orbitron animate-gradient-x from-brandOrange via-brandSage to-brandBlue relative bg-gradient-to-r bg-clip-text text-transparent">Home</a>
                <a href="#" className="font-orbitron animate-gradient-x from-brandOrange via-brandSage to-brandBlue pointer-events-none relative cursor-not-allowed bg-gradient-to-r bg-clip-text text-transparent opacity-50">About</a>
                <a href="#" className="font-orbitron animate-gradient-x from-brandOrange via-brandSage to-brandBlue pointer-events-none relative cursor-not-allowed bg-gradient-to-r bg-clip-text text-transparent opacity-50">Plugins</a>
                <a href="#" className="font-orbitron animate-gradient-x from-brandOrange via-brandSage to-brandBlue pointer-events-none relative cursor-not-allowed bg-gradient-to-r bg-clip-text text-transparent opacity-50">Feedback</a>
            </div>
            <div className="ml-auto hidden justify-end space-x-8 md:block">
                {auth.authenticated && <span className="ml-2 opacity-70">Welcome, {auth.username}</span>}
                <a
                    href={auth.authenticated ? "/accounts/logout" : "/accounts/login"}
                    className="font-orbitron animate-gradient-x from-brandOrange via-brandSage to-brandBlue relative justify-end bg-gradient-to-r bg-clip-text text-transparent"
                >
                    {auth.authenticated ? "Logout" : "Login"}
                </a>
            </div>
            {/* burger menu for mobile*/}

            <button
                className="ml-auto focus:ring-brandWhite focus:ring-2 focus:outline-none md:hidden"
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
                <div className="absolute top-16 left-0 z-50 flex w-full flex-col items-center space-y-4 py-6 backdrop-blur-sm md:hidden">
                    <a href="/" className="animate-gradient-x from-brandOrange via-brandSage to-brandBlue relative bg-gradient-to-r bg-clip-text text-transparent">Home</a>
                    <a href="#" className="animate-gradient-x from-brandOrange via-brandSage to-brandBlue pointer-events-none relative cursor-not-allowed bg-gradient-to-r bg-clip-text text-transparent opacity-50">About</a>
                    <a href="#" className="animate-gradient-x from-brandOrange via-brandSage to-brandBlue pointer-events-none relative cursor-not-allowed bg-gradient-to-r bg-clip-text text-transparent opacity-50">Plugins</a>
                    <a href="#" className="animate-gradient-x from-brandOrange via-brandSage to-brandBlue pointer-events-none relative cursor-not-allowed bg-gradient-to-r bg-clip-text text-transparent opacity-50">Feedback</a>
                    <a
                        href={auth.authenticated ? "/accounts/logout" : "/accounts/login"}
                        className="font-orbitron animate-gradient-x from-brandOrange via-brandSage to-brandBlue relative justify-end bg-gradient-to-r bg-clip-text text-transparent"
                    >
                        {auth.authenticated ? "Logout" : "Login"}
                    </a>
                </div>
            )}
            
        </nav>
    );
}
