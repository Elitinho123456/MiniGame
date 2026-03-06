import { useState } from 'react';
import { itemPrices } from '../assets/consts';

interface ShopPanelProps {
    inventory: Record<string, number>;
    setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    mineCoins: number;
    setMineCoins: React.Dispatch<React.SetStateAction<number>>;
    onBuyPotion: (potionId: string, cost: number) => void;
}

export default function ShopPanel({
    inventory,
    setInventory,
    mineCoins,
    setMineCoins,
    onBuyPotion,
}: ShopPanelProps) {
    const [isShopOpen, setIsShopOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'vender' | 'comprar'>('vender');
    const [sellAmount, setSellAmount] = useState<Record<string, number>>({});

    const potions = [
        { id: 'pot_speed', name: 'Poção de Rapidez', effect: '+50% Velocidade de Mineração (10 min)', cost: 50, icon: '🧪' },
        { id: 'pot_loot', name: 'Poção de Fortuna', effect: 'Loot em Dobro (10 min)', cost: 100, icon: '🏺' },
    ];

    const handleSell = (itemName: string, amount: number) => {
        const amountToSell = amount || 1;
        const currentAmount = inventory[itemName] || 0;

        if (amountToSell <= 0 || currentAmount < amountToSell) return;

        const price = itemPrices[itemName] || 0;
        if (price === 0) return; // not sellable

        setInventory(prev => ({
            ...prev,
            [itemName]: prev[itemName] - amountToSell
        }));
        setMineCoins(prev => prev + (price * amountToSell));

        // Reset sell amount to 1 to avoid sticking to a number higher than inventory later
        setSellAmount(prev => ({ ...prev, [itemName]: 1 }));
    };

    const hasSellableItems = Object.keys(itemPrices).some(key => inventory[key] > 0);

    return (
        <div className="border-b border-stone-300 dark:border-stone-800">
            <button
                onClick={() => setIsShopOpen(!isShopOpen)}
                className="w-full flex justify-between items-center p-5 bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                        <img
                            src="/Emerald.webp"
                            alt="Shop"
                            className="w-8 h-8 drop-shadow-sm"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        Loja
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-sm border border-emerald-500/20">
                        {mineCoins} Mine Coins
                    </span>
                    <img
                        src="/Down_Arrow.png"
                        alt="arrow"
                        className={`w-4 h-4 transition-transform duration-300 ${isShopOpen ? 'rotate-0' : 'rotate-90 md:-rotate-90'}`}
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                </div>
            </button>

            {isShopOpen && (
                <div className="bg-stone-50 dark:bg-stone-900/50 flex flex-col">
                    <div className="flex border-b border-stone-200 dark:border-stone-800">
                        <button
                            onClick={() => setActiveTab('vender')}
                            className={`flex-1 py-3 font-bold text-sm ${activeTab === 'vender' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-stone-100 dark:bg-stone-800' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
                        >
                            Vender Itens
                        </button>
                        <button
                            onClick={() => setActiveTab('comprar')}
                            className={`flex-1 py-3 font-bold text-sm ${activeTab === 'comprar' ? 'text-emerald-500 border-b-2 border-emerald-500 bg-stone-100 dark:bg-stone-800' : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'}`}
                        >
                            Comprar Poções
                        </button>
                    </div>

                    <div className="p-4 space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {activeTab === 'vender' && (
                            <>
                                {Object.entries(itemPrices).map(([itemName, price]) => {
                                    const inInventory = inventory[itemName] || 0;
                                    const toSell = sellAmount[itemName] !== undefined ? sellAmount[itemName] : 1;

                                    if (inInventory === 0) return null;

                                    return (
                                        <div key={itemName} className="flex items-center justify-between bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 rounded-xl shadow-sm hover:border-emerald-500/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center p-1.5 border border-stone-200 dark:border-stone-700 shrink-0">
                                                    <img
                                                        src={`/${itemName.replaceAll(' ', '_')}.webp`}
                                                        alt={itemName}
                                                        className="w-full h-full object-contain drop-shadow-sm"
                                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h4 className="font-bold text-stone-800 dark:text-stone-200 text-sm md:text-base">{itemName.replace(/_/g, ' ')}</h4>
                                                    <p className="text-xs text-stone-500 font-bold">
                                                        Qtd: {inInventory} | Valor: <span className="text-emerald-500">{price}</span> MC
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={inInventory}
                                                    value={toSell}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value) || 1;
                                                        setSellAmount(prev => ({ ...prev, [itemName]: Math.min(Math.max(1, val), inInventory) }));
                                                    }}
                                                    className="w-12 md:w-16 px-2 py-1.5 text-sm rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-600 text-stone-800 dark:text-stone-200 text-center outline-none focus:border-emerald-500 transition-colors"
                                                />
                                                <button
                                                    onClick={() => handleSell(itemName, toSell)}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-lg shadow transition-transform active:scale-95 text-sm"
                                                >
                                                    Vender
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const currentAmount = inventory[itemName] || 0;
                                                        if (currentAmount > 0) {
                                                            setTimeout(() => handleSell(itemName, currentAmount), 100);
                                                        }
                                                    }}
                                                    className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30 font-bold py-1.5 px-3 rounded-lg shadow transition-transform active:scale-95 text-sm"
                                                >
                                                    Tudo
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                                {!hasSellableItems && (
                                    <div className="text-center text-stone-500 dark:text-stone-400 p-6 font-bold bg-white dark:bg-stone-800 rounded-xl border border-dashed border-stone-300 dark:border-stone-700">
                                        Você não tem itens para vender.
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'comprar' && (
                            <div className="space-y-3">
                                {potions.map(potion => (
                                    <div key={potion.id} className="flex items-center justify-between bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-3 rounded-xl shadow-sm hover:border-amber-500/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center justify-center text-2xl border border-amber-200 dark:border-amber-900/50 shrink-0">
                                                {potion.icon}
                                            </div>
                                            <div className="flex flex-col">
                                                <h4 className="font-bold text-stone-800 dark:text-stone-200 text-sm md:text-base">{potion.name}</h4>
                                                <p className="text-xs text-amber-600 dark:text-amber-500 font-bold">
                                                    {potion.effect}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => onBuyPotion(potion.id, potion.cost)}
                                            disabled={mineCoins < potion.cost}
                                            className={`font-bold py-1.5 px-4 rounded-lg shadow transition-transform active:scale-95 text-sm ${mineCoins >= potion.cost ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-stone-300 dark:bg-stone-700 text-stone-500 cursor-not-allowed'}`}
                                        >
                                            {potion.cost} MC
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
