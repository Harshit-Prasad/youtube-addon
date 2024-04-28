import { Copy } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast';

export default function LinkCopyButton({ streamLink, type, fontFace = '' }) {

    async function handleCopyLink() {
        try {
            await navigator.clipboard.writeText(streamLink);
            toast.success("Link Copied");
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <button
            onClick={handleCopyLink}
            className={`${type} text-2xl flex items-center gap-3`}
        >
            <span className={`${fontFace} text-xl md:text-2xl`}>Copy Stream Link</span>
            <span
                className={`flex justify-center items-center p-1 rounded-full`}
            >
                <Copy className="h-[24px] w-[24px] md:h-[24px] md:w-[24px]" />
            </span>
        </button>
    )
}
