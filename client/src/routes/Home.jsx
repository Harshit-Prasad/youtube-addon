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
import { ChevronDown, ChevronUp } from 'lucide-react';
export default function Home() {

    return (
        <>
            <Helmet>
                <title>Zuptalk | An Ultimate Platform For Interactive Audio Chats On YouTube Livestreams</title>
                <meta name="description" content="Learn how to talk on YouTube live streams with your audience in real time to make your live streams more engaging. Let's enhance your live stream audio chat experience with Zuptalk and connect like never before."
                />
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
                <section className='section my-8'>
                    <h2 className='text-2xl md:text-5xl font-semibold my-8'>
                        FAQs
                    </h2>
                    <div className='flex flex-col justify-center items-center'>
                        <Accordion className='w-full' allowZeroExpanded>
                            {
                                faqs.paragraph.map((p) => {

                                    return <AccordionItem className='text-black'>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                <div className='flex justify-between items-center bg-[#f4f4f4] hover:bg-[rgba(244,244,244,0.9)] p-4 border border-solid border-black'>
                                                    <span className='text-xl'>
                                                        {p.heading}
                                                    </span>
                                                    <span>
                                                        <AccordionItemState>
                                                            {
                                                                ({ expanded }) => {
                                                                    return expanded ? <ChevronUp /> : <ChevronDown />
                                                                }
                                                            }
                                                        </AccordionItemState>
                                                    </span>
                                                </div>
                                            </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel className='text-white bg-[rgba(0,0,0,0.25)] p-4 text-xl'>
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
                                    return <AccordionItem className='text-black'>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                <div className='flex justify-between items-center bg-[#f4f4f4] hover:bg-[rgba(244,244,244,0.9)] p-4 border border-solid border-black'>
                                                    <span className='text-xl'>
                                                        {l.heading}
                                                    </span>
                                                    <span>
                                                        <AccordionItemState>
                                                            {
                                                                ({ expanded }) => {
                                                                    return expanded ? <ChevronUp /> : <ChevronDown />
                                                                }
                                                            }
                                                        </AccordionItemState>
                                                    </span>
                                                </div>
                                            </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel className='text-white bg-[rgba(0,0,0,0.25)] p-4 text-xl'>
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
