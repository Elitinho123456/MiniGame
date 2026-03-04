import { Link } from 'react-router';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-stone-100/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-amber-800 dark:text-amber-500 tracking-tight">
            Craft
            <span className="text-emerald-700 dark:text-emerald-500">&</span>
            Mine
          </h1>
          <Link to="/documentation" className="btn-secondary text-sm">
            Documentação
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-4 md:p-8">
        {/* Hero Section */}
        <section className="max-w-3xl w-full flex flex-col items-center text-center mt-12 mb-20 space-y-6">
          <div className="w-32 h-32 bg-stone-300 dark:bg-stone-800 rounded-2xl mb-4 flex items-center justify-center shadow-inner">
            {/* Placeholder para o Logo do Jogo */}
            <span className="text-4xl text-stone-500 dark:text-stone-600">
              ⛏️
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-stone-900 dark:text-white">
            Minere, Crie e{' '}
            <span className="text-amber-700 dark:text-amber-500">Evolua</span>
          </h2>

          <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
            Craft & Mine é um clicker relaxante onde você coleta recursos da
            terra, melhora suas ferramentas e expande seu império de mineração.
          </p>

          <Link
            to="/game"
            title="Iniciar o jogo"
            onClick={() => alert('Iniciando a mineração!')}
            className="btn-primary mt-4 text-lg"
          >
            Iniciar o Jogo
          </Link>
        </section>

        <div className="h-1 bg-stone-200 dark:bg-stone-800 w-full rounded-2xl mb-22" />

        {/* Features Grid */}
        <section className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800">
            <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-500 mb-2">
              Recursos
            </h3>
            <p className="text-stone-600 dark:text-stone-400">
              Descubra uma variedade de materiais preciosos escondidos
              profundamente na terra.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800">
            <h3 className="text-xl font-bold text-amber-700 dark:text-amber-500 mb-2">
              Ferramentas
            </h3>
            <p className="text-stone-600 dark:text-stone-400">
              Construa picaretas, brocas e escavadeiras automáticas para
              otimizar sua extração.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800">
            <h3 className="text-xl font-bold text-red-800 dark:text-red-400 mb-2">
              Upgrads
            </h3>
            <p className="text-stone-600 dark:text-stone-400">
              Melhore suas ferramentas e recursos com upgrades progressivos.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800">
            <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
              Rebirth!
            </h3>
            <p className="text-stone-600 dark:text-stone-400">
              Alcance o ápice, reinicie com multiplicadores de prestígio e
              quebre novos recordes.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
          <p>© 2026 Craft & Mine. Todos os direitos reservados.</p>
          <ul className="flex space-x-6">
            <li>
              <Link
                to="#"
                className="hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
              >
                Privacidade
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
              >
                Termos
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-amber-700 dark:hover:text-amber-500 transition-colors"
              >
                Contato
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
