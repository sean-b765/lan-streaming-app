import React, { ReactElement, useEffect } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { IMedia } from '../../types/interfaces'
import { disableScrolling, enableScrolling } from '../../util/scroll'
import ViewMedia from '../ViewMedia'

const ModalMedia: React.FC<{
	showing: boolean
	setShowing: Function
	infoElements?: ReactElement
}> = ({ showing, setShowing, infoElements: infoElements }) => {
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
						<section className="list__info">{infoElements}</section>
						<div className="navigation">
							<button
								className="btn btn--back"
								onClick={() => setShowing(false)}
							>
								<BiArrowBack />
							</button>
						</div>
					</header>
				}
			/>
		</div>
	)
}

export default ModalMedia
