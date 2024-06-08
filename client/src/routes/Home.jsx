import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Navbar from '../components/layout/Navbar'
export default function Home() {

    return (
        <>
            <Helmet>
                <title>Zuptalk | An Ultimate Platform For Interactive Audio Chats On YouTube Livestreams</title>
                <meta name="description" content="Learn how to talk on YouTube live streams with your audience in real time to make your live streams more engaging. Let's enhance your live stream audio chat experience with Zuptalk and connect like never before."
                />
            </Helmet>
            <div className='landing-page__bg text-white flex flex-col h-dvh'>
                <Navbar />

                <main className='text-white px-6 md:px-[3.5rem] py-4 md:py-0 grow flex flex-col gap-12 md:gap-20 justify-start items-start md:justify-center'>
                    <h1 className="text-3xl mt-6 md:leading-[4.5rem] md:text-[2.5rem] xl:text-[3.75rem] font-bold">
                        Introducing the world's easiest <br className='hidden md:block' />
                        audio chat experience for <br className='hidden md:block' />
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
        </>
    )
}
