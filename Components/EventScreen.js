import React, { Component } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Badge, ListView, List, ListItem, Content, Container, Text, Separator, Card, Fab, Label, Item, Input, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import { firebaseApp } from '../firebaseconfig'
import stateStore from '../store/store'
import { observer } from 'mobx-react'

@observer
export default class EventScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            eventKey: null,
            uid: null,
            eventRef: null,
            addSplitterDialog: false,
            newSplitterName: '',
            newSplitterCurrency: '',
            newSplitterAmount: 0,
            newSplitterPaid: 'false'
        }
    }
    static navigationOptions = {
        title: 'Event'
    }
    render() {
        const event = stateStore.getEvent(this.state.eventKey)

        return (
            <View style={{ flex: 1, marginTop:12}}>
                <Card style={{ padding: 16, flex:-1 }}>

                    <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>{event.name}</Text>
                    <View style={styles.splitTextContainer}>
                        <Text style={{}}>Description:</Text>
                        <Text style={{ marginRight: 16 }}>{event.description == null ? "/" : event.description}</Text>
                    </View>
                    <View style={styles.splitTextContainer}>
                        <Text style={{}}>Amount:</Text>
                        <Text style={{ marginRight: 16 }}>{event.amount == null ? "/" : event.amount} {event.currency === null ? "/" : event.currency}</Text>
                    </View>
                    <View style={styles.splitTextContainer}>
                        <Text style={{}}>Date:</Text>
                        <Text style={{ marginRight: 16 }}>{event.date == null ? "/" : event.date}</Text>
                    </View>

                </Card>
                <View>
                    <Text style={{ marginTop: 16, marginLeft: 16, fontWeight: 'bold', marginBottom:16 }}>Splitters:</Text>
                    {event.splitters == null ? (
                        <Text>No splitters yet</Text>
                    )
                        :
                        (<List style={styles.list} dataArray={event.splitters}
                            renderRow={(splitter) =>
                                <ListItem style={styles.listitem}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text>{splitter.name}   {splitter.amount} {splitter.currency}</Text>
                                        <Badge style={{ marginRight: 16, backgroundColor: "#5067FF" }}>
                                            <Text>{splitter.paid === "true" ? 'V' : 'X'}</Text>
                                        </Badge>
                                    </View>
                                </ListItem>
                            }>>
                        </List>)}
                </View>
                <Fab
                    active={true}
                    direction="up"
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.setAddSplitterDialog(true)}
                >
                    <Text>+</Text>
                </Fab>
                <ModalWrapper
                    onRequestClose={() => { this.setAddSplitterDialog(false) }}
                    style={{ width: 350, height: 'auto', padding: 24 }}
                    visible={this.state.addSplitterDialog}>
                    <Text>Add Splitter</Text>
                    <Item floatingLabel>
                        <Label>Name</Label>
                        <Input
                            selectionColor="#5067FF"
                            onChangeText={(name) => {
                                this.setState({
                                    newSplitterName: name
                                })
                            }}
                            autoFocus={true} />
                    </Item>
                    <Item floatingLabel>
                        <Label>Currency</Label>
                        <Input
                            selectionColor="#5067FF"
                            onChangeText={(currency) => {
                                this.setState({
                                    newSplitterCurrency: currency
                                })
                            }}
                            autoFocus={false} />
                    </Item>
                    <Item floatingLabel>
                        <Label>Amount</Label>
                        <Input
                            selectionColor="#5067FF"
                            onChangeText={(amount) => {
                                this.setState({
                                    newSplitterAmount: amount
                                })
                            }}
                            autoFocus={false} />
                    </Item>
                    <View style={styles.buttonContainer}>
                        <Button transparent small onPress={() => this.setAddSplitterDialog(false)}>
                            <Text style={{ color: '#5067FF' }}>Cancel</Text>
                        </Button>
                        <Button primary small onPress={() => this.addSplitter()}>
                            <Text style={{ color: 'white' }}>Confirm</Text>
                        </Button>
                    </View>
                </ModalWrapper>
            </View>
        )
    }
    componentWillMount() {
        const uid = this.props.navigation.state.params.uid
        const eventKey = this.props.navigation.state.params.key
        this.setState({
            uid: uid,
            eventRef: firebaseApp.database().ref(`users/${uid}/events/${eventKey}`),
            eventKey: eventKey
        })
    }
    setAddSplitterDialog(visible) {
        this.setState({
            addSplitterDialog: visible
        })
    }
    addSplitter() {
        const { eventKey, uid, newSplitterName, newSplitterCurrency, newSplitterAmount, newSplitterPaid } = this.state;
        if (newSplitterName && newSplitterCurrency && newSplitterAmount) {
            if (newSplitterAmount > 0) {
                stateStore.addSplitterToEvent(eventKey, newSplitterName, newSplitterCurrency, newSplitterAmount, newSplitterPaid)
                this.setAddSplitterDialog(false)
            }
            else {
                Alert.alert(
                    'Wrong amount',
                    'Amount must be positive!',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false }
                )
            }
        }
        else {
            Alert.alert(
                'Field missing',
                'Every field must be filled in!',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            )
        }
    }

}


const styles = StyleSheet.create({
    seperator: {
        maxHeight: 35
    },
    list: {
        alignSelf: 'stretch'
    },
    listitem: {
        margin: 0,
        marginLeft: 0,
        paddingLeft: 16,
        alignSelf: 'stretch',
        backgroundColor: '#F4F4F4'
    },
    splitTextContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 16 
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    }
});