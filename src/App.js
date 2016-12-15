import React from 'react';
import { Provider } from 'mobx-react'
import DevTools from 'mobx-react-devtools';
import Form from 'react-jsonschema-form'

import { connect, store } from './store'
import Graph from './Graph'

import './App.css'

const settingsSchema = {
  type: 'object',
  properties: {
    overlapAllowed: {
      type: 'boolean',
      title: 'Overlap allowed'
    }
  }
}

const Settings = connect(({store: { updateSettings }}) => 
  <Form
    schema={settingsSchema}
    onChange={({formData}) => updateSettings(formData)}>
    <div></div>
</Form>
)

const App = connect(({store: {panOffset}}) => 
  <div>
  <div className="App" >
    <DevTools />
    <br/>
    <Graph 
      width={1000} 
      height={600}
      viewBox={`${panOffset} 0 1000 600`} 
      preserveAspectRatio='xMinYMin slice' 
      scaleFactor={1} />
    <p/>
    <Graph 
      width={1000} 
      height={150}
      viewBox={'0 0 4000 600'} 
      preserveAspectRatio='xMinYMin slice' 
      hasPanMap 
      scaleFactor={4} />
  </div>
    <Settings />
  </div>

)

export default () => 
  <Provider store={store}>
    <App />
  </Provider>
