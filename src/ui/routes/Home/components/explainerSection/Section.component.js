import React from 'react'
import classes from './Explainer.style.scss'

const SectionComponent = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired
  },

  componentWillMount () {
  },

  render () {
    return (
      <div className={classes.section}>
        {this.props.children}
      </div>
    )
  }
})

export default SectionComponent
