import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { navbar } from '../../constants/navbar';
import SliderNavbar from './SliderNavbar';

export default function Navbar() {
    const [openSliderMenu, setOpenSliderMenu] = useState(false);
    const location = useLocation()

    function close() {
        setOpenSliderMenu(false)
    }

    function open() {
        setOpenSliderMenu(true)
    }

    return (
        <nav className="navbar">
            <Link className="logo" to="/">
                Zuptalk
            </Link>

            <div className='hidden md:flex gap-8 items-center'>
                {
                    navbar.map((route, i) => {

                        return <Link key={i} className={`link ${route.route == location.pathname && 'bg-transparent text-[#4dffde]'}`} to={route.route}>{route.name}</Link>
                    })
                }
            </div>

            <button className='block md:hidden media-button bg-transparent hover:bg-transparent hover:text-[rgba(255,255,255,0.75)]' onClick={open}>
                <Menu size={48} />
            </button>

            <SliderNavbar openSliderMenu={openSliderMenu} close={close}>
                {
                    navbar.map((route, i) => {
                        let isActiveRoute;

                        if (route.route == location.pathname) {
                            isActiveRoute = true
                        }

                        return <li className="list-none mt-4" key={i}>
                            <Link className={`link text-2xl bg-transparent text-[rgb(77,255,222)] hover:text-[rgba(77,255,222,0.75)] ${isActiveRoute && 'text-[rgba(77,255,222,0.5)] pointer-events-none'}`} to={route.route} >{route.name}</Link>
                        </li>
                    })
                }
            </SliderNavbar>
        </nav>
    )
}
