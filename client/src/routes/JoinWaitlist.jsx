import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from '../api/axios'

export default function JoinWaitlist() {

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [channelLink, setChannelLink] = useState('');
  const [contactNo, setContactNo] = useState('')

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (contactNo.length !== 10) {
      toast.error('Please give a valid contact number.')

      return;
    }

    try {
      const data = {
        fullName,
        email,
        channelLink,
        contactNo
      };

      const response = await axios.post('/save-waitlist', data);

      if (response.status === 200) {
        toast.success('Information saved successfully.')
      }

    } catch (error) {
      toast.error(error.message);
    }

    setFullName('')
    setEmail('')
    setChannelLink('')
    setContactNo('')
  };

  return (
    <div className='h-dvh md:flex md:flex-col landing-page__bg'>
      <nav className='bg-black flex justify-between items-center px-6 md:px-[3.5rem] py-2 md:py-4 border-b-[0.1px] border-white border-solid'>
        <Link to='/' className='logo'>
          Zuptalk
        </Link>

        <Link to='/explore-use-cases' className='link'>
          Explore Use Cases
        </Link>
      </nav>

      <main className='text-white py-4 md:py-0 px-6 md:px-[3.5rem] gap-8 flex-1 flex flex-col items-start justify-center'>
        <h1 className='text-4xl md:text-5xl font-bold md:mt-6'>
          Enter your details below & we’ll get back to you shortly
        </h1>

        <form onSubmit={handleFormSubmit} className='w-full flex flex-col gap-4 items-start'>
          <div className='w-full max-w-[1200px]'>
            <div className='waitlist-form__input-container' >
              <label className='waitlist-form__label' htmlFor="full-name">Full Name</label>
              <input onChange={(e) => {
                setFullName(e.target.value)
              }} className='waitlist-form__input' type="text" placeholder='Your full name' required id='full-name' value={fullName} />
            </div>
            <div className='waitlist-form__input-container' >
              <label className='waitlist-form__label' htmlFor="email-address">Email Address</label>
              <input onChange={(e) => {
                setEmail(e.target.value)
              }} className='waitlist-form__input' type="email" placeholder='email@example.com' required value={email} id='email-address' />
            </div>
            <div className='waitlist-form__input-container' >
              <label className='waitlist-form__label' htmlFor="channel-link">Your Channel's link</label>
              <input onChange={(e) => {
                setChannelLink(e.target.value)
              }} className='waitlist-form__input' type="text" placeholder={`Your channel's link`} required value={channelLink} id='channel-link' />
            </div>
            <div className='waitlist-form__input-container' >
              <label className='waitlist-form__label' htmlFor="contact-number">Contact Number</label>
              <input onChange={(e) => {
                setContactNo(e.target.value)
              }} className='waitlist-form__input' type="number" placeholder='0000-000-000' value={contactNo} required id='contact-number' />
            </div>
          </div>

          <button className='link text-2xl mt-8 px-12'>
            Submit
          </button>
        </form>
      </main>
    </div>
  )
}
