import { appleImg } from '../utils';

// top bar
const TopBar = ({ currentSlide = 0, totalSlides = 3 }) => {
  return (
    <header className="sticky top-0 z-50 w-full py-3 sm:py-4 sm:px-10 px-5 bg-black border-b border-gray-300">
      <div className="flex items-center justify-between screen-max-width relative">
        {/* Pagination dots in center */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-2 h-2' 
                  : 'bg-gray-500 w-1.5 h-1.5'
              }`}
            />
          ))}
        </div>

        {/* Logo left-aligned */}
        <div className="">
          <img 
            src={appleImg} 
            alt="Studio 3"
            className="w-14 h-auto sm:w-16 md:w-20 lg:w-24 flex-shrink-0"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
