import React from 'react'
import { View, Text, TouchableOpacity, Dimensions, Image, ScrollView, StyleSheet, TextInput, SafeAreaView, FlatList } from 'react-native'
import SlidingUpPanel from 'rn-sliding-up-panel'
import Amplify, { API, Storage } from 'aws-amplify'
import { appColor, bronzeFeather, platinumFeather, goldFeather, almostWhite } from '../../../Styles/styles'
import { connect } from 'react-redux'
import { LineChart } from "react-native-chart-kit";

const { height, width } = Dimensions.get('window')

class Filters extends React.Component {

    render() {
        return (
            <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            >
                <View style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
                    <TouchableOpacity
                    style={{minHeight: 35, margin: 7, borderWidth: 0.5, borderColor: "black", borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.filter === "restaurant" ? "black" : "white"}}
                    onPress={() => this.props.updateFilter("restaurant")}
                    >
                        <Text style={{fontWeight: "500", margin: 10, color: this.props.filter === "restaurant" ? "white" : "black"}}>Restaurant</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
                    <TouchableOpacity
                    style={{minHeight: 35, margin: 7, borderWidth: 0.5, borderColor: "black", borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.filter === "coffee_and_tea" ? "black" : "white"}}
                    onPress={() => this.props.updateFilter("coffee_and_tea")}
                    >
                        <Text style={{fontWeight: "500", margin: 10, color: this.props.filter === "coffee_and_tea" ? "white" : "black"}}>Coffee & Tea</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
                    <TouchableOpacity
                    style={{minHeight: 35, margin: 7, borderWidth: 0.5, borderColor: "black", borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.filter === "nightlife" ? "black" : "white"}}
                    onPress={() => this.props.updateFilter("nightlife")}
                    >
                        <Text style={{fontWeight: "500", margin: 10, color: this.props.filter === "nightlife" ? "white" : "black"}}>Nightlife</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
                    <TouchableOpacity
                    style={{minHeight: 35, margin: 7, borderWidth: 0.5, borderColor: "black", borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.filter === "nature" ? "black" : "white"}}
                    onPress={() => this.props.updateFilter("nature")}
                    >
                        <Text style={{fontWeight: "500", margin: 10, color: this.props.filter === "nature" ? "white" : "black"}}>Nature</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
                    <TouchableOpacity
                    style={{minHeight: 35, margin: 7, borderWidth: 0.5, borderColor: "black", borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.filter === "culture" ? "black" : "white"}}
                    onPress={() => this.props.updateFilter("culture")}
                    >
                        <Text style={{fontWeight: "500", margin: 10, color: this.props.filter === "culture" ? "white" : "black"}}>Culture</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
                    <TouchableOpacity
                    style={{minHeight: 35, margin: 7, borderWidth: 0.5, borderColor: "black", borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: this.props.filter === "likes" ? "black" : "white"}}
                    onPress={() => this.props.updateFilter("likes")}
                    >
                        <Text style={{fontWeight: "500", margin: 10, color: this.props.filter === "likes" ? "white" : appColor}}>My likes</Text>
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
                <Text style={{fontWeight: "600"}}>{item}</Text>
            </View>
        )
    }

