import RegionGeometryApiService from 'api/streamRegions/RegionGeometryApiService'

export const BUBBLES_SET_STREAMS = 'BUBBLES_SET_STREAMS'

export function setStreams (value = []) {
  return {
    type: BUBBLES_SET_STREAMS,
    payload: value
  }
}

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
