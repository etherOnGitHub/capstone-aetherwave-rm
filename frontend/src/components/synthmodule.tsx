import { useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import PianoCanvas from "./keys";

//create a simple synth module using Tone.js and React
export default function SynthModule() {
    const synthR = useRef<Tone.PolySynth | null>(null);
    useEffect(() => {
        
        // create a synth and connect it to the main output (your output device)
        synthR.current = new Tone.PolySynth().toDestination();
        synthR.current.volume.value = -12; // set volume to -12 dB - constantsfile

        
        
        // cleanup
        return () => {
            synthR.current?.dispose();
        };
    }, []);

    const playSynth = useCallback(
        async (note: string) => {
            synthR.current?.triggerAttack(note);
        },
        []
    );

    // stops note
    const stopSynth = useCallback((note: string) => {
        synthR.current?.triggerRelease(note);
    }, []);


    

    return (
        <div className="outline-solid outline-brandBlue-1 m-10 h-full w-full">
            <div className="w-full">
                <div className="w-full">
                    test
                </div>
                <div className="w-full">
                    <PianoCanvas onPlay={playSynth} onStop={stopSynth} />
                </div>
            </div>
        </div>
    );
}