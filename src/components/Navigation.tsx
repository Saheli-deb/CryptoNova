import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  BarChart3, 
  Wallet, 
  Settings, 
  Menu,
  Bell,
  LogOut,
  User
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const getUserInitials = (user: any) => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <nav className="glass-card border-b border-card-border backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center crypto-glow">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">CryptoNova</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard">
                <Button 
                  variant="ghost" 
                  className={`${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/predictions">
                <Button 
                  variant="ghost" 
                  className={`${isActive('/predictions') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Predictions
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button 
                  variant="ghost" 
                  className={`${isActive('/portfolio') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Portfolio
                </Button>
              </Link>
              <Link to="/settings">
                <Button 
                  variant="ghost" 
                  className={`${isActive('/settings') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          )}

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <DropdownMenu open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-danger rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end" forceMount>
                    <div className="flex items-center justify-between p-3 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                      {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                          Mark all read
                        </Button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 10).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${
                              !notification.read ? 'bg-primary/5' : ''
                            }`}
                            onClick={() => {
                              if (!notification.read) markAsRead(notification.id);
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 pr-2">
                                <p className="font-medium text-sm">{notification.title}</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.firstName} />
                        <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-card-border hover:bg-card-secondary">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary-dark crypto-glow">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-card-border animate-fade-in">
            <div className="flex flex-col space-y-2">
              {isAuthenticated && (
                <>
                  <Link to="/dashboard">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/predictions">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${isActive('/predictions') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Predictions
                    </Button>
                  </Link>
                  <Link to="/portfolio">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${isActive('/portfolio') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Portfolio
                    </Button>
                  </Link>
                  <Link to="/settings">
                    <Button 
                      variant="ghost" 
                      className={`w-full justify-start ${isActive('/settings') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                </>
              )}
              
              <div className="flex space-x-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex-1 text-center py-2">
                      <p className="text-sm text-muted-foreground">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <Button 
                      onClick={handleLogout}
                      variant="outline" 
                      className="w-full border-card-border"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex-1">
                      <Button variant="outline" className="w-full border-card-border">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary-dark">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;