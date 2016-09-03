import React, { PropTypes } from 'react'
import _ from 'lodash'
import RingWaypointLineComponent from './RingWaypoint.component.line'
import RingWaypointLabelComponent from './RingWaypoint.component.label'
const TAU = Math.PI * 2

import accessPointClasses from './RingWaypoint.accessPoint.scss'
import waypointClasses from './RingWaypoint.scss'

const RingWaypointAccessPointComponent = React.createClass({
  propTypes: {
    accessPoint: PropTypes.object.isRequired,
    timing: PropTypes.object.isRequired,
    projection: PropTypes.func.isRequired,
    layout: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      radius: PropTypes.number.isRequired,
      arcCompressionRatio: PropTypes.number.isRequired,
      rotatePhase: PropTypes.number.isRequired
    })
  },

  renderTargetMarker (dotXScreenCoordinate, dotYScreenCoordinate) {
    return <circle
      className={waypointClasses.target}
      cx={dotXScreenCoordinate}
      cy={dotYScreenCoordinate}
      r='1' />
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

  renderLabel (labelText, offsetLocationDegrees, radius, width, height, labelOffsetFromRadius) {
    let transform = this.getTransformText(offsetLocationDegrees, height, width, radius, labelOffsetFromRadius)

    let roadTypeId = this.props.accessPoint.properties.road_type_id
    if (roadTypeId === 2) {
      return (<g id='label' transform={transform}>
        {this.renderUsHighway(offsetLocationDegrees, radius, width, height, labelOffsetFromRadius)}
      </g>)
    } else if (roadTypeId === 4) {
      return (<g id='label' transform={transform}>
        {this.renderMnHighwayIcon(this.props.accessPoint.properties.road_shield_text, offsetLocationDegrees)}
      </g>)
    } else if (roadTypeId === 1) {
      return (<g id='label' transform={transform}>
        {this.renderInterstateIcon(this.props.accessPoint.properties.road_shield_text, offsetLocationDegrees)}
      </g>)
    }
    return (<g id='label' transform={transform}>
      {this.renderLabelMarker(offsetLocationDegrees, labelOffsetFromRadius)}
      {this.renderLabelText(labelText, offsetLocationDegrees, radius, width, height)}
    </g>)
  },

  renderUsHighway (offsetLocationDegrees, radius, width, height, labelOffsetFromRadius) {
    return this.renderLabelMarker(offsetLocationDegrees, labelOffsetFromRadius)
  },

  renderLabelMarker (offsetLocationDegrees, labelOffsetFromRadius) {
    let roadTypeId = this.props.accessPoint.properties.road_type_id
    return this.decideRoadShield(roadTypeId)(this.props.accessPoint.properties.road_shield_text, offsetLocationDegrees)
  },

  renderDefaultMarker () {
    return <circle
      className={accessPointClasses.accessPointLabelPoint}
      cx={0}
      cy={0}
      r='3' />
  },

  renderLabelText (text, offset, radius, width, height) {
    if (text == null || offset == null) {
      throw new Error('argumetns cannot be null')
    }

    let cssClass = accessPointClasses.accessPointLabel
    let transform = offset > 180
      ? 'rotate(180)'
      : 'rotate(0)'

    let textAnchor = offset > 180
      ? 'end'
      : 'start'

    let textXPos = offset > 180
      ? -6
      : 6

    return <g transform={transform}>
      <text
        className={cssClass}
        dominantBaseline='central'
        textAnchor={textAnchor}
        x={textXPos} >{text} </text>
    </g>
  },

  decideRoadShield (roadType) {
    if (roadType === 1) {
      // interstate
      return this.renderInterstateIcon
    } else if (roadType === 2) {
      // us highway
      return this.renderUsHighwayIcon
    } else if (roadType === 3) {
      // railroad
    } else if (roadType === 4) {
      // mn highway
      return this.renderMnHighwayIcon
    } else if (roadType === 5) {
      // mn county state highway
    } else if (roadType === 6) {
      // mn something something...
    } else if (roadType === 7) {
      // mn county road
    }

    return this.renderDefaultMarker
  },

  getXCoordinate (radialPosition, labelOffsetFromRadius, width) {
    let result = labelOffsetFromRadius * Math.cos((-Math.PI * 0.5) + radialPosition) + (width * 0.5)
    return result
  },

  onClick (e) {
    e.preventDefault()
  },

  renderInterstateIcon (number, offset) {
    let rotate = offset > 180 ? 180 : 0
    let asdf = -6
    return <g transform={`rotate(${rotate})`}>
      <use className={accessPointClasses.roadSign} xlinkHref='#us-interstate' x={asdf} y={asdf} />
      <text textAnchor='middle' fontSize='7px' x={asdf + 6} y={asdf + 5} dominantBaseline='central'>{number}</text>
    </g>
  },

  renderUsHighwayIcon (number, offset) {
    let rotate = offset > 180 ? 180 : 0
    let asdf = -6
    return (<g transform={`rotate(${rotate})`}>
      <use className={accessPointClasses.roadSign} xlinkHref='#us-highway' x={asdf} y={asdf} />
      <text textAnchor='middle' fontSize='7px' x={asdf + 6} y={asdf + 6} dominantBaseline='central'>{number}</text>
    </g>)
  },

  renderMnHighwayIcon (number, offset) {
    let rotate = offset > 180 ? 180 : 0
    let asdf = -6

    return (<g transform={`rotate(${rotate})`}>
      <use className={accessPointClasses.roadSign} xlinkHref='#mn-highway' x={asdf} y={asdf} />
      <text className={accessPointClasses.roadSignText} textAnchor='middle' fontSize='6px' x={asdf + 6} y={asdf + 7} dominantBaseline='central'>{number}</text>
    </g>)
    // return null
  },

  renderRailroadIcon () {

  },

  renderMnStateAidHighway (number) {

  },

  renderMnTownshipRoad () {

  },

  renderMnCountyRoad (number) {

  },

  getYCoordinate (radialPosition, labelOffsetFromRadius, height) {
    let result = labelOffsetFromRadius * Math.sin((-Math.PI * 0.5) + radialPosition) + (height * 0.5)
    return result
  },

  debuggerInterstate (number) {
    let asdf = -6
    return (<g>
      <use className={accessPointClasses.roadSign} xlinkHref='#us-interstate' x={asdf} y={asdf} />
      <text textAnchor='middle' fontSize='7px' x={asdf + 6} y={asdf + 5} dominantBaseline='central'>{number}</text>
    </g>)
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

    // this is the coordinate of the dot inside the Ring
    let subjectLatitude = accessPointWorldCoodinates.latitude
    let subjectLongitude = accessPointWorldCoodinates.longitude

    let subjectScreenCoordinates = projection([subjectLongitude, subjectLatitude])

    // this is the coordinate of the dot outside the Ring next to the label
    let labelOffsetFromRadius = radius + 30
    let id = this.props.accessPoint.properties.road_type_id
    let longName = roadTypeDictionary[id].longName

    let labelText = `${this.props.accessPoint.properties.street_name}`

    let markerComponent = <rect x='-3' y='-0.5' width='5' height='1' />
    let iconComponent = this.debuggerInterstate(22)
    return <g >
      <a onClick={this.onClick} className={accessPointClasses.accessPointWaypoint + ' ' + waypointClasses.waypoint} xlinkHref={'#'}>
        <RingWaypointLineComponent
          subjectCoordinates={accessPointWorldCoodinates}
          normalizedOffset={normalizedOffset}
          projection={this.props.projection}
          layout={this.props.layout} />
        {this.renderTargetMarker(subjectScreenCoordinates[0], subjectScreenCoordinates[1])}
        <RingWaypointLabelComponent
          layout={this.props.layout}
          projection={this.props.projection}
          normalizedOffset={normalizedOffset}
          labelText={labelText}
          icon={iconComponent}
          marker={markerComponent}
          />
      </a>
    </g>
  }
})

        // {this.renderTargetMarker(subjectScreenCoordinates[0], subjectScreenCoordinates[1])}
        // {this.renderLabel(labelText, offsetLocationDegrees, radius, width, height, labelOffsetFromRadius)}

