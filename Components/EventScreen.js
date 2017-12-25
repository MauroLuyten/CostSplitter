import React, { Component } from 'react'
import { StyleSheet, View, Alert, ScrollView } from 'react-native'
import { Icon, Badge, ListView, List, splitterItem, Content, Container, Text, Separator, Card, Fab, Label, Item, Input, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import { firebaseApp } from '../firebaseconfig'
import stateStore from '../store/store'
import { observer } from 'mobx-react'
import AddSplitterDialog from './Dialogs/AddSplitterDialog'
import EditEventDialog from './Dialogs/EditEventDialog'
import RemoveSplitterDialog from './Dialogs/RemoveSplitterDialog'
import EditSplitterDialog from './Dialogs/EditSplitterDialog'
import PayDebtDialog from './Dialogs/PayDebtDialog'

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
        const paidTotal = stateStore.getTotalPaidEvent(this.state.tripKey, this.state.eventKey)
        const divided = stateStore.getEventDivision(this.state.tripKey, this.state.eventKey)
        return (
            <Container style={{ flex: 1}}>
                <ScrollView>
                <Card style={{ padding: 16, flex: -1 }}>

                    <View style={{width:'100%'}}>
                        <View style={styles.splitTextContainer}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{event.name}</Text>
                            <Icon 
                            onPress={()=>this.setEditEventDialog(true)}
                            style={{color:'#5067FF' }} 
                            android="md-create" 
                            ios="ios-create"></Icon>
                        </View>
                        <View style={styles.splitTextContainer}>
                            <Text style={{}}>Description:</Text>
                            <Text>{event.description == null ? "/" : event.description}</Text>
                        </View>
                        <View style={styles.splitTextContainer}>
                            <Text style={{}}>Category:</Text>
                            <Text >{event.category == null ? "/" : event.category}</Text>
                        </View>
                        <View style={styles.splitTextContainer}>
                            <Text style={{}}>Amount:</Text>
                            <View style={{textAlign: 'right'}}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>{event.amount} {event.currency}</Text>
                                <Text style={{textAlign: 'right', color: 'green'}} >+ {paidTotal} {event.currency}</Text>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>{(event.amount - paidTotal).toFixed(2)} {event.currency}</Text>
                            </View>
                        </View>
                        <View style={styles.splitTextContainer}>
                            <Text style={{}}>Date:</Text>
                            <Text >{event.date == null ? "/" : event.date}</Text>
                        </View>
                        <View style={styles.splitTextContainer}>
                            <Text style={{}}>Divided:</Text>
                            <Text>{divided}</Text>
                        </View>
                    </View>

                </Card>
                <View style={{paddingBottom: 32}}>
                    <Text style={{ marginTop: 16, marginLeft: 16, fontWeight: 'bold', marginBottom: 16 }}>Splitters:</Text>
                    <Fab
                        active={true}
                        direction="up"
                        position="topRight"
                        containerStyle = {{top: -32}}
                        style={{ backgroundColor: '#5067FF'}}
                        onPress={() => this.setAddSplitterDialog(true)}>
                        <Text>+</Text>
                    </Fab>
                    {splitters.length===0 ? (
                        <Text style={{marginLeft:16}}>No splitters yet</Text>
                    )
                        :
                        (<List style={styles.list} dataArray={splitters}
                            renderRow={(splitter) =>
                                <Card style={styles.splitterItem}>
                                    <View style={[styles.splitTextContainer,{ marginRight: 18}]}>
                                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{splitter.name}</Text>
                                        <View style={{textAlign: 'right'}}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>{splitter.amount} {event.currency}</Text>
                                            <Text style={{textAlign: 'right', color: 'green'}} >+ {splitter.paid} {event.currency}</Text>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>  {(splitter.amount - splitter.paid).toFixed(2)} {event.currency}</Text>
                                        </View>
                                    </View>
                                    <View style = {[styles.splitTextContainer, {marginBottom: 8}]}>
                                        <Badge style={{ backgroundColor: '#5067FF' }}>
                                            <Text 
                                                onPress={() => this.setEditSplitterDialog(splitter.key)} >
                                                Edit
                                            </Text>
                                        </Badge>
                                        <Badge style={{ backgroundColor: '#5067FF' }}>
                                            <Text 
                                                onPress={() => this.setPayDebtDialog(splitter.key)}>
                                                Pay
                                            </Text>
                                        </Badge>
                                        <Icon 
                                            onPress={()=>this.setRemoveSplitterDialog(splitter.key)}
                                            style={{ marginRight: 16, color:'#5067FF' }} 
                                            android="md-trash" 
                                            ios="ios-trash">
                                        </Icon>
                                    </View>
                                </Card>
                            }>>
                        </List>)}
                </View>
                </ScrollView>
                <AddSplitterDialog 
                    ref="AddSplitterDialog" 
                    tripKey={this.state.tripKey}
                    eventKey={this.state.eventKey}>
                </AddSplitterDialog>
                <EditSplitterDialog
                    ref="EditSplitterDialog"
                    tripKey={this.state.tripKey}
                    eventKey={this.state.eventKey}>
                </EditSplitterDialog>
                <EditEventDialog 
                    ref="EditEventDialog" 
                    tripKey={this.state.tripKey} 
                    eventKey={this.state.eventKey}>
                </EditEventDialog>
                <RemoveSplitterDialog
                    ref="RemoveSplitterDialog"
                    tripKey={this.state.tripKey} 
                    eventKey={this.state.eventKey}>
                </RemoveSplitterDialog>
                <PayDebtDialog
                   ref="PayDebtDialog"
                   tripKey={this.state.tripKey}
                   eventKey={this.state.eventKey}>
                </PayDebtDialog>

                

            </Container>
        )
    }
    componentWillMount() {
    }
    setEditEventDialog(visible) {
        this.refs.EditEventDialog.setEditEventDialog(visible)
    }
    setAddSplitterDialog(visible) {
        this.refs.AddSplitterDialog.setAddSplitterDialog(visible)
    }
    setEditSplitterDialog(key) {
        this.refs.EditSplitterDialog.setState({
            splitterKey: key,
            splitter: stateStore.getSplitter(this.state.tripKey, this.state.eventKey, key)
        }, 
        () => this.refs.EditSplitterDialog.setEditSplitterDialog(true))
        
    }
    setRemoveSplitterDialog(key) {
        this.refs.RemoveSplitterDialog.setState({
            splitterKey: key,
            splitter: stateStore.getSplitter(this.state.tripKey, this.state.eventKey, key)
        })
        this.refs.RemoveSplitterDialog.setRemoveSplitterDialog(true)
    }
    setPayDebtDialog(key) {
        this.refs.PayDebtDialog.setState({
            splitterKey: key,
            splitter: stateStore.getSplitter(this.state.tripKey, this.state.eventKey, key)
        })
        this.refs.PayDebtDialog.setPayDebtDialog(true)
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
    splitterItem: {
        flex: -1,
        paddingTop: 16,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: '#F4F4F4',
        flexDirection: 'column'
    },
    splitTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        width: '100%'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    }
});