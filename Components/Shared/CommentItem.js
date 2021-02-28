import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { timeDifference } from '../Functions/functions'
import { API } from 'aws-amplify';
import { connect } from 'react-redux'

class CommentItem extends React.Component {

    _deleteComment = () => {

        var item = this.props.item
        console.log(item)

        if (this.props.typeOfPost === 'review') {

            let apiName = 'Openclique'
            let path = '/reviews/' + this.props.postId + '/comments'
            let myInit = {
                body: item
            }

            API.del(apiName, path, myInit)
            .then(response => {
                console.log(response)
                this.props.deleteComment(item)
            })
            .catch(error => {
                console.log(error.response)
            })

        } else if (this.props.typeOfPost === 'media') {

            let apiName = 'Openclique'
            let path = '/medias/' + this.props.postId + '/comments'
            let myInit = {
                body: item
            }

            API.del(apiName, path, myInit)
            .then(response => {
                console.log(response)
                this.props.deleteComment(item)
            })
            .catch(error => {
                console.log(error.response)
            })

        } else if (this.props.typeOfPost === 'event') {

            let apiName = 'Openclique'
            let path = '/flux/' + this.props.postId + '/comments'
            let myInit = {
                body: item
            }

            API.del(apiName, path, myInit)
            .then(response => {

                console.log(response)
                this.props.deleteComment(item)

            })
            .catch(error => {

                console.log(error.response)
                
            })

        } else if (this.props.typeOfPost === 'status') {
            let apiName = 'Openclique'
            let path = '/status/' + this.props.postId + '/comments'
            let myInit = {
                body: item
            }

            API.del(apiName, path, myInit)
            .then(response => {

                console.log(response)
                this.props.deleteComment(item)

            })
            .catch(error => {

                console.log(error.response)
                
            })
        }
    }

    render() {
        const item = this.props.item
        var time = item.timestamp ? timeDifference(Date.now(), item.timestamp) : null
        return (
            <View style={{flex: 1}}>
                <View style={styles.comment_box}>
                    <View style={{margin: 2}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontWeight: '600', marginBottom: 8, marginLeft: 5, alignSelf: 'flex-start'}}>{item.username ? item.username : null}</Text>
                            <TouchableOpacity
                            style={{position: 'absolute', right: 0, marginRight: 5}}
                            onPress={() => this._deleteComment()}
                            >
                                <Text>x</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{marginLeft: 5}}>{item.message ? item.message : null}</Text>
                    </View>
                </View>
                <Text style={{fontStyle: 'italic', textAlign: 'right', fontSize: 10, marginRight: 5}}>{time ? time.number + ' ' + time.timeframe + ' ago' : null}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    comment_box: {
        borderWidth: 0.5,
        borderRadius: 15,
        backgroundColor: 'lightgray',
        margin: 5,
        flex: 1
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(CommentItem)