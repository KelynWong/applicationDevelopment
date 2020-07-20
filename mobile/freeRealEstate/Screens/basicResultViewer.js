import * as React from 'react';
import { useState }from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Modal, Dimensions, Alert } from 'react-native';
import { DataTable, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from '../myComponents/card';
import {BarChart} from "react-native-chart-kit";

var totalCost = 0
var totalPax = 0

export default class resultViewerScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            results: {
                result: [{
                  adType: '',
                  payment: '',
                  optionId: '',
                  companyId: '',
                  amount: '',
                  audienceReach: ''
                }]
            },
            chartResults: {
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

    getResult = (ev)=>{
        console.log('this.state.optionIds: ' + this.state.optionIds)
        console.log('this.state.budget: ' + this.state.budget)
        this.setState({loaded:false, error: null});
        let url = this.baseURL + `/basic/result?optionIds=${this.state.optionIds}&budget=${this.state.budget}`;
        
        let req = new Request(url, {
            method: 'GET',
        });
        
        fetch(req)
        .then(response=>response.json())
        .then(this.showResult)
        .catch(this.error)
    }
    showResult = (data)=>{
        this.setState({
            results: data
        });
        console.log("this.state.results: " + this.state.results);
        console.log("this.state.results.length: " + this.state.results.result.length);
        
        for(var i=0; i < this.state.results.result.length; i++){
          totalCost += this.state.results.result[i].amount
          totalCost.toFixed(3)
          totalPax += this.state.results.result[i].audienceReached
          totalPax.toFixed(3)
        }
        this.setState({totalCost: totalCost});
        this.setState({totalPax: totalPax});
        this.setState({loaded:true});
    }
    getChart = (ev)=>{
      console.log('this.state.optionIds: ' + this.state.optionIds)
      this.setState({loaded:false, error: null});
      let url = this.baseURL + `/basic/allChartData?optionIds=${this.state.optionIds}`;
      
      let req = new Request(url, {
          method: 'GET',
      });
      
      fetch(req)
      .then(response=>response.json())
      .then(this.showChart)
      .catch(this.error)
    }
    showChart = (data)=>{
      this.setState({
          chartResults: data
      });
      console.log(this.state.chartResults);
      for(var i=0; i < this.state.chartResults.length; i++){
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
      //this.setState({loaded:true});
      this.getResult();
    }
    error = (err) => {
        console.log(err)
        this.setState({loaded: true, error: err.message});
    }
    clearText(){
      this.setState({
        loaded: true,
        error: null,
        modalOpen: false,
        chartOptionid: [],
        chartCost: [],
        chartAudiencereach: [],
        totalCost: 0,
        totalPax: 0,
        chartResults:'',
        modalOpen:false,
        results:'',
        chartResults:'',
        optionIds: '',
        budget: ''
      })
    }
    clearForComputation(){
      this.setState({
        loaded: true,
        error: null,
        modalOpen: false,
        chartOptionid: [],
        chartCost: [],
        chartAudiencereach: [],
        totalCost: 0,
        totalPax: 0,
        chartResults:'',
        modalOpen:false,
        results:'',
        chartResults:''
      }, () => {
        this.validation();
      });
    }

    validation(){
      if (this.state.optionIds == '' && this.state.budget == '') {
          Alert.alert('OOPS!', "Please enter at least 2 optionIds and budget!", [
            {text: 'Understood', onPress: () => console.log('Alert closed.')}
          ]);
      }
      else if (this.state.budget == '') {
        this.setState({ optionIds: ''})
        this.setState({ budget: ''})
        Alert.alert('OOPS!', "Please enter a Budget!", [
          {text: 'Understood', onPress: () => console.log('Alert closed.')}
        ]);
      }
      else if (this.state.optionIds == '') {
        this.setState({ optionIds: ''})
        this.setState({ budget: ''})
        Alert.alert('OOPS!', "Please enter at least 2 optionsIds!", [
          {text: 'Understood', onPress: () => console.log('Alert closed.')}
        ]);
      }
      else if (isNaN(this.state.budget)) {
        this.setState({ optionIds: ''})
        this.setState({ budget: ''})
        Alert.alert('OOPS!', "Please enter a numeric value for Budget!", [
          {text: 'Understood', onPress: () => console.log('Alert closed.')}
        ]);
      }
      else if (this.state.budget <= 0) {
        this.setState({ optionIds: ''})
        this.setState({ budget: ''})
        Alert.alert('OOPS!', "Please enter a numeric value bigger than $0.00!", [
          {text: 'Understood', onPress: () => console.log('Alert closed.')}
        ]);
      }
      else if (this.state.optionIds.search(",") == -1) {
        this.setState({ optionIds: ''})
        this.setState({ budget: ''})
        Alert.alert('OOPS!', "Please enter at least 2 optionIds, seperated by a comma!", [
          {text: 'Understood', onPress: () => console.log('Alert closed.')}
        ]);
      }
      else {
          var optionList;
          optionList = this.state.optionIds.toString().split(','); //optionList array
          if (optionList.length < 2) {
              this.setState({ optionIds: ''})
              this.setState({ budget: ''})
              Alert.alert('OOPS!', "Please enter at least 2 optionIds and budget!", [
                {text: 'Understood', onPress: () => console.log('Alert closed.')}
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
                this.setState({ optionIds: ''})
                this.setState({ budget: ''})
                Alert.alert('OOPS!', "Please make sure your optionIds are exactly 10 digits each, and digits only!", [
                  {text: 'Understood', onPress: () => console.log('Alert closed.')}
                ]);
              }
              else {
                this.getChart();
              }
          }
      }
    }
    
    render() {
        return (
            <View style={styles.container}>
          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>Enter:</Text>
                <View style={styles.textInputContainer}>
                    <Icon style={styles.icon} name="ios-menu" size={30}></Icon>
                    <TouchableOpacity>
                            <TextInput
                            style={[styles.bodyText, { width: '100%'}]}
                            placeholder="OptionId"
                            placeholderTextColor='rgb(0,0,0)'
                            multiline= {false} 
                            onChangeText={(text) => this.setState({optionIds:text})}
                            value= {this.state.optionIds}
                            keyboardType='numeric'/>
                    </TouchableOpacity>
                    <Button mode='contained' onPress={() => {this.clearForComputation()}}>Compute</Button>
                </View>

                <View style={styles.textInputContainer}>
                    <Icon style={styles.icon} name="ios-social-usd" size={30}></Icon>
                    <TouchableOpacity>
                        <TextInput
                        style={[styles.bodyText, { marginTop: -5}]}
                        placeholder="Budget"
                        placeholderTextColor='rgb(0,0,0)'
                        multiline= {true} 
                        onChangeText={(text) => this.setState({budget:text})}
                        value= {this.state.budget}
                        keyboardType='numeric'/>
                    </TouchableOpacity>
                    <Button mode='contained' onPress={() => {this.clearText()}}>Clear</Button>
                </View>
            </View>

            <View style={styles.resultBar}>
              <View>
                { !!this.state.totalCost && !!this.state.totalPax && (
                  <Text>Results: ${totalCost} for {totalPax}pax</Text>
                )}
              </View>
              <Icon.Button name="ios-menu" size={25} backgroundColor='#FFFF00' onPress={() => this.setState({modalOpen:true})}></Icon.Button>
            </View>

        <View style={styles.dataTableContainer}>
            { !this.state.loaded && (
              <ActivityIndicator size="large" color="black"></ActivityIndicator>
            )}

            { !!this.state.error && (
                <Text style={styles.err}>{this.state.error}</Text>
            )}

              <View>
                <ScrollView>
                  { !!this.state.chartResults && !!this.state.chartResults.length > 0 && (
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
                    }}
                  />
                  )}
                        
                        { !!this.state.chartResults && !!this.state.chartResults.length > 0 && (
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
                    }}
                  />
                  )}
                </ScrollView>
              </View>
                       
                    <Modal visible={this.state.modalOpen}>
                      <View>
                        <View style={styles.modalBar}>
                          <Icon.Button name="chevron-back" size={25} backgroundColor='#009387' onPress={() => this.setState({modalOpen:false})}></Icon.Button>
                          <Text>Tabulation</Text>
                        </View>
                        { !!this.state.results.result && !!this.state.results.result.length > 0 && (this.state.results.result.map( (data, i) => ( 
                          <Card key={i}>
                            <Text>{data.payment} payment for</Text>
                            <Text>option {data.optionId}</Text>
                            <Text>from company {data.companyId}</Text>
                            <Text>${data.amount} for {data.audienceReached}pax</Text>
                          </Card>
                          ))
                        )}
                      </View>
                    </Modal>
                            

                

        </View>
      </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    // alignItems: 'center', 
    // justifyContent: 'center'
  },
  filterContainer:{
    height: 150,
    width: "100%",
    //marginTop: "5%",
    borderColor: "rgb(0, 0, 0)",
    borderWidth: 1,
    backgroundColor: "#D7F1FF",
    flex: 2,
  },
  dataTableContainer:{
    flex: 6
  },
  textInputContainer:{
    flexDirection: 'row',
    marginTop: "3%",
    alignItems: 'center',
    height: 40
  },
  resultBar:{
    //flexDirection: 'row',
    //marginTop: "50%",
    alignItems: 'center',
    height: 45,
    width: '100%',
    backgroundColor: '#FFFF00',
  },
  modalBar:{
    //flexDirection: 'row',
    //marginTop: "50%",
    alignItems: 'center',
    height: 45,
    width: '100%',
    backgroundColor: '#009387',
  },
  // resultIcon:{
  //   padding: 6,
  //   marginRight: '10',
  // },
  filterText:{
    height: 30,
    fontSize: 20,
    marginLeft: "3%",
    marginTop: "3%",
    fontFamily: 'Montserrat-Regular',
  },
  bodyText:{
    fontSize: 17,
    fontFamily: 'Montserrat-Regular',
    marginTop:'5%',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000000',
    height: 40
  },
  icon:{
    padding: 6,
    backgroundColor: "#808080"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    },
    txt: {
        fontSize: 24,
        color: '#333'
    },
    err:{
        color: 'red',
        fontSize: 30,
        fontWeight: 'bold'
    }
});