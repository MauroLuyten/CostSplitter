import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import { List, ListItem, Content, Container, Text, Separator} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import {StackNavigator} from 'react-navigation'
import {observer} from 'mobx-react'
import stateStore from '../store/store'

@observer
export default class SummariesScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        
    }
    static navigationOptions = {
        title: 'Summaries',
    }
    render() {
        const {navigate} = this.props.navigation
        return (
            <View>
                
            </View>
        )
    }
    navigate(route) {
        const {navigate} = this.props.navigation
        navigate(route)
    }
}

const styles = StyleSheet.create({
    status: {
        fontSize: 30,
        textAlign: 'center'
    },
    button: {
        marginTop: 20,
        alignSelf: 'center'
    },
    buttonText: {
        fontSize: 20,
    },
});