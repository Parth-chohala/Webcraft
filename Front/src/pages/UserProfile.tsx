import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import useUserStore from "../contexts/user.context";
import { useNavigate } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { theme } = useTheme();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleLogout = () => {
    clearUser();
    navigate("/auth");
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      // console.log("Submitted data:", formData);
      setIsEditing(false);
    } else {
      setErrors(validationErrors);
    }
  };

  const themeText = theme === "dark" ? "text-dark-text" : "text-light-text";
  const themeBg = theme === "dark" ? "bg-dark-background" : "bg-light-background";
  const themeCard = theme === "dark" ? "bg-dark-sidebar" : "bg-light-sidebar";

  return (
    <div className={`min-h-screen px-4 py-10 ${themeBg} ${themeText}`}>
      <div className={`max-w-xl mx-auto p-6 rounded-lg shadow-md ${themeCard}`}>
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>

        <p><span className="font-semibold">Name:</span> {user?.name}</p>
        <p><span className="font-semibold">Email:</span> {user?.email}</p>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => alert("Delete logic goes here")}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete Account
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className={`p-6 rounded-lg shadow-lg w-full max-w-md ${themeCard}`}>
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
