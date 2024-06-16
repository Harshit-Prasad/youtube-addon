import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import { blogs, blogsImages } from '../constants/blogs';

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
                        <div className='flex flex-wrap'>
                            {
                                blogs.map((b) => {
                                    return <Link key={b.id} to={`/blog/${b.id}`} className='block rounded-[1em] hover-zoom bg-[#0E0E0E] w-full md:max-w-[400px] p-3 text-lg md:text-xl my-4'>
                                        <img className='transition-all duration-[250ms] rounded-[0.5em]' src={blogsImages?.[b.id]} />
                                        <h2 className='py-2 pt-4 font-semibold'>
                                            {b.blog.heading}
                                        </h2>

                                    </Link>
                                })
                            }
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

