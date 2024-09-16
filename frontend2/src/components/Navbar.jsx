import { NavLink } from 'react-router-dom'

export const Navbar = () => {
  return (
<nav className="navbar">
	<ul>
		<li><NavLink to={"/gochain/home"} className={({isActive}) => isActive ? "active" : ""}>Home</NavLink></li>
		<li><NavLink to={"/gochain/transact"} className={({isActive}) => isActive ? "active" : ""}>Transact</NavLink></li>
		<li><NavLink to={"/gochain/mine"} className={({isActive}) => isActive ? "active" : ""}>Mine</NavLink></li>
		<li><NavLink to={"/gochain/explorer"} className={({isActive}) => isActive ? "active" : ""}>Explorer</NavLink></li>
	</ul>
</nav>
  )
}