import React, { PropTypes } from 'react'
import classes from './Bubble.scss'
import SvgBubbleComponent from './svgBubble/SvgBubble.component'
const BubbleComponent = React.createClass({
  propTypes: {
    stream: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
  },

  render () {
    let publicLand = _.reduce(this.props.stream.palSections, (sum, item) => {
      let start = item.properties.start
      let stop = item.properties.stop
      let length = stop - start

      return sum + length
    }, 0).toFixed(2)

    let streamSectionLength = _.reduce(this.props.stream.sections, (sum, item) => {
      let length = item.properties.length_mi
      return sum + length
    }, 0).toFixed(2)

    let restrictionsLength = _.reduce(this.props.stream.restrictions, (sum, item) => {
      let start = item.properties.start
      let stop = item.properties.stop
      let length = stop - start

      return sum + length
    }, 0).toFixed(2)

    let roadCrossings = this.props.stream.accessPoints.length.toFixed(2)
    let publicRoadCrossings = this.props.stream.accessPoints.filter(item => item.is_over_publicly_accessible_land
 === 1).length.toFixed(2)
          // <div>{this.props.stream.stream.properties.name}</div>
          // <div>Stream Length: {this.props.stream.stream.properties.length_mi.toFixed(2)}</div>
          // <div>Trout Stream Length: {streamSectionLength}</div>
          // <div>Accessible Length: {publicLand}</div>
          // <div>Restrictions Length: {restrictionsLength}</div>
          // <div>Road Crossings: {roadCrossings} ({publicRoadCrossings} public}</div>
    return (
      <div className={classes.bubble}>
        <div className={classes.bubbleHeader}>
          <div>
            <h2>{this.props.stream.stream.properties.name}</h2>
            <hr/>
          </div>
        </div>
        <div className={classes.bubbleBody}>
          <SvgBubbleComponent
            index={this.props.index + 1}
            stream={this.props.stream.stream}
            troutStreamSections={this.props.stream.sections}
            restrictions={this.props.stream.restrictions}
            accessPoints={this.props.stream.accessPoints}
            palSections={this.props.stream.palSections} />
        </div>
      </div>
    )
  }
})

export default BubbleComponent
