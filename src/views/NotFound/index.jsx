import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-200 px-4 md:px-16">
      <div className="flex flex-col items-center justify-center rounded-lg bg-white px-4 py-8 text-center md:px-8 lg:px-24">
        <p className="text-5xl font-bold tracking-wider text-gray-300 md:text-4xl lg:text-8xl">
          404
        </p>
        <p className="mt-4 text-2xl font-bold tracking-wider text-gray-500 md:text-3xl lg:text-5xl">
          Halaman tidak ditemukan
        </p>
        <p className="mt-4 border-b-2 pb-4 text-center text-gray-500">
          Maaf, halaman yang anda cari tidak dapat ditemukan.
        </p>
        <div
          href="#"
          className="mt-6 flex items-center space-x-2 rounded bg-blue-600 px-4 py-2 text-gray-100 transition duration-150 hover:bg-blue-700"
          title="Return Home"
        >
          <hr />
          <button onClick={handleGoBack}>Kembali ke halaman sebelumnya</button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
