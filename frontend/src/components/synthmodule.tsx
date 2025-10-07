import { useEffect, useRef, useCallback, useState } from "react";
import * as Tone from "tone";
import PianoCanvas from "./keys";
import { Knob, Pointer, Arc } from "rc-knob";
import ConfirmModal  from "./confirm";


// import { DEFAULTS } from ../constants/constants;
type Preset = {
    id: number;
    name: string;
    volume: number;
    attack: number;
    decay: number;
    sustain: number;
    release: number;
    waveType: string;
    created_at: string;
};
//create a simple synth module using Tone.js and React
export default function SynthModule() {

    // declare settings
    const [presetId, setPresetId] = useState<number | null>(null);
    const [presetName, setPresetName] = useState("");
    const [volume, setVolume] = useState(-12);
    const [attack, setAttack] = useState(0.02);
    const [decay, setDecay] = useState(0.3);
    const [sustain, setSustain] = useState(0.8);
    const [release, setRelease] = useState(1.2);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
    const [updateStatus, setUpdateStatus] = useState<"idle" | "updating" | "success" | "error">("idle");
    const [deleteStatus, setDeleteStatus] = useState<"idle" | "deleting" | "success" | "error">("idle");
    const [loadStatus, setLoadStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [, setUsername] = useState<string | null>(null);
    const [presets, setPresets] = useState<Preset[]>([]);
    const [isLoadingPresets, setIsLoadingPresets] = useState(false);
    

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

    function getCSRFToken() {
        const match = document.cookie.match(/csrftoken=([^;]+)/);
        return match ? match[1] : "";
    }

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch("/api/auth-status/", { credentials: "include" });
                const data = await res.json();
                setIsAuthenticated(data.authenticated)
                setUsername(data.username);
            } catch (err) {
                console.error("Auth check failed:", err);
                setIsAuthenticated(false);
            }
        }

        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPresets();
        }
    }, [isAuthenticated]);

    async function fetchPresets() {
        setLoadStatus("loading");
        setIsLoadingPresets(true);
        try {
            const res = await fetch("/api/presets/", { credentials: "include" });
            if (!res.ok) throw new Error(`Failed to fetch presets (${res.status})`);
            const data: Preset[] = await res.json();
            setPresets(data);
            setLoadStatus("success");
        } catch (err) {
            console.error("Failed to load presets:", err);
            setLoadStatus("error");
        } finally {
            setIsLoadingPresets(false);
            setLoadStatus("idle");
        }
    }

    function loadPreset(p: Preset) {
        setPresetId(p.id);
        setPresetName(p.name);
        setVolume(p.volume);
        setAttack(p.attack);
        setDecay(p.decay);
        setSustain(p.sustain);
        setRelease(p.release);

        const match = oscWaveType.find(o => o.type === p.waveType);
        if (match) setOscType(match);
    }

    useEffect(() => {
        async function loadOrCreatePreset() {
            try {
                const res = await fetch("/api/presets/", { credentials: "include" });
                const data: Preset[] = await res.json();

                if (data.length > 0) {
                    const preset = data[0];
                    setPresetId(preset.id);
                    setPresetName(preset.name);
                    setVolume(preset.volume);
                    setAttack(preset.attack);
                    setDecay(preset.decay);
                    setSustain(preset.sustain);
                    setRelease(preset.release);

                    const match = oscWaveType.find(o => o.type === preset.waveType);
                    if (match) setOscType(match);
                }

                if (data.length === 0) {
                    await fetch("/api/presets/", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRFToken": getCSRFToken(),
                        },
                        body: JSON.stringify({
                            name: "Default Preset",
                            volume: -12,
                            attack: 0.02,
                            decay: 0.3,
                            sustain: 0.8,
                            release: 1.2,
                            waveType: "sawtooth",
                        }),
                    });

                    
                }
            } catch (err) {
                console.error("Failed to load presets:", err);
            }
        }
        loadOrCreatePreset();
    }, []);

    // save preset

    async function confirmAndSave() {
        setIsConfirmOpen(false); // close the modal
        await savePreset(); // run the actual function
    }

    useEffect(() => {
        if (saveStatus === "success" || saveStatus === "error") {
            const t = setTimeout(() => setSaveStatus("idle"), 3000);
            return () => clearTimeout(t);
        }
    }, [saveStatus]);

    async function savePreset() {
        setSaveStatus("saving");
        const presetData = {
            name: presetName.trim() || "Untitled Preset",
            volume,
            attack,
            decay,
            sustain,
            release,
            waveType: oscType.type,
        };

        try {
            const res = await fetch("/api/presets/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                },
                body: JSON.stringify(presetData),
            });

            if (!res.ok) throw new Error(`Failed to save preset (${res.status})`);

            const saved = await res.json();
            setSaveStatus("success");
            console.log("Preset saved:", saved);
        } catch (err) {
            setSaveStatus("error");
            console.error("Save failed:", err);
        }
    }

    async function updatePreset() {
        if (!presetId) return console.error("No preset to update!");
        setUpdateStatus("updating");

        try {
            const res = await fetch(`/api/presets/${presetId}/`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCSRFToken(),
                },
                body: JSON.stringify({
                    name: presetName || "Untitled Preset",
                    volume,
                    attack,
                    decay,
                    sustain,
                    release,
                    waveType: oscType.type,
                }),
            });

            if (!res.ok) throw new Error(`Failed to update preset (${res.status})`);
            console.log("Preset updated!");
            setUpdateStatus("success");
        } catch (err) {
            console.error("Update failed:", err);
            setUpdateStatus("error");
        }
    }

    async function deletePreset() {
        if (!presetId) return console.error("No preset to delete!");
        setDeleteStatus("deleting");

        try {
            const res = await fetch(`/api/presets/${presetId}/`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error(`Failed to delete preset (${res.status})`);
            console.log("Preset deleted!");
            setDeleteStatus("success");

            // Reset local state so the UI doesn't show stale data
            setPresetId(null);
            setPresetName("");
            setVolume(-12);
            setAttack(0.02);
            setDecay(0.3);
            setSustain(0.8);
            setRelease(1.2);
            setOscType(oscWaveType[3]);

        } catch (err) {
            console.error("Delete failed:", err);
            setDeleteStatus("error");
        }
    }


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
                {/* Preset CRUD */}
                <div className="font-exo mt-2 mb-4 ml-2 flex justify-center align-middle">
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={fetchPresets}
                                className="ml-2 border-white bg-transparent px-4 py-2 text-white transition hover:bg-white hover:text-black"
                            >
                                {isLoadingPresets ? "Loading..." : "Load Preset"}
                            </button>
                            {!isLoadingPresets && presets.length === 0 && (
                                <p className="text-brandSage mt-2 text-sm italic">
                                    No presets found. Save one to see it here.
                                </p>
                            )}
                            {/* Show dropdown if presets exist */}
                            {presets.length > 0 && (
                                <select
                                    onChange={(e) => {
                                        const selected = presets.find(p => p.id === parseInt(e.target.value));
                                        if (selected) loadPreset(selected);
                                    }}
                                    className="ml-2 bg-transparent text-white border border-white p-2"
                                >
                                    <option value="" disabled selected>-- Select a preset --</option>
                                    {presets.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                            <input
                                type="text"
                                placeholder="Enter preset name"
                                value={presetName}
                                onChange={(e) => setPresetName(e.target.value)}
                                className="m-2 border border-white bg-transparent p-2 text-white placeholder-[#7f967f] focus:outline-none"
                            />
                            <button
                                onClick={() => setIsConfirmOpen(true)}
                                className="bg-transparent px-4 py-2 text-white transition hover:bg-brandWhite hover:text-black"
                            >
                                Save Preset
                            </button>
                            <button
                                onClick={updatePreset}
                                disabled={!presetId}
                                className={`ml-2 bg-transparent px-4 py-2 text-white transition hover:bg-brandWhite hover:text-black ${presetId ? 'hover:bg-brandWhite hover:text-black' : 'opacity-50 cursor-not-allowed disabled:transform-none disabled:hover:bg-transparent disabled:hover:text-white disabled:transition-none hover:none'}`}>
                                Update Preset
                            </button>
                            <button
                                onClick={() => setIsConfirmDeleteOpen(true)}
                                disabled={!presetId}
                                className={`ml-2 px-4 py-2 border text-white transition 
                                        ${presetId
                                        ? "border-red-500 hover:bg-red-600 hover:text-white hover:translate-y-[-2px]"
                                    : "border-gray-500 bg-gray-700 text-gray-400 opacity-50 cursor-not-allowed transform-none"
                                        }`}
                            >
                                Delete Preset
                            </button>
                        </>
                    ) : (
                            <p className="font-exo text-white-400 text-center"><a href="/accounts/login" className="text-white underline">Log in</a> to save your presets!</p>
                    )}
                </div>
                {/* Status Messages */}
                <div className="mr-2 ml-2 flex items-center justify-center border-2 border-white p-2 text-center align-middle">
                    Currently loaded preset: <span className="font-exo m-2 font-bold"> {presetName || "No preset loaded"}</span>
                    <div className="m-2">
                        {saveStatus === "saving" && <p className="font-exo text-center text-yellow-400"><b>System Message:</b> Saving preset...</p>}
                        {saveStatus === "success" && <p className="font-exo text-center text-green-400"><b>System Message:</b> Preset saved!</p>}
                        {saveStatus === "error" && <p className="font-exo text-center text-red-400"><b>System Message:</b> Failed to save preset.</p>}
                        {updateStatus === "updating" && <p className="font-exo text-center text-yellow-400"><b>System Message:</b> Updating preset...</p>}
                        {updateStatus === "success" && <p className="font-exo text-center text-green-400"><b>System Message:</b> Preset updated!</p>}
                        {updateStatus === "error" && <p className="font-exo text-center text-red-400"><b>System Message:</b> Failed to update preset.</p>}
                        {deleteStatus === "deleting" && <p className="font-exo text-center text-yellow-400"><b>System Message:</b> Deleting preset...</p>}
                        {deleteStatus === "success" && <p className="font-exo text-center text-green-400"><b>System Message:</b> Preset deleted!</p>}
                        {deleteStatus === "error" && <p className="font-exo text-center text-red-400"><b>System Message:</b> Failed to delete preset.</p>}
                        {loadStatus === "loading" && <p className="font-exo text-center text-yellow-400"><b>System Message:</b> Loading preset...</p>}
                        {loadStatus === "success" && <p className="font-exo text-center text-green-400"><b>System Message:</b> Preset loaded!</p>}
                        {loadStatus === "error" && <p className="font-exo text-center text-red-400"><b>System Message:</b> Failed to load preset.</p>}
                    </div>
                </div>
                <ConfirmModal
                    isOpen={isConfirmOpen}
                    title="Save Preset?"
                    message={`Are you sure you want to save "${presetName || "Untitled Preset"}"?`}
                    onConfirm={confirmAndSave}
                    onCancel={() => setIsConfirmOpen(false)}
                />
                <ConfirmModal
                    isOpen={isConfirmDeleteOpen}
                    title="Delete Preset?"
                    message={`Are you sure you want to permanently delete "${presetName || "this preset"}"?`}
                    confirmLabel="Delete"
                    confirmColor="bg-red-600"
                    onConfirm={() => {
                        setIsConfirmDeleteOpen(false);
                        deletePreset();
                    }}
                    onCancel={() => setIsConfirmDeleteOpen(false)}
                />
            </div>
        </div>
    );
}