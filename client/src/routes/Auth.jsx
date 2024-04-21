import { Link } from "react-router-dom";
import AuthTabs from "../components/auth/AuthTabs";
import Signup from '../components/auth/Signup';
import Login from '../components/auth/Login';


export default function Auth() {
  return (
    <div className="h-dvh flex flex-col justify-center items-center landing-page__bg">
      <nav className='flex w-full p-4 justify-between items-center'>
        <span className='ff-hughs text-2xl'>Zuptalk</span>

        <Link to="/" className="button text-primary">
          Home
        </Link>
      </nav>
      <div className="w-full max-w-[400px] grow p-4 gap-4 flex flex-col justify-center items-center">

        <Signup />
        <Login />

      </div>
    </div>
  );
}
