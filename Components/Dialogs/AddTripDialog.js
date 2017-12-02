import React, { Component } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Text, Label, Item, Input, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class AddTripDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialog: false,
            uid: this.props.uid,
            newTripName: '',
            newTripDescription: '',
        }
    }
    render() {
        return (

            <ModalWrapper
                onRequestClose={() => { this.setAddTripDialog(false) }}
                style={{ width: 350, height: 'auto', padding: 16 }}
                visible={this.state.dialog}>
                <Text style={{ marginBottom: 16 }}>Add trip</Text>
                <Item floatingLabel style={{ marginBottom: 16 }}>
                    <Label>Name</Label>
                    <Input
                        value={this.state.newTripName}
                        selectionColor="#5067FF"
                        onChangeText={(name) => {
                            this.setState({
                                newTripName: name
                            })
                        }}
                        autoFocus={true} />
                </Item>
                <Item floatingLabel style={{ marginBottom: 16 }}>
                    <Label>Description</Label>
                    <Input
                        value={this.state.newTripDescription}
                        selectionColor="#5067FF"
                        onChangeText={(description) => {
                            this.setState({
                                newTripDescription: description
                            })
                        }}
                        autoFocus={false} />
                </Item>
                {/* <Item floatingLabel style={{ marginBottom: 16 }}>
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
                </Item> */}
                <View style={styles.buttonContainer}>
                    <Button transparent small onPress={() => this.setAddTripDialog(false)}>
                        <Text style={{ color: '#5067FF' }}>Cancel</Text>
                    </Button>
                    <Button primary small onPress={() => this.addTrip()}>
                        <Text style={{ color: 'white' }}>Confirm</Text>
                    </Button>
                </View>
            </ModalWrapper>
        )
    }
    setAddTripDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    addTrip() {
        const trip = {
            name: this.state.newTripName,
            description: this.state.newTripDescription,

        }
        if (trip.name && trip.description) {

            stateStore.addTrip(trip)
            this.setAddTripDialog(false)
            this.setState({
                newTripName: '',
                newTripDescription: '',
            })
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