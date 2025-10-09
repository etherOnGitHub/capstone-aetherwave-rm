import { useState, useRef, useEffect } from "react";

type KnobProps = {
    size?: number;
    min?: number;
    max?: number;
    value: number;
    onChange: (val: number) => void;
    steps?: number;
    angleOffset?: number;
    angleRange?: number;
};

export default function Knob({
    size = 80,
    min = 0,
    max = 100,
    value,
    onChange,
    steps = 1000,
}: KnobProps) {
    const [dragging, setDragging] = useState(false);
    const startY = useRef(0);
    const startVal = useRef(value);

    // Start drag
    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        setDragging(true);
        startY.current = e.clientY;
        startVal.current = value;
        // capture all pointer movement even if finger leaves knob area
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    useEffect(() => {
        if (!dragging) return;

        const handleMove = (e: PointerEvent) => {
            const delta = startY.current - e.clientY;
            const range = max - min;
            let newValue = startVal.current + (delta / 150) * range;
            newValue = Math.min(Math.max(newValue, min), max);

            const stepSize = range / steps;
            newValue = Math.round(newValue / stepSize) * stepSize;
            onChange(parseFloat(newValue.toFixed(3)));
        };

        const stop = () => setDragging(false);

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", stop);

        return () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", stop);
        };
    }, [dragging, min, max, steps, onChange]);

    // Geometry
    const radius = size / 2 - 6;
    const angleRange = 270;
    const startAngle = -135;
    const norm = (value - min) / (max - min);
    const angle = startAngle + norm * angleRange;

    const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
        const rad = ((angleDeg - 90) * Math.PI) / 180;
        return {
            x: cx + r * Math.cos(rad),
            y: cy + r * Math.sin(rad),
        };
    };

    const describeArc = (start: number, end: number) => {
        const startCoord = polarToCartesian(size / 2, size / 2, radius, end);
        const endCoord = polarToCartesian(size / 2, size / 2, radius, start);
        const largeArcFlag = end - start <= 180 ? 0 : 1;
        return `
      M ${startCoord.x} ${startCoord.y}
      A ${radius} ${radius} 0 ${largeArcFlag} 0 ${endCoord.x} ${endCoord.y}
    `;
    };

    const fullArcPath = describeArc(startAngle, startAngle + angleRange);
    const activeArcPath = describeArc(startAngle, angle);
    const pointerPos = polarToCartesian(size / 2, size / 2, radius * 0.7, angle);

    return (
        <svg
            width={size}
            height={size}
            onPointerDown={handlePointerDown}
            style={{ cursor: "ns-resize", touchAction: "none", userSelect: "none" }}
        >
            <path d={fullArcPath} stroke="#7f967f" strokeWidth={8} fill="none" />
            <path d={activeArcPath} stroke="#fff" strokeWidth={8} fill="none" />
            <line
                x1={size / 2}
                y1={size / 2}
                x2={pointerPos.x}
                y2={pointerPos.y}
                stroke="#fff"
                strokeWidth={2}
            />
        </svg>
    );
}
