import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import useUserStore from "../contexts/user.context";
import axios from "axios";
import { toast } from "react-toastify";

const AuthPage: React.FC = () => {
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { User, setUser } = useUserStore();

  useEffect(() => {
    // console.log("User in AuthPage:", User);
  }, [User]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:9080/api/user/login"
      : "http://localhost:9080/api/user/register";
    try {
      const response = await axios.post(
        url,
        { name, email, password },
        { withCredentials: true }
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(
          "Welcome to WebCraft! Start building your dream website today!",
          {
            icon: (
              <span className="inline-block animate-wave text-yellow-400 text-xl">
                👋
              </span>
            ),
          }
        );
        setUser(response.data.user); // Adjust if needed
        navigate("/");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err: any) {
      console.error("Error during authentication:", err);
      const errorMsg =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Something went wrong. Please try again.";
      toast.error(errorMsg, {
        icon: (
          <span className="inline-block animate-pulse-error text-red-500 text-xl">
            ❌
          </span>
        ),
      });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        theme === "dark"
          ? "bg-dark-background text-dark-text"
          : "bg-light-background text-light-text"
      }`}
    >
      <motion.div
        className={`w-full max-w-md p-8 rounded-xl shadow-xl ${
          theme === "dark" ? "bg-dark-sidebar" : "bg-white"
        }`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-md border outline-none focus:ring-2 ring-offset-2 ring-blue-400 ${
                theme === "dark"
                  ? "bg-dark-sidebar text-white"
                  : "bg-white text-black"
              }`}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-md border outline-none focus:ring-2 ring-offset-2 ring-blue-400 ${
              theme === "dark"
                ? "bg-dark-sidebar text-white"
                : "bg-white text-black"
            }`}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`w-full px-4 py-3 rounded-md border outline-none focus:ring-2 ring-offset-2 ring-blue-400 ${
              theme === "dark"
                ? "bg-dark-sidebar text-white"
                : "bg-white text-black"
            }`}
          />

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold ${
              theme === "dark"
                ? "bg-dark-primary text-white"
                : "bg-light-primary text-white"
            }`}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            className="text-blue-500 underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
