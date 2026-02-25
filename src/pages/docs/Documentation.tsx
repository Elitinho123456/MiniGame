import { useState } from "react";
import { Link } from "react-router";

export default function Documentation() {
    // Estados para controlar a expansão dos menus laterais
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
        basico: true,
        mecanicas: false
    });

    const toggleMenu = (menu: string) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header da Documentação */}
            <header className="bg-stone-900 text-stone-100 p-4 border-b border-stone-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        📖 Craft & Mine <span className="text-stone-400 font-normal">| Docs</span>
                    </h1>
                    <Link to="/" className="btn-secondary text-sm bg-stone-800! text-stone-200! hover:bg-stone-700!">
                        Voltar ao Jogo
                    </Link>
                </div>
            </header>

            {/* Grid Principal */}
            <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 p-4 md:p-8">
                
                {/* Sidebar (Menu de Navegação) */}
                <aside className="md:col-span-1 flex flex-col space-y-4 border-r-0 md:border-r border-stone-200 dark:border-stone-800 pr-4">
                    
                    {/* Categoria 1 */}
                    <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleMenu('basico')}
                            className="w-full text-left px-4 py-3 bg-stone-100 dark:bg-stone-900 font-semibold text-stone-800 dark:text-stone-200 flex justify-between items-center hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                        >
                            O Básico
                            <span className="text-xs text-stone-500">{openMenus['basico'] ? '▼' : '▶'}</span>
                        </button>
                        {openMenus['basico'] && (
                            <ul className="px-4 py-2 bg-white dark:bg-stone-950 space-y-2 text-sm text-stone-600 dark:text-stone-400">
                                <li><a href="#intro" className="hover:text-amber-600 dark:hover:text-amber-400 block py-1">Introdução</a></li>
                                <li><a href="#interface" className="hover:text-amber-600 dark:hover:text-amber-400 block py-1">Interface do Jogo</a></li>
                                <li><a href="#primeiros-passos" className="hover:text-amber-600 dark:hover:text-amber-400 block py-1">Primeiros Passos</a></li>
                            </ul>
                        )}
                    </div>

                    {/* Categoria 2 */}
                    <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleMenu('mecanicas')}
                            className="w-full text-left px-4 py-3 bg-stone-100 dark:bg-stone-900 font-semibold text-stone-800 dark:text-stone-200 flex justify-between items-center hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                        >
                            Mecânicas
                            <span className="text-xs text-stone-500">{openMenus['mecanicas'] ? '▼' : '▶'}</span>
                        </button>
                        {openMenus['mecanicas'] && (
                            <ul className="px-4 py-2 bg-white dark:bg-stone-950 space-y-2 text-sm text-stone-600 dark:text-stone-400">
                                <li><a href="#ferramentas" className="hover:text-amber-600 dark:hover:text-amber-400 block py-1">Upgrades de Ferramenta</a></li>
                                <li><a href="#recursos" className="hover:text-amber-600 dark:hover:text-amber-400 block py-1">Tipos de Minérios</a></li>
                                <li><a href="#rebirth" className="hover:text-amber-600 dark:hover:text-amber-400 block py-1">Sistema de Rebirth</a></li>
                            </ul>
                        )}
                    </div>
                </aside>

                {/* Conteúdo Central */}
                <main className="md:col-span-3 lg:col-span-4 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 p-6 md:p-10 text-stone-700 dark:text-stone-300">
                    <article className="prose dark:prose-invert max-w-none">
                        <h1 id="intro" className="text-3xl md:text-4xl font-extrabold text-amber-800 dark:text-amber-500 mb-6">
                            Introdução ao Craft & Mine
                        </h1>
                        <p className="text-lg leading-relaxed mb-6">
                            Bem-vindo à documentação oficial do Craft & Mine. Aqui você encontrará tudo o que precisa para entender as mecânicas, desde a coleta do seu primeiro bloco de terra até a automatização avançada da sua mina espacial.
                        </p>
                        
                        <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-10 mb-4 border-b border-stone-200 dark:border-stone-800 pb-2">
                            A Regra de Ouro
                        </h2>
                        <p className="mb-4">
                            O objetivo principal é simples: <strong>clique para minerar</strong>. A cada clique, você acumula recursos que podem ser trocados por melhorias. 
                        </p>

                        <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg my-8">
                            <p className="font-medium text-amber-900 dark:text-amber-200 m-0">
                                💡 Dica: Invista em upgrades automáticos (Auto-Miners) o mais cedo possível para gerar recursos mesmo enquanto você estiver lendo esta documentação!
                            </p>
                        </div>

                        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-8 mb-4">
                            O que é o Rebirth?
                        </h3>
                        <p>
                            Após alcançar $1.000.000 em recursos, você desbloqueará o botão de Rebirth. Fazer um Rebirth reinicia o seu progresso básico, mas concede a você "Gemas de Prestígio", que multiplicam permanentemente todos os seus ganhos futuros.
                        </p>
                    </article>
                </main>
            </div>
        </div>
    );
};