import React, { Component } from 'react'
import { View, StyleSheet} from 'react-native'
import { Content, Container, Text, Button } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { observer } from 'mobx-react'
import stateStore from '../store/store'

@observer
export default class HomeScreen extends Component {
    constructor(props) {
        super(props)
    }
    static navigationOptions = {
        title: 'Home',

    }
    render() {
        const { navigate } = this.props.navigation
        return (
            <Container>
                <Content>
                    <View>
                        <Grid>
                            <Row><Col>
                                <Button rounded style={styles.button} onPress={() => navigate('Overview')}>
                                    <Text style={styles.buttonText}>Overview</Text>
                                </Button>
                            </Col></Row>
                            <Row><Col>
                                <Button rounded style={styles.button} onPress={() => navigate('Currency')}>
                                    <Text style={styles.buttonText}>Currencies</Text>
                                </Button>
                            </Col></Row>
                            <Row><Col>
                                <Button rounded style={styles.button} onPress={() => navigate('Summaries')}>
                                    <Text style={styles.buttonText}>Summaries</Text>
                                </Button>
                            </Col></Row>
                            <Row><Col>
                                <Button rounded style={styles.button} onPress={() => stateStore.clearStore()}>
                                    <Text style={styles.buttonText}>Clear</Text>
                                </Button>
                            </Col></Row>
                        </Grid>
                    </View>
                </Content>
            </Container>
        )
    }
    navigate(route) {
        const { navigate } = this.props.navigation
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