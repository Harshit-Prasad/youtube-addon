import { X } from 'lucide-react'
import React from 'react'

export default function SliderNavbar({ children, close, openSliderMenu }) {
    return (
        <div className={`${openSliderMenu ? 'translate-x-0' : 'translate-x-[100%] hidden'} px-2 md:px-6 py-2 block md:hidden w-[75%] h-dvh absolute top-0 right-0 bg-[rgba(0,0,0,0.9)]`}>
            <div className='flex justify-between items-center bg-[rgba(0,0,0,0.75)]'>
                <h2 className='text-xl text-white'>Menu</h2>
                <button className='media-button bg-transparent hover:bg-transparent hover:text-[rgba(255,255,255,0.75)]' onClick={close}>
                    <X size={48} />
                </button>
            </div>
            <ul>
                {children}
            </ul>
        </div>
    )
}
