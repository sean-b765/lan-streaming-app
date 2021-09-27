import React, { ReactElement, useEffect } from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import { MediaActions } from '../types/enums'
import { ISeries } from '../types/interfaces'
import { getSeries } from '../_actions/media'
import Series from './Item/Series'

const ViewSeries: React.FC<{
	setModalShowing: Function
	headerChild?: ReactElement
}> = ({ setModalShowing, headerChild }) => {
	const dispatch = useDispatch()

	const series = useSelector((state: RootStateOrAny) => state.media.series.all)

	useEffect(() => {
		getSeries().then((res) => {
			dispatch({ type: MediaActions.SET_ALL_SERIES, payload: res })
		})
	}, [])

	return (
		<section className="list list--series">
			{headerChild}

			{series?.length !== 0 &&
				series.map((item: any, index: number) => (
					<Series serie={item} key={index} setShowing={setModalShowing} />
				))}
		</section>
	)
}

export default ViewSeries
