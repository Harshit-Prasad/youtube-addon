import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navbar } from '../../constants/navbar'

export default function Navbar() {

    const location = useLocation()

    console.log(location);

    return (
        <nav className="navbar">
            <Link className="logo" to="/">
                Zuptalk
            </Link>

            <div className='flex gap-2 items-center'>
                {
                    navbar.map((route, i) => {

                        if (route.route == location.pathname) {
                            return;
                        }

                        return <Link key={i} className='link' to={route.route}>{route.name}</Link>
                    })
                }
            </div>
        </nav>
    )
}
