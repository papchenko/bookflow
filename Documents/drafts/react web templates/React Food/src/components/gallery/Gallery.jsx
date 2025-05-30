import SectionTitle from '../title/SectionTitle';
import { gallery } from "../../Data";
import { RiAddLargeLine } from 'react-icons/ri';

import './gallery.scss';

const Gallery = () => {
  return <section className="gallery section">
       <SectionTitle subtitle='Our Photo Gallery' title={<>Let's Check <span>Our Photo</span> Gallery</>} />
       <div className="gallery-container container">
        {gallery.map((gallery, index) => {
          return (
            <div className="gallery-item" key={index}>
            <img src={gallery} alt="" className="gallery-img" />
            <a href={gallery} className="gallery-link">
              <RiAddLargeLine />
            </a>
          </div>
          );
        })}
       </div>
  </section>
}
export default Gallery