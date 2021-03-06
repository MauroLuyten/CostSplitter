import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import {Content, Container, Text, Button} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import {observer} from 'mobx-react'
import stateStore from '../store/store'

@observer
export default class SummariesScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        
    }
    static navigationOptions = {
        title: 'Summaries',
    }
    render() {
        const {navigate} = this.props.navigation
        return (
            <Container>
                <Content>
                    <View>
        <Grid>
                <Row><Col><Button rounded style={styles.button} onPress={() => navigate('TripTable')}><Text style={styles.buttonText}>Trip Table</Text></Button></Col></Row>
                <Row><Col><Button rounded style={styles.button} onPress={() => navigate('ExpenseTable')}><Text style={styles.buttonText}>Expense table</Text></Button></Col></Row>
                <Row><Col><Button rounded style={styles.button} onPress={() => navigate('ExpensesCategory')}><Text style={styles.buttonText}>Expenses/Category</Text></Button></Col></Row>
                <Row><Col><Button rounded style={styles.button} onPress={() => navigate('ExpenseDayPerson')}><Text style={styles.buttonText}>Expenses Person/Day</Text></Button></Col></Row>
                <Row><Col><Button rounded style={styles.button} onPress={() => navigate('TotalExpensePersonCat')}><Text style={styles.buttonText}>Tot. expenses Person/Cat.</Text></Button></Col></Row>
                <Row><Col><Button rounded style={styles.button} onPress={() => navigate('AllTransactions')}><Text style={styles.buttonText}>All Transactions</Text></Button></Col></Row>
                <Row><Col><Button rounded style={styles.button} onPress={() => navigate('TransactionsPP')}><Text style={styles.buttonText}>Transactions P.P</Text></Button></Col></Row>
        </Grid>
    </View>
                </Content>
            </Container>
        )
    }
    navigate(route) {
        const {navigate} = this.props.navigation
        navigate(route)
    }
}

const styles = StyleSheet.create({
    status: {
        fontSize: 30,
        textAlign: 'center'
    },
    button: {
        marginTop: 20,
        alignSelf: 'center'
    },
    buttonText: {
        fontSize: 20,
    },
});