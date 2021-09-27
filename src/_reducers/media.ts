import { MediaActions } from '../types/enums'
import { IAction } from '../types/interfaces'

export default (
	state = {
		media: {
			all: [],
			current: {},
		},
		series: {
			all: [],
			current: {},
			movies: {
				all: [],
			},
		},
		seasons: {
			all: [],
			current: {},
			// episodes within seasons
			episodes: {
				all: [],
			},
		},
	},
	action: IAction
) => {
	switch (action.type) {
		case MediaActions.SET_ALL_MEDIA:
			return { ...state, media: { ...state.media, all: action.payload } }
		case MediaActions.SET_CURRENT_MEDIA:
			return { ...state, media: { ...state.media, current: action.payload } }

		case MediaActions.SET_ALL_SERIES:
			return { ...state, series: { ...state.series, all: action.payload } }

		default:
			return { ...state }
	}
}
