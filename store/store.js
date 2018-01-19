import { observable, action, computed } from 'mobx'
import { firebaseApp } from '../firebaseconfig'
import { ListView } from "react-native";
import {AsyncStorage, NetInfo} from 'react-native'
import {create, persist} from 'mobx-persist'


class Splitter {
    constructor(key, name,amount,paid){
        this.key = key
        this.name = name
        this.amount = amount
        this.paid = paid
    }
    @persist @observable key = ''
    @persist @observable name = ''
    @persist @observable amount = 0
    @persist @observable paid = 0
}
class Event {
    constructor(key, name, description, category, amount, currency, date){
        this.key = key
        this.name = name
        this.description = description
        this.currency = currency
        this.amount = amount
        this.category = category
        this.date = date
    }
    @persist @observable key = ''
    @persist @observable name = ''
    @persist @observable description = ''
    @persist @observable category = ''
    @persist @observable amount = 0
    @persist @observable currency = ''
    @persist @observable date = ''
    @persist('map', Splitter) @observable splitters = new Map()
}
class Trip {
    
    constructor(key, name, description, budget, currencies, selectedCurrency){
        this.key = key
        this.name = name
        this.description = description
        this.budget = budget
        this.currencies = currencies
        this.selectedCurrency = selectedCurrency
    }
    @persist @observable key = ''
    @persist @observable name = ''
    @persist @observable description = ''
    @persist @observable budget = ''
    @persist @observable selectedCurrency = ''
    @persist('list') @observable currencies = []
    @persist('map', Event) @observable events = new Map()
    //@persist @observable totalAmount = 0
}
class Currency {
    constructor(name, rate){
        // key naam , value rate
        this.name = name
        this.rate = rate
    }
    @persist @observable  name = ''
    @persist @observable rate = 0
}
class Transaction {
    constructor(splitterName, tripName, eventName, amount, currency) {
        this.splitterName = splitterName,
        this.tripName = tripName,
        this.eventName = eventName,
        this.amount = amount,
        this.currency = currency
    }
    @persist @observable splitterName = ''
    @persist @observable tripName = ''
    @persist @observable eventName = ''
    @persist @observable amount = 0
    @persist @observable currency = ''
}
class Person {
    constructor(key, name) {
        this.key = key,
        this.name = name
    }
    @persist @observable name = ''
    @persist @observable key = ''
}

class StateStore {
    @persist('object') @observable user = {}
    @persist('map', Trip) @observable trips = new Map()
    @persist('map', Transaction) @observable transactions = new Map()
    @persist('map', Person) @observable persons = new Map()
    @persist('object') @observable error = {}
    currenciesArray = ['EUR', 'AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'GBP', 'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'MXN', 'MYR', 'NOK' , 'NZD', 'PHP', 'PLN',
    'RON', 'RUB', 'SEK', 'SGD', 'THB', 'TRY', 'USD', 'ZAR']
    @observable online = false
    @persist('map', Currency) @observable currencies = new Map()


    getRateAPI = (url) => {
        return fetch(url).then(response => response.json());
    }
    addCurrency(currency){
        this.currencies.set(currency.name, currency)
    }
    getCurrency(key){
        return this.currencies.get(key)
    }
    amountToEuro(currencyName, amount){
        const currency = this.getCurrency(currencyName)
        return amount / currency.rate
    }
    amountToCurrency(currencyName, amount){
        const currency = this.getCurrency(currencyName)
        return amount * currency.rate
    }
    convertAmount(baseCurrency, targetCurrency, amount){
        return this.amountToCurrency(targetCurrency, this.amountToEuro(baseCurrency, amount)) 
    }
    loadCurrencies(){
        NetInfo.isConnected.fetch().then(isConnected => {
            if(isConnected){
                this.getRateAPI('https://api.fixer.io/latest').then((response) =>{
                    const keys = Object.keys(response.rates)
                    for (let currency of keys){
                        let currencyValue = response.rates[currency]
                        this.addCurrency(new Currency(currency, currencyValue))
                    }
                    this.addCurrency(new Currency('EUR', parseFloat(1.00)))
                })
            } else {
                const response = '{"base":"EUR","date":"2017-12-29","rates":{"AUD":1.5346,"BGN":1.9558,"BRL":3.9729,"CAD":1.5039,"CHF":1.1702,"CNY":7.8044,"CZK":25.535,"DKK":7.4449,"GBP":0.88723,"HKD":9.372,"HRK":7.44,"HUF":310.33,"IDR":16239.0,"ILS":4.1635,"INR":76.606,"JPY":135.01,"KRW":1279.6,"MXN":23.661,"MYR":4.8536,"NOK":9.8403,"NZD":1.685,"PHP":59.795,"PLN":4.177,"RON":4.6585,"RUB":69.392,"SEK":9.8438,"SGD":1.6024,"THB":39.121,"TRY":4.5464,"USD":1.1993,"ZAR":14.805}}'
                response = JSON.parse(response)
                const keys = Object.keys(response.rates)
                for (let currency of keys){
                    let currencyValue = response.rates[currency]
                    this.addCurrency(new Currency(currency, currencyValue))
                }
                this.addCurrency(new Currency('EUR', parseFloat(1.00)))
            }
        })
    }


