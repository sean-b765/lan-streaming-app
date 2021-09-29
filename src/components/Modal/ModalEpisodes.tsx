import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import ListEpisodes from './List/ListEpisodes'

const ModalEpisodes: React.FC<{ showing: boolean; setShowing: Function }> = ({
	showing,
	setShowing,
}) => {
	return (
		<div
			className={
				showing
					? 'modal modal--episodes modal--active'
					: 'modal modal--episodes'
			}
		>
			<button className="btn btn--close" onClick={() => setShowing(false)}>
				<AiOutlineClose />
			</button>
			<ListEpisodes />
		</div>
	)
}

export default ModalEpisodes
