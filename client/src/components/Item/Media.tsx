import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
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
					{media.vote_average && (
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
							{Number(media.vote_average).toFixed(1)}
						</span>
					)}
					<header>
						<h2>
							{media.displayName} {media.episodeName && media.episodeName}
						</h2>
						<h3>{media.episode && `Episode ${media.episode}`}</h3>
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
