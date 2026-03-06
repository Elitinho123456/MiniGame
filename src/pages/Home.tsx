import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Pickaxe, Sparkles, ChevronRight, Play, Github } from 'lucide-react';
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-stone-300 font-sans selection:bg-emerald-500/30 flex overflow-hidden">
      {/* Sidebar Integrada */}
      <Sidebar isLanding={true} />

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col overflow-y-auto custom-scrollbar">
        {/* Decorative Assets - Floating in Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
          <motion.img
            src="./Diamond_Pickaxe.webp"
            className="absolute top-[15%] left-[10%] w-24 h-24 opacity-10 blur-[1px]"
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src="./Iron_Ore.webp"
            className="absolute top-[60%] left-[5%] w-16 h-16 opacity-10 blur-[2px]"
            animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src="./Gold_Ore.webp"
            className="absolute top-[20%] right-[10%] w-20 h-20 opacity-10 blur-[1px]"
            animate={{ y: [0, -40, 0], rotate: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src="./Ancient_Debris.webp"
            className="absolute top-[75%] right-[15%] w-20 h-20 opacity-10 blur-[2px]"
            animate={{ y: [0, 25, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Hero Section */}
        <section className="relative flex-1 flex flex-col items-center justify-center p-8 md:p-20 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-black uppercase tracking-widest mb-8"
            >
              <Sparkles size={12} />
              Alpha 0.0.5 Já Disponível
            </motion.div>

            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
              MINERE. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">CONSTRUA.</span> <br />
              EVOLUA.
            </h1>

            <p className="text-lg md:text-xl text-stone-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Explore suas dimensões favoritas, colecione pets lendários e automatize sua produção
              em um simulador de mineração viciante.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/game"
                className="group relative flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-[#1a1a1a] px-8 py-4 rounded-xl font-black text-lg transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
              >
                <Play size={20} fill="currentColor" />
                JOGAR AGORA
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/documentation"
                className="flex items-center gap-3 bg-stone-800 hover:bg-stone-700 text-white px-8 py-4 rounded-xl font-black text-lg transition-all border-b-4 border-black active:border-b-0 active:translate-y-1"
              >
                WIKI / DOCS
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Info Grid - Minimalist */}
        <section className="p-8 md:p-20 bg-stone-900/50 border-t border-stone-800/50 backdrop-blur-sm relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              whileHover={{ y: -5 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                <Pickaxe size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Progressão Linear</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                De ferramentas de madeira a netherite encantada. Cada nível desbloqueia novas possibilidades e velocidades de mineração.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Múltiplas Dimensões</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Viaje do Overworld até o The End. Cada bioma possui recursos exclusivos e multiplicadores de moedas únicos.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                <Github size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Open Source</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Projeto desenvolvido com foco na comunidade. Acompanhe o desenvolvimento e contribua com novas ideias.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Footer Minimalista */}
        <footer className="p-10 text-center border-t border-stone-900 bg-[#1a1a1a]">
          <p className="text-stone-600 text-[10px] font-bold uppercase tracking-[0.3em]">
            Desenvolvido com amor por <a href="https://github.com/Elitinho123456" className="text-emerald-500 hover:text-emerald-400 transition-colors">Elitinho</a> &copy; 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
