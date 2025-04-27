import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { Mail, User, UploadCloud, Edit2, LogOut } from 'lucide-react';
import Button from '../components/common/Button';
import InputField from '../components/common/InputField';
import BottomNav from '../components/layout/BottomNav';
import Navbar from '../components/layout/Navbar';
import apiService from '../api';

// Profile Page
function ProfilePage() {
    const { state, dispatch } = useContext(AppContext);
    const { user, isSubmitting } = state;
    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(user?.profile_image || null);
    const [imageError, setImageError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const logout = () => dispatch({ type: 'LOGOUT' });

    // Update local state if user context changes
    useEffect(() => {
        if (user) {
            setFirstName(user.first_name || '');
            setLastName(user.last_name || '');
            // Update preview only if it's not showing a local file preview
            if (!profileImageFile) {
                setImagePreview(user.profile_image);
            }
        }
    }, [user, profileImageFile]); // Depend on user and profileImageFile

    const handleEditToggle = () => {
        if (isEditing) {
            // Reset fields if cancelling edit
            setFirstName(user?.first_name || '');
            setLastName(user?.last_name || '');
        }
        setIsEditing(!isEditing);
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!firstName.trim() || !lastName.trim()) {
            dispatch({ type: 'SET_ERROR', payload: { message: 'Nama depan dan belakang harus diisi.' } });
            return;
        }

        dispatch({ type: 'SET_SUBMITTING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });
        try {
            const response = await apiService.updateProfile(firstName, lastName);
            dispatch({ type: 'SET_USER', payload: response.data }); // Update user context
            setIsEditing(false); // Exit edit mode on success
            alert('Profil berhasil diperbarui!'); // Simple success feedback
        } catch (error) {
            console.error("Update Profile API call failed:", error);
            dispatch({ type: 'SET_ERROR', payload: error });
            if (error?.status === 401 || error?.status === 108) {
                setTimeout(logout, 100);
            }
        } finally {
            dispatch({ type: 'SET_SUBMITTING', payload: false });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageError('');

        if (!file) {
            return;
        }

        // Check file type
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
            setImageError('Format gambar harus JPEG atau PNG.');
            return;
        }

        // Check file size (max 1MB)
        if (file.size > 1024 * 1024) {
            setImageError('Ukuran gambar maksimal 1MB.');
            return;
        }

        setProfileImageFile(file);

        // Create a preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        dispatch({ type: 'CLEAR_ERROR' }); // Clear previous errors
    };

    const handleImageUpload = async () => {
        if (!profileImageFile) {
            setImageError('Pilih file gambar terlebih dahulu.');
            return;
        }

        dispatch({ type: 'SET_SUBMITTING', payload: true });
        dispatch({ type: 'CLEAR_ERROR' });
        try {
            const response = await apiService.updateProfileImage(profileImageFile);
            dispatch({ type: 'SET_USER', payload: response.data }); // Update user with new image URL
            setProfileImageFile(null); // Clear selected file after upload
            setImageError('');
            // Preview will update via useEffect dependency on user
            alert('Foto profil berhasil diperbarui!');
        } catch (error) {
            console.error("Update Profile Image API call failed:", error);
            dispatch({ type: 'SET_ERROR', payload: error });
            setImageError(error.message || 'Gagal mengupload gambar.');
            if (error?.status === 401 || error?.status === 108) {
                setTimeout(logout, 100);
            }
        } finally {
            dispatch({ type: 'SET_SUBMITTING', payload: false });
        }
    };


    // Default avatar if no image
    const defaultAvatar = `https://placehold.co/100x100/f87171/ffffff?text=${user?.first_name ? user.first_name.charAt(0) : 'A'}`;

    return (
        <div className="min-h-screen bg-gray-100 pb-20">
            {/* Use the reusable Navbar */}
            <Navbar
                title="Akun Saya"
                showBackButton={true}
                onBackButtonClick={() => navigate('/')}
            />

            {/* Main Content */}
            <main className="container mx-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-3">
                            <img
                                src={imagePreview || defaultAvatar}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-red-100 shadow-md"
                                onError={(e) => e.target.src = defaultAvatar} // Fallback on error
                            />
                            {/* Hidden file input */}
                            <input
                                type="file"
                                accept="image/jpeg, image/png"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            {/* Upload Button Overlay */}
                            <button
                                onClick={() => fileInputRef.current?.click()} // Trigger file input click
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

                        {profileImageFile && !imageError && ( // Show upload button only if a new valid file is selected
                            <Button
                                onClick={handleImageUpload}
                                isLoading={isSubmitting && profileImageFile} // Show loading only for image upload
                                disabled={isSubmitting}
                                variant="primary"
                                size="small"
                                className="mt-2"
                            >
                                Simpan Foto
                            </Button>
                        )}

                        <h2 className="text-xl font-semibold mt-3">{user?.first_name} {user?.last_name}</h2>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>

                    {/* Profile Details Form */}
                    <form onSubmit={handleProfileUpdate}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <InputField icon={Mail} type="email" value={user?.email || ''} disabled />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Depan</label>
                            <InputField
                                icon={User} type="text" placeholder="Nama Depan"
                                value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                disabled={!isEditing || isSubmitting}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Belakang</label>
                            <InputField
                                icon={User} type="text" placeholder="Nama Belakang"
                                value={lastName} onChange={(e) => setLastName(e.target.value)}
                                disabled={!isEditing || isSubmitting}
                            />
                        </div>

                        {isEditing && (
                            <div className="flex gap-3 mb-6">
                                <Button type="button" variant="secondary" onClick={handleEditToggle} disabled={isSubmitting} fullWidth>
                                    Batal
                                </Button>
                                <Button type="submit" fullWidth isLoading={isSubmitting && !profileImageFile} disabled={isSubmitting}>
                                    Simpan Perubahan
                                </Button>
                            </div>
                        )}
                    </form>

                    {!isEditing && (
                        <Button onClick={handleEditToggle} variant="secondary" fullWidth className="mb-4" disabled={isSubmitting}>
                            <Edit2 size={16} className="mr-2" /> Edit Profil
                        </Button>
                    )}

                    <Button onClick={logout} variant="primary" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
                        <LogOut size={16} className="mr-2" /> Logout
                    </Button>
                </div>
            </main>

            <BottomNav activePage="profile" navigate={(path) => navigate(path)} />
        </div>
    );
}

export default ProfilePage;