import React, { PropTypes } from 'react'
import classes from './BubblesList.style.scss'
import BubbleComponent from './Bubble.component'

const StreamListContainer = React.createClass({
  propTypes: {
    streams: PropTypes.array.isRequired,
    getSouthEasternStreams: PropTypes.func.isRequired
  },

  componentDidMount () {
    this.props.getSouthEasternStreams();
  },

  render () {
    return (<div>
      <ul className={classes['bubble-container']}>
      {

        this.props.streams.map((streamItem, index) => {
          return (
            <li key={streamItem.stream.properties.gid} className={classes['bubble-item']}>
              <BubbleComponent index={index + 1} stream={streamItem} />
            </li>)
        })
      }
      </ul>
    </div>)
  }
})
export default StreamListContainer
