import { useState } from 'react';
import { createPortal } from 'react-dom'
import Popup from './Popup'
import Profile from './Profile'

export default function ProfileToggle({ }) {
    const [profileIsOpen, setProfileIsOpen] = useState(false)

    return <>
        <button onClick={() => {
            setProfileIsOpen(true)
        }} className="link">
            Profile
        </button>
        {profileIsOpen &&
            createPortal(<Popup setIsOpen={setProfileIsOpen} topCloseBtn={true}>
                <Profile />
            </Popup>,
                document.getElementById('profile-popup__center')
            )
        }
    </>
}
