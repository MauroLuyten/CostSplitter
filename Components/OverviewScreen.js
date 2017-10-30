import React, { Component } from 'react'
import { View, StyleSheet, ListView, FlatList, Modal, TextInput } from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import { firebaseApp } from '../firebaseconfig'
import { StackNavigator } from 'react-navigation';

export default class OverviewScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            dataRef: null,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2
            }),
            items: [],
            selectedEvent: null,
            addEventDialog: false,
            removeEventDialog: false,
            newEventName: ''
        }

    }
    static navigationOptions = {
        title: 'Overview'
    }
    render() {
        return (
            <View style={styles.container}>
                <Separator bordered style={styles.seperator}>
                    <Text>EVENTS</Text>
                </Separator>
                {this.state.items === null ?
                    (
                        <Text>
                            No events added yet
                        </Text>
                    )
                    :
                    (<List
                        style={styles.list}
                        dataArray={this.state.items}
                        renderRow={(item) =>
                            <ListItem button style={styles.listitem} onPress={() => { this.openEvent(item.key) }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>{item.name}</Text>
                                    <View>
                                        <Badge
                                            style={{ marginRight: 5, backgroundColor: '#5067FF' }}>
                                            <Text onPress={() => {  {this.removeEventDialog(item.key)} }}>
                                                X
                                            </Text>
                                        </Badge>
                                    </View>
                                </View>
                            </ListItem>
                        }>
                        ></List>
                    )}
                <Fab
                    active={this.state.active}
                    direction="up"
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.setAddEventDialog(true)}
                >
                    <Text>+</Text>
                </Fab>
                <ModalWrapper
                    onRequestClose={() => { this.setAddEventDialog(false) }}
                    style={{ width: 350, height: 'auto', padding: 24 }}
                    visible={this.state.addEventDialog}>
                    <Text>New Event</Text>
                    <Item floatingLabel>
                        <Label>Event Name</Label>
                        <Input
                            selectionColor="#5067FF"
                            onChangeText={(text) => {
                                this.setState({
                                    newEventName: text
                                })
                            }}
                            autoFocus={true} />
                    </Item>
                    <View style={styles.buttonContainer}>
                        <Button transparent small onPress={() => this.setAddEventDialog(false)}>
                            <Text style={{ color: '#5067FF' }}>Cancel</Text>
                        </Button>
                        <Button primary small onPress={() => this.addEvent()}>
                            <Text style={{ color: 'white' }}>Confirm</Text>
                        </Button>
                    </View>
                </ModalWrapper>
                <ModalWrapper
                    onRequestClose={() => { this.setRemoveEventDialog(false) }}
                    style={{ width: 350, height: 'auto', padding: 24 }}
                    visible={this.state.removeEventDialog}>
                    <Text>Remove Event</Text>
                    <Text>Do you want to remove {this.state.selectedEvent && this.state.selectedEvent.name} ?</Text>
                    <View style={styles.buttonContainer}>
                        <Button transparent small onPress={() => this.setRemoveEventDialog(false)}>
                            <Text style={{ color: '#5067FF' }}>Cancel</Text>
                        </Button>
                        <Button primary small onPress={() => this.removeEvent(this.state.selectedEvent.key)}>
                            <Text style={{ color: 'white' }}>Confirm</Text>
                        </Button>
                    </View>
                </ModalWrapper>

            </View>
        )
    }
    componentWillMount() {
        const user = firebaseApp
            .auth()
            .currentUser
        this.setState({
            user: user,
            dataRef: firebaseApp
                .database()
                .ref(`users/${user.uid}/events`)

        })
    }
    componentDidMount() {
        this.listenForItems(this.state.dataRef);
    }
    listenForItems(dataRef) {
        dataRef.on('value', (snap) => {
            var items = [];
            snap.forEach((item) => {
                let event = item.val()
                event.key = item.key
                items.push(event);
            });
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(items),
                items: items
            });
        });
    }
    openEvent(key) {
        this.navigate('Event', {
            key: key,
            uid: this.state.user.uid
        })
    }
    removeEventDialog(eventKey) {
        const event = this.state.items.find(event => event.key===eventKey)
        this.setState({
            selectedEvent: event
        })
        this.setRemoveEventDialog(true)
    }
    removeEvent(key) {
        this.state.dataRef.child(key).remove()
        this.setRemoveEventDialog(false)

    }
    navigate(route, params) {
        const { navigate } = this.props.navigation
        navigate(route, params)
    }
    setAddEventDialog(visible) {
        this.setState({
            addEventDialog: visible
        })
    }
    setRemoveEventDialog(visible) {
        this.setState({
            removeEventDialog: visible
        })
    }
    addEvent() {
        const { newEventName, user } = this.state
        firebaseApp.database().ref(`users/${user.uid}/events`).push({
            name: newEventName
        }).then(data => {
            this.setAddEventDialog(false)
        })
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
    }
});