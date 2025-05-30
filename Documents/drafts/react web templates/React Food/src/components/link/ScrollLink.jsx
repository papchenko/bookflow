import { Link } from "react-scroll"

const ScrollLink = ({to, name, className, icon, extraProps= {} }) => {
  return (
    <Link to={to} smooth={true} duration={500} {...extraProps} className={className}>
        {name}
        {icon && icon}
    </Link>
  )
}
export default ScrollLink