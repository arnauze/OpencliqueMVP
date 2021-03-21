import React from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image, ScrollView, StyleSheet, Linking, SafeAreaView, FlatList } from 'react-native'
import Amplify, { API, Storage } from 'aws-amplify'
import { appColor, bronzeFeather, platinumFeather, goldFeather, almostWhite } from '../../../Styles/styles'
import { connect } from 'react-redux'
import { getDistance } from '../../Functions/functions.js'

const { height, width } = Dimensions.get('window')
START_FILTER = "restaurant"

class Filters extends React.Component {

    render() {
        return (
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                alwaysBounceHorizontal={false}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                    <TouchableOpacity
                        style={{ width: 120, minHeight: 35, borderBottomWidth: 2, borderColor: this.props.filter === "restaurant" ? appColor : "white", alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.props.updateFilter("restaurant")}
                    >
                        <Text style={{ fontWeight: "500", color: this.props.filter === "restaurant" ? appColor : "#D1D1D1" }}>Restaurant</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                    <TouchableOpacity
                        style={{ width: 120, minHeight: 35, borderBottomWidth: 2, borderColor: this.props.filter === "coffee_and_tea" ? appColor : "white", alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.props.updateFilter("coffee_and_tea")}
                    >
                        <Text style={{ fontWeight: "500", color: this.props.filter === "coffee_and_tea" ? appColor : "#D1D1D1" }}>Coffee & Tea</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                    <TouchableOpacity
                        style={{ width: 120, minHeight: 35, borderBottomWidth: 2, borderColor: this.props.filter === "nightlife" ? appColor : "white", alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.props.updateFilter("nightlife")}
                    >
                        <Text style={{ fontWeight: "500", color: this.props.filter === "nightlife" ? appColor : "#D1D1D1" }}>Nightlife</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                    <TouchableOpacity
                        style={{ width: 120, minHeight: 35, borderBottomWidth: 2, borderColor: this.props.filter === "nature" ? appColor : "white", alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.props.updateFilter("nature")}
                    >
                        <Text style={{ fontWeight: "500", color: this.props.filter === "nature" ? appColor : "#D1D1D1" }}>Nature</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                    <TouchableOpacity
                        style={{ width: 120, minHeight: 35, borderBottomWidth: 2, borderColor: this.props.filter === "culture" ? appColor : "white", alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.props.updateFilter("culture")}
                    >
                        <Text style={{ fontWeight: "500", color: this.props.filter === "culture" ? appColor : "#D1D1D1" }}>Culture</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
                    <TouchableOpacity
                        style={{ width: 120, minHeight: 35, borderBottomWidth: 2, borderColor: this.props.filter === "likes" ? appColor : "white", alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.props.updateFilter("likes")}
                    >
                        <Text style={{ fontWeight: "500", color: this.props.filter === "likes" ? appColor : "#D1D1D1" }}>My likes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }

}

export class Tags extends React.Component {

    getTag(item, index) {
        return (
            <View
                style={styles.tag}
                key={index}
            >
                <Text style={{ color: "#8A8A8A" }}>{item}</Text>
            </View>
        )
    }

    _displayPriceRange() {
        let i = -1
        let priceRange = parseInt(this.props.place.price_level)
        let ret = []
        console.log(priceRange)
        if (priceRange > 0) {
            while (++i < priceRange) {
                ret.push(<Text style={{color: "#8A8A8A"}}>$</Text>)
            }
            while (i < 4) {
                ret.push(<Text style={{color: "#CCCCCC"}}>$</Text>)
                i++;
            }
        }
        return ret;
    }

    render() {
        let distance = getDistance(this.props.place.geoJson.coordinates[1], this.props.place.geoJson.coordinates[0], this.props.userLocation.latitude, this.props.userLocation.longitude)
        return (
            <ScrollView
                horizontal={true}
                alwaysBounceHorizontal={false}
                showsHorizontalScrollIndicator={false}
                style={{ marginRight: 10 }}
                contentContainerStyle={{alignItems: 'center'}}
            >
                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 18, marginRight: 10}}>
                    <Image
                    source={require('../../../Images/location_gray.png')}
                    style={{width: 9.33, height: 11.67, marginRight: 5}}
                    />
                    <Text style={{color: "#8A8A8A"}}>{distance.toFixed(1)}mi away</Text>
                </View>
                <View style={{flexDirection: "row"}}>
                    {
                        this._displayPriceRange()
                    }
                </View>
                {
                    this.props.tags.map((item, index) => this.getTag(item, index))
                }
            </ScrollView>
        )
    }

}

export class Photos extends React.Component {

    render() {
        return (
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {
                    this.props.photos.map((item, index) => {
                        return (
                            <Image
                                key={index}
                                source={{ url: item }}
                                style={{ width: 375, height: 425, marginRight: 10 }}
                            />
                        )
                    })
                }
            </ScrollView>
        )
    }

}

export class IsOpen extends React.Component {

    render() {
        return this.props.isOpen ?
            <Text style={{ fontWeight: "600", color: "#219653" }}>
                Open now
            </Text>
            :
            <Text style={{ fontWeight: "600", color: "red" }}>
                Closed
            </Text>
    }

}

export class SuggestedByAndLike extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLiked: this.props.user.places_liked.indexOf(this.props.place.rangeKey) >= 0,
            likes_count: this.props.place.likes_count ? this.props.place.likes_count : 0
        }
    }

    _getLikeButton = () => {
        if (this.state.isLiked) {
            return require("../../../Images/like_button_full.png")
        } else {
            return require("../../../Images/like_button_empty.png")
        }
    }

    _onPlaceLiked = () => {

        let apiName = "Openclique"
        let path = "/recommendations/" + this.props.user.username + "/like"
        let myInit = {
            body: {
                place: this.props.place,
                user: this.props.user
            }
        }

        API.post(apiName, path, myInit)
            .then(response => {
                console.log(response)
                let action = {
                    type: 'UPDATE_USER',
                    value: {
                        full: true,
                        user: response
                    }
                }
                this.props.dispatch(action)
            })
            .catch(error => {
                console.log("Error when liking the recommendation")
                console.log(error)
            })

        // Create like interaction backend button

        this.setState({
            ...this.state,
            isLiked: !this.state.isLiked,
            likes_count: this.state.isLiked ? this.state.likes_count - 1 : this.state.likes_count + 1
        }, () => this.props.refreshGlobalRecommendations(!this.state.isLiked))
    }

    render() {
        let place = this.props.place
        return (
            <View style={{ flexDirection: "row", flex: 1, margin: 10, alignItems: 'center' }}>
                <View style={{ flex: 2 }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontWeight: "600" }}>Suggested by </Text>
                        <Text style={{ fontWeight: "600", color: appColor }}>{place.suggested_by ? place.suggested_by : "Openclique"}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <View style={{alignItems: 'flex-end'}}>
                        <TouchableOpacity
                            onPress={this._onPlaceLiked}
                            style={{marginBottom: 10}}
                        >
                            <Image
                                source={this._getLikeButton(place)}
                                style={{ width: 20, height: 17.92 }}
                            />
                        </TouchableOpacity>
                        <Text style={{color: "#8A8A8A"}}>{this.state.likes_count} likes</Text>
                    </View>
                </View>
            </View>
        )
    }

}

export class PlaceInformations extends React.Component {

