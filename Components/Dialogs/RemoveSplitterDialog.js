import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'

export default class RemoveSplitterDialog extends Component {
    constructor(props){
        super(props)
        this.state = {
            dialog: false,
            tripKey: this.props.tripKey,
            eventKey: this.props.eventKey,
            splitterKey: null,
            splitter: null,
        }
    }
    render() {
        return (
            <ModalWrapper
            onRequestClose={() => { this.setRemoveSplitterDialog(false) }}
            style={{ width: 350, height: 'auto', padding: 16 }}
            visible={this.state.dialog}>
            <Text style={{ marginBottom: 16 }}>Remove splitter</Text>
            <Text>Do you want to remove {this.state.splitter&&this.state.splitter.name} ?</Text>
            <View style={styles.buttonContainer}>
                <Button transparent small onPress={() => this.setRemoveSplitterDialog(false)}>
                    <Text style={{ color: '#5067FF' }}>Cancel</Text>
                </Button>
                <Button primary small onPress={() => this.removesplitter()}>
                    <Text style={{ color: 'white' }}>Confirm</Text>
                </Button>
            </View>
        </ModalWrapper>
        )
    }
    setRemoveSplitterDialog(visible) {
        this.setState({
            dialog: visible
        })
    }
    removesplitter() {
        stateStore.removeSplitter(this.state.tripKey, this.state.eventKey, this.state.splitterKey)
        this.setRemoveSplitterDialog(false)
    }
}
const styles = StyleSheet.create({
    
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    }
});