
import React, { PropTypes } from 'react'
import classes from './StreamList.style.scss'
import StreamItemComponent from './StreamItem.component'
import { StickyContainer, Sticky } from 'react-sticky';
import _ from 'lodash'

const StreamListContainer = React.createClass({
  propTypes: {
    streams: PropTypes.object.isRequired,
    getSouthEasternStreams: PropTypes.func.isRequired
  },

  componentDidMount () {
    this.props.getSouthEasternStreams()
  },

  render () {
    return (
      <div>
        <h4>Displaying 0 streams</h4>
        {
          _.map(this.props.streams, (value, key) => {
            // console.log(value)
            return (
              <div key={key}>
                <div className={classes.myHeaderLol}>
                  <h4>{key}</h4>
                </div>
                <hr />
                  <ul className={classes.list}>
                  {
                    value.map((streamItem, index) => {
                      return (
                        <li key={streamItem.stream.properties.gid} className={'' + classes.item}>
                          <StreamItemComponent index={index + 1} stream={streamItem} />
                        </li>)
                    })
                  }
                  </ul>
              </div>
            )
          })
        }
      </div>)
  }
})// 
// 
export default StreamListContainer
