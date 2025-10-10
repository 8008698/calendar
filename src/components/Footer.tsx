import React from 'react';
import { Calendar, Github } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border-t border-white/20 dark:border-gray-700/50 py-3 px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-white/90 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Bikram Sambat Calendar</span>
                </div>

                <div className="flex items-center gap-4 text-white/80 dark:text-gray-400">
                    <span>© {currentYear} All rights reserved</span>
                    <span className="hidden sm:inline">•</span>
                    <a
                        href="#"
                        className="flex items-center gap-1 hover:text-white dark:hover:text-gray-200 transition-colors"
                        onClick={(e) => e.preventDefault()}
                    >
                        <Github className="w-4 h-4" />
                        <span className="hidden sm:inline">GPL v3</span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
