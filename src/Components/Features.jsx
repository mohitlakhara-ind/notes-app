import React from 'react'
import FeatureCard from './FeatureCard.jsx'
import { FaStickyNote, FaLock, FaCloudUploadAlt } from 'react-icons/fa'

export default function Features() {
    return (
        <>
            <section className=" bg-transparent mt-12 grid grid-cols-1 md:grid-cols-3 pb-5 gap-6">
                <FeatureCard
                    icon={<FaStickyNote />}
                    title="Easy Note-Taking"
                    description="Quickly jot down thoughts with a seamless editing experience."
                />
                <FeatureCard
                    icon={<FaLock />}
                    title="Secure & Private"
                    description="Your notes are encrypted and stored safely."
                />
                <FeatureCard
                    icon={<FaCloudUploadAlt />}
                    title="Sync Across Devices"
                    description="Access your notes from any device, anytime."
                />

            </section>
        </>
    )

}
