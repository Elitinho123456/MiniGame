import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Pickaxe, Store, PawPrint, Users, Settings, FileText, LogOut, User } from 'lucide-react';

export type ActiveTab = 'mining' | 'shop' | 'pets' | 'villagers' | 'settings';

interface SidebarProps {
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const [isExpanded, setIsExpanded] = useState(true);
    const navigate = useNavigate();

    const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
        { id: 'mining', label: 'Mineração', icon: <Pickaxe size={20} /> },
        { id: 'shop', label: 'Loja', icon: <Store size={20} /> },
        { id: 'pets', label: 'Pets', icon: <PawPrint size={20} /> },
        { id: 'villagers', label: 'Aldeões', icon: <Users size={20} /> },
        { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
    ];

    return (
        <div
            className={`bg-[#1a1a1a] border-r border-stone-800 transition-all duration-300 flex flex-col ${isExpanded ? 'w-64' : 'w-20'}`}
        >
            <div className="p-4 flex items-center justify-between">
                {isExpanded && <h1 className="font-black text-xl text-emerald-500 tracking-wider">M-CRAFT</h1>}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-stone-800 rounded-lg transition-colors text-stone-400 hover:text-white"
                >
                    {isExpanded ? '◀' : '▶'}
                </button>
            </div>

            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium ${activeTab === tab.id
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'text-stone-300 hover:bg-white/5 hover:text-white'
                            }`}
                        title={!isExpanded ? tab.label : ''}
                    >
                        <span className="flex-shrink-0">{tab.icon}</span>
                        {isExpanded && (
                            <span className="whitespace-nowrap">{tab.label}</span>
                        )}
                    </button>
                ))}

                <div className="my-4 border-t border-stone-800/50 pt-4 space-y-1">
                    <button
                        onClick={() => navigate('/documentation')}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium text-stone-300 hover:bg-white/5 hover:text-white"
                        title={!isExpanded ? 'Documentação' : ''}
                    >
                        <FileText size={20} className="flex-shrink-0" />
                        {isExpanded && <span className="whitespace-nowrap">Documentação</span>}
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium text-stone-300 hover:bg-white/5 hover:text-white"
                        title={!isExpanded ? 'Início/Sair' : ''}
                    >
                        <LogOut size={20} className="flex-shrink-0" />
                        {isExpanded && <span className="whitespace-nowrap">Sair</span>}
                    </button>
                </div>
            </nav>

            <div className="p-4 border-t border-stone-800/50 mt-auto flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                    <User size={16} />
                </div>
                {isExpanded && (
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-stone-200 truncate">Jogador</span>
                        <span className="text-xs text-stone-500 truncate">Sessão ativa</span>
                    </div>
                )}
            </div>
        </div>
    );
}
