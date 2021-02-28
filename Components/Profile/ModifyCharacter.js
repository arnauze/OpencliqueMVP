import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { API, Storage } from 'aws-amplify';
import Character from '../Character/Character';
import { appColor } from '../../Styles/styles';
import ModifyCharacterBottomPart from './ModifyCharacterBottomPart'
import { fetchAllUserItems, fetchOneItem, fetchWearingItems, fetchAllItems, getKeyFromUrl } from '../Functions/functions';

class ModifyCharacter extends React.Component {

    state = {
        loading: false,
        loadingItems: true,
        type: 'Heads',
        character: this.props.user.character
    }

    componentDidMount() {
        
        // When the component mounts, I make an API call to fetch all of the user's items
        this.getItems()

    }

    getItems = async () => {
        this.setState({ ...this.state, loadingItems: true })
        // console.log("[Modify Character] Fetching all the items")
        let response = await fetchAllItems();
        // console.log("[Modify Character] Items:")
        // console.log(response)

        var i = -1
        var itemsUrl = []
        let items = response.Items;

        while (++i < items.length) {
            // console.log(getKeyFromUrl(items[i].url))
            var value = await Storage.get(getKeyFromUrl(items[i].url), {level: 'public'})
            itemsUrl.push({url: value, item: items[i]})

        }

        this.setState({
            ...this.state,
            loading: false,
            items: itemsUrl,
            wearingItems: itemsUrl.filter(item => item.item.wearing === true),
            loadingItems: false
        })

    }

    // _getUserItems = async (type) => {

    //     // That function is a mess and makes multiple probably useless calls to setState

    //     if (type) {
    //         this.setState({
    //             ...this.state,
    //             type: type
    //         })
    //     }

    //     let apiName = 'Openclique'
    //     let path = ""
    //     let myInit = {}

    //     if (type) {

    //         path = '/items/user/' + this.props.user.info.username + '/filter'
    //         myInit = {
    //             queryStringParameters: {
    //                 filter: type
    //             }
    //         }

    //     } else {

    //         path = '/items/user/' + this.props.user.info.username
    //         myInit = {
    //             queryStringParameters: {
    //                 wearing: false
    //             }
    //         }

    //     }

    //     var itemsUrl = [];

    //     var response = await API.get(apiName, path, myInit)

        // var i = -1
        // var turn = response.Items ? response.Items : response

        // while (++i < turn.length) {

        //     var value = await Storage.get(turn[i].path, {level: 'public'})
        //     itemsUrl.push({url: value, item: turn[i]})

        // }

        // this.setState({
        //     ...this.state,
        //     loading: false,
        //     items: itemsUrl
        // })

    // }

    reload = (item) => {

        // this.getItems()
        // this.props.navigation.state.params.reload()
        console.log("In reload function")
        // I need to use the ITEM variable to fill this.state.character.items.<TYPE>
        var body = {
            "height": item.item.height,
            "key": getKeyFromUrl(item.item.url, false),
            "left": item.item.left,
            "top": item.item.top,
            "url": item.url,
            "width": item.item.width
        }

        let action = {type: 'UPDATE_CHARACTER_ITEM', value: {
            item: body,
            type: item.item.type
        }}
        this.props.dispatch(action)

        this.setState({
            ...this.state,
            character: {
                ...this.state.character,
                items: {
                    ...this.state.character.items,
                    [item.item.type]: body
                }
            }
        })

    }

    render() {

        if (this.state.loading) {

            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large"/>
                </View>
            )

        } else {

            return (
                <View
                style={{flex: 1, alignItems: 'center'}}
                >
                    <View
                    style={{backgroundColor: 'white'}}
                    >
                        <View style={{margin: 20, position: 'relative'}}>
                            <Character
                            character={this.state.character}
                            isProfile={true}
                            disabled={true}
                            user={this.props.user.info}
                            items={this.state.wearingItems}
                            allItems={this.state.items}
                            isCurrentUser={true}
                            />
                        </View>
                        <View
                        style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%', height: 40, borderWidth: 0.5, borderColor: 'lightgray'}}
                        >
                            <TouchableOpacity
                            onPress={() => this.setState({...this.state, type: "Heads"})}
                            style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}
                            >
                                <Text style={{fontWeight: '500', color: this.state.type === 'Heads' ? appColor : 'black'}}>Heads</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => this.setState({...this.state, type: "Tops"})}
                            style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}
                            >
                                <Text style={{fontWeight: '500', color: this.state.type === 'Tops' ? appColor : 'black'}}>Tops</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => this.setState({...this.state, type: "Bottoms"})}
                            style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}
                            >
                                <Text style={{fontWeight: '500', color: this.state.type === 'Bottoms' ? appColor : 'black'}}>Bottoms</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            onPress={() => this.setState({...this.state, type: "Shoes"})}
                            style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}
                            >
                                <Text style={{fontWeight: '500', color: this.state.type === 'Shoes' ? appColor : 'black'}}>Shoes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ModifyCharacterBottomPart
                    type={this.state.type}
                    items={this.state.items}
                    wearingItems={this.state.wearingItems}
                    reload={this.reload}
                    loadingItems={this.state.loadingItems}
                    />
                </View>
            )

        }

    }

}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ModifyCharacter)