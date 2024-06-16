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
                                    return <Link key={b.id} to={`/blog/${b.id}`} className='block rounded-[1em] hover-zoom bg-[rgba(255,255,255,0.1)] p-3 max-w-[350px] w-full aspect-square text-lg md:text-xl my-4'>
                                        <div className='aspect-square rounded-[0.5em]'>
                                            <img className='transition-all duration-[250ms] rounded-[0.5em]' width='100%' height='100%' src={blogsImages?.[b.id]} />
                                        </div>
                                        <h2 className='py-2'>
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

