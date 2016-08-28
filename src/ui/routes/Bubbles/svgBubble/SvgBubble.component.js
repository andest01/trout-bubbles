import React, { PropTypes } from 'react'
import classes from './SvgBubble.scss'
import * as d3 from 'd3'
import StreamComponent from './stream/Stream.component'
import { getProjectionFromFeature } from './SvgBubble.selectors'

import RingComponent from './ring/Ring.component'
import RingSectionComponent from './ring/RingSection.component'
import RingWaypointComponent from './waypoint/RingWaypoint.component'

const FISH_SANCTUARY_ID = 7
const ANIMATION_SCALE = 2.0
const DIMENSIONS = 500

const SQUISH_FACTOR = 0.95
const ROTATE_PHASE = Math.PI / 2
const RADIUS = 110

const SvgBubbleComponent = React.createClass({
  propTypes: {
    streamPackage: React.PropTypes.shape({
      stream: PropTypes.object.isRequired,
      sections: PropTypes.array.isRequired,
      restrictions: PropTypes.array.isRequired,
      palSections: PropTypes.array.isRequired,
      accessPoints: PropTypes.array.isRequired,
      tributaries: PropTypes.array.isRequired,
      circle: PropTypes.object.isRequired
    }).isRequired,
    index: PropTypes.number.isRequired
  },

  componentWillMount () {
    this.width = DIMENSIONS
    this.height = DIMENSIONS

    this.projection = getProjectionFromFeature(this.props.streamPackage.circle,
        { width: DIMENSIONS, height: DIMENSIONS, radius: RADIUS })

    this.pathGenerator = d3.geoPath()
      .projection(this.projection)
      .pointRadius(1)

    this.layout = {
      width: this.width,
      height: this.height,
      radius: RADIUS,
      arcCompressionRatio: SQUISH_FACTOR,
      rotatePhase: ROTATE_PHASE
    }
  },

  renderOuterCircleAxis () {
    return <RingComponent
      streamPackage={this.props.streamPackage}
      pathGenerator={this.pathGenerator}
      index={this.props.index}
      layout={this.layout} />
  },

  renderAccessPoints () {
    return this.props.streamPackage.accessPoints.map((accessPoint, accessPointsIndex) => {
      let normalizedOffset = accessPoint.properties.linear_offset
      let worldCoordinates = {
        latitude: accessPoint.properties.centroid_latitude,
        longitude: accessPoint.properties.centroid_longitude
      }
      let accessClass = classes.accessPoint
      let timing = {
        offset: this.baseAccessPointOffset + accessPointsIndex * this.accessPointSpeed,
        length: 20
      }
      return <RingWaypointComponent
        subjectCoordinates={worldCoordinates}
        normalizedOffset={normalizedOffset}
        cssName={accessClass}
        key={accessPoint.properties.gid}
        timing={timing}
        projection={this.projection}
        labelText={accessPoint.properties.street_name}
        layout={this.layout} />
    })
  },

  renderTributaries () {
    return this.props.streamPackage.tributaries.map((tributary, accessPointsIndex) => {
      let normalizedOffset = tributary.properties.linear_offset
      let worldCoordinates = {
        latitude: tributary.properties.centroid_latitude,
        longitude: tributary.properties.centroid_longitude
      }
      let accessClass = classes.accessPoint
      let timing = {
        offset: this.baseAccessPointOffset + accessPointsIndex * this.accessPointSpeed,
        length: 20
      }
      return <RingWaypointComponent
        subjectCoordinates={worldCoordinates}
        normalizedOffset={normalizedOffset}
        cssName={accessClass}
        key={tributary.properties.gid}
        timing={timing}
        projection={this.projection}
        labelText={tributary.properties.streamData.stream.properties.name}
        layout={this.layout} />
    })
  },

  render () {
    let name = this.props.streamPackage.stream.properties.name
    let id = this.props.streamPackage.stream.properties.gid
    return (
      <div className={classes.container}>
        <svg
          viewBox={`0 0 ${this.width} ${this.height}`}
          preserveAspectRatio='xMidYMid meet'
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          id={'trout_stream_' + name + '_' + id} >
          <title>{name} {id}</title>
          <defs>
            <clipPath id='circle-stencil'>
              <circle cx={this.width / 2} cy={this.height / 2} r={RADIUS - 3} />
            </clipPath>
          </defs>
          <g id='stream' clipPath='url(#circle-stencil)'>
            <StreamComponent
              streamPackage={this.props.streamPackage}
              pathGenerator={this.pathGenerator}
              projection={this.projection}
              index={this.props.index}
              layout={this.layout} />
          </g>
          {this.renderOuterCircleAxis()}
          <g id='waypoints'>
            <g id='access-points'>
              {this.renderAccessPoints()}
            </g>

            <g id='tributaries'>
              {this.renderTributaries()}
            </g>
          </g>
          }
        </svg>
      </div>
    )
  }
})

export default SvgBubbleComponent
