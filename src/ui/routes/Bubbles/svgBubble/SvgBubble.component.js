import React, { PropTypes } from 'react'
import classes from './SvgBubble.scss'
import * as d3 from 'd3'
import SvgAnimatedPathComponent from './SvgAnimatedPath.component'
import SvgRadialStreamLineComponent from './SvgRadialStreamLine.component'
import _ from 'lodash'

const FISH_SANCTUARY_ID = 7
const ANIMATION_SCALE = 2.0
const DIMENSIONS = 500

const TAU = Math.PI * 2
const SQUISH_FACTOR = 0.95
const NORMALIZED_ARC_LENGTH = TAU * SQUISH_FACTOR
const ROTATE_PHASE = Math.PI / 2
const RADIUS = 110

const SvgBubbleComponent = React.createClass({
  propTypes: {
    stream: PropTypes.object.isRequired,
    troutStreamSections: PropTypes.array.isRequired,
    restrictions: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    palSections: PropTypes.array.isRequired,
    accessPoints: PropTypes.array.isRequired
  },

  componentWillMount () {
    this.width = DIMENSIONS
    this.height = DIMENSIONS

    // set up projection
    this.projection = d3.geoAlbers()
      .scale(1)
      .translate([0, 0])

    this.pathGenerator = d3.geoPath()
      .projection(this.projection)
      .pointRadius(3)

    // compute bounds, etc.
    let streamGeometry = this.props.stream.geometry
    let b = this.pathGenerator.bounds(streamGeometry)
    let s = 0.33 / Math.max((b[1][0] - b[0][0]) / this.width, (b[1][1] - b[0][1]) / this.height)
    let t = [(this.width - s * (b[1][0] + b[0][0])) / 2, (this.height - s * (b[1][1] + b[0][1])) / 2]

    this.projection
      .scale(s)
      .translate(t)

    this.svgPath = this.pathGenerator(streamGeometry)

    this.baseStreamOffset = (1000 * this.props.index) * ANIMATION_SCALE
    this.baseStreamLength = (1000) * ANIMATION_SCALE
    this.basePalOffset = (this.baseStreamOffset + this.baseStreamLength + 300 * ANIMATION_SCALE)
    this.baseTroutSectionOffset = (this.baseStreamOffset + this.baseStreamLength + 600  * ANIMATION_SCALE)
    this.baseRestrictionOffset = (this.baseStreamOffset + this.baseStreamLength + 900 * ANIMATION_SCALE) 
    this.baseAccessPointOffset = (this.baseStreamOffset + this.baseStreamLength + 1200  * ANIMATION_SCALE)

    this.palSectionSpeed = 900 * ANIMATION_SCALE
    this.troutSectionSpeed = (800   * ANIMATION_SCALE / Math.max(this.props.troutStreamSections.length, 1))
    this.accessPointSpeed = (1600   * ANIMATION_SCALE / Math.max(this.props.accessPoints.length, 1))
  },

  createRadialPath (start, stop, totalLength) {
    let data = [start, stop].map(mileOffset => {
      let normalizedOffset = mileOffset / totalLength
      let arcOffset = (normalizedOffset * NORMALIZED_ARC_LENGTH) - ROTATE_PHASE
      return arcOffset
    })

    let pathGenerator = d3.path()
    let ANTI_CLOCKWISE = true
    pathGenerator.arc(this.width / 2, this.height / 2, RADIUS, data[0], data[1])
    let result = pathGenerator.toString()
    return result
  },

  /*  
<circle
                className={classes.accessPoint}
                key={accessPoint.properties.gid}
                cx={point[0]}
                cy={point[1]}
                r={7} />

                this.props.accessPoints.map((accessPoint, accessPointsIndex) => {
              return (<path key={accessPoint.properties.gid} d={this.pathGenerator(accessPoint.geometry)} />)
            })
  */

  renderOuterCircleAxis () {
    let streamLength = this.props.stream.properties.length_mi
    let ticks = Math.floor(this.props.stream.properties.length_mi)
    let tickWidth = ticks / streamLength
    let tickDegrees =  ((360 * SQUISH_FACTOR) / streamLength)
    // remember that these start at 0 and move to myNumber - 1
    return _.times(ticks + 1).map(index => {
      return (
        <g key={index} transform={`translate(${this.width / 2}, ${this.height / 2}` + ')rotate(' + (tickDegrees * index - 90)  + ')'}>
          <line className={classes.radialGuide} x1={RADIUS} x2={RADIUS + 3} />
          <text className={classes.radialText} x={RADIUS + 6} dy='0.35em'>{index}</text>
        </g>)
    })
  },

  renderAccessPoints () {
    return this.props.accessPoints.map((accessPoint, accessPointsIndex) => {
      let linearOffset = accessPoint.properties.linear_offset
      let tickDegrees = 360 * SQUISH_FACTOR * linearOffset
      let radianOffset = (Math.PI * 2) * SQUISH_FACTOR
      let obj = {
        'type': 'Point',
        'coordinates': [accessPoint.properties.centroid_longitude, accessPoint.properties.centroid_latitude],
        offsetDegrees: tickDegrees,
        circleX: (RADIUS + 20) * Math.cos((-Math.PI / 2) + radianOffset * linearOffset) + (this.width / 2),
        circleY: (RADIUS + 20) * Math.sin((-Math.PI / 2) + radianOffset * linearOffset) + (this.height / 2)
      }

      let point = {...accessPoint.properties, ...obj}
      let accessPath = this.pathGenerator(point)
      let accessClass = (accessPoint.properties.is_over_trout_stream === 1 
        || accessPoint.properties.is_over_publicly_accessible_land === 1)
        ? classes.accessPoint
        : classes.boringAccessPoint
      let accessLinePoints = this.projection(point.coordinates)

      return (
        <g key={accessPoint.properties.gid} className={accessClass}>
          <SvgAnimatedPathComponent
            cssName={''}
            path={accessPath}
            offset={this.baseAccessPointOffset + accessPointsIndex * this.accessPointSpeed}
            length={20} />
          <g>
            <line className={classes.accessPointConnector} x1={accessLinePoints[0]} y1={accessLinePoints[1]} x2={point.circleX} y2={point.circleY} />
            <circle cx={point.circleX} cy={point.circleY} r='3' />
            <text 
              transform={`translate(${this.width / 2}, ${this.height / 2}` + ')rotate(' + (point.offsetDegrees - 90)  + ')'}
              className={classes.radialText} 
              x={RADIUS + 25}
              dy='0.35em'>{point.street_name} </text>
          </g>
        </g>
        )

    })
  },

  renderOuterCircle () {
    return (
      <g>
        
            <g>
              {
              this.props.palSections.map((pal, palIndex) => {
                let itemOffset = ((this.props.stream.properties.length_mi - pal.properties.stop) / this.props.stream.properties.length_mi) * this.palSectionSpeed
                let offset = this.basePalOffset + itemOffset
                return (<SvgAnimatedPathComponent
                  offset={offset}
                  length={this.baseStreamLength}
                  cssName={classes.pal}
                  key={pal.properties.id}
                  path={this.createRadialPath(pal.properties.start,
                    pal.properties.stop,
                    this.props.stream.properties.length_mi)} />)
              })
              }
            </g>
            <SvgAnimatedPathComponent
              cssName={classes.stream}
              path={this.createRadialPath(0, this.props.stream.properties.length_mi, this.props.stream.properties.length_mi)}
              offset={this.baseStreamOffset}
              length={this.baseStreamLength} />
            <g>
              {
                this.props.troutStreamSections.map((section, sectionIndex) => {
                  return (<SvgAnimatedPathComponent
                    offset={this.baseTroutSectionOffset + (this.troutSectionSpeed * sectionIndex)}
                    length={this.baseStreamLength}
                    cssName={classes.section}
                    key={section.properties.gid}
                    path={this.createRadialPath(section.properties.start,
                      section.properties.stop,
                      this.props.stream.properties.length_mi)} />)
                })
              }
            </g>

            <g>
              {
                this.props.restrictions.map(restriction => {
                  let className = restriction.properties.restriction_id === FISH_SANCTUARY_ID
                    ? classes.fishSanctuary
                    : classes.restriction
                  return (<SvgAnimatedPathComponent
                    offset={this.baseRestrictionOffset}
                    length={this.baseStreamLength}
                    cssName={className}
                    key={restriction.properties.gid}
                    path={this.createRadialPath(restriction.properties.start,
                      restriction.properties.stop,
                      this.props.stream.properties.length_mi)} />)
                })
              }
            </g>
          </g>)
  },

  render () {
    return (
      <div className={classes.container}>
        <svg viewBox={`0 0 ${this.width} ${this.height}`} preserveAspectRatio='xMidYMid meet' version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          id={'trout_stream_' + this.props.stream.properties.name + '_' + this.props.stream.properties.gid} >
          <title>{this.props.stream.properties.name} {this.props.stream.properties.gid}</title>
          {
            this.renderOuterCircle()
          }
            {
              this.props.palSections.map((pal, palIndex) => {
                let itemOffset = ((this.props.stream.properties.length_mi - pal.properties.stop) / this.props.stream.properties.length_mi) * this.palSectionSpeed
                let offset = this.basePalOffset + itemOffset
                return (<SvgAnimatedPathComponent
                  offset={offset}
                  length={this.baseStreamLength}
                  cssName={classes.pal}
                  key={pal.properties.id}
                  path={this.pathGenerator(pal.geometry)} />)
              })
            }
          <g>
          
          </g>

          <g>
            <SvgAnimatedPathComponent
              cssName={classes.stream}
              path={this.svgPath}
              offset={this.baseStreamOffset}
              length={this.baseStreamLength} />
          </g>

          <g>
          {
            this.props.troutStreamSections.map((section, sectionIndex) => {
              return (<SvgAnimatedPathComponent
                offset={this.baseTroutSectionOffset + (this.troutSectionSpeed * sectionIndex)}
                length={this.baseStreamLength}
                cssName={classes.section}
                key={section.properties.gid}
                path={this.pathGenerator(section.geometry)} />)
            })
          }
          </g>
          <g>
          {
            this.props.restrictions.map(restriction => {
              let className = restriction.properties.restriction_id === FISH_SANCTUARY_ID
                ? classes.fishSanctuary
                : classes.restriction
              return (<SvgAnimatedPathComponent
                offset={this.baseRestrictionOffset}
                length={this.baseStreamLength}
                cssName={className}
                key={restriction.properties.gid}
                path={this.pathGenerator(restriction.geometry)} />)
            })
          }
          </g>
          {
            this.renderOuterCircleAxis()
          }

          {
            this.renderAccessPoints()
          }
        </svg>
      </div>
    )
  }
})

