import React, { ReactElement, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import { RootStateOrAny, useSelector } from 'react-redux'
import { ISeries } from '../../types/interfaces'
import { disableScrolling, enableScrolling } from '../../util/scroll'
import ViewSeries from '../ViewSeries'
import ListSeasons from './List/ListSeasons'

const ModalSeasons: React.FC<{
	showing: boolean
	setShowing: Function
	setEpisodesShowing: Function
}> = ({ showing, setShowing, setEpisodesShowing }) => {
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
				showing ? 'modal modal--seasons modal--active' : 'modal modal--seasons'
			}
		>
			<button className="btn btn--close" onClick={() => setShowing(false)}>
				<AiOutlineClose />
			</button>
			<ListSeasons setEpisodesShowing={setEpisodesShowing} />
		</div>
	)
}

export default ModalSeasons
