import { useEffect, useState } from "react";

export default function LoginModal({ isOpen, onClose, }: { isOpen: boolean; onClose: () => void }) {

    const [formHTML, setFormHTML] = useState<string | null>(null);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";

        // grab the pre-rendered template
        const modalNode = document.getElementById("auth-modal");
        if (modalNode) {
            setFormHTML(modalNode.innerHTML);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 mt-[60px] flex items-baseline justify-center backdrop-blur">
            <div className="relative w-[400px] bg-white p-6">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-black hover:opacity-70"
                >
                    ×
                </button>

                <div
                    dangerouslySetInnerHTML={{ __html: formHTML || "" }}
                />
            </div>
        </div>
    );
}
