import AlreadySendEmail from '../../assets/img/auth/alreadySendEmail.png';

export default function ModalResetPasswordSuccess() {
  return (
    <div className="w-full mt-4 p-4 text-center bg-white rounded-lg sm:p-8 dark:!bg-navy-700 dark:border-gray-700">
      <div className="flex justify-center items-center">
        <img
          src={AlreadySendEmail}
          className="max-w-[300px]"
          alt="alreadySend.jpg"
        />
      </div>
      <h5 className="mb-2 font-bold text-gray-900 dark:text-white mt-4 text-xl">
        Link reset password sudah terkirim
      </h5>
      <div className="flex justify-center flex-col gap-4">
        <h4>Silahkan cek email anda, untuk memperbarui password anda</h4>
      </div>
    </div>
  );
}
