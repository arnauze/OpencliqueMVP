import React from 'react';
import BackgroundTask from 'react-native-background-task'
import MainPage from './MainPage'
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import Amplify, {Auth} from 'aws-amplify'
import AWS from 'aws-sdk'
import { MemoryStorageNew } from './StorageService'


AWS.config.update({
    accessKeyId:  "AKIAVPM4WHYNOGKNILXH",
    secretAccessKey: "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",
    region: "us-east-2"  
});

Amplify.configure({
  Auth: {
    // If I want to change the UserPool ID I need to disable "create a secret client thing" while creating the new UserPoolID
    region: 'us-east-2',
    userPoolId: 'us-east-2_i7csVrsOe',
    userPoolWebClientId: '5r05amt6mupbic89n5l5d9n9v0',
    storage: MemoryStorageNew
  },
  API: {
    endpoints: [
      {
          name: "Openclique",
          endpoint: "https://mr2g5iigzb.execute-api.us-east-2.amazonaws.com/dev"
      }
  ]
  }
})

// Here I'm defining the function that will handle the checks when the app is in Background

BackgroundTask.define(() => {

  console.log("Background check")

  BackgroundTask.finish();    // Always need to be called before the function times out (25 sec in IOS)

})

class App extends React.Component {

  componentDidMount() {

    BackgroundTask.schedule()       // Schedule the task to run every ~15min

    // If the app is in foreground it will use setInterval for the background checks, which is defined in the map component

  }

  render() {
    return (
      <Provider store={Store}>
        <MainPage />
      </Provider>
    )
  }
}

export default App