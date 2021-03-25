import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Header } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';

export default class SortScreen extends Component {
    constructor(props){
        super(props);
        this.state={

            sortTag:[
                {"tagName": "Relevance"},
                {"tagName": "Highest Price First"},
                {"tagName": "Lowest Price First"},
                {"tagName": "Fastest Shipping"},
                {"tagName": "Newest"},
            ]
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header backgroundColor="#fff"
                    leftComponent={<IconHeaderComponenet onPress={()=>  this.props.navigation.goBack()} iconName="chevron-back-outline" iconType="ionicon" iconColor="#000" iconSize={25} /> }
                    centerComponent={{ text: 'Sort By' }}
                />
                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View>
                        <FlatList data={this.state.sortTag} keyExtractor={({ item,index }) => String()} renderItem={({ item }) =>  (
                            <View style={{ paddingVertical: 8 }}>
                                <TouchableOpacity style={{ padding: 15, borderBottomWidth: 1, borderColor: '#F0F0F0' }}>
                                    <Text style={{ fontFamily: 'sans-serif-light', textAlign: 'center', color: '#404040' ,fontWeight: 'bold', fontSize: 15 }}>{item.tagName}</Text>
                                </TouchableOpacity>
                            </View>
                        )} />
                    </View>
                </View>
            </View>
        )
    }
}
