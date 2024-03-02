import { Link } from 'react-router-dom';

const InformasiPribadi = ({ data }) => {
  console.log('data pada informasi pribadi', data);
  return (
    <div className="w-full h-full p-3">
      <div className="mt-2 mb-2 md:mb-4 w-full">
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          Informasi Pribadi
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:px-2">
        <div className="rounded-lg bg-gray-100/50 px-3 md:py-4 dark:!bg-navy-700 dark:shadow-none">
          <p className="font-semibold">Nama Lengkap</p>
          <p className="text-sm font-medium text-navy-700 dark:text-white">
            {data?.nama_lengkap}
          </p>
        </div>
        <div className="rounded-lg bg-gray-100/50 px-3 md:py-4 dark:!bg-navy-700 dark:shadow-none">
          <p className="font-semibold">Email</p>
          <p className="text-sm font-medium text-navy-700 dark:text-white">
            {data?.email}
          </p>
        </div>
        <div className="rounded-lg bg-gray-100/50 px-3 md:py-4 dark:!bg-navy-700 dark:shadow-none">
          <p className="font-semibold">Nomor Telepon</p>
          <p className="text-sm font-medium text-navy-700 dark:text-white">
            {data?.no_telepon}
          </p>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Link
            to="/pengaturan"
            className="text-sm text-gray-600 self-end ml-3"
          >
            Ubah informasi data ?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InformasiPribadi;
