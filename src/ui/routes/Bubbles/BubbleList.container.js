import { connect } from 'react-redux'
import { getSouthEasternStreams } from './Bubbles.state'
import { getStreamList } from './Bubbles.selectors'

import BubblesListComponent from './BubblesList.component'

const mapActionCreators = {
  getSouthEasternStreams
}

const mapStateToProps = (state) => {
  return {
    streams: getStreamList(state)
  }
}

export default connect(mapStateToProps, mapActionCreators)(BubblesListComponent)
