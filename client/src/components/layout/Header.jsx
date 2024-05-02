import { Link } from 'react-router-dom';
import { useAuth } from "../../providers/AuthProvider";
import { useUserInfoStore } from '../../services/store';
import ProfileToggle from '../ui/ProfileToggle';

export default function UserNavbar() {
  const { isAuth } = useAuth();
  const userInfo = useUserInfoStore(state => state)


  return (
    <header className="hidden z-[1] bg-[#0f0f0f] p-2 md:flex justify-between items-center w-full">
      <Link to={isAuth ? userInfo.role === 'admin' ? '/dashboard' : '/' : '/auth'} className="logo text-3xl">Zuptalk</Link>

      {isAuth && (
        <ProfileToggle />
      )}
    </header>
  );
}
