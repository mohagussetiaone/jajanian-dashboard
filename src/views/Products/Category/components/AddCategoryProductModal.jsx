import { useState, useEffect } from 'react';
import { MdClose, MdAdd } from 'react-icons/md';
import supabase from 'config/supabaseClient';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const AddCategoryProductModal = ({ handleAddModalClose, addModalOpen }) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    category_name: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .schema('product')
        .from('categories')
        .insert({
          category_name: formData.category_name,
        });
      toast.success('Kategori produk berhasil ditambahkan');
      setIsLoading(false);
      queryClient.invalidateQueries({ queryKey: ['categoryProductData'] });
      handleAddModalClose();
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      {addModalOpen && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-xl">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tambah kategori produk
                </h3>
                <button
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={handleAddModalClose}
                >
                  <MdClose className="w-5 h-5" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form className="p-4 md:p-5" onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-4">
                    <div className="col-span-2">
                      <label
                        htmlFor="category_name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="category_name"
                        id="category_name"
                        value={formData.category_name}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Masukkan nama kategori produk"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 text-white">
                    <button
                      type="submit"
                      className="flex bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <MdAdd className="w-5 h-5 mr-1" />
                      Tambah kategori
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCategoryProductModal;
