import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DimensionData {
    name: string;
    background: string;
    blocks: { name: string; weight: number }[];
}

interface DimensionSelectorProps {
    currentDim: string;
    dimensions: Record<string, DimensionData>;
    onChange: (dimKey: string) => void;
    disabled?: boolean;
}

export default function DimensionSelector({
    currentDim,
    dimensions,
    onChange,
    disabled = false,
}: DimensionSelectorProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const dimKeys = Object.keys(dimensions);
    const currentName = dimensions[currentDim]?.name ?? currentDim;

    return (
        <div className="mb-12 relative" ref={ref}>
            {/* Trigger */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen((v) => !v)}
                className={`
          group flex items-center gap-3
          px-7 py-3.5
          bg-stone-950/70 border-2 border-stone-500/40
          backdrop-blur-xl rounded-2xl
          shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]
          text-xl md:text-2xl font-black text-stone-100 tracking-wider uppercase
          cursor-pointer outline-none
          transition-all duration-200
          hover:border-stone-400/60 hover:bg-stone-900/80 hover:shadow-[0_6px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]
          active:scale-[0.97]
          disabled:opacity-40 disabled:pointer-events-none
          ${open ? 'border-stone-400/70 bg-stone-900/90' : ''}
        `}
            >
                <span className="select-none">{currentName}</span>
                <ChevronDown
                    className={`w-5 h-5 text-stone-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    className={`
            absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50
            min-w-[280px]
            bg-stone-950/90 border-2 border-stone-600/50
            backdrop-blur-2xl rounded-xl
            shadow-[0_12px_48px_rgba(0,0,0,0.7)]
            overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-200
          `}
                >
                    {dimKeys.map((dimKey, i) => {
                        const isActive = dimKey === currentDim;
                        return (
                            <button
                                key={dimKey}
                                type="button"
                                onClick={() => {
                                    onChange(dimKey);
                                    setOpen(false);
                                }}
                                className={`
                  w-full flex items-center gap-3 px-5 py-3.5
                  text-left text-lg font-bold tracking-wide
                  transition-all duration-150
                  ${isActive
                                        ? 'bg-stone-700/50 text-stone-50'
                                        : 'text-stone-300 hover:bg-stone-800/60 hover:text-stone-100'
                                    }
                  ${i < dimKeys.length - 1 ? 'border-b border-stone-700/30' : ''}
                  active:scale-[0.98]
                `}
                            >
                                <span className="text-2xl leading-none">
                                    {dimensions[dimKey].name.split(' ')[0]}
                                </span>
                                <span>{dimensions[dimKey].name.split(' ').slice(1).join(' ')}</span>
                                {isActive && (
                                    <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}