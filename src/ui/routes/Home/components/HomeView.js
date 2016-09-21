/* eslint max-len: 0 */
import React from 'react'
// import DuckImage from '../assets/Duck.jpg'
// import classes from './HomeView.scss'
import SectionComponent from './explainerSection/Section.component'
import StreamItemComponent from '../../streamList/StreamItem.component'
export const HomeView = () => {
  let createFakeStream = (index, streamRadius, troutStreamSectionRadius,
      publiclyAccessibleTroutStreamSectionRadius, name, hasAlert) => {
    return {
      index,
      streamRadius,
      troutStreamSectionRadius,
      publiclyAccessibleTroutStreamSectionRadius,
      name,
      hasAlert
    }
  }
  let fakeStreams = [
    createFakeStream(0, 8, 5, 2, 'Forestville Creek', false),
    createFakeStream(0, 13, 8, 1, 'Thompson Creek', true),
    createFakeStream(0, 5, 3, 2, 'Maple Creek', false),
    createFakeStream(0, 21, 11, 6, 'Root River, South Branch', false),
    createFakeStream(0, 3, 3, 3, 'Trout Valley Creek', true)
  ]

  return <div>
    <h2 className='display-1'>Trout Spotr</h2>
    <h3>
      Helps you find trout streams in Minnesota.
    </h3>
    <p>
      Trout spotr is an application to help new and experienced anglers locate streams with trout fishing throughout Minnesota. The application also allows anglers to see Minnesota Department of Natural Resources (DNR) regulations for legally and safely fishing these streams.
    </p>
    <h3>What this app doesn't do</h3>
    <p>This application is an exercise and designed to assist anglers but it is not necessarily up to date and exhaustive. While it does depend on government data, it is not a government tool and it is recommended that anglers consult official fishing regulations before venturing out. Trout spotr is not responsible for any incidents stemming from the use of this application. <strong>Trout spotr is not legal advice.</strong> 
    </p>
    <hr className='m-y-2' />
    <p>This app also doesn't cover the following:</p>
    <ul>
      <li>Trout Lakes
      </li>
      <li>Any waters outside of Minnesota. If a stream flows outside of Minnesota, only the Minnesota portion is covered.
      </li>
      <li>Streams the Minnesota DNR has identified as containing zero trout habitat
      </li>
      <li>The interior of Superior National Forest and the Boundary Waters Canoe Area
      </li>
      <li>Additionally, data for the Lake Superior region is insufficient and outdated and it is recommended that anglers call the Minnesota DNR with specific questions.
      </li>
    </ul>
    <hr className='m-y-2' />
    <h3 id='stream-list'>Stream List</h3>
    <p>The first page you will land on is an alphabetical list of all the Minnesota streams with trout habitats.
    </p>
    <ul>
      {
        fakeStreams.map((stream, index) => {
          return <StreamItemComponent
            index={index}
            streamRadius={0}
            troutStreamSectionRadius={0}
            publiclyAccessibleTroutStreamSectionRadius={0}
            name={stream.name}
            hasAlert={false} />
        })
      }
    </ul>
    <h5>Trout Habitat Length</h5>
    <p>
    Next to each stream name is a blue circle. The size of the circles indicates the relative length of *trout habitat* compared to other streams. Therefore, the larger the circle, the larger the trout habitat.
    </p>
    <ul>
      {
        fakeStreams.map((stream, index) => {
          return <StreamItemComponent
            index={index}
            streamRadius={stream.streamRadius}
            troutStreamSectionRadius={stream.troutStreamSectionRadius}
            publiclyAccessibleTroutStreamSectionRadius={0}
            name={stream.name}
            hasAlert={false} />
        })
      }
    </ul>
    <h5>Publicly Accessible Land</h5>
    <p>
    Each stream may have Publicly Accessible Land. Publicly accessible means you can walk along the shore and, if fishing within regulations, have a right to be there. Many streams flow through private land that have easements, or segments of land purchased by the DNR where it is legal for you to fish. Publicly Accessible Land includes easements, State Parks, State Forests, and Wildlife Management Areas.
    </p>
    <ul>
      {
        fakeStreams.map((stream, index) => {
          return <StreamItemComponent
            index={index}
            streamRadius={stream.streamRadius}
            troutStreamSectionRadius={stream.troutStreamSectionRadius}
            publiclyAccessibleTroutStreamSectionRadius={stream.publiclyAccessibleTroutStreamSectionRadius}
            name={stream.name}
            hasAlert={false} />
        })
      }
    </ul>
    <h5>Special Regulations</h5>
    <p>
    Some streams have Special Regulations - regulations that supercede the default trout regulations. These are marked with a yellow triangle. You will need to review what the specific regulations are by inspecting the stream details view, or preferably by looking them up in the DNR Regulations guide.
    </p>
    <ul>
      {
        fakeStreams.map((stream, index) => {
          return <StreamItemComponent
            index={index}
            streamRadius={stream.streamRadius}
            troutStreamSectionRadius={stream.troutStreamSectionRadius}
            publiclyAccessibleTroutStreamSectionRadius={stream.publiclyAccessibleTroutStreamSectionRadius}
            name={stream.name}
            hasAlert={stream.hasAlert} />
        })
      }
    </ul>

  </div>
}


    // <SectionComponent>
    //   <p>State</p>
    // </SectionComponent>

    // <SectionComponent>
    //   <p>Region</p>
    // </SectionComponent>

    // <SectionComponent>
    //   <p>Stream</p>
    // </SectionComponent>

    // <SectionComponent>
    //   <p>Line</p>
    // </SectionComponent>

    // <SectionComponent>
    //   <p>Publicly Accessible Shoreline</p>
    // </SectionComponent>

    // <SectionComponent>
    //   <p>Special Regulations</p>
    // </SectionComponent>

    // <SectionComponent>
    //   <p>Bridge Crossings</p>
    // </SectionComponent>

    // <SectionComponent>
    //   <p>Species</p>
    // </SectionComponent>

    // <SectionComponent>
    //   <p>Nearby Streams</p>
    // </SectionComponent>

export default HomeView
