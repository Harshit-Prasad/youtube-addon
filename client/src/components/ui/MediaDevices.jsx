import React, { useState } from 'react'

export default function MediaDevices({mediaDevices, setModalDisplay, setSelectedInputAudioDevice}) {
    const defaultValue = mediaDevices.find((mediaDevice) => mediaDevice?.deviceId === 'default' && mediaDevice?.kind === 'audioinput')
    const [selectedMediaDevice, setSelectedMediaDevice] = useState(defaultValue.deviceId)

  return (
    <div>
        <label className="block text-xl text-center mt-2 mb-4" htmlFor="media-device-select">Select an input audio device</label>
        <select 
            className='mt-2 mb-4 cursor-pointer'
            onChange={(e) => {
                setSelectedMediaDevice(e.target.value);
            }}
            id='media-device-select'
        >
            {mediaDevices.filter(mediaDevice => mediaDevice.kind === 'audioinput').map((mediaDevice) => {
                return <option key={mediaDevice?.deviceId} value={mediaDevice?.deviceId}>{mediaDevice?.label}</option>
            })}
        </select>

        <button onClick={() => {
                setSelectedInputAudioDevice(selectedMediaDevice)
                setModalDisplay(false)
            }}
            className='button bg-blue-700 hover:bg-blue-500 text-white'
        >
            Proceed
        </button>
    </div>
  )
}
