import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun, Palette } from "lucide-react";
import useUserStore from "../contexts/user.context";

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const { theme, toggleTheme } = useTheme();
  const User = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();
  const [isSticky, setIsSticky] = useState(false);

  const handleLogout = () => {
    clearUser();
    navigate("/auth");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`z-50 w-full transition-all duration-500 ease-in-out ${
          isSticky ? "fixed top-0 shadow-md backdrop-blur-md" : "relative"
        } ${
          transparent
            ? "bg-transparent"
            : theme === "dark"
            ? "bg-dark-background/90 border-b border-dark-border"
            : "bg-light-background/90 border-b border-light-border"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out ${
            isSticky ? "py-2" : "py-3"
          }`}
        >
          <div
            className={`flex justify-between items-center transition-all duration-500 ease-in-out ${
              isSticky ? "h-12" : "h-14"
            }`}
          >
            <Link
              to="/"
              className="flex items-center space-x-2 transition-all duration-500 ease-in-out"
            >
              <Palette
                className={`transition-all duration-500 ease-in-out ${
                  isSticky ? "h-6 w-6" : "h-7 w-7"
                } ${theme === "dark" ? "text-dark-primary" : "text-light-primary"}`}
              />
              <span
                className={`font-bold transition-all duration-500 ease-in-out ${
                  isSticky ? "text-base" : "text-lg"
                } ${theme === "dark" ? "text-dark-text" : "text-light-text"}`}
              >
                WebCraft
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`hover:opacity-80 transition-opacity ${
                  theme === "dark" ? "text-dark-text" : "text-light-text"
                }`}
              >
                Home
              </Link>
              {User ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`hover:opacity-80 transition-opacity ${
                      theme === "dark" ? "text-dark-text" : "text-light-text"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    // onClick={handleLogout}
                    className={`hover:opacity-80 transition-opacity ${
                      theme === "dark" ? "text-dark-text" : "text-light-text"
                    }`}
                  >
                   Profile
                  </Link>
                </>
              ) : (
                <Link
                  to="/auth"
                  className={`hover:opacity-80 transition-opacity ${
                    theme === "dark" ? "text-dark-text" : "text-light-text"
                  }`}
                >
                  Login/Register
                </Link>
              )}

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "hover:bg-dark-sidebar text-dark-text"
                    : "hover:bg-light-sidebar text-light-text"
                }`}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* This pushes down the page content when header is sticky */}
      {isSticky && <div className="h-12 w-full" />}
    </>
  );
};

export default Header;
