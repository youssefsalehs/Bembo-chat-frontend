import React, { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { Camera, Circle, Mail, Settings2, User } from "lucide-react";

export default function Profile() {
  const { userAuth, isUpdatingProfile, updateProfile } = useAuth();

  const [profilePic, setProfilePic] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (userAuth) {
      setFullName(userAuth?.fullName || "");
      setBio(userAuth?.bio || "");
      setSelectedImg(userAuth?.profilePic || null);
    }
  }, [userAuth]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePic(file);
    setSelectedImg(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("bio", bio);
      if (profilePic) formData.append("profilePic", profilePic);
      updateProfile(formData);
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setEditMode(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setEditMode((s) => !s)}
              disabled={isUpdatingProfile}
              className="bg-base-100 hover:scale-105 p-2 rounded-full"
            >
              <Settings2 />
            </button>
            <p className="text-s font-semibold">
              Member since:
              <span>
                {" "}
                {new Date(userAuth?.createdAt).toLocaleDateString() ||
                  "2020-12-3"}
              </span>
            </p>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4 flex items-center gap-8 justify-center">
              <span>Profile</span> <Circle className="text-green-700" />
            </h1>

            {editMode ? (
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Write your bio..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            ) : (
              <p>{bio || "No bio yet"}</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || "/default.jpg"}
                alt="avatar"
                className="size-32 rounded-full object-cover border-4"
              />

              <label
                htmlFor="image"
                className={`absolute right-0 bottom-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />

                <input
                  type="file"
                  id="image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={!editMode || isUpdatingProfile}
                />
              </label>
            </div>

            <p>
              {isUpdatingProfile
                ? "Uploading..."
                : editMode
                  ? "Click the camera icon to update your profile"
                  : ""}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="form-control">
              <label className="flex gap-1 items-center mb-2">
                <User className="size-5 text-base-content/40" />
                <span className="label-text font-medium"> Full Name</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  className="input input-bordered w-full "
                  placeholder="Enter your full name"
                  value={fullName}
                  disabled={!editMode}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            {/* email (readonly) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>

                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  value={userAuth?.email || ""}
                  disabled
                />
              </div>
            </div>

            {(editMode || isUpdatingProfile) && (
              <button
                onClick={handleUpdate}
                disabled={isUpdatingProfile}
                className="btn btn-primary mt-4"
              >
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
