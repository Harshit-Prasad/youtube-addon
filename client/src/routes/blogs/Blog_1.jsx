import React from 'react'
import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/layout/Navbar';

export default function Blog() {

    return (
        <>
            <Helmet>
                <title>Zuptalk | How does Zuptalk enhance viewer engagement on YouTube live streams?</title>
                <meta name="description" content='Zuptalk enhances viewer engagement by allowing real-time voice chats during live streams'
                />
            </Helmet>
            <main className='landing-page__bg text-white '>
                <section className='flex flex-col h-dvh'>
                    <Navbar />

                    <div className='section text-white flex flex-col gap-6 md:gap-12 justify-start items-start md:justify-center'>
                        <h1 className='text-3xl md:text-5xl font-bold mt-12'>
                            How does Zuptalk enhance viewer engagement on YouTube live streams?
                        </h1>
                        <p className='text-lg md:text-xl'>
                            Zuptalk enhances viewer engagement by allowing real-time voice chats during live streams. This makes interactions more personal and dynamic, helping you connect with your audience on a deeper level. It’s a great way to engage with viewers on YouTube Live and create a more interactive streaming experience
                        </p>

                    </div>
                </section>
            </main>
        </>
    )
}
