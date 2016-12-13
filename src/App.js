import React from 'react';
import { Provider } from 'mobx-react'
import DevTools from 'mobx-react-devtools';

import { connect, store } from './store'
import Graph from './Graph'

import './App.css'

const App = connect(({store: {panOffset}}) => 
  <div className="App" >
    <DevTools />
    <br/>
    <Graph 
      ref='svg' 
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
)

export default () => 
  <Provider store={store}>
    <App />
  </Provider>
