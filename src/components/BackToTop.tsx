import React, { useState } from 'react'
import { IoIosArrowUp } from 'react-icons/io'

const BackToTop: React.FC<{ show: boolean }> = ({ show }) => {
	const [scrollY, setScrollY] = useState(0)

	window.addEventListener('scroll', () => setScrollY(window.scrollY))

	return show ? (
		<button
			className={
				scrollY > 700
					? 'btn btn--backToTop btn--backToTop--visible'
					: 'btn btn--backToTop'
			}
			onClick={() => window.scrollTo(0, 0)}
		>
			<IoIosArrowUp />
		</button>
	) : (
		<></>
	)
}

export default BackToTop