    // props:
    //      place         -- Suggested place

    // isCurrentlyOpen = () => {
    //     let currentDate = new Date(Date.now())
    //     for (var timeframe of this.props.place.opening_hours.timeframes) {
    //         let index = timeframe.days.indexOf(currentDate.getDay())
    //         if (index >= 0) {
    //             let currentHours = currentDate.getHours()
    //             if (currentHours.toString().length === 1)
    //                 currentHours = "0" + currentHours
    //             let currentMinutes = currentDate.getMinutes()
    //             if (currentMinutes.toString().length === 1)
    //                 currentMinutes = "0" + currentMinutes
    //             let current = currentHours.toString() + currentMinutes.toString()
    //             if (timeframe.open.length > 0) {
    //                 let max = timeframe.open.length
    //                 let i = -1;
    //                 while (++i < max) {
    //                     if ((parseInt(current) >= parseInt(timeframe.open[i].start))
    //                         && (parseInt(current) < parseInt(timeframe.open[i].end))) {
    //                         return true;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return false;
    // }

    render() {
        let place = this.props.place
        return (
            <View>
                <View style={{ flexDirection: "row", alignItems: 'center' }}>
                    <Image
                        source={require("../../../Images/location_red.png")}
                        style={{ height: 14, width: 10, marginRight: 5 }}
                    />
                    <Text style={{ fontWeight: "500", margin: 7 }}>{place.address}</Text>
                </View>
                <View style={{ marginTop: 10, marginBottom: 10 }}>
                    <IsOpen
                        isOpen={place.is_open}
                    />
                    <OpeningHours
                        hours={place.opening_hours}
                    />
                </View>
            </View>
        )
    }

}

export class OpeningHours extends React.Component {

