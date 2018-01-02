import React, { Component } from 'react'
import { View, StyleSheet, ListView, FlatList, Modal, TextInput, Picker } from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge, Card } from 'native-base';
import { StackNavigator } from 'react-navigation';
import stateStore from '../store/store'
import { observer } from 'mobx-react'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


@observer
export default class ExpensesDayPersonScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedSplitter: null,
            selectedSplitterName: '',
            selectedDay: 'All',
            splitters: null,
            days: null,
            expenses: null
        }

    }
    static navigationOptions = {
        title: 'Expenses person per day'
    }
    render() {
        const tableHead = ['Trip', 'Splitter', 'Amount'];
        const expenses = stateStore.getExpensesPerDayPerson(this.state.selectedSplitter, this.state.selectedDay);
        return (
            <View style={styles.container}>
            <Label>Splitter</Label>
                <Picker
                    selectedValue={this.state.selectedSplitterName}
                    onValueChange={(itemValue, itemIndex) => this.handleChangedOption(itemIndex)}>
                    <Picker.Item label="None" key="None" value="None"></Picker.Item>
                        {splitters.map((splitter) => <Picker.Item label={splitter.name} key={splitter.key} value={splitter.name}/>)} 
                </Picker>
                <Label>Day</Label>
                <Picker
                    selectedValue={this.state.selectedDay}
                    onValueChange={(itemValue, itemIndex) => this.handleDayOption(itemIndex)}>
                    <Picker.Item label="All" key="All" value="All"></Picker.Item>
                        {days.map((day) => <Picker.Item label={day} key={day} value={day}/>)}
                </Picker>

                <Table>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                    {expenses.length===0 ? (
                        <Text style={{marginLeft:16}}>No expenses yet</Text>
                    )
                        :
                        (<List style={styles.list} dataArray={expenses}
                            renderRow={(expense) =>
                               <Row data={[expense.tripName, expense.name, this.parseAmount(expense.amount)]} style={styles.row} textStyle={styles.text}/>
                            }>>
                        </List>)}
                </Table>

            </View>
        )
    }
    parseAmount(amount){
        return parseFloat(amount).toFixed(2)
    }
    componentWillMount() {
        splitters = stateStore.getPersons()
        days = stateStore.getExpenseDays()
        expenses = stateStore. getExpensesPerDayPerson(this.state.selectedSplitter, this.state.selectedDay)
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

    handleDayOption(val) {
        if(val != 0) {
            this.setState({selectedDay: days[val-1]})
        } else {
            this.setState({selectedDay: 'All'})
        }
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