import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import { uploadAvatar } from "../../utils/cloudinary";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [wishlist, setWishlist] = useState("");
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          ...data,
          wishlist: data.wishlist || "",
          premiumUntil: data.premiumUntil ? data.premiumUntil.toDate() : null,
          lastAvatarChange: data.lastAvatarChange?.toDate
            ? data.lastAvatarChange.toDate()
            : data.lastAvatarChange || null,
          // lastNicknameChange
          // lastNicknameChange: data.lastNicknameChange?.toDate
          //   ? data.lastNicknameChange.toDate()
          //   : data.lastNicknameChange || null,
        });
        setWishlist(data.wishlist || "");
      }
    };
    fetchProfile();
  }, [user]);

  if (!user || !profile) return <p>Loading...</p>;

  const handleAvatarChange = async () => {
    if (!avatarFile) return toast.info("Select a file");

    const canChange =
      !profile.lastAvatarChange ||
      (Date.now() - profile.lastAvatarChange.getTime()) / (1000 * 60 * 60 * 24) >= 7;

    if (!canChange)
      return toast.info("You can change your avatar once every 7 days");

    const url = await uploadAvatar(avatarFile);
    await updateDoc(doc(db, "users", user.uid), {
      photoURL: url,
      lastAvatarChange: serverTimestamp(),
    });

    setProfile({ ...profile, photoURL: url, lastAvatarChange: new Date() });
    setAvatarFile(null);
    refreshUser();
    toast.success("Avatar updated");
  };
  const handleWishlistSave = async () => {
    if (!user) return;

    try {
      setWishlistLoading(true);

      await updateDoc(doc(db, "users", user.uid), {
        wishlist: wishlist.trim(),
        wishlistUpdatedAt: serverTimestamp(),
      });

      setProfile((prev) => ({
        ...prev,
        wishlist: wishlist.trim(),
      }));

      toast.success("Wishlist updated");
    } catch (err) {
      console.error(err);
      toast.error("Error updating wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };
  /*
  const [nickname, setNickname] = useState("");
  const handleNicknameChange = async () => { ... }
  */

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleClose = () => navigate("/");

  let premiumDaysLeft = null;
  if (profile.premiumUntil) {
    const diffTime = profile.premiumUntil.getTime() - Date.now();
    premiumDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc] dark:bg-gradient-to-br dark:from-[#111018] dark:via-[#1b1a2b] dark:to-[#1c2a3a] text-gray-600 dark:text-white">
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full sm:max-w-md lg:max-w-lg overflow-auto p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 z-50 p-2 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FaTimes className="w-5 h-5 sm:w-5 sm:h-5" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center sm:text-left">My Profile</h2>

        <div className="flex flex-col items-center space-y-4">
          {profile.photoURL ? (
            <img
              src={profile.photoURL}
              alt="Avatar"
              className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border object-cover"
            />
          ) : (
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white font-bold text-2xl border">
              {profile.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div className="flex sm:flex-row justify-center items-center sm:space-x-2 space-y-2 sm:space-y-0">
            <input
              type="file"
              className="sm:w-auto w-full"
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
            <button
              onClick={handleAvatarChange}
              className="px-1 md:px-2 py-1 bg-[var(--secondary-color)] text-white rounded hover:bg-[var(--secondary-color-hover)] w-auto"
            >
              Change Avatar
            </button>
          </div>
          {/*
          <div className="flex flex-col sm:flex-row items-center sm:space-x-2 space-y-2 sm:space-y-0 w-full">
            <input ... />
            <button ...>Change Nickname</button>
          </div>
          */}

          <p className="text-gray-800 dark:text-white text-center sm:text-left w-full text-sm">Email: {profile.email}</p>
          {/* Wishlist — only for taker */}
          {profile.taker && (
            <div className="w-full mt-4">
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Wishlist
              </label>

              <textarea
                value={wishlist}
                onChange={(e) => setWishlist(e.target.value)}
                rows={3}
                placeholder="Write what books you are looking for..."
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 
                          bg-white dark:bg-gray-800 
                          text-gray-800 dark:text-white 
                          focus:outline-none focus:ring-2 
                          focus:ring-[var(--secondary-color)]"
              />

              <button
                onClick={handleWishlistSave}
                disabled={wishlistLoading}
                className="mt-2 px-4 py-2 bg-[var(--secondary-color)] 
                          text-white rounded-md 
                          hover:bg-[var(--secondary-color-hover)] 
                          transition w-full sm:w-auto"
              >
                {wishlistLoading ? "Saving..." : "Save Wishlist"}
              </button>
            </div>
          )}

          {profile.taker && profile.premiumUntil && premiumDaysLeft > 0 && (
            <p className="text-green-600 font-medium text-center sm:text-left w-full">
              Premium active until: {profile.premiumUntil.toLocaleDateString()} ({premiumDaysLeft} day(s) left)
            </p>
          )}
          {profile.lastAvatarChange && (
            <p className="text-gray-700 dark:text-gray-300 text-center sm:text-left w-full">
              Last Avatar Change: {profile.lastAvatarChange.toLocaleDateString()}
            </p>
          )}

          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;