export default RingWaypointAccessPointComponent

const roadTypeDictionary = {
  '1': {
    shortName: 'Interstate',
    longName: 'Interstate Highway'
  },
  '2': {
    shortName: 'US Highway',
    longName: 'US Highway'
  },
  '3': {
    shortName: 'US Railroad',
    longName: 'Railroad'
  },
  '4': {
    shortName: 'MN_State_Highway',
    longName: 'MN Highway'
  },
  '5': {
    shortName: 'MN_County_State_Aid_Highway',
    longName: 'County State Aid Highway (CSAH)'
  },
  '6': {
    shortName: 'MN_Municipal_State_Aid_Street',
    longName: 'Municipal State Aid Street (MSAS)'
  },
  '7': {
    shortName: 'MN_County_Road',
    longName: 'County Road'
  },
  '8': {
    shortName: 'MN_Township_Road',
    longName: 'Township Road'
  },
  '9': {
    shortName: 'MN_Unorganized_Territory_Road',
    longName: 'Unorganized Territory Road'
  },
  '10': {
    shortName: 'MN_Military_Road',
    longName: 'Military Road'
  },
  '11': {
    shortName: 'MN_Tribal_Road',
    longName: 'Tribal Road'
  },
  '12': {
    shortName: 'MN_State_Forest_Road',
    longName: 'State Forest Road'
  },
  '13': {
    shortName: 'MN_State_Park_Road',
    longName: 'State Park Road'
  },
  '14': {
    shortName: 'MN_National_Forest_Road',
    longName: 'National Forest Road'
  },
  '15': {
    shortName: 'MN_National_Park_Road',
    longName: 'National Park Road'
  },
  '16': {
    shortName: 'MN_Misc_Road',
    longName: 'Uncategorized MN Road'
  }
}
