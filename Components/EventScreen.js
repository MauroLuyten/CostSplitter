import React, { Component } from 'react'
import {View} from 'react-native'
import { List, ListItem, Content, Container, Text, Separator} from 'native-base';
import {firebaseApp} from '../firebaseconfig'

export default class EventScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            eventKey: null,
            uid: null,
            eventRef: null
        }
    }
    static navigationOptions = {
        title: 'Event'
    }
    render(){
        return(
            <Content>
                <View>
                    <Text>{this.state.eventKey}</Text>
                </View>
            </Content>
        )
    }
    componentWillMount() {
        const uid = this.props.navigation.state.params.uid
        const eventKey = this.props.navigation.state.params.key
        this.setState({
            uid: uid,
            eventRef: firebaseApp.database().ref(`users/${uid}/events/${eventKey}`),
            eventKey: eventKey
        })
        
    }
}