    generateKey() {
        return firebaseApp.database().ref().push().key
    }
    addPerson(key, name) {
        if(name!==''){
            this.persons.set(key, new Person(key, name))
        }
    }
    getPerson(key){
        if(key!==''){
            return this.persons.get(key)
        }
    }
    getPersons() {
        let personsArray = []
        this.persons.keys().forEach(key => {
            let person = this.persons.get(key)
            personsArray.push(person)
        });
        return personsArray
    }
    removePerson(key) {
        if(key!==''){
            this.persons.delete(key)
        }
    }

    clearStore(){
        this.trips.clear()
        this.transactions.clear()
        this.persons.clear()
    }

    /* getNewRateTripBudget(tripKey, oldCurrency, newCurrency){
        const trip = this.getTrip(tripKey)
        trip.budget = parseFloat(this.convertAmount(oldCurrency, newCurrency,trip.budget)).toFixed(2)
        trip.selectedCurrency = newCurrency
    } */

    addTrip(trip) {
        let key = this.generateKey()
        trip.budget = this.amountToEuro(trip.selectedCurrency, trip.budget)
        this.trips.set(key, new Trip(key, trip.name, trip.description, parseFloat(trip.budget), trip.currencies, trip.selectedCurrency))
        if (this.online) {
            firebaseApp.database().ref(`users/${this.user.uid}/trips`).child(key).set(trip)
                .then()

        }
    }
    getTrip(tripKey) {
        return this.trips.get(tripKey)
    }
    getTrips(){
        let tripsArray = []
        this.trips.values().slice().forEach(trip=>{
            tripsArray.push(new Trip(trip.key, trip.name, trip.description, trip.budget))
        })
        return tripsArray
    }
    getTotalPaidTrip(tripKey){
        let total = 0
        this.getEvents(tripKey).forEach(event =>{
            total += this.getTotalPaidEvent(tripKey, event.key)
        })
        return total
    }
    getTotalAmountTrip(tripKey){
        let total = 0
        //let trip = this.getTrip(tripKey)
        this.getEvents(tripKey).forEach(event =>{
            //total += parseFloat(this.convertAmount(event.currency, trip.selectedCurrency , event.amount))
            total += parseFloat(event.amount)
        })
        return total
    }
    editTrip(tripKey, trip) {
        const oldTrip = this.trips.get(tripKey)
        trip.budget = stateStore.amountToEuro(trip.selectedCurrency, trip.budget)
        oldTrip.name = trip.name
        oldTrip.description = trip.description
        oldTrip.budget = parseFloat(trip.budget)
        oldTrip.currencies = trip.currencies
        oldTrip.selectedCurrency = trip.selectedCurrency
        this.trips.set(tripKey, oldTrip)
    }
    changeTripCurrency(tripKey,currencyName){
        const oldTrip = this.trips.get(tripKey)
        oldTrip.selectedCurrency = currencyName
        this.trips.set(tripKey, oldTrip)
    }
    removeTrip(tripKey) {
        this.trips.delete(tripKey)
        if (this.online) {
            firebaseApp.database().ref(`users/${this.user.uid}/trips`).child(tripKey).remove()
        }
    }
    addEvent(tripKey, event) {
        event.splitters = observable.map()
        const key = this.generateKey()
        event.amount = this.amountToEuro(event.currency, event.amount)
        this.trips.get(tripKey).events.set(key,new Event(
            key,
            event.name, 
            event.description, 
            event.category, 
            parseFloat(event.amount), 
            event.currency, 
            event.date))
        if (this.online) {
            database().ref(`users/${this.user.uid}/trips`)
                .child(tripKey)
                .child('events')
                .child(newEvent.key)
                .set(event)
        }
    }
    getEvent(tripKey,eventKey){
        return this.trips.get(tripKey).events.get(eventKey)
    }
    getEvents(tripKey) {
        let eventsArray = []
        this.trips.get(tripKey).events.values().forEach(event => {
            let newEvent = new Event(
                event.key,
                event.name, 
                event.description, 
                event.category, 
                parseFloat(event.amount), 
                event.currency, 
                event.date)
                newEvent.splitters = this.getSplitters(tripKey, event.key)
            eventsArray.push(newEvent)
        });
        return eventsArray
    }
    getTotalPaidEvent(tripKey,eventKey){
        let total = 0
        this.getSplitters(tripKey,eventKey).forEach(splitter => {
            total += parseFloat(splitter.paid)
        });
        return total
    }
    getTotalAmountEvent(tripKey, eventKey){
        let total = 0
        this.getSplitters(tripKey,eventKey).forEach(splitter => {
            total += parseFloat(splitter.amount)
        });
        return total
    }
    getEventDivision(tripKey, eventKey){
        let equally = true
        let splitters = this.getSplitters(tripKey, eventKey)
        if(splitters.length==0){
            equally = false
        } else{
            let firstAmount = splitters[0].amount
            splitters.forEach(splitter => {
                if(splitter.amount!==firstAmount){
                    equally = false
                }
            })
        }
        return equally ? "Equally" : "Individually"
    }
    divideEvent(tripKey, eventKey, eventDivision, amountType, amount){
        const currentDivision = this.getEventDivision(tripKey, eventKey)
        const event = this.getEvent(tripKey, eventKey)
        if(eventDivision=="Equally"){
            if(amountType=="Fixed Amount"){
                this.setSplitterAmounts(tripKey, eventKey, parseFloat(amount))
            }
            if(amountType=="Custom Percentage"){
                this.setSplitterAmounts(tripKey, eventKey, parseFloat(event.amount*amount/100))
            }
            if(amountType=="Equal Share"){
                this.setSplitterAmounts(tripKey, eventKey, parseFloat(event.amount/amount))
            }
        } else if(eventDivision=="Individually"){
            if(currentDivision=="Equally"){
                this.setSplitterAmounts(tripKey, eventKey, parseFloat(0))
            }
        }
    }
    setSplitterAmounts(tripKey, eventKey, amount){
        this.getSplitters(tripKey, eventKey).forEach(splitter => {
            this.getSplitter(tripKey, eventKey, splitter.key).amount = amount
        })
    }
    
