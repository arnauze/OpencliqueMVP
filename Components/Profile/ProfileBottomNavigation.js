import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import BottomNavigationText from './BottomNavigationText'
import { almostWhite } from '../../Styles/styles';

export default class ProfileBottomNavigation extends React.Component {
    render() {
        return (
            <View style={styles.bar}>
                <BottomNavigationText text='Wall' notifications={this.props.isFriend ? 0 : this.props.user.wall.pending.length}/>
                <BottomNavigationText text='Reviews' notifications={this.props.isFriend ? 0 : this.props.user.reviews.pending.length}/>
                <BottomNavigationText text='Photos' notifications={this.props.isFriend ? 0 : 0}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bar: {
        height: 35,
        flexDirection: 'row',
        backgroundColor: almostWhite,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomWidth: 0.5,
        borderColor: 'lightgray'
    }
})