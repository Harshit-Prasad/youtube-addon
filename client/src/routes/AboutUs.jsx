import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom';

import Navbar from '../components/layout/Navbar';
import { aboutUs, aboutOurProduct } from '../constants/about-us';
import { MoveDown } from 'lucide-react';

export default function AboutUs() {
    return (
        <>
            <Helmet>
                <title>Zuptalk | Explore More About Us</title>
                <meta name="description" content="Take your YouTube live streams to the next level with Zuptalk. Talk to fans and enjoy real-time voice chat on YouTube Live. Experience live stream audio interaction like never before."
                />
                <link rel="canonical" href="/about-us" />
            </Helmet>
            <div className="relative flex flex-col landing-page__bg">

                <Navbar />

                <main className='text-white px-6 md:px-[3.5rem] py-4 md:py-0 grow flex flex-col gap-2 md:gap-6 justify-start items-start md:justify-center'>

                    <section className='my-4 md:my-6 md:mt-10 w-full h-[100%] md:h-[80%] flex justify-center md:items-center flex-col'>
                        <h1 className='text-3xl text-center md:text-5xl font-bold my-2 md:mt-8 md:w-[75%]'>
                            About Us
                        </h1>
                        <p className='mt-6 text-lg text-center md:text-3xl list-disc md:leading-[2.5rem] md:w-[75%]'>
                            Take your YouTube live streams to the next level with Zuptalk – Start engaging with your audience through real-time audio chats today!
                        </p>
                        <p className='mt-6 text-lg text-center md:text-xl list-disc md:leading-[2.5rem] md:w-[75%]'>
                            Welcome to Zuptalk! We are a team of passionate innovators dedicated to transforming how YouTubers interact with their audiences. Our mission is to create tools that enhance the live-streaming experience, making it more engaging, personal, and fun.
                        </p>
                        <div className='mt-8 md:mt-16 md:w-[75%] flex justify-center items-center'>
                            <Link to='/join-waitlist' className="link">Join Waitlist</Link>
                        </div>
                        <div className='mt-8 md:mt-32 md:w-[75%] flex justify-center items-center'>
                            <MoveDown size={36} className="animate-bounce" />
                        </div>
                    </section>

                    <>
                        {
                            aboutUs.map((section, i) => {
                                const isEven = i % 2;

                                return <section key={i} className={`my-6 md:my-6 flex justify-center md:items-${isEven ? 'start' : 'end'} flex-col`}>
                                    <h2 className='text-xl md:text-3xl mb-4 md:mb-4'>
                                        {section.heading}
                                    </h2>

                                    {
                                        section.content.length > 0 && section.content.map((para, i) => {
                                            return <p key={i} className='my-4 w-100 md:w-[50%] text-lg md:text-2xl list-disc md:leading-[2.5rem]'>
                                                {para}
                                            </p>
                                        })
                                    }
                                </section>
                            })
                        }
                    </>

                    <>
                        {
                            <section className='my-6 md:my-6 md:mt-10 w-full'>
                                <h2 className='text-center text-2xl md:text-5xl font-bold my-2 md:mb-4'>
                                    About Our Product
                                </h2>
                                <p className='my-4 text-lg md:text-3xl list-disc md:leading-[2.5rem]'>
                                    Zuptalk is an all-in-one solution that allows YouTubers to talk with their fans in real time during live streams. Here's what makes Zuptalk special:
                                </p>

                                <ul>
                                    {
                                        aboutOurProduct.map((list, i) => {
                                            return <li key={i} className='my-4 ms-6 text-lg md:text-3xl list-disc md:leading-[2rem]'>
                                                <span className='font-semibold'>{list.heading}:</span>&nbsp;
                                                <span className='text-lg md:text-2xl'>
                                                    {list.content}
                                                </span>
                                            </li>
                                        })
                                    }
                                </ul>

                                <p className='my-4 text-lg md:text-3xl list-disc md:leading-[2.5rem]'>
                                    At Zuptalk, we are constantly innovating and improving our platform to meet the needs of our users. We are committed to providing the best tools and support to help you grow your community and make your live streams more exciting.
                                </p>

                            </section>
                        }
                    </>

                </main>
            </div>
        </>
    )
}
