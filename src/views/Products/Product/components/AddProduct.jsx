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
import { useNavigate } from 'react-router-dom';
import ProductListSekeleton from './ProductListSekeleton';

const AddProductModal = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    is_published: false,
  });
  const [idNextVal, setIdNexVal] = useState();

  // options for select
  const [isPublishedOptions] = useState([
    { value: false, label: 'Tidak' },
    { value: true, label: 'Ya' },
  ]);
  // fetching last sequence
  const fetchSequence = async () => {
    const { data, error } = await supabase.rpc('get_last_product_id');
    console.log('data sequence', data + 1);
    setIdNexVal(data + 1);
    if (error) {
      console.log(error);
    }
    return data;
  };
  // fectch category
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

  useEffect(() => {
    fetchSequence();
    fetchCategory();
  }, []);

  // handle select category
  const handleSelectChange = (selected) => {
    console.log('selected', selected);
    setFormData((prevData) => ({
      ...prevData,
      category_id: selected && selected.value,
    }));
  };
  // remove image
  const handleRemoveImage = (index) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };
  // handle change formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // file upload
  const handleFileChange = (event) => {
    const files = event.target.files;
    const newFiles = Array.from(files);
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    const maxSize = 2 * 1024 * 1024; // 2MB
    const validatedFiles = newFiles.filter((file) => {
      if (!allowedExtensions.test(file.name)) {
        toast.error(`Hanya dapat mengupload extensi file jpg, jpeg atau png`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`Batas maksimum ukuran file adalah 2MB`);
        return false;
      }
      return true;
    });
    setSelectedFiles([...selectedFiles, ...validatedFiles]);
    const newPreviewUrls = validatedFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    });
    Promise.all(newPreviewUrls).then((urls) => {
      setPreviewUrls([...previewUrls, ...urls]);
    });
  };
  // upload image to supabase
  const uploadImageToSupabase = async (file) => {
    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error(`Batas maksimum ukuran file adalah 2MB`);
      return;
    }
    const { data, error } = await supabase.storage
      .from('jajanian')
      .upload('product/' + idNextVal + '/' + uuidv4(), file);
    if (data) {
      console.log(`${file?.name} berhasil diupload`);
      return data;
    } else {
      toast.error(`Error saat mengupload gambar ${file?.name}: ${error}`);
      return null;
    }
  };
  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!selectedFiles || selectedFiles?.length === 0) {
      toast.error('Tidak ada file yang dipilih');
      return;
    }
    try {
      const imageUrls = await Promise.all(
        selectedFiles?.map(uploadImageToSupabase),
      );
      if (imageUrls.every((url) => url !== null)) {
        const { data } = await supabase
          .schema('product')
          .from('products')
          .insert({
            product_name: formData.product_name,
            category_id: formData.category_id,
            price: formData.price,
            description: formData.description,
            promo: formData.promo,
            original_price: formData.original_price,
            is_published: formData.is_published,
          });
        toast.success('Produk berhasil diupdate');
        queryClient.invalidateQueries({ queryKey: ['productData'] });
        navigate('/product-list');
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  };
  // editor wysiwyg
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prevData) => ({
      ...prevData,
      description: data,
    }));
  };

  if (isLoading) return <ProductListSekeleton />;

  function AddBack() {
    navigate(-1);
  }

  return (
    <>
      <div className="flex p-2 w-full">
        <div className="w-full bg-white rounded-lg dark:bg-boxdark">
          <div className="flex justify-between pb-3 border-b border-gray-300">
            <div className="flex">
              <button className="mr-2" onClick={AddBack}>
                <MdArrowBack className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add produk
              </h3>
            </div>
            <div>
              <Breadcrumb pageName="List Produk" />
            </div>
          </div>
          <form onSubmit={handleAddProduct}>
            <div className="flex gap-10 pt-4">
              <div className="w-1/2">
                <div>
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
                    value={formData.category_id}
                    onChange={handleSelectChange}
                    options={options}
                  />
                </div>
                <div>
                  <label
                    htmlFor="name"
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
                    value={formData.original_price}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-[4px] focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-boxdark dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Masukkan harga asli"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="original_price"
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
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
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
                      id="default_size"
                      type="file"
                      name="image"
                      accept=".png, .jpg, .jpeg, .svg"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                {previewUrls && previewUrls.length > 0 && (
                  <div className="mt-4 col-span-2 p-2 rounded-lg shadow flex flex-wrap">
                    <div className="flex flex-wrap justify-between w-full">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Image Preview
                      </p>
                      <div className="flex gap-3">
                        <p className="text-sm">{previewUrls?.length} files</p>
                        <MdZoomOutMap className="w-4 h-4 mt-[2px]" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {previewUrls.map((url, index) => (
                        <div className="relative" key={index}>
                          <img
                            src={url}
                            alt={`Preview_${index}.jpg`}
                            className="mt-2 rounded-lg max-w-[100px] h-auto"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-0 right-0 p-1 text-red-500 bg-gray-100 border-red-500 rounded-full hover:text-red-600 hover:bg-gray-50 focus:outline-none focus:ring-2 z-10"
                          >
                            <MdClose className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end mt-4 text-white">
                  <button
                    type="submit"
                    className="flex bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <MdEdit className="w-5 h-5 mr-1" />
                    Add produk
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;
