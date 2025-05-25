'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type User = {
  _id: string;
  name: string;
  email: string;
  created_at: string;
};

type Resource = {
  _id: string;
  title: string;
  description: string;
  category: string;
  file_type: string;
  uploaded_at: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [bookmarks, setBookmarks] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/user/me', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then((userData: User) => {
        setUser(userData);
        setLoadingUser(false);

        fetch(`http://localhost:5000/api/resources/list?uploaded_by=${userData._id}`, {
          credentials: 'include',
        })
          .then(async (res) => {
            if (!res.ok) throw new Error('Failed to fetch user resources');
            return res.json();
          })
          .then((resourceData: Resource[]) => {
            setResources(resourceData);
            setLoadingResources(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoadingResources(false);
          });

        fetch('http://localhost:5000/api/user/bookmarks', {
          credentials: 'include',
        })
          .then(async (res) => {
            if (!res.ok) throw new Error('Failed to fetch bookmarks');
            return res.json();
          })
          .then((bookmarkData: Resource[]) => {
            setBookmarks(bookmarkData);
            setLoadingBookmarks(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoadingBookmarks(false);
          });
      })
      .catch((err) => {
        setError(err.message);
        setLoadingUser(false);
        setLoadingResources(false);
        setLoadingBookmarks(false);
      });
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        const data = await res.json();
        alert(`Logout failed: ${data.error}`);
      }
    } catch {
      alert('Logout failed');
    }
  };

  if (error)
    return <p className="text-red-500 text-center mt-8">Error: {error}</p>;

  if (loadingUser)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex flex-col">
      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#2b5876] to-[#4e4376] bg-opacity-90 backdrop-blur-lg text-white rounded-2xl p-8 shadow-xl mb-12 hover:shadow-2xl hover:scale-[1.01] transition-transform duration-300"
      >
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">
                {user!.name[0].toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold">{user!.name}</h1>
            <p className="text-lg text-gray-200">{user!.email}</p>
            <p className="text-gray-300 mt-2">
              <span className="font-semibold">Joined:</span>{' '}
              {new Date(user!.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Uploaded Resources */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 mb-8 w-fit relative group">
          Your Uploaded Resources
          <span className="block h-1 w-0 bg-gradient-to-r from-purple-500 to-indigo-600 transition-all group-hover:w-full mt-1 rounded-full"></span>
        </h2>
        {loadingResources ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 bg-gray-100 rounded-xl shadow-lg">
            <p className="text-gray-500 text-lg">You have not uploaded any resources yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {resources.map((res, idx) => (
              <motion.div
                key={res._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-gradient-to-br from-[#bdc3c7] to-[#2c3e50] text-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block bg-purple-200 text-purple-900 px-3 py-1 rounded-full text-sm font-medium">
                      {res.category}
                    </span>
                    <span className="text-sm font-medium text-gray-200">
                      {res.file_type.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{res.title}</h3>
                  <p className="text-gray-200 mb-4">{res.description}</p>
                  <div className="border-t border-gray-400 pt-4">
                    <p className="text-sm text-gray-300">
                      Uploaded on {new Date(res.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Bookmarked Resources */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-16">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 mb-8 w-fit relative group">
          Your Bookmarked Resources
          <span className="block h-1 w-0 bg-gradient-to-r from-indigo-500 to-pink-500 transition-all group-hover:w-full mt-1 rounded-full"></span>
        </h2>
        {loadingBookmarks ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12 bg-gray-100 rounded-xl shadow-lg">
            <p className="text-gray-500 text-lg">You have no bookmarked resources yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((res, idx) => (
              <motion.div
                key={res._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-gradient-to-br from-[#232526] to-[#414345] text-white rounded-xl shadow-md backdrop-blur-lg border border-white/10 overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block bg-indigo-200 text-indigo-900 px-3 py-1 rounded-full text-sm font-medium">
                      {res.category}
                    </span>
                    <span className="text-sm font-medium text-gray-200">{res.file_type.toUpperCase()}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{res.title}</h3>
                  <p className="text-gray-300 mb-4">{res.description}</p>
                  <div className="border-t border-gray-500 pt-4">
                    <p className="text-sm text-gray-400">
                      Bookmarked on {new Date(res.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Logout Button at Bottom */}
      <div className="text-center">
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transform transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
