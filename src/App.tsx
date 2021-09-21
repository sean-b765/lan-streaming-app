import React, { useEffect, useRef, useState } from 'react'
import ModalMedia from './components/Modal/ModalMedia'
import Player from './components/Player'
import ViewMedia from './components/ViewMedia'
import ViewSeries from './components/ViewSeries'
import { IMedia } from './types/IMedia'

const App: React.FC = () => {
	const [medias, setMedias] = useState([])
	const [series, setSeries] = useState([])

	//
	const [modalMedia, setModalMedia] = useState([])

	// current playing item
	const [media, setMedia] = useState<any | IMedia>({})

	// Reflects whether the player is active or not
	const [active, setActive] = useState<boolean>(false)

	// Show seasons, episodes/movies
	const [modalShowing, setModalShowing] = useState<boolean>(false)

	document.title =
		(media?.displayName && `Watch ${media?.displayName}`) ||
		(media?.name && `Watch ${media?.name}`) ||
		'Stream'

	useEffect(() => {
		fetch('http://192.168.1.7:5000/files/media')
			.then((res) => res.json())
			.then((res) => {
				setMedias(res)
			})

		fetch('http://192.168.1.7:5000/files/series')
			.then((res) => res.json())
			.then((res) => {
				setSeries(res)
			})
	}, [])

	return (
		<div className="container">
			<Player
				canEnableScroll={!modalShowing}
				active={active}
				setActive={(val: boolean) => {
					setActive(val)
				}}
				media={media}
				setMedia={setMedia}
			/>

			<ModalMedia
				media={modalMedia}
				setMedia={(val: IMedia) => setMedia(val)}
				showing={modalShowing}
				setShowing={setModalShowing}
			/>

			<ViewMedia
				headerChild={
					<header>
						<h2>movies</h2>
					</header>
				}
				medias={medias}
				setMedia={setMedia}
			/>
			<ViewSeries
				series={series}
				setShowing={async (value: boolean, serie: any) => {
					const result = await (
						await fetch(`http://192.168.1.7:5000/files/series/${serie._id}`)
					).json()

					setModalMedia(result)

					setModalShowing(value)
				}}
			/>
		</div>
	)
}

export default App