    //      props:
    //          hours           -- Place opening hours

    getDay(index) {
        switch (index) {
            case 0:
                return "Mon"
            case 1:
                return "Tue"
            case 2:
                return "Wed"
            case 3:
                return "Thu"
            case 4:
                return "Fri"
            case 5:
                return "Sat"
            case 6:
                return "Sun"
        }
    }

    split_at_index(value, index) {
        return [value.substring(0, index), value.substring(index)];
    }

    render() {
        console.log(this.props.hours)
        return (
            this.props.hours.map((item, index) => {
                if (item.open && item.close) {
                    let open_hours = this.split_at_index(item.open.time, 2)
                    let close_hours = this.split_at_index(item.close.time, 2)
                    return (
                        <View
                            style={{ flexDirection: "row", width: "100%" }}
                            key={index}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: "600" }}>{this.getDay(item.open.day) + ":"}</Text>
                            </View>
                            <View style={{ flex: 6 }}>
                                <Text key={index}>{open_hours[0] + "h" + open_hours[1] + " - " + close_hours[0] + "h" + close_hours[1]}</Text>
                            </View>
                        </View>
                    )
                } else return null
            })
        )
    }

}

export class Flames extends React.Component {

    displayFlames() {
        let ret = []
        let i = -1;
        while (++i < this.props.flames) {
            ret.push(
                <Image
                    key={i}
                    source={require("../../../Images/Flames/new_flame.png")}
                    style={{ width: 13, height: 18, margin: 3 }}
                />
            )
        }
        while (i++ < 5) {
            ret.push(
                <Image
                    key={i}
                    source={require("../../../Images/Flames/empty_flame.png")}
                    style={{ width: 13, height: 18, margin: 3 }}
                />
            )
        }
        return ret.map(item => item)
    }

    render() {
        return (
            <TouchableOpacity
                style={{ flexDirection: "row" }}
                onPress={() => this.props.onPress()}
            >
                {this.displayFlames()}
            </TouchableOpacity>
        )
    }

}

