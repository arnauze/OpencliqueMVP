import React from 'react'
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, Switch, Animated, ScrollView, Dimensions, SafeAreaView } from 'react-native'
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
// Dark version
// MapboxGL.setAccessToken("pk.eyJ1IjoiYXJuYXV6ZSIsImEiOiJja2Jhcjg4c3cwOTlrMnVuMWFwY2VwYnhyIn0.SEtqlYaWpFvuqSQ2GhXDTQ");
// Light version
MapboxGL.setAccessToken("pk.eyJ1IjoibWF4c3RhdGhhbSIsImEiOiJjazlpZ3N3M2owNzdrM2xwNWtsNWNzOGR1In0.dnrjgWVBo2lvK9WjfE9K5A")
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

class TopBar extends React.Component {
    render() {
        return (
            <View
            style={{position: "absolute", top: 50, width: "100%", alignItems: 'center', flexDirection: "row"}}
            >
                <View
                style={{flex: 1, alignItems: 'center'}}
                >
                    <SettingsButton
                    navigation={this.props.navigation}
                    />
                </View>
                <View
                style={{flex: 4, alignItems: 'center'}}
                >
                    <SearchBar />
                </View>
                <View
                style={{flex: 1, alignItems: 'center'}}
                >
                    <FiltersButton
                    navigation={this.props.navigation}
                    />
                </View>
            </View>
        )
    }
}

class SettingsButton extends React.Component {
    render() {
        return (
            <TouchableOpacity
            style={{width: 35, height: 35, alignItems: 'center', justifyContent: "center", borderRadius: 17.5, backgroundColor: "rgba(255,255,255,0.9)"}}
            onPress={() => this.props.navigation.navigate("Settings")}
            >
                <Image
                source={require("../../Images/settings_gray.png")}
                style={{width: 15, height: 15}}
                />
            </TouchableOpacity>
        )
    }
}

class FiltersButton extends React.Component {
    render() {
        return (
            <TouchableOpacity
            style={{width: 35, height: 35, alignItems: 'center', justifyContent: "center", borderRadius: 17.5, backgroundColor: "rgba(255,255,255,0.9)"}}
            onPress={() => this.props.navigation.navigate("Filters")}
            >
                <Image
                source={require("../../Images/filters_gray.png")}
                style={{width: 13.5, height: 13.5}}
                />
            </TouchableOpacity>
        )
    }
}

class SearchBar extends React.Component {

    _getCity = () => {
        return "Los Angeles"
    }

    render() {
        return (
            <TouchableOpacity
            style={{width: 200, height: 35, borderRadius: 17.5, backgroundColor: "rgba(255,255,255,0.9)", flexDirection: "row", alignItems: "center", paddingHorizontal: 15}}
            >
                <Image
                source={require("../../Images/search_icon.png")}
                style={{width: 14, height: 14, marginRight: 8}}
                />
                <Text style={{color: "#8A8A8A", fontWeight: "600"}}>
                    |
                </Text>
                <Text style={{marginLeft: 8, color: "#8A8A8A", fontWeight: "600"}}>
                    {this._getCity()}
                </Text>
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
                latitude: 34.0209, //props.user.info.location && props.user.info.location.lat != null ? props.user.info.location.lat : 34.0209,
                longitude: -118.2856, //props.user.info.location && props.user.info.location.lng != null ? props.user.info.location.lng : -118.2856,
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
            lastLocationUpdate: Date.now(),
            zoom: 0,
            clusters: []
        }

        this.startBackgroundLocation()
        this._getRecommendations()
        this._getUsers()
    }

    _getRecommendations = () => {

        let apiName = 'Openclique'
        let path = '/recommendations/' + this.props.user.info.username
        let myInit = {
            body: {
                location: {
                    latitude: this.props.user.currentLocation.latitude,
                    longitude: this.props.user.currentLocation.longitude
                }
            }
        }

        API.post(apiName, path, myInit)
        .then(response => {

            console.log("SUCCESSFULLY FETCHED RECOMMENDATIONS")

            let action = {
                type: 'UPDATE_SUGGESTIONS',
                value: {
                    suggestions: response
                }
            }
    
            this.props.dispatch(action)
            this.setState({
                ...this.state,
                suggestions: response
            })

        })
        .catch(error => {
            console.log("[PLACES/NEARBYSEARCH] ERROR:")
            console.log(error.response)
        })

    }

