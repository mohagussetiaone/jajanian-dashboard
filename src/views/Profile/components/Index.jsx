import BannerProfile from './BannerProfile';
import InformasiPribadi from './InformasiPribadi';
import { useProfileStore } from 'store/Profile/StoreProfile';

const Profile = () => {
  const { profile } = useProfileStore();
  console.log('profile', profile);
  return (
    <>
      {profile && (
        <div className="flex w-full flex-col gap-5">
          <div className="w-ful mt-3 flex h-fit flex-col ">
            <BannerProfile data={profile} />
          </div>
          <div className="lg:!grid-cols-12">
            <div className="lg:col-span-4 lg:mb-0 3xl:col-span-4">
              <InformasiPribadi data={profile} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
