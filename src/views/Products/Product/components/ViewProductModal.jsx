import { MdClose } from 'react-icons/md';

const ViewProductModal = ({
  handleViewModalClose,
  viewModalOpen,
  selectedProduct,
}) => {
  return (
    <>
      {viewModalOpen && (
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
                  View produk
                </h3>
                <button
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={handleViewModalClose}
                >
                  <MdClose className="w-5 h-5" />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form className="p-4 md:p-5">
                <div className="grid gap-4 mb-4">
                  <form className="p-4 md:p-5">
                    <div className="grid gap-4 mb-4">
                      <div className="col-span-2">
                        <label
                          htmlFor="category"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Kategori
                        </label>
                        <input
                          type="text"
                          name="category"
                          id="category"
                          value={selectedProduct.category_id.category_name}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          disabled
                        />
                      </div>
                      <div className="col-span-2">
                        <label
                          htmlFor="product_name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Nama produk
                        </label>
                        <input
                          type="text"
                          name="product_name"
                          id="product_name"
                          value={selectedProduct.product_name}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          disabled
                        />
                      </div>
                      <div className="col-span-2">
                        <label
                          htmlFor="product_name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Foto produk
                        </label>
                        <img
                          src={`data:image/png;base64,${selectedProduct.image_base64}`}
                          alt={`${selectedProduct.product_name}.jpg`}
                          className="w-full h-[200px] object-cover"
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
                          value={selectedProduct.price}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          disabled
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label
                          htmlFor="promo  "
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Promo
                        </label>
                        <input
                          type="number"
                          name="promo"
                          id="promo"
                          value={selectedProduct.promo}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          disabled
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
                          value={selectedProduct.original_price}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          disabled
                        />
                      </div>
                      <div className="col-span-2">
                        <label
                          htmlFor="description"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Deskripsi
                        </label>
                        <textarea
                          id="description"
                          rows="4"
                          name="description"
                          value={selectedProduct.description}
                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Write product description here"
                          disabled
                        ></textarea>
                      </div>
                    </div>
                  </form>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewProductModal;
