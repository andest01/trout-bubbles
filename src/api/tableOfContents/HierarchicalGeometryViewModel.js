'use strict'
import _ from 'lodash'
import GeometryViewModel from './GeometryViewModelBase'

class HierarchicalGeometryViewModel extends GeometryViewModel {
  constructor () {
    super()
    this.parent = null
    this.children = []
  }

  get displayedChildren () {
    if (this.children == null || this.children.length === 0) {
      return 0
    }

    return this.children.filter(x => x.visible === true).length +
      _.sum(this.children, (child) => child.displayedChildren())
  }
}

export default HierarchicalGeometryViewModel
