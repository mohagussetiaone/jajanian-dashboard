import { useState } from 'react';
import { routes } from 'routes';
import { AnimatePresence, motion } from 'framer-motion';
import useToggleSidebar from 'store/ToggleSidebar';
import SidebarLinks from './components/Links.jsx';
import LogoJajanian from 'assets/logo/Jajanian.png';
import { HiArrowLeft, HiChevronRight } from 'react-icons/hi';

const determineInitialSidebarState = () => {
  return window.innerWidth > 1024;
};

const index = ({ open, onClose }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    determineInitialSidebarState(),
  );
  const { setSidebarOpen } = useToggleSidebar();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setSidebarOpen(isSidebarOpen);
  };

  const sidebarVariants = {
    open: { width: '360px' },
    closed: { width: '64px' },
  };

  return (
    <>
      <motion.div
        className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all md:!z-50 md:hidden lg:!z-50 xl:!z-0 dark:bg-navy-800 dark:text-white ${
          open ? 'translate-x-0' : '-translate-x-96'
        }`}
      >
        <span
          className="absolute right-4 top-4 block cursor-pointer md:hidden"
          onClick={onClose}
        >
          <HiArrowLeft className="w-4 h-4" />
        </span>
        <div className={`mx-[56px] mt-[50px] flex items-center`}>
          <div className="ml-1 mt-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
            <img src={LogoJajanian} alt="logo.png" className="max-w-[190px]" />
          </div>
        </div>
        <div className="mb-7 mt-[58px] h-px bg-gray-300 dark:bg-white/30" />
        <ul className="mb-auto pt-1">
          <SidebarLinks routes={routes} toggleSidebar={toggleSidebar} />
        </ul>
      </motion.div>
      <motion.div
        className={`relative hidden z-70 min-h-full flex-col bg-white shadow-2xl shadow-white/5 md:relative md:flex dark:bg-navy-800  dark:text-white`}
        initial={false}
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ duration: 0.225, ease: 'linear' }}
      >
        <div className="sticky top-0 -ml-1">
          <div className="flex flex-col min-h-screen justify-between">
            <div>
              <div className="ml-9 md:ml-7 xl:ml-10 flex items-center justify-between py-6">
                <AnimatePresence>
                  {isSidebarOpen ? (
                    <>
                      <img
                        src={LogoJajanian}
                        alt="iconnethome"
                        className="-ml-2 md:-ml-2 xl:-ml-4 h-8 w-8"
                        onClick={toggleSidebar}
                      />
                      <h3 className="w-18 text-xl h-6 xl:w-18 my-1 xl:h-6">
                        Jajanian
                      </h3>
                    </>
                  ) : (
                    <img
                      src={LogoJajanian}
                      alt="iconnethome"
                      className="-ml-2 md:-ml-2 xl:-ml-4 h-8 w-8"
                      onClick={toggleSidebar}
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  <span className="cursor-pointer" onClick={toggleSidebar}>
                    {isSidebarOpen && (
                      <HiArrowLeft className="mr-4 h-5 w-5 md:mr-3" />
                    )}
                  </span>
                </AnimatePresence>
              </div>
              <hr className="mb-4 dark:border-gray-50" />
              <ul className={`mb-auto pt-1 ${isSidebarOpen && 'mr-45'}`}>
                <SidebarLinks
                  routes={routes}
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                />
              </ul>
            </div>
            <div className={`ml-6 mb-5`}>
              <AnimatePresence>
                <span className="cursor-pointer" onClick={toggleSidebar}>
                  {!isSidebarOpen && <HiChevronRight className="h-7 w-7" />}
                </span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default index;
