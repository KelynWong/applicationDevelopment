// ADVANCE Result Viewer Screen
// Name: Wong En Ting Kelyn
// Name: Teh Huan Xi Kester
// Class: DIT/FT/2B/01

import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Modal, Dimensions, Alert } from 'react-native';
import { Button } from 'react-native-paper';

// Icons from React Native Vector Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// Cache Manager
import cacheManager from '../cacheManager'

// Chart import
import { BarChart } from "react-native-chart-kit";


var totalCost = 0;
var totalPax = 0;
var optionList;

export default class advResultViewerScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            // State change on API call
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
            // Chart Results Response
            chartResults: {
                payment: 'No',
                amount: '0',
                audienceReached: '0',
                optionid: '',
                cost: '',
                audiencereach: '',
                companyid: '',
            },
            // OptionId no exist check.
            chartResultsCheck: {
                optionid: '',
                cost: '',
                audiencereach: ''
            },

            // Cache items.
            cacheData: {},
            cacheKeys: [],

            // Content State identifiers.
            loaded: true,
            error: null,
            modalOpen: false,

            optionIds: '',
            budget: '',
            companyIdArray: [],

            // Used by Chart
            chartOptionid: [],
            chartCost: [],
            chartAudiencereach: [],
            totalCost: '',
            totalPax: '',
            tabulationComplete: false,
        }
        this.getResult = this.getResult.bind(this);
        this.getChart = this.getChart.bind(this);
    }
    // Kelyn's IP
    //baseURL = 'http://192.168.229.1:3000';
    // Kester's IP
    // baseURL = 'http://192.168.86.1:3000';
    //School IP
    // baseURL ='http://172.22.1.9:3000'

    //Backend heroku
    baseURL = 'https://free-real-estate.herokuapp.com';

    // RUN 0.
    componentDidMount() {
        // Clear all caches. For assignment use.
        cacheManager.clearAll();
    }

    // RUN 1st.
    clearForComputation() { // Set states for computation.
        totalCost = 0;
        totalPax = 0;
        this.setState({
            loaded: true,
            error: null,
            modalOpen: false,
            chartOptionid: [],
            chartCost: [],
            chartAudiencereach: [],
            companyIdArray: [],
            totalCost: 0,
            totalPax: 0,
            chartResults: '',
            modalOpen: false,
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
            tabulationComplete: false,
        }, () => {
            this.validation(); // Run validation(2nd).
        });
    }

    // RUN 2nd.
    validation() {
        // If optionIds and budget is empty
        if (this.state.optionIds == '' && this.state.budget == '') {
            Alert.alert('OOPS!', "Please enter at least 2 optionIds and budget!", [
                { text: 'Understood', onPress: () => console.log('Alert closed.') }
            ]);
        }
        // If optionIds is empty
        else if (this.state.optionIds == '') {
            Alert.alert('OOPS!', "Please enter at least 2 optionsIds!", [
                { text: 'Understood', onPress: () => console.log('Alert closed.') }
            ]);
        }
        // If optionids < 2.
        else if (this.state.optionIds.search(",") == -1) {
            Alert.alert('OOPS!', "Please enter at least 2 optionIds, seperated by a comma!", [
                { text: 'Understood', onPress: () => console.log('Alert closed.') }
            ]);
        }
        // Valid, move on to secondary validation.
        else {
            optionList = this.state.optionIds.toString().split(','); //optionList array
            // If optionids < 2
            if (optionList.length < 2) {
                Alert.alert('OOPS!', "Please enter at least 2 optionIds and budget!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
            }
            else {
                var lengthCheck = [];
                for (let i = 0; i < optionList.length; i++) {
                    optionList[i] = parseInt(optionList[i]);
                    optionList[i] = optionList[i].toString();
                    // Length check
                    if (optionList[i].length == 10) {
                        lengthCheck[i] = true;
                        console.log("Passed: " + optionList[i]);
                    } else {
                        lengthCheck[i] = false;
                        console.log("Failed: " + optionList[i]);
                    }
                }
                var same = false
                for (let j = 0; j < optionList.length; j++) {
                    for (let k = 0; k < optionList.length; k++) {
                        if (optionList[j] == optionList[k] && j != k) {
                            same = true;
                        }
                    }
                }
                // Check if length of options ids are 10 digits each.
                if (!lengthCheck.every(v => v == true)) {
                    Alert.alert('OOPS!', "Please make sure your optionIds are exactly 10 digits each, and digits only!", [
                        { text: 'Understood', onPress: () => console.log('Alert closed.') }
                    ]);
                }
                // Check if there is repeated optionIds.
                else if (same == true) {
                    Alert.alert('OOPS!', "Please make sure you don't enter the same optionId!", [
                        { text: 'Understood', onPress: () => console.log('Alert closed.') }
                    ]);
                } // If optionIds is a decimal
                else if (lengthCheck.every(v => v % 1 != 0)) {
                    Alert.alert('OOPS!', "OptionIds cannot have decimals!", [
                        { text: 'Understood', onPress: () => console.log('Alert closed.') }
                    ]);
                }// If budget is empty
                else if (this.state.budget == '') {
                    Alert.alert('OOPS!', "Please enter a Budget!", [
                        { text: 'Understood', onPress: () => console.log('Alert closed.') }
                    ]);
                }// If budget is not a number.
                else if (isNaN(this.state.budget)) {
                    Alert.alert('OOPS!', "Please enter a numeric value for Budget!", [
                        { text: 'Understood', onPress: () => console.log('Alert closed.') }
                    ]);
                }
                // If budget < $0.00.
                else if (this.state.budget <= 0) {
                    Alert.alert('OOPS!', "Please enter a numeric value bigger than $0.00!", [
                        { text: 'Understood', onPress: () => console.log('Alert closed.') }
                    ]);
                }
                else {
                    this.getChart(); //Get chart
                }
            }
        }
    }

    // RUN 3rd.
    getChart = (ev) => {
        console.log('this.state.optionIds: ' + this.state.optionIds);
        this.setState({ loaded: false, error: null });
        let url = this.baseURL + `/advance/allChartData?optionIds=${this.state.optionIds}`;

        let req = new Request(url, {
            method: 'GET',
        });

        //If error, get from cache.
        fetch(req)
            .then(response => response.json())
            .then((json) => { // When network is available..
                console.log("Response JSON (Chart):");
                console.log(json);
                // Show Chart Representation of options.
                this.showChart(json);
                // Set Cache
                cacheManager
                    .set(url, json)
                    .then(
                        console.log("Cache Set Completed! (Chart)")
                    )
                    .catch((error) => { //correct. 
                        console.log("Internal SET Cache Error (Chart)!:")
                        this.setState({ error: error.message });
                    });
            })
            .catch((error) => { // When no network or Error.
                console.log("CHART ERROR CATCH");
                console.log(error);
                console.log(error.message);
                this.setState({ error: error.message });

                cacheManager
                    .get(url)
                    .then((cacheData) => {
                        let result = { error: error.message };
                        console.log("CACHE DATA");
                        console.log(cacheData);

                        if (!cacheData) { // If Cache does not exist.
                            console.log("Cache does not exist:");
                            result.cacheMessage = 'Chart Results for this query are not cached!';
                            this.setState({ error: result.cacheMessage, loaded: true });
                        } else {
                            this.setState({ cacheData: cacheData }, () => {
                                console.log("Show Cache Data Chart");
                                this.showChart(this.state.cacheData);
                            });
                        }
                    })
                    .catch((error) => {
                        console.log("Get Cache Error! (Chart):")
                        this.setState({ error: error.message });
                    });
            })
    }

    // RUN 4th.
    showChart = (data) => {
        this.setState({
            chartResultsCheck: data
        }, () => {
            // Option id existence check.
            console.log("this.state.chartResultsCheck.length: " + this.state.chartResultsCheck.length);
            if (this.state.chartResultsCheck.length == undefined) {
                Alert.alert('OOPS!', "Please enter optionIds that are valid!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
                this.setState({ loaded: true });
            } else if (this.state.chartResultsCheck.length != optionList.length) {
                Alert.alert('OOPS!', "One or more of the optionId you have entered is invalid!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
                this.setState({ loaded: true });
            } else {
                function addAttributes(x) {
                    if (Array.isArray(x)) { // if data is an array
                        x.forEach(addAttributes); // call the function on each item
                    } else if (x instanceof Object) { // otherwise, if data is an object
                        // add attribute to each object index.
                        x.payment = 'No';
                        x.amount = '0';
                        x.audienceReached = '0';
                    }
                }
                addAttributes(data);
                this.setState({
                    chartResults: data
                }, () => {
                    console.log(this.state.chartResults);
                    // Sets items to previous state as such that the whole state isn't re-written.
                    for (let i = 0; i < this.state.chartResults.length; i++) {
                        // Adding results to states needed by chart.
                        this.setState(prevState => ({
                            chartOptionid: [...prevState.chartOptionid, this.state.chartResults[i].optionid],
                            chartCost: [...prevState.chartCost, this.state.chartResults[i].cost],
                            chartAudiencereach: [...prevState.chartAudiencereach, this.state.chartResults[i].audiencereach],
                            companyIdArray: [...prevState.companyIdArray, this.state.chartResults[i].companyid],
                        }));
                    }
                    this.getResult();
                });
            }
        });
    }

    // RUN 5th
    getResult = (ev) => {
        console.log('this.state.optionIds: ' + this.state.optionIds);
        console.log('this.state.budget: ' + this.state.budget);
        this.setState({ loaded: false, error: null });
        let url = this.baseURL + `/advance/result?optionIds=${this.state.optionIds}&budget=${this.state.budget}`;

        let req = new Request(url, {
            method: 'GET',
        });

        fetch(req)
            .then(response => response.json())
            .then((json) => { // When network is available..
                console.log("Response JSON (Results):");
                console.log(json);
                // Set Cache
                this.showResult(json);
                cacheManager
                    .set(url, json)
                    .then(
                        console.log("Cache Set Completed! (Results)")
                    )
                    .catch((error) => {
                        console.log("Internal SET Cache Error (Results)!:")
                        // Works
                        this.setState({ error: error.message });
                    });
            })
            .catch((error) => { // When no network or Error..
                console.log("RESULT COMPUTATION CATCH")
                console.log(error);

                cacheManager
                    .get(url)
                    .then((cacheData) => {
                        console.log("CACHE DATA RESULTS");
                        console.log(cacheData);
                        let result = { error: error.message }
                        // Add to cacheData array!
                        if (!cacheData) {
                            result.cacheMessage = 'Results for this query are not cached!';
                            this.setState({ error: result.cacheMessage, loaded: true });

                        } else {
                            this.setState({ cacheData: cacheData }, () => {
                                console.log("Show Results via Cache");
                                this.showResult(this.state.cacheData);
                            });
                        }
                    })
                    .catch((error) => { // When no network or Error.
                        console.log("RESULT COMPUTATION CATCH")
                        console.log("GET Cache Error! (Results)")
                        this.setState({ error: error.message });
                    });
            })
    }

    // RUN 6th
    showResult = (data) => {
        // Retrieve overall total result.
        totalCost = 0;
        totalPax = 0;
        console.log("DATA LENGTH:" + data.result.length);
        if (data.result.length != 0) {
            for (var i = 0; i < data.result.length; i++) {
                totalCost += data.result[i].amount;
                totalPax += data.result[i].audienceReached;
            }
        }
        // Parse to 3 d.p. for output.
        totalPax = parseFloat(totalPax.toFixed(3));

        this.setState({ totalCost: totalCost });
        this.setState({ totalPax: totalPax });
        console.log(this.state.totalCost);
        console.log(this.state.totalPax);

        this.setState({
            results: data
        });

        // Make a copy of this.state.results to append it and place back into this.state.results
        let resultsCopy = JSON.parse(JSON.stringify(this.state.results))

        this.setState({
            results: resultsCopy
        }, () => {

            var x = this.state.chartResults;
            var y = this.state.results.result;
            console.log("LENGTH2" + y.length);
            if (y.length != 0) {
                for (var i = 0; i < x.length; i++) {

                    for (var j = 0; j < y.length; j++) {
                        if (x[i].optionid == y[j].optionId) {
                            x[i].payment = 'Full'; // add prop to object
                            x[i].amount = y[j].amount;
                            x[i].audienceReached = y[j].audienceReached;
                        }
                    }
                }
                this.setState({ chartResults: x });
            }
            console.log(this.state.results.result);
            console.log(this.state.chartResults);
            console.log("totalPax: " + totalPax);
            console.log("totalCost: " + totalCost);
            this.setState({ loaded: true });
            this.setState({ tabulationComplete: true });
        })
    }

    // Error handler.
    error = (err) => {
        console.log(err)
        this.setState({ loaded: true, error: err.message });
    }

    // Clear text.
    clearText() {
        this.setState({
            loaded: true,
            error: null,
            modalOpen: false,
            chartOptionid: [],
            chartCost: [],
            chartAudiencereach: [],
            companyIdArray: [],
            totalCost: 0,
            totalPax: 0,
            chartResults: '',
            modalOpen: false,
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
            chartResults: '',
            optionIds: '',
            budget: '',
            tabulationComplete: false,
        })
    }

    // Check Modal
    checkModal() {
        console.log("RESULTS LENGTH" + this.state.results.result.length);
        // In the case of input budget being less than option costs.
        if (this.state.results.result.length == undefined) {
            this.setState({ modalOpen: false });
        } else if (this.state.results.result.length == 0) {
            this.setState({ modalOpen: true });
        } else {
            if (this.state.results.result[0].amount == '') {
                this.setState({ modalOpen: false });
            } else {
                this.setState({ modalOpen: true });
            }
        }
    }

    // Render
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
                                    onChangeText={(text) => this.setState({ optionIds: text })}
                                    value={this.state.optionIds}
                                    keyboardType='numeric' />
                            </TouchableOpacity>
                            <Button style={styles.buttonCompute} mode='contained' onPress={() => { this.clearForComputation() }}>
                                <Text style={styles.buttonText}>Compute</Text>
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
                                    onChangeText={(text) => { this.setState({ budget: text.toString().split(".").map((el, i) => i ? el.split("").slice(0, 2).join("") : el).join(".") }) }}
                                    value={this.state.budget}
                                    keyboardType='numeric' />
                            </TouchableOpacity>
                            <Button style={styles.buttonClear} mode='contained' onPress={() => { this.clearText() }}>
                                <Text style={styles.buttonText}>Clear</Text>
                            </Button>
                        </View>
                    </View>
                </View>

                <View style={styles.row2}>
                    <View style={styles.row2Results}>

                        <View style={styles.resultsArea}>
                            {this.state.tabulationComplete && (
                                <Text style={styles.resultsText}>Results: ${totalCost} for {totalPax}pax</Text>
                            )}
                        </View>
                        <Button style={styles.tabButtonContainer} mode='contained' onPress={() => { this.checkModal() }}>
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
                            </ScrollView>
                        </View>

                        <Modal visible={this.state.modalOpen}>
                            <View style={styles.tabulationArea}>
                                <View style={styles.modalBar}>
                                    <Ionicons.Button name="chevron-back" size={25} backgroundColor='#009387' onPress={() => this.setState({ modalOpen: false })}>
                                        <Text style={styles.barText}>Tabulation</Text>

                                    </Ionicons.Button>
                                </View>
                                {!!this.state.chartResults && !!this.state.chartResults.length > 0 && (this.state.chartResults.map((data, i) => (
                                    <View key={i} style={styles.cardContent}>
                                        <Text style={styles.cardText}>{data.payment} payment for</Text>
                                        <Text style={styles.cardText}>option {data.optionid}</Text>
                                        <Text style={styles.cardText}>from company {data.companyid}</Text>
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
    // Tabulation Modal Styles -------
    barText: {
        color: 'white',
        fontSize: 20
    },
    cardText: {
        color: 'black',
        fontSize: 20
    },
    cardContent: {
        // backgroundColor: 'blue',
        marginHorizontal: 18,
        marginVertical: 10,
        fontSize: 50,
        borderBottomWidth: 3,
        borderColor: '#000000',
    },
    modalBar: {
        height: 45,
        width: '100%',
        backgroundColor: '#009387',
        color: 'white',
    },
    tabulationArea: {
        // backgroundColor: 'green',
        borderRadius: 6,
        backgroundColor: '#fff',
        shadowOffset: { width: 1, height: 1 },
        shadowColor: "#333",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        fontSize: 50,
    },

    // Main styles: ----------
    err: {
        fontSize: 20,
        color: 'red',
        textAlign: 'center',
    },
    container: {
        // backgroundColor: 'powderblue',
        flex: 1,
        flexDirection: 'column',
        fontFamily: 'Montserrat-Regular',
    },
    // Row 1 -----------------
    row1: {
        backgroundColor: 'skyblue',
        flex: 3,
        flexDirection: 'column'
    },

    row1Title: {
        // backgroundColor: 'blue'
        flex: 1,
    },
    filterText: {
        height: 30,
        fontSize: 20,
        marginLeft: "3%",
        marginTop: "3%",
    },
    textInputContainer: {
        backgroundColor: "#808080",
        flexDirection: 'row',
        alignItems: 'center',
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
        backgroundColor: '#fff',
        fontSize: 17,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: '#000000',
    },
    buttonCompute: {
        backgroundColor: 'green',
        fontSize: 10,
        flex: 1,
        height: "100%",
        justifyContent: 'center',
        alignItems: "center",
        borderWidth: 2,
        borderColor: '#000000',
    },
    buttonClear: {
        backgroundColor: 'gold',
        fontSize: 10,
        flex: 1,
        height: "100%",
        justifyContent: 'center',
        alignItems: "center",
        borderWidth: 2,
        borderColor: '#000000',
    },
    buttonText: {
        fontSize: 13,
    },
    row1Params: {
        backgroundColor: 'powderblue',
        flex: 2,
        padding: 0,
    },
    // Row 2 -------------
    row2: {
        backgroundColor: 'steelblue',
        flex: 9,
    },
    // Results Area
    row2Results: {
        backgroundColor: 'grey',
        flex: 2,
        flexDirection: 'row',
    },

    resultsArea: {
        backgroundColor: 'gold',
        flex: 11.9,
        justifyContent: "center",

    },
    resultsText: {
        height: 30,
        fontSize: 22,
        textAlign: 'left',
        marginLeft: "3%",
    },
    tabButtonContainer: {
        flex: 0.1,
        alignItems: 'center',
        backgroundColor: '#2d2e2e',
        paddingTop: 5,
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