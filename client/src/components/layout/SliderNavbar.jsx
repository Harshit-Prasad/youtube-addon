import { X } from 'lucide-react'
import React from 'react'

export default function SliderNavbar({ children, close, openSliderMenu }) {
    return (
        <div className={`${openSliderMenu ? 'translate-x-0' : 'translate-x-[100%] hidden'}  absolute top-0 right-0 w-full h-dvh flex justify-end items-stretch`}>
            <div onClick={close} className='bg-[rgba(0,0,0,0.5)] w-[30%]' />
            <div className={`px-2 md:px-6 py-2 block md:hidden grow bg-[#323837]`}>
                <div className='flex justify-end items-center'>
                    <button className='media-button bg-transparent hover:bg-transparent hover:text-[rgba(255,255,255,0.75)]' onClick={close}>
                        <X size={48} />
                    </button>
                </div>
                <ul>
                    {children}
                </ul>
            </div>
        </div>
    )
}
