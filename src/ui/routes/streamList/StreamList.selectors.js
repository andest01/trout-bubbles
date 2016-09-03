import _ from 'lodash'
import { createSelector } from 'reselect'

export const getStreamDictionary = state => state.bubbles.streamDictionary

const EMPTY_STREAM_LIST = []
export const getStreamGroups = createSelector(
  [getStreamDictionary], (streamDictionary) => {
    if (streamDictionary == null) {
      return EMPTY_STREAM_LIST
    }
    let result = _.valuesIn(streamDictionary)
    result = _.sortBy(result, 'stream.properties.name')
      .filter(s => {
        let hasHighwaysOrRailroads = s.accessPoints
          // .filter(ap => ap.properties.road_type_id === 2)
          .filter(ap => ap.properties.road_type_id > 4)
          .length > 4
        console.log(hasHighwaysOrRailroads)
        return hasHighwaysOrRailroads
      })
    let groups = _.groupBy(result, item => {
      return item.stream.properties.name.charAt(0)
    })
      // .filter(s => s.stream.properties.length_mi > 15 && s.stream.properties.length_mi < 100)
      // .filter(s => s.sections.length > 0)
      // .filter(s => s.restrictions.length > 1)

    return groups
  }
)   
