'use strict'
import BaseApi from '../BaseApi'
import RegionApiService from './RegionApiService'
import topojson from 'topojson'
import _ from 'lodash'
console.log('hello', topojson)

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
        console.log(geometry);
        return {
          trout_stream_section: topojson.feature(geometry, geometry.objects.trout_stream_section),
          restriction_section: topojson.feature(geometry, geometry.objects.restriction_section),
          streamProperties: topojson.feature(geometry, geometry.objects.stream),
          pal_routes: topojson.feature(geometry, geometry.objects.publicly_accessible_land_section),
          stream_access_point: topojson.feature(geometry, geometry.objects.stream_access_point)
        }
      })
      .then(objects => {
        // create dictionary
        let sectionsMap = _.groupBy(objects.trout_stream_section.features, 'properties.stream_gid')
        let restrictionsMap = _.groupBy(objects.restriction_section.features, 'properties.stream_gid')
        let palMap = _.groupBy(objects.pal_routes.features, 'properties.stream_gid')
        let accessMap = _.groupBy(objects.stream_access_point.features, 'properties.stream_gid')
        let debuggeringDesiredStreams = [4, 8, 14, 27, 54, 58, 57, 72, 333, 500]
        // let debuggeringDesiredStreams = [57]
        let streamDictionary = objects.streamProperties.features
          // .slice(187, 188)
          .filter(f => f.properties.gid != null
            // && _.some(debuggeringDesiredStreams, x => f.properties.gid === x)

            )
          .reduce((dictionary, currentItem, index) => {
            let streamId = currentItem.properties.gid
            dictionary[streamId] = {}
            let entry = dictionary[streamId]
            entry.stream = currentItem

            entry.sections = sectionsMap[streamId]
              .sort((a, b) => b.properties.start - a.properties.start)

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

            return dictionary
          }, {})
        console.log(streamDictionary)
        return streamDictionary
      })
    // this.cache.set(regionKey, promise)
    return promise
  }
}

export default new RegionGeometryApiService()
