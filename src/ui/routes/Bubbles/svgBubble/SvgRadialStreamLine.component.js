import React, { PropTypes } from 'react'
import classes from './SvgBubble.scss'
import * as d3 from 'd3'
import SvgAnimatedPathComponent from './SvgAnimatedPath.component'

const TAU = Math.PI * 2;
const SQUISH_FACTOR = 7.0/8.0;
const NORMALIZED_ARC_LENGTH = TAU * SQUISH_FACTOR
const ROTATE_PHASE = Math.PI / 2
const RADIUS = 110;
const SvgRadialStreamLineComponent = React.createClass({
  propTypes: {
    stream: PropTypes.object.isRequired,
    troutStreamSections: PropTypes.array.isRequired,
    restrictions: PropTypes.array.isRequired,
    index: PropTypes.number.isRequired,
    palSections: PropTypes.array.isRequired,
    accessPoints: PropTypes.array.isRequired
  },

  componentWillMount () {
    // this.radialPathGenerator = d3.path()
    // this.radialPathGenerator = d3.radialLine()
    //   .radius((data) => {
    //     return RADIUS
    //   })
    //   .angle(data => {
    //     return data
    //   })

  },

  createRadialPath (start, stop, totalLength) {
    let data = [start, stop].map(mileOffset => {
      let normalizedOffset = mileOffset / totalLength
      let arcOffset = (normalizedOffset * NORMALIZED_ARC_LENGTH) - ROTATE_PHASE
      return arcOffset
    })

    let pathGenerator = d3.path()
    pathGenerator.arc(120, 120, RADIUS, data[0], data[1])
    let result = pathGenerator.toString()
    return result
  },

  // <svg viewBox='0 0 240 240' preserveAspectRatio='xMidYMid meet' version='1.1'
  //         xmlns='http://www.w3.org/2000/svg'
  //         id={'trout_stream_' + this.props.stream.properties.name + '_' + this.props.stream.properties.gid} >
  render () {
    return (
      <g>
        <path className={classes.stream} d={this.createRadialPath(0, this.props.stream.properties.length_mi, this.props.stream.properties.length_mi)} />
      </g>
    )
  }
})

// <circle className={classes.stencil} cx='120' cy='120' r='110' />

export default SvgRadialStreamLineComponent