export class PopularTimes extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            // 0: Sunday - 6: Saturday
            day_of_week: this._getDayOfWeek(),
            hour_of_day: this._getHourOfDay(),
            days_list: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            hours: [{ "hour": 0, "moment": "a" }, { "hour": 1, "moment": "a" }, { "hour": 2, "moment": "a" }, { "hour": 3, "moment": "a" }, { "hour": 4, "moment": "a" }, { "hour": 5, "moment": "a" }, { "hour": 6, "moment": "a" }, { "hour": 7, "moment": "a" }, { "hour": 8, "moment": "a" }, { "hour": 9, "moment": "a" }, { "hour": 10, "moment": "a" }, { "hour": 11, "moment": "a" }, {"hour": 12, "moment": "p"}, { "hour": 1, "moment": "p" }, { "hour": 2, "moment": "p" }, { "hour": 3, "moment": "p" }, { "hour": 4, "moment": "p" }, { "hour": 5, "moment": "p" }, { "hour": 6, "moment": "p" }, { "hour": 7, "moment": "p" }, { "hour": 8, "moment": "p" }, { "hour": 9, "moment": "p" }, { "hour": 10, "moment": "p" }, { "hour": 11, "moment": "p" }]
        }
    }

    _getDayOfWeek = () => {
        let date = new Date(Date.now())
        let day = date.getDay()
        if (day === 0) {
            return 6
        } else {
            return day - 1
        }
    }

    _getHourOfDay = () => {
        let date = new Date(Date.now())
        let hour = date.getHours()
        return hour
    }

    _compareHours = (hour_obj) => {
        let h1 = this.state.hour_of_day
        let h2 = hour_obj["moment"] == "a" ? hour_obj["hour"] : hour_obj["hour"] + 12
        return h1 === h2
    }

    render() {
        return (
            <View
                style={styles.popular_times_frame}
            >
                <View
                    style={{ flexDirection: "row", marginLeft: 15, marginRight: 15 }}
                >
                    {
                        this.state.days_list.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.day_button, {
                                        backgroundColor: this.state.day_of_week === index ? appColor : "#e6e6e6",
                                    }]}
                                    onPress={() => this.setState({ ...this.state, day_of_week: index })}
                                >
                                    <Text style={{ fontWeight: "600", color: this.state.day_of_week === index ? "white" : "black" }}>{item}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
                <View
                style={{width: "100%", height: 115, alignItems: 'center'}}
                >
                    <View
                    style={{width: "95%", height: 0.5, backgroundColor: "#b6b6b6", top: 15}}
                    />
                    <View
                    style={{width: "95%", height: 0.5, backgroundColor: "#b6b6b6", top: 48}}
                    />
                    <View
                    style={{width: "95%", height: 0.5, backgroundColor: "#b6b6b6", top: 81}}
                    />
                    <View style={{ flexDirection: "row", height: 115, alignItems: 'flex-end', justifyContent: 'space-evenly', maxWidth: "95%"}}>
                        {
                            this.props.populartimes[this.state.day_of_week]["data"].map((item, index) => {
                                return (
                                    <View
                                        key={index}
                                        style={{ height: item, backgroundColor: this._compareHours(this.state.hours[index]) ? "rgba(240, 84, 99, 1)" : "rgba(240, 84, 99, 0.5)", width: 13, marginHorizontal: 1, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}
                                    />
                                )
                            })
                        }
                    </View>
                </View>
                <View
                style={{height: 0.5, backgroundColor: "#b6b6b6", width: "95%"}}
                />
                <View
                style={{flexDirection: "row"}}
                >
                    {
                        this.state.hours.map((item, index) => {
                            if (index !== 0 && (index % 3) == 0) {
                                return (
                                    <View
                                    style={{minWidth: 13, margin: 1, alignItems: 'center'}}
                                    key={index}
                                    >
                                        <View
                                        style={{height: 6, width: 0.5, backgroundColor: "#b6b6b6", marginBottom: 4}}
                                        />
                                        <Text>
                                            {item.hour}{item.moment}
                                        </Text>
                                    </View>
                                )
                            } else {
                                if (index !== 0) {
                                    return (
                                        <View
                                        style={{minWidth: 13, margin: 1, alignItems: 'center'}}
                                        key={index}
                                        >
                                            <View
                                            style={{height: 3, width: 0.5, backgroundColor: "#b6b6b6"}}
                                            />
                                        </View>
                                    )
                                }
                            }
                        })
                    }
                </View>
            </View>
        )
    }
}

