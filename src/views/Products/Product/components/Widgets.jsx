import { filter, sumBy } from 'lodash';
import { MdOutlineFastfood, MdOutlineLocalDrink } from 'react-icons/md';
import { TbPackage, TbDiscount2 } from 'react-icons/tb';

const Widgets = ({ data }) => {
  const numberOfPromoProducts = filter(
    data,
    (product) => parseInt(product.promo) > 0,
  ).length;
  const filteredFood = sumBy(data, (product) =>
    product.category_id.category_id === 1 ? 1 : 0,
  );
  const filteredDrink = sumBy(data, (product) =>
    product.category_id.category_id === 2 ? 1 : 0,
  );

  return (
    <div className="min-w-screen flex items-center justify-center">
      <div className="max-w-7xl w-full mx-auto md:px-4">
        <div className="flex flex-col lg:flex-row w-full lg:space-x-2 space-y-4 lg:space-y-0 mb-2 lg:mb-4">
          <div className="w-full lg:w-1/4">
            <div className="widget w-full p-2 rounded-lg bg-white dark:bg-navy-700 dark:text-gray-100 border-l-4 border-blue-400">
              <div className="flex items-center">
                <div className="icon w-14 p-3.5 bg-blue-400 text-white rounded-full mr-3">
                  <TbPackage className="w-7 h-7" />
                </div>
                <div className="flex flex-col justify-center">
                  <div>{data && data?.length} items</div>
                  <div className="text-sm text-gray-400">Produk</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4">
            <div className="widget w-full p-2 rounded-lg bg-white dark:bg-navy-700 dark:text-gray-100 border-l-4 border-yellow-400">
              <div className="flex items-center">
                <div className="icon w-14 p-3.5 bg-yellow-400 text-white rounded-full mr-3">
                  <TbDiscount2 className="w-7 h-7" />
                </div>
                <div className="flex flex-col justify-center">
                  <div>{numberOfPromoProducts} items</div>
                  <div className="text-sm text-gray-400">Promo</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4">
            <div className="widget w-full p-2 rounded-lg bg-white dark:bg-navy-700 dark:text-gray-100 border-l-4 border-red-400">
              <div className="flex items-center">
                <div className="icon w-14 p-3.5 bg-red-400 text-white rounded-full mr-3">
                  <MdOutlineFastfood className="w-7 h-7" />
                </div>
                <div className="flex flex-col justify-center">
                  <div>{filteredFood} items</div>
                  <div className="text-sm text-gray-400">Makanan</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/4">
            <div className="widget w-full p-2 rounded-lg bg-white dark:bg-navy-700 dark:text-gray-100 border-l-4 border-green-400">
              <div className="flex items-center">
                <div className="icon w-14 p-3.5 bg-green-400 text-white rounded-full mr-3">
                  <MdOutlineLocalDrink className="w-7 h-7" />
                </div>
                <div className="flex flex-col justify-center">
                  <div>{filteredDrink} items</div>
                  <div className="text-sm text-gray-400">Minuman</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widgets;
