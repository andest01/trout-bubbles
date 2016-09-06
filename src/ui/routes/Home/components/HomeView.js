import React from 'react'
// import DuckImage from '../assets/Duck.jpg'
// import classes from './HomeView.scss'
import SectionComponent from './explainerSection/Section.component'
export const HomeView = () => (
  <div>
    <div className='jumbotron'>
      <h1 className='display-1'>Trout Mapper</h1>
      <p className='lead'>
        Trout Mapper helps you find trout streams in Minnesota.
      </p>
    </div>
    <hr className='m-y-2' />
    <SectionComponent>
      <p>State</p>
    </SectionComponent>

    <SectionComponent>
      <p>Region</p>
    </SectionComponent>

    <SectionComponent>
      <p>Stream</p>
    </SectionComponent>

    <SectionComponent>
      <p>Line</p>
    </SectionComponent>

    <SectionComponent>
      <p>Publicly Accessible Shoreline</p>
    </SectionComponent>

    <SectionComponent>
      <p>Special Regulations</p>
    </SectionComponent>

    <SectionComponent>
      <p>Bridge Crossings</p>
    </SectionComponent>

    <SectionComponent>
      <p>Species</p>
    </SectionComponent>

    <SectionComponent>
      <p>Nearby Streams</p>
    </SectionComponent>
  </div>
)

export default HomeView
