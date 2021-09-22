import React, { ReactElement } from 'react'
import { ISeries } from '../types/interfaces'
import Series from './Item/Series'

const ViewSeries: React.FC<{
	series: ISeries[]
	setModalShowing: Function
	headerChild?: ReactElement
}> = ({ series, setModalShowing, headerChild }) => {
	return (
		<section className="list list--series">
			{headerChild}

			{series.map((serie, index) => (
				<Series serie={serie} key={index} setShowing={setModalShowing} />
			))}
		</section>
	)
}

export default ViewSeries
