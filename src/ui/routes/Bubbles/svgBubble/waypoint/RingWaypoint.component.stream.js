import React, { PropTypes } from 'react'
import StreamComponent from '../stream/Stream.component'
import RingWaypointLineComponent from './RingWaypoint.component.line'
import { getTiming } from '../SvgBubble.selectors'
import RingWaypointLabelComponent from './RingWaypoint.component.label'

import streamClasses from './RingWaypoint.stream.scss'
import waypointClasses from './RingWaypoint.scss'

const TAU = Math.PI * 2

const RingWaypointStreamComponent = React.createClass({
  propTypes: {
    stream: PropTypes.object.isRequired,
    timing: PropTypes.object.isRequired,
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
          timing={this.props.timing}
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

  transformDownstreamLabel (offsetLocationDegrees, height, width, radius, labelOffsetFromRadius) {
    let preRotate = `rotate(${(-offsetLocationDegrees + 90) * 0})`
    let translate = `translate(${labelOffsetFromRadius}, ${0})`
    let postRotate = `rotate(${offsetLocationDegrees - 90})`
    let secondTranslate = `translate(${width / 2}, ${height / 2})`

    let transform = `${secondTranslate} ${postRotate} ${translate} ${preRotate}`

    return transform
  },

  transformUpstreamLabel (offsetLocationDegrees, height, width, radius, labelOffsetFromRadius) {
    let preRotate = `rotate(${(-offsetLocationDegrees + 270) * 0})`
    let translate = `translate(${labelOffsetFromRadius}, ${0})`
    let postRotate = `rotate(${offsetLocationDegrees - 90})`
    let secondTranslate = `translate(${width / 2}, ${height / 2})`
    let transform = `${secondTranslate} ${postRotate} ${translate}  ${preRotate}`

    return transform
  },

  getTransformText (offsetLocationDegrees, height, width, radius, labelOffsetFromRadius) {
    return offsetLocationDegrees > 180
      ? this.transformUpstreamLabel(offsetLocationDegrees, height, width, radius, labelOffsetFromRadius)
      : this.transformDownstreamLabel(offsetLocationDegrees, height, width, radius, labelOffsetFromRadius)
  },

  renderLabel (labelCircleXCoordinate, labelCircleYCoordinate, labelText, offsetLocationDegrees, radius, width, height, labelOffsetFromRadius) {
    let transform = this.getTransformText(offsetLocationDegrees, height, width, radius, labelOffsetFromRadius)
    return (<g id='label' transform={transform}>
      {this.renderLabelMarker(labelCircleXCoordinate, labelCircleYCoordinate)}
      {this.renderLabelText(labelText, offsetLocationDegrees, radius, width, height)}
    </g>)
  },

  renderLabelMarker () {
    return <circle
      className={streamClasses.tributaryLabelPoint}
      cx={0}
      cy={0}
      r='3' />
  },

  renderLabelText (text, offset, radius, width, height) {
    if (text == null || offset == null) {
      throw new Error('argumetns cannot be null')
    }

    let cssClass = streamClasses.tributaryLabel
    let transform = offset > 180
      ? 'rotate(180)'
      : 'rotate(0)'

    let textAnchor = offset > 180
      ? 'end'
      : 'start'

    let xPos = offset > 180
      ? -6
      : 6

    // let cssClass =
    return <text
      // transform={`translate(${width / 2}, ${height / 2}` + ')rotate(' + (offset - 90) + ')'}
      transform={transform}
      className={cssClass}
      dominantBaseline='central'
      textAnchor={textAnchor}
      x={xPos}
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

  getCounterRotation (offsetLocationDegrees) {
    // doint a pure counter-rotation over-compresses at the bottom.
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
    let icon = this.renderLabelMarker()
    let marker = <rect x='-3' y='-0.5' width='5' height='1' />
    return <g>
      <a onClick={this.onClick} className={streamClasses.tributaryWaypoint + ' ' + waypointClasses.waypoint} xlinkHref={'#'}>
        <RingWaypointLineComponent
          subjectCoordinates={tributaryConfluenceCoordinates}
          normalizedOffset={normalizedOffset}
          projection={this.props.projection}
          layout={this.props.layout} />
        <RingWaypointLabelComponent
          layout={this.props.layout}
          normalizedOffset={normalizedOffset}
          marker={marker}
          icon={icon}
          labelText={labelText} />
      </a>
    </g>
  }
})

// {this.renderStream(subjectScreenCoordinates[0], subjectScreenCoordinates[1], streamData)}
// {this.renderLabel(labelCircleXCoordinate, labelCircleYCoordinate, labelText, offsetLocationDegrees, radius, width, height, labelOffsetFromRadius)}

export default RingWaypointStreamComponent
