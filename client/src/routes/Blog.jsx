import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/layout/Navbar';
import { blogs } from '../constants/blogs';

export default function Blog() {
    const navigate = useNavigate()
    const params = useParams()

    const b = blogs?.[params.id];

    if (!b) {
        navigate('/blogs', { replace: true });
    }

    const metaTitle = b.blog.heading;
    const metaDescription = b.blog.paragraphs[0].paragraph.split(' ').slice(20).join(' ');

    return (
        <>
            <Helmet>
                <title>Zuptalk | {metaTitle}</title>
                <meta name="description" content={metaDescription}
                />
            </Helmet>
            <main className='landing-page__bg text-white '>
                <section className='flex flex-col h-dvh'>
                    <Navbar />

                    <div className='section text-white flex flex-col gap-6 md:gap-12 justify-start items-start md:justify-center'>
                        <h1 className='text-3xl md:text-5xl font-bold mt-12'>
                            {b.blog.heading}
                        </h1>

                        {
                            b.blog.paragraphs.map(p => {
                                return <>
                                    {p.subHeading && <h2 className='text-xl md:text-3xl'>{p.subHeading}</h2>}
                                    <p className='text-lg md:text-xl leading-4'>
                                        {p.paragraph}
                                    </p>
                                </>
                            })
                        }
                    </div>
                </section>
            </main>
        </>
    )
}
