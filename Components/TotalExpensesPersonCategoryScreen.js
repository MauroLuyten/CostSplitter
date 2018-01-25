import React, { Component } from 'react'
import { View, StyleSheet, ListView, FlatList, Modal, TextInput, Picker } from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge, Card } from 'native-base';
import { StackNavigator } from 'react-navigation';
import stateStore from '../store/store'
import { observer } from 'mobx-react'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


@observer
export default class TotalExpensesPersonCategoryScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            splitters: null,
            selectedSplitter: null,
            selectedSplitterName: '',
            selectedCategory: 'Overnight stay',
            categories: ['Overnight stay', 'Transport', 'Activity', 'Food', 'Misc.'],
            totalExpenses: null,
            selectedCurrency: 'EUR'
        }

    }
    static navigationOptions = {
        title: 'Tot. expenses per person per cat.'
    }
    render() {
        const tableHead = ['Splitter', 'Amount (Due)', 'Paid', 'Receives/Due']
        const splitters = stateStore.getPersons()
        const totalExpenses = stateStore.getTotalExpensesPersonCategory(this.state.selectedSplitter, this.state.selectedCategory)
        return (
            <View style={styles.container}>
                <Picker
                    selectedValue={this.state.selectedSplitterName}
                    onValueChange={(itemValue, itemIndex) => this.handleChangedOption(itemIndex)}>
                    <Picker.Item label="None" key="None" value="None"></Picker.Item>
                        {splitters.map((splitter) => <Picker.Item label={splitter.name} key={splitter.key} value={splitter.name}/>)} 
                </Picker>
                <Picker
                    selectedValue={this.state.selectedCategory}
                    onValueChange={(itemValue, itemIndex) => this.handleCategoryOption(itemIndex)}>
                        {this.state.categories.map((category) => <Picker.Item label={category} key={category} value={category}/>)} 
                </Picker>
                <Picker
                    selectedValue={this.state.selectedCurrency}
                    onValueChange={(itemValue, itemIndex) => this.handleCurrencyOption(itemValue)}>
                    {currencies.map((currency) => <Picker.Item label={currency} key={currency} value={currency}/>)}
                </Picker>

                <Table>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                    <Row data={
                    [totalExpenses[0],
                     this.parseAmount(totalExpenses[2], this.state.selectedCurrency),
                     this.parseAmount(totalExpenses[1], this.state.selectedCurrency),
                     this.parseAmount(totalExpenses[3], this.state.selectedCurrency)]} 
                    
                     styles={styles.list} textStyle={styles.text}/>
                </Table>

            </View>
        )
    }
    parseAmount(amount, currency){
        //return parseFloat(stateStore.amountToCurrency(currency,amount)).toFixed(2)
        return `${parseFloat(stateStore.amountToCurrency(currency,amount)).toFixed(2)} ${currency}`
    }

    componentWillMount() {
        currencies = stateStore.currenciesArray
        splitters = stateStore.getPersons()
        totalExpenses = stateStore.getTotalExpensesPersonCategory(this.state.selectedSplitter, this.state.selectedCategory)
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

    handleCategoryOption(val) {
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