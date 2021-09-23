import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import { ISeries } from '../../types/interfaces'
import { api_url } from '../../util/constants'

const Series: React.FC<{
	key: number
	setShowing: Function
	serie: ISeries
}> = ({ key, setShowing, serie }) => {
	return (
		<div
			className="list__series"
			key={key}
			onClick={async (e) => {
				if (serie.series) {
					fetch(`${api_url}/files/season/${serie._id}`)
						.then((res) => res.json())
						.then((res) => {
							console.log(res)
						})
						.catch((err) => {})
				}

				const target = e.target as HTMLElement

				if (target.classList.contains('btn')) return
				setShowing(true, serie)
			}}
		>
			<div className="list__series__item">
				{serie.vote_average && (
					<span className="rating">
						<AiFillStar />
						{serie.vote_average}
					</span>
				)}
				<header>
					<h3>{serie.name}</h3>
				</header>

				<div className="list__series__item__info">
					<span className="list__series__item__info__release-date">
						{serie.date}
					</span>
					<span>
						{serie?.description?.length > 35
							? `${serie?.description?.substring(0, 70)}...`
							: serie?.description}
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
					className="list__series__item__thumbnail"
					style={{ backgroundImage: `url(${serie.poster})` }}
				></div>
			</div>
		</div>
	)
}

export default Series
