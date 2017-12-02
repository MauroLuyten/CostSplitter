import React, { Component } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Icon, Badge, ListView, List, ListItem, Content, Container, Text, Separator, Card, Fab, Label, Item, Input, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import { firebaseApp } from '../firebaseconfig'
import stateStore from '../store/store'
import { observer } from 'mobx-react'
import AddSplitterDialog from './Dialogs/AddSplitterDialog'
import EditEventDialog from './Dialogs/EditEventDialog'
import RemoveSplitterDialog from './Dialogs/RemoveSplitterDialog'

@observer
export default class EventScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tripKey: this.props.navigation.state.params.tripKey,
            eventKey: this.props.navigation.state.params.eventKey,
            uid: null,
            eventRef: null,

        }
    }
    static navigationOptions = {
        title: 'Event'
    }
    render() {
        const event = stateStore.getEvent(this.state.tripKey,this.state.eventKey)
        const splitters = stateStore.getSplitters(this.state.tripKey,this.state.eventKey)
        return (
            <View style={{ flex: 1, marginTop: 12 }}>
                <Card style={{ padding: 16, flex: -1 }}>

                    <View style={styles.splitTextContainer}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{event.name}</Text>
                        <Icon 
                        onPress={()=>this.setEditEventDialog(true)}
                        style={{ marginRight: 16, color:'#757575' }} 
                        android="md-create" 
                        ios="ios-create"></Icon>
                    </View>
                    <View style={styles.splitTextContainer}>
                        <Text style={{}}>Description:</Text>
                        <Text style={{ marginRight: 16 }}>{event.description == null ? "/" : event.description}</Text>
                    </View>
                    <View style={styles.splitTextContainer}>
                        <Text style={{}}>Amount:</Text>
                        <Text style={{ marginRight: 16 }}>{event.amount == null ? "/" : event.amount} {event.currency == null ? "/" : event.currency}</Text>
                    </View>
                    <View style={styles.splitTextContainer}>
                        <Text style={{}}>Date:</Text>
                        <Text style={{ marginRight: 16 }}>{event.date == null ? "/" : event.date}</Text>
                    </View>

                </Card>
                <View>
                    <Text style={{ marginTop: 16, marginLeft: 16, fontWeight: 'bold', marginBottom: 16 }}>Splitters:</Text>
                    {splitters.length===0 ? (
                        <Text style={{marginLeft:16}}>No splitters yet</Text>
                    )
                        :
                        (<List style={styles.list} dataArray={splitters}
                            renderRow={(splitter) =>
                                <ListItem style={styles.listitem}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text>{splitter.name}   {splitter.amount} {splitter.currency}</Text>
                                        <Badge style={{ marginRight: 16, backgroundColor: this.paidColor(splitter.paid === "true") }}>
                                            <Text onPress={() => this.setRemoveSplitterDialog(splitter.key)}>{splitter.paid === "true" ? 'V' : 'X'}</Text>
                                        </Badge>
                                    </View>
                                </ListItem>
                            }>>
                        </List>)}
                </View>
                <AddSplitterDialog ref="AddSplitterDialog" tripKey={this.state.tripKey} eventKey={this.state.eventKey}>

                </AddSplitterDialog>
                <EditEventDialog ref="EditEventDialog" tripKey={this.state.tripKey} eventKey={this.state.eventKey}>

                </EditEventDialog>
                <RemoveSplitterDialog
                    ref="RemoveSplitterDialog"
                    tripKey={this.state.tripKey} 
                    eventKey={this.state.eventKey}>
                </RemoveSplitterDialog>
                <Fab
                    active={true}
                    direction="up"
                    style={{ backgroundColor: '#5067FF' }}
                    position="bottomRight"
                    onPress={() => this.setAddSplitterDialog(true)}
                >
                    <Text>+</Text>
                </Fab>

            </View>
        )
    }
    componentWillMount() {
        /* const uid = this.props.navigation.state.params.uid
        const eventKey = this.props.navigation.state.params.key
        this.setState({
            uid: uid,
            eventRef: firebaseApp.database().ref(`users/${uid}/events/${eventKey}`),
            eventKey: eventKey
        }) */
    }
    setAddSplitterDialog(visible) {
        this.refs.AddSplitterDialog.setAddSplitterDialog(visible)
    }
    setEditEventDialog(visible) {
        this.refs.EditEventDialog.setEditEventDialog(visible)
    }
    setRemoveSplitterDialog(key) {
        this.refs.RemoveSplitterDialog.setState({
            splitterKey: key,
            splitter: stateStore.getSplitter(this.state.tripKey, this.state.eventKey, key)
        })
        this.refs.RemoveSplitterDialog.setRemoveSplitterDialog(true)
    }
    paidColor(paid) {
        return paid ? '#4CAF50' : '#F44336'

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