import React from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, TextInput, Image, ScrollView } from 'react-native'
import { appColor, almostWhite } from '../../Styles/styles';
import { API } from 'aws-amplify'
import { findPlacesByName } from '../../API/Places';
import { ActivityIndicator } from 'react-native';
import { parseTypes } from '../Functions/functions'
import { connect } from 'react-redux'

class SuggestReport extends React.Component {

    state = {
        add_tag: false,
        sentSuggestion: false,
        fetched_places: [],
        searching_places: false,
        picked_place: false,
        place: {
            name: "",
            address: "",
            id: "",
            icon: "",
            types: []
        },
        tags_selected: [],
        other_tags: [],
        other_tag_entry: "",
        tags: []
    }

    canSubmit = () => {
        if (!this.state.add_tag) {
            return (this.state.place.name.length > 0 && this.state.place.address.length > 0 && this.state.place.id.length > 0)
        } else {
            const total = this.state.tags_selected.length + this.state.other_tags.length
            return total >= 3
        }
    }

    _fetchTags = async () => {
        let apiName = 'Openclique';
        let path = '/tags'
        let myInit = {}

        let response = await API.get(apiName, path, myInit)
        console.log("\n\n\n\n\n[SUGGEST REPORT] Got a response:")
        console.log(response.body)
        this.setState({
            ...this.state,
            tags: response.body
        })
    }

    componentDidMount() {

        this._fetchTags()

    }

    sendSuggestion = async () => {

        if (this.canSubmit()) {

            this.setState({
                ...this.state,
                loading: true
            })

            let apiName = 'Openclique';
            let path = '/places'
            let myInit = {
                body: {
                    "place": this.state.place,
                    "tags_selected": this.state.tags_selected,
                    "other_tags_selected": this.state.other_tags,
                    "username": this.props.user.info.username
                }
            }
            try {

                await API.post(apiName, path, myInit)
                this.setState({ ...this.state, sentSuggestion: true, loading: false })

            } catch(e) {

                // We need to log this somewhere, so we can figure out what happened easily

                alert("Sorry, an error has occured. Please try again.\nIf this keeps happening, please contact us.")
                this.setState({ ...this.state, sentSuggestion: false, loading: false })

            }
        } else {
            alert("You need to fill all the fields before submitting")
        }

    }

    goToAddTag = () => {
        if (this.canSubmit()) {
            this.setState({ ...this.state, add_tag: true })
        }
    }

    _resetState = () => {
        this.setState({
            ...this.state,
            add_tag: false,
            sentSuggestion: false,
            fetched_places: [],
            searching_places: false,
            picked_place: false,
            place: {
                name: "",
                address: "",
                id: "",
                icon: "",
                types: []
            },
            tags_selected: []
        })
    }

    findPlaces = async () => {

        // That function used Google Places API to find places based on a text query
        // On success: fills the state with results
        // On failed: displays an error message

        this.setState({
            ...this.state,
            searching_places: true
        })

        let ret = await findPlacesByName(this.state.placeName)
        console.log(ret)
        if (ret.status === "OK") {
            let places = ret.results.map(item => {
                return ({
                    "id": item.place_id ? item.place_id : "",
                    "name": item.name ? item.name : "",
                    "address": item.formatted_address ? item.formatted_address : "",
                    "types": item.types ? item.types : [],
                    "icon": item.icon ? item.icon : "",
                    "place": item
                })
            })
            console.log(places)
            this.setState({
                ...this.state,
                searching_places: false,
                fetched_places: places
            })
        } else {
            this.setState({
                ...this.state,
                searching_places: false
            })
            alert("An error occured while fetching places. If this keeps happening please contact us at contact@openclique.org.")
        }

    }

    onPlacePicked = (place) => {
        this.setState({
            ...this.state,
            picked_place: true,
            place: place,
            fetched_places: []
        })
    }

    onTagSelected = (tag) => {
        this.setState({
            ...this.state,
            tags_selected: this.state.tags_selected.indexOf(tag) >= 0 ? this.state.tags_selected.filter(item => item !== tag) : [...this.state.tags_selected, tag]
        })
    }

    onOtherTagSelected = (tag) => {
        this.setState({
            ...this.state,
            other_tags: this.state.other_tags.indexOf(tag) >= 0 ? this.state.other_tags.filter(item => item !== tag) : [...this.state.other_tags, tag]
        })
    }

    otherTagExists = (tag) => {
        return this.state.other_tags.indexOf(tag) >= 0
    }

