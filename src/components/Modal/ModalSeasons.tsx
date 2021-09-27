import React, { ReactElement, useEffect } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { ISeries } from '../../types/interfaces'
import { disableScrolling, enableScrolling } from '../../util/scroll'
import ViewSeasons from '../ViewSeasons'
import ViewSeries from '../ViewSeries'

const ModalSeasons: React.FC<{
	showing: boolean
	setShowing: Function
	infoElements?: ReactElement
}> = ({ showing, setShowing, infoElements }) => {
	useEffect(() => {
		if (showing) disableScrolling()
		else enableScrolling()
	}, [showing])

	return (
		<div
			className={
				showing ? 'modal modal--seasons modal--active' : 'modal modal--seasons'
			}
		>
			<ViewSeasons
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
				setModalShowing={setShowing}
			/>
		</div>
	)
}

export default ModalSeasons
