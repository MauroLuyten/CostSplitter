import React, { Component } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Text, Label, Item, Input, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class RemoveTripDialog extends Component {
    constructor(props){
        super(props)
        this.state = {
            dialog: false,
            uid: this.props.uid,
            trip: null,
        }
    }
    render() {
        return (
            <ModalWrapper
            onRequestClose={() => { this.setRemoveTripDialog(false) }}
            style={{ width: 350, height: 'auto', padding: 16 }}
            visible={this.state.dialog}>
            <Text style={{ marginBottom: 16 }}>Remove trip</Text>
            <Text>Do you want to remove {this.state.trip&&this.state.trip.name} ?</Text>
            <View style={styles.buttonContainer}>
                <Button transparent small onPress={() => this.setRemoveTripDialog(false)}>
                    <Text style={{ color: '#5067FF' }}>Cancel</Text>
                </Button>
                <Button primary small onPress={() => this.removeTrip()}>
                    <Text style={{ color: 'white' }}>Confirm</Text>
                </Button>
            </View>
        </ModalWrapper>
        )
    }
    setRemoveTripDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    removeTrip() {
        stateStore.removeTrip(this.state.trip.key)
        this.setRemoveTripDialog(false)
    }
}
const styles = StyleSheet.create({
    
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    }
});