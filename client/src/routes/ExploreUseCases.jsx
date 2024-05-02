import React from 'react'
import { Link } from 'react-router-dom'

const pageContent = [
  {
    heading: 'Supercharge Audience Interaction:',
    points: [
      {
        highlight: 'Live Q&A:',
        content: 'Host engaging "Ask Me Anything" sessions for any content creator, from gamers to celebrities'
      },
      {
        highlight: 'Live Game Streaming:',
        content: 'Level up your streams with live voice interaction between players and viewers'
      },
    ]
  },
  {
    heading: 'Unlock New Content Formats:',
    points: [
      {
        highlight: 'Stock Market Insights:',
        content: 'Offer live audio consultations for informed investment decisions'
      },
      {
        highlight: 'Product Launches:',
        content: 'Generate excitement with live Q&A sessions during product launches'
      },
      {
        highlight: 'Event Promotions:',
        content: 'Connect stars with fans and create buzz through interactive audio sessions'
      },
    ]
  },
  {
    heading: 'Empower Professionals and Learners:',
    points: [
      {
        highlight: 'Group Therapy Sessions:',
        content: 'Facilitate open discussions and support in a safe audio environment'
      },
      {
        highlight: 'Ed-Tech Made Interactive:',
        content: 'Solve student doubts in real-time with live audio explanations'
      },
      {
        highlight: 'Astrology Consultations:',
        content: 'Deliver personalized readings with a more natural, voice-based approach'
      },
    ]
  },
  {
    heading: 'Zuptalk caters to a wide range of content creators, including:',
    points: [
      {
        highlight: 'Just Chatting Streamers:',
        content: 'Discuss the latest trends, answer burning questions, or simply hang out with your fans'
      },
      {
        highlight: 'Coding Classes:',
        content: 'Facilitate collaborative learning with live audio discussions'
      },
      {
        highlight: 'Cooking Demonstrations:',
        content: 'Make learning fun and interactive with real-time Q&A during live streams'
      },
      {
        highlight: 'Teachers of All Subjects:',
        content: 'Bring your lessons to life with engaging audio discussions'
      },
      {
        highlight: 'Small Businesses:',
        content: 'Boost sales through interactive product demonstrations and live customer support'
      }
    ]
  },
]

export default function ExploreUseCases() {
  return (
    <div className='relative flex flex-col landing-page__bg'>
      <nav className='navbar'>
        <Link to='/' className='logo'>
          Zuptalk
        </Link>

        <Link to='/join-waitlist' className='link'>
          Join the Waitlist
        </Link>
      </nav>

      <main className='text-white px-6 md:px-[3.5rem] flex-1 py-4 md:py-8'>
        <h1 className='text-2xl md:text-5xl font-bold my-6 md:mb-8'>
          Engage with Your Audience Like Never Before with Zuptalk
        </h1>

        <h2 className='text-xl md:text-3xl mb-4 md:mb-8'>
          Zuptalk is the all-in-one solution for interactive YouTube Livestreams.
          <br />
          Here's how it could be used:
        </h2>

        {
          pageContent.map((section, i) => {
            return <section key={i} className='my-6 md:my-10 w-full md:w-[80%]'>
              <h3 className='text-lg md:text-4xl font-bold md:font-semibold my-2 md:my-4'>{section.heading}</h3>
              <ul>
                {section.points.map((point, i) => {
                  return <li key={i} className='my-2 ms-6 text-lg md:text-3xl list-disc md:leading-[2.5rem]'>
                    <span className='font-semibold'>{point.highlight}</span>&nbsp;
                    {point.content}
                  </li>
                })}
              </ul>
            </section>
          })
        }

        <div className='flex w-full justify-center items-center my-16'>
          <Link to='/join-waitlist' className='link px-16 md:my-8'>
            Join the Waitlist
          </Link>
        </div>
      </main>
    </div>
  )
}
