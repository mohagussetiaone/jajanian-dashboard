import { useRef, useState } from 'react';
import supabase from 'config/supabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import BGGradient from './BGGradient';
import Breadcrumb from 'components/Breadcrumbs/Breadcrumb';
import profile from 'assets/img/avatars/avatar.png';
import { IoImageOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

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
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

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

  const tabContentData = {
    1: {
      title: 'Profile',
      content: (
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
              <p className="font-semibold dark:text-gray-500">Nama Lengkap</p>
              <p className="text-sm font-medium text-navy-700 dark:text-white">
                {data.fullname}
              </p>
            </div>
            <div className="rounded-lg bg-gray-200 px-3 md:py-4 dark:bg-boxdark-2 dark:shadow-none">
              <p className="font-semibold dark:text-gray-500">Email</p>
              <p className="text-sm font-medium text-navy-700 dark:text-white">
                {data.email}
              </p>
            </div>
            <div className="rounded-lg bg-gray-200 px-3 md:py-4 dark:bg-boxdark-2 dark:shadow-none">
              <p className="font-semibold dark:text-gray-500">Nomor Telepon</p>
              <p className="text-sm font-medium text-navy-700 dark:text-white">
                {data.phone}
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
      ),
    },
    2: {
      title: 'Password',
      content: (
        <div className="w-full h-full p-3">
          <h3>Password tab</h3>
        </div>
      ),
    },
    3: {
      title: 'Notifikasi',
      content: (
        <div className="w-full h-full p-3">
          <h3>Notifikasi tab</h3>
        </div>
      ),
    },
  };

  return (
    <>
      <Breadcrumb pageName="Settings" className="flex justify-end" />
      <div>
        <div className="flex h-32 w-full bg-cover">
          <div className="w-full h-full overflow-hidden">
            <BGGradient />
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row -mt-8 px-6 justify-between w-full h-full">
        <div className="flex relative items-center">
          <img
            className="h-auto w-24 md:w-28 rounded-full bg-white/70 border-gray-100 border-4"
            src={showImageSRC || imageSrc}
            alt="profile.jpg"
          />
          <div className="absolute">
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              ref={inputImageRef}
              accept=".jpg,.jpeg,.png,.gif,.bmp,.svg"
            />
            <button
              onClick={handleImageClick}
              className="p-1 bg-white dark:bg-graydark dark:text-gray-100 border border-gray-100 shadow absolute top-4  -right-24 md:-right-28 rounded-full"
            >
              <IoImageOutline className="size-5" />
            </button>
          </div>
          <div className="ml-4 mt-4 flex flex-col justify-between">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              {data.fullname}
            </div>
            <div className="space-y-2">
              <button className="text-navy-700 dark:text-white">
                {data.email}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Link
            to="/pengaturan"
            className="text-sm text-black dark:text-white border-[1px] border-gray-600 rounded-lg py-1 px-2"
          >
            Edit Profile
          </Link>
        </div>
      </div>
      <div className="border-b mt-6 px-6 border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-2" aria-label="Tabs" role="tablist">
          {[1, 2, 3].map((tabNumber) => (
            <button
              key={tabNumber}
              type="button"
              className={`${
                activeTab === tabNumber
                  ? 'bg-gray-100 text-blue-800 dark:bg-gray-800 dark:text-white'
                  : 'bg-gray-50 text-gray-500 dark:bg-navy-600 dar:text-white'
              } -mb-px py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium text-center border rounded-t-md hover:text-gray-700 dark:bg-gray-700 dark:border-gray-700 dark:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 active`}
              id={`card-type-tab-item-${tabNumber}`}
              data-hs-tab={`#card-type-tab-${tabNumber}`}
              aria-controls={`card-type-tab-${tabNumber}`}
              role="tab"
              onClick={() => handleTabClick(tabNumber)}
            >
              {tabContentData[tabNumber].title}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-3">{tabContentData[activeTab].content}</div>
    </>
  );
};

export default BannerProfile;
