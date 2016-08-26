import { connect } from 'react-redux'
import { getSouthEasternStreams } from '../Bubbles/Bubbles.state'
import { getStreamDictionary } from './StreamList.selectors'

import StreamDetailsContainer from './StreamDetails.component'

const mapActionCreators = {
  getSouthEasternStreams
}

const mapStateToProps = (state) => {
  return {
    streams: getStreamDictionary(state)
  }
}

export default connect(mapStateToProps, mapActionCreators)(StreamDetailsContainer)
