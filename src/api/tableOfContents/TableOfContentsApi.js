import BaseApi from '../BaseApi'
import _ from 'lodash'
import topojson from 'topojson'
import HierarchicalGeometryViewModel from './HierarchicalGeometryViewModel'
import StreamGeometryViewModel from './StreamGeometryViewModel'
import {
  default as Q
}
from 'q'
export class TableOfContentsApi extends BaseApi {
  getData () {
    let key = 'tableOfContents.topo.json'
    let cacheCandidate = this.cache.get(key)
    let promise = null
    if (cacheCandidate != null) {
      promise = Q.when(cacheCandidate)
    } else {
      promise = super.get('tableOfContents.topo.json')
        .then((data) => {
          this.cache.set(key, data)
          return data
        })
    }

    var t = promise.then(data => {
      let regionTopoJson = data
      let state = topojson.feature(regionTopoJson, regionTopoJson.objects.state)
      let regions = topojson.feature(regionTopoJson, regionTopoJson.objects.region)
      let counties = topojson.feature(regionTopoJson, regionTopoJson.objects.county)
      let streams = topojson.feature(regionTopoJson, regionTopoJson.objects.streamProperties)
      let tableOfContents = {
        state, regions, counties, streams
      }

      return tableOfContents
    })

    return t
  }

  getTableOfContents (data) {
    let {
      state, regions, counties, streams
    } = data

    let stateHash = _(state.features)
      .map((feature) => {
        let stateModel = new HierarchicalGeometryViewModel()
        let prop = feature.properties
        stateModel.id = prop.gid
        stateModel.name = prop.name
        stateModel.centroidLatitude = NaN
        stateModel.shortName = prop.short_name.toLowerCase()
        stateModel.centroidLongitude = NaN
        stateModel.parent = null
        stateModel.type = 'state'
        stateModel.children = []
        stateModel.geometry = feature
        return stateModel
      })
      .keyBy('id')
      .value()

    let regionHash = _(regions.features)
      .map((feature) => {
        let regionModel = new HierarchicalGeometryViewModel()
        regionModel.shortName = feature.properties.name.toLowerCase()
        regionModel.id = feature.properties.gid
        regionModel.name = feature.properties.name
        regionModel.geometry = feature
        regionModel.type = 'region'
        return regionModel
      })
      .sortBy('name')
      .keyBy('id')
      .value()

    let countyhash = _(counties.features)
      .filter((feature) => {
        return feature.properties.stream_count > 0
      })
      .map((feature) => {
        let countyModel = new HierarchicalGeometryViewModel()
        let properties = feature.properties
        countyModel.id = properties.gid
        countyModel.name = properties.name
        countyModel.geometry = feature
        _.extend(countyModel, properties)
        countyModel.type = 'county'
        return countyModel
      })
      .sortBy('name')
      .keyBy('id')
      .value()

    let countyByRegion = _(countyhash)
      .groupBy('region_id')
      .value()

    // TODO: Fix this nonsense.
    let minnesota = stateHash['49']
    let regionByState = _(regionHash)
      .groupBy(() => {
        return minnesota.id
      })
      .value()

    let streamViewModels = _(streams.features)
      .filter((feature) => {
        let properties = feature.properties
        if (properties.Id == null) {
          console.log('DEAD PROPERTY FOUND', feature)
          return false
        }

        return true
      })
      .map((feature) => {
        let streamModel = new StreamGeometryViewModel()
        let properties = feature.properties
        // HACK. There is an issue with koa-satic that forces it to read these as a problem.
        let cleanSlug = properties.Slug.replace(/\./gi, '_')
        streamModel.id = cleanSlug
        streamModel.slug = cleanSlug
        streamModel.name = properties.Name
        streamModel.geometry = feature
        streamModel.visible = true

        streamModel.centroidLongitude = properties.CentroidLongitude
        streamModel.centroidLatitude = properties.CentroidLatitude

        streamModel.maximumLatitude = properties.Maximum_Latitude
        streamModel.maximumLongitude = properties.Maximum_Longitude
        streamModel.minimumLatitude = properties.Minimum_Latitude
        streamModel.minimumLongitude = properties.Minimum_Longitude

        streamModel.boundingBox = [[streamModel.minimumLongitude, streamModel.minimumLatitude],
          [streamModel.maximumLongitude, streamModel.maximumLatitude]]

        _.extend(streamModel, properties)
        streamModel.type = 'streamCentroid'
        return streamModel
      })

    let streamHashBySlug = streamViewModels.keyBy('slug').value()

    let streamHash = streamViewModels.sortBy('name')
      .keyBy('id')
      .value()

    _.forEach(stateHash, (state) => {
      let stateId = state.id
      let regions = regionByState[stateId]
      state.children = regions
      _.forEach(state.children, (region) => {
        let regionId = region.id
        let counties = countyByRegion[regionId]
        region.children = counties
        region.parent = state
        _.forEach(region.children, (c) => {
          c.parent = region
        })
      })
    })

    // now we have to get the streams under the counties.
    // we have to respect the Many to Many relationship.
    _.forEach(streamHash, (stream) => {
      _.forEach(stream.Counties, (streamCountyModel) => {
        let countyModel = countyhash[streamCountyModel.Id]
        countyModel.children.push(stream)
        // what to do about the parent tho?
      })
    })
    return {
      states: _(stateHash).values().value(),
      statesHash: stateHash,
      streams: _(streamHash).values().value(),
      streamsHash: streamHash,
      streamsBySlug: streamHashBySlug,
      regions: _(regionHash).values().value(),
      regionsHash: regionHash
    }
  }
}

export default new TableOfContentsApi()
