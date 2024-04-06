import { Link } from "react-router-dom";
import { useAuth } from '../providers/AuthProvider'
import { useUserInfoStore } from '../services/store';

export default function Home() {

  const { isAuth } = useAuth();
  const { role } = useUserInfoStore(state => state)

  return (
    <div className='h-dvh flex flex-col landing-page__bg'>
      <nav className='bg-black flex justify-between items-center px-2 md:px-6 py-2 md:py-4 font-bold'>
        <span className='text-xl md:text-3xl text-white font-hughs'>
          Zuptalk
        </span>

        <div className='flex items-center gap-3'>
          <Link to={isAuth && role === 'admin' ? '/dashboard' : '/navigate-to'} className='font-hughs inline-block px-4 py-1 md:px-8 md:py-2 text-black bg-[#00E5BC] rounded-full'>
            {isAuth && role === 'admin' ? 'Dashboard' : 'Join a stream'}
          </Link>
          <Link to='/explore-use-cases' className='font-hughs hidden md:inline-block px-4 py-1 md:px-8 md:py-2 text-black bg-[#00E5BC] rounded-full'>
            Explore the Cases
          </Link>
          <Link to='/explore-use-cases' className='font-hughs inline-block md:hidden px-4 py-1 md:px-8 md:py-2 text-black bg-[#00E5BC] rounded-full'>
            Use Cases
          </Link>
        </div>
      </nav>

      <main className='text-white px-6 py-4 md:py-0 grow flex flex-col justify-start items-start md:justify-center'>
        <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-24 md:leading-[4.5rem]">
          Introducing the world's first <br/>
          seamless audio chat experience for <br/>
          YouTube <span className='text-[#ff2323]'>•Livestreams</span>
        </h1>

        <h2 className='text-2xl md:text-4xl font-bold my-12 md:mb-24'>
          Now hear what your fans have to say
        </h2>

         <Link to='/join-waitlist' className='font-hughs font-bold inline-block mt-12 md:mt-0 px-4 py-1 md:px-8 md:py-2 text-black bg-[#00E5BC] rounded-full'>
          Join the Waitlist
        </Link>
      </main>
    </div>

  )
}
