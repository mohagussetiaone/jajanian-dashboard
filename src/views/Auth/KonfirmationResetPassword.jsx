import { useState } from 'react';
import supabase from 'config/supabaseClient';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Jajanian from 'assets/logo/Jajanian.png';
import resetPasswordSuccess from '../../assets/img/auth/resetPasswordSuccess.png';
import BannerImage from '../../assets/img/avatars/banner.png';

const KonfirmasiResetPassword = () => {
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!formData.password || !formData.confirmPassword) {
      toast.error('Email dan Password harus diisi');
      return;
    }
    if (formData.confirmPassword !== formData.password) {
      toast.error('konfirmasi password harus sama.');
      return;
    }
    const loadingToast = toast.loading('Memproses ganti password...');
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: formData.password,
      });
      setTimeout(async () => {
        toast.dismiss(loadingToast);
        if (data.user !== null) {
          setIsResetSuccess(true);
          toast.success('Password anda telah diperbarui');
        } else {
          toast.error('Password anda gagal diperbarui');
        }
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section
      className="bg-gray-50 dark:bg-gray-900"
      style={{
        backgroundImage: `url(${BannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!isResetSuccess && (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
            <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Reset kata sandi
            </h2>
            <form
              className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={changePassword}
            >
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Kata sandi baru
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan kata sandi"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Konfirmasi kata sandi
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Masukkan ulang kata sandi"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    aria-describedby="newsletter"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="newsletter"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    Terima{' '}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Syarat dan ketentuan
                    </a>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Reset password
              </button>
            </form>
          </div>
        </div>
      )}
      {isResetSuccess && (
        <div className="w-full mt-4 p-4 text-center bg-white rounded-lg sm:p-8 dark:!bg-navy-700 dark:border-gray-700">
          <div className="flex justify-center items-center">
            <img
              src={resetPasswordSuccess}
              className="max-w-[300px]"
              alt="alreadySend.jpg"
            />
          </div>
          <h5 className="mb-2 font-bold text-gray-900 dark:text-white mt-4 text-xl">
            Reset password telah berhasil
          </h5>
          <div className="flex justify-center flex-col gap-4">
            <h4>Silahkan masuk ke akun anda dengan password yang baru</h4>
            <div className="flex justify-center text-center mt-2">
              <Link
                to="/signin"
                className="bg-blue-500 w-24 text-white p-2 rounded-lg"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default KonfirmasiResetPassword;
