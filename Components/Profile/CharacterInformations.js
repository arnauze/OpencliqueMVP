import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import Button from './Button'
import Character from '../Character/Character'
import ProfileButtons from './ProfileButtons'
import ItemsInformations from './ItemsInformations'
import { API, Storage } from 'aws-amplify'

export default class CharacterInformations extends React.Component {

    state = {
        loading: true
    }

    componentWillMount() {

        this.getItems()

    }

    getItems = async () => {

        // First I make an API call to get all the user's items
        // let apiName = 'Openclique'
        // let path = '/items/user/' + this.props.user.username
        // let myInit = {
        //     body: {
        //         wearing: true
        //     }
        // }
        
        // // Storing the array of item
        // var items = await API.get(apiName, path, myInit)

        // var i = -1
        var itemsUrl = []

        // // Then I loop through the array and get the url of the item's image
        // while (++i < items.length) {

        //     let data = await Storage.get(items[i].path, {level: 'public'})

        //     itemsUrl.push({url: data, item: items[i]})

        // }

        // And finally I update my state
        this.setState({
            ...this.state,
            items: itemsUrl,
            loading: false
        })

    }

    render() {
        console.log("\n\nCharacter informations props:")
        console.log(this.props)

        if (!this.state.loading) {

            return (
                <View style={{marginBottom: 20}}>
                    <View style={{flexDirection: 'row'}}>
                        <ItemsInformations                  // flex : 5
                        items={[0, 1 ,2, 3]}
                        />
                        <View style={{flex: 5, flexDirection: 'row', justifyContent: 'center'}}>
                            <Character
                            username={this.props.user.info.username}
                            character={this.props.user.character}
                            isProfile={true}
                            user={this.props.user.info}
                            navigation={this.props.navigation}
                            reload={this.props.reload}
                            disabled={this.props.profileType === "Friend"}
                            isCurrentUser={true}
                            />
                        </View>
                    </View>
                </View>
            )

        } else return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}><ActivityIndicator size="large"/></View>
    }
}