import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, Button, SafeAreaView,
  ActivityIndicator, TextInput, FlatList, Image
} from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [keyword, setKeyword] = useState(0);
  const [currencies, setCurrencies] = useState({});
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [value, setValue] = useState(0);
  const requestOptions = {
    method: 'GET',
    headers: {
      'apikey': 'SPHc3GEDFW5DnDzDy8tLqKnJKmDk47Ay'
    }
  }

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.apilayer.com/exchangerates_data/latest?base=EUR`, requestOptions)
      .then(response => {
        if (!response.ok)
          throw new Error("Error in fetch:" + response.statusText);
        return response.json()
      })
      .then(data => setCurrencies(data.rates ?? {}))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);
//  console.log(currencies);

  const convert = () => {
    const numeric = parseFloat(keyword);
    const newrate = numeric * currencies[currency]
    setValue(newrate.toFixed(2));
  }


  return (
    <SafeAreaView style={styles.container}>
      <Text style={{fontSize: 24}}>{value} €</Text>
        {loading && <ActivityIndicator size="large" />} 

      <View style={{paddingTop: 20, textDecorationLine: 'underline', flexDirection: 'row', marginLeft:100,}}>
        <TextInput
          style={{ fontSize: 18, borderRadius: 6 }}
          placeholder='Amount'
          keyboardType="decimal-pad"
          value={keyword}
          onChangeText={text => setKeyword(text)}
        />

        <Picker
          selectedValue={currency}
          onValueChange={(itemValue) => setCurrency(itemValue)}
          style={styles.picker}
          mode='dropdown'
        >
          {Object.keys(currencies).map((cur) => (
            <Picker.Item key={cur} label={cur} value={cur} />
          ))}
        </Picker>
      </View>

      <View>
        <Button title="CONVERT" onPress={convert} />
      </View>

      <StatusBar />
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

  },
  picker: {
    height: 200,
    width: 140,
    marginRight: 100,
  },
});
