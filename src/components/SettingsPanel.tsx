import { useEffect } from "react";

interface SettingsPanelProps {
    videoQuality: 'Baixa' | 'Média' | 'Alta';
    setVideoQuality: (q: 'Baixa' | 'Média' | 'Alta') => void;
    audioVolume: number;
    setAudioVolume: (v: number) => void;
    isMuted: boolean;
    setIsMuted: (v: boolean) => void;
    isDebugMode?: boolean;
    setIsDebugMode?: (v: boolean) => void;
    onCheatAddCoins?: (amount: number) => void;
    onCheatAddResources?: () => void;
    onCheatUnlockPets?: () => void;
    onCheatTriggerEvent?: () => void;
    onCheatUnlockAccessories?: () => void;
}

export default function SettingsPanel({ videoQuality, setVideoQuality, audioVolume, setAudioVolume, isMuted, setIsMuted, isDebugMode, setIsDebugMode, onCheatAddCoins, onCheatAddResources, onCheatUnlockPets, onCheatTriggerEvent, onCheatUnlockAccessories }: SettingsPanelProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
            if (e.key.toLowerCase() === 'd') {
                setIsDebugMode?.(!isDebugMode);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isDebugMode, setIsDebugMode]);

    return (
        <div className="p-6 h-full flex flex-col bg-stone-900 text-stone-200">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-4xl">⚙️</span>
                Configurações
            </h2>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-4">
                {/* VIDEO */}
                <section className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-lg">
                    <h3 className="text-xl font-bold text-emerald-500 mb-4 border-b border-stone-800 pb-2">Vídeo</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-stone-400 mb-2">Qualidade Visual</label>
                            <div className="flex gap-2">
                                {['Baixa', 'Média', 'Alta'].map((q) => (
                                    <button
                                        key={q}
                                        onClick={() => setVideoQuality(q as 'Baixa' | 'Média' | 'Alta')}
                                        className={`flex-1 py-2 rounded-lg font-bold border transition-all ${videoQuality === q
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                            : 'bg-stone-900 border-stone-700 text-stone-400 hover:bg-stone-800'
                                            }`}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-stone-500 mt-2">
                                Baixa desativa animações e partículas para melhorar desempenho.
                            </p>
                        </div>
                    </div>
                </section>

                {/* AUDIO */}
                <section className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-lg">
                    <div className="flex justify-between items-center mb-4 border-b border-stone-800 pb-2">
                        <h3 className="text-xl font-bold text-emerald-500">Áudio</h3>
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className={`px-3 py-1 rounded font-bold text-sm transition-colors cursor-pointer ${isMuted
                                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                }`}
                        >
                            {isMuted ? '🔇 Mutado' : '🔊 Som Ativado'}
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-2 transition-opacity" style={{ opacity: isMuted ? 0.5 : 1 }}>
                            <label className="text-stone-400 font-bold flex justify-between">
                                <span>Volume Principal</span>
                                <span>{Math.round(audioVolume * 100)}%</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={audioVolume}
                                onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                                disabled={isMuted}
                                className={`w-full accent-emerald-500 bg-stone-800 rounded-lg appearance-none h-2 ${isMuted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            />
                        </div>
                    </div>
                </section>

                {/* DEBUG MODE */}
                <section className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-lg mb-8">
                    <div className="flex justify-between items-center mb-4 border-b border-stone-800 pb-2">
                        <h3 className="text-xl font-bold text-emerald-500">Modo Debug</h3>
                        {setIsDebugMode && (
                            <button
                                onClick={() => setIsDebugMode?.(!isDebugMode)}
                                className={`px-3 py-1 rounded font-bold text-sm transition-colors cursor-pointer ${isDebugMode
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                                    : 'bg-stone-500/20 text-stone-400 border border-stone-500/50'
                                    }`}
                            >
                                {isDebugMode ? '🛠️ Ativado' : 'Desativado'}
                            </button>
                        )}
                    </div>
                    {isDebugMode && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-2">
                                <button onClick={() => onCheatAddCoins?.(1000)} className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded">
                                    +1000 MineCoins
                                </button>
                                <button onClick={() => onCheatAddResources?.()} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded">
                                    +1000 Todos os Recursos
                                </button>
                                <button onClick={() => onCheatUnlockPets?.()} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded">
                                    Desbloquear Todos os Pets
                                </button>
                                <button onClick={() => onCheatTriggerEvent?.()} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded">
                                    ⚡ Forçar Evento Aleatório
                                </button>
                                <button onClick={() => onCheatUnlockAccessories?.()} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-2 px-4 rounded">
                                    💍 Desbloquear Todos Acessórios
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                {/* IDIOMA */}
                <section className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-lg opacity-50 cursor-not-allowed">
                    <h3 className="text-xl font-bold text-emerald-500 mb-4 border-b border-stone-800 pb-2">Idioma</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-stone-400 font-bold">Idioma Atual</span>
                            <span className="text-xs bg-stone-800 px-2 py-1 rounded text-stone-500">Em breve</span>
                        </div>
                    </div>
                </section>

                {/* CONTA */}
                <section className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-lg opacity-50 cursor-not-allowed">
                    <h3 className="text-xl font-bold text-emerald-500 mb-4 border-b border-stone-800 pb-2">Conta</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-stone-400 font-bold">Sincronização na Nuvem</span>
                            <span className="text-xs bg-stone-800 px-2 py-1 rounded text-stone-500">Em breve</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
