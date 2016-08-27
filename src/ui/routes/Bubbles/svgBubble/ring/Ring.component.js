import React, { PropTypes } from 'react'
import classes from '../../Bubble.scss'
import ringClasses from './Ring.scss'
import RingAxisComponent from './RingAxis.component'
import RingSectionComponent from './RingSection.component'

const RingComponent = React.createClass({
  propTypes: {
    streamPackage: React.PropTypes.shape({
      stream: PropTypes.object.isRequired,
      sections: PropTypes.array.isRequired,
      restrictions: PropTypes.array.isRequired,
      palSections: PropTypes.array.isRequired,
      accessPoints: PropTypes.array.isRequired,
      tributaries: PropTypes.array.isRequired
    }),
    pathGenerator: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    layout: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      radius: PropTypes.number.isRequired,
      arcCompressionRatio: PropTypes.number.isRequired,
      rotatePhase: PropTypes.number.isRequired
    })
  },

  render () {
    let length = this.props.streamPackage.stream.properties.length_mi
    let index = 0

    return (<RingAxisComponent 
      length={length}
      index={index}
      layout={this.props.layout} />)
  }
})

export default RingComponent
