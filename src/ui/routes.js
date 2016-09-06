import React from 'react'
import { Route, IndexRoute } from 'react-router'
// import CoreLayout from 'ui/coreComponents/layout/CoreLayout'
import CoreLayout from './layouts/CoreLayout/CoreLayout'
import HomeContainer from './routes/Home/components/HomeView'
import BubblesContainer from './routes/Bubbles/BubbleList.container'
import StreamListContainer from './routes/streamList/StreamList.container'
import StreamDetailsContainer from './routes/streamList/StreamDetails.container'
export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={HomeContainer} />
    <Route path='/bubbles' component={BubblesContainer} />
    <Route path='/streamList' component={StreamListContainer} />
    <Route path='/streamList/:streamId' component={StreamDetailsContainer} />
  </Route>
)
