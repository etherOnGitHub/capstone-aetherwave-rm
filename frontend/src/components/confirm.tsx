import React from "react";

type ConfirmModalProps = {
    isOpen: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
    isOpen,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-[90%] max-w-md rounded-lg border border-[#7f967f] bg-[#111] p-6 text-white shadow-xl">
                <h2 className="font-orbitron mb-3 text-xl">{title}</h2>
                <p className="font-exo mb-6 text-[#aaa]">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="rounded border border-[#7f967f] px-4 py-2 transition hover:bg-[#7f967f]/20"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-transparent px-4 py-2 text-white transition hover:bg-brandOrange"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
