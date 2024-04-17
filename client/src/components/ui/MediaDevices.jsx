import React, { useState } from 'react'

export default function MediaDevices({mediaDevices, setModalDisplay, setSelectedInputAudioDevice}) {
    const defaultValue = mediaDevices.find((mediaDevice) => mediaDevice?.deviceId === 'default' && mediaDevice?.kind === 'audioinput')
    console.log(mediaDevices);
    const [selectedMediaDevice, setSelectedMediaDevice] = useState(defaultValue?.deviceId || 'default')

  return (
    <div className='w-full'>
        <label className="block text-xl text-center mt-2 mb-4" htmlFor="media-device-select">Select an input audio device</label>
        {
            mediaDevices.length > 0 &&
            <select 
                className='relative block max-w-[100%] whitespace-normal mt-2 mb-4 mx-auto cursor-pointer'
                onChange={(e) => {
                    setSelectedMediaDevice(e.target.value);
                }}
                id='media-device-select'
            >
            {mediaDevices.filter(mediaDevice => mediaDevice.kind === 'audioinput').map((mediaDevice) => {
                return <option className='block max-w-[100%] whitespace-normal'  key={mediaDevice?.deviceId} value={mediaDevice?.deviceId}>{mediaDevice?.label}</option>
            })}
            </select>
        }

        <button onClick={() => {
                setSelectedInputAudioDevice(selectedMediaDevice)
                setModalDisplay(false)
            }}
            className='button inline-block bg-blue-700 hover:bg-blue-500 text-white'
        >
            Proceed
        </button>
    </div>
  )
}
