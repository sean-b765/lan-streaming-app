import React, { ReactElement, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import { RootStateOrAny, useSelector } from 'react-redux'
import { IMedia } from '../../types/interfaces'
import { disableScrolling, enableScrolling } from '../../util/scroll'
import ListMedia from './List/ListMedia'

const ModalMedia: React.FC<{
	showing: boolean
	setShowing: Function
}> = ({ showing, setShowing }) => {
	const currentSeries = useSelector(
		(state: RootStateOrAny) => state.media.series.current
	)

	useEffect(() => {
		if (showing) disableScrolling()
		else enableScrolling()
	}, [showing])

	return (
		<div
			className={
				showing ? 'modal modal--media modal--active' : 'modal modal--media'
			}
		>
			<button className="btn btn--close" onClick={() => setShowing(false)}>
				<AiOutlineClose />
			</button>
			<ListMedia />
		</div>
	)
}

export default ModalMedia
