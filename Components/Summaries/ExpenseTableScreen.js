import React, { Component } from 'react'
import { View, StyleSheet, ListView, FlatList, Modal, TextInput, Picker } from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge, Card } from 'native-base';
import { StackNavigator } from 'react-navigation';
import stateStore from '../../store/store'
import { observer } from 'mobx-react'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


@observer
export default class ExpenseTableScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedExpense: null,
            selectedExpenseName: '',
            selectedCurrency: 'Show default'
        }

    }
    static navigationOptions = {
        title: 'Expense Table'
    }
    render() {
        const tableHead = ['Splitter', 'Trip', 'Amount (Due)', 'Paid', 'Receives/Due', 'Currency'];
        const splitters = stateStore.getSplittersEvent(this.state.selectedExpense);
        return (
            <View style={styles.container}>
                <Picker
                    selectedValue={this.state.selectedExpenseName}
                    onValueChange={(itemValue, itemIndex) => this.handleChangedOption(itemIndex)}>
                    <Picker.Item label="None" key="None" value="None"></Picker.Item>
                        {expenses.map((expense) => <Picker.Item label={expense.name} key={expense.key} value={expense.name}/>)} 
                </Picker>
                <Picker
                    selectedValue={this.state.selectedCurrency}
                    onValueChange={(itemValue, itemIndex) => this.handleCurrencyOption(itemValue)}>
                    <Picker.Item label="Show default" value="Show default"/>
                    {currencies.map((currency) => <Picker.Item label={currency} key={currency} value={currency}/>)}
                </Picker>

                <Table>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                    {splitters.length===0 ? (
                        <Text style={{marginLeft:16}}>No splitters yet</Text>
                    )
                        :
                        (<List style={styles.list} dataArray={_.cloneDeep(splitters)}
                            renderRow={(splitter) =>
                               <Row data={[
                                splitter.name, 
                                splitter.tripName, 
                                this.parseAmount(splitter.amount, this.state.selectedCurrency, splitter.currency), 
                                this.parseAmount(splitter.paid, this.state.selectedCurrency, splitter.currency), 
                                this.parseAmount((splitter.amount - splitter.paid), this.state.selectedCurrency, splitter.currency),
                                this.showCurrency(this.state.selectedCurrency,splitter.currency)]} 
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
        expenses = stateStore.getAllEvents()
        splitters = stateStore.getSplittersEvent(this.state.selectedExpense);
    }

    navigate(route) {
        const { navigate } = this.props.navigation
        navigate(route)
    }

    handleChangedOption(val) {
        if(val != 0) {
            this.setState({selectedExpense: expenses[val-1].key, selectedExpenseName: expenses[val-1].name})
        } else {
            this.setState({selectedExpense: null, selectedExpenseName: 'none'})
        }
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
        height: 50,
        backgroundColor: '#f1f8ff',
    },
    text: {
        marginLeft: 5
    },
    row: {
        height: 30
    }
});