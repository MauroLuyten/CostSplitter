import React, {Component} from 'react'
import {StyleSheet, View, Alert} from 'react-native'
import {Text, Label, Item, Input, Button} from 'native-base';
var ModalWrapper = require('react-native-modal-wrapper').default
import stateStore from '../../store/store'
import SelectMultiple from 'react-native-select-multiple'
import Collapsible from 'react-native-collapsible';

export default class EditTripDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialog: false,
            uid: this.props.uid,
            tripKey: this.props.tripKey,
            newTripName: '',
            newTripDescription: '',
            newTripBudget: '',
            selectedCurrencies: [], 
            isCollapsed: true,
            currenciesArray: [],
            selectedCurrency: ''
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
                <Button primary small onPress={() => this.toggleCollapsible()}>
                    <Text style={{ color: 'white' }}>Toggle Currencies</Text>
                </Button>
                <Collapsible collapsed={this.state.isCollapsed}>
                    <View style={{height: 400}}>
                        <SelectMultiple items={this.state.currenciesArray} selectedItems={this.state.selectedCurrencies} onSelectionsChange={this.onSelectionsChange}/>
                    </View>
                </Collapsible>
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
    componentWillMount() {
        const trip = stateStore.getTrip(this.props.tripKey)
        this.setState({
            newTripName: trip.name, 
            newTripDescription: trip.description,
            newTripBudget: trip.budget,
            selectedCurrencies: trip.currencies,
            currenciesArray: stateStore.currencies.keys(),
            selectedCurrency: trip.selectedCurrency
        })
    }
    setEditTripDialog(visible) {
        this.setState({dialog: visible})
    }
    editTrip() {
        const trip = {
            name: this.state.newTripName,
            description: this.state.newTripDescription,
            budget: this.state.newTripBudget,
            currencies: this.state.selectedCurrencies,
            selectedCurrency: this.state.selectedCurrency
        }
        if (trip.name && trip.description && trip.budget && trip.currencies.length != 0) {
            if(this.checkSelectedCurrency() == false){
                Alert.alert('Warning', this.state.selectedCurrency + ' is used to display your trip!')
            }   else {
                if(this.checkEventCurrencies().length == 0){
                    stateStore.editTrip(this.props.tripKey, trip)
                    this.setEditTripDialog(false)
                }
                else {
                    let text = "There are still events with these currencies: "
                    for (let currency of this.checkEventCurrencies()){
                        text = text + "-" + currency
                    }
                    Alert.alert('Warning', text)
                }
            } 
        } else {
            Alert.alert('Field missing', 'Every field must be filled in!', [
                {
                    text: 'OK',
                    onPress: () => console.log('OK Pressed')
                }
            ], {cancelable: false})
        }
    }
    //checks that the currencies you used in your events are still "selected" -> otherwise there will be inconsistencies
    checkEventCurrencies(){
        let array = []
        for (let event of stateStore.getEvents(this.props.tripKey)){
            let currency = event.currency
            let bool = false
            for (let selectedCurrency of this.state.selectedCurrencies){
                if(currency == selectedCurrency.value){
                    bool = true
                }
            }
            if(bool == false){
                array.push(currency)
            }
        }
        return array
    }
    checkSelectedCurrency(){
        let bool = false
        for (let selectedCurrency of this.state.selectedCurrencies){
            if( this.state.selectedCurrency == selectedCurrency.value){
                bool = true
            }
        }
        return bool
    }
}
const styles = StyleSheet.create({

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    }
});