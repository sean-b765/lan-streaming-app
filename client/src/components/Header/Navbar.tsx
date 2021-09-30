import React from 'react'
import { Page } from '../../types/enums'

const Navbar: React.FC<{ page: string; setPage: Function }> = ({
	page,
	setPage,
}) => {
	return (
		<header className="navbar">
			<h1>Watch Online</h1>
			<nav>
				<ul>
					<li
						className={page === Page.MOVIES ? 'active' : ''}
						onClick={() => setPage(Page.MOVIES)}
					>
						Movies
					</li>
					<li
						className={page === Page.SERIES ? 'active' : ''}
						onClick={() => setPage(Page.SERIES)}
					>
						Series
					</li>
					<li
						className={page === Page.ALL ? 'active' : ''}
						onClick={() => setPage(Page.ALL)}
					>
						All
					</li>
				</ul>
			</nav>
		</header>
	)
}

export default Navbar
