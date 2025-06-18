import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";
import axios from "axios";
import Header from "../components/Header";
import {
  Plus,
  Globe,
  Edit3,
  Trash2,
  Copy,
  MoreVertical,
  Search,
  Filter,
  Grid,
  Pencil,
  RefreshCw,
  List,
} from "lucide-react";
import { toast } from "react-toastify";

interface Website {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  lastModified: string;
  status: "draft" | "published";
  created: string;
}

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [websites, setWebsites] = useState<Website[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "draft" | "published"
  >("all");
  const [loading, setLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState<string | null>(null);
  const [duplicateDialog, setDuplicateDialog] = useState<string | null>(null);
  const [transferDialog, setTransferDialog] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const timeAgo = (dateStr: string): string => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffMs = now.getTime() - past.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffDay > 0) return `${diffDay} day(s) ago`;
    if (diffHr > 0) return `${diffHr} hour(s) ago`;
    if (diffMin > 0) return `${diffMin} minute(s) ago`;
    return `Just now`;
  };

  const EditDialogbox = () => {
    const website = websites.find((w) => w.id === editDialog);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState("");

    const [errors, setErrors] = useState<{
      title?: string;
      description?: string;
    }>({});
    const [loading, setLoading] = useState(false);

    // Sync when selected website changes
    useEffect(() => {
      if (website) {
        setTitle(website.name);
        setDescription(website.description);
        setPreview(website.thumbnail);
        setImage(null);
        setErrors({});
      }
    }, [website]);

    if (!website) return null;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      // console.log("File", file);
      if (file) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
      }
    };

    const validate = () => {
      const errs: typeof errors = {};
      if (!title.trim()) errs.title = "Title is required";
      if (!description.trim()) errs.description = "Description is required";
      setErrors(errs);
      return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
      if (!validate()) return;

      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) {
        formData.append("thumbnail", image);
      }

      try {
        const response = await axios.put(
          `http://localhost:9080/api/webdata/${website.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        // console.log("Responce of webdata update :", response.data);
        toast.success("Project updated successfully", {
          icon: (
            <span className="inline-block animate-wiggle-ok text-green-500 text-xl">
              <span
                style={{ transform: "scaleX(-1)", display: "inline-block" }}
              >
                👍
              </span>
            </span>
          ),
        });
        let newwebdata = response.data.webData;
        // console.log("responce from update :", newwebdata);
        setWebsites([
          ...websites.filter((w) => w.id !== website.id),
          {
            id: newwebdata?._id,
            name: newwebdata?.title,
            description: newwebdata?.description,
            thumbnail: newwebdata?.thumbnail || "",
            created: formatDate(newwebdata?.createdAt),
            lastModified: timeAgo(newwebdata?.updatedAt),
            status: "",
          },
        ]);
        // console.log("websites :", websites);
        setEditDialog(null);
      } catch (err: any) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Failed to update website");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        onClick={() => setEditDialog(null)}
      >
        <div
          className={`relative w-full max-w-3xl p-6 rounded-lg shadow-lg ${
            theme === "dark"
              ? "bg-dark-sidebar text-white"
              : "bg-white text-black"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setEditDialog(null)}
            className="absolute top-3 right-4 text-xl hover:text-red-500"
          >
            ✕
          </button>
          <h3 className="text-xl font-bold mb-6">Edit Website</h3>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block mb-2 font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-2 rounded border outline-none mb-1 ${
                  theme === "dark"
                    ? "bg-[#2a2a2a] text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mb-2">{errors.title}</p>
              )}

              <label className="block mb-2 font-medium">Description</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full p-2 rounded border outline-none ${
                  theme === "dark"
                    ? "bg-[#2a2a2a] text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            <div className="w-full md:w-1/2">
              <label className="block mb-2 font-medium">Thumbnail</label>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mb-2 w-full h-40 object-cover rounded"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className={`file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 ${
                  theme === "dark"
                    ? "file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                    : "file:bg-blue-500 file:text-white hover:file:bg-blue-400"
                }`}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-6 w-full py-2 rounded font-semibold transition ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : theme === "dark"
                ? "bg-dark-primary text-white hover:bg-opacity-90"
                : "bg-light-primary text-white hover:bg-opacity-90"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    );
  };
  const DuplicateDialogbox = () => {
    const website = websites.find((w) => w.id === duplicateDialog);
    const [isDuplicating, setIsDuplicating] = useState(false); // NEW: loading state

    useEffect(() => {
      if (website) {
        setInputValue("Copy of " + website.name || "");
      }
    }, [website]);

    if (!website) return null;

    const handleDuplicateClick = async () => {
      if (!inputValue.trim()) {
        toast.error("Please enter a name for the duplicate.");
        return;
      }

      try {
        setIsDuplicating(true); // Start loading
        const response = await axios.post(
          "http://localhost:9080/api/webdata/dup/" + website.id,
          { title: inputValue },
          { withCredentials: true }
        );

        if (response.status === 201) {
          toast.success("Website duplicated successfully!", {
            icon: (
              <span className="inline-block text-green-500 text-xl">👌</span>
            ),
          });
          // console.log("Duplication responace :", response.data);
          setWebsites((prev) => [
            ...prev,
            {
              id: response.data.dupWebdata?._id,
              name: response.data.dupWebdata?.title,
              description: response.data.dupWebdata?.description,
              thumbnail: response.data.dupWebdata?.thumbnail || "",
              created: formatDate(response.data.dupWebdata?.createdAt),
              lastModified: timeAgo(response.data.dupWebdata?.updatedAt),
              status: response.data.dupWebdata?.status || "draft",
            },
          ]);
          setInputValue("");
          setDuplicateDialog(null); // ✅ Only close on success
        }
      } catch (error: any) {
        console.error("Failed to duplicate website:", error);
        toast.error(
          error?.response?.data?.message || "Failed to duplicate website"
        );
      } finally {
        setIsDuplicating(false); // End loading
      }
    };

    return (
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-none flex justify-center items-center z-50"
        onClick={() => !isDuplicating && setDuplicateDialog(null)} // Prevent close while loading
      >
        <div
          className={`relative p-8 w-full max-w-lg rounded-lg ${
            theme === "dark"
              ? "bg-dark-sidebar text-white"
              : "bg-white text-black"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => !isDuplicating && setDuplicateDialog(null)} // Prevent close while loading
            className="absolute top-3 right-4 text-xl text-inherit hover:text-red-500"
          >
            ✕
          </button>
          <h3 className="text-lg font-bold mb-4">Duplicate Website</h3>

          <input
            defaultValue={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter new name"
            className={`w-full p-2 rounded border mb-6 outline-none ${
              theme === "dark"
                ? "bg-[#2a2a2a] text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-black border-gray-300 placeholder-gray-500"
            }`}
          />

          <div className="flex justify-start gap-4">
            <button
              onClick={handleDuplicateClick}
              disabled={isDuplicating}
              className={`px-4 py-2 rounded ${
                isDuplicating
                  ? "opacity-60 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-dark-primary text-white hover:bg-opacity-90"
                  : "bg-light-primary text-white hover:bg-opacity-90"
              }`}
            >
              {isDuplicating ? "Duplicating..." : "Duplicate"}
            </button>

            <button
              onClick={() => !isDuplicating && setDuplicateDialog(null)}
              disabled={isDuplicating}
              className={`px-4 py-2 rounded ${
                theme === "dark"
                  ? "border border-dark-border text-dark-text hover:bg-dark-background"
                  : "border border-light-border text-light-text hover:bg-light-background"
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        const response = await fetch("http://localhost:9080/api/webdata/all", {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "GET",
        });
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

        if (response.ok) {
          const data = await response.json();
          // console.log("All websites...", data);

          const formatted: Website[] = data.map((item: any) => ({
            id: item._id,
            name: item.title,
            description: item.description,
            thumbnail: item.thumbnail || "",
            created: formatDate(item.createdAt),
            lastModified: timeAgo(item.updatedAt),
          }));

          setWebsites(formatted);
        } else {
          console.error(
            "Failed to fetch websites with status:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error fetching websites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, []);

  const filteredWebsites = websites.filter((website) => {
    const matchesSearch =
      website?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      website?.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || website.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateNew = () => {
    navigate("/create-project");
  };

  const handleEditWebsite = (id: string) => {
    navigate(`/editor/${id}`);
  };
  const ConfirmDeleteDialog = ({ onClose }) => {
    const { theme } = useTheme();

    const bgColor = theme === "dark" ? "#1e1e1e" : "#ffffff";
    const textColor = theme === "dark" ? "#f5f5f5" : "#1e1e1e";
    const borderColor = theme === "dark" ? "#333" : "#ccc";

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="rounded-2xl p-6 w-[90%] max-w-md shadow-xl"
          style={{
            backgroundColor: bgColor,
            color: textColor,
            border: `1px solid ${borderColor}`,
          }}
        >
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-6">Are you sure you want to delete this project?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => onClose(0)}
              className="px-4 py-2 rounded-xl border"
              style={{
                backgroundColor: theme === "dark" ? "#2d2d2d" : "#f0f0f0",
                borderColor: borderColor,
                color: textColor,
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => onClose(1)}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const handleDelete = async (response) => {
    setShowDeleteDialog(false);
    if (response === 1) {
      // console.log("Delete id :", showDeleteDialog);
      const responace = await axios.delete(
        "http://localhost:9080/api/webdata/" + showDeleteDialog,
        { withCredentials: true }
      );
      if (responace.status == 200) {
        setWebsites(websites.filter((w) => w.id !== showDeleteDialog));
        toast.success("Project Deleted successfully ", {
          icon: (
            <span style={{ transform: "scaleX(-1)", display: "inline-block" }}>
              👍
            </span>
          ),
        });
      } else {
        toast.error("Something went wrong. Please try again.", {
          icon: (
            <span className="inline-block animate-pulse-error text-red-500 text-xl">
              ❌
            </span>
          ),
        });
      }
    }
  };
const TransferDialogBox = () => {
  const [statusMessage, setStatusMessage] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [userInput, setuserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handlettransfer = async () => {
    if (userInput.trim() == "") {
      setStatusMessage("Enter email first ..");
      setStatusColor("text-red-500");
      return;
    }
    try {
      setLoading(true);
      const responace = await axios.post(
        "http://localhost:9080/api/transferRequest/initiateTransfer/" +
          transferDialog,
        { reciever: userInput.trim() },
        { withCredentials: true }
      );
      if (responace.status == 200) {
        setTransferDialog(null);
        toast.warn("Transfer request sent ", {
          icon: (
            <span className="inline-block animate-wiggle-ok text-green-500 text-xl">
              👍
            </span>
          ),
        });
      }
    } catch (err) {
      console.log("Error in transfer :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (userInput.trim() !== "") {
        validateUser();
      } else {
        setStatusMessage("");
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [userInput]);

  const validateUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:9080/api/user/finduser",
        { email: userInput.trim() },
        { withCredentials: true }
      );
      if (response.data.flag === true || response.status == 200) {
        setStatusMessage(`✅ Transfer to ${userInput}`);
        setStatusColor("text-green-500");
      }
    } catch (err) {
      setStatusMessage("❌ No user found with this email");
      setStatusColor("text-red-500");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={() => setTransferDialog(null)}
    >
      <div
        className={`relative p-6 rounded-lg w-full max-w-md ${
          theme === "dark"
            ? "bg-dark-sidebar text-white"
            : "bg-white text-black"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setTransferDialog(null)}
          className="absolute top-3 right-4 text-xl text-inherit hover:text-red-500"
        >
          ✕
        </button>
        <h3 className="text-lg font-bold mb-4">Transfer Ownership</h3>

        <input
          defaultValue={userInput}
          onChange={(e) => setuserInput(e.target.value)}
          placeholder="Enter recipient email"
          className={`w-full p-2 rounded border mb-2 outline-none ${
            theme === "dark"
              ? "bg-[#2a2a2a] text-white border-gray-600 placeholder-gray-400"
              : "bg-white text-black border-gray-300 placeholder-gray-500"
          }`}
        />

        {statusMessage && (
          <p className={`text-sm mt-1 mb-3 font-medium ${statusColor}`}>
            {statusMessage}
          </p>
        )}

        <div className="flex justify-start gap-3 mt-4">
          <button
            onClick={handlettransfer}
            disabled={loading}
            className={`px-4 py-2 rounded flex items-center gap-2 ${
              theme === "dark"
                ? "bg-[rgb(211,106,174)] hover:bg-pink-500 text-white"
                : "bg-[rgb(211,106,174)] hover:bg-pink-500 text-white"
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {loading ? "Sending..." : "Transfer"}
          </button>

          <button
            onClick={() => setTransferDialog(null)}
            className={`px-4 py-2 rounded ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-black"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-dark-background text-dark-text"
          : "bg-light-background text-light-text"
      }`}
    >
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-2"
            >
              My Websites
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-opacity-80"
            >
              Manage and edit your website projects
            </motion.p>
          </div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <button
              onClick={handleCreateNew}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105 ${
                theme === "dark"
                  ? "bg-dark-primary text-white"
                  : "bg-light-primary text-white"
              }`}
            >
              <Plus className="h-5 w-5" /> Create New Website
            </button>

            <div className="flex flex-1 gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 opacity-60" />
                <input
                  type="text"
                  placeholder="Search websites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none ${
                    theme === "dark"
                      ? "bg-dark-sidebar border-dark-border text-dark-text placeholder-dark-infoText focus:border-dark-primary"
                      : "bg-light-sidebar border-light-border text-light-text placeholder-light-info focus:border-light-primary"
                  }`}
                />
              </div>

              {/* Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className={`px-4 py-3 rounded-lg border focus:outline-none ${
                  theme === "dark"
                    ? "bg-dark-sidebar border-dark-border text-dark-text focus:border-dark-primary"
                    : "bg-light-sidebar border-light-border text-light-text focus:border-light-primary"
                }`}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex rounded-lg border overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 ${
                    viewMode === "grid"
                      ? theme === "dark"
                        ? "bg-dark-primary text-white"
                        : "bg-light-primary text-white"
                      : theme === "dark"
                      ? "bg-dark-sidebar text-dark-text hover:bg-dark-background"
                      : "bg-light-sidebar text-light-text hover:bg-light-background"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 ${
                    viewMode === "list"
                      ? theme === "dark"
                        ? "bg-dark-primary text-white"
                        : "bg-light-primary text-white"
                      : theme === "dark"
                      ? "bg-dark-sidebar text-dark-text hover:bg-dark-background"
                      : "bg-light-sidebar text-light-text hover:bg-light-background"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Websites List */}
          {loading ? (
            <div
              className={`w-full flex-grow flex items-center justify-center ${
                theme === "dark" ? "bg-[#121212]" : "bg-white"
              } py-10`}
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="flex space-x-3">
                  <div
                    className="w-4 h-4 rounded-full bg-fuchsia-400 animate-bounce"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full bg-fuchsia-400 animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  ></div>
                  <div
                    className="w-4 h-4 rounded-full bg-fuchsia-400 animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                </div>
                <p
                  className={`text-sm animate-pulse ${
                    theme === "dark" ? "text-white opacity-70" : "text-gray-800"
                  }`}
                >
                  Loading your Websites...
                </p>
              </div>
            </div>
          ) : filteredWebsites.length === 0 ? (
            <div className="text-center py-16">
              <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || filterStatus !== "all"
                  ? "No websites found"
                  : "No websites yet"}
              </h3>
              <p className="opacity-70 mb-6">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first website to get started"}
              </p>
              {filterStatus === "all" && !searchTerm && (
                <button
                  onClick={handleCreateNew}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-dark-primary text-white"
                      : "bg-light-primary text-white"
                  }`}
                >
                  Create Your First Website
                </button>
              )}
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredWebsites.map((website, index) => (
                <motion.div
                  key={website.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`group relative rounded-xl overflow-hidden border transition-all duration-300 hover:scale-105 ${
                    theme === "dark"
                      ? "bg-dark-sidebar border-dark-border hover:border-dark-primary"
                      : "bg-light-sidebar border-light-border hover:border-light-primary"
                  } ${viewMode === "list" ? "flex items-center p-4" : ""}`}
                >
                  {viewMode === "grid" ? (
                    <>
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={website.thumbnail}
                          alt={website.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3
                            className={`font-semibold text-lg truncate ${
                              theme === "dark"
                                ? "text-dark-text"
                                : "text-light-text"
                            }`}
                          >
                            {website.name}
                          </h3>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setMenuOpenId(
                                  menuOpenId === website.id ? null : website.id
                                )
                              }
                              className={`p-1 rounded-full transition-colors ${
                                theme === "dark"
                                  ? "hover:bg-dark-background"
                                  : "hover:bg-light-background"
                              }`}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                            {editDialog && <EditDialogbox />}

                            {duplicateDialog && <DuplicateDialogbox />}

                            {transferDialog && <TransferDialogBox />}

                            {menuOpenId === website.id && (
                              <div
                                className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-50 p-2 text-sm ${
                                  theme === "dark"
                                    ? "bg-[#1e1e1e] text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                <button
                                  onClick={() => {
                                    setEditDialog(website.id);
                                    setMenuOpenId(null);
                                  }}
                                  className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                                >
                                  <Pencil size={16} /> Edit
                                </button>
                                <button
                                  onClick={() => {
                                    setDuplicateDialog(website.id);
                                    setMenuOpenId(null);
                                  }}
                                  className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                                >
                                  <Copy size={16} /> Duplicate
                                </button>
                                <button
                                  onClick={() => {
                                    // setInputValue("");
                                    setTransferDialog(website.id);
                                    setMenuOpenId(null);
                                  }}
                                  className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                                >
                                  <RefreshCw size={16} /> Transfer
                                </button>
                                <button
                                  onClick={() => {
                                    setShowDeleteDialog(website.id);
                                  }}
                                  className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                                >
                                  <Trash2 size={16} /> Delete
                                </button>
                                {showDeleteDialog && (
                                  <ConfirmDeleteDialog onClose={handleDelete} />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <p
                          className={`text-sm mb-3 line-clamp-2 ${
                            theme === "dark"
                              ? "text-dark-infoText"
                              : "text-light-info"
                          }`}
                        >
                          {website.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-dark-infoText"
                                : "text-light-info"
                            }`}
                          >
                            Created : {website.created}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-dark-infoText"
                                : "text-light-info"
                            }`}
                          >
                            Last modified: {website.lastModified}
                          </span>
                          {/* <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              website.status === "published"
                                ? theme === "dark"
                                  ? "bg-green-900 text-green-300"
                                  : "bg-green-100 text-green-800"
                                : theme === "dark"
                                ? "bg-yellow-900 text-yellow-300"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          > */}
                          {/* {website.status}
                          </span> */}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditWebsite(website.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              theme === "dark"
                                ? "bg-dark-primary text-white hover:bg-opacity-90"
                                : "bg-light-primary text-white hover:bg-opacity-90"
                            }`}
                          >
                            <Edit3 className="h-4 w-4" />
                            Edit
                          </button>
                          {website.status === "published" && (
                            <button
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                theme === "dark"
                                  ? "border border-dark-border text-dark-text hover:bg-dark-background"
                                  : "border border-light-border text-light-text hover:bg-light-background"
                              }`}
                            >
                              <Globe className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={website.thumbnail}
                        alt={website.name}
                        className="w-16 h-16 rounded-lg object-cover mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3
                              className={`font-semibold text-lg ${
                                theme === "dark"
                                  ? "text-dark-text"
                                  : "text-light-text"
                              }`}
                            >
                              {website.name}
                            </h3>
                            <p
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-dark-infoText"
                                  : "text-light-info"
                              }`}
                            >
                              {website.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {/* <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                website.status === "published"
                                  ? theme === "dark"
                                    ? "bg-green-900 text-green-300"
                                    : "bg-green-100 text-green-800"
                                  : theme === "dark"
                                  ? "bg-yellow-900 text-yellow-300"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            > */}
                            {/* {website.status}
                            </span> */}
                            <button
                              onClick={() => handleEditWebsite(website.id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                theme === "dark"
                                  ? "bg-dark-primary text-white hover:bg-opacity-90"
                                  : "bg-light-primary text-white hover:bg-opacity-90"
                              }`}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className={`text-xs ${
                              theme === "dark"
                                ? "text-dark-infoText"
                                : "text-light-info"
                            }`}
                          >
                            Last modified: {website.lastModified}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
