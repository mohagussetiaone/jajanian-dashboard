import DropdownMessage from './DropdownMessage';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import DarkModeSwitcher from './DarkModeSwitcher';
import { IoMdSearch } from 'react-icons/io';
import { HiMenu } from 'react-icons/hi';
import supabase from 'config/supabaseClient';
import { useProfileStore } from 'store/Profile/StoreProfile';
import { useQuery } from '@tanstack/react-query';

const Header = ({ onOpenSidenav }) => {
  const { profile, setProfile } = useProfileStore();

  const { data: sessionData, error: sessionError } = useQuery({
    queryKey: ['sessionData'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
        throw new Error('Error fetching session');
      }
      return data;
    },
  });

  console.log('sessionData', sessionData);
  console.log('sessionError', sessionError);

  const { error: profileError } = useQuery({
    queryKey: ['profileData'],
    queryFn: async () => {
      const { data } = await supabase
        .schema('users')
        .from('users')
        .select('*')
        .eq('id', sessionData?.session?.user?.id)
        .single();
      if (data) {
        setProfile(data);
      }
      return data;
    },
    enabled: !!sessionData,
  });

  if (sessionError || profileError) {
    console.error(sessionError || profileError);
  }

  return (
    <header
      className="sticky top-0 flex w-full bg-white drop-shadow-1 dark:border-storkedark dark:bg-boxdark border-b border-gray-200 dark:border-gray-600"
      style={{ zIndex: 50 }}
    >
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
            <div className="relative bg-gray-100 dark:bg-navy-900 rounded-lg p-2">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <IoMdSearch className="w-6 h-6 ml-2 text-gray-500" />
              </button>
              <input
                type="text"
                id="search"
                name="search"
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
          <DropdownUser profile={profile} />
        </div>
      </div>
    </header>
  );
};

export default Header;
