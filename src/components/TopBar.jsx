import { appleImg } from '../utils';
// top bar
const TopBar = () => {
  return (
    <header className="w-full py-3 sm:py-4 sm:px-10 px-5 bg-black border-b border-gray-300">
      <div className="flex items-center justify-center screen-max-width">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center">

          <img 
            src={appleImg} 
            alt="Apple"
            className="w-10 h-auto sm:w-14 md:w-16 flex-shrink-0"
          />

          <p className="text-gray text-xs sm:text-sm md:text-base font-light italic text-center">
            "Forged in titanium, crafted for excellence."
          </p>

        </div>
      </div>
    </header>
  );
};

export default TopBar;
