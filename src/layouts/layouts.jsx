import { useEffect, useState } from 'react';
import { Outlet, useLoaderData, useLocation } from 'react-router-dom';
import { routes } from '../routes';
import Sidebar from 'components/Sidebar';
import Header from 'components/Header';
import Footer from 'components/footer';
import Card from 'components/Card';

export default function Layout(props) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('Main Dashboard');
  const { authToken } = useLoaderData();

  useEffect(() => {
    window.addEventListener('resize', () =>
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true),
    );
    return () => window.removeEventListener('resize', () => setOpen(false));
  }, []);

  useEffect(() => {
    const activeRoute = getActiveRoute(routes);
    setCurrentRoute(activeRoute);
  }, [location]);

  const getActiveRoute = (routes) => {
    for (let route of routes) {
      const fullPath = route.layout + route.path;
      if (location.pathname.includes(fullPath)) {
        return { layout: route.layout, path: route.path };
      }
      // Menangani submenu
      if (route?.submenu) {
        for (let sub of route.submenu) {
          const subFullPath = sub.layout + sub.path;
          if (location.pathname.includes(subFullPath)) {
            return {
              layout: sub.layout + route.name,
              path: sub.layout + sub.path,
            };
          }
        }
      }
    }
    return 'Not Found';
  };

  return (
    <div className="max-w-screen flex h-full">
      <Sidebar open={open} onClose={() => setOpen(!open)} />
      <Card extra="h-full w-full">
        <main className={`h-full flex-none transition-all md:px-1`}>
          <div className="h-full">
            <Header
              onOpenSidenav={() => setOpen(!open)}
              authToken={authToken}
            />
            <div className="mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Outlet />
            </div>
            <Footer />
          </div>
        </main>
      </Card>
    </div>
  );
}
