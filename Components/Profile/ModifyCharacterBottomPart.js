import React from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { API } from 'aws-amplify'
import { appColor } from '../../Styles/styles'
import { connect } from 'react-redux'
import { buildItems } from '../Functions/buildItems';

class ModifyCharacterBottomPart extends React.Component {

    _wearItem = (item) => {

        let apiName = 'Openclique'
        let path = '/users/' + this.props.user.info.username + '/item/' + item.item.id + '/wear'
        let itemsWearing = this.props.user.info.items.filter(item => item.wearing === true)
        let myInit = { body: { itemsWearing: itemsWearing } }

        API.post(apiName, path, myInit)
        .then(response => { 
            let action = {
                type: 'UPDATE_USER',
                value: {
                    full: true,
                    user: response.Item
                }
            }
            this.props.dispatch(action)
            this.props.reload(item)
        })
        .catch(error => {
            console.log(error.response)
        })

    }

    _isOnUser = (id) => {
        if (this.props.user.info.items.filter(item => item.wearing === true).findIndex(item => item.id === id) >= 0) {
            return appColor
        } else {
            return 'white'
        }
    }

    getItems = () => {
        if (this.props.type === 'Heads') {
            return this.props.items.filter(item => item.item.type === "hat")
        } else if (this.props.type === 'Tops') {
            return this.props.items.filter(item => item.item.type === "top")
        } else if (this.props.type === 'Bottoms') {
            return this.props.items.filter(item => item.item.type === "bottom")
        } else if (this.props.type === 'Shoes') {
            return this.props.items.filter(item => item.item.type === "shoes")
        }
    }

    _outputParts = () => {

        var items = this.getItems()

        return (
            items.map((item, i) => {

                if (i % 3 === 0) {

                    return (
                        <View
                        key={i}
                        style={{flexDirection: 'row', alignItems: 'center', margin: 10}}
                        >
                            {
                                items[i]
                                ?
                                    <View style={{width: '33.333%', alignItems: 'center'}}>
                                        <TouchableOpacity
                                        onPress={() => this._wearItem(items[i])}
                                        style={{minHeight: 50, minWidth: 50, alignItems: 'center', justifyContent: 'center'}}
                                        >
                                            <View style={{flexDirection: 'row'}}>
                                                <Image
                                                source={{url: items[i].url}}
                                                style={{width: items[i].item.width, height: items[i].item.height, marginRight: 10}}
                                                />
                                                <View style={{height: 10, width: 10, backgroundColor: this._isOnUser(items[i].item.id), alignSelf: 'flex-start', borderRadius: 5, borderWidth: 0.5}}></View>
                                            </View>
                                            <Text style={{margin: 10}}>{items[i].item.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                :
                                    <View style={{width: '33.333%', alignItems: 'center'}}></View>
                            }
                            {
                                items[i + 1]
                                ?
                                    <View style={{width: '33.333%', alignItems: 'center'}}>
                                        <TouchableOpacity
                                        onPress={() => this._wearItem(items[i + 1])}
                                        style={{minHeight: 50, minWidth: 50, alignItems: 'center', justifyContent: 'center'}}
                                        >
                                            <View style={{flexDirection: 'row'}}>
                                                <Image
                                                source={{url: items[i + 1].url}}
                                                style={{width: items[i + 1].item.width, height: items[i + 1].item.height, marginRight: 10}}
                                                />
                                                <View style={{height: 10, width: 10, backgroundColor: this._isOnUser(items[i + 1].item.id), alignSelf: 'flex-start', borderRadius: 5, borderWidth: 0.5}}></View>
                                            </View>
                                            <Text style={{margin: 10}}>{items[i + 1].item.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                :
                                    <View style={{width: '33.333%', alignItems: 'center'}}></View>
                            }
                            {
                                items[i + 2]
                                ?
                                    <View style={{width: '33.333%', alignItems: 'center'}}>
                                        <TouchableOpacity
                                        onPress={() => this._wearItem(items[i + 2])}
                                        style={{minHeight: 50, minWidth: 50, alignItems: 'center', justifyContent: 'center'}}
                                        >
                                            <View style={{flexDirection: 'row'}}>
                                                <Image
                                                source={{url: items[i + 2].url}}
                                                style={{width: items[i + 2].item.width, height: items[i + 2].item.height, marginRight: 10}}
                                                />
                                                <View style={{height: 10, width: 10, backgroundColor: this._isOnUser(items[i + 2].item.id), alignSelf: 'flex-start', borderRadius: 5, borderWidth: 0.5}}></View>
                                            </View>
                                            <Text style={{margin: 10}}>{items[i + 2].item.name}</Text>
                                        </TouchableOpacity>
                                    </View>
                                :
                                <View style={{width: '33.333%', alignItems: 'center'}}></View>
                            }
                        </View>
                    )
                    
                }

            })

        )

    }

    render() {

        if (this.props.items && this.props.items.length > 3) {

            return (
                <ScrollView
                style={{backgroundColor: '#F9F9F9'}}
                contentContainerStyle={{alignItems: 'center'}}
                >
                    {this._outputParts()}
                </ScrollView>
            )

        } else {

            return null

        }

    }

}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ModifyCharacterBottomPart)