    startBackgroundLocation = () => {
        navigator.geolocation.requestAuthorization()
        if (this.state.region.latitude == "0" && this.state.region.longitude == "0") {
            navigator.geolocation.getCurrentPosition((location) => {

                let action = {
                    type: "CHANGE_REGION",
                    value : {
                        lat: location.coords.latitude,
                        lng: location.coords.longitude
                    }
                }

                this.props.dispatch(action)
                
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

                let action = {
                    type: "CHANGE_REGION",
                    value : {
                        lat: location.latitude,
                        lng: location.longitude
                    }
                }

                this.props.dispatch(action)

                // I only refresh the user's location every 1 minutes (60000 ms)

                let currentDate = Date.now()
                if ((currentDate - this.state.lastLocationUpdate) > 60000) {

                    let apiName = 'Openclique'
                    let path = '/users/' + state.user.info.username + '/location'
                    let myInit = {
                        body: {
                            location: {
                                lat: location.latitude,
                                lng: location.longitude
                            }
                        }
                    }

                    API.post(apiName, path, myInit)
                    .then(response => {

                        this.setState({
                            ...this.state,
                            lastLocationUpdate: currentDate
                        })

                    })
                    .catch(error => {

                        console.log(error.response)

                    })

                }

                BackgroundGeolocation.endTask(key)          // Task always needs to be ended before it times out
            }) 
        })
    }

    _getUsers = () => {

        let apiName = 'Openclique'
        let path = '/users'
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

    _isInBounds = (point, bounds, isCluster) => {
        var inBound
        if (isCluster) {
            inBound = (Math.abs(point[1]) > Math.abs(bounds[0][0]) && Math.abs(point[1]) < Math.abs(bounds[1][0]))
                        && (Math.abs(point[0]) < Math.abs(bounds[0][1]) && Math.abs(point[0]) > Math.abs(bounds[1][1]))
        } else {
            inBound = (Math.abs(point[0]) > Math.abs(bounds[0][0])
            && Math.abs(point[0]) < Math.abs(bounds[1][0]))
            && (Math.abs(point[1]) < Math.abs(bounds[0][1])
            && Math.abs(point[1]) > Math.abs(bounds[1][1]))
        }
        return inBound
    }

    _getMinMax = (suggestions, stepsWidth, stepsHeight) => {
        /*
        That function loops through all the weekly suggestions for the user
        and finds the min and max latitude/longitude
        :suggestions: list of suggestions for the usr
        :stepsWidth: diff in longitude between left side and right side of cluster box
        :stepsHeight: diff in latitude between top side and bottom side of cluster box
        Returns
        -> minLat: minimum latitude in suggestions
        -> maxLat: maximum latitude in suggestions
        -> minLon: minimum longitude in suggestions
        -> maxLon: maximum longitude in suggestions
        */

        var minLat = null;
        var maxLat = null;
        var minLon = null;
        var maxLon = null;
        for (var suggestion of suggestions) {
            let point = suggestion.geoJson.coordinates
            if (!minLat || (minLat && Math.abs(point[0]) < Math.abs(minLat)))
                minLat = point[0]
            if (!maxLat || (maxLat && Math.abs(point[0]) > Math.abs(maxLat)))
                maxLat = point[0]
            if (!minLon || (minLon && Math.abs(point[1]) < Math.abs(minLon)))
                minLon = point[1]
            if (!maxLon || (maxLon && Math.abs(point[1]) > Math.abs(maxLon)))
                maxLon = point[1]
        }
        minLat -= (stepsHeight / 2)
        maxLat += (stepsHeight / 2)
        minLon -= (stepsWidth / 2)
        maxLon += (stepsWidth / 2)
        return [minLat, maxLat, minLon, maxLon]
    }

    _makeClusters = (minLat, maxLat, minLon, maxLon, stepsLat, stepsLon, latInversed, lonInversed) => {
        /*
        That function loops in the zone determined by the suggestions positions,
        and creates all the clusters needed, based on the current zoom
        :minLat: Minimum latitude found in suggestions
        :maxLat: Maximum latitude found in suggestions
        :minLon: Minimum longitude found in suggestions
        :maxLon: Maximum longitude found in suggestions
        :stepsLat: Size of each step to next clusters
        :stepsLon: Size of each step to next clusters
        :latInversed: Boolean true if latitude is negative
        :lonInversed: Boolean true if longitude is negative
        Returns
        -> clusters: newly created clusters, without any suggestions in them
        */

        // Utility function to return true of false for latitude loop
        latCondition = (latInversed, currentLat, maxLat) => {
            if (latInversed) {
                return currentLat > maxLat
            } else {
                return currentLat < maxLat
            }
        }

        // Utility function to return true of false for longitude loop
        lonCondition = (lonInversed, currentLon, maxLon) => {
            if (lonInversed) {
                return currentLon > maxLon
            } else {
                return currentLon < maxLon
            }
        }

        let clusters = []
        let currentLat = minLat

        // Looping through the entire height
        while (latCondition(latInversed, currentLat, maxLat)) {
            let currentLon = minLon

            // Looping through the entire width
            while(lonCondition(lonInversed, currentLon, maxLon)) {
                clusters.push(
                    {
                        "top": currentLat,
                        "bottom": latInversed ? currentLat - stepsLat : currentLat + stepLat,
                        "left": currentLon,
                        "right": lonInversed ? currentLon - stepsLon : currentLon + stepsLon,

                        // We calculate the center once we've added all suggestions in their respective clusters
                        "center": [0, 0],
                        "points": []
                    }
                )
                if (lonInversed)
                    currentLon -= stepsLon
                else
                    currentLon += stepsLon
            }
            if (latInversed)
                currentLat -= stepsLat
            else
                currentLat += stepsLat
        }
        
        return clusters
    }

    _addSuggestionsToClusters = (suggestions, clusters) => {
        /*
        That function loops through all the suggestions, and put them in their clusters
        :suggestions: list of suggestions
        :clusters: list of clusters
        Returns
        -> clusters: Uppdated list of clusters with suggestions in them
        */

        let i = -1

        // Looping through all the suggestions
        while (++i < suggestions.length) {
            let j = -1
            let point = suggestions[i].geoJson.coordinates

            // Looping throught all the clusters
            while (++j < clusters.length) {

                // If the suggestions is located inside a cluster, we add it inside
                if ((Math.abs(point[0]) > Math.abs(clusters[j].top)
                    && Math.abs(point[0]) < Math.abs(clusters[j].bottom))
                    && (Math.abs(point[1]) < Math.abs(clusters[j].right)
                    && Math.abs(point[1]) > Math.abs(clusters[j].left))) {
                        clusters[j].points.push(suggestions[i])
                    }
            }
        }
        return clusters
    }

    _calculateClusterCenter = (clusters) => {
        /*
        That function calculates the centers point of the cluster based on its nested points
        :clusters: List of clusters
        Returns
        -> clusters: List of clusters with updated center coordinates
        */

        for (var cluster of clusters) {
            if (cluster.points.length > 0) {
                let total_lat = 0
                let total_lon = 0
                for (var point of cluster.points) {
                    total_lat += point.geoJson.coordinates[0]
                    total_lon += point.geoJson.coordinates[1]
                }
                cluster.center = [total_lon / cluster.points.length, total_lat / cluster.points.length]
            }
        }

        return clusters
    }

    _clusterMarkers = (bounds, suggestions) => {
        /*
        That function handles the clustering of markers on the map.
        It is called on map layout and when the zoom changes
        :bounds: Current bounds of the map
        :suggestions: List of suggestions we made to the user
        Returns
        -> clusters: List of clusters, with the suggestions nested inside them
        */

        // We get the borders of the map boundaries
        let top = bounds[0][0]
        let bottom = bounds[1][0]
        let right = bounds[0][1]
        let left = bounds[1][1]

        // We look if latitude or longitude are negative. This is important because
        // it will change the way we loop to create the clusters
        let latInversed = ((top < 0) || (bottom < 0))
        let lngInversed = ((left < 0) || (right < 0))
        
        // Now we calculate the width and height of the cluster zones
        let differenceHeight = Math.abs(bottom - top)
        let differenceWidth = Math.abs(left - right)
        let stepsWidth = (differenceWidth / 6)
        let stepsHeight = (differenceHeight / 4)

        // We get the minimum and maximum longitude and latitude of the suggestions
        var [minLat, maxLat, minLon, maxLon] = this._getMinMax(suggestions, stepsWidth, stepsHeight)

        // We create the clusters
        let clusters = this._makeClusters(minLat, maxLat, minLon, maxLon, stepsHeight, stepsWidth, latInversed, lngInversed)

        // We add the suggestions inside their respective clusters
        clusters = this._addSuggestionsToClusters(suggestions, clusters)

        // We calculate where we should display the cluster on the map, based on the suggestions nested inside them
        clusters = this._calculateClusterCenter(clusters)

        return clusters
    }

    _inZoomRange(place, zoom) {
        let ret = false
        if (zoom > 6 && zoom < 10 && place.flames >= 5) {
            ret = true
        } else if ((zoom >= 10 && zoom < 12) && place.flames >= 4) {
            ret = true
        } else if ((zoom >= 12 && zoom < 13) && place.flames >= 3) {
            ret = true
        } else if ((zoom >= 13 && zoom < 14) && place.flames >= 2) {
            ret = true
        } else if (zoom >= 14 && place.flames >= 1) {
            ret = true
        }
        return ret
    }

    _filterMarkers(bounds, suggestions, zoom) {
        // Function used to filter suggestions based on zoom and bounds of the map
        return suggestions.map((item, index) => {
            let point = item.geoJson.coordinates
            if (this._isInBounds(point, bounds, false) && this._inZoomRange(item, zoom)) {
                return (
                    <CustomMarker
                    isCluster={false}
                    key={index}
                    camera={this._camera}
                    item={item}
                    navigation={this.props.navigation}
                    showCallout={this._showPlaceCallout}
                    openCallout={this.state.openCallout}
                    user={this.props.user.info}
                    />
                )
            }
        })
    }

    _displayMarkersByZoom() {
        console.log("IN DISPLAY MARKERS BY ZOOM")
        // Function used to display recommendations based on zooms
        if (this.state.suggestions) {
            let suggestions = [...this.state.suggestions.coffee_and_tea, ...this.state.suggestions.culture, ...this.state.suggestions.likes, ...this.state.suggestions.restaurant, ...this.state.suggestions.nature]
            let bounds = this.state.bounds
            let zoom = this.state.zoom
            let toRet = this._filterMarkers(bounds, suggestions, zoom)
            console.log(toRet)
            return toRet
        }
    }

    _displayMarkersByCluster() {
        // Function used to clusterize the recommendations
        if (this.state.suggestions) {
            let i = 0
            let clusters = this.state.clusters
            let bounds = this.state.bounds
            return (
                // Then I loop through the clusters
                clusters.map((item, index) => {
                    // If the cluster only has one point in it, we display the point itself
                    if (item.points.length === 1) {
                        let place = item.points[0]
                        let point = place.geoJson.coordinates
                        // If the point is in bounds, then we display it
                        if (this._isInBounds(point, bounds, false)) {
                            return (
                                <CustomMarker
                                isCluster={false}
                                key={index}
                                camera={this._camera}
                                item={place}
                                navigation={this.props.navigation}
                                showCallout={this._showPlaceCallout}
                                openCallout={this.state.openCallout}
                                user={this.props.user.info}
                                />
                            )
                        }
                    } else {
                        // If it is a cluster with more than one point, or 0 point
                        let point = item.center
                        // If the cluster is in bound and has at least one point in it then we display it
                        if (this._isInBounds(point, bounds, true) && item.points.length > 0) {
                            return (
                                <CustomMarker
                                isCluster={true}
                                key={index}
                                camera={this._camera}
                                item={item}
                                navigation={this.props.navigation}
                                showCallout={this._showPlaceCallout}
                                openCallout={this.state.openCallout}
                                user={this.props.user.info}
                                />
                            )
                        }
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
        let zoom = await this._map.getZoom()
        var clusters = null
        if (zoom !== this.state.zoom) {
            let suggestions = [...this.state.suggestions.coffee_and_tea, ...this.state.suggestions.culture, ...this.state.suggestions.likes, ...this.state.suggestions.restaurant, ...this.state.suggestions.nature]
            clusters = this._clusterMarkers(resp, suggestions)
        }
        this.setState({
            ...this.state,
            bounds: resp,
            zoom: zoom,
            clusters: clusters ? clusters : this.state.clusters
        })
    }

    _centerMap = () => {
        this._camera.flyTo([this.props.user.currentLocation.longitude, this.props.user.currentLocation.latitude], 1000)
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
                <MapboxGL.MapView
                rotateEnabled={false}
                onLayout={(e) => this.setState({ ...this.state, mapHeight: e.nativeEvent.layout.height })}
                onPress={() => this._updateScreen()}
                style={styles.map}
                // Light version
                styleURL="mapbox://styles/maxstatham/ckmgx5qg45xiy17lrbniy2g9x"
                // That one is the dark version
                // styleURL="mapbox://styles/gure/ckk2da2bc3cj817nptcdryzor"
                logoEnabled={false}
                pitchEnabled={false}
                ref={(c) => this._map = c}
                onDidFinishLoadingMap={this.onRegionDidChange}
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
                    />
                    {this._displayMarkersByCluster()}
                </MapboxGL.MapView>
                <MyLocationButton
                centerMap={this._centerMap}
                />
                <TopBar
                navigation={this.props.navigation}
                />
                <OpenCallout
                openCallout={this.state.openCallout}
                calloutHeight={this.state.calloutHeight}
                onBottomReached={() => this.setState({ ...this.state, openCallout: null })}
                setRefCallout={this._setRefCallout}
                user={this.props.user}
                dispatch={this.props.dispatch}
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