import React from 'react'
import { isMobile, isTablet } from 'react-device-detect'
import { RootStateOrAny, useSelector } from 'react-redux'
import { IMedia } from '../../../types/interfaces'
import Media from '../../Item/Media'

const ListEpisodes = () => {
	const currentSeries = useSelector(
		(state: RootStateOrAny) => state.media.series.current
	)
	const currentSeason = useSelector(
		(state: RootStateOrAny) => state.media.seasons.current
	)

	const media = useSelector(
		(state: RootStateOrAny) => state.media.seasons.episodes.all
	)

	const substring = (str: string) => {
		if (!str) return ``

		const maxString = isMobile || isTablet ? 150 : 400

		return `${str.substring(0, maxString)}...`
	}

	return (
		<>
			<div
				className="modal__info"
				style={{
					backgroundImage: `url(${currentSeason.artwork})`,
				}}
			>
				<h1>
					{currentSeason.name &&
						currentSeries.name &&
						`${currentSeries.name} - ${currentSeason.name}`}
				</h1>
				<p>{substring(currentSeason?.description)}</p>
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

export default ListEpisodes
