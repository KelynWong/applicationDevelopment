/* Layout Test for basic data viewer */

import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import { Dropdown } from 'react-native-material-dropdown';




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

export default class dataViewerScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            results: [],
            loaded: true,
            error: null,
            companyId: '',
            audienceReach: '',
            rowCount: null,
            pageNo: 0,
            pageSize: 5, //default 5 rows in one page
            // page: 0,
        }
        this.getData = this.getData.bind(this);
    }
    // baseURL = 'http://192.168.229.1:3000';
    baseURL = 'http://192.168.86.1:3000';

    componentDidMount() {
        this.getRowCount();
        this.setState({ loaded: false, error: null });
        let url = this.baseURL + `/basic/Alldata?pageNo=${this.state.pageNo}&pageSize=${this.state.pageSize}`;

        // let req = new Request(url, {
        //     method: 'GET',
        // });

        fetch(url, {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then(this.showData)
            .catch(this.badStuff)
    }
    getData = (ev) => { // On Filter

        // // Validation: 
        // if (!this.state.companyId && !this.state.audienceReach) {
        //     Alert.alert('OOPS!', "Fill in at least one of the parameters!(CompanyId, Audience reach)", [
        //         { text: 'Understood', onPress: () => console.log('Alert closed.') }
        //     ]);
        // } else {
        //     this.companyIdValidation();
        //     this.audienceReachValidation();
        // }

        this.setState({ loaded: false, error: null });
        let url = this.baseURL + `/basic/Alldata?pageNo=${this.state.pageNo}&pageSize=${this.state.pageSize}&companyId=${this.state.companyId}&audienceReach=${this.state.audienceReach}`;

        // let req = new Request(url, {
        //     method: 'GET',
        // });

        fetch(url, {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',  // It can be used to overcome cors errors
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then(this.showData)
            .catch(this.badStuff)
    }
    showData = (data) => {
        this.setState({
            results: data
        });
        console.log(this.state.results);
        this.setState({ loaded: true });
        this.getRowCount;
    }

    getRowCount = (ev) => {
        console.log('this.state.companyId: ' + this.state.companyId);
        console.log('this.state.audienceReach: ' + this.state.audienceReach);
        this.setState({ loaded: false, error: null });
        let url = this.baseURL + `/basic/getRowCount?companyId=${this.state.companyId}&audienceReach=${this.state.audienceReach}`;

        let req = new Request(url, {
            method: 'GET',
        });

        fetch(req)
            .then((response) => response.json())
            .then(this.showRowCount)
            .catch(this.badStuff)
    }


    showRowCount = (data) => {
        this.setState({
            rowCount: data
        });
        console.log(this.state.rowCount[0].count);
        this.setState({ loaded: true });
    }


    badStuff = (err) => {
        console.log(err)
        this.setState({ loaded: true, error: err.message });
    }
    clearText() {
        this.setState({
            companyId: '',
            audienceReach: ''
        }, () => {
            this.componentDidMount();
        });
    }
    setPage(page, callback) {

        // this.setState({ page: page })
        // console.log("parsed in page:" + page);

        // this.setState({ pageNo: page });
        // callback();

        // console.log("Current: this.state.page: " + this.state.page)




        // this.setState({ pageNo: temp }) //

        // this.getData();
    }

    companyIdValidation() {
        console.log("this.state.companyId.length: " + this.state.companyId.length)
        if (this.state.companyId) {
            if (isNaN(this.state.companyId) == true) {
                this.setState({ companyId: '' })
                Alert.alert('OOPS!', "Company Id has to be a 10 digit number!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
            } else if (this.state.companyId % 1 != 0) {
                this.setState({ companyId: '' })
                Alert.alert('OOPS!', "Company Id has to be a 10 digit number! Not a decimal!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
            } else if (this.state.companyId.length != 10) {
                this.setState({ companyId: '' })
                Alert.alert('OOPS!', "Company Id has to be a 10 digit number!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
            }
        }
    }

    audienceReachValidation() {
        if (this.state.audienceReach) {
            // If filterAudienceReach exists
            if (isNaN(this.state.audienceReach) == true) {
                this.setState({ audienceReach: '' })
                Alert.alert('OOPS!', "Audience reach has to be a numeric number!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
            } else if (this.state.audienceReach % 1 != 0) {
                this.setState({ audienceReach: '' })
                Alert.alert('OOPS!', "Audience reach has to be a numeric number! Not a decimal!", [
                    { text: 'Understood', onPress: () => console.log('Alert closed.') }
                ]);
            }
        }
    }

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
                                    onChangeText={(text) => this.setState({ companyId: text })}
                                    value={this.state.companyId}
                                    keyboardType='numeric' />
                            </TouchableOpacity>
                            <Button style={styles.buttonFilter} mode='contained' onPress={() => { this.getData() }}>
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
                                    onChangeText={(text) => this.setState({ audienceReach: text })}
                                    value={this.state.audienceReach}
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
                                this.setState({ pageNo: 0});
                                this.setState({ pageSize: value }, () => this.getData());
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
                                            {/* <DataTable.Cell numeric>{result.optionid}</DataTable.Cell>
                                            <DataTable.Cell numeric>{result.companyid}</DataTable.Cell>
                                            <DataTable.Cell numeric>{result.cost}</DataTable.Cell>
                                            <DataTable.Cell numeric>{result.audiencereach}</DataTable.Cell>
                                            <DataTable.Cell>{result.adtype}</DataTable.Cell> */}
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
                        {this.state.rowCount && (
                            <DataTable.Pagination style={styles.pagination}
                                page={this.state.pageNo} //Page is the current page
                                numberOfPages={Math.floor(this.state.rowCount[0].count / this.state.pageSize + 1)} //Correct
                                onPageChange={pagee => {
                                    console.log('change', pagee) //pagee = current page index



                                    this.setState({ pageNo: pagee }, () => this.getData()); //Set State actually takes time to set a state. So callbacks must be done.

                                    // console.log("TEST" + this.state.pageNo)
                                    // this.getData();
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
        flex: 2,
        backgroundColor: '#009387'
    },
    pagination: {
        fontSize: 20,
    },


});