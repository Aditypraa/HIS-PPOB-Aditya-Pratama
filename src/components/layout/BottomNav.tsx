import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, Wallet, Repeat, UserCircle } from 'lucide-react';

interface BottomNavProps {
  activePage?: string;
  navigate?: (path: string) => void;
}

function BottomNav({ activePage, navigate: propNavigate }: BottomNavProps) {
  const routerNavigate = useNavigate();
  const location = useLocation();

  // Determine current path correctly
  const currentPath = activePage ||
    (location.pathname === '/' ? 'home' : location.pathname.substring(1));

  // Navigation handler that ensures consistent behavior
  const handleNavigation = (path: string) => {
    if (propNavigate) {
      propNavigate(path);
    } else {
      routerNavigate(path);
    }
  };

  const navItems = [
    { name: 'Home', icon: HomeIcon, page: 'home', path: '/' },
    { name: 'Top Up', icon: Wallet, page: 'topup', path: '/topup' },
    { name: 'Transaction', icon: Repeat, page: 'transaction', path: '/transaction' },
    { name: 'Akun', icon: UserCircle, page: 'profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg flex justify-around py-2 z-50">
      {navItems.map(item => {
        // Calculate if this item is active - handle root path specifically
        const isActive =
          (item.page === 'home' && (currentPath === 'home' || location.pathname === '/')) ||
          (item.path !== '/' && (
            currentPath === item.page ||
            location.pathname === item.path
          ));

        return (
          <button
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            className={`flex flex-col items-center p-2 rounded-lg transition duration-150 ease-in-out w-16 ${isActive ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
              }`}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
