/* Basic Result Viewer */

import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Modal, Dimensions, Alert } from 'react-native';
import { Button } from 'react-native-paper';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Card from '../myComponents/card'; //Disregard first 
import { BarChart } from "react-native-chart-kit";

var totalCost = 0;
var totalPax = 0;
var paxFixed = 0;

export default class dataViewerScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            results: {
                result: [{
                    adType: '',
                    payment: '',
                    optionId: '',
                    companyId: '',
                    amount: '',
                    audienceReached: ''
                }]
            },
            chartResults: {
                optionid: '',
                cost: '',
                audiencereach: ''
            },
            chartResultsCheck: {
                optionid: '',
                cost: '',
                audiencereach: ''
            },
            loaded: true,
            error: null,
            optionIds: '',
            budget: '',
            modalOpen: false,
            chartOptionid: [],
            chartCost: [],
            chartAudiencereach: [],
            totalCost: '',
            totalPax: '',
        }
        this.getResult = this.getResult.bind(this);
        this.getChart = this.getChart.bind(this);
    }
     baseURL = 'http://192.168.229.1:3000';
    //baseURL = 'http://192.168.86.1:3000';
    getResult = (ev) => {
        console.log('this.state.optionIds: ' + this.state.optionIds);
        console.log('this.state.budget: ' + this.state.budget);
        this.setState({ loaded: false, error: null });
        let url = this.baseURL + `/basic/result?optionIds=${this.state.optionIds}&budget=${this.state.budget}`;

        let req = new Request(url, {
            method: 'GET',
        });

        fetch(req)
            .then(response => response.json())
            .then(this.showResult)
            .catch(this.error)
    }
    showResult = (data) => {
        for (var i = 0; i < data.result.length; i++) {
            totalCost += data.result[i].amount;
            totalPax += data.result[i].audienceReached
        }
        totalPax = parseFloat(totalPax.toFixed(3));
        this.setState({ totalCost: totalCost });
        this.setState({ totalPax: totalPax });

        this.setState({
            results: data
        });

        let resultsCopy = JSON.parse(JSON.stringify(this.state.results))

        console.log("resultsCopy: " + resultsCopy.result[0])
        //toFixed(3) audienceReached
        for (var i = 0; i < data.result.length; i++) {
            resultsCopy.result[i].audienceReached = resultsCopy.result[i].audienceReached.toFixed(3)
        }
        this.setState({
            results : resultsCopy 
        }, () => {
            this.setState({ loaded: true }); 
        }) 
    }
    getChart = (ev) => {
        console.log('this.state.optionIds: ' + this.state.optionIds)
        this.setState({ loaded: false, error: null });
        let url = this.baseURL + `/basic/allChartData?optionIds=${this.state.optionIds}`;

        let req = new Request(url, {
            method: 'GET',
        });

        fetch(req)
            .then(response => response.json())
            .then(this.showChart)
            .catch(this.error)
    }
    showChart = (data) => {
        this.setState({
            chartResultsCheck: data
        });
        console.log("this.state.chartResultsCheck.length: " + this.state.chartResultsCheck.length);
        if(this.state.chartResultsCheck.length == undefined){
            Alert.alert('OOPS!', "Please enter optionIds that are valid!", [
                { text: 'Understood', onPress: () => console.log('Alert closed.') }
            ]);
            this.setState({ loaded: true });
        }else if (this.state.chartResultsCheck.length == 1){
            Alert.alert('OOPS!', "One or more of the optionId you have entered is invalid!", [
                { text: 'Understood', onPress: () => console.log('Alert closed.') }
            ]);
            this.setState({ loaded: true });
        }else{
            this.setState({
                chartResults: data
            });
            for (var i = 0; i < this.state.chartResults.length; i++) {
                this.setState(prevState => ({
                    chartOptionid: [...prevState.chartOptionid, this.state.chartResults[i].optionid],
                    chartCost: [...prevState.chartCost, this.state.chartResults[i].cost],
                    chartAudiencereach: [...prevState.chartAudiencereach, this.state.chartResults[i].audiencereach],
                    // totalCost: [...prevState.totalCost + this.state.chartResults[i].cost],
                    // totalPax: [...prevState.totalPax + this.state.chartResults[i].audiencereach],
                }));
            }
            console.log("this.state.totalCost: " + this.state.totalCost)
            console.log("this.state.totalPax: " + this.state.totalPax)
            this.getResult();
        }
    }
    error = (err) => {
        console.log(err)
        this.setState({ loaded: true, error: err.message });
    }
    clearText() {
        this.setState({
            loaded: true,
            error: null,
            modalOpen: false,
            chartOptionid: [],
            chartCost: [],
            chartAudiencereach: [],
            totalCost: 0,
            totalPax: 0,
            chartResults: '',
            modalOpen: false,
            results: '',
            chartResults: '',
            optionIds: '',
            budget: ''
        })
    }
    clearForComputation() { // Set states for computation.
        totalCost = 0
        totalPax = 0
        this.setState({
            loaded: true,
            error: null,
            modalOpen: false,
            chartOptionid: [],
            chartCost: [],
            chartAudiencereach: [],
            totalCost: 0,
            totalPax: 0,
            chartResults: '',
            modalOpen: false,
            results: '',
            chartResults: ''
        }, () => {
            this.validation(); // Run validation.
        });
    }

    validation() {
        if (this.state.optionIds == '' && this.state.budget == '') {
            Alert.alert('OOPS!', "Please enter at least 2 optionIds and budget!", [
                { text: 'Understood', onPress: () => console.log('Alert closed.') }
            ]);
        }
        else if (this.state.budget == '') {
            this.setState({ optionIds: '' })
            this.setState({ budget: '' })
            Alert.alert('OOPS!', "Please enter a Budget!", [
                { text: 'Understood', onPress: () => console.log('Alert closed.') }
            ]);
        }
        else if (this.state.optionIds == '') {
            this.setState({ optionIds: '' })
            this.setState({ budget: '' })
            Alert.alert('OOPS!', "Please enter at least 2 optionsIds!", [
                { text: 'Understood', onPress: () => console.log('Alert closed.') }
            ]);
        }
        else if (isNaN(this.state.budget)) {
            this.setState({ optionIds: '' })
            this.setState({ budget: '' })
            Alert.alert('OOPS!', "Please enter a numeric value for Budget!", [
                { text: 'Understood', onPress: () => console.log('Alert closed.') }
            ]);
        }
        else if (this.state.budget <= 0) {
            this.setState({ optionIds: '' })
            this.setState({ budget: '' })
            Alert.alert('OOPS!', "Please enter a numeric value bigger than $0.00!", [
                { text: 'Understood', onPress: () => console.log('Alert closed.') }
            ]);
        }
        else if (this.state.optionIds.search(",") == -1) {
            this.setState({ optionIds: '' })
            this.setState({ budget: '' })
            Alert.alert('OOPS!', "Please enter at least 2 optionIds, seperated by a comma!", [
                { text: 'Understood', onPress: () => console.log('Alert closed.') }
            ]);
        }
        else {
            var optionList;
            optionList = this.state.optionIds.toString().split(','); //optionList array
            if (optionList.length < 2) {
                this.setState({ optionIds: '' })
                this.setState({ budget: '' })
                Alert.alert('OOPS!', "Please enter at least 2 optionIds and budget!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
            }
            else {
                var lengthCheck = [];
                // var isIntCheck = [];
                for (let i = 0; i < optionList.length; i++) {
                    optionList[i] = parseInt(optionList[i]);
                    optionList[i] = optionList[i].toString();

                    if (optionList[i].length == 10) {
                        lengthCheck[i] = true;
                        console.log("Pass2" + optionList[i]);
                    } else {
                        lengthCheck[i] = false;
                        console.log("Failed2" + optionList[i]);
                    }
                    // optionList[i] = optionList[i].toString();
                }
                if (!lengthCheck.every(v => v == true)) {
                    this.setState({ optionIds: '' })
                    this.setState({ budget: '' })
                    Alert.alert('OOPS!', "Please make sure your optionIds are exactly 10 digits each, and digits only!", [
                        { text: 'Understood', onPress: () => console.log('Alert closed.') }
                    ]);
                }
                else {
                    this.getChart(); //Get chart
                }
            }
        }
    }

    checkModel(){
        if(this.state.results.result[0].amount == ''){
          this.setState({ modalOpen: false });
        }else{
          this.setState({ modalOpen: true });
        }
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.row1}>
                    <View style={styles.row1Title}>
                        <Text style={styles.filterText}>Enter:</Text>

                    </View>
                    <View style={styles.row1Params}>
                        <View style={styles.textInputContainer}>
                            <View style={styles.icon}>
                                <Ionicons name="ios-menu" size={30}></Ionicons>
                            </View>
                            <TouchableOpacity style={styles.paramArea}>
                                <TextInput
                                    style={[styles.bodyText]}
                                    placeholder="OptionIds"
                                    placeholderTextColor='rgb(0,0,0)'
                                    multiline={false}
                                    onChangeText={(text) => {this.setState({optionIds: text})}}
                                    value={this.state.optionIds}
                                    keyboardType='numeric' />
                            </TouchableOpacity>
                            <Button style={styles.buttonCompute} mode='contained' onPress={() => { this.clearForComputation() }}>
                                <Text style={styles.testText}>Compute</Text>
                            </Button>
                        </View>


                        <View style={styles.textInputContainer}>
                            <View style={styles.icon}>
                                <FontAwesome name="dollar" size={30}></FontAwesome>
                            </View>
                            <TouchableOpacity style={styles.paramArea}>
                                <TextInput
                                    style={[styles.bodyText]}
                                    placeholder="Budget"
                                    placeholderTextColor='rgb(0,0,0)'
                                    multiline={true}
                                    onChangeText={(text) => {this.setState({ budget: text.toString().split(".").map((el,i)=>i?el.split("").slice(0,2).join(""):el).join(".")})}}
                                    value={this.state.budget}
                                    keyboardType='numeric' />
                            </TouchableOpacity>
                            <Button style={styles.buttonClear} mode='contained' onPress={() => { this.clearText() }}>
                                <Text style={styles.testText}>Clear</Text>
                            </Button>
                        </View>
                    </View>
                </View>

                <View style={styles.row2}>
                    <View style={styles.row2Results}>

                        <View style={styles.resultsArea}>
                            {!!this.state.totalCost && !!this.state.totalPax && (
                                <Text style={styles.resultsText}>Results: ${totalCost} for {totalPax}pax</Text>
                            )}
                            {/* <Text style={styles.resultsText}>Results: $10001 for 10001 pax</Text>  */}
                        </View>
                        <Button style={styles.tabButtonContainer} mode='contained' onPress={() => {this.checkModel()}}>
                            <Ionicons style={styles.tabButton} name="ios-menu" size={30}></Ionicons>
                        </Button>

                    </View>
                    <View style={styles.row2Chart}>

                        {!this.state.loaded && (
                            <ActivityIndicator size="large" color="black"></ActivityIndicator>
                        )}

                        {!!this.state.error && (
                            <Text style={styles.err}>{this.state.error}</Text>
                        )}

                        <View>
                            <ScrollView>
                                {!!this.state.chartResults && !!this.state.chartResults.length > 0 && (
                                    <BarChart
                                        data={{
                                            labels: this.state.chartOptionid,
                                            datasets: [
                                                {
                                                    data: this.state.chartCost,
                                                },
                                            ],
                                        }}
                                        width={Dimensions.get('window').width - 16}
                                        height={220}
                                        yAxisSuffix={'pax'}
                                        fromZero={true}
                                        chartConfig={{
                                            backgroundColor: '#1cc910',
                                            backgroundGradientFrom: '#eff3ff',
                                            backgroundGradientTo: '#efefef',
                                            decimalPlaces: 2,
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            style: {
                                                borderRadius: 16,
                                            },
                                        }}
                                        style={{
                                            marginVertical: 8,
                                            borderRadius: 16,
                                            marginLeft: 10,
                                        }}
                                    />
                                )}

                                {!!this.state.chartResults && !!this.state.chartResults.length > 0 && (
                                    <BarChart
                                        data={{
                                            labels: this.state.chartOptionid,
                                            datasets: [
                                                {
                                                    data: this.state.chartAudiencereach,
                                                },
                                            ],
                                        }}
                                        width={Dimensions.get('window').width - 16}
                                        height={220}
                                        yAxisLabel={'$'}
                                        fromZero={true}
                                        chartConfig={{
                                            backgroundColor: '#1cc910',
                                            backgroundGradientFrom: '#eff3ff',
                                            backgroundGradientTo: '#efefef',
                                            decimalPlaces: 2,
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            style: {
                                                borderRadius: 16,
                                            },
                                        }}
                                        style={{
                                            marginVertical: 8,
                                            borderRadius: 16,
                                            marginLeft: 10,

                                        }}
                                    />
                                )}
                            </ScrollView>
                        </View>

                        <Modal visible={this.state.modalOpen}>

                            <View style={styles.tabulationArea}>
                                <View style={styles.modalBar}>
                                    <Ionicons.Button name="chevron-back" size={25} backgroundColor='#009387' onPress={() => this.setState({ modalOpen: false })}>
                                        <Text style={styles.barText}>Tabulation</Text>

                                    </Ionicons.Button>
                                </View>
                                {!!this.state.results.result && !!this.state.results.result.length > 0 && (this.state.results.result.map((data, i) => (
                                    <View key={i} style={styles.cardContent}>
                                        <Text style={styles.cardText}>{data.payment} payment for</Text>
                                        <Text style={styles.cardText}>option {data.optionId}</Text>
                                        <Text style={styles.cardText}>from company {data.companyId}</Text>
                                        <Text style={styles.cardText}>${data.amount} for {data.audienceReached}pax</Text>
                                    </View>
                                ))
                                )}
                            </View>

                        </Modal>
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    barText: {
        color: 'white',
        fontSize: 20
    },
    cardText: {
        color: 'black',
        fontSize: 20
    },
    cardContent: {
        marginHorizontal: 18,
        marginVertical: 10,
        // backgroundColor: 'blue',
        fontSize: 50,
        // borderWidth: 3,
        borderBottomWidth: 3,
        borderColor: '#000000',
    },
    modalBar: {
        //flexDirection: 'row',
        //marginTop: "50%",
        height: 45,
        width: '100%',
        backgroundColor: '#009387',
        color: 'white',
    },
    tabulationArea: {
        // backgroundColor: 'green',
        borderRadius: 6,
        // elevation: 3,
        backgroundColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "#333",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        fontSize: 50,


        // marginHorizontal: 4,
        // marginVertical: 6,
    },
    container: {
        flex: 1,
        // backgroundColor: 'powderblue',
        flexDirection: 'column',
        fontFamily: 'Montserrat-Regular',
    },
    // Row 1 -----------------
    row1: {
        flex: 3,
        backgroundColor: 'skyblue',
        flexDirection: 'column'

    },

    row1Title: {
        flex: 1,
        // backgroundColor: 'blue'
    },
    filterText: {
        height: 30,
        fontSize: 20,
        marginLeft: "3%",
        marginTop: "3%",
    },
    textInputContainer: {
        flexDirection: 'row',
        // marginTop: "3%",
        alignItems: 'center',
        backgroundColor: "#808080",
        flex: 1,
        borderWidth: 1,
        borderColor: '#000000',
    },

    icon: {
        flex: 1,
        alignItems: 'center',
    },
    paramArea: {
        flex: 6
    },
    bodyText: {
        fontSize: 17,
        // marginTop: '5%',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000000',
    },
    buttonCompute: {
        fontSize: 10,
        flex: 1,
        height: "100%",
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: 'green',
        borderWidth: 2,
        borderColor: '#000000',
    },
    buttonClear: {
        fontSize: 10,
        flex: 1,
        height: "100%",
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: 'gold',
        borderWidth: 2,
        borderColor: '#000000',
    },

    testText: {
        fontSize: 13,
    },

    row1Params: {
        flex: 2,
        padding: 0,
        backgroundColor: 'powderblue'
    },
    // Row 2 -------------
    row2: {
        flex: 9,
        backgroundColor: 'steelblue',
    },
    // Results Area
    row2Results: {
        flex: 2,
        backgroundColor: 'grey',
        flexDirection: 'row',
    },

    resultsArea: {
        flex: 11.9,
        backgroundColor: 'gold',
        justifyContent: "center",

    },
    resultsText: {
        height: 30,
        fontSize: 22,
        textAlign: 'left',
        marginLeft: "3%",
        // marginTop: "3%",
        // fontFamily: 'Montserrat-Regular',
    },
    tabButtonContainer: {
        flex: 0.1,
        alignItems: 'center',
        backgroundColor: '#2d2e2e',
        paddingTop: 5,
        // borderWidth: 2,
        // borderColor: '#000000',
    },

    tabButton: {
        textAlign: "center",
    },
    // Chart Area
    row2Chart: {
        flex: 12,
        backgroundColor: 'grey'
    }

});