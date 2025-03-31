import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Dimensions, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";
const mobileH = Math.round(Dimensions.get('window').height);
const mobileW = Math.round(Dimensions.get('window').width);

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  const API_URL = "https://api.exchangerate-api.com/v4/latest/";

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(`${API_URL}USD`);
      const currencyKeys = Object.keys(response.data.rates);
      setCurrencies(currencyKeys);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch currency rates");
    }
  };

  const convertCurrency = async () => {
    if (!amount) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    try {
      const response = await axios.get(`${API_URL}${fromCurrency}`);
      const rate = response.data.rates[toCurrency];
      setExchangeRate(rate);
      setConvertedAmount((parseFloat(amount) * rate).toFixed(2));
    } catch (error) {
      Alert.alert("Error", "Failed to convert currency");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter amount"
        placeholderTextColor="gray"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />

      <Text style={styles.label}>From:</Text>
      <View style={styles.select_input}>
        <RNPickerSelect
          onValueChange={(value) => setFromCurrency(value)}
          items={currencies.map((currency) => ({
            label: currency,
            value: currency,
          }))}
          value={fromCurrency}
        />
      </View>
      <Text style={styles.label}>To:</Text>
      <View style={styles.select_input}>
        <RNPickerSelect
          onValueChange={(value) => setToCurrency(value)}
          items={currencies.map((currency) => ({
            label: currency,
            value: currency,
          }))}
          value={toCurrency}
        />
      </View>
      <TouchableOpacity onPress={convertCurrency} activeOpacity={0.8} style={styles.convert_Btn}>
        <Text style={{ fontSize: mobileW * 4.5 / 100, fontWeight: '500', color: '#fff' }}>CONVERT</Text>
      </TouchableOpacity>
      {/* <Button title="Convert"  /> */}

      {convertedAmount !== null && (
        <Text style={styles.result}>
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: mobileW * 5 / 100,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: mobileW * 7.5 / 100,
    color: '#808080',
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: mobileW * 6 / 100,
  },
  input: {
    width: mobileW * 90 / 100,
    height: mobileW * 16 / 100,
    borderWidth: mobileW * 0.5 / 100,
    borderColor: '#ccc',
    borderRadius: mobileW * 2 / 100,
    marginTop: mobileW * 1 / 100,
    backgroundColor: '#fff',
    padding: mobileW * 3 / 100,
    marginBottom: mobileW * 6 / 100,
  },
  select_input: {
    width: mobileW * 90 / 100,
    height: mobileW * 15 / 100,
    borderWidth: mobileW * 0.5 / 100,
    borderColor: '#ccc',
    borderRadius: mobileW * 2 / 100,
    marginTop: mobileW * 1 / 100,
    backgroundColor: '#fff'
  },
  label: {
    fontSize: mobileW * 5 / 100,
    marginTop: mobileW * 3 / 100,
    color: '#A9A9A9'
  },
  convert_Btn: {
    width: mobileW * 40 / 100,
    height: mobileW * 12 / 100,
    marginTop: mobileW * 4 / 100,
    backgroundColor: '#2D7ABE',
    borderRadius: mobileW * 1 / 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  
  result: {
    fontSize: mobileW * 6 / 100,
    fontWeight: "bold",
    color: '#808080',
    marginTop: mobileW * 6 / 100,
    textAlign: "center",
  },
});