export class PlaceNameAndFlames extends React.Component {

    state = {
        flames: true,
    }

    onPress = () => {
        if (typeof(this.props.populartimes) === "object") {
            this.setState({
                ...this.state,
                flames: !this.state.flames
            })
        } else {
            alert("Sorry, we are still analyzing the most popular times for this place\n Try again later !")
        }
    }

    _getImage = () => {
        switch(this.props.type) {
            case "restaurant":
                return require("../../../Images/restaurant_image.png")
            case "coffee_and_tea":
                return require("../../../Images/coffee_and_tea_image.png")
            case "nightlife":
                return require("../../../Images/nightlife_image.png")
            case "nature":
                return require("../../../Images/nature_image.png")
            case "culture":
                return require("../../../Images/culture_image.png")
            case "likes":
                return require("../../../Images/likes_image.png")
        }
    }

    render() {
        return (
            <View>
                <View style={{ flexDirection: 'row', margin: 7, marginVertical: 15, alignItems: 'center' }}>
                    <View style={{ flex: 2, alignItems: 'center', flexDirection: "row"}}>
                        <Image
                        source={this._getImage()}
                        style={{width: this.props.type === "coffee_and_tea" ? 45 : 39, height: this.props.type === "coffee_and_tea" ? 54 : 41, marginRight: 10}}
                        />
                        <Text style={styles.title}>{this.props.name}</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Flames
                            flames={this.props.flames}
                            onPress={this.onPress}
                        />
                    </View>
                </View>
                {
                    !this.state.flames
                    &&
                    <PopularTimes
                        populartimes={this.props.populartimes}
                        onPress={this.onPress}
                    />
                }
            </View>
        )
    }
}

export class PlacesSuggested extends React.Component {

    // props:
    //      places          -- List of places suggested for current filter

    state = {
        fetchedCount: 0,
        mediasIndex: 0,
        fetchBatch: 5,
        isOpen: [],
        currentList: [],
    }

    componentDidMount() {
        this._fetchMoreItems(null)
    }

    _fetchMoreItems = (callback) => {

        // That function is called when the user reaches the bottom of the flat list
        // Improvements:
        //      - Store the currentList in AsyncStorage, so we don't have to fetch the API everytime

        let i = -1
        let list = this.state.currentList
        while (++i < this.state.fetchBatch) {
            let j = i + (this.state.fetchBatch * this.state.fetchedCount)
            if (this.props.places.length > 0 && this.props.places[j]) {
                list.push(this.props.places[j])
            }
        }

        this.setState({
            ...this.state,
            currentList: list,
            fetchedCount: this.state.fetchedCount + 1,
            updatingFilter: false
        }, callback != null ? () => callback() : null)

    }

    _updateList = () => {
        // Removes the old list, update the filter and create a new one
        // setState [here] -> fetchMoreItems [here] -> updateOldFilter [parent widget]
        this.setState({
            currentList: [],
            fetchedCount: 0,
            updatingFilter: true
        }, () => this._fetchMoreItems(this.props.updateOldFilter))
    }

    handleClickUrl = (url) => {
        let myUrl = "https://" + url
        Linking.canOpenURL(myUrl).then(supported => {
        if (supported) {
            Linking.openURL(url);
        } else {
            console.log("Don't know how to open URI: " + myUrl);
        }
    })};

