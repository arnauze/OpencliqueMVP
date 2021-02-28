import React from 'react'
import Navigation from './Navigation/Navigation'
import { connect } from 'react-redux'
import ConnectionStackNavigator from './Navigation/OtherNavigation'
import { Auth, API } from 'aws-amplify'
import AddInfo from './Components/Connection/FirstConnection/AddInfo'

// When I create a chat I need to be able to send a message right away
// I only fetch the flux for one user for now, need to fetch the flux with all of the user's followings informations

class MainPage extends React.Component {

    constructor(props) {
        super(props)
        Auth.currentAuthenticatedUser({mandatorySignIn: false})
        .then(data => {

            console.log("GOING THROUGH CURRRENT AUTHENTICATED USER")
            console.log(data)

            let apiName = 'Openclique';
            let path = '/users/' + data.signInUserSession.accessToken.payload.username
            let myInit = {

                // I'm using connection: true in myInit because in the lambda function I change the variable
                // last_connection_time when I use the get request with a connection

                queryStringParameters: {
                    "connection": true
                }
            }

            API.get(apiName, path, myInit).then(response => {

                console.log("Successful API Call")
                console.log(response)

                // Here I added the Cognito token into the user informations because I need it to connect to the API (security)

                // let action2 = { type: 'CHANGE_FILTERS', value: {
                //     filters: response.preferences.filters,
                //     user: response
                // }}
                // this.props.dispatch(action2)
                let action = { type: 'CHANGE_CONNECTED_USER', value: response, token: data.signInUserSession.idToken.jwtToken }
                this.props.dispatch(action)

            }).catch(error => {
                console.log("Error API Call")
                console.log(error)
            });
        })
        .catch(err => {
            console.log(err)
        })
        // this.connect()
    }

    // connect() {

    //     // Connecting to the app's websocket for notifications and the chat
    //     let websocket = new WebSocket("wss://gf3tcxpki0.execute-api.us-east-2.amazonaws.com/dev");
    
    //     // When the websocket's connection is established I send a message to the websocket, and it updates the connection ID of the user
    //     websocket.onopen = (event) => {
    //       console.log("Connection established!")
    
    //       let message = {
    //         action: "connectUser",
    //         user: this.props.user.info
    //       }
    
    //       let stringifiedMessage = JSON.stringify(message)
    
    //       websocket.send(stringifiedMessage)

    //     }
    
    //     websocket.onmessage = (event) => {
    //       console.log("New message received:")
    //       console.log(event)
        
    //       var notification = JSON.parse(event.data)

    //       let action = {
    //           type: "ADD_NOTIFICATION",
    //           notification: notification
    //       }
    //       this.props.dispatch(action)

    //     }
    
    //     websocket.onclose = (event) => {
    //         console.log("Websocket connection lost")
    //         console.log(event);
    //         setTimeout(connect,10000); //re-connect after 10 seconds
    //         //..and so on
    //     }
    
    //     websocket.onerror = (error) => {
    //       alert("Error: ", error.message)
    //     }
    
    //   }

    render() {
        // return (
        //     <Navigation />
        // )
        if (this.props.user.isConnected && !this.props.user.isFirstConnection) {
            return (
                <Navigation />
            )
        } else {
            return (
                <ConnectionStackNavigator />
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(MainPage)