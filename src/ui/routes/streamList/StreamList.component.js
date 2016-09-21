import React, { PropTypes } from 'react'
import classes from './StreamList.style.scss'
import StreamItemComponent from './StreamItem.component'
// import { StickyContainer, Sticky } from 'react-sticky';
import _ from 'lodash'

const MAX_DIMENSION = 24
const CENTER = MAX_DIMENSION / 2
const SQUISH_FACTOR = 4.0

const StreamListContainer = React.createClass({
  propTypes: {
    streams: PropTypes.object.isRequired,
    getSouthEasternStreams: PropTypes.func.isRequired
  },

  componentDidMount () {
    this.props.getSouthEasternStreams()
  },

  getStreamItemData (streamObject) {
    let length = _.sumBy(streamObject.sections, section => { return section.properties.length_mi })
    let publicLength = streamObject.stream.properties.publicly_accessible_trout_stream_section_length
    publicLength = Math.min(length, publicLength)
    let streamItemObject = {}
    streamItemObject.waterRadius = this.computeRadiusFromLength(length)
    let publicLandLengthToWaterLengthRatio = publicLength / length
    streamItemObject.publicLandRadius = streamItemObject.waterRadius * publicLandLengthToWaterLengthRatio
    streamItemObject.length = this.computeRadiusFromLength(streamObject.stream.properties.length_mi)
    streamItemObject.streamLength = streamObject.stream.properties.length_mi
    streamItemObject.publicLength = streamObject.stream.properties.publicly_accessible_trout_stream_section_length
    streamItemObject.troutLength = length
    streamItemObject.name = streamObject.stream.properties.name
    streamItemObject.id = streamObject.stream.properties.gid
    streamItemObject.hasAlert = streamObject.restrictions.length > 0
    return streamItemObject
  },

  computeRadiusFromLength (length) {
    let area = Math.sqrt(length / Math.PI)
    return area
  },

  render () {
    return (
      <div>
        <h4>Displaying 0 streams</h4>
        {
          _.map(this.props.streams, (value, key) => {
            console.log(value)

            return (
              <div key={key}>
                <div className={classes.myHeaderLol}>
                  <h4>{key}</h4>
                  <hr />
                </div>
                <ul className={classes.list}>
                {
                  value.map((streamItem, index) => {
                    let streamItemProperties = this.getStreamItemData(streamItem)
                    let publiclyAccessibleAccessPoints = streamItem.accessPoints.filter(ap => ap.properties.is_over_publicly_accessible_land === 1 && ap.properties.is_over_trout_stream === 1).length
                    return (
                      <li key={streamItem.stream.properties.gid} className={'' + classes.item}>
                        <StreamItemComponent
                          index={index + 1}
                          streamRadius={streamItemProperties.length * SQUISH_FACTOR}
                          streamLength={streamItemProperties.streamLength}
                          troutStreamSectionRadius={streamItemProperties.waterRadius * SQUISH_FACTOR}
                          troutLength={streamItemProperties.troutLength}
                          publiclyAccessibleTroutStreamSectionRadius={streamItemProperties.publicLandRadius * SQUISH_FACTOR}
                          publicLength={streamItemProperties.publicLength}
                          id={streamItemProperties.id}
                          name={streamItemProperties.name}
                          publiclyAccessibleAccessPoints={publiclyAccessibleAccessPoints}
                          hasAlert={streamItemProperties.hasAlert} />
                      </li>)
                  })
                }
                </ul>
              </div>
            )
          })
        }
      </div>)
  }
})

export default StreamListContainer
