import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import { blogs } from '../constants/blogs';

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

                        {
                            blogs.map((b) => {
                                return <>
                                    <Link to={`/blog/${b.id}`} className='text-lg md:text-xl leading-4 border-none hover:border-white hover:border-b hover:border-solid my-4 py-1'>
                                        {b.blog.heading}
                                    </Link>
                                </>
                            })
                        }
                    </div>
                </section>
            </main>
        </>
    )
}