    render() {
        return (
            <ScrollView
            horizontal={true}
            alwaysBounceHorizontal={false}
            showsHorizontalScrollIndicator={false}
            style={{marginRight: 10}}
            >
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
            style={{backgroundColor: "#rgba(128,128,128,0.2)", borderRadius: 5}}
            >
                {
                    this.props.photos.map((item, index) => {
                        return (
                            <Image
                            key={index}
                            source={{url: item}}
                            style={{width: 375, height: 425, marginTop: 20, marginBottom: 20, marginLeft: 10, marginRight: 10, borderRadius: 10}}
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
            <Text style={{fontWeight: "600", color: "#219653"}}>
                Open now
            </Text>
        :
            <Text style={{fontWeight: "600", color: "red"}}>
                Closed
            </Text>
    }

}

export class SuggestedByAndLike extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLiked: this.props.user.places_liked.indexOf(this.props.place.rangeKey) >= 0
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
            isLiked: !this.state.isLiked
        })
    }

    render () {
        let place = this.props.place
        return (
            <View style={{flexDirection: "row", flex: 1, margin: 10}}>
                <View style={{flex: 2}}>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{fontWeight: "600"}}>Suggested by </Text>
                        <Text style={{fontWeight: "600", color: appColor}}>{place.suggested_by ? place.suggested_by : "Openclique"}</Text>
                    </View>
                </View>
                <View style={{flex: 1, alignItems: "flex-end"}}>
                    <TouchableOpacity
                    onPress={this._onPlaceLiked}
                    >
                        <Image
                        source={this._getLikeButton(place)}
                        style={{width: 20, height: 17.92}}
                        />
                    </TouchableOpacity>
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
                <View style={{flexDirection: "row", alignItems: 'center'}}>
                    <Image
                    source={require("../../../Images/location_red.png")}
                    style={{height: 14, width: 10, marginRight: 5}}
                    />
                    <Text style={{fontWeight: "500", margin: 7}}>{place.address}</Text>
                </View>
                <View style={{marginTop: 10, marginBottom: 10}}>
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
                            style={{flexDirection: "row", width: "100%"}}
                            key={index}
                            >
                                <View style={{flex: 1}}>
                                    <Text style={{fontWeight: "600"}}>{this.getDay(item.open.day) + ":"}</Text>
                                </View>
                                <View style={{flex: 6}}>
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

    state = {
        clicked: false
    }

    displayFlames() {
        let ret = []
        let i = -1;
        while (++i < this.props.flames) {
            ret.push(
                <Image
                key={i}
                source={require("../../../Images/Flames/new_flame.png")}
                style={{width: 14.55, height: 20, margin: 3}}
                />
            )
        }
        return ret.map(item => item)
    }

    displayChart() {
        return (
            <View>
                <Text>Coucou</Text>
            </View>
            // <LineChart
            //     data={{
            //     labels: ["January", "February", "March", "April", "May", "June"],
            //     datasets: [
            //         {
            //         data: [
            //             Math.random() * 100,
            //             Math.random() * 100,
            //             Math.random() * 100,
            //             Math.random() * 100,
            //             Math.random() * 100,
            //             Math.random() * 100
            //         ]
            //         }
            //     ]
            //     }}
            //     width={Dimensions.get("window").width} // from react-native
            //     height={220}
            //     yAxisLabel="$"
            //     yAxisSuffix="k"
            //     // yAxisInterval={1} // optional, defaults to 1
            //     chartConfig={{
            //         backgroundColor: "#e26a00",
            //         // backgroundGradientFrom: "#fb8c00",
            //         // backgroundGradientTo: "#ffa726",
            //         // decimalPlaces: 2, // optional, defaults to 2dp
            //         color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            //         labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            //         style: {
            //             borderRadius: 16
            //         },
            //         propsForDots: {
            //             r: "6",
            //             strokeWidth: "2",
            //             stroke: "#ffa726"
            //         }
            //     }}
            //     // bezier
            //     // style={{
            //     //     marginVertical: 8,
            //     //     borderRadius: 16
            //     // }}
            // />
        )
    }

    render() {
        return (
            <TouchableOpacity
            style={{flexDirection: "row"}}
            onPress={() => this.setState({ ...this.state, clicked: !this.state.clicked })}
            >
                {
                    !this.state.clicked ? 
                        this.displayFlames()
                    :
                        this.displayFlames()//this.displayChart()
                }
            </TouchableOpacity>
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
        this.setState({
            currentList: [],
            fetchedCount: 0,
            updatingFilter: true
        }, () => this._fetchMoreItems(this.props.updateOldFilter))
    }

    render() {
        if (this.props.filter !== this.props.oldFilter && !this.state.updatingFilter)
            this._updateList()
        if (this.props.places && this.props.places.length > 0) {
            return (
                <FlatList
                    data={this.state.currentList}
                    refreshing={true}
                    scrollsToTop
                    onEndReachedThreshold={0.1}
                    onEndReached={() => this._fetchMoreItems()}
                    keyExtractor={(item) => "item_" + item.rangeKey}
                    renderItem={(item) => {
                        let place = item.item
                        return (
                            <View style={{marginBottom: 25}}>
                                <View style={{flexDirection: 'row', margin: 7}}>
                                    <View style={{flex: 2, alignItems: 'flex-start'}}>
                                        <Text style={styles.title}>{place.name}</Text>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                                        <Flames
                                        flames={3}
                                        />
                                    </View>
                                </View>
                                <Photos
                                photos={place.photos}
                                index={this.state.mediasIndex}
                                />
                                <SuggestedByAndLike
                                place={place}
                                user={this.props.user.info}
                                dispatch={this.props.dispatch}
                                />
                                <Tags
                                tags={place.tags}
                                />
                                <TouchableOpacity
                                onPress={() => this.setState({ ...this.state, isOpen: this.state.isOpen.indexOf(place) >= 0 ? this.state.isOpen.filter(item => item !== place) : [...this.state.isOpen, place] })}
                                style={{flexDirection: "row", alignItems: 'center', margin: 7}}
                                >
                                    <Text style={{fontWeight: "600"}}>More</Text>
                                    <Image
                                    source={require('../../../Images/back_icon_black.png')}
                                    style={{width: 16, height: 10, marginLeft: 5, transform: this.state.isOpen.indexOf(place) >= 0 ? [{ rotate: "180deg" }] : []}}
                                    />
                                </TouchableOpacity>
                                {
                                    this.state.isOpen.indexOf(place) >= 0 ?
                                        <View style={{margin: 10}}>
                                            <PlaceInformations
                                            place={place}
                                            />
                                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                <Image
                                                source={require("../../../Images/flux_image.png")}
                                                style={{height: 15, width: 15, marginRight: 5}}
                                                />
                                                <Text style={{color: appColor, fontWeight: "500"}}>{place.website}</Text>
                                            </View>
                                        </View>
                                    :
                                        null
                                }
                            </View>
                        )}
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
            />
        )
    }

}

class Frame extends React.Component {

    state = {
        currentDate: Date.now(),
        refreshDate: this.makeRefreshDate(),
        filter: "restaurant",
        oldFilter: "restaurant"
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
        let days = Math.floor(ms / (24*60*60*1000));
        let daysms=ms % (24*60*60*1000);
        let hours = Math.floor((daysms)/(60*60*1000));
        let hoursms=ms % (60*60*1000);
        let minutes = Math.floor((hoursms)/(60*1000));
        let minutesms=ms % (60*1000);
        let sec = Math.floor((minutesms)/(1000));
        return days+" days, "+hours+" hours, "+minutes+" minutes, "+sec+" seconds";
    }

    updateFilter = (newFilter) => {
        this.setState({ ...this.state, filter: newFilter, oldFilter: this.state.filter })
    }

    updateOldFilter = () => {
        this.setState({ ...this.state, oldFilter: this.state.filter })
    }

    componentDidMount() {
        setInterval(() => this.setState({ ...this.state, currentDate: Date.now() }), 1000)
    }

    render() {
        
        return (
            <SafeAreaView
            style={{flex: 1}}
            >
                <View
                style={{flex: 1, backgroundColor: 'white'}}
                >
                    <View style={{padding: 10, backgroundColor: "white", paddingBottom: 0, paddingTop: 0}}>
                        <View style={{alignItems: 'center', marginBottom: 10}}>
                            <Text style={styles.title}>Los Angeles</Text>
                            <Text style={{margin: 5}}>New recommendations in</Text>
                            <Text style={{color: appColor, fontWeight: "600"}}>{this.formatDate()}</Text>
                        </View>
                        <Filters
                        filter={this.state.filter}
                        updateFilter={this.updateFilter}
                        />
                    </View>
                    <Suggestions
                    suggestions={this.props.globalSuggestions[this.state.filter]}
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
        fontWeight: "600",
        fontSize: 20
    },
    medias: {
        height: 375,
        width: "100%",
        backgroundColor: "lightgray"
    },
    tag: {
        minHeight: 35,
        borderRadius: 15,
        padding: 10,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5
    }
})

const mapStateToProps = state => {
    return {
        user: state.user,
        globalSuggestions: state.globalSuggestions
    }
}

export default connect(mapStateToProps)(Frame);