import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StudioEditor from '@grapesjs/studio-sdk/react';
import '@grapesjs/studio-sdk/style';
import axios from 'axios';
import defaultProject from '../components/default.json'; // ✅ import default project
import { useNavigate } from 'react-router-dom';

const waitAndFailRandomly = async (msg) => {
  await new Promise((res) => setTimeout(res, 500));
  if (Math.random() >= 0.95) throw new Error(msg);
};

const saveToSessionStorage = async (projectId, project) => {
  await waitAndFailRandomly('Testing save failed');
  localStorage.setItem(projectId, JSON.stringify(project));
};

export default function Editor() {
  const { id } = useParams();
  const [webString, setWebString] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const saveProject = async (project) => {
    // console.log("Project :", project);
    try {
      const response = await axios.put(
        `http://localhost:9080/api/webdata/${id}`,
        { dataString: JSON.stringify(project) },
        { withCredentials: true }
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
      // console.log('✅ Project saved:', response.data);
    } catch (error) {
      console.error('❌ Error saving project:', error);
    }
  };


  useEffect(() => {
    if (!id) {
      console.error('❌ No ID in URL');
      return;
    }

    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:9080/api/webdata/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.status === 401) {
          toast.error("Something went wrong. Please Login and try again.", {
            icon: (
              <span className="inline-block animate-pulse-error text-red-500 text-xl">
                ❌
              </span>
            ),
          });
          navigate("/auth");
        }
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();

        const parsedData =
          typeof data.dataString === 'string'
            ? JSON.parse(data.dataString)
            : data.dataString;

        if (!parsedData || Object.keys(parsedData).length === 0) {
          console.warn('⚠ No valid data found, using default template.');
          setWebString(defaultProject); // ✅ use default
        } else {
          // console.log('✅ Loaded project:', parsedData);
          setWebString(parsedData);
        }
      } catch (err) {
        console.error('❌ Failed to fetch project:', err);
        setWebString(defaultProject); // ✅ fallback to default on error
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]">
        <div className="flex flex-col items-center space-y-6">
          <div className="flex space-x-3">
            <div className="w-4 h-4 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-4 h-4 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-4 h-4 rounded-full bg-fuchsia-400 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
          </div>
          <p className="text-sm text-white opacity-70 animate-pulse">Loading your editor...</p>
        </div>
      </div>
    );
  }

  return (
    <StudioEditor
      key={id}
      options={{
        storage: {
          type: 'self',
          autosaveChanges: 5,
          onSave: async ({ project }) => {
            await saveProject(project);
          },
          onLoad: async () => {
            return { project: webString };
          },
        },
      }}
    />
  );
}
