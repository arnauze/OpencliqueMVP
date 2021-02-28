import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { API, Storage } from 'aws-amplify'
import Gold from './Gold.js'
import BoutiqueRow from './BoutiqueRow.js'
import { getBrackets, getBracketColor } from '../Functions/functions'
import { appColor, almostWhite } from '../../Styles/styles.js';

class Boutique extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerRight: <Gold navigation={navigation}/>
        }
    }

    state = {
        items: [],
        loading: true
    }

    componentWillMount() {
       this.getBoutique()
    }

    getBoutique = async () => {

        let apiName = 'Openclique'
        let path = '/users/' + this.props.user.info.username + '/boutique'
        let myInit = {}

        let response = await API.get(apiName, path, myInit)

        var i = -1
        var itemsUrl = []

        while (++i < response.length) {

            var value = await Storage.get(response[i].path, {level: 'public'})
            itemsUrl.push({url: value, item: response[i]})

        }

        this.setState({
            ...this.state,
            loading: false,
            items: itemsUrl,
            wearingItems: itemsUrl.filter(item => item.item.wearing === true)
        })

    }

    render() {
        if (this.state.loading) {

            return (
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text>Loading...</Text>
                </View>
            )

        } else {

            return (
                <ScrollView
                style={{flex: 1}}
                // stickyHeaderIndices={[0]}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: almostWhite, height: 40, borderBottomWidth: 0.5, borderBottomColor: 'lightgray'}}>
                        <View style={{marginLeft: 15}}>
                            <Text style={{color: getBracketColor(getBrackets(this.props.user.info.cliquepoints))}}>{getBrackets(this.props.user.info.cliquepoints)}</Text>
                        </View>
                        <TouchableOpacity style={{marginRight: 15}}>
                            <Text style={{color: appColor}}>Get more gold</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.items.map((item, index) => {
                            return (
                                <BoutiqueRow
                                key={index}
                                item={item}
                                user={this.props.user}
                                reload={this.getBoutique}
                                />
                            )
                        })
                    }
                </ScrollView>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(Boutique)