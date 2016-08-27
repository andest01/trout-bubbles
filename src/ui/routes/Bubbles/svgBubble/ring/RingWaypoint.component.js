import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import SvgAnimatedPathComponent from '../SvgAnimatedPath.component'
import _ from 'lodash'

const TAU = Math.PI * 2

const RingWaypointComponent = React.createClass({
  propTypes: {
    subjectElement: PropTypes.element.isRequired,
    subjectCoordinates: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired
    }),
    normalizedOffset: PropTypes.number.isRequired,
    labelElement: PropTypes.element.isRequired,
    cssName: PropTypes.string.isRequired,
    timing: PropTypes.shape({
      offset: PropTypes.number.isRequired,
      length: PropTypes.number.isRequired
    }),
    pathGenerator: PropTypes.func.isRequired,
    layout: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      radius: PropTypes.number.isRequired,
      arcCompressionRatio: PropTypes.number.isRequired,
      rotatePhase: PropTypes.number.isRequired
    })
  },

  renderSubjectMarker(dotXScreenCoordinate, dotYScreenCoordinate) {
    return <circle className={classes.accessPointDot} cx={dotXScreenCoordinate} cy={dotYScreenCoordinate} r='3' />
  },

  renderLabelMarker(dotXScreenCoordinate, dotYScreenCoordinate) {
    return <circle className={classes.accessPointDot} cx={dotXScreenCoordinate} cy={dotYScreenCoordinate} r='3' />
  },

  renderLabelText (text, offset, radius, width, height, cssClass) {
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

    let polylinePoints = _.flatten(
      _.map(screenCoordinates, x => [x.dotXScreenCoordinate, x.dotYScreenCoordinate]))
      .split(',')
    return 
    (<g id='FeatureLine' className={classes.accessPointConnector}>
      { 
        <polyline className={'asdf'} points={polylinePoints} />
      }
    </g>)
  },

  renderWaypointAndGuideline(subjectCoordinates, linearOffset) {
    
  },

  render () {
    let { width, height, radius, arcCompressionRatio, rotatePhase } = this.props.layout
    let { subjectCoordinates, normalizedOffset, pathGenerator } = this.props
    let tickDegrees = 360 * arcCompressionRatio * normalizedOffset
    let radianOffset = TAU * arcCompressionRatio

    // this is the coordinate of the dot inside the Ring
    let subjectLatitude = subjectCoordinates.latitude
    let subjectLongitude = subjectCoordinates.longitude

    let subjectScreenCoordinates = pathGenerator([subjectLongitude, subjectLatitude])

    // this is the coordinate of the dot outside the Ring next to the label
    let labelOffsetFromRadius = radius + 30
    let radialPosition = radianOffset * normalizedOffset
    let labelCircleXCoordinate = labelOffsetFromRadius * Math.cos((-Math.PI * 0.5) + radialPosition) + (width * 0.5)
    let labelCircleYCoordinate = labelOffsetFromRadius * Math.sin((-Math.PI * 0.5) + radialPosition) + (height * 0.5)

    let lineStartPoint = {
      dotXScreenCoordinate: subjectScreenCoordinates[0],
      dotYScreenCoordinate: subjectScreenCoordinates[1]
    }

    let lineEndPoint = {
      dotXScreenCoordinate: labelCircleXCoordinate,
      dotYScreenCoordinate: labelCircleYCoordinate
    }

    let lineCoordinates = [lineStartPoint, lineEndPoint]

    return <g>
      {this.props.subjectElement}
      {this.renderSubjectMarker(subjectScreenCoordinates[0], subjectScreenCoordinates[1])}
      <g id='label'>
        {this.renderLabelMarker(labelCircleXCoordinate, labelCircleYCoordinate)}
        {this.renderLabelText()}
      </g>
      {this.renderLine(lineCoordinates)}
    </g>
  }
})

export default RingWaypointComponent
