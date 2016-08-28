import React, { PropTypes } from 'react'
import StreamComponent from '../stream/Stream.component'
import RingWaypointLineComponent from './RingWaypoint.component.line'

import streamClasses from './RingWaypoint.stream.scss'
import waypointClasses from './RingWaypoint.scss'

const TAU = Math.PI * 2

const RingWaypointStreamComponent = React.createClass({
  propTypes: {
    stream: PropTypes.object.isRequired,
    timing: PropTypes.shape({
      offset: PropTypes.number.isRequired,
      length: PropTypes.number.isRequired
    }),
    projection: PropTypes.func.isRequired,
    pathGenerator: PropTypes.func.isRequired,
    layout: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      radius: PropTypes.number.isRequired,
      arcCompressionRatio: PropTypes.number.isRequired,
      rotatePhase: PropTypes.number.isRequired
    })
  },

  // className={waypointClasses.accessPointDot + ' ' + waypointClasses.subjectAccessPointDot}
  renderStream (dotXScreenCoordinate, dotYScreenCoordinate, stream) {
    return (<g id={'subject'} clipPath='url(#circle-stencil)'>
      <g className={streamClasses.tributary} >
        <StreamComponent
          streamPackage={stream}
          pathGenerator={this.props.pathGenerator}
          projection={this.props.projection}
          index={3}
          layout={this.props.layout} />
      </g>
      <circle
        className={streamClasses.tributaryConfluencePoint}
        cx={dotXScreenCoordinate}
        cy={dotYScreenCoordinate}
        r='1' />
    </g>)
  },

  onClick (e) {
    e.preventDefault()
  },

  renderLabelMarker (dotXScreenCoordinate, dotYScreenCoordinate) {
    return <circle
      className={streamClasses.tributaryLabelPoint}
      cx={dotXScreenCoordinate}
      cy={dotYScreenCoordinate}
      r='3' />
  },

  renderLabelText (text, offset, radius, width, height) {
    if (text == null || offset == null) {
      throw new Error('argumetns cannot be null')
    }

    // let cssClass =
    return <text
      transform={`translate(${width / 2}, ${height / 2}` + ')rotate(' + (offset - 90) + ')'}
      x={radius + 36}
      className={streamClasses.tributaryLabel}
      >{text} </text>
  },

  getXCoordinate (radialPosition, labelOffsetFromRadius, width) {
    let result = labelOffsetFromRadius * Math.cos((-Math.PI * 0.5) + radialPosition) + (width * 0.5)
    return result
  },

  getYCoordinate (radialPosition, labelOffsetFromRadius, height) {
    let result = labelOffsetFromRadius * Math.sin((-Math.PI * 0.5) + radialPosition) + (height * 0.5)
    return result
  },

  render () {
    let normalizedOffset = this.props.stream.properties.linear_offset
    let tributaryConfluenceCoordinates = {
      latitude: this.props.stream.properties.centroid_latitude,
      longitude: this.props.stream.properties.centroid_longitude
    }

    let { width, height, radius, arcCompressionRatio } = this.props.layout
    let streamData = this.props.stream.properties.streamData
    let labelText = streamData.stream.properties.name

    let { projection } = this.props
    let offsetLocationDegrees = 360 * arcCompressionRatio * normalizedOffset
    let radianOffset = TAU * arcCompressionRatio

    // this is the coordinate of the dot inside the Ring
    let subjectLatitude = tributaryConfluenceCoordinates.latitude
    let subjectLongitude = tributaryConfluenceCoordinates.longitude

    let subjectScreenCoordinates = projection([subjectLongitude, subjectLatitude])

    // this is the coordinate of the dot outside the Ring next to the label
    let labelOffsetFromRadius = radius + 30
    let radialPosition = radianOffset * normalizedOffset
    let labelCircleXCoordinate = this.getXCoordinate(radialPosition, labelOffsetFromRadius, width)
    let labelCircleYCoordinate = this.getYCoordinate(radialPosition, labelOffsetFromRadius, height)

    // let cssName = svgBubbleClasses.accessPoint

    // return the root object that allows hovering, highlighting, etc.
    return <g>
      <a onClick={this.onClick} className={streamClasses.tributaryWaypoint + ' ' + waypointClasses.waypoint} xlinkHref={'#'}>
        <RingWaypointLineComponent
          subjectCoordinates={tributaryConfluenceCoordinates}
          normalizedOffset={normalizedOffset}
          projection={this.props.projection}
          layout={this.props.layout} />
        {this.renderStream(subjectScreenCoordinates[0], subjectScreenCoordinates[1], streamData)}
        <g id='label'>
          {this.renderLabelMarker(labelCircleXCoordinate, labelCircleYCoordinate)}
          {this.renderLabelText(labelText, offsetLocationDegrees, radius, width, height)}
        </g>
      </a>
    </g>
  }
})

export default RingWaypointStreamComponent
