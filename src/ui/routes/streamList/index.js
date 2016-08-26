import { injectReducer } from '../../store/reducers'

export default (store) => ({
  path: 'streamList',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const StreamListContainer = require('./StreamList.container').default
      const bubblesReducer = require('../Bubbles/Bubbles.state').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'bubbles', reducer: bubblesReducer })

      /*  Return getComponent   */
      cb(null, StreamListContainer)

    /* Webpack named bundle   */
    }, 'streamList')
  }
})
