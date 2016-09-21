/* eslint max-len: 0 */
import React, { PropTypes } from 'react'
import classes from './StreamItem.style.scss'
import _ from 'lodash'
import { Link } from 'react-router'
import StreamLengthRatioComponent from './StreamLengthRatio.component'
import * as d3 from 'd3'

const streamInterpolator = d3.interpolateLab('#dfdfdf', '#97caff')
const streamQuantile = [0, 10, 20, 30, 40]
const maxStreamLength = 40
const troutLengthInterpolator = d3.interpolateLab('#dfdfdf', '#4e7f84')
const maxTroutLength = 20
const troutQuantile = [0, 5, 10, 15, 20]
const publicLengthInterpolator = d3.interpolateLab('#dfdfdf', '#acbb39')
const maxPublicLength = 20
const publicQuantile = [0, 5, 10, 15, 20]

const MAX_DIMENSION = 24
const CENTER = MAX_DIMENSION / 2
const SQUISH_FACTOR = 4.0
const StreamItemComponent = React.createClass({
  propTypes: {
    // stream: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    streamRadius: PropTypes.number.isRequired,
    troutStreamSectionRadius: PropTypes.number.isRequired,
    publiclyAccessibleTroutStreamSectionRadius: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.number,
    hasAlert: PropTypes.bool.isRequired,
    streamLength: PropTypes.number.isRequired,
    troutLength: PropTypes.number.isRequired,
    publicLength: PropTypes.number.isRequired,
    publiclyAccessibleAccessPoints: PropTypes.number.isRequired
  },

  renderAlert () {
    return (
      <svg className={classes.alert} version='1.1' viewBox='0 0 32 32'>
        {this.props.hasAlert &&
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
        <circle className={classes.backdrop} cx={CENTER} cy={CENTER} r={this.props.streamRadius} />
        <circle className={classes.section} cx={CENTER} cy={CENTER} r={this.props.troutStreamSectionRadius} />
        <circle className={classes.public} cx={CENTER} cy={CENTER} r={this.props.publiclyAccessibleTroutStreamSectionRadius} />
      </svg>
    )
  },

  renderStreamName () {
    if (this.props.id == null) {
      return <span>{this.props.name}</span>
    }

    return (
      <Link to={`/streamList/${this.props.id}/`}>
        {this.props.name}
      </Link>)
  },

  render () {
    // let result = d3.interpolateLab('#dfdfdf', '#4e7f84')(0.5) // "rgb(142, 92, 109)"
    let t = d3.quantile(streamQuantile, this.props.streamLength / maxStreamLength)  / maxStreamLength
    console.log(t)
    let streamColor = streamInterpolator(t)
    let troutColor = troutLengthInterpolator(d3.quantile(troutQuantile, this.props.troutLength / maxTroutLength)  / maxTroutLength)
    let publicColor = publicLengthInterpolator(Math.min(this.props.publiclyAccessibleAccessPoints, 0.5))
    return (<div className={classes.streamItemContainer}>
      <StreamLengthRatioComponent length={this.props.publiclyAccessibleAccessPoints} color={publicColor} />
      <span className={classes.name} >
        {this.renderStreamName()}
      </span>
      <span className={classes.alert} >{this.renderAlert()}</span>
    </div>)
  }
})
// <span className={classes.ratio} >{this.renderStreamRatio()}</span>
// {this.renderAlert()}
export default StreamItemComponent