    render() {

        // That is the way I found to be able to update the list when the filter changes
        // Maybe using Redux would be better for that tasks, sincec it would reduce the amount
        // of refresh of the page, as well as be cleaner than this workaround
        if (this.props.filter !== this.props.oldFilter && !this.state.updatingFilter)
            this._updateList()

        if (this.props.places && this.props.places.length > 0) {
            return (
                <FlatList
                    data={this.state.currentList}
                    style={{backgroundColor: "#EDF1F2"}}
                    refreshing={true}
                    scrollsToTop
                    onEndReachedThreshold={0.1}
                    onEndReached={() => this._fetchMoreItems()}
                    keyExtractor={(item) => "item_" + item.rangeKey}
                    renderItem={(item) => {
                        let place = item.item
                        return (
                            <View style={{ margin: 10, borderRadius: 15, backgroundColor: "white" }}>
                                <PlaceNameAndFlames
                                    name={place.name}
                                    populartimes={place.populartimes}
                                    flames={place.flames}
                                    type={place.type}
                                />
                                <Photos
                                    photos={place.photos}
                                    index={this.state.mediasIndex}
                                />
                                <Tags
                                    place={place}
                                    tags={place.tags}
                                    userLocation={this.props.user.currentLocation}
                                />
                                <View
                                    style={{width: "100%", height: 0.5, backgroundColor: "#DADADA"}}
                                />
                                <SuggestedByAndLike
                                    place={place}
                                    user={this.props.user.info}
                                    dispatch={this.props.dispatch}
                                    refreshGlobalRecommendations={(boolean) => { this.props.refreshGlobalRecommendations(boolean, () => this._updateList()) }}
                                />
                                <TouchableOpacity
                                    onPress={() => this.setState({ ...this.state, isOpen: this.state.isOpen.indexOf(place) >= 0 ? this.state.isOpen.filter(item => item !== place) : [...this.state.isOpen, place] })}
                                    style={{ flexDirection: "row", alignItems: 'center', marginLeft: 10, marginBottom: 20}}
                                >
                                    <Text style={{ fontWeight: "600" }}>More</Text>
                                    <Image
                                        source={require('../../../Images/back_icon_black.png')}
                                        style={{ width: 16, height: 10, marginLeft: 5, transform: this.state.isOpen.indexOf(place) >= 0 ? [{ rotate: "180deg" }] : [] }}
                                    />
                                </TouchableOpacity>
                                {
                                    this.state.isOpen.indexOf(place) >= 0 ?
                                        <View style={{ margin: 10 }}>
                                            <PlaceInformations
                                                place={place}
                                            />
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    source={require("../../../Images/flux_image.png")}
                                                    style={{ height: 15, width: 15, marginRight: 5 }}
                                                />

                                                <TouchableOpacity
                                                onPress={() => this.handleClickUrl("https://" + place.website)}
                                                >
                                                    <Text style={{ color: appColor, fontWeight: "500" }}>{place.website}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        :
                                        null
                                }
                            </View>
                        )
                    }
                    }
                />
            )
        } else {
            return null
        }
    }

}

class Suggestions extends React.Component {

    render() {
        return (
            <PlacesSuggested
                filter={this.props.filter}
                oldFilter={this.props.oldFilter}
                places={this.props.suggestions}
                user={this.props.user}
                dispatch={this.props.dispatch}
                updateOldFilter={this.props.updateOldFilter}
                refreshGlobalRecommendations={this.props.refreshGlobalRecommendations}
            />
        )
    }

}

class Frame extends React.Component {

    state = {
        currentDate: Date.now(),
        refreshDate: this.makeRefreshDate(),
        filter: START_FILTER,
        oldFilter: START_FILTER,
        suggestions: this.props.globalSuggestions[START_FILTER]
    }

    makeRefreshDate() {
        // Creating a Date object
        let date = new Date(Date.now())

        // Setting the hours to 23h59m59s
        date.setHours(23, 59, 59)

        // Getting the day of the month (1 - 31)
        let day_of_month = date.getDate()

        // Getting the day of the month (Sun: 0, Sat: 6)
        let day_of_week = date.getDay()
        let diff_before_sunday = 7 - day_of_week

        // Updating the date to make it be Sunday of current week
        date.setDate(day_of_month + diff_before_sunday)
        return Date.parse(date)
    }

