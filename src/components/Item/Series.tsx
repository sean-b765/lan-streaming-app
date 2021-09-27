import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import { ISeries } from '../../types/interfaces'
import { api_url } from '../../util/constants'

const Series: React.FC<{
	serie: ISeries
	key: number
	setShowing: Function
}> = ({ key, setShowing, serie }) => {
	return (
		<div
			className="list__series"
			key={key}
			onClick={async (e) => {
				if (serie.series) {
					// Get seasons
					fetch(`${api_url}/files/season/${serie._id}`)
						.then((res) => res.json())
						.then((res) => {
							console.log(res)
						})
						.catch((err) => {})
				}

				const target = e.target as HTMLElement

				if (target.classList.contains('btn')) return
				setShowing(true)
			}}
		>
			<div className="list__series__item">
				{serie.vote_average && (
					<span
						className={
							serie.vote_average >= 8
								? 'rating rating--green'
								: serie.vote_average >= 6
								? 'rating rating--orange'
								: 'rating rating--red'
						}
					>
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
					style={{
						backgroundImage: `url(${
							serie.poster ? serie.poster : serie.artwork
						})`,
					}}
				></div>
			</div>
		</div>
	)
}

export default Series
