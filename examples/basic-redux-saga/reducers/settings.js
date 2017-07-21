import { TOGGLE } from '../constants'

const initialState = {
  delayRouteTransitions: true,
}

export default function update(state = initialState, action) {
  if(action.type === TOGGLE) {
    return { delayRouteTransitions: !state.delayRouteTransitions }
  }
  return state
}