    editEvent(tripKey, event){
        const eventKey = event.key
        const oldEvent = this.getEvent(tripKey,eventKey)
        event.amount = this.amountToEuro(event.currency, event.amount)
        oldEvent.name = event.name
        oldEvent.description = event.description
        oldEvent.category = event.category
        oldEvent.amount = parseFloat(event.amount)
        oldEvent.currency = event.currency
        oldEvent.date = event.date
    }
    changeEventCurrency(tripKey, eventKey, currencyName){
        const oldEvent = this.getEvent(tripKey, eventKey)
        oldEvent.currency = currencyName
    }
    removeEvent(tripKey, eventKey){
        this.trips.get(tripKey).events.delete(eventKey)
        if(this.online){
            firebaseApp.database().ref(`users/${this.user.uid}/trips`)
            .child(tripKey)
            .child('events')
            .child(eventKey)
            .remove()
        }
    }
    addSplitter(tripKey, eventKey, splitter, key){
        if(key=='' || key==null){
            key = this.generateKey()
        }
        const event = this.trips.get(tripKey).events.get(eventKey)
        splitter.amount = this.amountToEuro(event.currency, splitter.amount)
        event.splitters.set(
            key,new Splitter(key, splitter.name, parseFloat(splitter.amount), parseFloat(0)))
            this.addPerson(key, splitter.name)
        if(splitter.paid>0){
            this.payDebtSplitter(tripKey, eventKey, key, splitter.paid)
        }
        if(this.online){
            firebaseApp.database().ref(`users/${this.user.uid}/trips`)
            .child(tripKey)
            .child('events')
            .child(eventKey)
            .child('splitters')
            .child(key)
            .set(splitter)
        }
    }

