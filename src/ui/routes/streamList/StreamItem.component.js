/* eslint max-len: 0 */
import React, { PropTypes } from 'react'
import classes from './StreamItem.style.scss'
import _ from 'lodash'
import { Link } from 'react-router'

const MAX_DIMENSION = 24
const CENTER = MAX_DIMENSION / 2
const SQUISH_FACTOR = 4.0
const StreamItemComponent = React.createClass({
  propTypes: {
    stream: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
  },

  componentWillMount () {
    // this.props.getSouthEasternStreams();
    let length = _.sumBy(this.props.stream.sections, section => { return section.properties.length_mi })
    let publicLength = _.sumBy(this.props.stream.palSections, section => {
      return section.properties.stop - section.properties.start
    })
    // TODO: fix this later...
    publicLength = Math.min(length, publicLength)

    this.waterRadius = this.computeRadiusFromLength(length)
    let publicLandLengthToWaterLengthRatio = publicLength / length
    this.publicLandRadius = this.waterRadius * publicLandLengthToWaterLengthRatio
  },

  computeRadiusFromLength (length) {
    let area = Math.sqrt(length / Math.PI)
    return area
  },

  renderAlert () {
    return (
      <svg className={classes.alert} version='1.1' viewBox='0 0 32 32'>
        {this.props.stream.restrictions.length > 0 &&
          <g>
            <path d='M31.858 27.675c-3.196-5.42-11.116-18.857-14.395-24.42-0.987-1.672-1.947-1.641-2.859-0.096-3.223 5.464-11.137 18.878-14.395 24.402-0.004 0.006-0.87 2.439 0.954 2.439h29.561c1.969 0 1.048-2.471 1.134-2.325z'></path>
            <text className='alert-text' x='13' y='25' fontSize='20'>!</text>
          </g>
        }
      </svg>
    )
  },

  renderStreamRatio () {
    return (
      <svg className={' ' + classes.ratio} viewBox={`0 0 ${MAX_DIMENSION} ${MAX_DIMENSION}`} version='1.1'
        xmlns='http://www.w3.org/2000/svg'>
        <circle className={classes.section} cx={CENTER} cy={CENTER} r={this.waterRadius * SQUISH_FACTOR} />
        <circle className={classes.public} cx={CENTER} cy={CENTER} r={this.publicLandRadius * SQUISH_FACTOR} />
      </svg>
    )
  },

  render () {
    return (<div className={classes.streamItemContainer}>
      <span className={classes.alert} >{this.renderAlert()}</span>
      <span className={classes.ratio} >{this.renderStreamRatio()}</span>
      <span className={classes.name} >
        <Link to={`/streamList/${this.props.stream.stream.properties.gid}/`}>
          {this.props.stream.stream.properties.name}
        </Link>
      </span>
    </div>)
  }
})
// {this.renderAlert()}
export default StreamItemComponent
