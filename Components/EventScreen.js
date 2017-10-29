import React, { Component } from 'react'
import {View} from 'react-native'
import { List, ListItem, Content, Container, Text, Separator} from 'native-base';
import {firebaseApp} from '../firebaseconfig'

export default class EventScreen extends Component{
    constructor(props){
        super(props)
        this.state = {
            event: null,
            uid: null
        }
    }
    static navigationOptions = {
        title: 'Event'
    }
    render(){
        return(
            <Content>
                <View>
                    <Text>{this.state.uid}</Text>
                </View>
            </Content>
        )
    }
    componentWillMount() {
        const uid = this.props.navigation.state.params.uid
        const eventKey = this.props.navigation.state.params.key
        this.setState({
            uid: uid
        })
        firebaseApp.database().ref(`users/${uid}/events/${eventKey}`)
    }
}