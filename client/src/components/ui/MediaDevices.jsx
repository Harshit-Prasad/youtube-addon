import React, { useState } from 'react'

export default function MediaDevices({mediaDevices, setModalDisplay, setSelectedInputAudioDevice}) {
    const defaultValue = mediaDevices.find((mediaDevice) => mediaDevice?.deviceId === 'default' && mediaDevice?.kind === 'audioinput')
    const [selectedMediaDevice, setSelectedMediaDevice] = useState(defaultValue.id)

  return (
    <div>
        <select 
            className='mt-2 mb-4 cursor-pointer'
            onChange={(e) => {
                setSelectedMediaDevice(e.target.value);
            }}
            defaultValue={defaultValue}
        >
            {mediaDevices.filter(mediaDevice => mediaDevice.kind === 'audioinput').map((mediaDevice) => {
                return <option key={mediaDevice?.label} value={mediaDevice?.deviceId}>{mediaDevice?.label}</option>
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
