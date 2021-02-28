import React from 'react'
import { StyleSheet, ScrollView, SafeAreaView, View } from 'react-native'
import ShareContentIcon from './ShareContentIcon'
import FluxItem from './FluxItem'
import { API } from 'aws-amplify';
import { connect } from 'react-redux'
import FriendsRanking from './FriendsRanking'
import Community from './Community'

class Flux extends React.Component {

    state = {
        searched: false,
        refresh: false,
        loading: true
    }

    static navigationOptions = ({navigation}) => ({
        headerRight: <ShareContentIcon navigation={navigation}/>,
        headerLeft: null
    })

    _refreshPage() {
        this.setState({
            ...this.state,
            refresh: true
        }, () => this._getFlux())
    }

    renderItem = ({item}) => {
        return (
            <FluxItem 
            item={item}
            user={this.props.user.info}
            navigation={this.props.navigation}
            />
        )
    }

    render() {

        // I will need to handle the fact that they may be a lot of flux content so I will have to load only a few amount of items
        // and update more when I reach the bottom

        // if (this.state && this.state.items && this.state.items.length == 0) {
        //     return (
        //         <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        //             <Text>The flux is empty, sorry</Text>
        //         </View>
        //     )
        // } else {
        //     if (this.state.loading) {
        //         return (
        //             <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        //                 <ActivityIndicator size="large" color="#F2994A" />
        //             </View>
        //         )
        //     } else {
                return (
                    <ScrollView
                    alwaysBounceVertical={false}
                    >
                        <SafeAreaView>
                            <FriendsRanking />
                            <View style={{height: 1, width: "100%", backgroundColor: "lightgray"}}/>
                            <Community />
                        </SafeAreaView>
                    </ScrollView>
                )
        //     }
        // }
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Flux)