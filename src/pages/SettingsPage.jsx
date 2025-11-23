import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Moon, Sun, Menu, X, User, LogOut, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

export default function CustomerLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <nav className="bg-blue-600 dark:bg-blue-800 text-white sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link
                to="/"
                className="text-2xl font-bold hover:text-blue-200 transition"
              >
                EmployeeAgency
              </Link>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-8 text-lg font-semibold font-sans">
                <Link
                  to="/"
                  className={`hover:text-blue-200 transition-all duration-200 ${
                    isActive("/") ? "border-b-2 border-white" : ""
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/gallery"
                  className={`hover:text-blue-200 transition-all duration-200 ${
                    isActive("/gallery") ? "border-b-2 border-white" : ""
                  }`}
                >
                  Gallery
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className={`hover:text-blue-200 transition-all duration-200 ${
                      isActive("/register") ? "border-b-2 border-white" : ""
                    }`}
                  >
                    Register
                  </Link>
                )}
                {user && (
                  <>
                    <Link
                      to="/booking"
                      className={`hover:text-blue-200 transition-all duration-200 ${
                        isActive("/booking") ? "border-b-2 border-white" : ""
                      }`}
                    >
                      Book Interview
                    </Link>
                    <Link
                      to="/settings"
                      className={`hover:text-blue-200 transition-all duration-200 ${
                        isActive("/settings") ? "border-b-2 border-white" : ""
                      }`}
                    >
                      Settings
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="hidden md:flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded transition"
                    >
                      <User size={20} />
                      <span>{user.full_name || user.email}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="hidden md:flex items-center space-x-2 hover:bg-blue-700 px-3 py-2 rounded transition"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="hidden md:block bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition"
                  >
                    Login
                  </Link>
                )}

                <button
                  onClick={toggleDarkMode}
                  className="p-2 hover:bg-blue-700 rounded"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  className="md:hidden p-2 hover:bg-blue-700 rounded"
                  onClick={() => setMobileMenu(!mobileMenu)}
                >
                  {mobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="md:hidden pb-4 space-y-2"
              >
                <Link to="/" className="block py-2 hover:text-blue-200">
                  Home
                </Link>
                <Link to="/gallery" className="block py-2 hover:text-blue-200">
                  Gallery
                </Link>
                {!user && (
                  <Link
                    to="/register"
                    className="block py-2 hover:text-blue-200"
                  >
                    Register
                  </Link>
                )}
                
                {user ? (
                  <>
                    <Link
                      to="/booking" 
                      className="block py-2 hover:text-blue-200"
                    >
                      Book Interview 
                    </Link>
                    <Link
                      to="/settings" 
                      className="block py-2 hover:text-blue-200"
                    >
                      Settings
                    </Link>
                    <Link
                      to="/profile"
                      className="block py-2 hover:text-blue-200"
                    >
                      Profile ({user.full_name || user.email})
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left py-2 hover:text-blue-200"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="block py-2 hover:text-blue-200">
                    Login
                  </Link>
                )}
              </motion.div>
            )}
          </div>
        </nav>

        <main>
          <Outlet />
        </main>

        <footer className="bg-gray-800 dark:bg-gray-950 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Employee Agency. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}