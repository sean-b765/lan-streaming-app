import React, { useState } from 'react'
import { RootStateOrAny, useSelector } from 'react-redux'
import { IMedia } from '../../../types/interfaces'
import Season from '../../Item/Season'

const ListSeasons: React.FC<{ setEpisodesShowing: Function }> = ({
	setEpisodesShowing,
}) => {
	const seasons = useSelector(
		(state: RootStateOrAny) => state.media.seasons.all
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
			<div className="list list--seasons">
				{seasons?.length !== 0 &&
					seasons.map((season: IMedia, idx: number) => (
						<Season
							key={idx}
							season={season}
							setShowing={setEpisodesShowing}
						></Season>
					))}
			</div>
		</>
	)
}

export default ListSeasons
