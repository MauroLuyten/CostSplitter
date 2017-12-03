import React, { Component } from 'react'
import { View, StyleSheet, ListView, FlatList, Modal, TextInput } from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge, Card } from 'native-base';
import { StackNavigator } from 'react-navigation';
import stateStore from '../store/store'
import { observer } from 'mobx-react'
import AddEventDialog from './Dialogs/AddEventDialog'
import RemoveEventDialog from './Dialogs/RemoveEventDialog'

@observer
export default class TripScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tripKey: this.props.navigation.state.params.tripKey,
            selectedEvent: '',
            removeEventDialog: false,
        }

    }
    static navigationOptions = {
        title: 'Trip'
    }
    render() {
        const trip = stateStore.getTrip(this.state.tripKey)

        return (
            <View style={styles.container}>
            <Card style={{ padding: 16, flex: -1 }}>
                <View style={styles.splitTextContainer}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{trip.name}</Text>
                        <Icon 
                        onPress={()=>this.setEditEventDialog(true)}
                        style={{ marginRight: 16, color:'#757575' }} 
                        android="md-create" 
                        ios="ios-create"></Icon>
                </View>
                <View style={styles.splitTextContainer}>
                    <Text style={{}}>Description:</Text>
                    <Text style={{ marginRight: 16 }}>{trip.description == null ? "/" : trip.description}</Text>
                </View>
                </Card>
                <Separator bordered style={styles.seperator}>
                    <Text>EVENTS</Text>
                </Separator>
                {stateStore.getEvents(this.state.tripKey).keys().length === 0 ?
                    (
                        <Text>
                            No events added yet
                        </Text>
                    )
                    :
                    (<List
                        style={styles.list}
                        dataArray={stateStore.getEvents(this.state.tripKey)}
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
                <AddEventDialog 
                    ref="AddEventDialog" 
                    uid={this.state.uid} 
                    tripKey={this.state.tripKey}>
                </AddEventDialog>

                <RemoveEventDialog
                    ref="RemoveEventDialog"
                    uid={this.state.uid}
                    tripKey={this.state.tripKey}>
                </RemoveEventDialog>

                <Fab
                    active={true}
                    direction="up"
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.setAddEventDialog(true)}>
                    <Text>+</Text>
                </Fab>


            </View>
        )
    }
    openEvent(key) {
        this.navigate('Event', {
            tripKey: this.state.tripKey,
            eventKey: key,
            //uid: stateStore.user.uid
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
        this.refs.RemoveEventDialog.setState({
            eventKey: key,
            event: stateStore.getEvent(this.state.tripKey, key)
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
    },
    splitTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    }
});