import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Play, ArrowLeft } from 'lucide-react';

export const LightsOutInstructions: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-yellow-500/10 rounded-xl">
                        <Lightbulb className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">How to Play</h1>
                </div>

                <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p className="text-lg">
                        Welcome to <strong className="text-white">Lights Out</strong>! The goal is simple but challenging:
                        turn off all the lights on the grid.
                    </p>

                    <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-white font-semibold mb-3">Rules:</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>The game starts with a random pattern of lights switched on.</li>
                            <li>Clicking any cell toggles that light and its adjacent neighbors (up, down, left, right).</li>
                            <li>Toggling a light means: ON becomes OFF, and OFF becomes ON.</li>
                            <li>You win when the entire grid is dark (all lights are OFF).</li>
                        </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        <div className="text-sm text-gray-500">
                            Difficulty: <span className="text-indigo-400 font-medium">Medium</span>
                        </div>
                        <Link
                            to="/game/lights-out/play"
                            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-all hover:scale-105"
                        >
                            Start Game <Play className="w-4 h-4 ml-2 fill-current" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
