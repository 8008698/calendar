import React, { useState, useEffect } from 'react';
import { X, Menu, Info, Code } from 'lucide-react';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'about' | 'source'>('about');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative ml-auto w-full max-w-sm h-full bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Menu</h2>
                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-gray-400"
                    >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
                            activeTab === 'about'
                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        <Info className="w-4 h-4" />
                        About
                    </button>
                    <button
                        onClick={() => setActiveTab('source')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
                            activeTab === 'source'
                                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                        <Code className="w-4 h-4" />
                        Source Code
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'about' ? (
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Bikram Sambat Calendar</h3>
                                <p className="text-sm leading-relaxed">
                                    A comprehensive Nepali calendar application featuring both Bikram Sambat (BS) and Gregorian (AD) calendar systems with accurate Panchanga calculations.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Features</h4>
                                <ul className="text-sm space-y-1 list-disc list-inside">
                                    <li>Dual calendar system (Bikram Sambat & Gregorian)</li>
                                    <li>Complete Panchanga with Tithi, Nakshatra, Yoga, and Karana</li>
                                    <li>Sunrise and Sunset timings</li>
                                    <li>Nepali festivals and events</li>
                                    <li>Dark mode support</li>
                                    <li>Responsive design</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Panchanga Elements</h4>
                                <ul className="text-sm space-y-1">
                                    <li><span className="font-medium">Tithi:</span> Lunar day based on Moon-Sun elongation</li>
                                    <li><span className="font-medium">Nakshatra:</span> Lunar mansion (27 divisions)</li>
                                    <li><span className="font-medium">Yoga:</span> Auspicious combination (27 types)</li>
                                    <li><span className="font-medium">Karana:</span> Half of a Tithi (11 types)</li>
                                    <li><span className="font-medium">Paksha:</span> Lunar fortnight (Shukla/Krishna)</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">About Bikram Sambat</h4>
                                <p className="text-sm leading-relaxed">
                                    Bikram Sambat (BS) is the official calendar of Nepal. It is approximately 56 years and 8 months ahead of the Gregorian calendar. The calendar is based on ancient Hindu astronomy and follows the Purnimanta lunar system.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Source Code</h3>
                                <p className="text-sm leading-relaxed mb-4">
                                    This project is built with modern web technologies and follows open-source principles.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Technologies Used</h4>
                                <ul className="text-sm space-y-1 list-disc list-inside">
                                    <li>React 18 with TypeScript</li>
                                    <li>Vite for fast development</li>
                                    <li>Tailwind CSS for styling</li>
                                    <li>Lucide React for icons</li>
                                    <li>Surya Siddhanta astronomical calculations</li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">QML Compatible Calculator</h4>
                                <p className="text-sm leading-relaxed">
                                    The Panchanga calculations are based on the QML-compatible JavaScript calculator, ensuring accuracy and consistency with traditional astronomical methods from the Surya Siddhanta.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">License</h4>
                                <p className="text-sm leading-relaxed">
                                    The Panchanga Calculator component is licensed under GNU GPL v3. This ensures the code remains free and open-source.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Repository Structure</h4>
                                <div className="text-sm bg-gray-100 dark:bg-gray-900 p-3 rounded-lg font-mono">
                                    <div>src/</div>
                                    <div className="ml-4">├── components/</div>
                                    <div className="ml-4">├── lib/</div>
                                    <div className="ml-8">├── bikramCalculations.ts</div>
                                    <div className="ml-8">├── dateConversions.ts</div>
                                    <div className="ml-8">├── panchangaCalculations.ts</div>
                                    <div className="ml-8">└── PanchangaCalculator.js</div>
                                    <div className="ml-4">└── data/</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