    onSubmitOtherTag = () => {
        this.setState({
            ...this.state,
            other_tags: [...this.state.other_tags, this.state.other_tag_entry],
            other_tag_entry: ""
        })
    }

    _displaySection() {
        let i = -1
        var ret = []
        let type = parseTypes(this.state.place.types)
        while (++i < this.state.tags.length) {
            if (this.state.tags[i].type.indexOf(type) >= 0) {
                let index = ret.findIndex(item => item.section_type === this.state.tags[i].category)
                if (index >= 0) {
                    if (ret[index].tags.indexOf(this.state.tags[i].name) < 0)
                        ret[index].tags = [...ret[index].tags, this.state.tags[i].name]
                } else {
                    ret.push({
                        section_type: this.state.tags[i].category,
                        tags: [this.state.tags[i].name]
                    })
                }
            }
        }

        return ret.map((item, index) =>
            <TagsSection
                key={index}
                section_type={item.section_type}
                tags={item.tags}
                onTagSelected={this.onTagSelected}
                tags_selected={this.state.tags_selected}
            />
        )
    }

    _getImage = (type) => {
        switch (type) {
            case "restaurant":
                return require("../../Images/restaurant_image.png")
            case "coffee_and_tea":
                return require("../../Images/coffee_and_tea_image.png")
            case "culture":
                return require("../../Images/culture_image.png")
            case "nightlife":
                return require("../../Images/nightlife_image.png")
            case "nature":
                return require("../../Images/nature_image.png")
        }
    }

