import React from 'react';
import { FaMoon, FaBell, FaHeart } from 'react-icons/fa';
import NotificationsModal from './NotificationsModal';

interface AppHeaderProps {
    user: {
        name: string;
        img: string;
        uid: string;
        pin: string;
        coupleId?: string;
    } | null;
    showNotif: boolean;
    notifications: Array<{ id: number; text: string; read: boolean; }>;
    onToggleDarkMode: () => void;
    onNotifClick: () => void;
    onNotifClose: () => void;
    onMarkRead: (id: number) => void;
    onClearAll: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    user,
    showNotif,
    notifications,
    onToggleDarkMode,
    onNotifClick,
    onNotifClose,
    onMarkRead,
    onClearAll
}) => {
    return (
        <>
            <div className="w-full px-4 py-3 flex items-center justify-between border-b border-gray-200 z-20 bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-300 animate-gradient">
                <div className="flex items-center">
                    <span className="mr-2">
                        <span className="w-8 h-8 flex items-center justify-center bg-white rounded-full animate-bounce">
                            <FaHeart className="text-pink-500 text-2xl" />
                        </span>
                    </span>
                    <span className="font-extrabold text-xl text-white drop-shadow-lg tracking-wide animate-fade-in">Live-in</span>
                </div>
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={onToggleDarkMode}
                        className="text-xl text-white opacity-80 hover:opacity-100 transition duration-300"
                    >
                        <FaMoon />
                    </button>
                    <button 
                        onClick={onNotifClick}
                        className="relative text-xl text-white opacity-80 hover:opacity-100 transition duration-300"
                    >
                        <FaBell />
                        {notifications.some(n => !n.read) && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                        )}
                    </button>
                    {user && (
                        <img 
                            src={user.img} 
                            alt={user.name} 
                            className="w-7 h-7 rounded-full border-2 border-white shadow-lg transition-transform duration-300 hover:scale-110" 
                        />
                    )}
                </div>
            </div>
            <NotificationsModal
                isOpen={showNotif}
                onClose={onNotifClose}
                notifications={notifications}
                onMarkRead={onMarkRead}
                onClearAll={onClearAll}
            />
        </>
    );
};

export default AppHeader;
