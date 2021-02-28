import React from 'react'
import { TouchableOpacity, Image, View, Text } from 'react-native';
import { fetchAllUserItems, fetchOneItem, fetchWearingItems } from '../Functions/functions';

export default class Character extends React.Component {

    componentDidMount() {
        this._getItems()
    }

    async _getItems() {
        if (!this.props.isCurrentUser) {
            console.log("Character is not current user");
            let response = await fetchWearingItems("arnauze")
            console.log("Response after fetching all items")
            console.log(response)
        }
    }

    getSize(height, width) {
        // Function used to return the item's size
        let profileHeight = height;
        let profileWidth = width;
        let ret = {};
        if (this.props.isProfile) {
            ret = { width: profileWidth, height: profileHeight }
        } else if (this.props.isMapNotClicked) {
            ret = { width: profileWidth / 3, height: profileHeight / 3 }
        } else if (this.props.isMapClicked) {
            ret = { width: profileWidth / 2, height: profileHeight / 2 }
        } else if (this.props.isFeed) {
            ret = { width: profileWidth / 1.5, height: profileHeight / 1.5 }
        } else {
            ret = { width: profileWidth, height: profileHeight }
        }
        // console.log(ret)
        return ret;
    }

    getDistance(top, bottom, left, right) {
        let ret = {}
        if (this.props.isProfile) {
            if (top != null) ret["top"] = top;
            if (bottom != null) ret["bottom"] = bottom;
            if (left != null) ret["left"] = left;
            if (right != null) ret["right"] = right;
        } else if (this.props.isMapNotClicked) {
            if (top != null) ret["top"] = top / 3;
            if (bottom != null) ret["bottom"] = bottom / 3;
            if (left != null) ret["left"] = left / 3;
            if (right != null) ret["right"] = right / 3;
        } else if (this.props.isMapClicked) {
            if (top != null) ret["top"] = top / 2;
            if (bottom != null) ret["bottom"] = bottom / 2;
            if (left != null) ret["left"] = left / 2;
            if (right != null) ret["right"] = right / 2;
        } else if (this.props.isFeed) {
            if (top != null) ret["top"] = top / 1.5;
            if (bottom != null) ret["bottom"] = bottom / 1.5;
            if (left != null) ret["left"] = left / 1.5;
            if (right != null) ret["right"] = right / 1.5;
        } else {
            return null
        }
        // console.log(ret)
        return ret;
    }

    render() {

        // console.log(this.props)

        if (this.props.isCurrentUser) {
            let skin = this.props.character.avatar.skin;
            let hair = this.props.character.avatar.hair;
            let eyes = this.props.character.avatar.eyes;
            let hat = this.props.character.items.hat;
            let top = this.props.character.items.top;
            let bottom = this.props.character.items.bottom;
            let shoes = this.props.character.items.shoes;
            // console.log("IS CURRENT USER")
            // console.log(this.props.isUserMarker)
            // console.log(skin)
            // console.log(hair)
            // console.log(eyes)
            // console.log(hat)
            // console.log(top)
            // console.log(bottom)
            // console.log(shoes)
            return (

                <TouchableOpacity
                style={{alignItems: 'center', margin: 10}}
                disabled={this.props.disabled}
                onPress={() => this.props.navigation.navigate('ModifyCharacter', { reload: this.props.getItems, reloadProfile: this.props.reload })}
                >
                    <View
                    style={{position: 'relative', alignItems: 'center', margin: this.props.isProfile ? 30 : 0}}
                    >
                        <Image style={[{position: 'relative'}, this.getSize(skin.height, skin.width)]} source={{url: skin.url}} />
                        <Image style={[{position: 'absolute'}, this.getSize(hair.height, hair.width), this.getDistance(hair.top, hair.bottom, bottom.left, hair.right)]} source={{url: hair.url}}/>
                        <Image style={[{position: 'absolute'}, this.getSize(eyes.height, eyes.width), this.getDistance(eyes.top, eyes.bottom, bottom.left, eyes.right)]} source={{url: eyes.url}}/>
                        {hat.height != null ? <Image style={[{position: 'absolute'}, this.getSize(hat.height, hat.width), this.getDistance(hat.top, hat.bottom, bottom.left, hat.right)]} source={{url: hat.url}}/> : null}
                        <Image style={[{position: 'absolute'}, this.getSize(shoes.height, shoes.width), this.getDistance(null, 0, null, null)]} source={{url: shoes.url}}/>
                        <Image style={[{position: 'absolute'}, this.getSize(bottom.height, bottom.width), this.getDistance(bottom.top, bottom.bottom, bottom.left, bottom.right)]} source={{url: bottom.url}}/>
                        <Image style={[{position: 'absolute'}, this.getSize(top.height, top.width), this.getDistance(top.top, top.bottom, top.left, top.right)]} source={{url: top.url}}/>
                    </View>
                </TouchableOpacity>

            )
        } else {

            return (

                <TouchableOpacity
                style={{alignItems: 'center', margin: 10}}
                disabled={this.props.disabled}
                onPress={() => this.props.navigation.navigate('ModifyCharacter', { reload: this.props.getItems, reloadProfile: this.props.reload })}
                >
                    {/* <View
                    style={{position: 'relative', alignItems: 'center', margin: this.props.isProfile ? 30 : 0}}
                    >
                        <Image style={[{position: 'relative'}, this.getSize(this.state.skinHeight, this.state.skinWidth)]} source={require('../../Images/Items/skin.png')} />
                        <Image style={[{position: 'absolute'}, this.getDistance(19, null, null, null), this.getSize(this.state.sweetHeight, this.state.sweetWidth)]} source={require('../../Images/Items/ninjaTop.png')}/>
                        <Image style={[{position: 'absolute'}, this.getDistance(null, 20, null, null), this.getSize(this.state.pantsHeight, this.state.pantsWidth)]} source={require('../../Images/Items/pants.png')}/>
                        <Image style={[{position: 'absolute'}, this.getDistance(null, -5.86, null, null), this.getSize(this.state.shoeHeight, this.state.shoeWidth)]} source={require('../../Images/Items/shoe.png')}/>
                        <Image style={[{position: 'absolute'}, this.getDistance(-25, null, 2, null),, this.getSize(this.state.shoesHeight, this.state.hatWidth)]} source={require('../../Images/Items/hat.png')}/>
                    </View> */}
                </TouchableOpacity>

            )
        }

    }

}
