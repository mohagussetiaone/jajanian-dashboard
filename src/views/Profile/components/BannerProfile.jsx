import profile from 'assets/img/avatars/avatar.png';
import BGGradient from './BGGradient';

const BannerProfile = ({ data }) => {
  const imageSrc = data?.image
    ? `data:image/png;base64,${data.image}`
    : profile;

  return (
    <div className="items-center w-full h-full p-[16px] bg-cover">
      <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover">
        <div className="w-full h-full rounded-xl overflow-hidden">
          <BGGradient />
        </div>
        <div className="absolute -bottom-12 flex h-[100px] w-[100px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
          <img
            className="h-full w-full rounded-full bg-white/70"
            src={imageSrc}
            alt="profile.jpg"
          />
        </div>
      </div>

      {/* Name and position zzzzzzzzzzzzzz */}
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {data?.name}
        </h4>
      </div>

      {/* Post followers */}
      {/* <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">1 Jan 2023</p>
          <p className="text-sm font-normal text-gray-600">Tanggal berlangganan</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">30 Mbps</p>
          <p className="text-sm font-normal text-gray-600">Paket internet</p>
        </div>
      </div> */}
    </div>
  );
};

export default BannerProfile;
