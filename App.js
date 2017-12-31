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
import AllTransactionsScreen from './Components/AllTransactionsScreen'
import PersonTransactionsScreen from './Components/PersonTransactionsScreen'
import TripTableScreen from './Components/TripTableScreen'
import ExpensesCategoryScreen from './Components/ExpensesCategoryScreen'
import ExpenseDayPersonScreen from './Components/ExpensesDayPersonScreen'
import ExpenseTableScreen from './Components/ExpenseTableScreen'
import TotalExpensePersonCatScreen from './Components/TotalExpensesPersonCategoryScreen'
import EventScreen from './Components/EventScreen'
import SummariesScreen from './Components/SummariesScreen'
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
    Summaries: {
        screen: SummariesScreen
    },
    AllTransactions: {
        screen: AllTransactionsScreen
    },
    TransactionsPP: {
        screen: PersonTransactionsScreen
    },
    TripTable: {
        screen: TripTableScreen
    },
    ExpensesCategory: {
        screen: ExpensesCategoryScreen
    },
    ExpenseDayPerson: {
        screen: ExpenseDayPersonScreen
    },
    ExpenseTable: {
        screen: ExpenseTableScreen
    },
    TotalExpensePersonCat :{
        screen: TotalExpensePersonCatScreen
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
        /* firebaseApp.auth().onAuthStateChanged(user => {
            stateStore.setUser(user)
        }) */
        stateStore.loadCurrencies()
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
