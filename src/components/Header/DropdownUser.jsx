import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from 'config/supabaseClient';
import { remove } from 'store/Local/Forage';
import {
  RiUser3Line,
  RiContactsBookLine,
  RiSettings4Line,
} from 'react-icons/ri';
import UserOne from '../../images/user/user-01.png';
import ModalLogout from './ModalLogout';
import toast from 'react-hot-toast';

const DropdownUser = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalLogout, setModalLogout] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const modalLogoutClose = () => {
    setDropdownOpen(false);
    setModalLogout(false);
  };

  const logout = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signOut();
      remove('userTokens');
      navigate('/signin');
      if (error) {
        toast.error('Logout gagal. silahkan coba kembali.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative my-1">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block font-medium text-black dark:text-white">
            Thomas Anree
          </span>
          <span className="block text-xs dark:text-white">Admin</span>
        </span>

        <span className="h-10 w-10 rounded-full">
          <img src={UserOne} alt="User" />
        </span>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute rounded-lg right-0 mt-4 pt-4 flex w-52 flex-col border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? 'block' : 'hidden'
        }`}
      >
        <ul className="flex flex-col gap-5 border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              to="/profile"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <RiUser3Line className="w-5 h-5" />
              My Profile
            </Link>
          </li>
          <li>
            <Link
              to="#"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <RiContactsBookLine className="w-5 h-5" />
              My Contacts
            </Link>
          </li>
          <li>
            <Link
              to="/pages/settings"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <RiSettings4Line className="w-5 h-5" />
              Account Settings
            </Link>
          </li>
        </ul>
        <button
          className="flex justify-center border-t mt-4 items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out text-red-400 hover:text-red-600 hover:bg-red-100/50 lg:text-base"
          onClick={() => setModalLogout(true)}
        >
          Log Out
        </button>
        {modalLogout && (
          <ModalLogout
            modalLogout={modalLogout}
            modalLogoutClose={modalLogoutClose}
            logout={logout}
          />
        )}
      </div>
    </div>
  );
};

export default DropdownUser;
