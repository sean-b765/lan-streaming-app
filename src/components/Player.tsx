import React, { RefObject, useEffect, useRef, useState } from 'react'
import { IMedia } from '../types/interfaces'
import { RiFullscreenExitLine, RiFullscreenLine } from 'react-icons/ri'
import { disableScrolling, enableScrolling } from '../util/scroll'
import { IoIosPause, IoIosPlay } from 'react-icons/io'
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

	const [progressPct, setProgressPct] = useState(0)
	const [buffering, setBuffering] = useState(false)

	// the container needs to be fullscreen rather than just the video.
	//  this lets you overlay elements while in fullscreen mode
	const containerRef = useRef<HTMLDivElement>(null)

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

	window.onmouseup = () => {
		if (seeking) setSeeking(false)
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

	const handleSeek = (percentage: number) => {
		try {
			const duration = playerRef.current?.duration || 0

			playerRef.current?.fastSeek(percentage * duration)
		} catch (err) {}
	}

	return media?._id ? (
		<>
			{buffering && <Loader />}
			<div
				ref={containerRef}
				style={idle ? { cursor: 'none' } : {}}
				className={
					active || isFullScreen
						? 'player player--active'
						: 'player player--small'
				}
			>
				<video
					className="player__video"
					src={formatMediaStream()}
					autoPlay
					onPlay={() => setPlaying(true)}
					onPause={() => setPlaying(false)}
					onVolumeChange={() => {}}
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
					onLoadedMetadata={() => {}}
					onPointerDown={() => {
						if (playerRef.current?.paused) playerRef.current?.play()
						else playerRef.current?.pause()
					}}
					ref={playerRef}
					onError={() => {}}
				></video>
				{/* Fullscreen player controls */}
				{(isFullScreen || active) && (
					<div
						className={
							idle
								? 'player__controls player__controls--idle'
								: 'player__controls'
						}
					>
						<button className="btn btn--pause-play" onClick={pausePlay}>
							{playing ? <IoIosPause /> : <IoIosPlay />}
						</button>

						{/* Seek, volume, fullscreen, etc */}
						<div className="player__controls__main">
							<div
								className="player__controls__main__seeker"
								onClick={(e) => {
									const target = e.target as HTMLElement
									const { left, width } = target.getBoundingClientRect()
									const x = e.clientX - left

									const percentage = x / width

									handleSeek(percentage)
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
							{!isMobile && (
								<div className="player__controls__main__volume"></div>
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
