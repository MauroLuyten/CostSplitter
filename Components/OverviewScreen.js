import React, { Component } from 'react'
import { View, StyleSheet, ListView, FlatList, Modal, TextInput } from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import { StackNavigator } from 'react-navigation';
import stateStore from '../store/store'
import { observer } from 'mobx-react'
import AddEventDialog from './Dialogs/AddEventDialog'
import RemoveEventDialog from './Dialogs/RemoveEventDialog'

@observer
export default class OverviewScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedEvent: '',
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
                {stateStore.events.length === 0 ?
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
                                            <Text onPress={() => { { this.setRemoveEventDialog(event.key) } }}>
                                                X
                                            </Text>
                                        </Badge>
                                    </View>
                                </View>
                            </ListItem>
                        }>
                        ></List>
                    )}
                <AddEventDialog ref="AddEventDialog" uid={this.state.uid}>

                </AddEventDialog>

                <RemoveEventDialog
                    ref="RemoveEventDialog"
                    uid={this.state.uid}>
                </RemoveEventDialog>

                <Fab
                    active={true}
                    direction="up"
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.setAddEventDialog(true)}
                >
                    <Text>+</Text>
                </Fab>


            </View>
        )
    }
    openEvent(key) {
        this.navigate('Event', {
            key: key,
            uid: stateStore.user.uid
        })
    }

    navigate(route, params) {
        const { navigate } = this.props.navigation
        navigate(route, params)
    }
    setAddEventDialog(visible) {
        this.refs.AddEventDialog.setAddEventDialog(visible)
    }
    setRemoveEventDialog(key) {
        const event = stateStore.getEvent(key)
        this.refs.RemoveEventDialog.setState({
            event: event
        })
        this.refs.RemoveEventDialog.setRemoveEventDialog(true)
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