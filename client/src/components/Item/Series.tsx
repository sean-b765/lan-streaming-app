import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { MediaActions } from '../../types/enums'
import { ISeries } from '../../types/interfaces'
import { api_url } from '../../util/constants'
import { getAllFromSeason, getAllFromSeries } from '../../_actions/media'

const Series: React.FC<{
	serie: ISeries
	key: number
	setShowing: Function
}> = ({ key, setShowing, serie }) => {
	const dispatch = useDispatch()

	return (
		<div
			className="list__series"
			key={key}
			onClick={async (e) => {
				const result = await getAllFromSeries(serie._id)

				if (result?.isMedia) {
					// show movies
					setShowing('media')
					dispatch({
						type: MediaActions.SET_CURRENT_SERIES,
						payload: { series: serie, movies: result.result },
					})
				} else {
					// show seasons
					setShowing('seasons')
					dispatch({
						type: MediaActions.SET_CURRENT_SERIES,
						payload: { series: serie, seasons: result.result },
					})
				}

				const target = e.target as HTMLElement

				if (target.classList.contains('btn')) return
			}}
		>
			<div className="list__series__item">
				{serie.vote_average && (
					<span
						className={
							serie.vote_average >= 8
								? 'rating rating--green'
								: serie.vote_average >= 6
								? 'rating rating--orange'
								: 'rating rating--red'
						}
					>
						<AiFillStar />
						{serie.vote_average}
					</span>
				)}
				<header>
					<h3>{serie.name}</h3>
				</header>

				<div className="list__series__item__info">
					<span className="list__series__item__info__release-date">
						{serie.date}
					</span>
					<span>
						{serie?.description?.length > 35
							? `${serie?.description?.substring(0, 70)}...`
							: serie?.description}
					</span>
				</div>

				<div
					className="list__series__item__thumbnail"
					style={{
						backgroundImage: `url(${
							serie.poster ? serie.poster : serie.artwork
						})`,
					}}
				></div>
			</div>
		</div>
	)
}

export default Series
