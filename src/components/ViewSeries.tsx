import React from 'react'
import { AiFillStar } from 'react-icons/ai'

const ViewSeries: React.FC<{ series: any[]; setShowing: Function }> = ({
	series,
	setShowing,
}) => {
	return (
		<section className="list list--series">
			<header>
				<h2>movie &amp; tv series</h2>
			</header>
			{series.map((serie, index) => (
				<div
					className="list__series"
					key={index}
					onClick={(e) => {
						const target = e.target as HTMLElement

						if (target.classList.contains('btn')) return
						setShowing(true, serie)
					}}
				>
					<div className="list__series__item">
						<span className="rating">
							<AiFillStar />
							{serie.vote_average}
						</span>
						<header>
							<h3>{serie.name}</h3>
						</header>

						<div className="list__series__item__info">
							<span>
								{serie.description.length > 35
									? `${serie.description.subtring(0, 35)}...`
									: serie.description}
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
			))}
		</section>
	)
}

export default ViewSeries