    formatDate() {
        let ms = this.state.refreshDate - this.state.currentDate
        let days = Math.floor(ms / (24 * 60 * 60 * 1000));
        let daysms = ms % (24 * 60 * 60 * 1000);
        let hours = Math.floor((daysms) / (60 * 60 * 1000));
        let hoursms = ms % (60 * 60 * 1000);
        let minutes = Math.floor((hoursms) / (60 * 1000));
        let minutesms = ms % (60 * 1000);
        let sec = Math.floor((minutesms) / (1000));
        return days + "d:" + hours + "h:" + minutes + "m:" + sec + "s";
    }

    updateFilter = (newFilter) => {
        this.setState({ ...this.state, filter: newFilter, oldFilter: this.state.filter, suggestions: this.props.globalSuggestions[newFilter] })
    }

    updateOldFilter = () => {
        this.setState({ ...this.state, oldFilter: this.state.filter })
    }

    refreshGlobalRecommendations = (boolean, callback) => {
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
                console.log(response[this.state.filter])

                let action = {
                    type: 'UPDATE_SUGGESTIONS',
                    value: {
                        suggestions: response
                    }
                }

                this.props.dispatch(action)
                this.setState({
                    ...this.state,
                    suggestions: response[this.state.filter]
                }, () => callback())

                if (!boolean)
                    alert('You liked this place !\nYou can now find it in the section "My likes".')
                else
                    alert('You unliked this place !\nYou can now find it in its original section.')
            })
            .catch(error => {
                console.log("[PLACES/NEARBYSEARCH] ERROR:")
                console.log(error.response)
            })
    }

    componentDidMount() {
        setInterval(() => this.setState({ ...this.state, currentDate: Date.now() }), 1000)
    }

    render() {

        return (
            <SafeAreaView
                style={{ flex: 1 }}
            >
                <View
                    style={{ flex: 1, backgroundColor: 'white' }}
                >
                    <View style={{ padding: 10, backgroundColor: "white", paddingBottom: 0, paddingTop: 0 }}>
                        <View style={{ alignItems: 'center', marginVertical: 10, flexDirection: "row" }}>
                            <View style={{flexDirection: "row", alignItems: 'center', flex: 1, justifyContent: "flex-start"}}>
                                <Image
                                source={require('../../../Images/logo_red.png')}
                                style={{ width: 20, height: 21, marginRight: 10 }}
                                />
                                <Text style={{fontWeight: "400", color: appColor, fontSize: 18}}>openclique</Text>
                            </View>
                            <View
                            style={{flex: 1, alignItems: "flex-end"}}
                            >
                                <Text style={{ color: appColor, fontWeight: "600" }}>{this.formatDate()}</Text>
                            </View>
                        </View>
                        <Filters
                            filter={this.state.filter}
                            updateFilter={this.updateFilter}
                        />
                    </View>
                    <Suggestions
                        refreshGlobalRecommendations={this.refreshGlobalRecommendations}
                        suggestions={this.state.suggestions}
                        filter={this.state.filter}
                        oldFilter={this.state.oldFilter}
                        user={this.props.user}
                        dispatch={this.props.dispatch}
                        updateOldFilter={this.updateOldFilter}
                    />
                </View>
            </SafeAreaView>
        )

    }

}

const styles = StyleSheet.create({
    title: {
        fontWeight: "500",
        fontSize: 20
    },
    medias: {
        height: 375,
        width: "100%",
        backgroundColor: "lightgray"
    },
    tag: {
        minHeight: 35,
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    popular_times_frame: {
        minHeight: 175,
        width: "100%",
        borderRadius: 5,
        alignItems: 'center'
    },
    day_button: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 6
    }
})

const mapStateToProps = state => {
    return {
        user: state.user,
        globalSuggestions: state.globalSuggestions
    }
}

export default connect(mapStateToProps)(Frame);