import { Link } from 'react-router-dom'

function NavItem({ to, title, active, onClick }) {
  return (
    <li className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
      <Link to={to} className="nav-link">
        {title}
      </Link>
    </li>
  )
}

export default NavItem
