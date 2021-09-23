import { MediaActions } from '../types/enums'
import { IAction } from '../types/interfaces'

export default (state = {}, action: IAction) => {
	switch (action.type) {
		case MediaActions.SET_ALL:
			return { ...state }

		default:
			return { ...state }
	}
}
