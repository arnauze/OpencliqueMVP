import React from 'react'
import { StyleSheet, SafeAreaView, TouchableOpacity, Image, Text, View, ScrollView } from 'react-native'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { appColor } from '../../../Styles/styles'
import { Photos, Tags, Flames, PlaceInformations, SuggestedByAndLike } from './Frame'

export default class OpenCallout extends React.Component {

    /*
        This component is the callout that's being open when a user clicks
        on a point of interest on the map.

        Props:
            openCallout:        [Object]    -> Information about the point of interest
            calloutHeight:      [int]       -> Maximum height used for draggable range
            onBottomReached:    [Function]  -> Function called when the slide up panel reaches the bottom
    */

    // React.Component built in functions

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        }
    }

    // Utility functions



    // Rendering methods

    

    // Rendering 

    render() {

        let place = this.props.openCallout

        return (
            <SlidingUpPanel
            ref={c => { this.props.setRefCallout(c); this._panelCallout = c; }}
            draggableRange={{top: this.props.calloutHeight, bottom: 0}}
            onBottomReached={() => { this.props.onBottomReached(); this.setState({ ...this.state, isOpen: false }); }}
            showBackdrop={false}
            allowDragging={this.props.openCallout ? false : true}
            >
                <ScrollView
                alwaysBounceVertical={false}
                style={{marginBottom: 30, backgroundColor: "white", flex: 1}}
                >
                    <SafeAreaView
                    style={{flex: 1, borderRadius: 10}}
                    >
                        {
                            this.props.openCallout ?
                            <>
                                <TouchableOpacity
                                style={[styles.x_callout, styles.elevated]}
                                onPress={() => this._panelCallout.hide()}
                                >
                                    <Image
                                    source={require("../../../Images/x.png")}
                                    style={{width: 14, height: 14}}
                                    />
                                </TouchableOpacity>
                                <View style={{marginBottom: 25}}>
                                    <View style={{flexDirection: 'row', margin: 7}}>
                                        <View style={{flex: 2, alignItems: 'flex-start'}}>
                                            <Text style={styles.title}>{place.name}</Text>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <Flames
                                            flames={place.flames}
                                            />
                                        </View>
                                    </View>
                                    <Photos
                                    photos={place.photos}
                                    index={this.state.mediasIndex}
                                    />
                                    <SuggestedByAndLike
                                    place={place}
                                    user={this.props.user}
                                    dispatch={this.props.dispatch}
                                    />
                                    <Tags
                                    tags={place.tags}
                                    />
                                    <TouchableOpacity
                                    onPress={() => this.setState({ ...this.state, isOpen: !this.state.isOpen })}
                                    style={{flexDirection: "row", alignItems: 'center', margin: 7}}
                                    >
                                        <Text style={{fontWeight: "600"}}>More</Text>
                                        <Image
                                        source={require('../../../Images/back_icon_black.png')}
                                        style={{width: 16, height: 10, marginLeft: 5, transform: this.state.isOpen ? [{ rotate: "180deg" }] : []}}
                                        />
                                    </TouchableOpacity>
                                    {
                                        this.state.isOpen ?
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
                            </>
                            :
                                null
                        }
                    </SafeAreaView>
                </ScrollView>
            </SlidingUpPanel>
        )

    }

}

const styles = StyleSheet.create({
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
        alignSelf: "center",
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15
    },
    title: {
        fontWeight: "600",
        fontSize: 20
    },
});