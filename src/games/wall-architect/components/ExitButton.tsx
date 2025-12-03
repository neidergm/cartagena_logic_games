
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ExitButton = () => {
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const navigate = useNavigate();

    const handleExit = () => {
        navigate('/');
    };

    return (<>
        <button
            onClick={() => setShowExitConfirm(true)}
            className="absolute top-6 right-6 z-50 p-3 bg-black/50 hover:bg-[#8B4513] text-stone-400 hover:text-white rounded-full border border-[#deb887]/30 transition-all backdrop-blur-sm group"
            title="Salir al Inicio"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 group-hover:scale-110 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
        {showExitConfirm && (
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-[#2c241b] p-8 rounded-lg border border-[#5D4037] shadow-2xl max-w-sm w-full text-center relative">
                    <h3 className="text-xl font-bold text-[#FFD700] font-['Cinzel'] mb-4">¿Abandonar Trabajo?</h3>
                    <p className="text-stone-300 mb-8 font-sans">El progreso del nivel actual se perderá.</p>
                    <div className="flex gap-4 justify-center font-sans">
                        <button
                            onClick={() => setShowExitConfirm(false)}
                            className="px-4 py-2 text-stone-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleExit}
                            className="px-6 py-2 bg-[#8B4513] hover:bg-[#A0522D] text-white rounded border border-[#deb887]/30 transition-all shadow-lg"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        )}

    </>
    )
}

export default ExitButton