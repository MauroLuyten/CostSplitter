/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    Button,
    ToolbarAndroid,
    View,
    StatusBar
} from 'react-native';
import {StackNavigator} from 'react-navigation'
import CurrencyScreen from './Components/CurrencyScreen'
import HomeScreen from './Components/HomeScreen'
import LoginScreen from './Components/LoginScreen'
import OverviewScreen from './Components/OverviewScreen'
import TripScreen from './Components/TripScreen'
import TransactionScreen from './Components/TransactionsScreen'
import EventScreen from './Components/EventScreen'
import {firebaseApp} from './firebaseconfig.js'
import stateStore from './store/store'
import {observer} from 'mobx-react'

const Application = StackNavigator({
    Home: {
        screen: HomeScreen
    },
    Currency: {
        screen: CurrencyScreen
    },
    Login: {
        screen: LoginScreen
    },
    Overview: {
        screen: OverviewScreen
    },
    Trip: {
        screen: TripScreen
    },
    Event: {
        screen: EventScreen
    },
    Transaction: {
        screen: TransactionScreen
    }
})
@observer
export default class App extends Component {
    constructor(props){
        super(props)
    }
    render() {
        return (
            < Application screenProps={stateStore} />
        )
    }
    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            stateStore.setUser(user)
        })
    }

    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
    },
    toolbar: {
        height: 60,
        backgroundColor: 'blue'
    }
});
