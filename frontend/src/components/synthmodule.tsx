import { useEffect, useRef, useCallback, useState } from "react";
import * as Tone from "tone";
import PianoCanvas from "./keys";
import { Knob, Pointer, Arc } from "rc-knob";
// import { DEFAULTS } from ../constants/constants;
console.log(Knob); 
//create a simple synth module using Tone.js and React
export default function SynthModule() {

    // declare settings
    const [volume, setVolume] = useState(-12);

    // ref to synth so it doesnt update on every render
    const synthR = useRef<Tone.PolySynth | null>(null);
    useEffect(() => {
        
        // create a synth and connect it to the main output (your output device)
        synthR.current = new Tone.PolySynth().toDestination();
        // cleanup
        return () => {
            synthR.current?.dispose();
        };
    }, []);

    // plays note
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

    useEffect(() => {
        if (!synthR.current) return;

        // if volume is -60 or lower, fully mute
        if (volume <= -60) {
            synthR.current.volume.value = -Infinity;
        } else {
            synthR.current.volume.value = volume;
        }
    }, [volume]);
    

    return (
        <div className="outline-solid outline-brandBlue-1 m-10 h-full w-full">
            <div className="w-full">
                {/* Controls */}
                <div className="w-full">
                    <div className="synth-knob w-full">
                        <div className="flex flex-initial">
                            <p className="font-exo border border-r-emerald-100">Volume: {volume} dB</p>
                        </div>
                        <div className="flex border border-r-emerald-100">
                            <Knob
                                size={50}
                                angleOffset={220}      // where the knob arc starts (degrees)
                                angleRange={280}       // total angle the knob can rotate through
                                min={-60}
                                max={0}
                                value={volume}
                                onChange={(v) => {
                                    const min = -60;
                                    const max = 0;
                                    const norm = (v - min) / (max - min); // normalize to 0-1
                                    const expo = 1 - Math.pow(1 - norm, 2); // exponential scaling
                                    const newVol = min + expo * (max - min); // scale back to original range
                                    setVolume(Math.round(newVol * 100) / 100) // 2 decimal places
                                }}
                                aria-label="Volume knob"
                                steps={6000}
                                snap={true}// number of discrete steps
                            >
                            <Arc
                                arcWidth={8}
                                color="#ffffff"        // active progress color
                                background="#7f967f"   // background track color
                            />
                            <Pointer
                                width={1}
                                height={10}
                                type="rect"
                                color="#ffffff"        // pointer color
                                radius={5}            // distance from center
                            />
                            </Knob>
                        </div>
                    </div>
                </div>
                {/* Keys */}
                <div className="w-full">
                    <PianoCanvas onPlay={playSynth} onStop={stopSynth} />
                </div>
            </div>
        </div>
    );
}