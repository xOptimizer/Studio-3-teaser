import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger);

import VideoCarousel from './VideoCarousel';

const Highlights = ({ onSlideChange }) => {

  return (
    <>
      <section id="highlights" className="w-screen overflow-hidden h-full py-4 sm:py-6 md:py-8 px-5 sm:px-10 bg-gray-50">
        <div className="screen-max-width">
          <div className="mb-4 sm:mb-6 w-full flex justify-start">
            <h1 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-left leading-tight">
              A Connected Ecosystem Built for Creatives
            </h1>
          </div>

          <div className="mb-0">
            <VideoCarousel onSlideChange={onSlideChange} />
          </div>
        </div>
      </section>
    </>
  )
}

export default Highlights