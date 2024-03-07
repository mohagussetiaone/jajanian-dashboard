import { useState, useEffect } from 'react';
import { MdClose, MdEdit } from 'react-icons/md';
import Select from 'react-select';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import supabase from 'config/supabaseClient';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const CDNURL =
  'https://nhlaxvquhtucrcblxlej.supabase.co/storage/v1/object/public/jajanian/product/';

const EditProductModal = ({
  handleEditModalClose,
  editModalOpen,
  selectedProduct,
}) => {
  console.log('selectedProduct', selectedProduct);
  const queryClient = useQueryClient();
  const [options, setOptions] = useState([]);
  const [imageBase64, setImageBase64] = useState(null);
  const [isImageChanged, setImageChanged] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    category_id: selectedProduct.category_id.category_id,
    product_name: selectedProduct.product_name,
    image_base64: selectedProduct.image_base64,
    price: selectedProduct.price,
    promo: selectedProduct.promo,
    original_price: selectedProduct.original_price,
    description: selectedProduct.description,
  });

  useEffect(() => {
    // const { isPending, error, data } = useQuery({
    //   queryKey: ['productImage'],
    //   queryFn: async () => {
    const fetchImage = async () => {
      const { data, error } = await supabase.storage
        .from('jajanian')
        .list('product/' + selectedProduct.product_id + '/', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' },
        });
      setImagePreview(data);
      setImageChanged(true);
      return data;
    };
    fetchImage();
    //   },
    // });
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      const { data } = await supabase
        .schema('product')
        .from('categories')
        .select('category_id, category_name, created_at, updated_at');
      const formattedOptions = data?.map((option) => ({
        value: option.category_id,
        label: option.category_name,
      }));
      setOptions(formattedOptions);
    };
    fetchCategory();
  }, []);

  const handleSelectChange = (selected) => {
    setFormData((prevData) => ({
      ...prevData,
      category_id: selected
        ? selected.value
        : selectedProduct.category_id.category_id,
    }));
  };

  const handleImageChange = async (file) => {
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'svg'];
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      toast.error('Invalid file type. Please select a PNG, JPG, or SVG file.');
      return;
    }
    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      toast.error('Selected image exceeds the maximum allowed size (5MB)');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      const splittedString = base64String.split(',')[1];
      setImageBase64(splittedString);
    };
    reader.readAsDataURL(file);
  };

  async function uploadImage(e) {
    let file = e.target.files[0];
    const { data, error } = await supabase.storage
      .from('jajanian')
      .upload('product/' + selectedProduct.product_id + '/' + uuidv4(), file);
    if (data) {
      getImages();
    } else {
      console.log(error);
    }
  }

  console.log('data', imagePreview);
  console.log('editModalOpen', editModalOpen);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const image_new = null;

  const handleDeleteImage = async (e) => {
    e.preventDefault();
    try {
      if (imagePreview || imageBase64) {
        setImageBase64(null);
        setImagePreview(null);
        queryClient.invalidateQueries({ queryKey: ['productData'] });
      } else {
        const { error } = await supabase
          .schema('product')
          .from('products')
          .update({ image_base64: image_new })
          .eq('product_id', selectedProduct.product_id);
        setFormData({
          image_base64: null,
        });
        setImageBase64(null);
        setImagePreview(null);
        toast.success('Foto produk berhasil dihapus');
        queryClient.invalidateQueries({ queryKey: ['productData'] });
        if (error) {
          toast.error('gagal menghapus foto produk');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const { data } = await supabase
        .schema('product')
        .from('products')
        .update({
          product_name: formData.product_name,
          category_id: formData.category_id,
          price: formData.price,
          description: formData.description,
          image_base64: imageBase64 || formData.image_base64,
          promo: formData.promo,
          original_price: formData.original_price,
        })
        .eq('product_id', selectedProduct.product_id);
      toast.success('Produk berhasil diupdate');
      queryClient.invalidateQueries({ queryKey: ['productData'] });
      handleEditModalClose();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* Main modal */}
      {editModalOpen && (
        <div
          id="crud-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-3xl">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit produk
                </h3>
                <button
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={handleEditModalClose}
                >
                  <MdClose className="w-5 h-5" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <form className="p-4 md:p-5" onSubmit={handleEditProduct}>
                <div className="grid gap-4">
                  <div className="grid gap-4">
                    <div className="col-span-2">
                      <label
                        htmlFor="name"
                        name="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Pilih kategori
                      </label>
                      <Select
                        id="category"
                        name="category"
                        value={options.find(
                          (option) =>
                            option.value ===
                            selectedProduct.category_id.category_id,
                        )}
                        onChange={handleSelectChange}
                        options={options}
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        name="product_name"
                        id="product_name"
                        value={formData.product_name}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Masukkan nama produk"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="UploadFile"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Pilih Image
                      </label>
                      <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-primary-600 focus:border-primary-600 block w-full px-2 py-1 mb-4 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        id="default_size"
                        type="file"
                        name="image"
                        accept=".png, .jpg, .jpeg, .svg"
                        onChange={(e) => {
                          handleImageChange(e.target.files[0]);
                        }}
                      />
                      {(selectedProduct.image_base64 === null ||
                        imagePreview ||
                        formData.image_base64 === null) && (
                        <div className="items-center justify-center w-full hidden md:block">
                          <label
                            htmlFor="dropzone-file"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                          >
                            <div
                              className="flex flex-col items-center justify-center pt-5 pb-6"
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                            >
                              <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Drag and drop
                                </span>{' '}
                                Untuk upload file image
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                hanya dapat upload SVG, PNG, JPG atau GIF (MAX.
                                800x400px)
                              </p>
                            </div>
                            <input
                              id="dropzone-file"
                              type="file"
                              accept=".png, .jpg, .jpeg, .svg"
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                      {(formData?.image_base64 || imagePreview) && (
                        <div className="mt-4 col-span-2 w-[150px] h-[150px">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Image Preview
                          </p>
                          <div className="relative">
                            <img
                              src={`data:image/png;base64,${
                                imageBase64 || formData.image_base64
                              }`}
                              alt="Preview.jpg"
                              className="mt-2 rounded-lg max-w-full h-auto"
                            />
                            <button
                              type="button"
                              onClick={handleDeleteImage}
                              className="absolute top-0 right-0 mt-1 mr-1 px-2 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 z-10"
                            >
                              <MdClose className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="promo"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Harga sebelum promo
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Masukkan harga sebelum promo"
                        required
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="promo"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Promo
                      </label>
                      <input
                        type="number"
                        name="promo"
                        id="promo"
                        value={formData.promo}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder='Masukkan "0" jika tidak ada promo'
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="original_price"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Harga setelah promo
                      </label>
                      <input
                        type="number"
                        name="original_price"
                        id="original_price"
                        value={formData.original_price}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Masukkan harga asli"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Product Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Masukkan deskripsi produk"
                      ></textarea>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 text-white">
                    <button
                      type="submit"
                      className="flex bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      <MdEdit className="w-5 h-5 mr-1" />
                      Edit produk
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

export default EditProductModal;
