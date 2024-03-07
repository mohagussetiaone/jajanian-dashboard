import { useEffect, useState } from 'react';
import { redirect, json, useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import { remove } from 'store/Local/Forage';
import toast from 'react-hot-toast';
import supabase from 'config/supabaseClient';

export const authLoader = async ({ request }) => {
  const authToken = await localforage.getItem('userTokens');
  const url = new URL(request.url);

  if (url.pathname === '/') {
    return redirect('/dashboard');
  }

  // Redirect to '/home' if the user is trying to access '/login' or '/signup' and a token exists
  if (
    authToken &&
    (url.pathname === '/' ||
      url.pathname === '/signin' ||
      url.pathname === '/signup' ||
      url.pathname === '/reset-password')
  ) {
    return redirect('/dashboard');
  }

  // Redirect to '/login' if there's no token and the user is not trying to access '/login'
  if (
    !authToken &&
    url.pathname !== '/signin' &&
    url.pathname !== '/signup' &&
    url.pathname !== '/reset-password'
  ) {
    return redirect('/signin');
  }

  // if (!authToken) {
  //   return redirect("/");
  // }

  // Daftar rute yang sah
  // const validRoutes = ["/home", "/products", "/detail-product", "/checkout", "/about", "/profile", "/settings", "/history", "/signin", "/signup", "/reset-password", "/cart"];
  // if (!validRoutes.includes(url.pathname)) {
  //   // Jika rute tidak ada dalam daftar, redirect ke halaman 404
  //   return redirect("/404");
  // }

  // Return the authToken for other routes
  return json({ authToken });
};

export const useAuthCheck = () => {
  const [isValid, setIsValid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        console.log('sesi login', data);
        if (error) throw new Error(error.message);
        if (data && data.session !== null) {
          navigate('/dashboard');
        }
      } catch (error) {
        toast.error('Token Kadaluarsa, silahkan login kembali', {
          duration: 2350,
        });
        navigate('/signin');
      }
    };
    checkAuth();
  }, [navigate]);
  return isValid;
};

export function useAuthValidation(isValid) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthValidation = async () => {
      if (isValid?.data === false) {
        await remove('userTokens');
        toast.error('Token Kadaluarsa, silahkan login kembali', {
          duration: 2350,
        });
        setTimeout(() => {
          navigate({ pathname: '/signin' });
          setTimeout(() => {
            navigate(0);
          }, [1500]);
          navigate(0);
        }, 2550);
      }
    };
    handleAuthValidation();
  }, [isValid, navigate]);
}
