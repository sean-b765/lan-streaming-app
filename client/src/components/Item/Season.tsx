import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { MediaActions } from '../../types/enums'
import { IMedia } from '../../types/interfaces'
import { getAllFromSeason } from '../../_actions/media'

const Season: React.FC<{
	key: number
	season: IMedia
	setShowing: Function
}> = ({ key, season, setShowing }) => {
	const dispatch = useDispatch()

	return (
		<div
			className="list__season"
			key={key}
			onClick={async () => {
				const result = await getAllFromSeason(season._id)
				dispatch({
					type: MediaActions.SET_CURRENT_SEASON,
					payload: { episodes: result.result, season: season },
				})
				setShowing(true)
			}}
		>
			<div className="list__season__item">
				{season.vote_average && (
					<span
						className={
							season.vote_average >= 8
								? 'rating rating--green'
								: season.vote_average >= 6
								? 'rating rating--orange'
								: 'rating rating--red'
						}
					>
						<AiFillStar />
						{season.vote_average}
					</span>
				)}
				<header>
					<h3>{season.name}</h3>
				</header>

				<div className="list__season__item__info">
					<span className="list__season__item__info__release-date">
						{season.date}
					</span>
					<span>
						{season?.description?.length > 35
							? `${season?.description?.substring(0, 70)}...`
							: season?.description}
					</span>
				</div>

				<div
					className="list__season__item__thumbnail"
					style={{
						backgroundImage: `url(${
							season.poster ? season.poster : season.artwork
						})`,
					}}
				></div>
			</div>
		</div>
	)
}

export default Season
