import { useState } from 'react';

export type ActiveTab = 'mining' | 'shop' | 'pets' | 'villagers' | 'settings';

interface SidebarProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const [isExpanded, setIsExpanded] = useState(true);

    const tabs: { id: ActiveTab; label: string; icon: string }[] = [
        { id: 'mining', label: 'Mineração', icon: '⛏️' },
        { id: 'shop', label: 'Loja', icon: '💰' },
        { id: 'pets', label: 'Pets', icon: '🐾' },
        { id: 'villagers', label: 'Aldeões', icon: '👨‍🌾' },
        { id: 'settings', label: 'Configurações', icon: '⚙️' },
    ];

    return (
        <div
            className={`bg-stone-950 border-r border-stone-800 transition-all duration-300 flex flex-col ${isExpanded ? 'w-64' : 'w-20'
                }`}
        >
            <div className="p-4 flex items-center justify-between border-b border-stone-800">
                {isExpanded && <h1 className="font-black text-xl text-emerald-500 tracking-wider">M-CRAFT</h1>}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-stone-800 rounded-lg transition-colors text-stone-400 hover:text-white"
                >
                    {isExpanded ? '◀' : '▶'}
                </button>
            </div>

            <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${activeTab === tab.id
                                ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                                : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200 border border-transparent'
                            }`}
                        title={!isExpanded ? tab.label : ''}
                    >
                        <span className="text-xl flex-shrink-0">{tab.icon}</span>
                        {isExpanded && (
                            <span className="whitespace-nowrap">{tab.label}</span>
                        )}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-stone-800 text-xs text-stone-600 text-center">
                {isExpanded ? 'v0.0.5' : 'v5'}
            </div>
        </div>
    );
}
