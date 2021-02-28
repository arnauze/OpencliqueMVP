import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { getItemPrice, getRarityColor } from '../Functions/functions'
import { appColor } from '../../Styles/styles';
import { API } from 'aws-amplify'
import { connect } from 'react-redux'

class BoutiqueRow extends React.Component {

    lootItem = () => {
        let apiName = 'Openclique'
        let path = '/items/' + this.props.item.item.id + '/loot/user/' + this.props.user.info.username
        let myInit = {}

        API.post(apiName, path, myInit)
        .then(response => {
            let action = {
                type: 'UPDATE_USER',
                value: {
                    full: true,
                    user: response
                }
            }
            this.props.dispatch(action)
            this.props.reload()
        })
        .catch(error => {
            console.log(error.response)
        })
    }

    render() {
        var item = this.props.item.item
        var url = this.props.item.url

        return (
            <View style={{margin: 5, flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 12, borderBottomColor: getRarityColor(item), borderBottomWidth: 3, margin: 5}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', margin: 7}}>
                        <View style={{flex: 2, alignItems: 'center'}}>
                            <Image source={{url: url}} style={{width: item.width, height: item.height}}/>
                        </View>
                        <View style={{flex: 3}}>
                            <Text style={{color: getRarityColor(item)}}>{item.rarity}</Text>
                        </View>
                    </View>
                </View>
                <View style={{flex: 2, margin: 5, alignItems: 'center'}}>
                    <Text style={{marginBottom: 4}}>G <Text style={{color: appColor}}>{getItemPrice(item)}</Text></Text>
                    <TouchableOpacity
                    style={{width: 40, height: 20, borderRadius: 5, borderColor: appColor, borderWidth: 0.5, alignItems: 'center', justifyContent: 'center', marginTop: 4}}
                    onPress={() => this.lootItem()}
                    >
                        <Text style={{color: appColor}}>GET</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default connect()(BoutiqueRow)