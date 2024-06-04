import React from 'react'
import Navbar from '../components/layout/Navbar';

import { aboutUs, aboutOurProduct } from '../constants/about-us';

export default function AboutUs() {
    return (
        <div className="relative flex flex-col landing-page__bg">
            <Navbar />

            <main className='text-white px-6 md:px-[3.5rem] py-4 md:py-0 grow flex flex-col gap-2 md:gap-6 justify-start items-start md:justify-center'>

                <section className='my-6 md:my-6 md:mt-10 w-full md:w-[90%]'>
                    <h1 className='text-2xl md:text-5xl font-bold my-2 md:mb-4'>
                        About Us
                    </h1>
                    <p className='my-4 text-lg md:text-3xl list-disc md:leading-[2.5rem]'>
                        Take your YouTube live streams to the next level with Zuptalk – Start engaging with your audience through real-time audio chats today!
                    </p>
                    <p className='my-4 text-lg md:text-3xl list-disc md:leading-[2.5rem]'>
                        Welcome to Zuptalk! We are a team of passionate innovators dedicated to transforming how YouTubers interact with their audiences. Our mission is to create tools that enhance the live-streaming experience, making it more engaging, personal, and fun.
                    </p>

                </section>

                <>
                    {
                        aboutUs.map((section, i) => {

                            return <section key={i} className='my-6 md:my-6 w-full md:w-[90%]'>
                                <h2 className='text-xl md:text-3xl mb-4 md:mb-4'>
                                    {section.heading}
                                </h2>

                                {
                                    section.content.length > 0 && section.content.map((para, i) => {
                                        return <p key={i} className='my-4 text-lg md:text-3xl list-disc md:leading-[2.5rem]'>
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
                        <section className='my-6 md:my-6 md:mt-10 w-full md:w-[90%]'>
                            <h1 className='text-2xl md:text-5xl font-bold my-2 md:mb-4'>
                                About Our Product
                            </h1>
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
    )
}
