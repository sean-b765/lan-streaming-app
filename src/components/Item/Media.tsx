import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { MediaActions } from '../../types/enums'
import { IMedia } from '../../types/interfaces'

const Media: React.FC<{
	key: number
	media: IMedia
}> = ({ key, media }) => {
	const dispatch = useDispatch()
	return (
		media && (
			<div
				className="list__media"
				key={key}
				onClick={(e) => {
					const target = e.target as HTMLElement
					if (target.classList.contains('btn')) return

					// dispatch -> set current media
					dispatch({ type: MediaActions.SET_CURRENT_MEDIA, payload: media })
				}}
			>
				<div className="list__media__item">
					<span
						className={
							media.vote_average >= 8
								? 'rating rating--green'
								: media.vote_average >= 6
								? 'rating rating--orange'
								: 'rating rating--red'
						}
					>
						<AiFillStar />
						{media.vote_average}
					</span>

					<header>
						<h3>
							{media.displayName} {media.episodeName && media.episodeName}
							{media.episode && media.episode}
						</h3>
						<span>{media.duration}m</span>
					</header>

					<div className="list__media__item__info">
						<span className="list__media__item__info__release-date">
							{media.date}
						</span>
						<span>
							{media?.description?.length > 35
								? `${media?.description?.substring(0, 70)}...`
								: media?.description}
						</span>
						<button
							className="btn btn--view-more"
							onClick={() => {
								console.log('viewmore')
							}}
						>
							View More
						</button>
					</div>

					<div
						className="list__media__item__thumbnail"
						style={{ backgroundImage: `url(${media.poster})` }}
					></div>
				</div>
			</div>
		)
	)
}

export default Media
