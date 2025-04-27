import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogOut } from 'lucide-react';
import Button from '../common/Button';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

interface NavbarProps {
    title?: string;
    showBackButton?: boolean;
    showLogoutButton?: boolean;
    onBackButtonClick?: () => void;
    className?: string;
}

function Navbar({
    title,
    showBackButton = false,
    showLogoutButton = false,
    onBackButtonClick,
    className = '',
}: NavbarProps) {
    const navigate = useNavigate();
    const { dispatch } = useContext(AppContext);

    const handleBack = () => {
        if (onBackButtonClick) {
            onBackButtonClick();
        } else {
            navigate('/');
        }
    };

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <header className={`bg-white shadow-sm p-4 sticky top-0 z-40 ${className}`}>
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center">
                    {showBackButton && (
                        <button
                            onClick={handleBack}
                            className="text-gray-600 hover:text-red-500 mr-4"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    )}

                    {title ? (
                        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
                    ) : (
                        <div className="flex items-center">
                            <img
                                src="https://placehold.co/30x30/f87171/ffffff?text=S"
                                alt="SIMS Logo"
                                className="h-7 w-7 mr-2 rounded"
                            />
                            <span className="text-lg font-bold text-gray-800">SIMS PPOB</span>
                        </div>
                    )}
                </div>

                {showLogoutButton && (
                    <Button variant="secondary" onClick={handleLogout}>
                        <LogOut size={16} className="mr-1 inline" /> Keluar
                    </Button>
                )}
            </div>
        </header>
    );
}

export default Navbar;
