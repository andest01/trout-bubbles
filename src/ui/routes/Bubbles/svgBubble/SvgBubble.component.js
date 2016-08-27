import React, { PropTypes } from 'react'
import classes from './SvgBubble.scss'
import * as d3 from 'd3'
import SvgAnimatedPathComponent from './SvgAnimatedPath.component'
import _ from 'lodash'
import { getProjectionFromFeature } from './SvgBubble.selectors'

import RingComponent from './ring/Ring.component'
import RingSectionComponent from './ring/RingSection.component'

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

    // stream: PropTypes.object.isRequired,
    // sections: PropTypes.array.isRequired,
    // restrictions: PropTypes.array.isRequired,
    // index: PropTypes.number.isRequired,
    // palSections: PropTypes.array.isRequired,
    // accessPoints: PropTypes.array.isRequired,
    // tributaries: PropTypes.array.isRequired,
    // circle: PropTypes.object.isRequired
  },

  componentWillMount () {
    console.log('stream', this.props.streamPackage.stream)
    this.width = DIMENSIONS
    this.height = DIMENSIONS

    this.projection = getProjectionFromFeature(this.props.streamPackage.circle,
        { width: DIMENSIONS, height: DIMENSIONS, radius: RADIUS })

    this.pathGenerator = d3.geoPath()
      .projection(this.projection)
      .pointRadius(1)

    this.svgPath = this.pathGenerator(this.props.streamPackage.stream.geometry)

    this.baseStreamOffset = (1000 * this.props.index) * ANIMATION_SCALE
    this.baseStreamLength = (1000) * ANIMATION_SCALE
    this.basePalOffset = (this.baseStreamOffset + this.baseStreamLength + 300 * ANIMATION_SCALE)
    this.baseTroutSectionOffset = (this.baseStreamOffset + this.baseStreamLength + 600 * ANIMATION_SCALE)
    this.baseRestrictionOffset = (this.baseStreamOffset + this.baseStreamLength + 900 * ANIMATION_SCALE)
    this.baseAccessPointOffset = (this.baseStreamOffset + this.baseStreamLength + 1200 * ANIMATION_SCALE)

    this.palSectionSpeed = 900 * ANIMATION_SCALE
    this.troutSectionSpeed = (800 * ANIMATION_SCALE / Math.max(this.props.streamPackage.sections.length, 1))
    this.accessPointSpeed = (1600 * ANIMATION_SCALE / Math.max(this.props.streamPackage.accessPoints.length, 1))
    this.layout = {
      width: this.width,
      height: this.height,
      radius: RADIUS,
      arcCompressionRatio: SQUISH_FACTOR,
      rotatePhase: ROTATE_PHASE
    }
  },

  createRadialPath (start, stop, totalLength) {
    let data = [start, stop].map(mileOffset => {
      let normalizedOffset = mileOffset / totalLength
      let arcOffset = (normalizedOffset * NORMALIZED_ARC_LENGTH) - ROTATE_PHASE
      return arcOffset
    })

    let pathGenerator = d3.path()
    pathGenerator.arc(this.width / 2, this.height / 2, RADIUS, data[0], data[1])
    let result = pathGenerator.toString()
    return result
  },

  renderOuterCircleAxis () {
    return <RingComponent
      streamPackage={this.props.streamPackage}
      pathGenerator={this.pathGenerator}
      index={this.props.index}
      layout={this.layout} />

    // let streamLength = this.props.stream.properties.length_mi
    // let ticks = Math.floor(this.props.stream.properties.length_mi)
    // let tickMod = ticks > 30 ? 5 : 1
    // let tickDegrees = ((360 * SQUISH_FACTOR) / streamLength)
    // // remember that these start at 0 and move to myNumber - 1
    // return _.times(ticks + 1).map(index => {
    //   return (
    //     <g key={index} transform={`translate(${this.width / 2}, ${this.height / 2}` + ')rotate(' + (tickDegrees * index - 90)  + ')'}>
    //       <line className={classes.radialGuide} x1={RADIUS} x2={RADIUS + 3} />
    //       {
    //         index % tickMod === 0 
    //         ? (<text className={classes.radialText} x={RADIUS + 6} >{index}</text>)
    //         : (<text className={classes.radialTextSmall} x={RADIUS + 6} >{index}</text>)
    //       }
    //     </g>)
    // })
  },

  renderAccessPoints () {
    // return this.props.accessPoints.map((accessPoint, accessPointsIndex) => {
    //   let linearOffset = accessPoint.properties.linear_offset
    //   let tickDegrees = 360 * SQUISH_FACTOR * linearOffset
    //   let radianOffset = (Math.PI * 2) * SQUISH_FACTOR
    //   let obj = {
    //     'type': 'Point',
    //     'coordinates': [accessPoint.properties.centroid_longitude, accessPoint.properties.centroid_latitude],
    //     offsetDegrees: tickDegrees,
    //     circleX: (RADIUS + 30) * Math.cos((-Math.PI / 2) + radianOffset * linearOffset) + (this.width / 2),
    //     circleY: (RADIUS + 30) * Math.sin((-Math.PI / 2) + radianOffset * linearOffset) + (this.height / 2)
    //   }

    //   let point = {...accessPoint.properties, ...obj}
    //   let accessPath = this.pathGenerator(point)
    //   let isBoring = accessPoint.properties.is_over_trout_stream === 0 
        
    //   // let accessClass = isBoring
    //   //   ? classes.accessPoint
    //   //   : classes.boringAccessPoint
    //   let accessLinePoints = this.projection(point.coordinates)

    //   return (
    //     <g key={accessPoint.properties.gid} className={accessClass}>
    //       <SvgAnimatedPathComponent
    //         cssName={''}
    //         path={accessPath}
    //         offset={this.baseAccessPointOffset + accessPointsIndex * this.accessPointSpeed}
    //         length={20} />
    //       <g>
    //         <line className={classes.accessPointConnector} x1={accessLinePoints[0]} y1={accessLinePoints[1]} x2={point.circleX} y2={point.circleY} />
    //         <circle className={classes.accessPointDot} cx={point.circleX} cy={point.circleY} r='3' />
    //         <text 
    //           transform={`translate(${this.width / 2}, ${this.height / 2}` + ')rotate(' + (point.offsetDegrees - 90)  + ')'}
    //           className={isBoring ? classes.radialTextSmall : classes.radialText} 
    //           x={RADIUS + 36}
    //           >{point.street_name} </text>
    //       </g>
    //     </g>
    //     )

    // })
  },

  renderTributaries () {
    // return this.props.tributaries.map((tributary, tributaryIndex) => {
    //   let linearOffset = tributary.properties.linear_offset
    //   let tickDegrees = 360 * SQUISH_FACTOR * linearOffset
    //   let radianOffset = (Math.PI * 2) * SQUISH_FACTOR
    //   let obj = {
    //     'type': 'Point',
    //     'coordinates': [tributary.properties.centroid_longitude, tributary.properties.centroid_latitude],
    //     offsetDegrees: tickDegrees,
    //     circleX: (RADIUS + 30) * Math.cos((-Math.PI / 2) + radianOffset * linearOffset) + (this.width / 2),
    //     circleY: (RADIUS + 30) * Math.sin((-Math.PI / 2) + radianOffset * linearOffset) + (this.height / 2)
    //   }

    //   let point = {...tributary.properties, ...obj}
    //   let accessPath = this.pathGenerator(point)
    //   let accessClass = classes.accessPoint
    //   let accessLinePoints = this.projection(point.coordinates)
    //   return (
    //     <g key={tributary.properties.gid} className={accessClass}>
    //       <SvgAnimatedPathComponent
    //         cssName={classes.accessPointStream}
    //         path={accessPath}
    //         offset={this.baseAccessPointOffset + tributaryIndex * this.accessPointSpeed}
    //         length={20} />
    //       <g>
    //         <line className={classes.accessPointConnector} x1={accessLinePoints[0]} y1={accessLinePoints[1]} x2={point.circleX} y2={point.circleY} />
    //         <circle className={classes.tributaryDot} cx={point.circleX} cy={point.circleY} r='3' />
    //         <text 
    //           transform={`translate(${this.width / 2}, ${this.height / 2}` + ')rotate(' + (point.offsetDegrees - 90)  + ')'}
    //           className={classes.tributaryText} 
    //           x={RADIUS + 36}
    //           >{point.streamData.stream.properties.name} </text>
    //       </g>
    //     </g>
    //     )

    // })
  },

  // renderOuterCircle () {
  //   return (
  //     <g>
        
  //           <g>
  //             {
  //             this.props.palSections.map((pal, palIndex) => {
  //               let itemOffset = ((this.props.stream.properties.length_mi - pal.properties.stop) / this.props.stream.properties.length_mi) * this.palSectionSpeed
  //               let offset = this.basePalOffset + itemOffset
  //               return (<SvgAnimatedPathComponent
  //                 offset={offset}
  //                 length={this.baseStreamLength}
  //                 cssName={classes.pal}
  //                 key={pal.properties.id}
  //                 path={this.createRadialPath(pal.properties.start,
  //                   pal.properties.stop,
  //                   this.props.stream.properties.length_mi)} />)
  //             })
  //             }
  //           </g>
  //           <SvgAnimatedPathComponent
  //             cssName={classes.stream}
  //             path={this.createRadialPath(0, this.props.stream.properties.length_mi, this.props.stream.properties.length_mi)}
  //             offset={this.baseStreamOffset}
  //             length={this.baseStreamLength} />
  //           <g>
  //             {
  //               this.props.sections.map((section, sectionIndex) => {
  //                 return (<SvgAnimatedPathComponent
  //                   offset={this.baseTroutSectionOffset + (this.troutSectionSpeed * sectionIndex)}
  //                   length={this.baseStreamLength}
  //                   cssName={classes.section}
  //                   key={section.properties.gid}
  //                   path={this.createRadialPath(section.properties.start,
  //                     section.properties.stop,
  //                     this.props.stream.properties.length_mi)} />)
  //               })
  //             }
  //           </g>

  //           <g>
  //             {
  //               this.props.restrictions.map(restriction => {
  //                 let className = restriction.properties.restriction_id === FISH_SANCTUARY_ID
  //                   ? classes.fishSanctuary
  //                   : classes.restriction
  //                 return (<SvgAnimatedPathComponent
  //                   offset={this.baseRestrictionOffset}
  //                   length={this.baseStreamLength}
  //                   cssName={className}
  //                   key={restriction.properties.gid}
  //                   path={this.createRadialPath(restriction.properties.start,
  //                     restriction.properties.stop,
  //                     this.props.stream.properties.length_mi)} />)
  //               })
  //             }
  //           </g>
  //         </g>)
  // },

          //   {
          //   this.renderOuterCircle()
          // }

  renderPalRings () {
    return this.props.streamPackage.palSections.map((pal, palIndex) => {
      let streamLength = this.props.streamPackage.stream.properties.length_mi
      let itemOffset = ((streamLength - pal.properties.stop) / streamLength) * this.palSectionSpeed
      let offset = this.basePalOffset + itemOffset
      return (<RingSectionComponent
        timing={{offset, length: this.baseStreamLength}}
        cssName={classes.pal}
        key={pal.properties.id}
        layout={this.layout}
        length={this.props.streamPackage.stream.properties.length_mi}
        start={pal.properties.start}
        stop={pal.properties.stop} />)
    })
  },

  renderSectionRings () {
    return this.props.streamPackage.sections.map((section, sectionIndex) => {
      let streamLength = this.props.streamPackage.stream.properties.length_mi
      let itemOffset = ((streamLength - section.properties.stop) / streamLength) * this.troutSectionSpeed
      let offset = this.baseTroutSectionOffset + itemOffset
      return (<RingSectionComponent
        timing={{offset, length: this.baseStreamLength}}
        cssName={classes.section}
        key={section.properties.gid}
        layout={this.layout}
        length={this.props.streamPackage.stream.properties.length_mi}
        start={section.properties.start}
        stop={section.properties.stop} />)
    })
  },

  renderRestrictionRings () {
    return this.props.streamPackage.restrictions.map((restriction, restrictionIndex) => {
      let streamLength = this.props.streamPackage.stream.properties.length_mi
      let itemOffset = ((streamLength - restriction.properties.stop) / streamLength) * this.troutSectionSpeed
      let offset = this.baseTroutSectionOffset + itemOffset
      let className = restriction.properties.restriction_id === FISH_SANCTUARY_ID
        ? classes.fishSanctuary
        : classes.restriction
      return (<RingSectionComponent
        timing={{offset, length: this.baseStreamLength}}
        cssName={className}
        key={restriction.properties.gid}
        layout={this.layout}
        length={this.props.streamPackage.stream.properties.length_mi}
        start={restriction.properties.start}
        stop={restriction.properties.stop} />)
    })
  },

  renderStreamRing () {
    // return this.props.streamPackage.stream
    let streamLength = this.props.streamPackage.stream.properties.length_mi
    return (<RingSectionComponent
      timing={{offset: this.baseStreamOffset, length: this.baseStreamLength}}
      cssName={classes.stream}
      layout={this.layout}
      length={streamLength}
      start={0}
      stop={streamLength} />)
  },

  render () {
    return (
      <div className={classes.container}>
        <svg viewBox={`0 0 ${this.width} ${this.height}`} preserveAspectRatio='xMidYMid meet' version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          id={'trout_stream_' + this.props.streamPackage.stream.properties.name + '_' + this.props.streamPackage.stream.properties.gid} >
          <title>{this.props.streamPackage.stream.properties.name} {this.props.streamPackage.stream.properties.gid}</title>
          <defs>
            <clipPath id='circle-stencil'>
              <circle cx={this.width / 2} cy={this.height / 2} r={RADIUS - 3} />
            </clipPath>
          </defs>
          <g id='stream' clipPath='url(#circle-stencil)'>
            <g>
              {
                // this.props.palSections.map((pal, palIndex) => {
                //   let itemOffset = ((this.props.stream.properties.length_mi - pal.properties.stop) / this.props.stream.properties.length_mi) * this.palSectionSpeed
                //   let offset = this.basePalOffset + itemOffset
                //   return (<SvgAnimatedPathComponent
                //     offset={offset}
                //     length={this.baseStreamLength}
                //     cssName={classes.pal}
                //     key={pal.properties.id}
                //     path={this.pathGenerator(pal.geometry)} />)
                // })
              }
            </g>
            <g>
            </g>
            <g>
              <SvgAnimatedPathComponent
                cssName={classes.stream}
                path={this.svgPath}
                offset={this.baseStreamOffset}
                length={this.baseStreamLength} />
            </g>
            <g > 
              <g className={classes.tributaries}>
              {
                // this.props.tributaries.map((trib) => {
                //   return trib.properties.streamData.palSections.map((section, sectionIndex) => {
                //     return (<SvgAnimatedPathComponent
                //       offset={this.baseTroutSectionOffset + (this.palSectionSpeed * sectionIndex)}
                //       length={this.baseStreamLength}
                //       cssName={classes.tributaryPalSection}
                //       key={section.properties.gid}
                //       path={this.pathGenerator(section.geometry)} />)
                //   })
                // })
              }

              {
                // this.props.tributaries.map((geoJson, sectionIndex) => {
                //   let section = geoJson.properties.streamData.stream
                //   let path = this.pathGenerator(section.geometry)
                //   // console.log(path)
                //   console.log('tributary', section)
                //   return (<SvgAnimatedPathComponent
                //     offset={this.baseTroutSectionOffset + (this.troutSectionSpeed * sectionIndex)}
                //     length={this.baseStreamLength}
                //     cssName={classes.tributary}
                //     key={section.properties.gid}
                //     path={path} />)
                // })
              }

              {
                // this.props.tributaries.map((trib) => {
                //   return trib.properties.streamData.sections.map((section, sectionIndex) => {
                //     return (<SvgAnimatedPathComponent
                //       offset={this.baseTroutSectionOffset + (this.troutSectionSpeed * sectionIndex)}
                //       length={this.baseStreamLength}
                //       cssName={classes.tributarySection}
                //       key={section.properties.gid}
                //       path={this.pathGenerator(section.geometry)} />)
                //   })
                // })
              }
            </g>
            {
              // this.props.sections.map((section, sectionIndex) => {
              //   console.log('trout stream', section)
              //   return (<SvgAnimatedPathComponent
              //     offset={this.baseTroutSectionOffset + (this.troutSectionSpeed * sectionIndex)}
              //     length={this.baseStreamLength}
              //     cssName={classes.section}
              //     key={section.properties.gid}
              //     path={this.pathGenerator(section.geometry)} />)
              // })
            }
            </g>
            <g>
            {
              // this.props.restrictions.map(restriction => {
              //   let className = restriction.properties.restriction_id === FISH_SANCTUARY_ID
              //     ? classes.fishSanctuary
              //     : classes.restriction
              //   return (<SvgAnimatedPathComponent
              //     offset={this.baseRestrictionOffset}
              //     length={this.baseStreamLength}
              //     cssName={className}
              //     key={restriction.properties.gid}
              //     path={this.pathGenerator(restriction.geometry)} />)
              // })
            }
            </g>
          </g>

          <g id='ring'>
            <g id='ring-pal'>
            {
              this.renderPalRings()
            }
            </g>

            <g id='ring-stream'>
            {
              this.renderStreamRing()
            }
            </g>

            <g id='ring-sections'>
            {
              this.renderSectionRings()
            }
            </g>

            <g id='ring-restrictions'>
            {
              this.renderRestrictionRings()
            }
            </g>

            <g id='ring-axis'>
            {
              this.renderOuterCircleAxis()
            }
            </g>
          </g>
          }

          {
            this.renderAccessPoints()
          }

          {
            this.renderTributaries()
          }
        </svg>
      </div>
    )
  }
})

export default SvgBubbleComponent
