import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function JoinWaitlist() {

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [channelLink, setChannelLink] = useState('');
  const [contactNo, setContactNo] = useState('')

  return (
    <div className='h-dvh md:flex md:flex-col landing-page__bg'>
      <nav className='bg-black flex justify-between items-center px-2 md:px-6 py-2 md:py-4 font-bold'>
        <Link to='/' className='text-xl md:text-3xl text-white font-hughs'>
          Zuptalk
        </Link>

        <Link to='/explore-use-cases' className='font-hughs inline-block px-4 py-1 md:px-8 md:py-2 text-black bg-[#00E5BC] rounded-full'>
          Explore the Cases
        </Link>
      </nav>

      <main className='text-white py-4 md:py-0 px-6 flex-1 flex flex-col items-start justify-center'>
        <h1 className='text-2xl md:text-4xl font-bold mb-6 md:mb-12'>
          Enter your details below & we’ll get back to you shortly
        </h1>

        <form onSubmit={() => {
          console.log({
            fullName,
            email,
            channelLink,
            contactNo,
          });
        }} className='w-full'>
          <div className='w-full max-w-[1200px]'>
            <div className='waitlist-form__input-container' >
              <label  className='waitlist-form__label' htmlFor="full-name">Full Name</label>
              <input onChange={(e) => {
                setFullName(e.target.value)
              }} className='waitlist-form__input' type="text" placeholder='Your full name' required id='full-name' />
            </div>
            <div className='waitlist-form__input-container' >
              <label  className='waitlist-form__label' htmlFor="email-address">Email Address</label>
              <input onChange={(e) => {
                setEmail(e.target.value)
              }} className='waitlist-form__input' type="email" placeholder='email@example.com' required  id='email-address' />
            </div>
            <div className='waitlist-form__input-container' >
              <label  className='waitlist-form__label' htmlFor="channel-link">Your Channel's link</label>
              <input onChange={(e) => {
                setChannelLink(e.target.value)
              }} className='waitlist-form__input' type="text" placeholder={`Your channel's link`} required id='channel-link' />
            </div>
            <div className='waitlist-form__input-container' >
              <label  className='waitlist-form__label' htmlFor="contact-number">Contact Number</label>
              <input onChange={(e) => {
                setContactNo(e.target.value)
              }} className='waitlist-form__input' type="number" placeholder='0000-000-000' required id='contact-number' />
            </div>
          </div>
          
          <button className='font-hughs block font-bold mt-8 md:mt-16 px-16 py-2 text-black bg-[#00E5BC] rounded-full mx-auto'>
            Submit
          </button>
        </form>
      </main>
    </div>
  )
}