    addTransaction(splitterName, tripName, eventName, amount, currency) {
        const key = this.generateKey()
        this.transactions.set(key, new Transaction(splitterName, tripName, eventName, parseFloat(amount).toFixed(2), currency))
    }

    removeTransaction(transactionKey) {
        this.transactions.delete(transactionKey)
    }

    getTransactions() {
        let transactionsArray = []
        this.transactions.keys().forEach(key => {
            let transaction = this.transactions.get(key)
            transaction.key = key
            transactionsArray.push(transaction)
        });
        return transactionsArray;
    }

    getSplitter(tripKey, eventKey, splitterKey){
        return this.trips.get(tripKey).events.get(eventKey).splitters.get(splitterKey)
    }
    getSplitters(tripKey, eventKey){
        return this.trips.get(tripKey).events.get(eventKey).splitters.values()
    }

    getAllSplitters() {
        let splittersArray = []
        this.trips.keys().forEach(tripKey => {
            this.trips.get(tripKey).events.keys().forEach(eventKey => {
                this.trips.get(tripKey).events.get(eventKey).splitters.keys().forEach(splitterKey => {
                    let splitter = this.trips.get(tripKey).events.get(eventKey).splitters.get(splitterKey)
                    splitter.key = splitterKey
                    splittersArray.push(splitter)
                })
            })
        })
        return splittersArray;
    }

    getSplittersExpensesTrip(tripKeyParameter) {
        let splittersArray = []
        if(typeof this.getTrip(tripKeyParameter) !== "undefined" && this.getTrip(tripKeyParameter)) {
        this.trips.get(tripKeyParameter).events.keys().forEach(eventKey => {
            this.trips.get(tripKeyParameter).events.get(eventKey).splitters.keys().forEach(splitterKey => {
                let splitter = this.trips.get(tripKeyParameter).events.get(eventKey).splitters.get(splitterKey)
                splitter.eventName = this.trips.get(tripKeyParameter).events.get(eventKey).name
                splitter.currency = this.getEvent(tripKeyParameter, eventKey).currency
                splittersArray.push(splitter)
            })
        })
    }
        return splittersArray
    }

    getExpensesPerCategory(category) {
        let splittersArray = []
        this.trips.keys().forEach(tripKey => {
            this.trips.get(tripKey).events.keys().forEach(eventKey => {
                let event = this.trips.get(tripKey).events.get(eventKey)
                if(event.category == category) {
                   this.trips.get(tripKey).events.get(eventKey).splitters.keys().forEach(splitterKey => {
                       let splitter = this.trips.get(tripKey).events.get(eventKey).splitters.get(splitterKey)
                       splitter.tripName = this.trips.get(tripKey).name
                       splitter.eventName = event.name
                       splitter.currency = event.currency
                       splittersArray.push(splitter)
                   })
                }
            })
        })
        return splittersArray
    }

    getTransactionsSplitter(splitterKey) {
        let transactionArray = []
        let splitter = this.getPerson(splitterKey)
        if(typeof splitter !== "undefined" && splitter) {
        this.transactions.keys().forEach(transactionKey => {
            let transaction = this.transactions.get(transactionKey)
            if(transaction.splitterName === splitter.name) {
                transactionArray.push(transaction)
            }
        })
    }
        return transactionArray;
    }

