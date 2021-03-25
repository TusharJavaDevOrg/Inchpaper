import { Radio } from 'native-base';
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StatusBar, FlatList, Dimensions} from 'react-native';
import { Header } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';

export default class FilterScreen extends Component {
    constructor(props){
        super(props);
        this.state={
           
            flterTag: [
                {"tagName": "Brand"},
                {"tagName": "Price"},
                {"tagName": "Dimesion"},
                {"tagName": "Material"},
                {"tagName": "Set Size"},
                {"tagName": "Colour"}, 
            ],

            filterSubTag: [
                {"tagName": "₹6000 And Below"},
                {"tagName": "₹6000 - ₹7000"},
                {"tagName": "₹7000 - ₹8000"},
                {"tagName": "₹8000 - ₹9000"},
                {"tagName": "₹9000 - 10,000"},
                {"tagName": "₹10,000 And Above"},
            ]
           
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar backgroundColor="transparent" barStyle="dark-content" />
                <Header backgroundColor="#fff"
                    leftComponent={<IconHeaderComponenet onPress={()=>  this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} /> }
                    centerComponent={{ text: 'Filter' }}

                />
                
                <View style={{ flex: 1,  }}>
                    <View style={{ flexDirection: 'row' }}>
                        
                        <View style={{ width: '35%',  height: Dimensions.get('window').height }}>
                            <FlatList data={this.state.flterTag} keyExtractor={(item,index)=> String(index)} renderItem={({ item }) => (
                                <View style={{ width: '100%', }}>
                                    <TouchableOpacity style={{ paddingVertical: 15 , paddingLeft: 10, borderBottomWidth: 1, borderColor: '#E9E9E9'}}>
                                        <Text style={{ fontFamily: 'sans-serif-light', fontWeight: 'bold', fontSize: 14, color: '#444444' }}>{item.tagName}</Text>
                                    </TouchableOpacity>
                                </View>
                            )} />
                        </View>

                        <View style={{ width: '65%',backgroundColor: '#fff', height: Dimensions.get('window').height }}>
                            <FlatList data={this.state.filterSubTag} keyExtractor={(item,index)=> String(index)} renderItem={({ item }) => (
                                <View style={{ width: '100%',  }}>
                                    <TouchableOpacity style={{ paddingVertical: 15 ,borderBottomWidth: 1, borderColor: '#E9E9E9' }}>
                                        <Text style={{ fontFamily: 'sans-serif-light',paddingLeft: 20 ,fontSize: 14, color: '#444444' }}>{item.tagName}</Text>
                                    </TouchableOpacity>
                                </View>
                            )} />  
                        </View>

                    </View>

                </View>

                <View>
                    <View style={{ flexDirection: 'row' }}>

                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ backgroundColor: '#DFDFDF', padding: 15, width: '35%' }}>
                            <Text style={{ textTransform: 'uppercase', color: '#444444', fontSize: 13, fontFamily: 'sans-serif-light', textAlign: 'center', fontWeight: 'bold', letterSpacing: 1 }}>close</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ backgroundColor: '#FF5733', padding: 15, width: '65%' }}>
                            <Text style={{ textTransform: 'uppercase', color: '#fff', fontSize: 13, fontFamily: 'sans-serif-light', textAlign: 'center', fontWeight: 'bold', letterSpacing: 1 }}>Apply</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        )
    }
}


