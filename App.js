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
import HomeScreen from './Components/HomeScreen'
import LoginScreen from './Components/LoginScreen'

const Application = StackNavigator({
    Home: {
        screen: HomeScreen
    },
    Login: {
        screen: LoginScreen
    }
})

export default class App extends Component {
    render() {
        return (
            < Application />
        );
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
