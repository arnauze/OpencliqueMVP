import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import { ITEMS } from '../../Styles/items';
import { connect } from 'react-redux';
import { getRarityColor } from '../Functions/functions';
import { Auth } from 'aws-amplify';

class ItemsCollection extends React.Component {

    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params
        return {
            headerTitle:
                <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 18, fontWeight: "600"}}>My collection</Text>
                    <Text>{params.user.info.items.length}0/160</Text>
                </View>,
        }
    }

    state = {
        items: [],
        loading: true
    }

    componentDidMount() {

        let items = this._getItems()
        this.setState({
            loading: false,
            items: items
        })

    }

    _userHasItem = (item) => {
        // return this.props.user.info.items.indexOf(item.id) >= 0;
        let x = Math.floor(Math.random() * 10);
        return x >= 5;
    }

    _getItems = () => {
        return ITEMS;
    }

    _getLock = (item) => {
        switch(item.rarity) {
            case "common":
                return require("../../Images/Locks/common_lock.png")
            case "uncommon":
                return require("../../Images/Locks/uncommon_lock.png")
            case "rare":
                return require("../../Images/Locks/rare_lock.png")
            case "epic":
                return require("../../Images/Locks/epic_lock.png")
        }
    }

    _onItemClicked = (item) => {

        this.props.navigation.navigate("ItemDescription", { item: item })

    }

    _makeCollection = () => {
        var ret = []
        if (this.state.items.length > 0) {
            var i = -1;
            var total = -1;
            var maxRows = this.state.items.length / 4;
            var maxColumns = 4;
            while (++i < maxRows) {
                var currentRow = [];
                var j = -1;
                while (++j < maxColumns) {
                    ++total;
                    currentRow.push(
                        this._makeCollectionItem(this.state.items[total])
                    )
                }
                ret.push(
                    <View
                    style={{flexDirection: 'row', alignItems: 'center', margin: 5}}
                    key={i}
                    >
                        {currentRow.map(item => item)}
                    </View>
                )
            }
        }
        return ret.map(item => item)
    }

    _makeCollectionItem = (item) => {

        if (item) {
            if (this._userHasItem()) {
                return (
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 5}}>
                        <TouchableOpacity
                        style={{width: 81, height: 81, borderRadius: 15, backgroundColor: getRarityColor(item, true), alignItems: 'center', justifyContent: 'center'}}
                        disabled={false}
                        onPress={() => this._onItemClicked(item)}
                        >
                            <Image source={require("../../Images/Items/pants.png")} style={{width: 20, height: 40}} />
                        </TouchableOpacity>
                    </View>
                )
            } else {
                return (
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 5}}>
                        <TouchableOpacity
                        style={{width: 81, height: 81, borderRadius: 15, backgroundColor: getRarityColor(item, true), alignItems: 'center', justifyContent: 'center'}}
                        disabled={true}
                        >
                            <Image source={this._getLock(item)} style={{width: 24, height: 30}} />
                        </TouchableOpacity>
                    </View>
                )
            }
        } else {
            return (
                <View style={{flex: 1}}></View>
            )
        }

    }

    render() {
        return (
            <ScrollView>
                {
                    this._makeCollection()
                }
            </ScrollView>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ItemsCollection)