    getExpensesPerDayPerson(splitterParameter, day) {
        let splittersArray = []
        if(day === "All") {
            if(splitterParameter !== null) {
                this.trips.keys().forEach(tripKey => {
                    this.trips.get(tripKey).events.keys().forEach(eventKey => {
                            this.trips.get(tripKey).events.get(eventKey).splitters.keys().forEach(splitterKey => {
                                let splitter = this.getPerson(splitterKey)
                                if(splitter.key === splitterParameter) {
                                    let splitterAdd = this.getSplitter(tripKey, eventKey, splitterKey)
                                    splitterAdd.tripName = this.getTrip(tripKey).name
                                    splitterAdd.currency = this.getEvent(tripKey,eventKey).currency
                                    splittersArray.push(splitterAdd)
                                }
                        })
                    })
                })
            }
        } else {
            if(splitterParameter !== null) {
                this.trips.keys().forEach(tripKey => {
                    this.trips.get(tripKey).events.keys().forEach(eventKey => {
                        if(day === this.getEvent(tripKey,eventKey).date) {
                            this.trips.get(tripKey).events.get(eventKey).splitters.keys().forEach(splitterKey => {
                                let splitter = this.getPerson(splitterKey)
                                if(splitter.key === splitterParameter) {
                                    let splitterAdd = this.getSplitter(tripKey, eventKey, splitterKey)
                                    splitterAdd.tripName = this.getTrip(tripKey).name
                                    splitterAdd.currency = this.getEvent(tripKey,eventKey).currency
                                    splittersArray.push(splitterAdd)
                                }
                            })
                        }
                    })
                })
            }
        }
        return splittersArray
    }

    getExpenseDays() {
        let daysArray = []
        this.trips.keys().forEach(tripKey => {
            this.trips.get(tripKey).events.keys().forEach(eventKey => {
                let day = this.getEvent(tripKey,eventKey).date
                daysArray.push(day)
            })
        })

        let uniqueArray = Array.from(new Set(daysArray))
        return uniqueArray
    }

    getAllEvents() {
        let eventsArray = []
        this.trips.keys().forEach(tripKey => {
            this.trips.get(tripKey).events.keys().forEach(eventKey => {
                let event = this.getEvent(tripKey, eventKey)
                event.key = eventKey
                eventsArray.push(event)
            })
        })
        return eventsArray;
    }

    getSplittersEvent(eventKeyParameter) {
        let splittersArray = []
        if(typeof eventKeyParameter !== "undefined" && eventKeyParameter) {
        this.trips.keys().forEach(tripKey => {
            this.trips.get(tripKey).events.keys().forEach(eventKey => {
                if(eventKey == eventKeyParameter) {
                    this.trips.get(tripKey).events.get(eventKey).splitters.keys().forEach(splitterKey => {
                        let splitter = this.getSplitter(tripKey, eventKey, splitterKey)
                        splitter.tripName = this.getTrip(tripKey).name
                        splitter.currency = this.getEvent(tripKey,eventKey).currency
                        splittersArray.push(splitter)
                    })
                }
            })
        })
    }
        return splittersArray;
    }

    getTotalExpensesPersonCategory(splitterKeyParameter, category) {
        let result = []
        let totalPaid = 0
        let totalDue = 0
        let totalRecPay = 0
        if(typeof splitterKeyParameter !== "undefined" && splitterKeyParameter) {
            if(typeof category !== "undefined" && category) {
                result.push(this.getPerson(splitterKeyParameter).name)
                this.trips.keys().forEach(tripKey => {
                    this.trips.get(tripKey).events.keys().forEach(eventKey => {
                        let expense = this.getEvent(tripKey, eventKey)
                        if(expense.category === category) {
                            this.trips.get(tripKey).events.get(eventKey).splitters.keys().forEach(splitterKey => {
                                let splitter = this.getSplitter(tripKey, eventKey, splitterKey)
                                if(splitterKeyParameter === splitterKey) {
                                    totalPaid += parseFloat(splitter.paid)
                                    totalDue += parseFloat(splitter.amount)
                                    totalRecPay += parseFloat(splitter.amount - splitter.paid)
                                }
                            })
                        }
                    })
                })
            }
        }
        else {
            result.push("/")
        }

        result.push(totalPaid.toFixed(2))
        result.push(totalDue.toFixed(2))
        result.push(totalRecPay.toFixed(2))
        return result
    }

    getTripsWithSelectedCurrency(){
        let tripsArray = []
        this.trips.values().slice().forEach(trip=>{
            tripsArray.push(new Trip(trip.key, trip.name, trip.description, trip.budget, trip.selectedCurrency))
        })
        return tripsArray
    }

