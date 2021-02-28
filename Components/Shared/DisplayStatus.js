import React from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, ImageBackground, Image } from 'react-native'
import { Storage } from 'aws-amplify'

export default class DisplayStatus extends React.Component {

    state = {
        loading: true
    }

    async componentWillMount() {
        var params = this.props.navigation.state.params

        let url = await Storage.get(params.status.medias[0])
        this.setState({
            url: url,
            loading: false
        })
    }

    renderImage = (item) => {
        if (item === "bar" || item === "pub") {
            return (require('../../Images/MapIcons/Bar/bar.png'))
        }
        else if (item === "restaurant") {
            return (require('../../Images/MapIcons/Restaurant/restaurant.png'))
        } 
        else if (item === "nightclub") {
            return (require('../../Images/MapIcons/Club/club.png'))
        } else {
            return (require('../../Images/location_red.png'))
        }
    }

    getStyle = (item) => {
        if (item === "user_created") {
            return {width: 30, height: 40}
        } else return {}
    }

    render() {

        var params = this.props.navigation.state.params

        console.log(params)
        console.log(this.state)
        if (this.state.loading) {

            return (
                <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size="large"/>
                </SafeAreaView>
            )

        } else {

            return (
                <ImageBackground
                style={{flex: 1}}
                source={{uri: this.state.url}}
                >
                    <SafeAreaView style={{flex: 1}}>
                        <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        style={{flex: 1, alignItems: 'center', position: 'relative', height: '100%'}}
                        >
                            <View style={{alignItems: 'center', flex: 1}}>
                                <Image source={this.renderImage(params.status.place.type)} style={[{margin: 5}, this.getStyle(params.status.place.type)]}/>
                                <Text style={{margin: 5, backgroundColor: this.state.url.includes("undefined") ? null : 'rgba(0,0,0,0.1)'}}>{params.status.place.name}</Text>
                                {
                                    params.status.with.length === 0 ? null : 
                                    <View style={{margin: 5, backgroundColor: this.state.url.includes("undefined") ? null : 'rgba(0,0,0,0.1)', alignItems: 'center'}}>
                                        <Text>with</Text>
                                        {
                                            params.status.with.map((item, index) => (
                                                <Text key={index}>{item.username}</Text>
                                            ))
                                        }
                                    </View>
                                }
                            </View>
                            <View style={{flex: 1}}>
                                {
                                    params.status.description === '.' ? null : 
                                    <Text>{params.status.description}</Text>
                                }
                            </View>
                        </TouchableOpacity>
                    </SafeAreaView>
                </ImageBackground>
            )

        }
    }
}