import React, { PropTypes } from 'react'
import ringClasses from './RingAxis.scss'
import _ from 'lodash'

const TICK_MOD = 20
const RADIANS_TO_DEGREES = 180 / Math.PI

const RingAxisComponent = React.createClass({
  propTypes: {
    length: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    layout: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      radius: PropTypes.number.isRequired,
      arcCompressionRatio: PropTypes.number.isRequired,
      rotatePhase: PropTypes.number.isRequired
    })
  },

  renderTicks () {
    let { length, layout } = this.props
    let { width, height, radius, arcCompressionRatio, rotatePhase } = layout
    let ticks = Math.floor(length)
    let tickMod = ticks > TICK_MOD ? 5 : 1
    let tickDegrees = ((360 * arcCompressionRatio) / length)
    let rotatePhaseDegrees = rotatePhase * RADIANS_TO_DEGREES

    return _.times(ticks + 1).map(index => {
      let rotationDegrees = tickDegrees * index - rotatePhaseDegrees
      let translate = `translate(${width * 0.5},${height * 0.5})`
      let rotate = `rotate(${rotationDegrees})`
      let transform = `${translate} ${rotate}`
      return (
        <g key={index} transform={transform}>
          <line className={ringClasses.radialGuide} x1={radius} x2={radius + 3} />
          {
            index % tickMod === 0
            ? (<text className={ringClasses.radialText} x={radius + 6} >{index}</text>)
            : (<text className={ringClasses.radialTextSmall} x={radius + 6} >{index}</text>)
          }
        </g>)
    })
  },

  render () {
    return <g id='radial-axis' className={ringClasses.radial}>
      {this.renderTicks()}
    </g>
  }
})

export default RingAxisComponent
