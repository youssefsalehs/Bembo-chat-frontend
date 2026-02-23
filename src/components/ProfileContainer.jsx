import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import { Camera, Circle, Mail, Pen, Settings2, User } from "lucide-react";
import { PreviewContext } from "../PreviewProvider";
export default function ProfileContainer() {
  const { userAuth, isUpdatingProfile, updateProfile } = useAuth();

  const [profilePic, setProfilePic] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const { setPreviewImages, setCurrentIndex } = useContext(PreviewContext);
  const [coverPic, setCoverPic] = useState(null);
  const [selectedCover, setSelectedCover] = useState(null);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    if (userAuth) {
      setFullName(userAuth?.fullName || "");
      setBio(userAuth?.bio || "");
      setSelectedImg(userAuth?.profilePic || null);
      setSelectedCover(userAuth?.coverPic || null);
    }
  }, [userAuth]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePic(file);
    setSelectedImg(URL.createObjectURL(file));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCoverPic(file);
    setSelectedCover(URL.createObjectURL(file));
  };
  const handlePreview = (img, allImages = [img]) => {
    setPreviewImages(allImages);
    setCurrentIndex(allImages.indexOf(img));
  };
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("bio", bio);

      if (profilePic) formData.append("profilePic", profilePic);
      if (coverPic) formData.append("coverPic", coverPic);

      await updateProfile(formData);
    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setEditMode(false);
    }
  };
  return (
    <div className="bg-base-300 rounded-xl p-6 py-3 space-y-3">
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
            {new Date(userAuth?.createdAt).toLocaleDateString() || "2020-12-3"}
          </span>
        </p>
      </div>

      <div className="relative w-full h-48 rounded-xl overflow-hidden">
        <img
          src={
            selectedCover ||
            "https://res.cloudinary.com/dlnhmifmn/image/upload/v1771801386/pexels-joyston-judah-331625-933054_zhhyk7.jpg"
          }
          alt="cover"
          className="w-full h-full object-cover cursor-pointer"
          onClick={() =>
            handlePreview([
              selectedCover ||
                "https://res.cloudinary.com/dlnhmifmn/image/upload/v1771801386/pexels-joyston-judah-331625-933054_zhhyk7.jpg",
            ])
          }
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectedImg || "/default.jpg"}
              alt="avatar"
              className="size-32 rounded-full object-cover border-4 cursor-pointer"
              onClick={() => handlePreview([selectedImg || "/default.jpg"])}
            />
            {editMode && (
              <label
                htmlFor="image"
                className={`absolute right-0 bottom-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200
                ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
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
            )}
          </div>
        </div>
        {editMode && (
          <label
            htmlFor="cover"
            className={`absolute right-3 bottom-3 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200
              ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
          >
            <Camera className="w-5 h-5 text-base-200" />

            <input
              type="file"
              id="cover"
              className="hidden"
              accept="image/*"
              onChange={handleCoverChange}
              disabled={!editMode || isUpdatingProfile}
            />
          </label>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="form-control">
          <label className="flex gap-1 items-center mb-2">
            <Pen className="size-5 text-base-content/40" />
            <span className="label-text font-medium"> bio</span>
          </label>

          <div className="relative">
            <input
              type="text"
              className="input input-bordered w-full "
              placeholder="Enter your bio"
              value={bio}
              disabled={!editMode}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
        </div>
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

        <div className="form-control">
          <label className="flex gap-2 items-center mb-2">
            <Mail className="size-5 text-base-content/40" />
            <span className="label-text font-medium"> Email</span>
          </label>

          <div className="relative">
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
            className="btn btn-primary mt-1"
          >
            {isUpdatingProfile ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
}
