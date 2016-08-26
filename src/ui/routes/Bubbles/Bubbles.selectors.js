import _ from 'lodash'
import { createSelector } from 'reselect'

export const getStreamDictionary = state => state.bubbles.streamDictionary

const EMPTY_STREAM_LIST = []
export const getStreamList = createSelector(
  [getStreamDictionary], (streamDictionary) => {
    if (streamDictionary == null) {
      console.log('empty')
      return EMPTY_STREAM_LIST
    }

    let result = _.valuesIn(streamDictionary)
    result = result  
      .filter(s => s.stream.properties.length_mi > 5 && s.stream.properties.length_mi < 100)
      // .filter(s => s.sections.length > 0)
      // .filter(s => s.restrictions.length > 1)

      // console.log(result);
    return result
  }
) 
