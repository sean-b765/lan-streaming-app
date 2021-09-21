import React, { ReactElement, useEffect } from 'react'
import { IMedia } from '../types/IMedia'
import { AiFillStar } from 'react-icons/ai'
import { JsxChild } from 'typescript'

const ViewMedia: React.FC<{
	medias: IMedia[]
	setMedia: Function
	headerChild?: ReactElement
}> = ({ medias, setMedia, headerChild }) => {
	return (
		<section className="list list--media">
			{headerChild}
			{medias.map((media: IMedia, index: number) => (
				<div
					className="list__media"
					key={index}
					onClick={(e) => setMedia(media)}
				>
					<div className="list__media__item">
						<span className="rating">
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
							<span>{media.description}</span>
						</div>

						<div
							className="list__media__item__thumbnail"
							style={{ backgroundImage: `url(${media.poster})` }}
						></div>
					</div>
				</div>
			))}
		</section>
	)
}

export default ViewMedia
