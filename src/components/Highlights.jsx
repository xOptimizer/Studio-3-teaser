import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger);

import VideoCarousel from './VideoCarousel';

const Highlights = ({ onSlideChange }) => {

  return (
    <>
      <section id="highlights" className="w-screen overflow-hidden h-full common-padding bg-zinc">
        <div className="screen-max-width">
          <div className="mb-12 w-full flex justify-start">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-left">
              A Connected Ecosystem
              <br />
              Built for Creatives
            </h1>
          </div>

          <div className="mb-8 md:mb-12">
            <VideoCarousel onSlideChange={onSlideChange} />
          </div>
        </div>
      </section>
    </>
  )
}

export default Highlights