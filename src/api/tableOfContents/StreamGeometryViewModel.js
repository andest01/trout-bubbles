'use strict'
import GeometryViewModel from './GeometryViewModelBase'

class StreamGeometryViewModel extends GeometryViewModel {
  constructor () {
    super()
    this.visible = true
    this.parent = null
  }

  get displayedChildren () {
    return 0
  }
}

export default StreamGeometryViewModel
