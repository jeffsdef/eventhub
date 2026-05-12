import { motion } from 'motion/react';
import { Calendar, Search, User, Menu, X, Bell, LogOut } from 'lucide-react';
import { Button } from './ui/Button';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = location.pathname !== '/' && location.pathname !== '/login';

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EventHub
              </span>
            </button>

            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-6">
                <NavLink href="/dashboard" active={location.pathname === '/dashboard'}>
                  Eventos
                </NavLink>
                <NavLink href="/organizer" active={location.pathname === '/organizer'}>
                  Meus Eventos
                </NavLink>
                <NavLink href="/admin" active={location.pathname === '/admin'}>
                  Admin
                </NavLink>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <button className="relative p-2 hover:bg-accent rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
                </button>
                <button onClick={() => navigate('/profile')} className="flex items-center gap-2 p-2 hover:bg-accent rounded-lg transition-colors">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                </button>
                <button className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground">
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Entrar
                </Button>
                <Button onClick={() => navigate('/login')}>
                  Cadastrar
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-border bg-background"
        >
          <div className="px-4 py-4 space-y-2">
            {isLoggedIn ? (
              <>
                <MobileNavLink href="/dashboard">Eventos</MobileNavLink>
                <MobileNavLink href="/organizer">Meus Eventos</MobileNavLink>
                <MobileNavLink href="/profile">Perfil</MobileNavLink>
                <MobileNavLink href="/admin">Admin</MobileNavLink>
                <div className="pt-2 border-t border-border">
                  <Button variant="ghost" className="w-full justify-start">
                    Sair
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" className="w-full" onClick={() => navigate('/login')}>
                  Entrar
                </Button>
                <Button className="w-full" onClick={() => navigate('/login')}>
                  Cadastrar
                </Button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(href)}
      className={`relative px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(href)}
      className="block w-full text-left px-3 py-2 rounded-lg hover:bg-accent text-foreground transition-colors"
    >
      {children}
    </button>
  );
}
