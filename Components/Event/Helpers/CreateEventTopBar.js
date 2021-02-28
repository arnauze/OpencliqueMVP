import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image} from 'react-native'
import ImagePicker from 'react-native-image-picker'
import { connect } from 'react-redux'

class CreateEventTopBar extends React.Component {

    chooseImage(type) {
        if (type === 'Private') {
            if (this.props.privacy !== 'Private') {
                return (require('../../../Images/private_event.png'))
            } else {
                return (require('../../../Images/checkmark.png'))
            }
        } else {
            if (this.props.privacy !== 'Public') {
                return (require('../../../Images/public_event.png'))
            } else {
                return (require('../../../Images/checkmark.png'))
            }
        }
    }

    pickImage = () => {
        ImagePicker.showImagePicker({}, response => {
            this.props.setImage(response)
        })
    }

    render() {
        return (
            <View style={styles.top_container}>
                <View style={styles.privacy_box}>
                    <TouchableOpacity
                    style={styles.privacy_private}
                    onPress={() => this.props.changePrivacy('Private')}
                    >
                        <Image 
                        style={styles.image}
                        source={this.chooseImage('Private')}
                        />
                        <View>
                            <Text style={styles.privacy_title}>Private event</Text>
                            <Text style={styles.privacy_description}>Only visible by people invited</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={styles.privacy_public}
                    onPress={() => this.props.changePrivacy('Public')}
                    >
                        <Image
                        style={styles.image}
                        source={this.chooseImage('Public')}
                        />
                        <View>
                            <Text style={styles.privacy_title}>Public event</Text>
                            <Text style={styles.privacy_description}>Visible by everyone on Openclique</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.event_title}>
                    <View style={{flex: 4, alignItems: 'flex-start', marginLeft: 7}}>
                        <TextInput
                        style={styles.text_input}
                        placeholder='Event title'
                        onChangeText={text => {
                            this.props.changeEventName(text)
                        }}
                        />
                    </View>
                    <TouchableOpacity
                    style={{flex: 1, alignItems: 'center'}}
                    onPress={() => this.pickImage()}
                    disabled={this.props.disabled}
                    >
                        <Image source={require('../../../Images/add_media.png')} style={{width: 24, height: 24}}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    top_container: {
        flex: 1,
        backgroundColor: 'white'
    },
    separation: {
        height: 0.5,
        width: 200,
        backgroundColor: 'black'
    },
    privacy_box: {
        height: 100,
        borderWidth: 0.5,
    },
    privacy_private: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: 'lightgray'
    },
    privacy_public: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center'
    },
    privacy_title: {
        fontWeight: 'bold'
    },
    privacy_description: {
        fontWeight: '100'
    },
    event_title: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        height: 60,
        alignItems: 'center'
    },
    text_input: {
        marginLeft: 10,
        fontSize: 18
    },
    image: {
        marginRight: 20,
        marginLeft: 20
    }
})

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(CreateEventTopBar)
