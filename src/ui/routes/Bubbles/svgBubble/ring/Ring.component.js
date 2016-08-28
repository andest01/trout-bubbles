import React, { PropTypes } from 'react'
import RingAxisComponent from './RingAxis.component'
import RingSectionComponent from './RingSection.component'

import classes from '../SvgBubble.scss'
const FISH_SANCTUARY_ID = 7
const ANIMATION_SCALE = 2.0

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

  componentWillMount () {
    this.baseStreamOffset = (1000 * this.props.index) * ANIMATION_SCALE
    this.baseStreamLength = (1000) * ANIMATION_SCALE
    this.basePalOffset = (this.baseStreamOffset + this.baseStreamLength + 300 * ANIMATION_SCALE)
    this.baseTroutSectionOffset = (this.baseStreamOffset + this.baseStreamLength + 600 * ANIMATION_SCALE)
    this.baseRestrictionOffset = (this.baseStreamOffset + this.baseStreamLength + 900 * ANIMATION_SCALE)
    this.baseAccessPointOffset = (this.baseStreamOffset + this.baseStreamLength + 1200 * ANIMATION_SCALE)

    this.palSectionSpeed = 900 * ANIMATION_SCALE
    this.troutSectionSpeed = (800 * ANIMATION_SCALE / Math.max(this.props.streamPackage.sections.length, 1))
    this.accessPointSpeed = (1600 * ANIMATION_SCALE / Math.max(this.props.streamPackage.accessPoints.length, 1))
  },

  renderPalRings () {
    return this.props.streamPackage.palSections.map((pal, palIndex) => {
      let streamLength = this.props.streamPackage.stream.properties.length_mi
      let itemOffset = ((streamLength - pal.properties.stop) / streamLength) * this.palSectionSpeed
      let offset = this.basePalOffset + itemOffset
      return (<RingSectionComponent
        timing={{offset, length: this.baseStreamLength}}
        cssName={classes.pal}
        key={pal.properties.id}
        layout={this.props.layout}
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
        layout={this.props.layout}
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
        layout={this.props.layout}
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
      layout={this.props.layout}
      length={streamLength}
      start={0}
      stop={streamLength} />)
  },

  renderRingAxis () {
    let length = this.props.streamPackage.stream.properties.length_mi
    let index = 0
    return (<RingAxisComponent
      length={length}
      index={index}
      layout={this.props.layout} />)
  },

  render () {
    return (
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
          this.renderRingAxis()
        }
        </g>
      </g>
      )
  }
})

export default RingComponent
