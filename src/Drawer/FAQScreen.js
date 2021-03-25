import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';
import { List, Checkbox } from 'react-native-paper';
import {
    generalQueries,
    paymentRefundQuries,
    cancellationAndReturn,
    placeingOrder,
    deliveryRelatedQuries,
    registrationQueries,
} from '../../FAQData';
import { getFaqDataUrl } from '../../Config/Constants';
import axios from 'axios';
import { Colors } from '../config/GlobalContants';


export default class FAQScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false
        }

    }

    async componentDidMount() {
        await this.getFaq();
    }
    getFaq = async () => {
        var url = getFaqDataUrl;
        console.log('url', url)
        this.setState({ isLoading: true, data: [] });

        await axios.get(url, {
            headers: {
                Authorization: 'Bearer ' + '',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log('Response in ?type=termsOfService', JSON.stringify(response.data.object));
                if (response.data?.object[0]) {
                    this.setState({
                        isLoading: false,
                        data: response.data.object,
                    });
                } else {
                    this.setState({ isLoading: false });
                }
            })
            .catch(function (error) {
                // handle error
                this.setState({ isLoading: false });
                // console.log(error);
            });
    }
    render() {

        return (
            <View style={{ flex: 1 }}>
                <Header backgroundColor="#fff" containerStyle={{ width: '100%' }}
                    leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.goBack()} iconName='chevron-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
                    centerComponent={{ text: 'Help', style: { paddingTop: 5 } }}
                />
                <ScrollView stickyHeaderIndices={[0, 2, 4, 6, 8, 10]}>
                    <View
                        style={{
                            backgroundColor: '#fff',
                            paddingHorizontal: 15,
                            paddingVertical: 5,
                        }}>

                    </View>
                    <View>
                        {this.state.data.map((item, index) => {
                            return (<>
                                <Text style={{ backgroundColor: Colors.primary, color: Colors.white, paddingLeft: 10, fontSize: 15, fontWeight: '700', textTransform: 'capitalize', paddingVertical: 5 }}>
                                    {item?.faqTopic?.topic}
                                </Text>
                                {item.faqs.map((it, ind) => {
                                    return (<List.Accordion
                                        key={index}
                                        style={{ backgroundColor: '#fff', marginBottom: 1 }}
                                        title={it.question}
                                        titleNumberOfLines={2}
                                        titleStyle={{
                                            fontFamily: 'sans-serif-light',
                                            fontWeight: 'bold',
                                            fontSize: 14,
                                            color: '#333',
                                        }}>
                                        <List.Item
                                            left={() => {
                                                <View style={{ maxWidth: 0 }} />;
                                            }}
                                            style={{ backgroundColor: '#fff' }}
                                            description={it.answer}
                                            descriptionStyle={styles.description}
                                            descriptionNumberOfLines={20}
                                        />
                                    </List.Accordion>)
                                })
                                }
                            </>
                            );
                        })}
                    </View>


                </ScrollView>

            </View>
        )
    }
}



const styles = StyleSheet.create({
    container: { flex: 1 },
    description: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'justify',
        fontFamily: 'sans-serif-light',
        paddingHorizontal: 10,
        color: '#353535'
    },
});