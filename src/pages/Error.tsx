export default function Error() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-900">
            <h1 className="text-6xl font-extrabold text-red-600 dark:text-red-400 mb-4">404</h1>
            <p className="text-xl text-stone-600 dark:text-stone-400 mb-8">Ops! Página não encontrada.</p>
            <a href="/" className="btn-primary text-lg">Voltar para Home</a>
        </div>
    );
};