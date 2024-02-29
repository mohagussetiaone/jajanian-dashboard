import { Link } from 'react-router-dom';
const ResetPassword = () => {
  const backgroundImageStyle = {
    backgroundImage:
      'url(https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)', // Mengatur URL gambar latar belakang dari Unsplash
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: '0.9',
  };

  return (
    <section
      className="antialiased py-24 h-screen bg-slate-200"
      style={backgroundImageStyle}
    >
      <div className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow shadow-slate-300">
        <h1 className="text-4xl flex justify-start font-medium text-black">
          Reset password
        </h1>
        <p className="text-slate-500 flex justify-start">
          Fill up the form to reset the password
        </p>
        <form action="" className="my-10">
          <div className="flex flex-col space-y-5">
            <label htmlFor="email">
              <p className="font-medium flex justify-start text-slate-700 pb-2">
                Email address <span className="text-red-500"> *</span>
              </p>
              <input
                type="email"
                name=""
                id=""
                placeholder="Enter Email Address"
                className="w-full text-black px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                autoFocus
                autoComplete="on"
                required
              />
            </label>

            <button className="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center">
              <span>Reset password</span>
            </button>

            <div className="text-center flex justify-end">
              {/* <span className="text-black">Kembali </span> */}
              <a
                href="#"
                className="font-medium inline-flex space-x-1 items-center"
              >
                <Link to="/signin" className="text-gray-800">
                  {'  '}
                  <span className="text-indigo-600 cursor-pointer hover:text-indigo-600text-md">
                    {'  '}Sign in
                  </span>
                </Link>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
