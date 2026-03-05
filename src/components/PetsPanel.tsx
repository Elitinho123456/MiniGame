import { useState } from 'react';
import { availablePets } from '../assets/consts';

interface PetsPanelProps {
    ownedPets: Record<string, number>;
    equippedPet: string | null;
    setEquippedPet: (petId: string | null) => void;
}

export default function PetsPanel({
    ownedPets,
    equippedPet,
    setEquippedPet,
}: PetsPanelProps) {
    const [isPetsOpen, setIsPetsOpen] = useState<boolean>(false);

    return (
        <div className="border-b border-stone-300 dark:border-stone-800">
            <button
                onClick={() => setIsPetsOpen(!isPetsOpen)}
                className="w-full flex justify-between items-center p-5 bg-stone-100 dark:bg-stone-950 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors"
            >
                <span className="flex items-center gap-3 text-lg font-bold text-stone-800 dark:text-stone-200">
                    <span className="w-8 h-8 flex items-center justify-center text-xl bg-stone-200 dark:bg-stone-800 rounded">
                        🐾
                    </span>
                    Meus Pets
                </span>
                <img
                    src="/Down_Arrow.png"
                    alt="arrow"
                    className={`w-4 h-4 transition-transform duration-300 ${isPetsOpen ? 'rotate-0' : 'rotate-90 md:-rotate-90'}`}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            </button>

            {isPetsOpen && (
                <div className="p-4 bg-stone-50 dark:bg-stone-900/50 space-y-3">
                    {Object.keys(ownedPets).length === 0 ? (
                        <div className="text-center p-4 text-stone-500 text-sm font-bold bg-white dark:bg-stone-800 rounded-xl border border-dashed border-stone-300 dark:border-stone-700">
                            Nenhum Pet encontrado ainda.
                            <br /> Continue minerando!
                        </div>
                    ) : (
                        Object.entries(ownedPets).map(([petId, level]) => {
                            const petInfo = availablePets.find((p) => p.id === petId);
                            if (!petInfo) return null;
                            const isEquipped = equippedPet === petId;

                            return (
                                <div
                                    key={petId}
                                    className={`w-full text-left bg-white dark:bg-stone-800 border p-3 rounded-xl transition-colors shadow-sm ${isEquipped ? 'border-amber-500' : 'border-stone-200 dark:border-stone-700'}`}
                                >
                                    <div className="flex gap-3 items-center">
                                        <div className="w-12 h-12 bg-stone-100 dark:bg-stone-900 rounded-lg flex items-center justify-center text-3xl border border-stone-200 flex-shrink-0 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 bg-stone-800 text-white text-[9px] px-1 font-bold rounded-bl">
                                                {petInfo.category.charAt(0)}
                                            </div>
                                            {petInfo.icon}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-stone-800 dark:text-stone-200 truncate pr-2">
                                                    {petInfo.name}{' '}
                                                    <span className="text-amber-600">Lv.{level}</span>
                                                </h4>
                                            </div>
                                            <p className="text-[10px] text-stone-500 font-bold uppercase">
                                                {petInfo.category} - {petInfo.baseBonusStr}
                                            </p>
                                            <button
                                                onClick={() => setEquippedPet(isEquipped ? null : petId)}
                                                className={`mt-2 text-xs font-bold px-3 py-1 rounded transition-colors ${isEquipped ? 'bg-amber-100 text-amber-800 cursor-pointer' : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-600'}`}
                                            >
                                                {isEquipped ? 'Desequipar' : 'Equipar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
