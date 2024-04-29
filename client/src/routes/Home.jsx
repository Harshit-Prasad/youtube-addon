import React from 'react'
import { Link } from 'react-router-dom'
export default function Home() {

    return (
        <div className='landing-page__bg text-white flex flex-col h-dvh'>
            <nav className="navbar">
                <span className="logo">
                    Zuptalk
                </span>

                <div className='flex items-center gap-3 ff-hughs text-xl'>
                    <Link to='/explore-use-cases' className='link'>
                        Explore Use Cases
                    </Link>
                    {/* <Link className='link' to='/welcome' >
                        Profile
                    </Link> */}
                </div>
            </nav>

            <main className='text-white px-6 md:px-[3.5rem] py-4 md:py-0 grow flex flex-col gap-12 md:gap-20 justify-start items-start md:justify-center'>
                <h1 className="text-3xl mt-6 md:leading-[4.5rem] md:text-[2.5rem] xl:text-[3.75rem] font-bold">
                    Introducing the world's first <br className='hidden md:block' />
                    seamless audio chat experience for <br className='hidden md:block' />
                    YouTube <span className='text-[#ff2323]'>•Livestreams</span>
                </h1>

                <h2 className='text-2xl md:text-5xl font-semibold'>
                    Now hear what your fans have to say
                </h2>

                <Link to='/join-waitlist' className='link mt-6 px-16'>
                    Join the Waitlist
                </Link>
            </main>
        </div>
    )
}
