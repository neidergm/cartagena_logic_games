import { useWallArchitectStore } from "../store";
import { Piece } from "./Piece";

const Inventory = () => {

    const inventoryPieces = useWallArchitectStore((state) => state.inventoryPieces);
    const rotatePiece = useWallArchitectStore((state) => state.rotatePiece);
    const resetLevel = useWallArchitectStore((state) => state.resetLevel);
    const levelCompleted = useWallArchitectStore((state) => state.levelCompleted);

    return (
        <div className="bg-[#2c241b]/95 p-6 rounded-lg border border-[#5D4037] h-fit shadow-2xl backdrop-blur-md w-full lg:w-auto lg:min-w-[300px]">
            <h2 className="text-xl font-bold mb-4 text-[#deb887] border-b border-[#5D4037] pb-2 font-['Cinzel'] text-center">
                Piedras Disponibles
            </h2>
            <div className="columns-2 md:columns-3 gap-4 min-h-[150px]">
                {inventoryPieces.map((piece) => (
                    <div key={piece.id} className="break-inside-avoid flex justify-center group mb-4">
                        <Piece
                            piece={piece}
                            inInventory
                            onClick={() => rotatePiece(piece.id)}
                            cellSize={25}
                        />
                    </div>
                ))}
                {inventoryPieces.length === 0 && !levelCompleted && (
                    <div className="flex flex-col items-center justify-center h-full text-stone-500 italic text-sm w-full">
                        <p>Has usado todas las piedras.</p>
                    </div>
                )}
            </div>

            <button
                onClick={resetLevel}
                className="mt-6 w-full py-2 px-4 bg-[#4a3728] hover:bg-[#5d4037] rounded border border-[#deb887]/20 text-[#deb887] font-['Cinzel'] font-bold text-sm tracking-wider transition-all"
            >
                Reiniciar Trabajo
            </button>
        </div>
    )
}

export default Inventory