import React, { useEffect, useState } from 'react'
import { IMedia } from '../types/IMedia'
import { RiFullscreenLine, RiFullscreenExitLine } from 'react-icons/ri'
import { disableScrolling, enableScrolling } from '../util/scroll'

const Player: React.FC<{
	media: IMedia
	setMedia: Function
	active: boolean
	setActive: Function
	canEnableScroll: boolean
}> = ({ media, setMedia, active, setActive, canEnableScroll }) => {
	const formatMediaStream = () => {
		if (!media._id) return
		return `http://192.168.1.7:5000/files/stream/${media?._id}`
	}

	useEffect(() => {
		if (!active && canEnableScroll) enableScrolling()
		else disableScrolling()
	}, [active])

	return media._id ? (
		<div className={active ? 'player player--active' : 'player player--small'}>
			<video
				className="player__video"
				src={formatMediaStream()}
				controls
				autoPlay
				ref={null}
				onError={() => {
					alert(
						'If you experience an error and are using Firefox, consider switching browsers.'
					)
				}}
			></video>
			<div className="player__controls"></div>
			<div className="player__navigation">
				<button
					className="btn btn--back"
					onClick={() => {
						setActive(!active)
					}}
				>
					{active ? <RiFullscreenExitLine /> : <RiFullscreenLine />}
				</button>
			</div>
		</div>
	) : (
		<div></div>
	)
}

export default Player
