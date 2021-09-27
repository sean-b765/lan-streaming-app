import React, { ReactElement, useEffect } from 'react'
import { RootStateOrAny, useSelector } from 'react-redux'
import { IMedia } from '../types/interfaces'
import Media from './Item/Media'

const ViewSeasons: React.FC<{
	setModalShowing: Function
	headerChild?: ReactElement
}> = ({ setModalShowing, headerChild }) => {
	const seasons = useSelector(
		(state: RootStateOrAny) => state.media.seasons.all
	)

	const currentSeries = useSelector(
		(state: RootStateOrAny) => state.media.series.current
	)

	useEffect(() => {}, [])

	return (
		<section className="list list--episodes">
			{/* {episodes.map((episode, index) => (
				<Media media={episode} key={index} />
			))} */}
		</section>
	)
}

export default ViewSeasons
