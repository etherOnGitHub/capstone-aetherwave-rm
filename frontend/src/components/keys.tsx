import { useRef, useEffect } from "react";
import * as Tone from "tone";


type KeysProps = {
    onPlay: (note: string) => void;
    onStop: (note: string) => void;
};
export default function Keys({ onPlay, onStop }: KeysProps) {
    // Keys array
    const notes = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"];

    return (
        <div className="flex gap-2">
            {notes.map((note) => (
                <button
                    key={note}
                    onMouseDown={() => onPlay(note)}
                    onMouseUp={() => onStop(note)}
                    onMouseLeave={() => onStop(note)}
                    className="w-16 h-40 bg-white border rounded active:bg-gray-200"
                >
                    {note}
                </button>
            ))}
        </div>

    );

}