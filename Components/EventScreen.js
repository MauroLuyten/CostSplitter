import React, { Component } from 'react'
import { StyleSheet, View, Alert, ScrollView, Picker } from 'react-native'
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
import DivideEventDialog from './Dialogs/DivideEventDialog'

@observer
export default class EventScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tripKey: this.props.navigation.state.params.tripKey,
            eventKey: this.props.navigation.state.params.eventKey,
            uid: null,
            eventRef: null,
            fabActive: false
        }
    }
    static navigationOptions = {
        title: 'Event'
    }
    render() {
        const trip = stateStore.getTrip(this.state.tripKey)
        const event = stateStore.getEvent(this.state.tripKey,this.state.eventKey)
        const splitters = stateStore.getSplitters(this.state.tripKey,this.state.eventKey)
        const paidTotal = stateStore.getTotalPaidEvent(this.state.tripKey, this.state.eventKey)
        const remaining = event.amount - paidTotal
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
                            <View style={{}}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red', textAlign: 'right' }}>
                                    {stateStore.amountToCurrency(event.currency,event.amount).toFixed(2)} {event.currency}
                                </Text>
                                <Text style={{textAlign: 'right', color: 'green'}} >
                                    + {stateStore.amountToCurrency(event.currency, paidTotal).toFixed(2)} {event.currency}
                                </Text>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>
                                    {stateStore.amountToCurrency(event.currency,remaining).toFixed(2)} {event.currency}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.splitTextContainer}>
                            <Text style={{marginTop:12}}>Currency:</Text>
                            <Picker 
                                style={{width: 75}}
                                selectedValue={event.currency} 
                                onValueChange={(itemvalue, itemIndex) => stateStore.changeEventCurrency(trip.key, event.key, itemvalue)}>
                                {trip.currencies.map(currency => (
                                    <Picker.Item key={currency.label} label={currency.label} value={currency.value} />
                                ))}
                            </Picker>
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
                        style={{}}
                        active={this.state.fabActive}
                        direction="left"
                        position="topRight"
                        containerStyle = {{top: -32}}
                        style={{ backgroundColor: '#5067FF'}}
                        onPress={() => this.setState({fabActive: !this.state.fabActive})}>
                        <Icon
                            style={{}} 
                            android="md-more" 
                            ios="ios-more">
                        </Icon>
                        <Button 
                            style={{elevation:3, backgroundColor:'#5067FF'}}
                            onPress={()=>this.setAddSplitterDialog(true)}>
                            <Icon
                                style={{ }} 
                                android="md-add" 
                                ios="ios-add">
                            </Icon>
                        </Button>
                        <Button 
                            style={{elevation:3 , backgroundColor:'#5067FF'}}
                            onPress={()=>this.setDivideEventDialog(true)}>
                            <Icon>
                                <Text style={{color:'white', fontWeight:'bold'}}>%</Text>
                            </Icon>
                        </Button>
                    </Fab>
                    {splitters.length===0 ? (
                        <Text style={{marginLeft:16}}>No splitters yet</Text>
                    )
                        :
                        (<List style={styles.list} 
                            dataArray={_.cloneDeep(splitters)}
                            renderRow={(splitter) =>
                                <Card style={styles.splitterItem}>
                                    <View style={[styles.splitTextContainer,{ marginRight: 18}]}>
                                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{splitter.name}</Text>
                                        <View style={{}}>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red', textAlign: 'right'  }}>
                                                {stateStore.amountToCurrency(event.currency,splitter.amount).toFixed(2)} {event.currency}
                                            </Text>
                                            <Text style={{textAlign: 'right', color: 'green', textAlign: 'right' }} >
                                                + {stateStore.amountToCurrency(event.currency,splitter.paid).toFixed(2)} {event.currency}
                                            </Text>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>
                                                  {stateStore.amountToCurrency(event.currency,(splitter.amount - splitter.paid)).toFixed(2)} {event.currency}
                                            </Text>
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
                <DivideEventDialog
                    ref="DivideEventDialog" 
                    tripKey={this.state.tripKey} 
                    eventKey={this.state.eventKey}>
                </DivideEventDialog>

                

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
    setDivideEventDialog(visible){
        this.refs.DivideEventDialog.setDivideEventDialog(visible)
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