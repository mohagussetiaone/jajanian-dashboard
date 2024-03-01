import { HiHome } from 'react-icons/hi';
import { LuPackage2 } from 'react-icons/lu';
import Dashboard from './views/Dashboard';
import CategoryProduct from './views/Products/Category';

export const routes = [
  {
    name: 'Halaman Utama',
    layout: '/',
    path: 'dashboard',
    icon: <HiHome className="h-6 w-6" />,
    component: <Dashboard authToken={undefined} />,
  },
  {
    name: 'Produk',
    icon: <LuPackage2 className="h-6 w-6" />,
    submenu: [
      {
        layout: '/',
        name: 'Kategori Produk',
        path: 'category-product',
      },
      {
        layout: '/',
        name: 'List Produk',
        path: 'product-list',
      },
    ],
  },
];

export const Protectedroutes = [
  // {
  //   name: 'Permintaan Bantuan',
  //   layout: '/',
  //   path: '/list-bantuan',
  //   Component: <ListBantuan authToken={undefined} />,
  // },
  // {
  //   name: 'Perubahan Layanan',
  //   layout: '/',
  //   path: 'layanan',
  // component: <PerubahanLayanan authToken={undefined} />,
  //   submenu: [
  //     {
  //       name: 'Permintaan Bantuan',
  //       layout: '/layanan',
  //       path: '/list-bantuan',
  // Component: <ListBantuan authToken={undefined} />,
  //     },
  //   ],
  // },
];
