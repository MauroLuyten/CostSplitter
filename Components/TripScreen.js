import React, { Component } from 'react'
import { View, StyleSheet, ListView, FlatList, Modal, TextInput, ScrollView, Picker, NetInfo} from 'react-native'
import { List, ListItem, Content, Container, Text, Separator, Icon, Fab, Button, Form, Item, Input, Label, Badge, Card } from 'native-base';
import { StackNavigator } from 'react-navigation';
import stateStore from '../store/store'
import { observer } from 'mobx-react'
import AddEventDialog from './Dialogs/AddEventDialog'
import RemoveEventDialog from './Dialogs/RemoveEventDialog'
import EditTripDialog from './Dialogs/EditTripDialog'

@observer
export default class TripScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tripKey: this.props.navigation.state.params.tripKey,
            selectedEvent: '',
            removeEventDialog: false,
            selectedCurrency: ''
        }

    }
    static navigationOptions = {
        title: 'Trip'
    }
    render() {
        const trip = stateStore.getTrip(this.state.tripKey)
        const amountTotal = stateStore.getTotalAmountTrip(this.state.tripKey)
        return (
            <Container style={{flex:1}}>
                <ScrollView>
                <Card style={{ padding: 16, flex: -1 }}>
                    <View style={{ width: '100%' }}>
                        <View style={styles.splitTextContainer}>
                            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{trip.name}</Text>
                            <Icon
                                onPress={() => this.setEditTripDialog(true)}
                                style={{ color: '#5067FF' }}
                                android="md-create"
                                ios="ios-create"></Icon>
                        </View>
                        <View style={styles.splitTextContainer}>
                            <Text>Description:</Text>
                            <Text>{trip.description == null ? "/" : trip.description}</Text>
                        </View>
                        <View style={styles.currencies}>
                            <Text>Currencies:</Text>
                            {currenciesArray = trip.currencies.map(currency => (
                                <Text key={currency.label}>{currency.value}</Text>
                            ))}
                        </View>
                        <View style={styles.splitTextContainer}>
                            <Text>Budget:</Text>
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>{trip.budget}</Text>
                                <Text style={{ textAlign: 'right', color: 'red' }} >- {amountTotal} </Text>
                                {(trip.budget - amountTotal).toFixed(2) < 0
                                    ? <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right', color: 'red' }}>{(trip.budget - amountTotal).toFixed(2)}</Text>
                                    : <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right', color: 'green' }}>{(trip.budget - amountTotal).toFixed(2)}</Text>}

                            </View>
                        </View>
                    </View>
                    <Picker selectedValue={this.state.selectedCurrency} onValueChange={(itemvalue, itemIndex) =>{this.getNewRateTripBudget(itemvalue)}}>
                        {trip.currencies.map(currency => (
                            <Picker.Item key={currency.label} label={currency.label} value={currency.value} />
                        ))}
                    </Picker>
                </Card>
                <View style={{paddingBottom: 32}}>
                    <Text style={{ marginTop: 16, marginLeft: 16, fontWeight: 'bold', marginBottom: 16 }}>Events:</Text>
                    <Fab
                        active={true}
                        direction="up"
                        position="topRight"
                        containerStyle = {{top: -32}}
                        style={{ backgroundColor: '#5067FF'}}
                        onPress={() => this.setAddEventDialog(true)}>
                        <Text>+</Text>
                    </Fab>
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
                                    <Text style={{width:100}}>{event.name}</Text>
                                    <Text style={{fontWeight:'bold'}}>{event.amount+ ' '+event.currency}</Text>
                                    <Icon 
                                        onPress={()=>this.setRemoveEventDialog(event.key)}
                                        style={{ marginRight: 16, color:'#5067FF' }} 
                                        android="md-trash" 
                                        ios="ios-trash">
                                    </Icon>
                                </View>
                            </ListItem>
                        }>
                        ></List>
                    )}
                </View>
                </ScrollView>
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

                <EditTripDialog
                    ref="EditTripDialog"
                    uid={this.state.uid}
                    tripKey={this.state.tripKey}>
                </EditTripDialog>

            </Container>
        )
    }

    getNewRateTripBudget(itemvalue){
            stateStore.getNewRateTripBudget(this.state.tripKey, this.state.selectedCurrency, itemvalue)
            this.setState({selectedCurrency: itemvalue});
    }

    componentWillMount(){
        const trip = stateStore.getTrip(this.state.tripKey)
        this.setState({
            selectedCurrency: trip.selectedCurrency
        })
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
    setEditTripDialog(key) {
        this.refs.EditTripDialog.setState({
            tripKey: key,
            trip: stateStore.getTrip(this.state.tripKey)
        })
        this.refs.EditTripDialog.setEditTripDialog(true)
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
    }, 
    currencies: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    }
});