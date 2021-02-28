import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Image, Switch, Animated, ScrollView, Dimensions, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'
import CustomMarker from './CustomMarker'
import { API, Storage } from 'aws-amplify'
import { NavigationEvents } from "react-navigation"
import earnedReward, { isEmpty, outputTypeOfMarker, getDistance, getLocations, readFile, getFeatherColor } from '../Functions/functions'
import UserMarker from './UserMarker'
import { appColor, almostWhite } from '../../Styles/styles'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import MapboxGL from '@react-native-mapbox-gl/maps';
import OpenCallout from './StatusPanel/OpenCallout'
MapboxGL.setAccessToken("pk.eyJ1IjoiYXJuYXV6ZSIsImEiOiJja2Jhcjg4c3cwOTlrMnVuMWFwY2VwYnhyIn0.SEtqlYaWpFvuqSQ2GhXDTQ");
navigator.geolocation = require('@react-native-community/geolocation');

// When I move from the search tab to the map tab the slide up panel is not at the right position to begin with
// When I click on a marker the callout shows so it's good but I can't click on another marker right after, I need to click
// on the map first to close the callout and then click on a new marker

class MyLocationButton extends React.Component {
    render() {
        return (
            <TouchableOpacity
            style={[styles.elevated, {width: 30, height: 30, backgroundColor: appColor, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 20, borderRadius: 15, left: "50%", transform: [{ translateX: -15 }] }]}
            onPress={() => this.props.centerMap()}
            >
                <Image
                source={require("../../Images/near_me_white.png")}
                style={{width: 14, height: 14}}
                />
            </TouchableOpacity>
        )
    }
}

class Map extends React.Component {


    constructor(props) {
        super(props)

        // Initialize the location to the user's location
        // If the user's location is unknown, we set it to Los Angeles

        this.state = {
            searchText: '',
            openMenu: false,
            openFilter: false,
            locations: [],
            events: [],
            users: [],
            poi: [],
            showMarker: true,
            region: {
                latitude: props.user.info.location && props.user.info.location.lat != null ? props.user.info.location.lat : 34.0209,
                longitude: props.user.info.location && props.user.info.location.lng != null ? props.user.info.location.lng : -118.2856,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            },
            openCallout: null,
            statusIconPressed: false,
            iconPress: null,
            status: {
                userCurrentStatus: [],
                userSelected: []
            },
            scrollable: false,
            withStatus: {},
            statusShouldReload: false,
            animatedValue: new Animated.Value(0),
            ghost_mode: props.user.info.settings.ghost_mode,
            calloutHeight: 0,
            mapHeight: 0,
            bounds: [[0, 0], [0, 0]],
            lastLocationUpdate: Date.now()
        }

        this.startBackgroundLocation()
        this._getRecommendations()
        this._getUsers()
    }

    _getRecommendations = () => {

        let apiName = 'Openclique'
        let path = '/recommendations/' + this.props.user.info.username
        let myInit = {}

        API.get(apiName, path, myInit)
        .then(response => {

            let action = {
                type: 'UPDATE_SUGGESTIONS',
                value: {
                    suggestions: response.body
                }
            }
    
            this.props.dispatch(action)
            this.setState({
                ...this.state,
                suggestions: response.body
            })

        })
        .catch(error => {
            console.log(error.response)
        })

    }

    startBackgroundLocation = () => {
        navigator.geolocation.requestAuthorization()
        if (this.state.region.latitude == "0" && this.state.region.longitude == "0") {
            navigator.geolocation.getCurrentPosition((location) => {
                console.log(location)

                this.setState({
                    ...this.state,
                    region: {
                        ...this.state.region,
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    },
                }, () => {
                    let apiName = "Openclique"
                    let path = "/users/" + this.props.user.info.username + "/location"
                    let myInit = {
                        body: {
                            location: {
                                lng: location.coords.longitude,
                                lat: location.coords.latitude
                            }
                        }
                    }
                    API.get(apiName, path, myInit)
                    .then(response => {
                        console.log("Successfully updated user's location in database")
                        console.log(response)
                    })
                    .catch(error => {
                        console.log(error.response)
                    })
                })     

            })
        }
        BackgroundGeolocation.start()

        BackgroundGeolocation.on('start', () => {
            console.log('[INFO] BackgroundGeolocation service has been started');
        });
    
        BackgroundGeolocation.on('stop', () => {
            console.log('[INFO] BackgroundGeolocation service has been stopped');
        });

        BackgroundGeolocation.on('background', () => {
            console.log('[INFO] App is in background');
        });
      
        BackgroundGeolocation.on('foreground', () => {
            console.log('[INFO] App is in foreground');
        });

        BackgroundGeolocation.on("location", location => {
            console.log("[INFO] ON LOCATION RECEIVED")
            console.log(location)
            BackgroundGeolocation.startTask(key => {        // Needed to perform long running operations in IOS

                console.log('[INFO] Location received: ', location);

                this.setState({
                    ...this.state,
                    region: {
                        ...this.state.region,
                        latitude: location.latitude,
                        longitude: location.longitude
                    },
                })

                // I only refresh the user's location every 1 minutes (60000 ms)

                let currentDate = Date.now()
                if ((currentDate - this.state.lastLocationUpdate) > 60000) {

                    let action = {
                        type: 'UPDATE_USER',
                        value: {
                            location: {
                                latitude: location.latitude,
                                longitude: location.longitude
                            },
                        }
                    }
        
                    this.props.dispatch(action)

                }

                BackgroundGeolocation.endTask(key)          // Task always needs to be ended before it times out
            }) 
        })
    }

