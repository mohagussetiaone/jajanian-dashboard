import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import supabase from 'config/supabaseClient';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const backgroundImageStyle = {
    backgroundImage:
      'url(https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: '0.9',
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${import.meta.env.VITE_DEV_ORIGIN}password-confirmation`,
      });
      if (error) {
        toast.error('Could not authenticate user');
      } else {
        navigate('/email-send');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section
      className="antialiased py-24 h-screen bg-slate-200"
      style={backgroundImageStyle}
    >
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow shadow-slate-300">
        <h1 className="text-4xl flex justify-start font-medium text-black">
          Reset password
        </h1>
        <p className="text-slate-500 flex justify-start">
          Fill up the form to reset the password
        </p>
        <form action="" className="my-10">
          <div className="flex flex-col space-y-5">
            <label htmlFor="email">
              <p className="font-medium flex justify-start text-slate-700 pb-2">
                Email address <span className="text-red-500"> *</span>
              </p>
              <input
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email Address"
                className="w-full text-black px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoFocus
                autoComplete="on"
                required
              />
            </label>
            <button
              className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center"
              onClick={handleResetPassword}
            >
              <span>Konfirmasi</span>
            </button>
            <div className="text-center flex justify-end">
              <a
                href="#"
                className="font-medium inline-flex space-x-1 items-center"
              >
                <Link to="/signin" className="text-gray-800">
                  {'  '}
                  <span className="text-indigo-600 cursor-pointer hover:text-indigo-600text-md">
                    {'  '}Sign in
                  </span>
                </Link>
                <span>
                  <BsBoxArrowUpRight className="ml-1 text-indigo-600" />
                </span>
              </a>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
