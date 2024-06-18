import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../../components/layout/Navbar';
import { blogs } from '../../constants/blogs';

export default function Blogs() {

    return (
        <>
            <Helmet>
                <title>Zuptalk | </title>
                <meta name="description" content={''}
                />
            </Helmet>
            <main className='landing-page__bg text-white '>
                <section className='flex flex-col h-dvh'>
                    <Navbar />

                    <div className='section text-white flex flex-col gap-6 md:gap-12 justify-start items-start md:justify-center'>
                        <h1 className='text-3xl md:text-5xl font-bold mt-12'>
                            Blogs
                        </h1>
                        <article className='flex flex-wrap gap-4 justify-between'>
                            {
                                blogs.map((b, i) => {
                                    return <Link key={b.id} to={`/blog/${i + 1}`} className='block rounded-[1em] hover-zoom bg-[#0E0E0E] w-full md:max-w-[400px] p-3 text-lg md:text-xl my-4'>
                                        <img className='transition-all duration-[250ms] rounded-[0.5em]' src={b.img} />
                                        <h2 className='py-2 pt-4 font-semibold'>
                                            {b.heading}
                                        </h2>

                                    </Link>
                                })
                            }
                        </article>
                    </div>
                </section>
            </main>
        </>
    )
}

