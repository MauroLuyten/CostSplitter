import React, { Component } from 'react'
import { View, StyleSheet, ListView, FlatList, Modal, TextInput } from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge, Card } from 'native-base';
import { StackNavigator } from 'react-navigation';
import stateStore from '../store/store'
import { observer } from 'mobx-react'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

@observer
export default class AllTransactionsScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }

    }
    static navigationOptions = {
        title: 'All Transactions'
    }
    render() {
        const tableHead = ['Trip', 'Event', 'Splitter', 'Amount'];
        const transactions = stateStore.getTransactions();
        return (
        
            <View style={styles.container}>
                <Table>
                    <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                    {transactions.length===0 ? (
                        <Text style={{marginLeft:16}}>No transactions yet</Text>
                    )
                        :
                        (<List style={styles.list} dataArray={transactions}
                            renderRow={(transaction) =>
                               <Row data={[transaction.tripName, transaction.eventName, transaction.splitterName, transaction.amount]} style={styles.row} textStyle={styles.text}/>
                            }>>
                        </List>)}
                </Table>
            </View>
        )
    }

    navigate(route) {
        const { navigate } = this.props.navigation
        navigate(route)
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