import React, { ReactElement } from 'react'
import { IMedia } from '../types/interfaces'
import Media from './Item/Media'

const ViewMedia: React.FC<{
	medias: IMedia[]
	setMedia: Function
	headerChild?: ReactElement
}> = ({ medias, setMedia, headerChild }) => {
	return (
		<section className="list list--media">
			{headerChild}

			{medias.map((media: IMedia, index: number) => (
				<Media key={index} media={media} setMedia={setMedia} />
			))}
		</section>
	)
}

export default ViewMedia
