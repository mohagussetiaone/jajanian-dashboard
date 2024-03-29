import React, { useState, useMemo, Fragment } from 'react';
import { MdOutlineEdit, MdOutlineDeleteOutline } from 'react-icons/md';
import { GrView } from 'react-icons/gr';
import { IoMdMore } from 'react-icons/io';
import { useQuery } from '@tanstack/react-query';
import { Menu, Transition } from '@headlessui/react';
import supabase from 'config/supabaseClient';
import TableContainer from 'components/Tables/TableContainer';
import Breadcrumb from 'components/Breadcrumbs/Breadcrumb';
import Widgets from './Widgets';
import ViewProductModal from './ViewProductModal';
import ModalConfirmation from './ModalConfirmation';
import ProductListSekeleton from './ProductListSekeleton';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const navigate = useNavigate();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [idProduct, setIdProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewModalOpen = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEditModalOpen = (product) => {
    navigate(`/product/edit/${product.product_id}`);
  };

  const handleAddModalOpen = () => {
    navigate('/product/add');
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleDeleteConfirm = (product) => {
    setDeleteModalOpen(true);
    setIdProduct(product.product_id);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        id: 'category',
        header: () => (
          <p className="text-sm font-bold text-black dark:text-white">
            Kategori
          </p>
        ),
        accessorKey: 'category_id.category_name',
      },
      {
        id: 'product_name',
        header: () => (
          <p className="text-sm font-bold text-black dark:text-white">
            Nama Produk
          </p>
        ),
        accessorKey: 'product_name',
      },
      {
        id: 'price',
        header: () => (
          <p className="text-sm font-bold text-black dark:text-white">
            Harga Sebelum Promo
          </p>
        ),
        accessorKey: 'price',
      },
      {
        id: 'promo',
        header: () => (
          <p className="text-sm font-bold text-black dark:text-white">Promo</p>
        ),
        accessorKey: 'promo',
      },
      {
        id: 'original_price',
        header: () => (
          <p className="text-sm font-bold text-black dark:text-white">
            Harga Setelah Promo
          </p>
        ),
        accessorKey: 'original_price',
      },
      {
        id: 'is_published',
        header: () => (
          <p className="text-sm font-bold text-black dark:text-white">
            Dipublikasi
          </p>
        ),
        accessorKey: 'is_published',
        cell: (info) => (
          <p
            className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
              info.row.original.is_published
                ? 'bg-success text-success'
                : 'bg-danger text-danger'
            }`}
          >
            {info.row.original.is_published ? 'Ya' : 'Tidak'}
          </p>
        ),
      },
      {
        id: 'actions',
        header: () => (
          <p className="text-sm font-bold text-black dark:text-white">Aksi</p>
        ),
        cell: (info) => {
          return (
            <Menu as="div" className="relative flex justify-center">
              <div>
                <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white dark:bg-navy-700 px-3 py-2 text-sm font-semibold text-black">
                  <IoMdMore
                    className="-mr-1 h-5 w-5 dark:text-white"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-[50%] mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg focus:outline-none dark:bg-navy-700">
                  <div className="py-1">
                    <Menu.Item>
                      <button
                        onClick={() => handleViewModalOpen(info.row.original)}
                        className="flex items-center px-4 py-2 text-sm text-black dark:text-white"
                      >
                        <GrView className="mr-2 dark:text-white" />
                        View
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={() => handleEditModalOpen(info.row.original)}
                        className="flex items-center px-4 py-2 text-sm text-black dark:text-white"
                      >
                        <MdOutlineEdit className="mr-2 dark:text-white" />
                        Edit
                      </button>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={() => handleDeleteConfirm(info.row.original)}
                        className="flex items-center px-4 py-2 text-sm text-black dark:text-white"
                      >
                        <MdOutlineDeleteOutline className="mr-2 dark:text-white" />
                        Delete
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          );
        },
      },
    ],
    [],
  );

  const { isPending, error, data } = useQuery({
    queryKey: ['productData'],
    queryFn: async () => {
      const { data } = await supabase.schema('product').from('products')
        .select(`
        product_id,
        product_name,
        category_id:categories(category_id, category_name),
        price,
        description,
        promo,
        original_price,
        is_published,
        created_at,
        updated_at
      `);
      return data;
    },
  });

  if (isPending) return <ProductListSekeleton />;
  if (error) return 'An error has occurred: ' + error.message;

  return (
    <>
      <div
        className="w-full h-full pb-6 sm:overflow-x-auto"
        id="table-container"
      >
        <div className="flex flex-col md:flex-row mx-4 justify-between mb-2">
          <div className="font-bold text-navy-700 dark:text-gray-100">
            Daftar List Produk
          </div>
          <div>
            <Breadcrumb pageName="List Produk" />
          </div>
        </div>
        <Widgets data={data} />
        <div className="overflow-x-scroll xl:overflow-x-hidden">
          <TableContainer
            datas={data}
            columns={columns}
            TableName="Produk"
            tableClass="w-full"
            theadClass="table-light"
            handleAddModalOpen={handleAddModalOpen}
            isDownload={true}
          />
        </div>
      </div>
      {addModalOpen && (
        <AddProductModal
          handleAddModalClose={handleAddModalClose}
          addModalOpen={addModalOpen}
        />
      )}
      {viewModalOpen && (
        <ViewProductModal
          handleViewModalClose={handleViewModalClose}
          viewModalOpen={viewModalOpen}
          selectedProduct={selectedProduct}
        />
      )}
      {deleteModalOpen && (
        <ModalConfirmation
          deleteModalOpen={deleteModalOpen}
          handleDeleteClose={handleDeleteClose}
          idProduct={idProduct}
        />
      )}
    </>
  );
};

export default ProductList;
