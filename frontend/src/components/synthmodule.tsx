import { useEffect, useRef } from "react";
import * as Tone from "tone";

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

    // plays note
    const playSynth = async () => {
        await Tone.start();
        console.log("Audio is ready");
        // trigger note
        synthR.current?.triggerAttackRelease("C2");
    }
    // stops note
    const stopSynth = () => {
        // release the held note
        synthR.current?.triggerRelease("C2");
    };


    

    return (
        <div className="outline-solid outline-brandBlue-1 m-10 w-max">
            <div className="w-max">
                <h2>Synth Module</h2>
                <button
                    onMouseDown={playSynth}
                    onMouseUp={stopSynth}
                    onMouseLeave={stopSynth}
                >Hold Note</button>
                
            </div>
        </div>
    );
}