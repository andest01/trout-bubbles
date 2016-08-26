import React, { PropTypes } from 'react'
import _ from 'lodash'
import BubbleComponent from '../Bubbles/Bubble.component';

const StreamDetailsComponent = React.createClass({
  propTypes: {
    streams: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    getSouthEasternStreams: PropTypes.func.isRequired
  },

  // let regionId = this.props.params.regionId || null;
  componentWillMount () {
    this.props.getSouthEasternStreams()
    this.streamId = this.props.params.streamId || null
    this.stream = this.props.streams[this.streamid]
  },

  getStream (streamId) {
    return this.props.streams[streamId] || null
  },

  render () {
    let stream = this.getStream(this.props.params.streamId)

    if (stream == null) {
      return null
    }
    return (
      <div className='container-fluid'>
        <div className='row'>
          <BubbleComponent stream={stream} index={0} />
        </div>
      </div>
    )
  }
})
export default StreamDetailsComponent
