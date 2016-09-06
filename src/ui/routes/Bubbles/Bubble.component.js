import React, { PropTypes } from 'react'
import classes from './Bubble.scss'
import SvgBubbleComponent from './svgBubble/SvgBubble.component'
const BubbleComponent = React.createClass({
  propTypes: {
    stream: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
  },

  render () {
    // let publicLand = _.reduce(this.props.stream.palSections, (sum, item) => {
    //   let start = item.properties.start
    //   let stop = item.properties.stop
    //   let length = stop - start

    //   return sum + length
    // }, 0).toFixed(2)

    // let streamSectionLength = _.reduce(this.props.stream.sections, (sum, item) => {
    //   let length = item.properties.length_mi
    //   return sum + length
    // }, 0).toFixed(2)

    // let restrictionsLength = _.reduce(this.props.stream.restrictions, (sum, item) => {
    //   let start = item.properties.start
    //   let stop = item.properties.stop
    //   let length = stop - start

    //   return sum + length
    // }, 0).toFixed(2)

 //    let roadCrossings = this.props.stream.accessPoints.length.toFixed(2)
 //    let publicRoadCrossings = this.props.stream.accessPoints.filter(item => item.is_over_publicly_accessible_land
 // === 1).length.toFixed(2)
    return (
      <div className={classes.bubble}>
        <div className={classes.bubbleHeader}>
          <div>
            <h5>{this.props.stream.stream.properties.name}</h5>
            <h6>
              <div>Houston, Carver Counties</div>
              <div>-93° 27' 23.04" N, 42° 25' 28.2" W</div>
            </h6>

            <hr />
          </div>
        </div>
        <div className={classes.bubbleBody}>
          <SvgBubbleComponent
            index={this.props.index + 1}
            streamPackage={this.props.stream} />
        </div>
      </div>
    )
  }
})

export default BubbleComponent
