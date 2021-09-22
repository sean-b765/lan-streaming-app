import React, { useEffect, useRef, useState } from 'react'
import ModalMedia from './components/Modal/ModalMedia'
import ModalSeasons from './components/Modal/ModalSeasons'
import Player from './components/Player'
import ViewMedia from './components/ViewMedia'
import ViewSeries from './components/ViewSeries'
import { IMedia, ISeries } from './types/interfaces'
import { useIdleTimer } from 'react-idle-timer'

const App: React.FC = () => {
	const playerRef = useRef<HTMLVideoElement>(null)

	const [medias, setMedias] = useState<IMedia[]>([])
	const [series, setSeries] = useState<ISeries[]>([])

	// The media
	const [modalMedia, setModalMedia] = useState<IMedia[]>([])
	// The seasons contained in a series
	const [modalSeasons, setModalSeasons] = useState<ISeries[]>([])

	// Show modal
	const [modalMediaShowing, setModalMediaShowing] = useState<boolean>(false)
	const [modalSeasonsShowing, setModalSeasonsShowing] = useState<boolean>(false)

	// current playing item
	const [currentMedia, setCurrentMedia] = useState<IMedia | any>(null)
	// currently selected series
	const [currentSeries, setCurrentSeries] = useState<ISeries | any>(null)

	// Reflects whether the player is active or not
	const [playerActive, setPlayerActive] = useState<boolean>(false)

	// Should be saved in browser's local storage for persistence
	const [volume, setVolume] = useState<number>(1)

	document.title =
		(currentMedia?.displayName && `Watch ${currentMedia?.displayName}`) ||
		(currentMedia?.name && `Watch ${currentMedia?.name}`) ||
		'Stream'

	useEffect(() => {
		console.log('triggered')
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
				playerRef={playerRef}
				canEnableScroll={!modalMediaShowing && !modalSeasonsShowing}
				active={playerActive}
				setActive={(val: boolean) => {
					setPlayerActive(val)
				}}
				media={currentMedia}
				setMedia={setCurrentMedia}
			/>

			<ModalMedia
				infoElements={
					<>
						<h2>Movies</h2>
						<p>
							{currentSeries?.displayName && currentSeries?.displayName}
							{currentSeries?.name && currentSeries?.name}
						</p>
					</>
				}
				media={modalMedia}
				setMedia={(val: IMedia) => setCurrentMedia(val)}
				showing={modalMediaShowing}
				setShowing={(value: boolean) => {
					setModalMediaShowing(value)
				}}
			/>

			<ModalSeasons
				media={modalSeasons}
				infoElements={
					<>
						<h2>Seasons</h2>
						<p>
							{currentSeries?.displayName && currentSeries?.displayName}
							{currentSeries?.name && currentSeries?.name}
						</p>
					</>
				}
				setShowing={setModalSeasonsShowing}
				showing={modalSeasonsShowing}
			/>

			<ViewMedia
				headerChild={
					<header>
						<h2>MOVIES</h2>
					</header>
				}
				medias={medias}
				setMedia={setCurrentMedia}
			/>

			<ViewSeries
				headerChild={
					<header>
						<h2>SERIES</h2>
					</header>
				}
				series={series}
				setModalShowing={async (value: boolean, serie: ISeries | IMedia) => {
					// Get the seasons of this series
					const { result, isMedia } = await (
						await fetch(`http://192.168.1.7:5000/files/series/${serie._id}`)
					).json()

					setCurrentSeries(serie)

					if (isMedia) {
						// Set modal media
						setModalMedia(result)
						setModalMediaShowing(value)
					} else {
						// set modal seasons
						setModalSeasons(result)
						setModalSeasonsShowing(value)
					}
				}}
			/>
		</div>
	)
}

export default App
