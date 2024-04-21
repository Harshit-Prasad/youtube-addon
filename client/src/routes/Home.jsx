import React from 'react'
import { Link } from 'react-router-dom'
export default function Home() {

    return (
        <div className='landing-page__bg text-white flex flex-col h-dvh'>
            <nav className="navbar">
                <Link className="ff-hughs text-2xl" to="/">
                    Zuptalk
                </Link>

                <Link className='button capitalize' to='/welcome' >
                    Profile
                </Link>
            </nav>
        </div>
    )
}