    _getUsers = () => {

        let apiName = 'Openclique'
        let path = '/users/' + this.props.user.info.username + '/friends'
        
        let myInit = {}

        API.get(apiName, path, myInit)
        .then(response => {
            this.setState({
                ...this.state,
                users: response
            })

        })
        .catch(error => {
            console.log(error.response)
        })

    }

    _getLocations = async (region) => {

        // The function works, now I need to create the logic and implement it the right way in here

        var filters = this.props.filters.filter(item => item !== "Event" && item !== "Unknown point" && item !== "Visited point")

        if (filters.length > 0) {
            let places = await getLocations(region, filters)
            this.setState({
                ...this.state,
                locations: places
            })
        }

    }

    _showPlaceCallout = item => {

        this.setState({
            ...this.state,
            openCallout: item,
            calloutHeight: this.state.mapHeight
        },  () => this._panelCallout.show())

    }

    _isInBounds = (point, bounds) => {
        return (Math.abs(point[0]) > Math.abs(bounds[0][0])
            && Math.abs(point[0]) < Math.abs(bounds[1][0]))
            && (Math.abs(point[1]) < Math.abs(bounds[0][1])
            && Math.abs(point[1]) > Math.abs(bounds[1][1]))
    }

    _displayMarker() {
        if (this.state.suggestions) {
            let suggestions = [...this.state.suggestions.coffee_and_tea, ...this.state.suggestions.culture, ...this.state.suggestions.likes, ...this.state.suggestions.restaurant, ...this.state.suggestions.nature]
            let bounds = this.state.bounds
            return (
                suggestions.map((item, index) => {
                    let point = item.geoJson.coordinates

                    // If suggestion point is inside the current bounds of the map we display

                    if (this._isInBounds(point, bounds)) {
                        return (
                            <CustomMarker
                            key={index}
                            camera={this._camera}
                            item={item}
                            navigation={this.props.navigation}
                            showCallout={this._showPlaceCallout}
                            openCallout={this.state.openCallout}
                            />
                        )
                    }
                })
            )
        }
    }

    _displayUsers = () => {

        if (this.state.users && this.state.users.length >= 1) {

           return (
               this.state.users.map((item, index) => {

                    return (
                        <UserMarker
                        camera={this._camera}
                        key={index}
                        location={item.location}
                        user={item}
                        character={this.props.user.character}
                        isCurrentUser={item.username === this.props.user.info.username}
                        // showCallout={this._showUserCallout}
                        openCallout={this.state.openCallout}
                        />
                    )

               })
           )

        } else {

            return null

        }

    }

    _updateScreen() {
        if (this.props.openMenu) {
            let firstAction = { type: 'CHANGE_OPEN_MENU', value: this.props.openMenu }
            this.props.dispatch(firstAction)
        }
        if (this.props.openFilter) {
            let secondAction = { type: 'CHANGE_OPEN_FILTER', value: this.props.openFilter }
            this.props.dispatch(secondAction)
        }
        if (this.props.openSearch) {
            let thirdAction = {
                type: 'CHANGE_SEARCH',
                value: this.props.openSearch
            }
            this.props.dispatch(thirdAction)
        }
        if (this.state.openCallout) {
            this.setState({
                ...this.state,
                openCallout: null
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this._interval)
        this._updateScreen()
    }

    _onDidFocus = () => {

        console.log("==================================")
        console.log("MESSAGE FROM INSIDE RENDER")
        console.log("==================================")

        // this._panel.hide()          // When I go to the research page and come back to the map my slide up panel is up, so I call hide to hide it right away
        this._checkGlobalStateRegion()

        if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.newEventCreated) {

            // If I just created an event and navigated to the map then I refresh the markers so the new event shows

            console.log("Reloading the map with the new event created!")
            // this._getEventsAndLocations()
            this.props.navigation.setParams({ newEventCreated: false })

        } else if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.eventDeleted) {

            // If I just deleted an event and navigated to the map then I refresh the markers so the old event disappears

            console.log("Reloading the map with the new event deleted!")
            // this._getEventsAndLocations()
            this.props.navigation.setParams({ eventDeleted: false })

        } else if (this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.newFilters) {

            // If I just changed the filters and navigated to the map then I refresh the locations markers

            console.log("Reloading the map with the new filters!")
            // this._getEventsAndLocations()
            this.props.navigation.setParams({ newFilters: false })

        }

        this.setState({...this.state, ghost_mode: this.props.user.info.settings.ghost_mode})

    }

