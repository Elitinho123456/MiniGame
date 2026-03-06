import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pickaxe, Sparkles, Home, RefreshCw } from 'lucide-react';

// Componente de Partícula de Ouro
const GoldParticle = ({ x, y }: { x: number; y: number }) => (
  <motion.div
    initial={{ x, y, opacity: 1, scale: 0 }}
    animate={{
      x: x + (Math.random() - 0.5) * 300,
      y: y + (Math.random() - 0.5) * 300,
      opacity: 0,
      scale: Math.random() * 1.5,
      rotate: Math.random() * 360
    }}
    transition={{ duration: 1.5, ease: "easeOut" }}
    className="absolute top-0 left-0 w-4 h-4 bg-yellow-400 border-2 border-yellow-600 rounded-sm shadow-[2px_2px_0px_rgba(0,0,0,0.3)] z-50"
  />
);

const TypewriterText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayText}</span>;
};

export default function Error() {
  const [mined, setMined] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [shake, setShake] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  const handleMine = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mined) return;
    e.preventDefault();
    setShake(true);
    setTimeout(() => setShake(false), 200);

    // Como as partículas agora estão DENTRO do container relativo do bloco,
    // o centro é simplesmente metade da largura e altura do próprio bloco.
    let spawnX = window.innerWidth / 2; // Fallback
    let spawnY = window.innerHeight / 2; // Fallback

    if (blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();
      spawnX = rect.width / 2;
      spawnY = rect.height / 2;
    }

    // Criar partículas na posição do centro do bloco
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: spawnX,
      y: spawnY
    }));

    setParticles(prev => [...prev, ...newParticles]);
    setMined(true);

    // Limpar partículas após animação
    setTimeout(() => setParticles([]), 2000);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center overflow-hidden font-sans select-none relative">
      {/* Background Pattern - Minecraft Deepslate Style */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#555 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <motion.div
        animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
        className="z-10 flex flex-col items-center text-center px-4"
      >
        {/* Bloco 404 Estilizado */}
        <div
          ref={blockRef}
          className="relative mb-8 group cursor-pointer"
          onClick={handleMine}
        >
          {/* Partículas de Ouro (Renderizadas dentro do container relativo) */}
          {particles.map(p => (
            <GoldParticle key={p.id} x={p.x} y={p.y} />
          ))}

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            className={`
              w-48 h-48 md:w-64 md:h-64 bg-[#3d3d3d] border-b-8 border-r-8 border-[#252525] border-t-8 border-l-8 border-[#555]
              flex flex-col items-center justify-center relative transition-colors duration-500
              ${mined ? 'bg-[#ffcc33] border-[#cc9900] shadow-[0_0_50px_rgba(255,204,51,0.4)]' : ''}
            `}
          >
            <span className={`text-6xl md:text-8xl font-black transition-colors duration-500 ${mined ? 'text-white' : 'text-[#888]'}`}>
              404
            </span>

            <AnimatePresence>
              {!mined && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-12 animate-bounce"
                >
                  <Pickaxe className="text-white w-10 h-10 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]" />
                </motion.div>
              )}
            </AnimatePresence>

            {mined && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="text-white w-20 h-20 opacity-40 animate-pulse" />
              </motion.div>
            )}
          </motion.div>

          {/* Legendinha de Interação */}
          {!mined && (
            <p className="mt-4 text-[#555] text-sm uppercase tracking-widest font-bold">
              Clique para minerar
            </p>
          )}
        </div>

        {/* Mensagem Principal */}
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-[0_4px_0_rgba(0,0,0,0.8)] h-16">
          <TypewriterText text={mined ? "¡VOCÊ ENCONTROU OURO!" : "Você cavou fundo demais..."} />
        </h1>

        <p className="text-stone-400 max-w-md mb-12 text-lg leading-relaxed">
          A página que você procura foi destruída por um Creeper ou nunca existiu neste bioma.
          {mined && <span className="text-yellow-500 block font-bold mt-2">Pelo menos você não sai de mãos vazias!</span>}
        </p>

        {/* Botões Estilo Minecraft Menu */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          <a
            href="/"
            className="flex-1 group relative bg-[#5c5c5c] hover:bg-[#32a852] border-b-4 border-black active:border-b-0 active:translate-y-1 transition-all p-4 flex items-center justify-center gap-3 text-white font-bold text-lg shadow-[0_4px_0_rgba(0,0,0,0.2)]"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            VOLTAR AO SPAWN
          </a>

          <button
            onClick={() => window.location.reload()}
            className="flex-1 group relative bg-[#5c5c5c] hover:bg-[#4a4a4a] border-b-4 border-black active:border-b-0 active:translate-y-1 transition-all p-4 flex items-center justify-center gap-3 text-white font-bold text-lg shadow-[0_4px_0_rgba(0,0,0,0.2)]"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            TENTAR DE NOVO
          </button>
        </div>
      </motion.div>

      {/* Detalhes Visuais de Canto */}
      <div className="absolute bottom-4 left-4 text-[#333] font-mono text-xs hidden md:block">
        XYZ: 404 / 64 / -102 <br />
        Biome: Lost_Page_Forest
      </div>

      <div className="absolute top-4 right-4 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-6 h-6 bg-red-600 border-2 border-red-900 rounded-sm" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
        ))}
      </div>
    </div>
  );
}