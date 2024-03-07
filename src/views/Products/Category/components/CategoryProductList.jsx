import React, { useState, useMemo, Fragment } from 'react';
import { MdOutlineEdit, MdOutlineDeleteOutline } from 'react-icons/md';
import { GrView } from 'react-icons/gr';
import { IoMdMore } from 'react-icons/io';
import { useQuery } from '@tanstack/react-query';
import { Menu, Transition } from '@headlessui/react';
import TableContainer from 'components/Tables/TableContainer';
import Breadcrumb from 'components/Breadcrumbs/Breadcrumb';
import AddCategoryProductModal from './AddCategoryProductModal';
import EditCategoryProductModal from './EditCategoryProductModal';
import ViewCategoryProductModal from './ViewCategoryProductModal';
import ModalConfirmation from './ModalConfirmation';
import CategoryListSekeleton from './CategoryListSekeleton';
import supabase from 'config/supabaseClient';
import dayjs from 'dayjs';

const CategoryProductList = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [idCategory, setIdCategory] = useState(false);
  const [selectedCategoryProduct, setSelectedCategoryProduct] = useState(null);

  const handleViewModalOpen = (category) => {
    setSelectedCategoryProduct(category);
    setViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setSelectedCategoryProduct(null);
  };

  const handleEditModalOpen = (category) => {
    setSelectedCategoryProduct(category);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedCategoryProduct(null);
  };
  const handleAddModalOpen = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleDeleteConfirm = (category) => {
    setDeleteModalOpen(true);
    setIdCategory(category.category_id);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        id: 'category_name',
        header: () => (
          <p className="text-sm font-bold text-black dark:text-white">
            Nama Category
          </p>
        ),
        accessorKey: 'category_name',
      },
      {
        id: 'created_at',
        header: () => (
          <p className="text-sm font-bold text-black dark:text-white">
            Tanggal dibuat
          </p>
        ),
        accessorKey: 'created_at',
        cell: (info) => (
          <p className="text-sm text-black dark:text-white">
            {dayjs(info.row.original.created_at).format('DD/MM/YYYY HH:mm')}
          </p>
        ),
      },
      {
        id: 'updated_at',
        header: () => (
          <p className="text-sm font-bold text-black dark:text-white">
            Tanggal diupdate
          </p>
        ),
        accessorKey: 'updated_at',
        cell: (info) => (
          <p className="text-sm text-black dark:text-white">
            {dayjs(info.row.original.updated_at).format('DD/MM/YYYY HH:mm')}
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
    queryKey: ['categoryProductData'],
    queryFn: async () => {
      const { data } = await supabase.schema('product').from('categories')
        .select(`
        category_id,
        category_name,
        created_at,
        updated_at
      `);
      return data;
    },
  });

  if (isPending) return <CategoryListSekeleton />;
  if (error) return 'An error has occurred: ' + error.message;

  return (
    <>
      <div
        className="w-full h-full pb-6 sm:overflow-x-auto"
        id="table-container"
      >
        <div className="flex flex-col md:flex-row mx-4 justify-between mb-2">
          <div className="font-bold text-navy-700 dark:text-gray-100">
            Daftar kategori produk
          </div>
          <div>
            <Breadcrumb pageName="List Kategori produk" />
          </div>
        </div>
        <div className="overflow-x-scroll xl:overflow-x-hidden">
          <TableContainer
            datas={data}
            columns={columns}
            TableName="Kategori Produk"
            tableClass="w-full"
            theadClass="table-light"
            handleAddModalOpen={handleAddModalOpen}
            isDownload={false}
          />
        </div>
      </div>
      {addModalOpen && (
        <AddCategoryProductModal
          handleAddModalClose={handleAddModalClose}
          addModalOpen={addModalOpen}
        />
      )}
      {viewModalOpen && (
        <ViewCategoryProductModal
          handleViewModalClose={handleViewModalClose}
          viewModalOpen={viewModalOpen}
          selectedCategoryProduct={selectedCategoryProduct}
        />
      )}
      {editModalOpen && (
        <EditCategoryProductModal
          handleEditModalClose={handleEditModalClose}
          editModalOpen={editModalOpen}
          selectedCategoryProduct={selectedCategoryProduct}
        />
      )}
      {deleteModalOpen && (
        <ModalConfirmation
          deleteModalOpen={deleteModalOpen}
          handleDeleteClose={handleDeleteClose}
          idCategory={idCategory}
        />
      )}
    </>
  );
};

export default CategoryProductList;
