import React, { RefObject, useEffect, useRef, useState } from 'react'
import { IMedia } from '../types/interfaces'
import { RiFullscreenExitLine, RiFullscreenLine } from 'react-icons/ri'
import { disableScrolling, enableScrolling } from '../util/scroll'
import {
	IoIosPause,
	IoIosPlay,
	IoMdVolumeHigh,
	IoMdVolumeLow,
	IoMdVolumeOff,
} from 'react-icons/io'
import { BiArrowBack } from 'react-icons/bi'
import { AiOutlineClose } from 'react-icons/ai'
import { isMobile } from 'react-device-detect'
import { useIdleTimer } from 'react-idle-timer'
import Loader from './Loader'

const Player: React.FC<{
	media: IMedia
	setMedia: Function
	active: boolean
	setActive: Function
	canEnableScroll: boolean
	playerRef: RefObject<HTMLVideoElement>
}> = ({ media, setMedia, playerRef, active, setActive, canEnableScroll }) => {
	const [idle, setIdle] = useState<boolean>(false)

	const [playing, setPlaying] = useState<boolean>(false)
	const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
	const [seeking, setSeeking] = useState(false)

	const [duration, setDuration] = useState(0)
	const [volume, setVolume] = useState(1)
	const [lastVolumeBeforeMute, setLastVolumeBeforeMute] = useState(1)

	const [progressPct, setProgressPct] = useState(0)
	const [buffering, setBuffering] = useState(false)

	// the container needs to be fullscreen rather than just the video.
	//  this lets you overlay elements while in fullscreen mode
	const containerRef = useRef<HTMLDivElement>(null)
	const controlsMainRef = useRef<HTMLDivElement>(null)
	// ref for the seeker element
	const seekerRef = useRef<HTMLDivElement>(null)

	// Use react-idle-timer to show/hide controls when idle/active
	//  2s idle timeout
	const { reset } = useIdleTimer({
		timeout: 2000,
		onIdle: () => {
			setIdle(true)
		},
		onActive: () => {
			setIdle(false)
		},
	})

	window.onmousemove = reset
	window.onkeydown = reset

	const allowedShortcutKeys = [
		'ArrowLeft',
		'ArrowRight',
		'ArrowUp',
		'ArrowDown',
		'Space',
		'KeyF',
		'KeyM',
	]

	// key press shortcuts
	window.onkeyup = (e) => {
		if (!allowedShortcutKeys.includes(e.code)) return

		if (!active && !isFullScreen) {
			// only allow fullscreen shortcut if player is in small-mode
			if (e.code === 'KeyF') requestFullScreen()
			return
		}

		const time = duration * progressPct

		e.preventDefault()
		e.stopPropagation()

		switch (e.code) {
			case 'ArrowLeft':
				seek(Math.max(time - 10, 0) / duration)
				break
			case 'ArrowRight':
				seek(Math.min(time + 10, duration) / duration)
				break
			case 'ArrowDown':
				handleSetVolume(volume - 0.1)
				break
			case 'ArrowUp':
				handleSetVolume(volume + 0.1)
				break
			case 'Space':
				if (isFullScreen || active) pausePlay()
				break
			case 'KeyF':
				if (isFullScreen) exitFullScreen()
				else requestFullScreen()
				break
			case 'KeyM':
				mute()
				break
			default:
				break
		}
	}

	// Set fullscreen state variable
	document.addEventListener('fullscreenchange', (e) => {
		if (document.fullscreenElement) setIsFullScreen(true)
		else setIsFullScreen(false)
	})

	const formatMediaStream = () => {
		if (!media._id) return
		return `http://192.168.1.7:5000/files/stream/${media?._id}`
	}

	const formatTime = (value: number): string => {
		let hours: any = Math.max(0, Math.floor(value / (60 * 60))).toFixed(0)
		let mins: any = Math.max(0, Math.floor((value % (60 * 60)) / 60)).toFixed(0)
		let secs: any = Number(value % 60).toFixed(0)

		hours = hours === 0 ? '0:' : `${hours}:`
		mins = mins === 0 ? '00:' : mins > 9 ? `${mins}:` : `0${mins}:`
		secs = secs === 0 ? '00' : secs > 9 ? `${secs}` : `0${secs}`

		return `${hours}${mins}${secs}`
	}

	useEffect(() => {
		if (!active && canEnableScroll) enableScrolling()
		else disableScrolling()
	}, [active])

	useEffect(() => {
		// init - get localStorage volume
		console.log('init')

		return () => {
			// cleanup - set localStorage volume
			console.log('destroy')
		}
	}, [])

	/* 
		Video player functions 
	*/
	const pausePlay = () => {
		if (!playerRef) return
		if (playerRef.current?.paused)
			playerRef.current
				?.play()
				.then(() => {})
				.catch(() => {})
		else playerRef.current?.pause()
	}

	const fullScreen = () => {
		setActive(!active)
	}

	const requestFullScreen = () => {
		containerRef.current
			?.requestFullscreen()
			.then(() => {})
			.catch(() => {})
	}

	const exitFullScreen = () => {
		document
			.exitFullscreen()
			.then(() => {})
			.catch(() => {})
	}

	const seek = (percentage: number) => {
		try {
			playerRef.current!.currentTime = percentage * duration
		} catch (err) {}
	}

	const handleSetVolume = (vol: number) => {
		if (vol > 1) vol = 1
		if (vol < 0) vol = 0

		setVolume(vol)
		setLastVolumeBeforeMute(vol)
		playerRef.current!.volume = vol
	}

	const mute = () => {
		console.log(volume)

		if (volume === 0) {
			playerRef.current!.volume = lastVolumeBeforeMute || 0.5
			setVolume(lastVolumeBeforeMute || 0.5)
		} else {
			setLastVolumeBeforeMute(volume)
			playerRef.current!.volume = 0
			setVolume(0)
		}
	}

	return media?._id ? (
		<>
			{buffering && <Loader />}
			<div
				ref={containerRef}
				className={
					active || isFullScreen
						? idle
							? 'player player--active player--idle'
							: 'player player--active'
						: 'player player--small'
				}
			>
				<video
					className="player__video"
					src={formatMediaStream()}
					autoPlay
					onPlay={() => setPlaying(true)}
					onPause={() => setPlaying(false)}
					onVolumeChange={() => setVolume(playerRef.current!.volume)}
					onWaiting={() => {
						setBuffering(true)
					}}
					onTimeUpdate={() => {
						setBuffering(false)
						try {
							const duration = playerRef.current?.duration || 1
							const currentTime = playerRef.current?.currentTime || 0
							setProgressPct(currentTime / duration)
						} catch (err) {}
					}}
					onLoadedMetadata={() => setDuration(playerRef.current!.duration || 0)}
					onPointerDown={() => {
						if (playerRef.current?.paused) playerRef.current?.play()
						else playerRef.current?.pause()
					}}
					ref={playerRef}
					onError={() => {}}
				></video>

				{/* 
					paused / idle overlay 
					show episodes when paused and NOT idle
				*/}

				<div
					className={
						!playing && (active || isFullScreen)
							? 'player__overlay'
							: 'player__overlay player__overlay--hidden'
					}
				>
					<div
						className="player__overlay__backdrop"
						style={{ backgroundImage: `url(${media.backdrop})` }}
					></div>
					<div className="player__overlay__info">
						<h1>
							{media.displayName && media.displayName}
							{!media.displayName && media.name && media.name}
						</h1>
						{media.episode ||
							(media.episodeName && (
								<h2>
									{media.episodeName
										? media.episodeName
										: media.episode && media.episode}
								</h2>
							))}
						{media.description && (
							<p>
								{idle
									? media.description
									: `${media.description.substring(0, 80)}${
											media.description.length > 80 && `...`
									  }`}
							</p>
						)}
						<span>{Math.round(progressPct * 100).toFixed(0)}% complete</span>
					</div>
					{false && <div className="player__overlay__current-series"></div>}
				</div>

				{/* Fullscreen player controls */}
				{(isFullScreen || active) && (
					<div className="player__controls">
						<button className="btn btn--pause-play" onClick={pausePlay}>
							{playing ? <IoIosPause /> : <IoIosPlay />}
						</button>

						{/* Seek, volume, fullscreen, etc */}
						<div className="player__controls__main" ref={controlsMainRef}>
							<div className="seek-ts">
								<div className="player__controls__main__timestamp">
									<span className="currentTime">
										{formatTime(progressPct * duration)}
									</span>
									/<span className="duration">{formatTime(duration)}</span>
								</div>
								<div
									className="player__controls__main__seeker"
									onClick={(e) => {
										const target = e.target as HTMLElement
										const { left, width } = target.getBoundingClientRect()
										const x = e.clientX - left

										const percentage = x / width

										seek(percentage)
									}}
									onMouseDown={() => setSeeking(true)}
									onMouseUp={() => setSeeking(false)}
									onMouseMove={() => {
										console.log(seeking)
									}}
									ref={seekerRef}
								>
									<div className="seek" style={{ width: '100%' }}></div>
									<div
										className="progress"
										style={{ width: `${Math.min(progressPct * 100, 100)}%` }}
									></div>
									<div
										className="scrubber"
										style={{
											left: `${Math.min(progressPct * 100, 100)}%`,
										}}
									></div>
								</div>
							</div>
							<div className="vol-fs">
								{!isMobile && (
									<div className="player__controls__main__volume">
										<button
											className="player__controls__main__volume__indicator btn"
											onClick={mute}
										>
											{volume > 0.5 && <IoMdVolumeHigh />}
											{volume > 0 && volume <= 0.5 && <IoMdVolumeLow />}
											{volume === 0 && <IoMdVolumeOff />}
										</button>
										<input
											type="range"
											name="volume"
											id="volume"
											min="0"
											max="1"
											step="0.01"
											value={volume}
											onChange={(e) => {
												playerRef.current!.volume = parseFloat(e.target.value)
												setVolume(parseFloat(e.target.value))
											}}
										/>
									</div>
								)}

								{!isMobile && (
									<button
										className="player__controls__main__fullscreen btn"
										onClick={() => {
											if (isFullScreen) exitFullScreen()
											else requestFullScreen()
										}}
									>
										{isFullScreen ? (
											<RiFullscreenExitLine />
										) : (
											<RiFullscreenLine />
										)}
									</button>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Mini player controls */}
				<div
					className={
						idle
							? 'player__navigation player__navigation--idle'
							: 'player__navigation'
					}
				>
					{/* Mini player play button */}
					{!isFullScreen && !active && (
						<button className="btn btn--pause-play" onClick={pausePlay}>
							{playing ? <IoIosPause /> : <IoIosPlay />}
						</button>
					)}

					{/* Enter/exit fullscreen for mobile,
						Enter/exit expanded view for desktop */}
					<button
						className="btn btn--back"
						onClick={(e) => {
							if (isFullScreen) exitFullScreen()

							if (isMobile) requestFullScreen()
							else fullScreen()
						}}
					>
						{active || isFullScreen ? <BiArrowBack /> : <RiFullscreenLine />}
					</button>

					{!isFullScreen && !active && (
						<button className="btn btn--close" onClick={() => setMedia(null)}>
							{!active && <AiOutlineClose />}
						</button>
					)}
				</div>
			</div>
		</>
	) : (
		<></>
	)
}

export default Player