    _checkGlobalStateRegion = () => {

        // Function that checks if when I get on the map I should move to a location
        // (for example if we come to the map because we clicked on an address)

        if (!isEmpty(this.props.globalStateRegion)) {
            this.setState({
                ...this.state,
                region: {
                    ...this.state.region,
                    latitude: this.props.globalStateRegion.latitude,
                    longitude: this.props.globalStateRegion.longitude
                }
            }, () => this._putGlobalStateRegionBackToNull())
        }
    }

    _putGlobalStateRegionBackToNull = () => {

        let action = {
            type: 'CHANGE_REGION',
            value: null
        }

        this.props.dispatch(action)

    }

    _setRef = (c) => {
        this._panel = c
    }

    _setRefCallout = (c) => {
        this._panelCallout = c
    }

    onRegionDidChange = async () => {
        let resp = await this._map.getVisibleBounds()
        this.setState({
            ...this.state,
            bounds: resp
        }, () => {
            console.log("[OnRegionDidChange] Resp:")
            console.log(this.state)
        })
    }

    _centerMap = () => {
        this.setState({
            region: {
                latitude: this.props.user.info.location.lat,
                longitude: this.props.user.info.location.lng,
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta
            },
            center: true
        }, () => this.setState({center: false}));
    }

    _onUpdateUserLocation = (location) => {
        console.log(location)
        // Call backend and update user location in database, every X minutes probably
    }

    render() {

        if (this.state.statusShouldReload) {
            this.setState({
                ...this.state,
                statusShouldReload: false
            })
        }

        return (
            <View
            style={styles.container}
            onLayout={(event) => {
                this.setState({...this.state, componentHeight: event.nativeEvent.layout.height, componentWidth: event.nativeEvent.layout.width})
            }}
            >
                <NavigationEvents
                onDidFocus={() => this._onDidFocus()}
                />
                <MapboxGL.MapView
                rotateEnabled={false}
                onLayout={(e) => this.setState({ ...this.state, mapHeight: e.nativeEvent.layout.height })}
                onPress={() => this._updateScreen()}
                // onUserLocationUpdate={() => {}}
                style={styles.map}
                styleURL="mapbox://styles/gure/ckk2da2bc3cj817nptcdryzor"
                // onRegionDidChange={(region) => this._getLocations(region)}
                logoEnabled={false}
                pitchEnabled={false}
                ref={(c) => this._map = c}
                onRegionDidChange={this.onRegionDidChange}
                >
                    <MapboxGL.Camera
                    ref={(c) => this._camera = c}
                    pitch={45}
                    zoomLevel={14}
                    minZoomLevel={4}
                    centerCoordinate={[this.state.region.longitude, this.state.region.latitude]}
                    />
                    <MapboxGL.UserLocation
                    renderMode={"native"}
                    showsUserHeadingIndicator
                    visible
                    animated
                    >
                    </MapboxGL.UserLocation>
                    {this._displayMarker()}
                </MapboxGL.MapView>
                <MyLocationButton
                centerMap={this._centerMap}
                />
                <OpenCallout
                openCallout={this.state.openCallout}
                calloutHeight={this.state.calloutHeight}
                onBottomReached={() => this.setState({ ...this.state, openCallout: null })}
                setRefCallout={this._setRefCallout}
                user={this.props.user.info}
                />
            </View>
        )

    }
}

const mapStyles = {
    icon: {
      iconAllowOverlap: true,
      iconSize: 0.35
    },
    clusteredPoints: {
      circleColor: "#004466",
      circleRadius: [
        "interpolate",
        ["exponential", 1.5],
        ["get", "point_count"],
        15,
        15,
        20,
        30
      ],
      circleOpacity: 0.84
    },
    clusterCount: {
      textField: "{point_count}",
      textSize: 12,
      textColor: "#ffffff"
    }
  };

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    text_input: {
        textAlign: 'center',
        width: 275,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(127, 127, 127, 1)',
        position: 'absolute',
        top: 70,
        borderWidth: 0.5
    },
    callout: {
        top: -30
    },
    elevated: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7
    },
    x_callout: {
        position: "relative",
        top: -45,
        alignSelf: "center",
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15
    }
});

const mapStateToProps = state => {
    return {
        filters: state.filters,
        openMenu: state.openMenu,
        openFilter: state.openFilter,
        openSearch: state.openSearch,
        user: state.user,
        globalStateRegion: state.region,
        globalSuggestions: state.globalSuggestions
    }
}

export default connect(mapStateToProps)(Map)