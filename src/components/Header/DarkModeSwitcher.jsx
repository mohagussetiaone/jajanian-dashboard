import useDarkModeStore from 'store/DarkMode';
import { MdOutlineWbSunny } from 'react-icons/md';
import { IoMoonOutline } from 'react-icons/io5';

const DarkModeSwitcher = () => {
  const { darkMode, toggleDarkMode } = useDarkModeStore();

  return (
    <li>
      <div className="cursor-pointer text-gray-600" onClick={toggleDarkMode}>
        {darkMode ? (
          <IoMoonOutline className="h-[22px] w-[22px] text-gray-800 dark:text-white" />
        ) : (
          <MdOutlineWbSunny className="h-[22px] w-[22px] text-gray-800 dark:text-white" />
        )}
      </div>
    </li>
  );
};

export default DarkModeSwitcher;
