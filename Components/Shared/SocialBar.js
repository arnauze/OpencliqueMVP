import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { API } from 'aws-amplify'
import { isEmpty } from '../Functions/functions'

export default class SocialBar extends React.Component {

    state = {
        text: '',
        likes: [],
        comments: []
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            likes: this.props.item.likes.filter(item => item !== 0),
            comments: this.props.item.comments.filter(item => !isEmpty(item))
        })
    }

    _updateLikes() {

        this.setState({
            ...this.state,
            likes: this.state.likes.indexOf(this.props.user) >= 0 ? this.state.likes.filter(item => item !== this.props.user) : [...this.state.likes, this.props.user]
        })

        if (this.props.typeOfPost === 'review') {
            console.log(this.props)
            let apiName = 'Openclique'
            let path = '/reviews/' + this.props.full_item.id + '/likes/' + this.props.user
            let myInit = {}

            API.post(apiName, path, myInit).then((response) => {
                console.log(response)
            }).catch(error => {
                console.log(error)
            })
            
        } else if (this.props.typeOfPost === 'media') {

            let apiName = 'Openclique'
            let path = '/medias/' + this.props.full_item.id + '/likes/' + this.props.user
            let myInit = {}

            API.post(apiName, path, myInit).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error)
            })

        } else if (this.props.typeOfPost === 'event') {

            let apiName = 'Openclique'
            let path = '/events/' + this.props.full_item.id + '/likes/' + this.props.user
            let myInit = {}

            API.post(apiName, path, myInit).then(response => {

                console.log(response)

            }).catch(error => {

                console.log(error)
                
            })

        } else if (this.props.typeOfPost === 'status') {
            console.log(this.props)
            let apiName = 'Openclique'
            let path = '/status/' + this.props.full_item.id + '/likes/' + this.props.user
            let myInit = {}

            API.post(apiName, path, myInit).then(response => {

                console.log(response)

            }).catch(error => {

                console.log(error.response)
                
            })

        }

    }

    render() {

        // Right now for the reviews I can't comment, because I added the social elements inside the reviews database
        // and it was in the flux before. So when I comment it updates the flux database and not the review. I need to take care of that.

        return (
            <View style={styles.main_container}>
                <TouchableOpacity
                style={styles.align}
                onPress={() => this._updateLikes()}
                >
                    <Text style={{marginRight: 10}}>Like</Text>
                    <Image
                    source={require('../../Images/heart.png')}
                    style={{ marginRight: 5, height: 13, width: 13 }}
                    />
                    <Text>{this.state.likes.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={styles.align}
                onPress={() => this.props.navigation.navigate('LeaveComment', {item: this.props.full_item, typeOfPost: this.props.typeOfPost, autofocus: true})}
                >
                    <Text style={{marginRight: 10}}>Comment</Text>
                    <Image
                    source={require('../../Images/comment.png')}
                    style={{ marginRight: 5, height: 13, width: 16 }}
                    />
                    <Text>{this.state.comments.length}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles= StyleSheet.create({
    main_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: 10,
        width: '100%'
    },
    align: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text_input: {
        height: 20,
        width: 150,
        borderColor: 'gray',
        borderWidth: 1
    }
})