import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'

const MINI_HAT = {width: 40, height: 20}
const MINI_BOTTOM = {width: 20, height: 40}
const MINI_TOP = {width: 34, height: 40}

export default class ItemsInformations extends React.Component {

    _styleOnType = (type) => {

        switch(type) {

            case 'hat':
                return MINI_HAT

            case 'top':
                return MINI_TOP

            case 'bottom':
                return MINI_BOTTOM

        }

    }

    render() {

        return (

            <View style={{flex: 5, justifyContent: 'space-evenly'}}>
            {
                this.props.items.map((item, index) => {

                    return (
                        <View style={{margin: 5}} key={index}>
                            <Text>Nom de l'item</Text>
                            <View
                            style={{height: 3, width: '100%', backgroundColor: 'lightgray', marginTop: 3, marginBottom: 3}}
                            />
                        </View>
                    )

                })
            }
            </View>

        )

    }

}