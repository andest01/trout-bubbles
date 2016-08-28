import React, { PropTypes } from 'react'
import classes from '../SvgBubble.scss'
import streamClasses from './Stream.scss'

import SvgAnimatedPathComponent from '../SvgAnimatedPath.component'
const ANIMATION_SCALE = 2.0
const FISH_SANCTUARY_ID = 7
const StreamComponent = React.createClass({
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
    projection: PropTypes.func.isRequired,
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

  renderPalSections () {
    let streamLength = this.props.streamPackage.stream.properties.length_mi
    return (<g id='stream-pal'>
      {
        this.props.streamPackage.palSections.map((pal, palIndex) => {
          let itemOffset = ((streamLength - pal.properties.stop) / streamLength) * this.palSectionSpeed
          let offset = this.basePalOffset + itemOffset
          return (<SvgAnimatedPathComponent
            offset={offset}
            length={this.baseStreamLength}
            cssName={classes.pal}
            key={pal.properties.id}
            path={this.props.pathGenerator(pal.geometry)} />)
        })
      }
    </g>)
  },

  renderStream () {
    return <g id='stream-stream'>
      <SvgAnimatedPathComponent
        cssName={classes.stream}
        path={this.props.pathGenerator(this.props.streamPackage.stream.geometry)}
        offset={this.baseStreamOffset}
        length={this.baseStreamLength} />
    </g>
  },

  renderTroutStreamSections () {
    return (<g id='stream-sections'>
    {
      this.props.streamPackage.sections.map((section, sectionIndex) => {
        let path = this.props.pathGenerator(section.geometry)
        return (<SvgAnimatedPathComponent
          offset={this.baseTroutSectionOffset + (this.troutSectionSpeed * sectionIndex)}
          length={this.baseStreamLength}
          cssName={classes.section}
          key={section.properties.gid}
          path={path} />)
      })
    }
    </g>)
  },

  renderRestrictions () {
    return (<g id='stream-restrictions'>
    {
      this.props.streamPackage.restrictions.map(restriction => {
        let className = restriction.properties.restriction_id === FISH_SANCTUARY_ID
          ? classes.fishSanctuary
          : classes.restriction
        return (<SvgAnimatedPathComponent
          offset={this.baseRestrictionOffset}
          length={this.baseStreamLength}
          cssName={className}
          key={restriction.properties.gid}
          path={this.props.pathGenerator(restriction.geometry)} />)
      })
    }
    </g>)
  },

  render () {
    return <g>
      {this.renderPalSections()}
      {this.renderStream()}
      {this.renderTroutStreamSections()}
      {this.renderRestrictions()}
    </g>
  }
})

export default StreamComponent
