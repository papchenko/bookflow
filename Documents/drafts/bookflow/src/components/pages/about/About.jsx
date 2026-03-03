import { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import logoImg from '../../../assets/logo.svg';
import authorImg from '../../../assets/author.png';
import { FaCheck, FaChevronDown } from "react-icons/fa6";

const About = () => {

  const { theme } = useTheme();

  const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-200';
  const bgColor = theme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
  const sectionBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';

  const [isVersionsOpen, setIsVersionsOpen] = useState(false);

  const versions = [
    "1.0.1 Release",
    "1.1.1 Add Shop - details modal card",
  ];


  const rules = [
    "Only registered users can borrow or lend books.",
    "Respect copyrights when lending or uploading content.",
    "Always return borrowed books on time.",
    "No inappropriate content or behavior allowed.",
    "Maintain community etiquette and respect other users."
  ];

  return (
    <div className={`${bgColor} md:py-10 pt-4 pb-10`}>

      {/* Header Section */}
      <section className="py-6 text-center opacity-50">
        <img src={logoImg} alt="BookFlow Logo" className="mx-auto mb-4 w-32 transition dark:invert" />
        <p className={`${textColor} max-w-2xl mx-auto text-lg px-2`}>
          {/* Your place to borrow, lend, and buy books. Share the joy of reading with our community. */}
          Sale and Lending of Books
        </p>
      </section>

      {/* Rules / About Site as Accordion */}
     {/* <section className={`py-10 ${sectionBg} border-t ${borderColor} dark:border-none`}>
        <div className="container mx-auto px-4 max-w-7xl">
            <h2 className={`text-2xl font-bold mb-8 ${textColor} text-center`}>Site Rules & Guidelines</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rules.map((rule, index) => (
                <div 
                key={index} 
                className={`flex items-start gap-3 p-4 rounded-md ${bgColor} border ${borderColor} hover:shadow-md transition`}
                >
                <span className="text-green-600 mt-1 text-xl"><FaCheck className='text-xl text-[var(--secondary-color)]' /></span>
                <p className={`${textColor} text-sm md:text-base`}>
                    {rule}
                </p>
                </div>
            ))}
            </div>
        </div>
    </section> */}

      {/* Author Section */}
      <section className={`py-5 md:py-10 border-t ${borderColor} dark:border-gray`}>
        <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row items-center md:items-start gap-6">
          
          {/* Avatar */}
          <div className="w-24 h-24 md:w-24 md:h-24 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden flex-shrink-0">
            <img src={authorImg} alt="Author Name" className="w-full h-full object-cover" />
          </div>

          {/* Author Info */}
          <div className="text-center md:text-left flex-1">
            <h3 className={`text-xl md:text-2xl font-semibold mb-2 ${textColor}`}>Mykola Papchenko</h3>
            <p className={`${textColor} text-xl md:text-xl text-start`}>
              Front-end developer and creator of the BookFlow project. Passionate about developing online communities of readers.
            </p>
            <p className='italic pt-2 pb-4 text-sm text-[var(--secondary-color)] text-start'>
             &laquo; A full-fledged platform for knowledge exchange. We are constantly working on the project, improving every detail. I hope our platform will bring you a lot of knowledge. Enjoy! &raquo;
            </p>
          </div>
        </div>
      </section>

      {/* Version Section */}
      <section className={`py-0`}>
      <div className="container mx-auto px-4 max-w-4xl flex flex-col md:flex-row items-center md:items-start gap-6">
          <p className={`${textColor} px-4 pb-1 text-sm`}>
            Stable version 1.1.1
          </p>
          <p className={`${textColor} px-4 pb-1 text-sm`}>
            Release 110_10 (2026-02-03)
          </p>
        <div className="">
          <div
            className={`${textColor} flex flex-col justify-center items-center gap-2 px-4 py-0 text-sm cursor-pointer select-none`}
            onClick={() => setIsVersionsOpen(!isVersionsOpen)}
          >
            <div className="flex items-center gap-1">
              <span className='text-sm'>More about versions</span>
              <FaChevronDown
                className={`transition-transform duration-300 ${
                  isVersionsOpen ? 'rotate-180' : ''
                }`}
              />
            </div>

            {isVersionsOpen && (
              <div className="mt-1 flex flex-col gap-1">
                {versions.map((v, i) => (
                  <p key={i}>{v}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </section>
    </div>
  );
};

export default About;