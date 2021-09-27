import React, { useEffect, useRef, useState } from 'react'
import ModalMedia from './components/Modal/ModalMedia'
import ModalSeasons from './components/Modal/ModalSeasons'
import Player from './components/Player'
import ViewMedia from './components/ViewMedia'
import ViewSeries from './components/ViewSeries'
import { IMedia, ISeries } from './types/interfaces'
import { useIdleTimer } from 'react-idle-timer'
import { RootStateOrAny, useSelector } from 'react-redux'

const App: React.FC = () => {
	const playerRef = useRef<HTMLVideoElement>(null)

	// Show modal
	const [modalMediaShowing, setModalMediaShowing] = useState<boolean>(false)
	const [modalSeasonsShowing, setModalSeasonsShowing] = useState<boolean>(false)

	const currentMedia = useSelector(
		(state: RootStateOrAny) => state.media.media.current
	)

	const currentSeries = useSelector(
		(state: RootStateOrAny) => state.media.series.current
	)

	// Reflects whether the player is active or not
	const [playerActive, setPlayerActive] = useState<boolean>(false)

	// Should be saved in browser's local storage for persistence
	const [volume, setVolume] = useState<number>(1)

	document.title =
		(currentMedia?.displayName && `Watch ${currentMedia?.displayName}`) ||
		(currentMedia?.name && `Watch ${currentMedia?.name}`) ||
		'Stream'

	useEffect(() => {
		// get volume from localStorage
		return () => {
			// set volume in localStorage
		}
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
				volume={volume}
				setVolume={setVolume}
			/>

			<ModalMedia
				infoElements={
					<>
						<h2>{currentSeries?.displayName || currentSeries?.name}</h2>
					</>
				}
				showing={modalMediaShowing}
				setShowing={(value: boolean) => {
					setModalMediaShowing(value)
				}}
			/>

			<ModalSeasons
				infoElements={
					<>
						<h2>{currentSeries?.name || currentSeries?.displayName}</h2>
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
			/>

			<ViewSeries
				headerChild={
					<header>
						<h2>SERIES</h2>
					</header>
				}
				setModalShowing={() => setModalSeasonsShowing(!modalSeasonsShowing)}
			/>
		</div>
	)
}

export default App
