'use strict'
import BaseApi from '../BaseApi'
import RegionApiService from './RegionApiService'
import topojson from 'topojson'
import _ from 'lodash'
const MINIMUM_LENGTH_MILES = 0.05
export class RegionGeometryApiService extends BaseApi {
  getCacheKey () {
    var REGION_CACHE_KEY = 'region'
    return REGION_CACHE_KEY
  }

  createKey (stateId, regionId) {
    var REGION_CACHE_KEY = this.getCacheKey()
    return REGION_CACHE_KEY + '_' + stateId + '_' + regionId
  }

  getRegion (stateId, regionId) {
    var promise = RegionApiService.getRegion(stateId, 'result')
      .then(geometry => {
        console.log(geometry)
        let bounds = topojson.feature(geometry, geometry.objects.bounding_square_circles)
        return {
          trout_stream_section: topojson.feature(geometry, geometry.objects.trout_stream_section),
          restriction_section: topojson.feature(geometry, geometry.objects.restriction_section),
          streamProperties: topojson.feature(geometry, geometry.objects.stream),
          pal_routes: topojson.feature(geometry, geometry.objects.publicly_accessible_land_section),
          stream_access_point: topojson.feature(geometry, geometry.objects.access_point_view),
          stream_tributary: topojson.feature(geometry, geometry.objects.stream_tributary),
          bounding_circles: bounds
        }
      })
      .then(objects => {
        // create dictionary
        let sectionsMap = _.groupBy(objects.trout_stream_section.features, 'properties.stream_gid')
        let restrictionsMap = _.groupBy(objects.restriction_section.features, 'properties.stream_gid')
        let palMap = _.groupBy(objects.pal_routes.features, 'properties.stream_gid')
        let accessMap = _.groupBy(objects.stream_access_point.features, 'properties.stream_gid')
        let tributaries = _.groupBy(objects.stream_tributary.features
            .filter(x => x.properties.linear_offset > 0.0001 && x.properties.linear_offset < 0.999),
             'properties.stream_gid')

        // let debuggeringDesiredStreams = [4, 8, 14, 27, 54, 58, 57, 72, 333, 500]
        // let debuggeringDesiredStreams = [57]
        // let tempStreamDictionary = _.keyBy(objects.streamProperties.features, 'properties.gid')
        let tempCircleDictionary = _.keyBy(objects.bounding_circles.features, 'properties.gid')
        let streamDictionary = objects.streamProperties.features
          // .slice(187, 188)

          .reduce((dictionary, currentItem, index) => {
            let streamId = currentItem.properties.gid
            dictionary[streamId] = {}
            let entry = dictionary[streamId]
            entry.stream = currentItem

            entry.sections = sectionsMap[streamId]
              // .sort((a, b) => b.properties.start - a.properties.start)

            entry.restrictions = restrictionsMap[streamId] == null
              ? []
              : restrictionsMap[streamId]

            entry.palSections = palMap[streamId] == null
              ? []
              : palMap[streamId].sort((a, b) => b.properties.start - a.properties.start)

            entry.accessPoints = accessMap[streamId] == null
              ? []
              : accessMap[streamId]
                .sort((a, b) => b.properties.linear_offset - a.properties.linear_offset)
                .reduce((previousResult, currentItem, currentIndex) => {
                  if (currentIndex === 0) {
                    return previousResult.concat(currentItem)
                  }

                  // get the last item
                  let previousItem = previousResult[previousResult.length - 1]
                  let previousRoadName = previousItem.properties.street_name
                  // TODO: HACK: This is wrong, but it will work.
                  // data needs to disolve on TIS_C
                  let currentRoadName = currentItem.properties.street_name
                  let isSameRoad = currentRoadName === previousRoadName
                  if (isSameRoad) {
                    // check to see if distance is too close.
                    let length = entry.stream.properties.length_mi
                    let previousOffset = previousItem.properties.linear_offset * length
                    let currentOffset = currentItem.properties.linear_offset * length
                    let distance = Math.abs(currentOffset - previousOffset)

                    let isTooClose = distance < MINIMUM_LENGTH_MILES
                    if (isTooClose) {
                      // SKIP THIS ITEM - IT'S CLEARLY A DUPLICATE
                      return previousResult
                    }
                  }
                  return previousResult.concat(currentItem)
                }, [])
            entry.circle = tempCircleDictionary[streamId]
            return dictionary
          }, {})

          // update with tributaries.
        _.valuesIn(streamDictionary).forEach(stream => {
          let streamId = stream.stream.properties.gid
          let tribs = tributaries[streamId]
          stream.tributaries = tribs == null
            ? []
            : tributaries[streamId].map(t => {
              let tributaryId = t.properties.tributary_gid
              return {...t, ...{properties: {...t.properties, streamData: streamDictionary[tributaryId]}}}
            })
        })

        return streamDictionary
      })
    // this.cache.set(regionKey, promise)
    return promise
  }
}

// const updateWithNearestNeighbors = (items) => {
//   if (items == null || items.length === 0) {
//     return
//   }

//   let totalItems = items.length
//   items.forEach((item, index) => {
//     let hasUpstreamNeighbor = index + 1 < totalItems
//     let hasDownstreamNeighbor = index > 0

//     let itemOffset = item.properties.linear_offset
//     item.properties.
//   })
// }

export default new RegionGeometryApiService()
