import React, { ReactElement, useEffect } from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { MediaActions } from '../types/enums'
import { IMedia } from '../types/interfaces'
import { getMedia } from '../_actions/media'
import Media from './Item/Media'

const ViewMedia: React.FC<{
	headerChild?: ReactElement
}> = ({ headerChild }) => {
	const dispatch = useDispatch()

	const all_media = useSelector(
		(state: RootStateOrAny) => state.media.media.all
	)

	useEffect(() => {
		getMedia().then((res) => {
			dispatch({ type: MediaActions.SET_ALL_MEDIA, payload: res })
		})
	}, [])

	return (
		<section className="list list--media">
			{headerChild}

			{all_media?.length !== 0 &&
				all_media.map((media: IMedia, index: number) => (
					<Media key={index} media={media} />
				))}
		</section>
	)
}

export default ViewMedia