    editSplitter(tripKey, eventKey, splitter){
        const event = this.trips.get(tripKey).events.get(eventKey)
        const oldSplitter = event.splitters.get(splitter.key)
        splitter.amount = this.amountToEuro(event.currency, splitter.amount)
        splitter.paid = this.amountToEuro(event.currency, splitter.paid)
        oldSplitter.name = splitter.name
        oldSplitter.amount = splitter.amount
        oldSplitter.paid = splitter.paid
    }
    removeSplitter(tripKey, eventKey, splitterKey){
        this.trips.get(tripKey).events.get(eventKey).splitters.delete(splitterKey)
    }

    payDebtSplitter(tripKey, eventKey, splitterKey, paid) {
        const trip = this.getTrip(tripKey)
        const event = trip.events.get(eventKey)
        const splitter = event.splitters.get(splitterKey)
        paid = this.amountToEuro(event.currency, paid)
        splitter.paid = parseFloat(splitter.paid) + paid
        this.addTransaction(splitter.name, trip.name, event.name, this.amountToCurrency(event.currency,paid), event.currency)
    }

    /* login(username, password) {
        firebaseApp.auth().signInWithEmailAndPassword(`${username}@costsplitter.com`, password)
            .then(user => {
                this.setUser(user)
            }).catch(error => {
                this.error = error
            })
    }
    register(username, password) {
        firebaseApp.auth().createUserWithEmailAndPassword(`${username}@costsplitter.com`, password)
            .then((data) => {
                firebaseApp.database().ref(`users/${data.uid}`).set({
                    email: `${username}@costsplitter.com`,
                    username: username,
                    trips: 0
                })
            }).catch((error) => {
                this.error = error
            })
    }
    logout() {
        firebaseApp
            .auth()
            .signOut().then(() => {
                this.setUser({})
                this.trips = []
            })
            .catch(error => {
                this.error = error
            })
    }
    setUser(user) {
        this.user = user
        if(user){
            //this.loadTrips()
        }
    } */
    /*
    loadTrips() {
        if (this.user) {
            firebaseApp
            .database()
            .ref(`users/${this.user.uid}/trips`).on('value', (snap) => {
                this.trips = []
                snap.forEach((item) => {
                    let trip = item.val()
                    trip.key = item.key
                    this.trips.push(trip)
                })
            })
        }
    }
    addTrip(trip){
        firebaseApp.database().ref(`users/${this.user.uid}/trips`).push(trip)
        .then()
        .catch(error => {
            this.error=error
        })
    }
    removeTrip(key){
        firebaseApp
        .database()
        .ref(`users/${this.user.uid}/trips`).child(key).remove()
        .catch(error=>{
            this.error=error
        })
    }
    editTrip(trip, key){
        firebaseApp.database().ref(`users/${this.user.uid}/trips`).child(key).update(trip)
        .then()
        .catch(error=> {
            this.error=error
        })
    }
    getTrip(tripKey) {
        return this.trips.find(trip => trip.key === tripKey)
    }
    addSplitterToEvent(eventKey, name, currency, amount, paid) {
        //console.warn(name)
        //console.warn(currency)
        //console.warn(amount)
        //console.warn(paid)
        firebaseApp.database().ref(`users/${this.user.uid}/trips/${tripKey}/events`).push({
            name: name,
            currency: currency,
            amount: amount,
            paid: paid
        })
        .then()
        .catch(error => {
            this.error=error
        })
    } 
        getSplitterGeneral(splitterKey) {
        let splitter = null;
        this.trips.keys().forEach(tripKey => {
            this.trips.get(tripKey).events.keys().forEach(eventKey => {
                this.trips.get(tripKey).events.get(eventKey).splitters.keys().forEach(splitterKeyCheck => {
                    if(splitterKeyCheck === splitterKey) {
                        splitter = this.trips.get(tripKey).events.get(eventKey).splitters.get(splitterKey)
                    }
                })
            })
        })
        return splitter
    } */

}
const stateStore = new StateStore()
    const hydrate = create({
        storage: AsyncStorage,
        jsonify: true
    })
    hydrate('state', stateStore)
export default stateStore;