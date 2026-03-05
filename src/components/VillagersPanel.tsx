import { dimensions } from '../assets/consts';

interface VillagersPanelProps {
    ownedVillagers: Record<string, number>;
    hireVillager: (dimId: string) => void;
    mineCoins: number;
}

export default function VillagersPanel({
    ownedVillagers,
    hireVillager,
    mineCoins,
}: VillagersPanelProps) {
    return (
        <div className="p-6 h-full flex flex-col bg-stone-900 text-stone-200">
            <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <span className="text-4xl text-amber-500">🏠</span>
                Aldeões
            </h2>

            <p className="text-sm text-stone-400 font-bold mb-6">
                Contrate aldeões para trabalhar passivamente em missões nas dimensões.
                Eles coletarão os blocos de cada dimensão ao longo do tempo.
            </p>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
                {Object.entries(dimensions).map(([dimId, dimData]) => {
                    const count = ownedVillagers[dimId] || 0;
                    const baseCost = 500; // Custo base em MC
                    const cost = baseCost * Math.pow(1.5, count); // Fator de escala

                    return (
                        <div key={dimId} className="bg-stone-950 p-4 rounded-xl border border-stone-800 shadow-md relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay transition-transform group-hover:scale-110" style={{ backgroundImage: `url('${dimData.background}')` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 to-transparent" />

                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h3 className="font-black text-xl text-amber-400 capitalize">{dimData.name}</h3>
                                    <p className="text-sm text-stone-400 mt-1 font-bold">
                                        Trabalhadores Ativos: <span className="text-white">{count}</span>
                                    </p>
                                    <p className="text-xs text-stone-500 mt-0.5">
                                        Efeitos: Coletam os blocos comuns desta dimensão.
                                    </p>
                                </div>

                                <button
                                    onClick={() => hireVillager(dimId)}
                                    disabled={mineCoins < cost}
                                    className={`whitespace-nowrap font-bold py-2 px-6 rounded-xl shadow-lg transition-transform active:scale-95 ${mineCoins >= cost ? 'bg-amber-500 hover:bg-amber-600 text-stone-900' : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'}`}
                                >
                                    Contratar
                                    <span className="block text-[10px] uppercase opacity-80">
                                        {Math.floor(cost)} MC
                                    </span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
