import React, { Component } from 'react'
import { StyleSheet, View, Alert, ScrollView, Picker } from 'react-native'
import { Text, Label, Item, Input, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class AddEventDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tripKey: this.props.tripKey,
            dialog: false,
            uid: this.props.uid,
            newEventName: '',
            newEventDescription: '',
            newEventCategory: '',
            newEventAmount: 0,
            newEventCurrency: '',
            newEventDate: ''
        }
    }
    render() {
        return (

            <ModalWrapper
                onRequestClose={() => { this.setAddEventDialog(false) }}
                style={{ width: 350, height: 'auto', padding: 16 }}
                visible={this.state.dialog}>
                <ScrollView>
                <Text style={{ marginBottom: 16 }}>Add Event</Text>
                <Item floatingLabel style={{ marginBottom: 16 }}>
                    <Label>Name</Label>
                    <Input
                        value={this.state.newEventName}
                        selectionColor="#5067FF"
                        onChangeText={(name) => {
                            this.setState({
                                newEventName: name
                            })
                        }}
                        autoFocus={true} />
                </Item>
                <Item floatingLabel style={{ marginBottom: 16 }}>
                    <Label>Description</Label>
                    <Input
                        value={this.state.newEventDescription}
                        selectionColor="#5067FF"
                        onChangeText={(description) => {
                            this.setState({
                                newEventDescription: description
                            })
                        }}
                        autoFocus={false} />
                </Item>

                <Label>Category</Label>
                <Picker onValueChange={(itemvalue, itemIndex) => this.setState({newEventCategory: itemvalue})} style={{marginBottom: 16}}
                        selectedValue={this.state.newEventCategory}>
                    <Picker.Item label="Overnight stay" value="Overnight stay"/>
                    <Picker.Item label="Transport" value="Transport"/>
                    <Picker.Item label="Activity" value="Activity"/>
                    <Picker.Item label="Food" value="Food"/>
                    <Picker.Item label="Misc." value="Misc."/>
                </Picker>
                <View>
                <Item floatingLabel style={{ marginBottom: 16 }}>
                    <Label>Amount</Label>
                    <Input
                        value={this.state.newEventAmount.toString()}
                        keyboardType='numeric'
                        selectionColor="#5067FF"
                        onChangeText={(amount) => {
                            this.setState({
                                newEventAmount: amount
                            })
                        }}
                        autoFocus={false} />
                </Item>
                <Item floatingLabel style={{ marginBottom: 16 }}>
                    <Label>Currency</Label>
                    <Input
                        value={this.state.newEventCurrency.toString()}
                        selectionColor="#5067FF"
                        onChangeText={(currency) => {
                            this.setState({
                                newEventCurrency: currency
                            })
                        }}
                        autoFocus={false} />
                </Item>
                </View>
                <Item floatingLabel style={{ marginBottom: 16 }}>
                    <Label>Date</Label>
                    <Input
                        value={this.state.newEventDate.toString()}
                        selectionColor="#5067FF"
                        onChangeText={(date) => {
                            this.setState({
                                newEventDate: date
                            })
                        }}
                        autoFocus={false} />
                </Item>
                <View style={styles.buttonContainer}>
                    <Button transparent small onPress={() => this.setAddEventDialog(false)}>
                        <Text style={{ color: '#5067FF' }}>Cancel</Text>
                    </Button>
                    <Button primary small onPress={() => this.addEvent()}>
                        <Text style={{ color: 'white' }}>Confirm</Text>
                    </Button>
                </View>
                </ScrollView>
            </ModalWrapper>
        )
    }
    setAddEventDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    addEvent() {
        const event = {
            name: this.state.newEventName,
            description: this.state.newEventDescription,
            category: this.state.newEventCategory,
            amount: this.state.newEventAmount,
            currency: this.state.newEventCurrency,
            date: this.state.newEventDate
        }
        if (event.name && event.description && event.category && event.amount && event.currency) {
            if (event.amount
                > 0) {
                stateStore.addEvent(this.state.tripKey, event)
                this.setAddEventDialog(false)
                this.setState({
                    newEventName: '',
                    newEventDescription: '',
                    newEventCategory: '',
                    newEventAmount: 0,
                })
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

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    }
});