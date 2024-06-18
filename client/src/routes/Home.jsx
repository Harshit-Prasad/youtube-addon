import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
    AccordionItemState,
} from 'react-accessible-accordion';
import Navbar from '../components/layout/Navbar'
import { faqs } from '../constants/faq';
import { ChevronDown } from 'lucide-react';
export default function Home() {

    const pageContent = [
        {
            subHeading: 'Talk to Fans On YouTube Live',
            paragraphs: [
                'Zuptalk introduces an innovative way for YouTubers to engage with their audience during live streams through real-time voice chat. Unlike traditional text-based interactions, Zuptalk allows content creators to speak directly with their viewers.',
                'By enabling audio chat on YouTube live streams, Zuptalk enhances audience engagement significantly. Creators can invite viewers to join the conversation vocally, encouraging them to ask questions, share their thoughts, and participate in discussions in real-time.',
                'For YouTubers looking to make their live streams more dynamic and engaging, Zuptalk offers a user-friendly solution that transforms how they communicate with their audience. It\'s a tool that enhances the interactivity of live content, making it easier for creators to create memorable streaming experiences.Discover how to implement real- time voice chat and enrich your YouTube live streams with Zuptalk today.',
            ]
        },
        {
            subHeading: 'Why Choose Zuptalk for Your YouTube Live Streams?',
            paragraphs: [
                'Discover a new era of interactive broadcasting with Zuptalk\'s innovative real - time voice chat feature.Unlike traditional text - based methods, Zuptalk empowers creators to talk to fans on YouTube live directly through spoken conversation, fostering deeper connections and real - time feedback.Whether you\'re hosting Q&A sessions, live interviews, or interactive workshops, Zuptalk enhances viewer participation by inviting them to join discussions effortlessly.',
                'Integrated seamlessly with YouTube, Zuptalk ensures easy setup and compatibility, amplifying audience engagement and making your live streams more captivating and memorable. Elevate your content strategy with Zuptalk and unlock a dynamic way to connect with your audience in real-time. Step into the future of live streaming, where every word you speak enhances your viewers\' experience and boosts your brand presence.',
                '',
            ]
        },
    ]

    return (
        <>
            <Helmet>
                <title>Enhance YouTube Live Streams with Real-Time Voice Chat | Zuptalk</title>
                <meta name="description" content="Discover how to talk on YouTube Live with Zuptalk's real-time voice chat feature. Engage with viewers on YouTube live directly and make your Live stream audio interaction better." />
            </Helmet>
            <main className='landing-page__bg text-white '>
                <section className='flex flex-col h-dvh'>
                    <Navbar />

                    <div className='section text-white  grow flex flex-col gap-12 md:gap-20 justify-start items-start md:justify-center'>
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
                    </div>
                </section>

                {
                    pageContent.map(section => {
                        return <section className='section'>
                            <h2 className="text-3xl mt-16 md:leading-[4.5rem] md:text-5xl font-semibold">
                                {section.subHeading}
                            </h2>
                            {
                                section.paragraphs.map(paragraph => {
                                    return <p className='text-2xl md:text-2xl mt-4'>
                                        {paragraph}
                                    </p>
                                })
                            }
                        </section>
                    })
                }

                <section className='section my-12'>
                    <h2 className='text-4xl md:text-5xl font-semibold my-8'>
                        FAQs
                    </h2>
                    <div className='flex flex-col justify-center items-center'>
                        <Accordion className='w-full' allowZeroExpanded>
                            {
                                faqs.paragraph.map((p) => {

                                    return <AccordionItem className='text-white'>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                <div className='flex justify-between items-center bg-transparent hover:bg-[rgba(14,14,14,0.25)] p-8 px-2 pb-1 border-b border-b-solid border-green-800'>
                                                    <span className='text-2xl font-semibold'>
                                                        {p.heading}
                                                    </span>
                                                    <span>
                                                        <AccordionItemState>
                                                            {
                                                                ({ expanded }) => {
                                                                    return <ChevronDown color='rgb(134 239 172)' className={`${expanded && 'rotate-180'} transition-[rotate] duration-[250ms] ease-in`} />
                                                                }
                                                            }
                                                        </AccordionItemState>
                                                    </span>
                                                </div>
                                            </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel className='text-green-300 p-4 px-2 text-lg'>
                                            {
                                                p.paragraphs.map(paragraph => {
                                                    return <p>{paragraph}</p>
                                                })
                                            }
                                        </AccordionItemPanel>
                                    </AccordionItem>

                                })
                            }
                            {
                                faqs.list.map(l => {
                                    return <AccordionItem className='text-white'>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                <div className='flex justify-between items-center bg-transparent hover:bg-[rgba(14,14,14,0.25)] p-8 px-2 pb-1 border-b border-b-solid border-green-800'>
                                                    <span className='text-2xl font-semibold'>
                                                        {l.heading}
                                                    </span>
                                                    <span>
                                                        <AccordionItemState>
                                                            {
                                                                ({ expanded }) => {
                                                                    return <ChevronDown color='rgb(134 239 172)' className={`${expanded && 'rotate-180'} transition-[rotate] duration-[250ms] ease-in`} />
                                                                }
                                                            }
                                                        </AccordionItemState>
                                                    </span>
                                                </div>
                                            </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel className='text-green-300 p-4 px-2 text-lg'>
                                            {
                                                l.paragraphs.map(paragraph => {
                                                    return <>
                                                        {
                                                            paragraph.paragraphs.map((p) => {
                                                                return <p>{p}</p>
                                                            })
                                                        }
                                                    </>
                                                })
                                            }
                                            {
                                                l.list.map((point, i) => {
                                                    return <p>{i + 1}. {point}</p>
                                                })
                                            }
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                })
                            }
                        </Accordion>
                    </div>
                </section>
            </main>
        </>
    )
}
