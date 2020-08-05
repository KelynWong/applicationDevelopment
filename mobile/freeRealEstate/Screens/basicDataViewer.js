// BASIC Data Viewer Screen
// Name: Wong En Ting Kelyn
// Name: Teh Huan Xi Kester
// Class: DIT/FT/2B/01

import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';

// Cache Manager
import cacheManager from '../cacheManager'

// Icons from React Native Vector Icons
import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';


let data = [{
    value: '5',
}, {
    value: '10',
}, {
    value: '15',
}, {
    value: '20',
}, {
    value: '25',
}, {
    value: '30',
}, {
    value: '35',
}, {
    value: '40',
}, {
    value: '45',
}, {
    value: '50',
}];

const digits = /^\d+$/;

export default class basicDataViewerScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            results: [],
            loaded: true,
            error: null,
            // Cache items.
            cacheData: {},
            cacheKeys: [],

            // Parsed into API
            companyIdParse: '',
            audienceReachParse: '',
            // Changed on text change, parsed into the parse above only when Filter is clicked.
            // Prevents override of search result without filter button click consent.
            companyIdParam: '',
            audienceReachParam: '',

            rowCount: null,
            pageNo: 0,
            pageSize: 5, //default 5 rows in one page
        }
        this.getData = this.getData.bind(this);
    }
    // Kelyn's IP
    //baseURL = 'http://192.168.229.1:3000';
    // Kester's IP
    //baseURL = 'http://192.168.86.1:3000';

    //School IP
    // baseURL ='http://172.22.1.9:3000'
    
    //Backend heroku
    baseURL = 'https://free-real-estate.herokuapp.com';

    componentDidMount() {
        this.getRowCount();
        // Clear all caches. For assignment use.
        cacheManager.clearAll();
    }

    // RUN 0. (When filter button is pressed)
    parseParam = (ev) => {
        // Validation: 
        if (!this.state.companyIdParam && !this.state.audienceReachParam) {
            Alert.alert('OOPS!', "Fill in at least one of the parameters!(CompanyId, Audience reach)", [
                { text: 'Understood', onPress: () => console.log('Alert closed.') }
            ]);
        } else {
            // If pass the validation checks, go through.
            if (this.state.audienceReachParam && this.state.companyIdParam) {
                if (this.companyIdValidation() && this.audienceReachValidation()) {
                    this.setState({
                        companyIdParse: this.state.companyIdParam,
                        audienceReachParse: this.state.audienceReachParam
                    }, () => {
                        this.getRowCount();
                    });
                }
            }
            else if (this.state.audienceReachParam == '' && this.state.companyIdParam) {
                if (this.companyIdValidation()) {
                    this.setState({
                        companyIdParse: this.state.companyIdParam,
                        audienceReachParse: this.state.audienceReachParam
                    }, () => {
                        this.getRowCount();
                    });
                }
            } else if (this.state.audienceReachParam != '' && this.state.companyIdParam == '') {
                if (this.audienceReachValidation()) {
                    this.setState({
                        companyIdParse: this.state.companyIdParam,
                        audienceReachParse: this.state.audienceReachParam
                    }, () => {
                        this.getRowCount();
                    });
                }
            }
        }
    }

    // RUN 1st.
    getRowCount = (ev) => {
        console.log('this.state.companyIdParse: ' + this.state.companyIdParse);
        console.log('this.state.audienceReachParse: ' + this.state.audienceReachParse);
        this.setState({ loaded: false, error: null });
        let url = this.baseURL + `/basic/getRowCount?companyId=${this.state.companyIdParse}&audienceReach=${this.state.audienceReachParse}`;

        let req = new Request(url, {
            method: 'GET',
        });

        fetch(req)
            .then((response) => response.json())
            .then((json) => { // When network is available..
                console.log("Show Row Count Response");
                console.log(json);
                // Show Row Count
                this.showRowCount(json);
                // Set Cache
                cacheManager
                    .set(url, json)
                    .then(
                        console.log("Set Show Row Count Cache!")
                    )
                    .catch((error) => { //correct. 
                        console.log("Internal Set Show Row Count Cache Error!:")
                        this.setState({ error: error.message });
                    });
            })
            .catch((error) => { // When no network or Error.
                console.log("Show Row Count ERROR CATCH");
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
                            result.cacheMessage = 'Row Count for this query are not cached!';
                            this.setState({ error: result.cacheMessage, loaded: true });
                        } else {
                            this.setState({ cacheData: cacheData }, () => {
                                console.log("Show Cache Data Chart");
                                this.showRowCount(this.state.cacheData);
                            });
                        }
                    })
                    .catch((error) => {
                        console.log("Get Cache Error! (Chart):")
                        this.setState({ error: error.message });
                    });
            })
        // .catch(this.badStuff)
    }

    // RUN 2nd.
    showRowCount = (data) => {
        this.setState({
            rowCount: data
        });
        console.log("ROW COUNT:" + this.state.rowCount[0].count);
        this.setState({ loaded: true });

        this.getData();
    }

    // RUN 3rd. 
    getData = (ev) => { // On Filter
        this.setState({ loaded: false, error: null });
        console.log(this.state.companyIdParse);
        console.log(this.state.audienceReachParse);

        let url = this.baseURL + `/basic/Alldata?pageNo=${this.state.pageNo}&pageSize=${this.state.pageSize}&companyId=${this.state.companyIdParse}&audienceReach=${this.state.audienceReachParse}`;

        fetch(url, {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => { // When network is available..
                console.log("Get Data Response");
                console.log(json);
                // Show Row Count
                this.showData(json);
                // Set Cache
                cacheManager
                    .set(url, json)
                    .then(
                        console.log("Set Get Data Cache!")
                    )
                    .catch((error) => { //correct. 
                        console.log("Internal Get Data Cache Error!:")
                        this.setState({ error: error.message });
                    });
            })
            .catch((error) => { // When no network or Error.
                console.log("Get Data ERROR CATCH");
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
                            result.cacheMessage = 'Get Data for this query are not cached!';
                            this.setState({ error: result.cacheMessage, loaded: true });
                        } else {
                            this.setState({ cacheData: cacheData }, () => {
                                console.log("Show Cache Data Chart");
                                this.showData(this.state.cacheData);
                            });
                        }
                    })
                    .catch((error) => {
                        console.log("Get Cache Error! (Chart):")
                        this.setState({ error: error.message });
                    });
            })
        // .catch(this.badStuff)
    }

    // RUN 4th.
    showData = (data) => {
        this.setState({
            results: data
        });

        console.log(this.state.results);
        this.setState({ loaded: true });
    }

    // Error handler.
    badStuff = (err) => {
        console.log(err)
        this.setState({ loaded: true, error: err.message });
    }

    // Clear Text.
    clearText() {
        this.setState({
            companyIdParse: '',
            audienceReachParse: '',
            companyIdParam: '',
            audienceReachParam: '',
            pageNo: 0
        }, () => {
            this.componentDidMount();
        });
    }

    // Validation.
    companyIdValidation() {
        console.log("this.state.companyIdParam.length: " + this.state.companyIdParam.length)
        if (this.state.companyIdParam) {
            if (isNaN(this.state.companyIdParam) == true) {
                this.setState({ companyIdParam: '' })
                Alert.alert('OOPS!', "Company Id has to be a 10 digit number!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
            } else if (this.state.companyIdParam.match(digits) == null) {
                this.setState({ companyIdParam: '' });
                Alert.alert('OOPS!', "Company Id can only contain numbers!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
            } else if (this.state.companyIdParam % 1 != 0) {
                this.setState({ companyIdParam: '' })
                Alert.alert('OOPS!', "Company Id has to be a 10 digit number! Not a decimal!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
            } else if (this.state.companyIdParam.length != 10) {
                this.setState({ companyIdParam: '' })
                Alert.alert('OOPS!', "Company Id has to be a 10 digit number!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
            } else {
                return true;
            }
        }
    }

    audienceReachValidation() {
        if (this.state.audienceReachParam) {
            // If filterAudienceReach exists
            if (isNaN(this.state.audienceReachParam) == true) {
                this.setState({ audienceReachParam: '' });
                Alert.alert('OOPS!', "Audience reach has to be a numeric number!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
                // If audienceReach is smaller than 1
            } else if (this.state.audienceReachParam < 1) {
                this.setState({ audienceReachParam: '' });
                Alert.alert('OOPS!', "Audience reach has to be 1 or more!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
                // If decimal.
            } else if (this.state.audienceReachParam % 1 != 0) {
                this.setState({ audienceReachParam: '' });
                Alert.alert('OOPS!', "Audience reach has to be a numeric number! Not a decimal!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
            } else {
                return true;
            }
        }
    }

    // Render
    render() {
        return (
            <View style={styles.container}>

                <View style={styles.row1}>
                    <View style={styles.row1Title}>
                        <Text style={styles.filterText}>Filter by:</Text>

                    </View>
                    <View style={styles.row1Params}>
                        <View style={styles.textInputContainer}>
                            <View style={styles.icon}>
                                <Ionicons name="ios-business" size={30}></Ionicons>
                            </View>
                            <TouchableOpacity style={styles.paramArea}>
                                <TextInput
                                    style={[styles.bodyText]}
                                    placeholder="CompanyId"
                                    placeholderTextColor='rgb(0,0,0)'
                                    multiline={false}
                                    onChangeText={(text) => this.setState({ companyIdParam: text })}
                                    value={this.state.companyIdParam}
                                    keyboardType='numeric' />
                            </TouchableOpacity>
                            <Button style={styles.buttonFilter} mode='contained' onPress={() => { this.parseParam() }}>
                                <Text style={styles.testText}>Filter</Text>
                            </Button>
                        </View>

                        <View style={styles.textInputContainer}>
                            <View style={styles.icon}>
                                <Ionicons name="ios-person" size={30}></Ionicons>
                            </View>
                            <TouchableOpacity style={styles.paramArea}>
                                <TextInput
                                    style={[styles.bodyText]}
                                    placeholder="Audience Reach"
                                    placeholderTextColor='rgb(0,0,0)'
                                    multiline={true}
                                    onChangeText={(text) => this.setState({ audienceReachParam: text })}
                                    value={this.state.audienceReachParam}
                                    keyboardType='numeric' />
                            </TouchableOpacity>
                            <Button style={styles.buttonClear} mode='contained' onPress={() => { this.clearText() }}>
                                <Text style={styles.testText}>Clear</Text>
                            </Button>
                        </View>
                    </View>
                </View>

                <View style={styles.row2}>
                    <View style={styles.pageSizeContainer}>
                        <Dropdown style={styles.dropdown}
                            label='Page size'
                            data={data}
                            // pickerStyle={}
                            value={this.state.pageSize}
                            fontSize={25}
                            labelFontSize={18}
                            onChangeText={value => {
                                this.setState({ pageNo: 0 });
                                this.setState({ pageSize: value }, () => this.getRowCount());
                            }}
                        />
                    </View>

                    <View style={styles.tableContainer}>
                        <DataTable style={styles.colourTest}>
                            <DataTable.Header style={styles.colourTest}>
                                <DataTable.Title style={styles.cell1} numeric
                                    sortDirection='ascending'
                                    numberOfLines={4}
                                >
                                    OptionId
                                </DataTable.Title>
                                <DataTable.Title style={styles.cell2} numeric
                                    // sortDirection='ascending'
                                    numberOfLines={4}
                                >
                                    CompanyId
                                </DataTable.Title>
                                <DataTable.Title style={styles.cell3} numeric
                                    // sortDirection='ascending'
                                    numberOfLines={2}
                                >
                                    Cost
                                </DataTable.Title>
                                <DataTable.Title style={styles.cell4} numeric
                                    // sortDirection='ascending'
                                    numberOfLines={2}
                                >
                                    Reach
                                </DataTable.Title>

                                <DataTable.Title style={styles.cell5}
                                    // sortDirection='ascending'
                                    numberOfLines={3}
                                >
                                    Ad Type
                                </DataTable.Title>
                            </DataTable.Header>

                            {!this.state.loaded && (
                                <ActivityIndicator size="large" color="black"></ActivityIndicator>
                            )}

                            {this.state.error && (
                                <Text style={styles.err}>{this.state.error}</Text>
                            )}

                            <View style={styles.dataTableContent}>
                                <ScrollView>
                                    {this.state.results && this.state.results.length > 0 && (this.state.results.map((result, i) => (
                                        <DataTable.Row key={i} style={styles.colourTest}>
                                            <DataTable.Cell style={styles.cell1} numeric>{result.optionid}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cell2} numeric>{result.companyid}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cell3} numeric>{result.cost}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cell4} numeric>{result.audiencereach}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cell5}>{result.adtype}</DataTable.Cell>
                                        </DataTable.Row>
                                    )))}
                                </ScrollView>
                            </View>

                        </DataTable>
                    </View>
                    <View style={styles.paginationContainer}>


                        <Button style={styles.pageButton} mode='contained' onPress={() => { this.setState({ pageNo: 0 }, () => this.getRowCount()); }}>
                            <Text style={styles.buttonText}>First</Text>
                        </Button>
                        <Button style={styles.pageButton} mode='contained' onPress={() => { this.setState({ pageNo: Math.floor(this.state.rowCount[0].count / this.state.pageSize) }, () => this.getRowCount()); }}>
                            <Text style={styles.buttonText}>Last</Text>
                        </Button>
                        {this.state.rowCount && (
                            <DataTable.Pagination style={styles.pagination}
                                page={this.state.pageNo} //Page is the current page
                                numberOfPages={Math.floor(this.state.rowCount[0].count / this.state.pageSize + 1)} //Correct
                                onPageChange={pagee => {
                                    console.log('change', pagee) //pagee = current page index

                                    this.setState({ pageNo: pagee }, () => this.getRowCount()); //Set State actually takes time to set a state. So callbacks must be done.

                                    // console.log("TEST" + this.state.pageNo)
                                    // this.getRowCount();
                                }}
                                label={`${((this.state.pageNo) * this.state.pageSize) + 1}-${


                                    ((this.state.pageNo + 1) * this.state.pageSize) >= this.state.rowCount[0].count ? this.state.rowCount[0].count : ((this.state.pageNo + 1) * this.state.pageSize)
                                    } of ${this.state.rowCount[0].count}`} //correct
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    err: {
        fontSize: 20,
        color: 'red',
        textAlign: 'center',
    },
    dataTableContent: {
        height: 270,
        // flex: 12,
    },
    pageButton: {
        flex: 1,
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: null,
        shadowRadius: 0,
        elevation: 0,
    },
    buttonText: {
        color: 'black',
        textDecorationLine: 'underline',
    },
    colourTest: {
        // flex: 4,
        // backgroundColor: 'green',
        margin: 0,
        //IMPORTANT
        paddingLeft: 0,
        paddingRight: 0,
    },
    colourTest2: {
        flex: 4
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
    buttonFilter: {
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
        // backgroundColor: 'steelblue',
    },
    // Results Area
    row2Results: {
        flex: 2,
        backgroundColor: 'red',
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


    dropdown: {
        textAlign: "center",
    },
    // Chart Area
    tableContainer: {
        flex: 10,
        // maxHeight: 40,
        // backgroundColor: 'grey'
        width: "100%",
    },
    cell1: {
        flex: 2,
        justifyContent: 'center',
        // backgroundColor: 'blue',
    },
    cell2: {
        flex: 2,
        justifyContent: 'center',
        // backgroundColor: 'green'
    },
    cell3: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: 'red'
    },
    cell4: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: 'gold'
    },
    cell5: {
        flex: 1.5,
        justifyContent: 'center',
        // backgroundColor: 'grey'
    },

    pageSizeContainer: {
        flex: 2,
        // backgroundColor: 'red'
    },
    paginationContainer: {
        flexDirection: 'row',
        flex: 2,
        backgroundColor: '#009387'
    },
    pagination: {
        flex: 5,
        fontSize: 30,
    },


});