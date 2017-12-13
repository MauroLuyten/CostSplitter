import React, {Component} from 'react'
import {StyleSheet, View, Alert} from 'react-native'
import {Text, Label, Item, Input, Button} from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class EditTripDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialog: false,
            uid: this.props.uid,
            tripKey: this.props.tripKey,
            newTripName: '',
            newTripDescription: '',
            newTripBudget: ''

        }
    }
    render() {
        return (
            <ModalWrapper
                onRequestClose={() => {
                this.setEditTripDialog(false)
            }}
                style={{
                width: 350,
                height: 'auto',
                padding: 16
            }}
                visible={this.state.dialog}>
                <Text style={{
                    marginBottom: 16
                }}>Edit Trip</Text>
                <Item
                    floatingLabel
                    style={{
                    marginBottom: 16
                }}>
                    <Label>Name</Label>
                    <Input
                        value={this.state.newTripName}
                        selectionColor="#5067FF"
                        onChangeText={(name) => {
                        this.setState({newTripName: name})
                    }}
                        autoFocus={true}/>
                </Item>
                <Item
                    floatingLabel
                    style={{
                    marginBottom: 16
                }}>
                    <Label>Description</Label>
                    <Input
                        value={this.state.newTripDescription}
                        selectionColor="#5067FF"
                        onChangeText={(description) => {
                        this.setState({newTripDescription: description})
                    }}
                        autoFocus={false}/>
                </Item>
                <Item
                    floatingLabel
                    style={{
                    marginBottom: 16
                }}>
                    <Label>Budget</Label>
                    <Input
                        value={this.state.newTripBudget && this
                        .state
                        .newTripBudget
                        .toString()}
                        keyboardType='numeric'
                        selectionColor="#5067FF"
                        onChangeText={(budget) => {
                        this.setState({newTripBudget: budget})
                    }}
                        autoFocus={false}/>
                </Item>
                <View style={styles.buttonContainer}>
                    <Button transparent small onPress={() => this.setEditTripDialog(false)}>
                        <Text
                            style={{
                            color: '#5067FF'
                        }}>Cancel</Text>
                    </Button>
                    <Button primary small onPress={() => this.editTrip()}>
                        <Text
                            style={{
                            color: 'white'
                        }}>Confirm</Text>
                    </Button>
                </View>
            </ModalWrapper>
        )
    }
    componentWillMount() {
        const trip = stateStore.getTrip(this.props.tripKey)
        this.setState({
            newTripName: trip.name, 
            newTripDescription: trip.description,
            newTripBudget: trip.budget
        })
    }
    setEditTripDialog(visible) {
        this.setState({dialog: visible})
    }
    editTrip() {
        const trip = {
            name: this.state.newTripName,
            description: this.state.newTripDescription,
            budget: this.state.newTripBudget
        }
        if (trip.name && trip.description && trip.budget) {

            stateStore.editTrip(this.props.tripKey, trip)
            this.setEditTripDialog(false)

        } else {
            Alert.alert('Field missing', 'Every field must be filled in!', [
                {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed')
                }
            ], {cancelable: false})
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