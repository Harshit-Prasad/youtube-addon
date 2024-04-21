import { useState } from 'react';
import { Link } from "react-router-dom";
import { useUserInfoStore } from "../services/store";
import Profile from '../components/ui/Profile';
import Popup from '../components/ui/Popup';
import { createPortal } from 'react-dom';
import AdminToggle from '../components/ui/AdminToggle';

export default function ProtectedRoute() {
  const userInfo = useUserInfoStore((state) => state);
  const [profileIsOpen, setProfileIsOpen] = useState(false)

  return (
    <div className="h-dvh items-center justify-between flex flex-col p-2 landing-page__bg text-white">
      <nav className="w-full flex items-center justify-between px-6">
        <Link className="ff-hughs text-2xl" to="/">
          Zuptalk
        </Link>

        <button onClick={() => {
          setProfileIsOpen(true)
        }} className="button">
          Profile
        </button>
      </nav>
      {profileIsOpen &&
        createPortal(<Popup setIsOpen={setProfileIsOpen} topCloseBtn={true}>
          <Profile />
        </Popup>,
          document.getElementById('profile-popup__center')
        )
      }

      <div className='items-center justify-center flex-col flex grow gap-4'>
        <div>

          You're logged in as a <span className='font-semibold'>{userInfo.role === 'admin' ? 'ADMIN' : 'USER'}</span>, toggle the switch to
          become a {userInfo.role === 'admin' ? 'User' : 'creator'}

        </div>
        <AdminToggle />

        {
          userInfo.role === 'admin' && <Link className="button" to="/dashboard">Dashboard</Link>
        }
      </div>
    </div>
  );
}
