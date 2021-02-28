import React from 'react'
import { View, Text, Image } from 'react-native'

export default class EggsAmount extends React.Component {

    // Props:
    //      flamesAmount
    //      flex

    _renderAmount() {
        // console.log("Rendering amount");
        let ret = "";
        switch (this.props.flamesAmount) {
            case 0:
                ret = "1 to 2 x ";
                break;
            case 1:
                ret = "1 to 3 x ";
                break;
            case 2:
                ret = "1 to 4 x ";
                break;
            case 3:
                ret = "2 to 5 x ";
                break;
            case 4:
                ret = "3 to 6 x ";
                break;
            case 5:
                ret = "4 to 7 x ";
                break;
            default:
                ret = "";
                break;
        }
        console.log("RET:" + ret);
        return ret;
    }

    render() {
        // console.log("\n\n\n\n\nTHIS.PROPS:");
        // console.log(this.props);
        return (
            <View style={{flexDirection: "row", alignItems: 'center', flex: this.props.flex ? this.props.flex : null}}>
                <Text>{this._renderAmount()}</Text>
                <Image source={require("../../Images/egg.png")} style={{width: 27, height: 35}}/>
            </View>
        )
    }

}