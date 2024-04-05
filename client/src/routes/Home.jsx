import { Link } from "react-router-dom";

export default function Home() {

  return (
    <div className='h-dvh flex flex-col landing-page__bg'>
      <nav className='bg-black flex justify-between items-center px-6 py-4 font-bold'>
        <span className='text-3xl text-white font-hughs'>
          Zuptalk
        </span>

        <Link to='/explore-use-cases' className='font-hughs inline-block px-8 py-2 text-black bg-[#00E5BC] rounded-full'>
          Explore the Cases
        </Link>
      </nav>

      <main className='text-white px-6 flex-1 flex flex-col items-start justify-center'>
        <h1 className="text-6xl font-bold mb-24 leading-[4.5rem]">
          Introducing the world's first <br/>
          seamless audio chat experience for <br/>
          YouTube <span className='text-[#ff2323]'>•Livestreams</span>
        </h1>

        <h2 className='text-4xl font-bold mb-24'>
          Now hear what your fans have to say
        </h2>

         <Link to='/join-waitlist' className='font-hughs font-bold inline-block px-8 py-2 text-black bg-[#00E5BC] rounded-full'>
          Join the Waitlist
        </Link>
      </main>
    </div>

  )
}