// this.baseAccessPointOffset + this.accessPointSpeed * accessPointsIndex
/*
{
            this.props.palSections.map((pal, palIndex) => {
              return (<SvgAnimatedPathComponent
                offset={this.basePalOffset + (palIndex * this.palSectionSpeed)}
                length={this.baseStreamLength}
                cssName={classes.pal} 
                key={pal.properties.gid} 
                path={this.pathGenerator(pal.geometry)} />)
            })
          }
          <g>
            <SvgAnimatedPathComponent
              cssName={classes.stream}
              path={this.svgPath}
              offset={this.baseStreamOffset}
              length={this.baseStreamLength} />
          </g>

          <g>
          {
            this.props.troutStreamSections.map((section, sectionIndex) => {
              return (<SvgAnimatedPathComponent
                offset={this.baseTroutSectionOffset + (this.troutSectionSpeed * sectionIndex)}
                length={this.baseStreamLength}
                cssName={classes.section}
                key={section.properties.gid}
                path={this.pathGenerator(section.geometry)} />)
            })
          }
          </g>
          <g>
          {
            this.props.restrictions.map(restriction => {
              return (<SvgAnimatedPathComponent
                offset={this.baseRestrictionOffset}
                length={this.baseStreamLength}
                cssName={classes.restriction}
                key={restriction.properties.gid}
                path={this.pathGenerator(restriction.geometry)} />)
            })
          }
          </g>
          <g>

*/

export default SvgBubbleComponent
