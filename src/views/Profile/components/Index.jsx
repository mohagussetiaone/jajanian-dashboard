import BannerProfile from './BannerProfile';
import { useProfileStore } from 'store/Profile/StoreProfile';

const Profile = () => {
  const { profile } = useProfileStore();
  return (
    <>
      {profile && (
        <div className="flex w-full flex-col gap-5">
          <div className="w-ful flex h-fit flex-col ">
            <BannerProfile data={profile} />
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
