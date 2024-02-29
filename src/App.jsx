import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  useAuthCheck,
  authLoader,
  useAuthValidation,
} from './store/Auth/customHooks.jsx';
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  useLoaderData,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from 'pages/Dashboard/ECommerce';
import CategoryProduct from 'views/Products/Category';
import ProductList from 'views/Products/Product';
import Layout from './layouts/layouts';

// Auth
import SignIn from 'views/Auth/SignIn';
import SignUp from 'views/Auth/SignUp';
import ResetPassword from 'views/Auth/ResetPassword';
import NotFound from 'views/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    loader: authLoader,
    element: <Layout />,
    children: [
      {
        path: '/dashboard',
        loader: authLoader,
        Component() {
          const { authToken } = useLoaderData();
          return <Dashboard authToken={authToken} />;
        },
      },
      {
        path: '/category-product',
        loader: authLoader,
        Component() {
          const { authToken } = useLoaderData();
          return <CategoryProduct authToken={authToken} />;
        },
      },
      {
        path: '/product-list',
        loader: authLoader,
        Component() {
          const { authToken } = useLoaderData();
          return <ProductList authToken={authToken} />;
        },
      },
    ],
  },
  {
    path: '/signin',
    loader: authLoader,
    Component: SignIn,
  },
  {
    path: '/signup',
    loader: authLoader,
    Component: SignUp,
  },
  { path: '/reset-password', loader: authLoader, Component: ResetPassword },
  {
    path: '*',
    element: <NotFound />,
  },
]);

const MINUTE = 1000 * 60;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * MINUTE,
      gcTime: 10 * MINUTE,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retryOnMount: false,
    },
  },
});

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: '',
            duration: 1450,
            style: {
              background: '#ffff',
              color: '#1577d6',
            },
          }}
        />
        <RouterProvider router={router} />
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      </QueryClientProvider>
    </>
  );
}
