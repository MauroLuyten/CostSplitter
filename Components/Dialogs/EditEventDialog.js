import React, { Component } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Text, Label, Item, Input, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class EditEventDialog extends Component {
    constructor(props){
        super(props)
        this.state = {
            dialog: false,
            uid: this.props.uid,
            eventKey: this.props.eventKey,
            newEventName: '',
            newEventDescription: '',
            newEventAmount: ''
        }
    }
    render() {
        return (
            <ModalWrapper
                onRequestClose={() => { this.setEditEventDialog(false) }}
                style={{ width: 350, height: 'auto', padding: 16 }}
                visible={this.state.dialog}>
                <Text style={{marginBottom:16}}>Edit Event</Text>
                <Item floatingLabel style={{marginBottom:16}}>
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
                <Item floatingLabel style={{marginBottom:16}}>
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
                <Item floatingLabel style={{marginBottom:16}}>
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
                <View style={styles.buttonContainer}>
                    <Button transparent small onPress={() => this.setEditEventDialog(false)}>
                        <Text style={{ color: '#5067FF' }}>Cancel</Text>
                    </Button>
                    <Button primary small onPress={() => this.editEvent()}>
                        <Text style={{ color: 'white' }}>Confirm</Text>
                    </Button>
                </View>
            </ModalWrapper>
        )
    }
    componentWillMount(){
        const event = stateStore.getEvent(this.props.eventKey)
        this.setState({
            newEventName: event.name,
            newEventDescription: event.description,
            newEventAmount: event.amount
        })
    }
    setEditEventDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    editEvent() {
        const event = { 
            name: this.state.newEventName,
            description: this.state.newEventDescription,
            amount: this.state.newEventAmount
         }
        if (event.name && event.description && event.amount) {
            if (event.amount > 0) {
                stateStore.editEvent(event, this.props.eventKey)
                this.setEditEventDialog(false)
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