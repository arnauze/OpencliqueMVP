import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import UserRank from './UserRank'

export default class SetionItem extends React.Component {

    _chooseImage() {
        if (this.props.title.indexOf('Diamond') != -1) {
            return (require('../../Images/Brackets/diamond.png'))
        }
        else if (this.props.title.indexOf('Platinum') != -1) {
            return (require('../../Images/Brackets/platinum.png'))
        }
        else if (this.props.title.indexOf('Gold') != -1) {
            return (require('../../Images/Brackets/gold.png'))
        }
        else if (this.props.title.indexOf('Silver') != -1) {
            return (require('../../Images/Brackets/silver.png'))
        }
        else {
            return (require('../../Images/Brackets/bronze.png'))
        }
    }

    render() {
        return (
            <View style={styles.main_container}>
                <View style={styles.header}>
                    <Image
                    source={this._chooseImage()}
                    style={{marginRight: 5}}
                    />
                    <Text style={{fontWeight: 'bold', fontSize: 18}}>{this.props.title}</Text>
                </View>
                {this.props.users.map((item, index) =>
                    <UserRank
                    key={index}
                    rank={index + 1}
                    user={item}
                    level={this.props.level}
                    />
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#27B7ED'
    },
    main_container: {
        marginBottom: 5
    }
})