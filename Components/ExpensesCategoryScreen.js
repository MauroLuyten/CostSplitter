import React, { Component } from 'react'
import { View, StyleSheet, ListView, FlatList, Modal, TextInput, Picker } from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge, Card } from 'native-base';
import { StackNavigator } from 'react-navigation';
import stateStore from '../store/store'
import { observer } from 'mobx-react'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


@observer
export default class ExpensesCategoryScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCategory: 'Overnight stay',
            categories: ['Overnight stay', 'Transport', 'Activity', 'Food', 'Misc.'],
            selectedCurrency: 'Show default'
        }

    }
    static navigationOptions = {
        title: 'Expenses per category'
    }
    render() {
        const tableHead = ['Trip', 'Event', 'Splitter', 'Amount', 'Paid', 'Currency'];
        const expenses = stateStore.getExpensesPerCategory(this.state.selectedCategory);
        return (
            <View style={styles.container}>
                <Picker
                    selectedValue={this.state.selectedCategory}
                    onValueChange={(itemValue, itemIndex) => this.handleChangedOption(itemIndex)}>
                        {this.state.categories.map((category) => <Picker.Item label={category} key={category} value={category}/>)} 
                </Picker>
                <Picker
                    selectedValue={this.state.selectedCurrency}
                    onValueChange={(itemValue, itemIndex) => this.handleCurrencyOption(itemValue)}>
                    <Picker.Item label="Show default" value="Show default"/>
                    {currencies.map((currency) => <Picker.Item label={currency} key={currency} value={currency}/>)}
                </Picker>

                <Table>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                    {expenses.length===0 ? (
                        <Text style={{marginLeft:16}}>No expenses yet</Text>
                    )
                        :
                        (<List style={styles.list} dataArray={_.cloneDeep(expenses)}
                            renderRow={(expense) =>
                               <Row data={[
                                expense.tripName, 
                                expense.eventName, 
                                expense.name, 
                                this.parseAmount(expense.amount, this.state.selectedCurrency, expense.currency),
                                this.parseAmount(expense.paid, this.state.selectedCurrency, expense.currency),
                                this.showCurrency(this.state.selectedCurrency,expense.currency)]} 
                                style={styles.row} textStyle={styles.text}/>
                            }>>
                        </List>)}
                </Table>

            </View>
        )
    }
    parseAmount(amount, currency, expenseCurrency){
        if(currency === "Show default") {
            return parseFloat(stateStore.amountToCurrency(expenseCurrency,amount)).toFixed(2)
        } else {
            return parseFloat(stateStore.amountToCurrency(currency,amount)).toFixed(2)
        }

    }
    showCurrency(currency, expenseCurrency){
        if(currency === "Show default"){
            return expenseCurrency
        } else{
            return currency
        }
    }
    componentWillMount() {
        currencies = stateStore.currenciesArray
        expenses = stateStore.getExpensesPerCategory(this.state.selectedCategory);
    }

    navigate(route) {
        const { navigate } = this.props.navigation
        navigate(route)
    }

    handleChangedOption(val) {
        this.setState({selectedCategory: this.state.categories[val]})
    }

    handleCurrencyOption(val) {
        this.setState({selectedCurrency: val})
    }
}
const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
        flex: 1
    },
    seperator: {
        maxHeight: 35
    },
    list: {
        alignSelf: 'stretch'
    },
    listitem: {
        margin: 0,
        marginLeft: 0,
        paddingLeft: 17,
        alignSelf: 'stretch'
    },
    modal: {
        height: 300,
        alignSelf: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    },
    button: {
        margin: 5
    },
    splitTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    },
    head: {
        height: 40,
        backgroundColor: '#f1f8ff',
    },
    text: {
        marginLeft: 5
    },
    row: {
        height: 30
    }
});