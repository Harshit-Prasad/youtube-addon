import { Link } from "react-router-dom";
import { useUserInfoStore } from "../services/store";
import AdminToggle from '../components/ui/AdminToggle';
import ProfileToggle from '../components/ui/ProfileToggle';

export default function ProtectedRoute() {
  const userInfo = useUserInfoStore((state) => state);

  return (
    <div className="h-dvh items-center justify-between flex flex-col landing-page__bg text-white">
      <nav className="navbar">
        <Link className="logo" to="/">
          Zuptalk
        </Link>

        <ProfileToggle />
      </nav>


      <div className='items-center justify-center flex-col flex grow gap-4'>
        <div className='text-xl'>

          You're logged in as a <span className='font-semibold'>{userInfo.role === 'admin' ? 'ADMIN' : 'USER'}</span>, toggle the switch to
          become a {userInfo.role === 'admin' ? 'User' : 'creator'}

        </div>
        <AdminToggle />

        {
          userInfo.role === 'admin' && <Link className="link mt-6" to="/dashboard">Dashboard</Link>
        }
      </div>
    </div>
  );
}
