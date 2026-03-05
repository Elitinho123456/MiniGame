interface SettingsPanelProps {
    videoQuality: 'Baixa' | 'Média' | 'Alta';
    setVideoQuality: (q: 'Baixa' | 'Média' | 'Alta') => void;
}

export default function SettingsPanel({ videoQuality, setVideoQuality }: SettingsPanelProps) {
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
                <section className="bg-stone-950 p-6 rounded-2xl border border-stone-800 shadow-lg opacity-50 cursor-not-allowed">
                    <h3 className="text-xl font-bold text-emerald-500 mb-4 border-b border-stone-800 pb-2">Áudio</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-stone-400 font-bold">Volume Principal</span>
                            <span className="text-xs bg-stone-800 px-2 py-1 rounded text-stone-500">Em breve</span>
                        </div>
                    </div>
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
