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
            expenses: null
        }

    }
    static navigationOptions = {
        title: 'Person Transactions'
    }
    render() {
        const tableHead = ['Trip', 'Event', 'Description', 'Amount', 'Currency'];
        const expenses = stateStore.getExpensesPerCategory(this.state.selectedCategory);
        return (
            <View style={styles.container}>
                <Picker
                    selectedValue={this.state.selectedCategory}
                    onValueChange={(itemValue, itemIndex) => this.handleChangedOption(itemIndex)}>
                        {this.state.categories.map((category) => <Picker.Item label={category} key={category} value={category}/>)} 
                </Picker>

                <Table>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                    {expenses.length===0 ? (
                        <Text style={{marginLeft:16}}>No expenses yet</Text>
                    )
                        :
                        (<List style={styles.list} dataArray={expenses}
                            renderRow={(expense) =>
                               <Row data={[expense.tripName, expense.name, expense.description, expense.amount, expense.currency]} style={styles.row} textStyle={styles.text}/>
                            }>>
                        </List>)}
                </Table>

            </View>
        )
    }
    componentWillMount() {
        expenses = stateStore.getExpensesPerCategory(this.state.selectedCategory);
    }

    navigate(route) {
        const { navigate } = this.props.navigation
        navigate(route)
    }

    handleChangedOption(val) {
        this.setState({selectedCategory: this.state.categories[val]})
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