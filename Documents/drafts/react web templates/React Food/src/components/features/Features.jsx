import { featureItem } from "../../Data";

import "./features.scss";

const Features = () => {
  return (
    <section className="features section">
      <div className="features-container container grid">
            {featureItem.map(({id, img, title, description}) => {
              return (
                <article className="features-item" key={id}>
                  <span className="features-icon">
                    <img src={img} alt="icon" className="features-img" />
                  </span>
                    <p className="features-no">0{id}</p>
                    <h3 className="features-title">{title}</h3>
                    <p className="features-description">{description}</p>
                </article>
              );
            })}
      </div>
    </section>
  )
}
export default Features