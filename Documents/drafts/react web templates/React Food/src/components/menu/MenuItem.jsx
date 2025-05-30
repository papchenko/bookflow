import Stars from "../stars/Stars";

const MenuItem = ({menuItems}) => {
  const formatNumber = (num) => 
    new Intl.NumberFormat('en', {
      notation: 'compact',
      compactDisplay: 'short'
    }).format(num);
  return (
    <>
    {menuItems.map(({id, img, title, description, price, stars, reviews}) => {
      return (
        <article className="menu-item" key={id}>
          <div className="menu-data">
            <img src={img} alt="" className="menu-img" />
            <span className="menu-price">{price}</span>
          </div>
          <h3 className="menu-title">{title}</h3>
          <p className="menu-description">{description}</p>
          <div className="menu-rate">
            <Stars stars={stars} />
            <span>
              {stars} ({formatNumber(reviews)})
            </span>
          </div>
        </article>
      )
    })}
    </>
  );
}
export default MenuItem