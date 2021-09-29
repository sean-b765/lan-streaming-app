import React, { useEffect, useRef, useState } from 'react'
import ModalMedia from './components/Modal/ModalMedia'
import ModalSeasons from './components/Modal/ModalSeasons'
import Player from './components/Player/Player'
import ViewMedia from './components/ViewMedia'
import ViewSeries from './components/ViewSeries'
import { RootStateOrAny, useSelector } from 'react-redux'
import ModalEpisodes from './components/Modal/ModalEpisodes'
import { Page } from './types/enums'
import Navbar from './components/Header/Navbar'
import BackToTop from './components/BackToTop'

const App: React.FC = () => {
	const [page, setPage] = useState<Page>(Page.ALL)

	const playerRef = useRef<HTMLVideoElement>(null)

	// Reflects whether the player is active or not
	const [playerActive, setPlayerActive] = useState<boolean>(false)

	// Should be saved in browser's local storage for persistence
	const [volume, setVolume] = useState<number>(
		JSON.parse(localStorage.getItem('player')!)?.volume || 1
	)

	// Show modal
	const [modalMediaShowing, setModalMediaShowing] = useState<boolean>(false)
	const [modalSeasonsShowing, setModalSeasonsShowing] = useState<boolean>(false)
	const [modalEpisodesShowing, setModalEpisodesShowing] =
		useState<boolean>(false)

	const currentMedia = useSelector(
		(state: RootStateOrAny) => state.media.media.current
	)

	const currentSeries = useSelector(
		(state: RootStateOrAny) => state.media.series.current
	)

	const currentSeason = useSelector(
		(state: RootStateOrAny) => state.media.seasons.current
	)

	const formatTitle = (): string => {
		if (!currentMedia._id) return `Watch Online`

		if (!currentMedia.series && !currentMedia.season) {
			return `Watch ${currentMedia?.displayName || currentMedia?.name}`
		}

		if (currentMedia.series && !currentMedia.season) {
			return `Watch ${currentMedia?.displayName || currentMedia?.name}`
		}

		if (
			currentMedia.series === currentSeries._id &&
			currentMedia.season === currentSeason._id
		) {
			return `Watch ${currentSeries?.name}`
		}

		return 'Watch Online'
	}

	document.title = formatTitle()

	// listen for changes in volume via useEffect hook with dependency
	useEffect(() => {
		// make volume persist between page loads
		localStorage.setItem('player', JSON.stringify({ volume }))
	}, [volume])

	return (
		<div className="container">
			<Navbar page={page} setPage={setPage} />

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
				showing={modalMediaShowing}
				setShowing={setModalMediaShowing}
			/>

			<ModalSeasons
				setShowing={setModalSeasonsShowing}
				showing={modalSeasonsShowing}
				setEpisodesShowing={setModalEpisodesShowing}
			/>

			<ModalEpisodes
				showing={modalEpisodesShowing}
				setShowing={setModalEpisodesShowing}
			/>

			{(page === Page.MOVIES || page === Page.ALL) && (
				<ViewMedia
					headerChild={
						<header>
							<h2>MOVIES</h2>
						</header>
					}
				/>
			)}

			{(page === Page.ALL || page === Page.SERIES) && (
				<ViewSeries
					headerChild={
						<header>
							<h2>SERIES</h2>
						</header>
					}
					setModalShowing={(value: string) => {
						if (value === 'seasons')
							setModalSeasonsShowing(!modalSeasonsShowing)
						else if (value === 'media') setModalMediaShowing(!modalMediaShowing)
					}}
				/>
			)}

			<BackToTop
				show={
					!modalMediaShowing && !modalSeasonsShowing && !modalEpisodesShowing
				}
			/>
		</div>
	)
}

export default App
