import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import SvgAnimatedPathComponent from '../SvgAnimatedPath.component'
import _ from 'lodash'
// import classes from '../SvgBubble.scss'
import waypointClasses from './RingWaypoint.scss'

const TAU = Math.PI * 2

const RingWaypointComponent = React.createClass({
  propTypes: {
    subjectCoordinates: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired
    }),
    normalizedOffset: PropTypes.number.isRequired,
    labelText: PropTypes.string.isRequired,
    cssName: PropTypes.string.isRequired,
    timing: PropTypes.shape({
      offset: PropTypes.number.isRequired,
      length: PropTypes.number.isRequired
    }),
    projection: PropTypes.func.isRequired,
    layout: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      radius: PropTypes.number.isRequired,
      arcCompressionRatio: PropTypes.number.isRequired,
      rotatePhase: PropTypes.number.isRequired
    })
  },

  renderSubjectMarker(dotXScreenCoordinate, dotYScreenCoordinate) {
    return <circle className={waypointClasses.accessPointDot} cx={dotXScreenCoordinate} cy={dotYScreenCoordinate} r='3' />
  },

  renderLabelMarker(dotXScreenCoordinate, dotYScreenCoordinate) {
    return <circle className={waypointClasses.accessPointDot} cx={dotXScreenCoordinate} cy={dotYScreenCoordinate} r='3' />
  },

  renderLabelText (text, offset, radius, width, height, cssClass) {
    if (text == null || offset == null) {
      throw new Error('argumetns cannot be null')
    }

    return <text
      transform={`translate(${width / 2}, ${height / 2}` + ')rotate(' + (offset - 90) + ')'}
      className={cssClass}
      x={radius + 36}
      >{text} </text>
  },

  renderLine (screenCoordinates) {
    if (screenCoordinates == null || screenCoordinates.length < 2) {
      return null
    }

    let coordinateArray = _.flatten(
      _.map(screenCoordinates, x => [x.dotXScreenCoordinate, x.dotYScreenCoordinate]))

    let polylinePoints = coordinateArray.join(',')

    return <g id='FeatureLine' className={waypointClasses.accessPointConnector}>
      {
        <polyline className={waypointClasses.accessPointConnector} points={polylinePoints} />
      }
    </g>
  },

  renderWaypointAndGuideline (subjectCoordinates, linearOffset) {

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
    let { width, height, radius, arcCompressionRatio, rotatePhase } = this.props.layout
    let { subjectCoordinates, normalizedOffset, projection, cssName, labelText } = this.props
    let offsetLocationDegrees = 360 * arcCompressionRatio * normalizedOffset
    let radianOffset = TAU * arcCompressionRatio

    // this is the coordinate of the dot inside the Ring
    let subjectLatitude = subjectCoordinates.latitude
    let subjectLongitude = subjectCoordinates.longitude

    let subjectScreenCoordinates = projection([subjectLongitude, subjectLatitude])

    // this is the coordinate of the dot outside the Ring next to the label
    let labelOffsetFromRadius = radius + 30
    let radialPosition = radianOffset * normalizedOffset
    let labelCircleXCoordinate = this.getXCoordinate(radialPosition, labelOffsetFromRadius, width)  // labelOffsetFromRadius * Math.cos((-Math.PI * 0.5) + radialPosition) + (width * 0.5)
    let labelCircleYCoordinate = this.getYCoordinate(radialPosition, labelOffsetFromRadius, height) // labelOffsetFromRadius * Math.sin((-Math.PI * 0.5) + radialPosition) + (height * 0.5)

    let lineStartPoint = {
      dotXScreenCoordinate: subjectScreenCoordinates[0],
      dotYScreenCoordinate: subjectScreenCoordinates[1]
    }

    let lineMiddlePoint = {
      dotXScreenCoordinate: this.getXCoordinate(radialPosition, radius - 15, width),
      dotYScreenCoordinate: this.getYCoordinate(radialPosition, radius - 15, height)
    }

    let lineEndPoint = {
      dotXScreenCoordinate: labelCircleXCoordinate,
      dotYScreenCoordinate: labelCircleYCoordinate
    }

    let lineCoordinates = [lineStartPoint, lineMiddlePoint, lineEndPoint]
      // {this.props.subjectElement}

    return <g className={waypointClasses.accessPoint}>
      {this.renderSubjectMarker(subjectScreenCoordinates[0], subjectScreenCoordinates[1])}
      <g id='label'>
        {this.renderLabelMarker(labelCircleXCoordinate, labelCircleYCoordinate)}
        {this.renderLabelText(labelText, offsetLocationDegrees, radius, width, height, cssName)}
      </g>
      {this.renderLine(lineCoordinates)}
    </g>
  }
})

export default RingWaypointComponent
