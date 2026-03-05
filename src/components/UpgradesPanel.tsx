import { useState } from 'react';
import { availableUpgrades } from '../assets/consts';

interface UpgradesPanelProps {
    activeUpgrades: string[];
    buyUpgrade: (id: string) => void;
    mineCoins: number;
}

export default function UpgradesPanel({
    activeUpgrades,
    buyUpgrade,
    mineCoins,
}: UpgradesPanelProps) {
    const [isUpgradesOpen, setIsUpgradesOpen] = useState<boolean>(false);

    return (
        <div className="border-b border-stone-300 dark:border-stone-800">
            <button
                onClick={() => setIsUpgradesOpen(!isUpgradesOpen)}
                className="w-full flex justify-between items-center p-5 bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors"
            >
                <span className="flex items-center gap-3 text-lg font-bold text-stone-800 dark:text-stone-200">
                    <img
                        src="/Anvil.webp"
                        alt="Anvil"
                        className="w-8 h-8 rounded drop-shadow-sm"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    Upgrades
                </span>
                <img
                    src="/Down_Arrow.png"
                    alt="arrow"
                    className={`w-4 h-4 transition-transform duration-300 ${isUpgradesOpen ? 'rotate-0' : 'rotate-90 md:-rotate-90'}`}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            </button>

            {isUpgradesOpen && (
                <div className="p-4 bg-stone-50 dark:bg-stone-900/50 space-y-3">
                    {availableUpgrades.map((upgrade) => {
                        const isBought = activeUpgrades.includes(upgrade.id);
                        return (
                            <button
                                key={upgrade.id}
                                onClick={() => buyUpgrade(upgrade.id)}
                                disabled={isBought}
                                className={`w-full text-left bg-white dark:bg-stone-800 border p-3 rounded-xl transition-colors flex gap-3 group shadow-sm ${isBought ? 'opacity-50 cursor-not-allowed border-stone-300 dark:border-stone-700' : 'border-stone-200 dark:border-stone-700 hover:border-amber-500 cursor-pointer'}`}
                            >
                                <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center text-2xl border border-stone-200 group-hover:scale-105 transition-transform shrink-0">
                                    {upgrade.icon}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-stone-800 dark:text-stone-200 truncate pr-2">
                                            {upgrade.name}{' '}
                                            {isBought && (
                                                <span className="text-emerald-500 inline-block text-[10px] ml-1 uppercase">
                                                    (Comprado)
                                                </span>
                                            )}
                                        </h4>
                                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider bg-stone-100 dark:bg-stone-900 px-1.5 py-0.5 rounded shrink-0">
                                            {upgrade.category}
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-500 mt-0.5 leading-tight">
                                        {upgrade.description}
                                    </p>
                                    {!isBought && (
                                        <div className="mt-2 text-xs text-stone-500">
                                            Custo:{' '}
                                            {upgrade.mineCoinCost && (
                                                <span className={`ml-1 inline-block px-1.5 py-0.5 rounded font-bold ${mineCoins >= upgrade.mineCoinCost ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-500' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-500'}`}>
                                                    {upgrade.mineCoinCost} MC
                                                </span>
                                            )}
                                            {Object.entries(upgrade.cost).map(([res, amount]) => (
                                                <span
                                                    key={res}
                                                    className="ml-1 inline-block bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded text-amber-800 dark:text-amber-500 font-bold"
                                                >
                                                    {amount as number} {res}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
