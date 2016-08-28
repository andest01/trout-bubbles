import React, { PropTypes } from 'react'
import _ from 'lodash'
import RingWaypointLineComponent from './RingWaypoint.component.line'
const TAU = Math.PI * 2

import accessPointClasses from './RingWaypoint.accessPoint.scss'
import waypointClasses from './RingWaypoint.scss'

const RingWaypointAccessPointComponent = React.createClass({
  propTypes: {
    accessPoint: PropTypes.object.isRequired,
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

  renderSubjectMarker (dotXScreenCoordinate, dotYScreenCoordinate) {
    return <circle
      className={accessPointClasses.accessPointCrossing}
      cx={dotXScreenCoordinate}
      cy={dotYScreenCoordinate}
      r='1' />
  },

  renderLabelMarker (dotXScreenCoordinate, dotYScreenCoordinate) {
    return <circle
      className={accessPointClasses.accessPointLabelPoint}
      cx={dotXScreenCoordinate}
      cy={dotYScreenCoordinate}
      r='3' />
  },

  renderLabelText (text, offset, radius, width, height) {
    if (text == null || offset == null) {
      throw new Error('argumetns cannot be null')
    }
    let cssClass = accessPointClasses.accessPointLabel
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

  onClick (e) {
    e.preventDefault()
  },

  getYCoordinate (radialPosition, labelOffsetFromRadius, height) {
    let result = labelOffsetFromRadius * Math.sin((-Math.PI * 0.5) + radialPosition) + (height * 0.5)
    return result
  },

  render () {
    let { accessPoint, projection } = this.props
    let { width, height, radius, arcCompressionRatio } = this.props.layout
    let normalizedOffset = accessPoint.properties.linear_offset
    let accessPointWorldCoodinates = {
      latitude: accessPoint.properties.centroid_latitude,
      longitude: accessPoint.properties.centroid_longitude
    }

    let offsetLocationDegrees = 360 * arcCompressionRatio * normalizedOffset
    let radianOffset = TAU * arcCompressionRatio

    // this is the coordinate of the dot inside the Ring
    let subjectLatitude = accessPointWorldCoodinates.latitude
    let subjectLongitude = accessPointWorldCoodinates.longitude

    let subjectScreenCoordinates = projection([subjectLongitude, subjectLatitude])

    // this is the coordinate of the dot outside the Ring next to the label
    let labelOffsetFromRadius = radius + 30
    let radialPosition = radianOffset * normalizedOffset
    let labelCircleXCoordinate = this.getXCoordinate(radialPosition, labelOffsetFromRadius, width)
    let labelCircleYCoordinate = this.getYCoordinate(radialPosition, labelOffsetFromRadius, height)
    let labelText = this.props.accessPoint.properties.street_name
    return <g >
      <a onClick={this.onClick} className={accessPointClasses.tributaryWaypoint + ' ' + waypointClasses.waypoint} xlinkHref={'#'}>
        <RingWaypointLineComponent
          subjectCoordinates={accessPointWorldCoodinates}
          normalizedOffset={normalizedOffset}
          projection={this.props.projection}
          layout={this.props.layout} />
        {this.renderSubjectMarker(subjectScreenCoordinates[0], subjectScreenCoordinates[1])}
        <g id='label'>
          {this.renderLabelMarker(labelCircleXCoordinate, labelCircleYCoordinate)}
          {this.renderLabelText(labelText, offsetLocationDegrees, radius, width, height)}
        </g>
      </a>
    </g>
  }
})

export default RingWaypointAccessPointComponent
