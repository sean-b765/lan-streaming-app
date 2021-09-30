import React from 'react'
import { RootStateOrAny, useSelector } from 'react-redux'
import { IMedia } from '../../../types/interfaces'
import Media from '../../Item/Media'

const ListMedia = () => {
	const media = useSelector(
		(state: RootStateOrAny) => state.media.series.movies.all
	)
	const currentSeries = useSelector(
		(state: RootStateOrAny) => state.media.series.current
	)

	return (
		<>
			<div
				className="modal__info"
				style={{ backgroundImage: `url(${currentSeries.backdrop})` }}
			>
				<h1>{currentSeries.name}</h1>
				<p>{currentSeries.description}</p>
			</div>
			<div className="list list--media">
				{media?.length !== 0 &&
					media.map((item: IMedia, index: number) => (
						<Media media={item} key={index} />
					))}
			</div>
		</>
	)
}

export default ListMedia
