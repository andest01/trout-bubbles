import { connect } from 'react-redux'
import { getSouthEasternStreams } from '../Bubbles/Bubbles.state'
import { getStreamGroups } from './StreamList.selectors'

import StreamListComponent from './StreamList.component'

const mapActionCreators = {
  getSouthEasternStreams
}

const mapStateToProps = (state) => {
  return {
    streams: getStreamGroups(state)
  }
}

export default connect(mapStateToProps, mapActionCreators)(StreamListComponent)
