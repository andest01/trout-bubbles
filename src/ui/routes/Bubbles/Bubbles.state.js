import RegionGeometryApiService from 'api/streamRegions/RegionGeometryApiService'

// ------------------------------------
// Constants
// ------------------------------------
// export const COUNTER_INCREMENT = 'COUNTER_INCREMENT'
export const BUBBLES_SET_STREAMS = 'BUBBLES_SET_STREAMS'
// ------------------------------------
// Actions
// ------------------------------------
// export function increment (value = 1) {
//   return {
//     type: COUNTER_INCREMENT,
//     payload: value
//   }
// }

export function setStreams (value = []) {
  return {
    type: BUBBLES_SET_STREAMS,
    payload: value
  }
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk!

    NOTE: This is solely for demonstration purposes. In a real application,
    you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
    reducer take care of this logic.  */

export const getSouthEasternStreams = () => {
  return (dispatch, getState) => {
    let stateName = 'MN'
    let regionName = 'SoutheasternDriftless'
    return RegionGeometryApiService.getRegion(stateName, regionName)
      .then(result => {
        dispatch(setStreams(result))
      })
  }
}

export const actions = {
  getSouthEasternStreams
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [BUBBLES_SET_STREAMS]: (state, action) => {
    console.log('setting state', action.payload)

    let newState = {...state, ...{streamDictionary: action.payload}}
    return newState
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  streamDictionary: {}
}

export default function counterReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
