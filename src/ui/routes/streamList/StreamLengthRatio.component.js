import React, { PropTypes } from 'react'
import classes from './StreamItem.style.scss'
import _ from 'lodash'

const StreamLengthRatioComponent = React.createClass({
  propTypes: {
    length: PropTypes.number,
    color: PropTypes.string.isRequired
  },

  render () {

    let number = (this.props.length === 0 || this.props.length == null)
        ? null 
        : (Math.round( this.props.length * 10 ) / 10)

    return (
      <div style={{'backgroundColor': this.props.color}} className={classes.icon}>
        <div className={classes.icon_content}>{number}</div>
      </div>)
  }
})

export default StreamLengthRatioComponent
