import DropdownMessage from './DropdownMessage';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import DarkModeSwitcher from './DarkModeSwitcher';
import { IoMdSearch } from 'react-icons/io';
import { HiMenu } from 'react-icons/hi';

const Header = ({ onOpenSidenav }) => {
  return (
    <header className="sticky top-0 z-51 flex w-full bg-white drop-shadow-1 dark:bg-navy-800 dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <span
            className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden "
            onClick={onOpenSidenav}
          >
            <HiMenu className="h-[24px] w-[24px] text-gray-700" />
          </span>
        </div>
        <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative bg-gray-100 dark:bg-navy-700 rounded-lg p-2">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <IoMdSearch className="w-6 h-6 ml-2 text-gray-500" />
              </button>
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-8 text-md pr-4 text-gray-400 focus:outline-none dark:text-white xl:w-[200px]"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <DarkModeSwitcher />
            <DropdownNotification />
            <DropdownMessage />
          </ul>
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
