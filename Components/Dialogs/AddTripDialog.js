import React, { Component } from 'react'
import { StyleSheet, View, Alert } from 'react-native'
import { Text, Label, Item, Input, Button } from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'
import SelectMultiple from 'react-native-select-multiple'
import Collapsible from 'react-native-collapsible';


export default class AddTripDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialog: false,
            uid: this.props.uid,
            newTripName: '',
            newTripDescription: '',
            newTripBudget: '',
            selectedCurrencies: [{label: 'EUR', value: 'EUR' }], 
            isCollapsed: true,
            currenciesArray: []
        }
    }
    render() {
        return (

            <ModalWrapper over
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
                <Item floatingLabel style={{ marginBottom: 16 }}>
                    <Label>Budget</Label>
                    <Input
                        value={this.state.newTripBudget.toString()}
                        keyboardType='numeric'
                        selectionColor="#5067FF"
                        onChangeText={(budget) => {
                            this.setState({
                                newTripBudget: budget
                            })
                        }}
                        autoFocus={false} />
                </Item>
                <Label>Currency</Label>
                <Button primary small onPress={() => this.toggleCollapsible()}>
                    <Text style={{ color: 'white' }}>Toggle Currencies</Text>
                </Button>
                <Collapsible collapsed={this.state.isCollapsed}>
                    <View style={{height: 400}}>
                        <SelectMultiple items={this.state.currenciesArray} selectedItems={this.state.selectedCurrencies} onSelectionsChange={this.onSelectionsChange}/>
                    </View>
                </Collapsible>
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
    componentWillMount(){
        this.setState({
            currenciesArray: stateStore.currencies.keys()
        })
    }

    //currencies
    onSelectionsChange = (selectedCurrencies) => {
        this.setState({ selectedCurrencies })
      }
    toggleCollapsible(){
        if(this.state.isCollapsed){
            this.setState({
                isCollapsed: false
            })
        } else {
            this.setState({
                isCollapsed: true
            })
        }
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
            budget: this.state.newTripBudget,
            currencies: this.state.selectedCurrencies

        }
        if (trip.name && trip.description && trip.budget && trip.currencies.length != 0) {

            stateStore.addTrip(trip)
            this.setAddTripDialog(false)
            this.setState({
                newTripName: '',
                newTripDescription: '',
                newTripBudget: '',
                selectedCurrencies: ['EUR']
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