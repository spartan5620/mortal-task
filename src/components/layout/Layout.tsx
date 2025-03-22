
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Home,
  LogOut,
  Settings,
  User,
  Calendar,
  Coffee,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Navigation links based on user role
  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Login', path: '/login', icon: <User size={18} /> },
      ];
    }

    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin', icon: <Home size={18} /> },
        { name: 'All Canteens', path: '/', icon: <Coffee size={18} /> },
        { name: 'Settings', path: '/settings', icon: <Settings size={18} /> },
      ];
    }

    if (user?.role === 'owner') {
      return [
        { name: 'My Canteen', path: `/canteen/${user.canteenId}`, icon: <Coffee size={18} /> },
        { name: 'Dashboard', path: `/owner-dashboard`, icon: <Home size={18} /> },
        { name: 'Schedule', path: `/owner-dashboard/schedule`, icon: <Calendar size={18} /> },
        { name: 'All Canteens', path: '/', icon: <Coffee size={18} /> },
      ];
    }

    // Guest user
    return [
      { name: 'Home', path: '/', icon: <Home size={18} /> },
    ];
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur transition-all duration-300 ${
          isScrolled ? 'bg-background/80 shadow-sm' : 'bg-background'
        }`}
      >
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          {/* Logo and site name */}
          <Link
            to="/"
            className="flex items-center gap-2 font-display text-xl font-medium transition-colors hover:text-primary"
          >
            <Coffee size={24} className="text-primary" />
            <span>UniCanteen</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User menu (desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 text-sm">
                    <span className="hidden sm:inline-block">
                      {user?.name}
                    </span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {user?.role}
                    </Badge>
                    <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings size={16} className="mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  {user?.role === 'owner' && (
                    <DropdownMenuItem onClick={() => navigate('/owner-dashboard')}>
                      <Coffee size={16} className="mr-2" />
                      Manage Canteen
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')}>Login</Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center rounded-md p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container mx-auto px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-accent'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  <div className="h-px bg-border my-2"></div>
                  <div className="flex items-center justify-between px-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name}</span>
                      <Badge variant="outline" className="self-start mt-1 capitalize">
                        {user?.role}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="h-8 gap-1"
                    >
                      <LogOut size={16} />
                      Logout
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Coffee size={18} className="text-primary" />
              <span className="text-sm font-medium">UniCanteen</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} University Canteen System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
