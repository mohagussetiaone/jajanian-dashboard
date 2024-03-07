const CategoryListSekeleton = () => {
  return (
    <div
      role="status"
      className="w-full flex flex-col p-4 rounded animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
      style={{ zIndex: 1 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-44"></div>
        </div>
        <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-44"></div>
      </div>
      <div className="flex gap-4">
        <div className="flex shadow p-4 w-1/4 items-center rounded-lg justify-between mt-10">
          <div className="flex gap-2">
            <div className="rounded-full bg-gray-300 h-12 w-12"></div>
            <div className="flex flex-col mt-2">
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
        <div className="flex shadow p-4 w-1/4 items-center rounded-lg justify-between mt-10">
          <div className="flex gap-2">
            <div className="rounded-full bg-gray-300 h-12 w-12"></div>
            <div className="flex flex-col mt-2">
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
        <div className="flex shadow p-4 w-1/4 items-center rounded-lg justify-between mt-10">
          <div className="flex gap-2">
            <div className="rounded-full bg-gray-300 h-12 w-12"></div>
            <div className="flex flex-col mt-2">
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
        <div className="flex shadow p-4 w-1/4 items-center rounded-lg justify-between mt-10">
          <div className="flex gap-2">
            <div className="rounded-full bg-gray-300 h-12 w-12"></div>
            <div className="flex flex-col mt-2">
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center mt-8 justify-between">
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded-lg dark:bg-gray-600 w-48"></div>
          <div className="h-10 bg-gray-300 rounded-lg dark:bg-gray-600 w-28"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-300 rounded-lg dark:bg-gray-700 w-8"></div>
          <div className="h-10 bg-gray-300 rounded-lg dark:bg-gray-700 w-8"></div>
          <div className="h-10 bg-gray-300 rounded-lg dark:bg-gray-700 w-8"></div>
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <div className="h-8 w-32 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
        <div className="h-8 w-32 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
        <div className="h-8 w-32 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
        <div className="h-8 w-32 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
        <div className="h-8 w-32 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
        <div className="h-8 w-32 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
        <div className="h-8 w-32 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
      </div>
      <div>
        <div className="h-4 mt-4 w-full bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        <div className="h-4 mt-4 w-full bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        <div className="h-4 mt-4 w-full bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        <div className="h-4 mt-4 w-full bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        <div className="h-4 mt-4 w-full bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        <div className="h-4 mt-4 w-full bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        <div className="h-4 mt-4 w-full bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        <div className="h-4 mt-4 w-full bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        <div className="h-4 mt-4 w-full bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        <div className="h-4 mt-4 w-full bg-gray-200 rounded-lg dark:bg-gray-600"></div>
        <div className="h-4 mt-4 w-full bg-gray-200 rounded-lg dark:bg-gray-600"></div>
      </div>
      <div className="flex justify-end">
        <div className="h-10 mt-4 w-80 bg-gray-300 rounded-lg dark:bg-gray-600"></div>
      </div>
    </div>
  );
};

export default CategoryListSekeleton;
