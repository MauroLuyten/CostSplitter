import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class RemoveEventDialog extends Component {
    constructor(props){
        super(props)
        this.state = {
            dialog: false,
            tripKey: this.props.tripKey,
            eventKey: null,
            event: null,
        }
    }
    render() {
        return (
            <ModalWrapper
            onRequestClose={() => { this.setRemoveEventDialog(false) }}
            style={{ width: 350, height: 'auto', padding: 16 }}
            visible={this.state.dialog}>
            <Text style={{ marginBottom: 16 }}>Remove Event</Text>
            <Text>Do you want to remove {this.state.event&&this.state.event.name} ?</Text>
            <View style={styles.buttonContainer}>
                <Button transparent small onPress={() => this.setRemoveEventDialog(false)}>
                    <Text style={{ color: '#5067FF' }}>Cancel</Text>
                </Button>
                <Button primary small onPress={() => this.removeEvent()}>
                    <Text style={{ color: 'white' }}>Confirm</Text>
                </Button>
            </View>
        </ModalWrapper>
        )
    }
    setRemoveEventDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    removeEvent() {
        stateStore.removeEvent(this.state.tripKey, this.state.eventKey)
        this.setRemoveEventDialog(false)
    }
}
const styles = StyleSheet.create({
    
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    }
});