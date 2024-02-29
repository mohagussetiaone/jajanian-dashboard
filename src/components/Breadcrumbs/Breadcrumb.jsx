import { Link } from 'react-router-dom';

const Breadcrumb = ({ pageName }) => {
  return (
    <div className="mb-6 flex flex-col text-black dark:text-gray-100 md:flex-row gap-3">
      <div className="flex gap-2">
        <div className="flex">
          <Link className="text-sm md:text-base" to="/">
            Dashboard /
          </Link>
        </div>
        <div className="flex">
          <span className="text-sm font-bold md:text-base">{pageName}</span>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
