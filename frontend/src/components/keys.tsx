import { useEffect, useRef } from "react";

export default function PianoCanvas({
    onPlay,
    onStop,
}: {
    onPlay: (note: string) => void;
    onStop: (note: string) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const keysRef = useRef<
        { note: string; isBlack: boolean; x: number; y: number; w: number; h: number }[]
        >([]);
    const pressedRef = useRef<string | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const ctx = canvas.getContext("2d")!;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // array of notes
        const notes = [
            "C4",
            "C#4",
            "D4",
            "D#4",
            "E4",
            "F4",
            "F#4",
            "G4",
            "G#4",
            "A4",
            "A#4",
            "B4",
            "C5",
            "C#5",
            "D5",
            "D#5",
            "E5",
            "F5",
            "F#5",
            "G5",
            "G#5",
            "A5",
            "A#5",
            "B5",
            "C6",
        ];

        // record positions of white notes by filtering out sharps
        const whiteNotes = notes.filter(n => !n.includes("#"));
        // create width of notes based on length of white notes array
        const whiteWidth = canvas.width / whiteNotes.length;
        const whiteHeight = canvas.height;
        const blackWidth = whiteWidth / 2;
        const blackHeight = whiteHeight / 2;

        

        

        keysRef.current = [];

        // draw white keys
        let whiteIndex = 0;
        notes.forEach((note) => {
            // only draw if not sharp
            if (!note.includes("#")) {
                const x = whiteIndex * whiteWidth;
                ctx.fillStyle = "#fff";
                ctx.fillRect(x, 0, whiteWidth, whiteHeight);

                // 3D highlight
                const grad = ctx.createLinearGradient(x, 0, x, whiteHeight * 0.4);
                grad.addColorStop(0, "rgba(0,0,0,0.3)");
                grad.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = grad;
                ctx.fillRect(x, 0, whiteWidth, whiteHeight * 0.4);

                ctx.strokeStyle = "#000";
                ctx.strokeRect(x, 0, whiteWidth, whiteHeight);

                keysRef.current.push({ note, isBlack: false, x, y: 0, w: whiteWidth, h: whiteHeight });
                whiteIndex++;
            }
        });

        // draw black keys on top
        notes.forEach((note, i) => {
            if (note.includes("#")) {
                const whitePos = Math.floor(i / 2) * whiteWidth + whiteWidth - blackWidth / 2;
                ctx.fillStyle = "#111";
                ctx.fillRect(whitePos, 0, blackWidth, blackHeight);

                // glossy highlight
                const grad = ctx.createLinearGradient(whitePos, 0, whitePos, blackHeight * 0.4);
                grad.addColorStop(0, "rgba(0,255,255,0.2)");
                grad.addColorStop(1, "rgba(0,255,255,0)");
                ctx.fillStyle = grad;
                ctx.fillRect(whitePos, 0, blackWidth, blackHeight * 0.4);

                keysRef.current.push({
                    note,
                    isBlack: true,
                    x: whitePos,
                    y: 0,
                    w: blackWidth,
                    h: blackHeight,
                });
            }
        });

        // neon border
        ctx.shadowColor = "white";
        ctx.shadowBlur = 2;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // reset shadow so clicks aren�t weird later
        ctx.shadowBlur = 0;
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const hit =
            // first: black keys
            keysRef.current.find(
                (k) => k.isBlack && x >= k.x && x <= k.x + k.w && y >= k.y && y <= k.y + k.h
            ) ||
            // fallback: white keys
            keysRef.current.find(
                (k) => !k.isBlack && x >= k.x && x <= k.x + k.w && y >= k.y && y <= k.y + k.h
            );

        if (!hit) {
            console.warn("Clicked outside of any key");
            return;
        }

        pressedRef.current = hit.note;
        onPlay(hit.note);
    };


    const handleMouseUp = () => {
        if (pressedRef.current) {
            onStop(pressedRef.current);
            pressedRef.current = null;
        }
    };

    return (
        <div className="h-full w-full">
            <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="h-full w-full rounded-md border border-gray-700"
            />
        </div>
    );
}
