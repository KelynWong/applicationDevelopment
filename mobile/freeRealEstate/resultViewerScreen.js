import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const resultViewerScreen = ({navigation}) => {
    return (
      <View style={styles.container}>
        <Text>Result viewer Screen</Text>
        <Button
            title="Go to data viewer screen"
            onPress={() => navigation.navigate("DataViewer")}
        />
      </View>
    );
};

export default resultViewerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});