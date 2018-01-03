import React, { Component } from 'react'
import { View, StyleSheet, ListView, FlatList, Modal, TextInput, Picker } from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge, Card } from 'native-base';
import { StackNavigator } from 'react-navigation';
import stateStore from '../store/store'
import { observer } from 'mobx-react'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


@observer
export default class PersonTransactionsScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedSplitter: null,
            selectedSplitterName: '',
            splitters: null,
            transactions: null,
            selectedCurrency: 'EUR'
        }

    }
    static navigationOptions = {
        title: 'Person Transactions'
    }
    render() {
        const tableHead = ['Trip', 'Event', 'Splitter', 'Amount'];
        const transactions = stateStore.getTransactionsSplitter(this.state.selectedSplitter);
        return (
            <View style={styles.container}>
                <Picker
                    selectedValue={this.state.selectedSplitterName}
                    onValueChange={(itemValue, itemIndex) => this.handleChangedOption(itemIndex)}>
                    <Picker.Item label="None" key="None" value="None"></Picker.Item>
                        {splitters.map((splitter) => <Picker.Item label={splitter.name} key={splitter.key} value={splitter.name}/>)} 
                </Picker>
                <Picker
                    selectedValue={this.state.selectedCurrency}
                    onValueChange={(itemValue, itemIndex) => this.handleCurrencyOption(itemValue)}>
                    {currencies.map((currency) => <Picker.Item label={currency} key={currency} value={currency}/>)}
                </Picker>
                <Table>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                    {transactions.length===0 ? (
                        <Text style={{marginLeft:16}}>No transactions yet</Text>
                    )
                        :
                        (<List style={styles.list} dataArray={_.cloneDeep(transactions)}
                            renderRow={(transaction) =>
                               <Row data={[transaction.tripName, transaction.eventName, transaction.splitterName, this.parseAmount(transaction.amount, this.state.selectedCurrency)]} style={styles.row} textStyle={styles.text}/>
                            }>>
                        </List>)}
                </Table>

            </View>
        )
    }
    parseAmount(amount, currency){
        return parseFloat(stateStore.amountToCurrency(currency,amount)).toFixed(2)
    }

    componentWillMount() {
        currencies = stateStore.currenciesArray
        splitters = stateStore.getPersons();
        transactions = stateStore.getTransactionsSplitter(this.state.selectedSplitter);
    }

    navigate(route) {
        const { navigate } = this.props.navigation
        navigate(route)
    }

    handleChangedOption(val) {
        if(val != 0) {
            this.setState({selectedSplitter: splitters[val-1].key, selectedSplitterName: splitters[val-1].name})
        } else {
            this.setState({selectedSplitter: null, selectedSplitterName: 'none'})
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