import React, { Component } from 'react'
import { View, StyleSheet, ListView, FlatList, Modal, TextInput } from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import { StackNavigator } from 'react-navigation';
import stateStore from '../store/store'
import {observer} from 'mobx-react'

@observer
export default class OverviewScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
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
                {stateStore.events.length===0 ?
                    (
                        <Text>
                            No events added yet
                        </Text>
                    )
                    :
                    (<List
                        style={styles.list}
                        dataArray={stateStore.events.slice()}
                        renderRow={(event) =>
                            <ListItem button style={styles.listitem} onPress={() => { this.openEvent(event.key) }}>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>{event.name}</Text>
                                    <View>
                                        <Badge
                                            style={{ marginRight: 5, backgroundColor: '#5067FF' }}>
                                            <Text onPress={() => {  {this.removeEventDialog(event.key)} }}>
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
                    active={true}
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
    openEvent(key) {
        this.navigate('Event', {
            key: key,
            uid: stateStore.user.uid
        })
    }
    removeEventDialog(eventKey) {
        const event = stateStore.events.find(event => event.key===eventKey)
        this.setState({
            selectedEvent: event
        })
        this.setRemoveEventDialog(true)
    }
    removeEvent(key) {
        stateStore.removeEvent(key)
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
        if(newEventName){
            stateStore.addEvent({name: newEventName})
            this.setAddEventDialog(false)
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
    }
});