    render() {
        console.log(this.state)
        if (this.state.sentSuggestion) {
            
            // That part of the code is the final pagee, once the user sent his suggestion

            return (
                <View
                style={{flex: 1, backgroundColor: "#EDF1F2"}}
                >
                    <SafeAreaView
                        style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}
                    >
                        <View style={{ flex: 9, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: appColor, fontWeight: "600", fontSize: 22, marginBottom: 8 }}>Thank you!</Text>
                            <Text style={{ fontSize: 14, fontWeight: "600", textAlign: 'center' }}>Your suggestion has been sent!</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                onPress={() => { this._resetState(); this.props.navigation.goBack() }}
                                style={{ width: 300, height: 50, borderRadius: 30, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: this.canSubmit() ? appColor : "#DADADA" }}
                            >
                                <Text style={{ color: "white", fontWeight: "600" }}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            )
        } else if (this.state.add_tag) {

            // Here is the second page, where the user needs to fill the tags describing the place he picked
            return (
                <View
                style={{flex: 1, backgroundColor: "#EDF1F2"}}
                >
                    <SafeAreaView
                        style={{ flex: 1 }}
                    >
                        <ScrollView>
                            <View style={{ flexDirection: "column" }}>
                                <View style={{flexDirection: "row"}}>
                                    <View style={{flex: 1, alignItems: "flex-start"}}>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ ...this.state, add_tag: false })}
                                            style={{ margin: 15}}
                                        >
                                            <Image
                                                source={require("../../Images/back_icon.png")}
                                                style={{ width: 16, height: 10, marginLeft: 5, transform: [{ rotate: "90deg" }] }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        <View>
                                            <Image
                                            source={require("../../Images/logo_red.png")}
                                            style={{width: 24, height: 25}}
                                            />
                                        </View>
                                    </View>
                                    <View
                                    style={{flex: 1, alignItems: "flex-end" }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.navigate("Settings")}
                                            style={{marginRight: 15}}
                                        >
                                            <Image
                                                source={require("../../Images/bug_settings_red.png")}
                                                style={{ width: 20, height: 20 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ alignSelf: "center", alignItems: 'center' }}>
                                    <Text style={{ fontWeight: "600", fontSize: 22, marginBottom: 5 }}>Describe {this.state.place.name}!</Text>
                                    <Text style={{ fontWeight: "300", fontSize: 14, color: appColor }}>Select at least 3 tags</Text>
                                </View>
                            </View>
                            {
                                this._displaySection()
                            }
                            <View style={{ marginBottom: 15, marginTop: 15, margin: 7 }}>
                                <Text style={{ fontWeight: "600", color: appColor }}>Other</Text>
                                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 7 }}>
                                    {
                                        this.state.other_tags.map((tag, index) => {
                                            return (
                                                <TouchableOpacity
                                                    style={{ alignItems: 'center', justifyContent: "center", borderRadius: 10, borderWidth: 0.5, margin: 5, backgroundColor: this.otherTagExists(tag) ? "black" : "white" }}
                                                    onPress={() => this.onOtherTagSelected(tag)}
                                                    key={index}
                                                >
                                                    <Text style={{ margin: 7, color: this.otherTagExists(tag) ? "white" : "black" }}>{tag}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                    <View
                                        style={{ alignItems: 'center', justifyContent: "center", borderRadius: 10, borderWidth: 0.5, margin: 5, borderColor: "gray" }}
                                    >
                                        <TextInput
                                        style={{margin: 7}}
                                        placeholder="+ Add"
                                        placeholderTextColor="gray"
                                        autoCorrect={false}
                                        onSubmitEditing={this.onSubmitOtherTag}
                                        value={this.state.other_tag_entry}
                                        onChangeText={(text) => this.setState({ ...this.state, other_tag_entry: text }) }
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={{ flex: 1, margin: 10 }}>
                                <TouchableOpacity
                                    onPress={() => this.sendSuggestion()}
                                    style={{ width: 300, height: 50, borderRadius: 30, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: this.canSubmit() ? appColor : "#DADADA" }}
                                >
                                    <Text style={{ color: "white", fontWeight: "600" }}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        {
                                this.state.loading
                            &&
                                <View style={styles.loading}>
                                    <ActivityIndicator size='large' color="white" />
                                </View>
                        }
                    </SafeAreaView>
                </View>
            )
        } else {

            // And that is the first page, where the user has to choose a place he wants to suggest
            let type = this.state.picked_place ? parseTypes(this.state.place.types) : ""
            return (
                <View
                style={{flex: 1, backgroundColor: "#EDF1F2"}}
                >
                    <SafeAreaView
                        style={{ flex: 1 }}
                    >
                        <View style={{ flex: 1, flexDirection: "row", alignItems: 'center' }}>
                            <View style={{flex: 1}}/>
                            <View style={{flex: 1, alignItems: 'center'}}>
                                <View>
                                    <Image
                                    source={require("../../Images/logo_red.png")}
                                    style={{width: 24, height: 25}}
                                    />
                                </View>
                            </View>
                            <View
                            style={{flex: 1, alignItems: "flex-end" }}
                            >
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate("Settings")}
                                    style={{marginRight: 15}}
                                >
                                    <Image
                                        source={require("../../Images/bug_settings_red.png")}
                                        style={{ width: 20, height: 20 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row", justifyContent: 'center', margin: 15, marginBottom: 50 }}>
                            <Text style={{ fontWeight: "600", fontSize: 20, textAlign: 'center'}}>Send us a suggestion about a place that you like, and <Text style={{ color: appColor }}>get featured on the app!</Text></Text>
                        </View>
                        <View style={{ flex: 1, margin: 10, alignItems: 'center'}}>
                            {
                                this.state.picked_place ?
                                    <View
                                    style={{ padding: 10, alignItems: 'center', backgroundColor: "white", margin: 5, borderRadius: 30, width: 300, flexDirection: 'row' }}
                                    >
                                        <TouchableOpacity
                                            style={{ position: "absolute", top: 10, right: 10 }}
                                            onPress={() => {
                                                this.setState({
                                                    ...this.state,
                                                    picked_place: false,
                                                    place: {
                                                        name: "",
                                                        address: "",
                                                        id: "",
                                                        icon: "",
                                                        types: []
                                                    }
                                                })
                                            }}
                                        >
                                            <Text>x</Text>
                                        </TouchableOpacity>
                                        <Image
                                            source={this._getImage(type)}
                                            style={{ width: type === "coffee_and_tea" ? 45 : 40, height: type === "coffee_and_tea" ? 54 : 42, marginHorizontal: 10 }}
                                        />
                                        <View
                                            style={{ alignItems: "flex-start", maxWidth: 220}}
                                        >
                                            <Text style={{ textAlign: 'center', fontWeight: "600", fontSize: 16 }}>{this.state.place.name}</Text>
                                            <Text style={{color: "#8A8A8A"}}>{this.state.place.address}</Text>
                                        </View>
                                    </View>
                                    :
                                    <TextInput
                                        autoCorrect={false}
                                        autoCapitalize={false}
                                        style={{ width: 300, height: 50, borderRadius: 30, padding: 7, marginTop: 10, marginBottom: 10, textAlign: "center", alignSelf: 'center', backgroundColor: "white"}}
                                        onChangeText={(text) => this.setState({ ...this.state, placeName: text })}
                                        onEndEditing={() => this.findPlaces()}
                                        placeholder="Name of place"
                                        placeholderTextColor="#999999"
                                    />
                            }
                        </View>
                        <View style={{ flex: 7 }}>
                            <PotentialPlaces
                                searching_places={this.state.searching_places}
                                places={this.state.fetched_places}
                                onPlacePicked={this.onPlacePicked}
                            />
                        </View>
                        <View style={{ flex: 1, marginTop: 10, marginBottom: 10}}>
                            <TouchableOpacity
                                onPress={() => this.goToAddTag()}
                                style={{ width: 300, height: 50, borderRadius: 30, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: this.canSubmit() ? appColor : "#DADADA" }}
                            >
                                <Text style={{ color: "white", fontWeight: "600", fontSize: 17 }}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </View>
            )
        }
    }
}

class TagsSection extends React.Component {

    // This component display one section type for the tags displayed to the user
    // For now we get the tags from the frontend, but we need to get them from the database
    // Props:
    //      section_type        <string>
    //      tags                <array>
    //      tags_selected       <array>
    //      onTagSelected       <Function>

    _tagExists = (tag) => {
        return this.props.tags_selected.indexOf(tag) >= 0
    }

    render() {
        return (
            <View style={{ marginBottom: 15, marginTop: 15, marginHorizontal: 15 }}>
                <Text style={{ fontWeight: "600", marginLeft: 5 }}>{this.props.section_type}</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 7 }}>
                    {
                        this.props.tags.map((tag, index) => {
                            return (
                                <TouchableOpacity
                                    style={{ alignItems: 'center', justifyContent: "center", borderRadius: 10, borderWidth: 0.5, margin: 5, backgroundColor: this._tagExists(tag) ? appColor : "white", borderColor: this._tagExists(tag) ? appColor : "black" }}
                                    onPress={() => this.props.onTagSelected(tag)}
                                    key={index}
                                >
                                    <Text style={{ margin: 7, color: this._tagExists(tag) ? "white" : "black" }}>{tag}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        )
    }

}

class PotentialPlaces extends React.Component {

    // This component displays the potential place the user will have to pick from
    // Props:
    //      searching_places    <bool>
    //      places              <array>
    //      onPlacePicked       <Function>

    // getImage = (types) => {
    //     console.log(parseTypes(types))
    //     return require('../../Images/MapIcons/Restaurant/restaurant.png')
    // }

    _getImage = (type) => {
        switch (type) {
            case "restaurant":
                return require("../../Images/restaurant_image.png")
            case "coffee_and_tea":
                return require("../../Images/coffee_and_tea_image.png")
            case "culture":
                return require("../../Images/culture_image.png")
            case "nightlife":
                return require("../../Images/nightlife_image.png")
            case "nature":
                return require("../../Images/nature_image.png")
        }
    }

    makePage = () => {
        if (this.props.searching_places) {
            return (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator
                        size="large"
                    />
                </View>
            )
        } else {
            return (
                <View
                style={{alignItems: 'center'}}
                >
                    {
                        this.props.places.map((place, index) => {
                            let type = parseTypes(place.types)
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={{ padding: 10, alignItems: 'center', backgroundColor: "white", margin: 5, borderRadius: 30, width: 300, flexDirection: 'row' }}
                                    onPress={() => this.props.onPlacePicked(place)}
                                >
                                    <Image
                                        source={this._getImage(type)}
                                        style={{ width: type === "coffee_and_tea" ? 45 : 40, height: type === "coffee_and_tea" ? 54 : 42, marginHorizontal: 10 }}
                                    />
                                    <View
                                        style={{ alignItems: "flex-start", maxWidth: 220}}
                                    >
                                        <Text style={{ fontWeight: "600", fontSize: 16 }}>{place.name}</Text>
                                        <Text style={{color: "#8A8A8A"}}>{place.address}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        )
                    }
                </View>
            )
        }
    }

    render() {
        let page = this.makePage()
        return (
            <>
                {
                    this.props.places.length > 0 ?
                        <Text
                            style={{ alignSelf: 'center', fontSize: 20, fontWeight: "600", marginBottom: 7 }}
                        >
                            Which one is it ?
                        </Text>
                        :
                        null
                }
                <ScrollView
                    alwaysBounceVertical={false}
                >
                    {page}
                </ScrollView>
            </>
        )
    }

}

const styles = {
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(0,0,0,0.8)"
      }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(SuggestReport)