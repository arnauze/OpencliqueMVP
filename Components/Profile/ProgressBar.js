import React from 'react'
import { View, Text, Image } from 'react-native'
import ProgressBar from 'react-native-progress/Bar';
import { getBrackets, getBracketColor, getBracketImage, getLevel, getLevelPoints } from '../Functions/functions';
import { appColor } from '../../Styles/styles';

export default class Bar extends React.Component {

    getImage = (cliquepoints) => {

        var name = getBrackets(cliquepoints)

        if (name.indexOf("Bronze") >= 0) {
            return require('../../Images/Brackets/bronze.png')
        } else if (name.indexOf("Silver") >= 0) {
            return require('../../Images/Brackets/silver.png')
        } else if (name.indexOf("Gold") >= 0) {
            return require('../../Images/Brackets/gold.png')
        } else if (name.indexOf("Platinum") >= 0) {
            return require('../../Images/Brackets/platinum.png')
        } else if (name.indexOf("Diamond") >= 0) {
            return require('../../Images/Brackets/diamond.png')
        }
    }

    render() {

        var cliquepoints = this.props.cliquepoints;
        var minPoints = this.props.minPoints;
        var maxPoints = this.props.maxPoints;

        console.log("CLIQUEPOINTS HERE");
        console.log(this.props.cliquepoints);

        return (
            <View style={{margin: 5, alignItems: 'center'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{alignSelf: 'flex-start', marginRight: 7, alignItems: 'center',}}>
                        <Text style={{color: appColor, fontWeight: "600", fontSize: 17}}>{getLevel(cliquepoints)}</Text>
                        <Text style={{color: appColor, fontWeight: "600"}}>LEVEL</Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <ProgressBar
                        progress={minPoints / maxPoints}
                        width={250}
                        color={appColor}
                        borderColor={appColor}
                        />
                        <Text
                        style={{margin: 5, alignSelf: 'center', fontWeight: '500', color: appColor}}
                        >
                            {minPoints} <Text style={{color: 'black'}}>/ {maxPoints}</Text>
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}