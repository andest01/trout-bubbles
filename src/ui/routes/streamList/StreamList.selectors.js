import _ from 'lodash'
import { createSelector } from 'reselect'

export const getStreamDictionary = state => state.bubbles.streamDictionary

const EMPTY_STREAM_LIST = {}
export const getStreamGroups = createSelector(
  [getStreamDictionary], (streamDictionary) => {
    if (streamDictionary == null || _.isEmpty(streamDictionary)) {
      return EMPTY_STREAM_LIST
    }
    let result = _.valuesIn(streamDictionary)

    result = _.sortBy(result, 'stream.properties.name')
    let groups = _.groupBy(result, item => {
      return item.stream.properties.name.charAt(0)
    })
      // .filter(s => s.stream.properties.length_mi > 15 && s.stream.properties.length_mi < 100)
      // .filter(s => s.sections.length > 0)

        // .filter(s => s.restrictions.length > 1)
    let countyArray = _.map(counties, c => {
      return {
        id: c.id,
        streams: c.streamIds.map(s => streamDictionary[s])
      }
    })

    let countyGroup = _.groupBy(countyArray, 'id')
    return countyGroup
  }
)

const counties = [{"id":"Dakota","streamIds":[13,56,215,270,289,293,305,362,375,392]},{"id":"Dodge","streamIds":[]},{"id":"Fillmore","streamIds":[1,4,5,9,48,51,57,108,137,151,218,219,221,222,223,225,226,227,229,230,231,232,233,236,237,239,240,243,244,245,247,250,251,254,255,260,261,262,263,266,274,276,278,279,284,285,287,290,291,294,303,399,582,745,760,761,765,766,768,772,773,774,777,781,789,795,800,802,804,808,810]},{"id":"Goodhue","streamIds":[56,59,60,71,165,169,309,362,370,379,382,388,392,790,798,801,822]},{"id":"Houston","streamIds":[34,52,57,116,133,173,180,182,185,186,189,190,194,202,206,209,220,238,255,263,282,283,286,287,288,291,294,301,302,303,307,311,312,313,315,322,452,684,698,699,742,743,750,752,758,759,774,782,797]},{"id":"Mower","streamIds":[5,183,191,233,240,244]},{"id":"Olmsted","streamIds":[1,53,204,205,218,221,253,271,280,317,785]},{"id":"Wabasha","streamIds":[39,53,112,170,234,235,241,242,249,273,281,292,295,299,300,309,316,379,381,382,386,805,809,813]},{"id":"Winona","streamIds":[1,44,45,49,51,52,53,111,119,164,170,172,175,178,192,195,196,203,210,211,212,214,216,217,220,223,224,228,234,242,248,252,253,256,257,258,260,264,267,268,269,271,272,277,282,297,298,307,308,315,317,479,536,584,716,749,756,757,762,764,770,776,778,780,784,788,791,793,799,807]}]