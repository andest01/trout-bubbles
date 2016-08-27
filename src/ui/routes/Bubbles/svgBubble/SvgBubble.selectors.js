// import _ from 'lodash'
import * as d3 from 'd3'
// import { createSelector } from 'reselect'

export const getStreamDictionary = state => state.bubbles.streamDictionary
export const getSelectedStreamGid = state => state.bubbles.streamDictioanry

export const getProjectionFromFeature = (feature, { width, height, radius }) => {
  let streamGeometry = feature
  let diameter = radius * 2
  console.log(d3.geoCentroid)
  let centroid = d3.geoCentroid(streamGeometry)

  let lower = [(width - diameter) / 2 + 10, (height - diameter) / 2 + 10]
  let upper = [width - lower[0], height - lower[1]]
  let projection = d3.geoOrthographic()
    .rotate([-centroid[0], -centroid[1], 0])
    .fitExtent([lower, upper], feature)

  return projection
}
