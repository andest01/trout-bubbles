'use strict'
import BaseApi from '../BaseApi'
import RegionApiService from './RegionApiService'
import topojson from 'topojson'
import _ from 'lodash'

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
          stream_access_point: topojson.feature(geometry, geometry.objects.stream_access_point),
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
        let tributaries = _.groupBy(objects.stream_tributary.features.filter(x => x.properties.linear_offset > 0.0001 && x.properties.linear_offset < 0.999), 'properties.stream_gid')
          

        let debuggeringDesiredStreams = [4, 8, 14, 27, 54, 58, 57, 72, 333, 500]
        // let debuggeringDesiredStreams = [57]
        let tempStreamDictionary = _.keyBy(objects.streamProperties.features, 'properties.gid')
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
                .filter(a => true)
                .sort((a, b) => b.properties.linear_offset - a.properties.linear_offset)
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

export default new RegionGeometryApiService()
