import React from 'react'
import { Button, View, Switch, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { Auth, API } from 'aws-amplify'
import { connect } from 'react-redux'
import { appColor, almostWhite } from '../../Styles/styles'

// const filters = [
//     'Restaurant',
//     'Bar',
//     'Club',
//     'Event',
//     'Unknown point',
//     'Visited point',
//     'Home',
//     'Ghost mode'
// ]

// class Row extends React.Component {

//     _pickImage() {

//         var item = this.props.item

//         if (item === 'Restaurant') {
//             return require('../../Images/MapIcons/Restaurant/restaurant.png')
//         } else if (item === 'Bar') {
//             return require('../../Images/MapIcons/Bar/bar.png')
//         } else if (item === 'Club') {
//             return require('../../Images/MapIcons/Club/club.png')
//         } else if (item === 'Event') {
//             return require('../../Images/MapIcons/Event/event.png')
//         } else if (item === 'Unknown point') {
//             return require('../../Images/MapIcons/unknown_point.png')
//         } else if (item === 'Visited point') {
//             return require('../../Images/MapIcons/known_point.png')
//         } else if (item === 'Home') {
//             return require('../../Images/MapIcons/home.png')
//         } else if (item === 'Ghost mode') {
//             return require('../../Images/MapIcons/ghost_mode.png')
//         }

//     }

//     _activateFilter() {

//         if (this.props.item === 'Ghost mode') {

//             this._changeGhostMode()

//         } else {

//             this.props.changeFilters(this.props.item)

//             // let action = { type: 'CHANGE_FILTER', value: this.props.item }
//             // this.props.dispatch(action)

//         }

//     }

//     _changeGhostMode = () => {

//         console.log("Changing ghost mode")

//         let apiName = 'Openclique'
//         let path = '/users/' + this.props.user.info.username + '/ghost_mode'
//         let myInit = {
//             body: {
//                 user: this.props.user.info
//             }
//         }

//         API.post(apiName, path, myInit)
//         .then(response => {

//             console.log(response)

//             let action = {
//                 type: 'UPDATE_USER',
//                 value: {
//                     full: true,
//                     user: response
//                 }
//             }
//             this.props.dispatch(action)

//         })
//         .catch(error => {

//             console.log(error.response)

//         })

//     }

//     render() {

//         var item = this.props.item

//         return (

//             <View
//             style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}
//             >
//                 <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
//                     <View style={{width: 30, height: 30, alignItems: 'center', justifyContent: 'center', margin: 5, marginLeft: 10}}>
//                         <Image source={this._pickImage()} style={{width: item === 'Ghost mode' ? 18 : 30, height: item === 'Ghost mode' ? 20 : 30}}/>
//                     </View>
//                     {
//                     item === 'Ghost mode' ?
//                             <View style={{margin: 5}}>
//                                 <Text style={{fontWeight: 'bold'}}>{item}</Text>
//                                 <Text style={{fontWeight: '300', fontSize: 12}}>-30% CP received</Text>
//                             </View>
//                             :
//                             <Text style={{margin: 5, fontWeight: 'bold'}}>{item}</Text>
//                     }
//                 </View>
//                 <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
//                     <Switch
//                     style={{margin: 5, marginRight: 10}}
//                     value={
//                         this.props.item === 'Ghost mode'
//                         ?
//                             this.props.user.info.settings.ghost_mode
//                             ?
//                             true
//                             :
//                             false
//                         :
//                             this.props.filters.indexOf(item) >= 0
//                             ?
//                             true
//                             :
//                             false
//                     }
//                     onValueChange={() => this._activateFilter()}
//                     />
//                 </View>
//             </View>

//         )

//     }

// }

// class Settings extends React.Component {


//     static navigationOptions = ({navigation}) => {

//         return {
//             headerRight:
//             <TouchableOpacity
//             style={{marginRight: 10}}
//             onPress={() => {

//                 let action = { type: 'CHANGE_FILTERS', value: {
//                     filters: navigation.state.params.filters,
//                     user: navigation.state.params.user
//                 }}
//                 navigation.state.params.dispatch(action)
//                 navigation.navigate('Map', {newFilters: true})

//             }}
//             >
//                 <Text style={{color: navigation.state.params && navigation.state.params.updated ? appColor : 'lightgray', fontWeight: 'bold'}}>Confirm</Text>
//             </TouchableOpacity>
//         }

//     }

//     state = {

//         filters: this.props.filters,
//         originalFilters: this.props.filters

//     }

//     constructor(props) {

//         super(props)

//         this.props.navigation.setParams({dispatch: this.props.dispatch, user: this.props.user.info})

//     }

//     _changeLocationPrivacy(value) {

//         let apiName = 'Openclique'
//         let path = '/users/' + this.props.user.info.username + '/location_privacy'
//         let myInit = {
//             body: {
//                 user: this.props.user.info,
//                 privacy: value
//             }
//         }

//         API.post(apiName, path, myInit)
//         .then(response => {

//             console.log(response)

//             let action = {
//                 type: 'UPDATE_USER',
//                 value: {
//                     full: true,
//                     user: response
//                 }
//             }
//             this.props.dispatch(action)

//         })
//         .catch(error => {

//             console.log(error.response)

//         })

//     }

//     _changeAutomaticStatusValue() {

//         let apiName = 'Openclique'
//         let path = '/users/' + this.props.user.info.username + '/automatic_status'
//         let myInit = {
//             body: {
//                 user: this.props.user.info
//             }
//         }

//         API.post(apiName, path, myInit)
//         .then(response => {

//             console.log(response)

//             let action = {
//                 type: 'UPDATE_USER',
//                 value: {
//                     full: true,
//                     user: response
//                 }
//             }
//             this.props.dispatch(action)

//         })
//         .catch(error => {

//             console.log(error.response)

//         })

//     }

//     _filtersAreTheSame = () => {
        
//         for (var filter in this.state.filters) {

//             if (this.state.originalFilters.indexOf(filter) < 0) {

//                 return false

//             }

//         }

//         for (filter in this.state.originalFilters) {

//             if (this.state.filters.indexOf(filter) < 0) {
                
//                 return false

//             }

//         }

//         return true

//     }

//     _changeFilters = (filter) => {

//         if (this.state.filters.indexOf(filter) < 0) {

//             this.setState({
//                 ...this.state,
//                 filters: [
//                     ...this.state.filters,
//                     filter
//                 ]
//             }, () => this.props.navigation.setParams({ filters: this.state.filters, updated: !this._filtersAreTheSame() }))

//         } else {

//             this.setState({
//                 ...this.state,
//                 filters: this.state.filters.filter(item => item != filter)
//             }, () => this.props.navigation.setParams({ filters: this.state.filters, updated : !this._filtersAreTheSame() }))

//         }

//     }

//     render() {

//         console.log(this.state)

//         return (

//             <ScrollView
//             alwaysBounceVertical={false}
//             >
//                 <View>
//                     {
//                         filters.map((item, index) => {

//                             return (
//                                 <Row
//                                 key={index}
//                                 item={item}
//                                 filters={this.state.filters}
//                                 changeFilters={this._changeFilters}
//                                 dispatch={this.props.dispatch}
//                                 user={this.props.user}
//                                 />
//                             )

//                         })
//                     }
//                 </View>
//                 <View style={{width: '100%', height: 0.5, backgroundColor: 'lightgray', marginTop: 5}}></View>
//                 <View style={{margin: 5}}>
//                     <Text style={{margin: 5, color: appColor, fontWeight: 'bold'}}>WHO CAN SEE MY LOCATION</Text>
//                     <TouchableOpacity
//                     style={{margin: 5, flexDirection: 'row', justifyContent: 'space-between'}}
//                     onPress={() => this._changeLocationPrivacy(1)}
//                     >
//                         <Text style={{fontWeight: this.props.user.info.settings.location_privacy === 1 ? 'bold' : 'normal'}}>My connections</Text>
//                         {this.props.user.info.settings.location_privacy === 1 ? <Image source={require('../../Images/checkmark.png')}/> : null }
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                     style={{margin: 5, flexDirection: 'row', justifyContent: 'space-between'}}
//                     onPress={() => this._changeLocationPrivacy(2)}
//                     >
//                         <Text style={{fontWeight: this.props.user.info.settings.location_privacy === 2 ? 'bold' : 'normal'}}>My connections, except...</Text>
//                         {this.props.user.info.settings.location_privacy === 2 ? <Image source={require('../../Images/checkmark.png')}/> : null }
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                     style={{margin: 5, flexDirection: 'row', justifyContent: 'space-between'}}
//                     onPress={() => this._changeLocationPrivacy(3)}
//                     >
//                         <Text style={{fontWeight: this.props.user.info.settings.location_privacy === 3 ? 'bold' : 'normal'}}>Only these connections...</Text>
//                         {this.props.user.info.settings.location_privacy === 3 ? <Image source={require('../../Images/checkmark.png')}/> : null }
//                     </TouchableOpacity>
//                 </View>
//                 <View style={{width: '100%', height: 0.5, backgroundColor: 'lightgray', marginTop: 5}}></View>
//                 <View style={{margin: 5}}>
//                     <Text style={{margin: 5, color: appColor, fontWeight: 'bold'}}>STATUS</Text>
//                     <View style={{flexDirection: 'row'}}>
//                         <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start', margin: 5}}>
//                             <Text style={{fontWeight: 'bold'}}>Post automatic status</Text>
//                             <Text style={{fontWeight: '200', fontSize: 12}}>+10% CP received</Text>
//                         </View>
//                         <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end', margin: 5}}>
//                             <Switch
//                             value={this.props.user.info.settings.automatic_status}
//                             onValueChange={() => this._changeAutomaticStatusValue()}
//                             />
//                         </View>
//                     </View>
//                 </View>
//                 <TouchableOpacity
//                 style={{margin: 10}}
                // onPress={() => Auth.signOut({global: true})
                //     .then(this.props.dispatch({type: 'CHANGE_CONNECTED_USER'}))
                //     .catch(err => console.log(err))
                // }
//                 >
//                     <Text style={{color: 'blue', fontWeight: 'bold'}}>Log out</Text>
//                 </TouchableOpacity>
//             </ScrollView>

//         )

//     }

// }

// const mapStateToProps = state => {

//     return {

//         user: state.user,
//         filters: state.filters

//     }

// }

// export default connect(mapStateToProps)(Settings)

class Settings extends React.Component {

    render() {
        return (
            <SafeAreaView
            style={{flex: 1}}
            >
                <View style={{flex: 1}}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontSize: 17, fontWeight: "600"}}>Settings</Text>
                    </View>
                    <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() => this.props.navigation.goBack()}
                    >
                        <Text style={{color: appColor}}>Close</Text>
                    </TouchableOpacity>
                </View>
                <View
                style={{flex: 9, justifyContent: "flex-start"}}
                >
                    <TouchableOpacity
                    style={{height: 50, width: "100%", margin: 10, borderRadius: 15, justifyContent: 'center', backgroundColor: almostWhite, padding: 16}}
                    onPress={() => this.props.navigation.navigate("BugsReport", {username: this.props.user.info.username})}
                    >
                        <Text style={{fontWeight: "600"}}>I spotted a bug</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={() => Auth.signOut({global: true})
                        .then(this.props.dispatch({type: 'CHANGE_CONNECTED_USER'}))
                        .catch(err => console.log(err))
                    }
                    style={{height: 50, width: "100%", margin: 10, borderRadius: 15, justifyContent: 'center', backgroundColor: almostWhite, padding: 16}}
                    >
                        <Text style={{fontWeight: "600", color: appColor}}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Settings)
