import { useState, useRef } from 'react';
import Breadcrumb from 'components/Breadcrumbs/Breadcrumb';
import profilePicture from 'assets/img/avatars/avatar.png';
import { useProfileStore } from 'store/Profile/StoreProfile';
import { useQueryClient } from '@tanstack/react-query';
import supabase from 'config/supabaseClient';
import toast from 'react-hot-toast';
import { IoImageOutline } from 'react-icons/io5';
import Card from 'components/Card';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { profile } = useProfileStore();
  const inputImageRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [imageURL, setImageUrl] = useState(null);
  const [userId, setUserId] = useState(profile?.user_id);
  const [showImageSRC, setShowImageSRC] = useState(null);
  const [ImageSRC, setImageSRC] = useState(null);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const imageSrc = profile?.profile_picture
    ? `data:image/png;base64,${profile.profile_picture}`
    : profilePicture;

  const [formData, setFormData] = useState({
    username: '',
    nama_lengkap: '',
    email: '',
    no_telepon: '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsFormChanged(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setIsImageChanged(true);
    if (file) {
      setUserId(profile?.user_id);
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
      const extension = file.name.split('.').pop().toLowerCase();
      if (allowedExtensions.includes(extension)) {
        const maxSize = 3 * 1024 * 1024;
        if (file.size <= maxSize) {
          setImageUrl(file);
          setIsFormChanged(true);
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            const imageData = dataUrl.split(',')[1];
            setShowImageSRC(dataUrl);
            setImageSRC(imageData);
          };
          reader.readAsDataURL(file);
        } else {
          toast.error('Ukuran file melebihi batas maksimal (3MB).');
          e.target.value = '';
          setImageUrl('');
          setShowImageSRC('');
        }
      } else {
        toast.error('Hanya gambar dengan extension yang diizinkan.');
        e.target.value = '';
        setImageUrl('');
        setShowImageSRC('');
      }
    } else {
      setImageUrl('');
      setShowImageSRC('');
    }
  };

  const handleImageClick = () => {
    inputImageRef.current.click();
    setIsImageChanged(true);
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await supabase
        .schema('users')
        .from('users')
        .update({
          username: formData.username || profile.username,
          nama_lengkap: formData.nama_lengkap || profile.nama_lengkap,
          email: formData.email || profile.email,
          no_telepon: formData.no_telepon || profile.no_telepon,
        })
        .eq('user_id', profile.user_id);
      queryClient.invalidateQueries({
        queryKey: ['profileData'],
      });
      toast.success('Foto profil berhasil diupdate');
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const handleEditProfilePicture = async (e) => {
    e.preventDefault();
    try {
      const { data } = await supabase
        .schema('users')
        .from('users')
        .update({
          profile_picture: ImageSRC,
        })
        .eq('user_id', userId);
      queryClient.invalidateQueries({
        queryKey: ['profileData'],
      });
      toast.success('Foto profil berhasil diupdate');
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProfilePicture = async (e) => {
    e.preventDefault();
    try {
      const { data } = await supabase
        .schema('users')
        .from('users')
        .update({
          profile_picture: null,
        })
        .eq('user_id', userId);
      queryClient.invalidateQueries({
        queryKey: ['profileData'],
      });
      setShowImageSRC('');
      toast.success('Foto profil berhasil diupdate');
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  function handleBack(e) {
    e.preventDefault();
    navigate(-1);
  }

  return (
    <div className="mx-auto max-w-270">
      <div className="flex justify-end">
        <Breadcrumb pageName="Settings" />
      </div>
      <div className="grid grid-cols-5 mt-2 gap-4">
        <div className="col-span-5 xl:col-span-2">
          <Card extra="rounded-lg border dark:border-gray-800 bg-white shadow-default">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Foto profil
              </h3>
            </div>
            <div className="p-7">
              <form action="#">
                <div className="mb-4 flex flex-col items-center gap-3">
                  <div className="relative">
                    <img
                      src={showImageSRC || imageSrc}
                      alt="foto_profile.png"
                      className="rounded-full w-24 h-24"
                    />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      ref={inputImageRef}
                      accept=".jpg,.jpeg,.png,.gif,.bmp,.svg"
                    />
                    <button
                      onClick={handleImageClick}
                      className="p-1 bg-white dark:bg-graydark shadow absolute bottom-0 right-0 rounded-full"
                    >
                      <IoImageOutline className="size-5" />
                    </button>
                  </div>
                  <div>
                    <span className="text-black flex justify-center dark:text-white">
                      Edit profil anda
                    </span>
                    <span className="flex mt-4 gap-6">
                      <button
                        className="text-sm bg-red-50 hover:bg-red-100 dark:hover:bg-red-50 text-red-500 rounded-lg py-1 px-2 hover:text-red-600"
                        onClick={handleDeleteProfilePicture}
                      >
                        Delete
                      </button>
                      <button
                        className={`${
                          isImageChanged
                            ? 'cursor-pointer bg-blue-500 hover:bg-blue-600'
                            : 'cursor-not-allowed dark:bg-graydark bg-gray-500'
                        } text-sm  dark:bg-blue-600 text-white rounded-lg py-1 px-2 hover:text-white`}
                        onClick={handleEditProfilePicture}
                        disabled={!isImageChanged}
                      >
                        Update
                      </button>
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </Card>
        </div>
        <div className="col-span-5 xl:col-span-3">
          <Card extra={`rounded-lg border dark:border-gray-800 bg-white`}>
            <div className="border-b py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Informasi akun
              </h3>
            </div>
            <div className="p-7">
              <form>
                <div className="mb-3 flex flex-col gap-4 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="nama_lengkap"
                    >
                      Nama lengkap
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke py-2 px-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="nama_lengkap"
                        id="nama_lengkap"
                        value={formData.nama_lengkap || profile?.nama_lengkap}
                        onChange={handleFormChange}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="no_telepon"
                    >
                      Nomor telepon
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-2 px-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="no_telepon"
                      id="no_telepon"
                      value={formData.no_telepon || profile?.no_telepon}
                      onChange={handleFormChange}
                      placeholder="Masukkan Nomor telepon"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-2 px-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email || profile?.email}
                      onChange={handleFormChange}
                      placeholder="Masukkan email"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-2 px-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username || profile?.username}
                    onChange={handleFormChange}
                    placeholder="Masukkan username"
                  />
                </div>
                <div className="flex justify-end mt-4 gap-4">
                  <button
                    className="flex justify-center rounded border border-red-500 py-1 px-6 font-medium text-red-500 hover:shadow-1 dark:bg-red-700 dark:hover:bg-red-800 dark:border-red-100 dark:text-red-100"
                    onClick={handleBack}
                  >
                    Batal
                  </button>
                  <button
                    className={`flex justify-center rounded  text-gray-100 py-1 px-6 font-medium text-gray hover:bg-opacity-90 ${
                      isFormChanged
                        ? 'cursor-pointer bg-blue-500'
                        : 'cursor-not-allowed dark:bg-graydark bg-gray-500'
                    }`}
                    type="submit"
                    onClick={handleEditProfile}
                    disabled={!isFormChanged}
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
