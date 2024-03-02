import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import supabase from 'config/supabaseClient';
import toast from 'react-hot-toast';
import backgroundAuth from '../../assets/img/avatars/background.png';

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirPassword, setShowConfirPassword] = useState(false);

  const [formData, setFormData] = useState({
    namalengkap: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmationPassword = () => {
    setShowConfirPassword((prevShowConfirPassword) => !prevShowConfirPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const SignUp = async (e) => {
    e.preventDefault();
    if (formData.confirmPassword !== formData.password) {
      toast.error('konfirmasi password harus sama.');
      return;
    }
    const loadingToast = toast.loading('Memproses pendaftaran...');
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      setTimeout(async () => {
        toast.dismiss(loadingToast);
        if (data?.session !== null) {
          toast.success('Pendaftaran akun Berhasil', {
            duration: 1900,
          });
          setFormData({
            email: '',
            password: '',
          });
          navigate('/signin');
          return data;
        } else if (data?.session === null) {
          toast.error('User sudah terdaftar');
        } else {
          toast.error(error.message);
        }
        if (error) toast.error(error.message);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="flex flex-col md:flex-row h-screen items-center">
      <div className="flex bg-white w-full md:max-w-md lg:max-w-full md:mx-0 md:w-1/2 xl:w-1/2 h-screen px-6 lg:px-16 xl:px-12">
        <div className="w-full mt-8 px-14 h-100">
          <h1 className="text-xl flex justify-center text-black md:text-2xl font-bold leading-tight">
            Daftar akun
          </h1>
          <form className="mt-6" onSubmit={SignUp}>
            <div className="mt-2">
              <label className="flex justify-start text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Masukkan email"
                className="w-full text-black px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoFocus
                autoComplete="on"
                required
              />
            </div>
            <div className="mt-2">
              <label className="flex justify-start text-gray-700">
                Kata sandi
              </label>
              <div className="relative">
                <input
                  type={showConfirPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="Masukkan kata sandi"
                  minLength="6"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full text-black px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 mt-2 flex items-center cursor-pointer"
                  onClick={toggleConfirmationPassword}
                >
                  {showConfirPassword ? (
                    <AiOutlineEye className="text-gray-500 w-5 h-5" />
                  ) : (
                    <AiOutlineEyeInvisible className="text-gray-500 w-5 h-5" />
                  )}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <label className="flex justify-start text-gray-700">
                Konfirmasi kata sandi
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Masukkan ulang kata sandi"
                  minLength="6"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full text-black px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 mt-2 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <AiOutlineEye className="text-gray-500 w-5 h-5" />
                  ) : (
                    <AiOutlineEyeInvisible className="text-gray-500 w-5 h-5" />
                  )}
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-8 block bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white font-semibold rounded-lg px-4 py-3"
            >
              Daftar
            </button>
          </form>
          <p className="mt-2 text-black">
            Sudah punya akun?{' '}
            <Link
              to="/signin"
              className="text-blue-500 cursor-pointer hover:text-blue-700 font-semibold"
            >
              {'  '}Masuk
            </Link>
          </p>
        </div>
      </div>
      <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-1/2 h-screen">
        <img
          src={backgroundAuth}
          alt="banner-auth.jpg"
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
};

export default SignUp;
