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
    const [attack, setAttack] = useState(0.02);
    const [decay, setDecay] = useState(0.3);
    const [sustain, setSustain] = useState(0.8);
    const [release, setRelease] = useState(1.2);
   

    const oscWaveType = [
        { type: "sine" },
        { type: "triangle" },
        { type: "square" },
        { type: "sawtooth" },
        { type: "pulse" },
        { type: "pwm" },
        { type: "fatsawtooth", count: 7, spread:40 },
        { type: "fatsquare", count: 7, spread:25 },
    ] as const;
    type OscType = typeof oscWaveType[number];
    const [oscType, setOscType] = useState<OscType>(oscWaveType[3]); // default to sawtooth wave
    const currentIndex = oscWaveType.findIndex(o => o.type === oscType.type); // compare index of type property

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

    useEffect(() => {
        if (synthR.current) {
            synthR.current.set({
                envelope: { attack, decay, sustain, release }
            });
        }

    }, [attack, decay, sustain, release]);

    useEffect(() => {
        if (synthR.current) {
            synthR.current.set({
                oscillator: {
                    ...oscType
                }
            });
        }

    }, [oscType]);

    return (
        <div className="w-screen max-w-full overflow-x-hidden">
            <div className="w-full max-w-full">
                {/* Controls */}
                <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
                    { /* Volume */}
                    <div className="flex flex-col items-center justify-start text-center">
                        <span className="font-exo inline-block w-[150px] p-1.5 text-ellipsis whitespace-nowrap">Volume: {volume} dB</span>
                        <Knob
                            size={50}
                            angleOffset={220}      // where the knob arc starts (degrees)
                            angleRange={280}       // total angle the knob can rotate through
                            min={-60}
                            max={0}
                            value={volume}
                            onChange={(v: number) => {  // value as num
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
                        { /* osc type */}
                        <span className="font-exo inline-block w-[150px] p-1.5 text-ellipsis whitespace-nowrap">Wave: {oscType.type}</span>
                        <Knob
                            size={50}
                            angleOffset={220}      // where the knob arc starts (degrees)
                            angleRange={280}       // total angle the knob can rotate through
                            min={0}
                            max={oscWaveType.length - 1} // index of wave types
                            value={currentIndex} // current index of wave type
                            // update wave type from index
                            onChange={(v: number) => {
                                const clamped = Math.round(v); // make sure value is whole
                                setOscType(oscWaveType[clamped]); // set wave type from array
                            }}
                            aria-label="Wave knob"
                            steps={oscWaveType.length - 1} // steps always equal to number of wave types - 1 (0 index)
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
                    { /* ADSR */}
                    { /* atk */ }
                    <div className="flex flex-col items-center justify-start text-center">
                        <span className="font-exo inline-block w-[150px] p-1.5 text-ellipsis whitespace-nowrap">Attack: {attack}s</span>
                        <Knob
                            size={50}
                            angleOffset={220}      // where the knob arc starts (degrees)
                            angleRange={280}       // total angle the knob can rotate through
                            min={0.005}
                            max={2}
                            value={attack}
                            onChange={(v: number) => setAttack(parseFloat(v.toFixed(3)))}
                            aria-label="Attack-Knob"
                            steps={2000}
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
                        { /* dec */}
                        <span className="font-exo inline-block w-[150px] p-1.5 text-ellipsis whitespace-nowrap">Decay: {decay}s</span>
                        <Knob
                            size={50}
                            angleOffset={220}      // where the knob arc starts (degrees)
                            angleRange={280}       // total angle the knob can rotate through
                            min={0.01}
                            max={2}
                            value={decay}
                            onChange={(v: number) => setDecay(parseFloat(v.toFixed(2)))}
                            aria-label="Decay-Knob"
                            steps={200}
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
                        { /* sus */}
                        <span className="font-exo inline-block w-[150px] p-1.5 text-ellipsis whitespace-nowrap">Sustain: {(sustain * 100).toFixed(2)}%</span>
                        <Knob
                            size={50}
                            angleOffset={220}      // where the knob arc starts (degrees)
                            angleRange={280}       // total angle the knob can rotate through
                            min={0}
                            max={100}
                            value={sustain}
                            onChange={(v: number) => setSustain(parseFloat((v / 100).toFixed(4)))}
                            aria-label="Sustain-Knob"
                            steps={1000}
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
                        { /* rel */}
                        <span className="font-exo inline-block w-[150px] p-1.5 text-ellipsis whitespace-nowrap">Release: {release}s</span>
                        <Knob
                            size={50}
                            angleOffset={220}      // where the knob arc starts (degrees)
                            angleRange={280}       // total angle the knob can rotate through
                            min={0.01}
                            max={2}
                            value={release}
                            onChange={(v: number) => setRelease(parseFloat(v.toFixed(2)))}
                            aria-label="Release-Knob"
                            steps={200}
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
                {/* Keys */}
                <div className="mt-2 mb-2 flex justify-center">
                    <PianoCanvas onPlay={playSynth} onStop={stopSynth} />
                </div>
            </div>
        </div>
    );
}