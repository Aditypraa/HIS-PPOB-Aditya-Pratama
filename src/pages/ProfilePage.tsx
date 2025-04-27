/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import { Mail, User, UploadCloud, Edit2, LogOut } from "lucide-react";
import Button from "../components/common/Button";
import InputField from "../components/common/InputField";
import BottomNav from "../components/layout/BottomNav";
import Navbar from "../components/layout/Navbar";
import apiService from "../api/apiService";

function ProfilePage() {
  const { state, dispatch } = useContext(AppContext);
  const { user, isSubmitting } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.profile_image || null
  );
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const logout = () => dispatch({ type: "LOGOUT" });

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      if (!profileImageFile) setImagePreview(user.profile_image);
    }
  }, [user, profileImageFile]);

  const resetForm = () => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
  };

  const handleEditToggle = () => {
    if (isEditing) resetForm();
    setIsEditing(!isEditing);
  };

  const handleProfileUpdate = async (e: any) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      dispatch({
        type: "SET_ERROR",
        payload: { message: "Nama depan dan belakang harus diisi." },
      });
      return;
    }

    dispatch({ type: "SET_SUBMITTING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    try {
      const response = await apiService.updateProfile(firstName, lastName);
      dispatch({ type: "SET_USER", payload: response.data });
      setIsEditing(false);
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      handleApiError(error, "Gagal memperbarui profil.");
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setImageError("");

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setImageError("Format gambar harus JPEG atau PNG.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setImageError("Ukuran gambar maksimal 1MB.");
      return;
    }

    setProfileImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    dispatch({ type: "CLEAR_ERROR" });
  };

  const handleImageUpload = async () => {
    if (!profileImageFile) {
      setImageError("Pilih file gambar terlebih dahulu.");
      return;
    }

    dispatch({ type: "SET_SUBMITTING", payload: true });
    dispatch({ type: "CLEAR_ERROR" });

    try {
      const response = await apiService.updateProfileImage(profileImageFile);
      dispatch({ type: "SET_USER", payload: response.data });
      setProfileImageFile(null);
      alert("Foto profil berhasil diperbarui!");
    } catch (error) {
      handleApiError(error, "Gagal mengupload gambar.");
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  const handleApiError = (error: any, defaultMessage: string) => {
    console.error(defaultMessage, error);
    dispatch({ type: "SET_ERROR", payload: error });
    if (error?.status === 401 || error?.status === 108) setTimeout(logout, 100);
  };

  const defaultAvatar = `https://placehold.co/100x100/f87171/ffffff?text=${
    user?.first_name?.charAt(0) || "A"
  }`;

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Navbar
        title="Akun Saya"
        showBackButton
        onBackButtonClick={() => navigate("/")}
      />
      <main className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-3">
              <img
                src={imagePreview || defaultAvatar}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-red-100 shadow-md"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = defaultAvatar)
                }
              />
              <input
                type="file"
                accept="image/jpeg, image/png"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition duration-150"
                aria-label="Ubah Foto Profil"
                disabled={isSubmitting}
              >
                <UploadCloud size={16} />
              </button>
            </div>
            {imageError && (
              <p className="text-red-500 text-xs mt-1">{imageError}</p>
            )}
            {profileImageFile && !imageError && (
              <Button
                onClick={handleImageUpload}
                isLoading={isSubmitting}
                disabled={isSubmitting}
                variant="primary"
                size="small"
                className="mt-2"
              >
                Simpan Foto
              </Button>
            )}
            <h2 className="text-xl font-semibold mt-3">{`${
              user?.first_name || ""
            } ${user?.last_name || ""}`}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <InputField
                icon={Mail}
                type="email"
                value={user?.email || ""}
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Depan
              </label>
              <InputField
                icon={User}
                type="text"
                placeholder="Nama Depan"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isEditing || isSubmitting}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Belakang
              </label>
              <InputField
                icon={User}
                type="text"
                placeholder="Nama Belakang"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isEditing || isSubmitting}
              />
            </div>
            {isEditing ? (
              <div className="flex gap-3 mb-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleEditToggle}
                  disabled={isSubmitting}
                  fullWidth
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Simpan Perubahan
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleEditToggle}
                variant="secondary"
                fullWidth
                className="mb-4"
                disabled={isSubmitting}
              >
                <Edit2 size={16} className="mr-2" /> Edit Profil
              </Button>
            )}
          </form>
          <Button
            onClick={logout}
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </div>
      </main>
      <BottomNav activePage="profile" navigate={(path) => navigate(path)} />
    </div>
  );
}

export default ProfilePage;
