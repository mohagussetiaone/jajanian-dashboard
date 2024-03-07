import { MdClose } from 'react-icons/md';

const ViewProductModal = ({
  handleViewModalClose,
  viewModalOpen,
  selectedCategoryProduct,
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
                  View category produk
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
                  <div className="grid gap-4 mb-4">
                    <div className="col-span-2">
                      <label
                        htmlFor="category_id"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Kategori ID
                      </label>
                      <input
                        type="text"
                        name="category_id"
                        id="category_id"
                        value={selectedCategoryProduct.category_id}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        disabled
                      />
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="category_name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nama kategori
                      </label>
                      <input
                        type="text"
                        name="category_name"
                        id="category_name"
                        value={selectedCategoryProduct.category_name}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        disabled
                      />
                    </div>
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

export default ViewProductModal;
