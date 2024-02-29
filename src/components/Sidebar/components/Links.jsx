import DashIcon from 'components/Icons/DashIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FaAngleRight } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import useToggleSidebar from 'store/ToggleSidebar';

const showAnimation = {
  hidden: {
    width: 0,
    opacity: 0,
    transition: {
      duration: 0.225,
    },
  },
  show: {
    opacity: 1,
    width: 'auto',
    transition: {
      duration: 0.225,
    },
  },
};

const Submenu = ({ submenu, isSidebarOpen }) => {
  return (
    <div>
      {submenu.map((item, index) => (
        <Link to={'/' + item.path} key={index}>
          <div className="relative -mb-1 mt-1 flex hover:cursor-pointer">
            <li
              className={`my-[5px] flex cursor-pointer items-center px-6 md:${
                isSidebarOpen ? 'px-8' : 'px-6'
              }`}
            >
              <AnimatePresence>
                {isSidebarOpen ? (
                  <motion.p
                    variants={showAnimation}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className={`leading-2 mt-1 flex overflow-visible whitespace-nowrap ${
                      activeRoute(item.path)
                        ? 'font-bold text-navy-700 dark:text-white'
                        : 'font-medium text-gray-600'
                    }`}
                  >
                    <span className="-ml-4 md:ml-2">-</span>
                    {'  '} <span className="ml-6">{item.name}</span>
                  </motion.p>
                ) : (
                  <p
                    className={`leading-1 flex md:hidden ${
                      activeRoute(item.path)
                        ? 'font-bold text-navy-700 dark:text-white'
                        : 'font-medium text-gray-600'
                    }`}
                  >
                    <span className="ml-2 md:ml-2">-</span>
                    {'  '} <span className="ml-6">{item.name}</span>
                  </p>
                )}
              </AnimatePresence>
            </li>
            {activeRoute(item.path) && (
              <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-red-700 dark:bg-brand-400" />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

const activeRoute = (routeName) => {
  let location = useLocation();
  return location.pathname.includes(routeName);
};

const createLinks = (routes, isSidebarOpen, toggleSidebar) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const { sidebarOpen, setSidebarOpen } = useToggleSidebar();

  const toggleSubmenu = (index) => {
    if (openSubmenu === index) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(index);
    }
  };

  return routes.map((route, index) => {
    const isParentMenu = !route.path;

    return (
      <div key={index} className="relative mb-3">
        {isParentMenu ? (
          <div
            className="flex items-center"
            onClick={() => toggleSubmenu(index)}
          >
            <li
              className={`my-[2px] flex flex-grow items-center px-6 md:${
                isSidebarOpen ? 'px-8' : 'px-6'
              }`}
            >
              <span
                className={`${
                  activeRoute(route.path)
                    ? 'font-bold text-brand-500 dark:text-white'
                    : 'font-medium text-gray-600'
                }`}
                onClick={toggleSidebar}
              >
                {route.icon ? route.icon : <DashIcon />}
              </span>
              {isSidebarOpen ? (
                <motion.p
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className={`leading-1 ml-4 flex overflow-visible whitespace-nowrap ${
                    activeRoute(route.path)
                      ? 'font-bold text-navy-700 dark:text-white'
                      : 'font-medium text-gray-600'
                  }`}
                >
                  {route.name}
                </motion.p>
              ) : (
                <p
                  className={`leading-1 ml-4 flex md:hidden ${
                    activeRoute(route.path)
                      ? 'font-bold text-navy-700 dark:text-white'
                      : 'font-medium text-gray-600'
                  }`}
                >
                  {route.name}
                </p>
              )}
            </li>
            <FaAngleRight
              className={`mr-4 h-5 w-5 transform transition-transform duration-700 ${
                openSubmenu === index ? 'rotate-90' : ''
              }`}
            />
          </div>
        ) : (
          <Link to={'/' + route.path}>
            <div className="relative mb-4 flex hover:cursor-pointer">
              <li
                className={`my-[3px] flex cursor-pointer items-center px-6 md:${
                  isSidebarOpen ? 'px-8' : 'px-6'
                }`}
              >
                <span
                  className={`${
                    activeRoute(route.path)
                      ? 'font-bold text-brand-500 dark:text-white'
                      : 'font-medium text-gray-600'
                  }`}
                >
                  {route.icon ? route.icon : <DashIcon />}
                </span>
                <AnimatePresence>
                  {isSidebarOpen ? (
                    <motion.p
                      variants={showAnimation}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className={`leading-1 ml-4 flex overflow-visible whitespace-nowrap ${
                        activeRoute(route.path)
                          ? 'font-bold text-navy-700 dark:text-white'
                          : 'font-medium text-gray-600'
                      }`}
                    >
                      {route.name}
                    </motion.p>
                  ) : (
                    <p
                      className={`leading-1 ml-4 flex md:hidden ${
                        activeRoute(route.path)
                          ? 'font-bold text-navy-700 dark:text-white'
                          : 'font-medium text-gray-600'
                      }`}
                    >
                      {route.name}
                    </p>
                  )}
                </AnimatePresence>
              </li>
              {activeRoute(route.path) && (
                <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-red-700 dark:bg-gray-50" />
              )}
            </div>
          </Link>
        )}
        {isParentMenu && index === openSubmenu && (
          <Submenu submenu={route.submenu} isSidebarOpen={isSidebarOpen} />
        )}
      </div>
    );
  });
};

const SidebarLinks = ({ routes, isSidebarOpen, toggleSidebar }) => {
  return <>{createLinks(routes, isSidebarOpen, toggleSidebar)}</>;
};

export default SidebarLinks;
