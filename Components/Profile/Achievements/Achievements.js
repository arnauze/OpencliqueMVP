import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import AchievementItem from './AchievementItem'

const ACHIEVEMENTS = [
    {text: "Create an event", type: 'event'},
    {text: "Earn an item", type: "item"},
    {text: "Leave a review", type: "review"},
    {text: "Follow a user", type: "follow1"},
    {text: "Post a status", type: "status"},,
    {text: "Discover unknown point", type: "poi"},
    {text: "Achievements done", type: "achievement"}
]

export default class Achievements extends React.Component {

    state = {
        menu: 'All'
    }

    render() {
        return (
            <ScrollView
            alwaysBounceVertical={false}
            >
                {ACHIEVEMENTS.map((item, index) => (
                    <AchievementItem key={index} item={item}/>
                ))}
            </ScrollView>
        )
    }
}