import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    Button,
    ToolbarAndroid,
    View,
    StatusBar
} from 'react-native';
import { StackNavigator } from 'react-navigation'
import CurrencyScreen from './Components/CurrencyScreen'
import HomeScreen from './Components/HomeScreen'
import OverviewScreen from './Components/OverviewScreen'
import TripScreen from './Components/TripScreen'
import AllTransactionsScreen from './Components/Summaries/AllTransactionsScreen'
import PersonTransactionsScreen from './Components/Summaries/PersonTransactionsScreen'
import TripTableScreen from './Components/Summaries/TripTableScreen'
import ExpensesCategoryScreen from './Components/Summaries/ExpensesCategoryScreen'
import ExpenseDayPersonScreen from './Components/Summaries/ExpensesDayPersonScreen'
import ExpenseTableScreen from './Components/Summaries/ExpenseTableScreen'
import TotalExpensePersonCatScreen from './Components/Summaries/TotalExpensesPersonCategoryScreen'
import EventScreen from './Components/EventScreen'
import SummariesScreen from './Components/SummariesScreen'
import { firebaseApp } from './firebaseconfig.js'
import stateStore from './store/store'
import { observer } from 'mobx-react'

const Application = StackNavigator({
    Home: {
        screen: HomeScreen
    },
    Currency: {
        screen: CurrencyScreen
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
    TotalExpensePersonCat: {
        screen: TotalExpensePersonCatScreen
    }
})
@observer
export default class App extends Component {
    constructor(props) {
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
