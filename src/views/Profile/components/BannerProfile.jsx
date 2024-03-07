import { useRef, useState } from 'react';
import supabase from 'config/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import BGGradient from './BGGradient';
import Breadcrumb from 'components/Breadcrumbs/Breadcrumb';
import profile from 'assets/img/avatars/avatar.png';
import { IoImageOutline } from 'react-icons/io5';
import dayjs from 'dayjs';

const BannerProfile = ({ data }) => {
  const inputImageRef = useRef(null);
  const [imageURL, setImageUrl] = useState(null);
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState(data?.user_id);
  const [showImageSRC, setShowImageSRC] = useState(null);
  const [ImageSRC, setImageSRC] = useState(null);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const imageSrc = data?.profile_picture
    ? `data:image/png;base64,${data.profile_picture}`
    : profile;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserId(data?.user_id);
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

  return (
    <>
      <div className="flex justify-end px-4">
        <Breadcrumb pageName="Settings" />
      </div>
      <div className="items-center w-full h-full px-[16px] bg-cover">
        <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover">
          <div className="w-full h-full rounded-xl overflow-hidden">
            <BGGradient />
          </div>
          <div className="absolute -bottom-12 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
            <img
              className="h-full w-full rounded-full bg-white/70"
              src={showImageSRC || imageSrc}
              alt="profile.jpg"
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
        </div>
        <div className="mt-16 flex flex-col items-center">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            {data?.name}
          </h4>
        </div>
        <div className="flex justify-center gap-4 md:!gap-14">
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {dayjs(data.created_at).format('DD/MM/YYYY')}
            </p>
            <p className="text-sm font-normal text-gray-600">
              Tanggal aktivasi
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {data.active !== null ? 'Active' : 'Inactive'}
            </p>
            <p className="text-sm font-normal text-gray-600">Status Active</p>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-3">
        <div className="flex ">
          <div className="mt-2 mb-2 md:mb-4 w-full">
            <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
              Informasi Pribadi
            </h4>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:px-2">
          <div className="rounded-lg bg-gray-200 px-3 md:py-4 dark:bg-boxdark-2 dark:shadow-none">
            <p className="font-semibold">Nama Lengkap</p>
            <p className="text-sm font-medium text-navy-700 dark:text-white">
              {data?.nama_lengkap}
            </p>
          </div>
          <div className="rounded-lg bg-gray-200 px-3 md:py-4 dark:bg-boxdark-2 dark:shadow-none">
            <p className="font-semibold">Email</p>
            <p className="text-sm font-medium text-navy-700 dark:text-white">
              {data?.email}
            </p>
          </div>
          <div className="rounded-lg bg-gray-200 px-3 md:py-4 dark:bg-boxdark-2 dark:shadow-none">
            <p className="font-semibold">Nomor Telepon</p>
            <p className="text-sm font-medium text-navy-700 dark:text-white">
              {data?.no_telepon}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="w-[250px] rounded-lg text-sm p-1 bg-blue-500 dark:bg-blue-700 dark:text-white hover:bg-blue-700 text-white"
            onClick={handleEditProfilePicture}
          >
            Simpan perubahan
          </button>
        </div>
      </div>
    </>
  );
};

export default BannerProfile;
