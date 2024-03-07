import { useState, useEffect } from 'react';
import { MdClose, MdEdit, MdArrowBack } from 'react-icons/md';
import Breadcrumb from 'components/Breadcrumbs/Breadcrumb';
import Select from 'react-select';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useQueryClient } from '@tanstack/react-query';
import supabase from 'config/supabaseClient';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { useParams, useNavigate } from 'react-router-dom';
import ProductListSekeleton from './ProductListSekeleton';
import { MdZoomOutMap } from 'react-icons/md';
import ModalImageFull from './ModalImageFull';
import { IoMdArrowRoundBack } from 'react-icons/io';

const CDNURL =
  'https://nhlaxvquhtucrcblxlej.supabase.co/storage/v1/object/public/jajanian/product/';

const EditProductModal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productData, setProductData] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [modalImagePreview, setModalImagePreview] = useState(false);
  const [formData, setFormData] = useState({});
  const [isPublishedOptions] = useState([
    { value: false, label: 'Tidak' },
    { value: true, label: 'Ya' },
  ]);

  const fetchCategory = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .schema('product')
      .from('categories')
      .select('category_id, category_name, created_at, updated_at');
    const formattedOptions = data?.map((option) => ({
      value: option.category_id,
      label: option.category_name,
    }));
    setOptions(formattedOptions);
    setIsLoading(false);
  };

  const fetchImage = async () => {
    const { data, error } = await supabase.storage
      .from('jajanian')
      .list('product/' + id + '/', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });
    if (error) {
      console.error(error);
    }
    setImagePreview(data);
    return data;
  };

  const fetchImageById = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .schema('product')
      .from('products')
      .select(
        `
        product_id,
        product_name,
        category_id:categories(category_id, category_name),
        price,
        description,
        image_base64,
        promo,
        original_price,
        is_published,
        created_at,
        updated_at
      `,
      )
      .eq('product_id', id);
    const isPublishedValue =
      typeof data[0]?.is_published === 'boolean'
        ? data[0]?.is_published
        : false;
    setFormData({
      category_id: data[0]?.category_id?.category_id || '',
      product_name: data[0]?.product_name || '',
      image_base64: data[0]?.image_base64 || '',
      price: data[0]?.price || '',
      promo: data[0]?.promo || '',
      original_price: data[0]?.original_price || '',
      description: data[0]?.description || '',
      is_published: isPublishedValue,
    });
    setProductData(data[0]);
    setIsLoading(false);
    return data[0];
  };

  useEffect(() => {
    fetchCategory();
    fetchImage();
    fetchImageById();
  }, [id]);

  const handleSelectChange = (selected) => {
    console.log('selected', selected);
    setFormData((prevData) => ({
      ...prevData,
      category_id: selected
        ? selected.value
        : productData?.category_id?.category_id,
    }));
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    if (!file) {
      toast.error('Tidak ada file yang dipilih');
      return;
    }
    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error('Ukuran file terlalu besar. Maksimal 2MB diizinkan.');
      return;
    }
    const { data, error } = await supabase.storage
      .from('jajanian')
      .upload('product/' + productData.product_id + '/' + uuidv4(), file);
    if (data) {
      fetchImage();
      toast.success('Gambar berhasil diupload');
    } else {
      console.error(error);
    }
  };

  const handleDeleteImage = async (imageName) => {
    const { error } = await supabase.storage
      .from('jajanian')
      .remove(['product/' + productData.product_id + '/' + imageName]);
    if (error) {
      toast.error('Gagal menghapus gambar');
    } else {
      fetchImage();
      toast.success('Gambar berhasil dihapus');
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
          promo: formData.promo,
          original_price: formData.original_price,
          is_published: formData.is_published,
        })
        .eq('product_id', productData.product_id);
      toast.success('Produk berhasil diupdate');
      queryClient.invalidateQueries({ queryKey: ['productData'] });
      // navigate('/product-list');
      window.location.href = '/product-list';
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prevData) => ({
      ...prevData,
      description: data,
    }));
  };

  if (isLoading) return <ProductListSekeleton />;

  const modalImageFullClose = () => {
    setModalImagePreview(false);
  };

  function editBack() {
    navigate(-1);
  }

  return (
    <>
      <div className="flex p-2 w-full">
        <div className="w-full bg-white rounded-lg dark:bg-boxdark">
          <div className="flex justify-between pb-3 border-b border-gray-300">
            <div className="flex">
              <button className="mr-2" onClick={editBack}>
                <MdArrowBack className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit produk
              </h3>
            </div>
            <div>
              <Breadcrumb pageName="List Produk" />
            </div>
          </div>
          <form onSubmit={handleEditProduct}>
            <div className="flex gap-10 pt-4">
              <div className="w-1/2">
                <div>
                  <label
                    htmlFor="category"
                    name="category"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Pilih kategori
                  </label>
                  <Select
                    id="category"
                    name="category"
                    value={
                      options.find(
                        (option) => option.value === formData.category_id,
                      ) || null
                    }
                    onChange={handleSelectChange}
                    options={options}
                  />
                </div>
                <div>
                  <label
                    htmlFor="product_name"
                    className="block mb-2 text-sm font-medium text-gray-900  dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    id="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Masukkan nama produk"
                    required
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Harga sebelum promo
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    min={0}
                    value={formData.price}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                    min={0}
                    value={formData.promo}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                    min={0}
                    value={formData.original_price}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Masukkan harga asli"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="is_published"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Publikasi
                  </label>
                  <Select
                    id="is_published"
                    name="is_published"
                    value={isPublishedOptions.find(
                      (option) => option.value === formData?.is_published,
                    )}
                    onChange={(selected) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        is_published: selected
                          ? selected.value
                          : formData?.is_published,
                      }));
                    }}
                    options={isPublishedOptions}
                  />
                </div>
              </div>
              <div className="w-1/2">
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Product Description
                  </label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.description}
                    onChange={handleEditorChange}
                  />
                </div>
                <div className="items-center mt-2 justify-center w-full hidden md:block">
                  <div>
                    <label
                      htmlFor="UploadFile"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Pilih Gambar
                    </label>
                    <input
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-primary-600 focus:border-primary-600 block w-full px-2 py-1 mb-4 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      id="UploadFile"
                      type="file"
                      name="UploadFile"
                      accept=".png, .jpg, .jpeg, .svg"
                      onChange={uploadImage}
                    />
                  </div>
                </div>
                {imagePreview.length > 0 && (
                  <div className="mt-4 col-span-2 p-2 rounded-lg shadow flex flex-wrap">
                    <div className="flex flex-wrap justify-between w-full">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Image Preview
                      </p>
                      <div className="flex gap-3">
                        <p className="text-sm">{imagePreview?.length} files</p>
                        <MdZoomOutMap
                          className="w-4 h-4 mt-[2px] cursor-pointer"
                          onClick={() => setModalImagePreview(true)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {imagePreview?.map((image, index) => (
                        <div className="relative" key={index}>
                          <img
                            src={`${CDNURL}/${id}/${image.name}`}
                            alt={`Preview_${index}.jpg`}
                            className="mt-2 rounded-lg max-w-[100px] h-auto"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(image.name)}
                            className="absolute top-0 right-0 p-1 text-red-500 bg-gray-100 border-red-500 rounded-full hover:text-red-600 hover:bg-gray-50 focus:outline-none focus:ring-2 z-10"
                          >
                            <MdClose className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end mt-6 text-white">
                  <button
                    type="submit"
                    className="flex bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <MdEdit className="w-5 h-5 mr-1" />
                    Edit produk
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      {modalImagePreview && (
        <ModalImageFull
          CDNURL={CDNURL}
          id={id}
          modalImagePreview={modalImagePreview}
          imagePreview={imagePreview}
          modalImageFullClose={modalImageFullClose}
        />
      )}
    </>
  );
};

export default EditProductModal;
