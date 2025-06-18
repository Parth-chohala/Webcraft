import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB.");
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError("");
  };

  const handleNext = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!imageFile) {
      setError("Please upload an image.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("thumbnail", imageFile);

      const response = await axios.post(
        "http://localhost:9080/api/webdata/add",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (response.status === 401) {
        toast.error("Something went wrong. Please Login and try again.", {
          icon: (
            <span className="inline-block animate-pulse-error text-red-500 text-xl">
              ❌
            </span>
          ),
        });
        navigate("/auth");
      }
      if (response.status === 200 || response.status === 201) {
        toast.success("Project Created successfully ", {
          icon: (
            <span className="inline-block animate-wiggle-ok text-green-500 text-xl">
              👌
            </span>
          ),
        });
        setTimeout(
          () => navigate("/editor/" + response.data.webData._id),
          1000
        );
      } else {
        toast.error("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error creating project:", err);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6 py-12 transition-colors ${
        theme === "dark"
          ? "bg-dark-background text-dark-text"
          : "bg-light-background text-light-text"
      }`}
    >
      {/* <ToastContainer position="top-right" /> */}
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Create Project</h1>

        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className={`w-full p-3 rounded-lg border outline-none ${
              theme === "dark"
                ? "bg-dark-sidebar border-dark-border text-dark-text"
                : "bg-white border-gray-300 text-black"
            }`}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className={`w-full p-3 rounded-lg border resize-none h-32 outline-none ${
              theme === "dark"
                ? "bg-dark-sidebar border-dark-border text-dark-text"
                : "bg-white border-gray-300 text-black"
            }`}
          />

          <div>
            <label
              htmlFor="imageUpload"
              className={`cursor-pointer inline-block px-4 py-2 rounded-lg font-medium transition ${
                theme === "dark"
                  ? "bg-dark-accent text-dark-text hover:bg-dark-hover"
                  : "bg-light-accent text-white hover:bg-light-hover"
              }`}
            >
              Upload Image
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full rounded-lg border shadow-md"
              />
            </div>
          )}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            onClick={handleNext}
            disabled={loading}
            className={`w-full py-2 mt-4 rounded-lg font-semibold transition flex justify-center items-center ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : theme === "dark"
                ? "bg-dark-primary text-dark-text hover:bg-dark-hover"
                : "bg-light-primary text-white hover:bg-light-hover"
            }`}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
