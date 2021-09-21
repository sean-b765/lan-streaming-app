import React, { useEffect } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { IMedia } from '../../types/IMedia'
import { disableScrolling, enableScrolling } from '../../util/scroll'
import ViewMedia from '../ViewMedia'

const ModalMedia: React.FC<{
	media: IMedia[]
	setMedia: Function
	showing: boolean
	setShowing: Function
}> = ({ media, setMedia, showing, setShowing }) => {
	useEffect(() => {
		if (showing) disableScrolling()
		else enableScrolling()
	}, [showing])

	return (
		<div
			className={
				showing ? 'modal modal--media modal--active' : 'modal modal--media'
			}
		>
			<ViewMedia
				headerChild={
					<header>
						{/* <section className="list__info">
						</section> */}
						<div className="navigation">
							<button className="btn btn--back">
								<BiArrowBack onClick={() => setShowing(false)} />
							</button>
						</div>
					</header>
				}
				medias={media}
				setMedia={setMedia}
			/>
		</div>
	)
}

export default ModalMedia
