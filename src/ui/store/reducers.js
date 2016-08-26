import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import { default as counterReducer } from '../routes/Bubbles/Bubbles.state'
export default combineReducers({
  router,
  bubbles: counterReducer
})

// export default makeRootReducer
