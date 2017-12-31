import { observable, action, computed } from 'mobx'
import { firebaseApp } from '../firebaseconfig'
import { ListView } from "react-native";
import {AsyncStorage} from 'react-native'
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
    @persist @observable date = ''
    @persist @observable currency = 'euro'
    @persist('map', Splitter) @observable splitters = new Map()
}
class Trip {
    constructor(key, name, description, budget){
        this.key = key
        this.name = name
        this.description = description
        this.budget = budget
    }
    @persist @observable key = ''
    @persist @observable name = ''
    @persist @observable description = ''
    @persist @observable budget = ''
    @persist('map', Event) @observable events = new Map()
}

class Transaction {
    constructor(splitterName, tripName, eventName, amount) {
        this.splitterName = splitterName,
        this.tripName = tripName,
        this.eventName = eventName,
        this.amount = amount
    }
    @persist @observable splitterName = ''
    @persist @observable tripName = ''
    @persist @observable eventName = ''
    @persist @observable amount = 0
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
    currencies = ["EUR", "USD", "GBP"]
    @observable online = false
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
    clearTrips(){
        this.trips.clear()
    }
    addTrip(trip) {
        let key = this.generateKey()
        this.trips.set(key, new Trip(key, trip.name, trip.description, parseFloat(trip.budget).toFixed(2)))
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
        return total.toFixed(2)
    }
    getTotalAmountTrip(tripKey){
        let total = 0
        this.getEvents(tripKey).forEach(event =>{
            total += parseFloat(event.amount)
        })
        return total.toFixed(2)
    }
    editTrip(tripKey, trip) {
        const oldTrip = this.trips.get(tripKey)
        oldTrip.name = trip.name
        oldTrip.description = trip.description
        oldTrip.budget = parseFloat(trip.budget).toFixed(2)
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
        this.trips.get(tripKey).events.set(key,new Event(
            key,
            event.name, 
            event.description, 
            event.category, 
            parseFloat(event.amount).toFixed(2), 
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
                parseFloat(event.amount).toFixed(2), 
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
        return total.toFixed(2)
    }
    getTotalAmountEvent(tripKey, eventKey){
        let total = 0
        this.getSplitters(tripKey,eventKey).forEach(splitter => {

            total += parseFloat(splitter.amount)

        });
        return total.toFixed(2)
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
                this.setSplitterAmounts(tripKey, eventKey, parseFloat(amount).toFixed(2))
            }
            if(amountType=="Custom Percentage"){
                this.setSplitterAmounts(tripKey, eventKey, parseFloat(event.amount*amount/100).toFixed(2))
            }
            if(amountType=="Equal Share"){
                this.setSplitterAmounts(tripKey, eventKey, parseFloat(event.amount/amount).toFixed(2))
            }
        } else if(eventDivision=="Individually"){
            if(currentDivision=="Equally"){
                this.setSplitterAmounts(tripKey, eventKey, parseFloat(0).toFixed(2))
            }
        }
    }
    setSplitterAmounts(tripKey, eventKey, amount){
        this.getSplitters(tripKey, eventKey).forEach(splitter => {
            splitter.amount = amount
            this.editSplitter(tripKey, eventKey, splitter)
        })
    }
    editEvent(tripKey, event){
        //const eventKey = event.key
        const oldEvent = this.getEvent(tripKey,event.key)
        oldEvent.name = event.name
        oldEvent.description = event.description
        oldEvent.category = event.category
        oldEvent.amount = parseFloat(event.amount).toFixed(2)
        oldEvent.currency = event.currency
        oldEvent.date = event.date
        //this.trips.get(tripKey).events.set(eventKey, oldEvent)
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
        this.trips.get(tripKey).events.get(eventKey).splitters.set(
            key,new Splitter(key, splitter.name, parseFloat(splitter.amount).toFixed(2), parseFloat(0).toFixed(2)))
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

    addTransaction(splitterName, tripName, eventName, amount) {
        const key = this.generateKey()
        this.transactions.set(key, new Transaction(splitterName, tripName, eventName, parseFloat(amount).toFixed(2)))
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
        /* let splittersArray = []
        this.trips.get(tripKey).events.get(eventKey).splitters.keys().forEach(key => {
            let splitter = this.trips.get(tripKey).events.get(eventKey).splitters.get(key)
            splitter.key = key
            splittersArray.push(splitter)
        });
        return splittersArray */
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
    }

    getSplittersExpensesTrip(tripKey) {
        let splittersArray = []
        if(typeof this.trips.get(tripKey) !== "undefined" && this.trips.get(tripKey)) {
        this.trips.get(tripKey).events.keys().forEach(eventKey => {
            this.trips.get(tripKey).events.get(eventKey).splitters.keys().forEach(splitterKey => {
                let splitter = this.trips.get(tripKey).events.get(eventKey).splitters.get(splitterKey)
                splitter.key = splitterKey
                splitter.eventName = this.trips.get(tripKey).events.get(eventKey).name
                splittersArray.push(splitter)
            })
        })
    }
        return splittersArray
    }

    getExpensesPerCategory(category) {
        let expensesArray = []
        if(typeof category !== "undefined" && category !== "" && category !== null)
        this.trips.keys().forEach(tripKey => {
            this.trips.get(tripKey).events.keys().forEach(eventKey => {
                let event = this.trips.get(tripKey).events.get(eventKey)
                event.key = eventKey
                event.tripName = this.trips.get(tripKey).name
                if(event.category == category) {
                    expensesArray.push(event)
                }
            })
        })
        return expensesArray
    }

    getTransactionsSplitter(splitterKey) {
        let transactionArray = []
        let splitter = this.getSplitterGeneral(splitterKey)
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
                                    //console.warn(totalPaid)
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

    editSplitter(tripKey, eventKey, splitter){
        const oldSplitter = this.getSplitter(tripKey, eventKey, splitter.key)
        oldSplitter.name = splitter.name
        oldSplitter.amount = splitter.amount
        oldSplitter.paid = splitter.paid
    }
    removeSplitter(tripKey, eventKey, splitterKey){
        this.trips.get(tripKey).events.get(eventKey).splitters.delete(splitterKey)
    }

    payDebtSplitter(tripKey, eventKey, splitterKey, amount) {
        const splitter = this.getSplitter(tripKey, eventKey, splitterKey)
        const trip = this.getTrip(tripKey)
        const event = this.getEvent(tripKey, eventKey)
        let newPaid = parseFloat(splitter.paid) + parseFloat(amount)
        this.trips.get(tripKey).events.get(eventKey).splitters.set(
            splitterKey, 
            new Splitter(
                splitter.key,
                splitter.name,
                splitter.amount, 
                newPaid.toFixed(2)
            )
        )
        this.addTransaction(splitter.name, trip.name, event.name, amount)
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
    } */

}
const stateStore = new StateStore()
    const hydrate = create({
        storage: AsyncStorage,
        jsonify: true
    })
    hydrate('state', stateStore)
export default stateStore;