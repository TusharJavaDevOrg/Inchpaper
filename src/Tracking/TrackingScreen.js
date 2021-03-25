import Axios from 'axios';
import React, { Component } from "react";
import {
  Dimensions, Image, Linking, StatusBar, StyleSheet, Text,


  TouchableOpacity, View
} from "react-native";
import { Header, Icon } from "react-native-elements";
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { dunzoTrackStatus, fetchSupplierDetails, getDunzoAccessToken, gioCoderApiKey } from '../../Config/Constants';
import IonIcon from 'react-native-vector-icons/Ionicons'
import { toast } from '../Functions/functions';



class TrackingScreen extends Component {


  constructor(props) {
    super(props)
    this.mapRef = null;
    this.state = {
      agentModalVisible: false,
      latitude: 0,
      longitude: 0,
      isSupplierLoading: false,
      supplierData: [],
      isTokenLoading: false,
      tokenData: [],
      isStatusLoading: false,
      statusData: [],
      client_id: 0,
      delName: 'Delivery Agent',
      delPhone: 0,
      delStatus: '',
      delDescription: '',
      orderPickedStatus: false,
      routeCoordinates: [],
      newData: [],
      counter: 0,
      coords: null,
      mapState: false,


    }

  }

  componentDidMount() {
    console.log('tackin', this.props.route.params?.client, this.props.route.params?.token)
    this.getTrackingStatus(this.props.route.params.client, this.props.route.params.token);

    try {
      let myInterval = setInterval(async () => {


        if (this.state.delStatus == 'reached_for_delivery') {
          clearInterval(myInterval);
          toast("Order Delivered")
          this.props.navigation.goBack();
        }
        else {


          this.getTrackingStatus(this.props.route.params.client, this.props.route.params.token);
        }

      }, 20000);
    }
    catch (e) {
      console.log(e);
    }



  }
  getSupplierDetails = async () => {
    var url = fetchSupplierDetails();


    this.setState({ isSupplierLoading: true });

    await Axios.get(url, {
      headers: {
        Authorization: 'bearer ' + '',
        'Content-type': 'application/json',
      },
      timeout: 15000,
    })
      .then((response) => {
        // console.log('supplier data->', response.data.object[0]);
        // response.data.object.map((item, ind) => {
        //   this.state.supplierData.push(item)
        // })
        this.setState({
          isSupplierLoading: false,
          // bannersData: response.data.object,

        });
        this.getAccessToken(response.data.object[0].clientId, response.data.object[0].clientSecret);
      })
      .catch((error) => {
        if (!error.status) {
          this.setState({ isSupplierLoading: false });
        }
        console.log('Error supplier', error);
      });
  };
  getAccessToken = async (clientId, clientSecret) => {
    var url = getDunzoAccessToken();


    this.setState({ isTokenLoading: true });

    await Axios.get(url, {
      headers: {

        'client-id': clientId,
        'client-secret': clientSecret,
        'Accept-Language': 'en-US',
        'Content-type': 'application/json',

      },
      timeout: 15000,
    })
      .then((response) => {
        // console.log('token data->', response.data.token);

        this.setState({
          isTokenLoading: false,
          client_id: clientId,
          tokenData: response.data.token,

        });
        console.log('FF', this.state.client_id, this.state.tokenData)
        // this.getTrackingStatus(clientId,response.data.token)
      })
      .catch((error) => {
        if (!error.status) {
          this.setState({ isTokenLoading: false });
        }
        console.log('Error token', error);
      });
  };
  getTrackingStatus = async (clientId, token) => {


    var url = dunzoTrackStatus(this.props.route.params.task);


    this.setState({ isStatusLoading: true });

    await Axios.get(url, {
      headers: {

        'client-id': clientId,
        'Authorization': token,
        'Accept-Language': 'en-US',
        'Content-type': 'application/json',

      },
      timeout: 15000,
    })
      .then((response) => {
        // console.log('status data->', response.data);

        // if(response.data.state=='delivered'){
        //   this.props.navigation.goBack()
        //   toast('Order Delivered')
        // }
        this.setState({
          isStatusLoading: false,
          // statusData: response.data,
          latitude: response.data.runner.location.lat,
          longitude: response.data.runner.location.lng,
          delName: response.data.runner.name,
          delPhone: response.data.runner.phone_number,
          delStatus: response.data.state,
          newData: [...this.state.newData, {
            latitude: response.data.runner.location.lat,
            longitude: response.data.runner.location.lng
          }],
          mapState: true

        });
      })
      .catch((error) => {
        if (!error.status) {
          this.setState({ isStatusLoading: false });
        }
        console.log('Error status', error);
      });
  };
  getCurrentoaction = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        // console.log('location--> ' + JSON.stringify(location));
        Geocoder.from(location.latitude, location.longitude)
          .then((json) => {
            // console.log('jsooonnnnnn', json)
            this.setState({
              address: json.results[2].formatted_address,
              addressGeoCodedData: json.results[0],
            });
            // this.props.getGoogleAddress(
            //   place.location.latitude,
            //   place.location.longitude,
            //   json.results[0],
            // );
            // console.log('formatted Address :', json.results[1]);
          })
          .catch((error) => {
            // console.log('error geocds ' + JSON.stringify(error))
          });
        this.setState({
          longitude: location.longitude,
          latitude: location.latitude,
        });
      })
      .catch((error) => {
        // console.log('error' + error);
      });
    Geocoder.init(gioCoderApiKey);
  };
  setAgentModalVisible = (value) => {

    this.setState({ agentModalVisible: value })

  }

  ShowModalFunction(visible) {
    this.setState({ ModalVisibleStatus: visible });
  }
  nav = () => {
    this.props.navigation.navigate('Chat')
  }
  render() {
    // console.log('STAT', this.state.latitude, this.state.longitude)
    // console.log('STAT 2 ', this.state.delStatus)
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor='white' hidden={false} barStyle="dark-content" />
        <Header backgroundColor={'#fff'}
          // leftComponent={<LeftHeaderComponenet iconName="close-outline" iconSize={25} iconColor={'white'} iconType="ionicon" onPress={() => this.props.navigation.goBack(null)} />}
          leftComponent={<Icon name="keyboard-backspace" color="#5E5F5E" size={25} onPress={() => this.props.navigation.goBack()} />}
          centerComponent={
            <View style={{ right: '20%' }}  >
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'black', textTransform: 'uppercase' }} >Order #{this.props?.route?.params?.order?.id}</Text>
              <Text style={{ fontSize: 12, color: 'black' }} numberOfLines={1}  >{this.props?.route?.params?.order?.requiredDate} | {this.props?.route?.params?.order?.orderAmount} </Text>
            </View>
          }
          rightComponent={{ text: 'Help', style: { color: "#000", fontSize: 16, fontFamily: 'SFUIText-Bold' }, onPress: () => this.props.navigation.navigate('Support') }}

        />

        {this.state.mapState ?
          <MapView
            style={this.state.delStatus == 'started_for_delivery' || this.state.delStatus == 'reached_for_delivery' ? {
              flex: 0.9,
              width: Dimensions.get('window').width,
              justifyContent: 'center',
              overflow: 'hidden'
            } : {
                flex: 0.6,

                width: Dimensions.get('window').width,

                justifyContent: 'center',
                overflow: 'hidden'
              }}
            provider={PROVIDER_GOOGLE}

            ref={(ref) => { this.mapRef = ref }}
            onLayout={() => this.mapRef.fitToCoordinates([{
              latitude: this.state.latitude,
              longitude: this.state.longitude
            },
            {
              latitude: parseFloat(this.props?.route?.params?.address?.selectedAddress?.latitude),
              longitude: parseFloat(this.props?.route?.params?.address?.selectedAddress?.longitude),
            }],
              { edgePadding: { top: 100, right: 100, bottom: 100, left: 100 }, animated: true })}

          >


            <MapViewDirections
              origin={{
                latitude: this.state.latitude,
                longitude: this.state.longitude
              }}
              destination={{
                latitude: parseFloat(this.props?.route?.params?.address?.selectedAddress?.latitude),
                longitude: parseFloat(this.props?.route?.params?.address?.selectedAddress?.longitude)
              }}
              apikey={gioCoderApiKey}
              strokeWidth={5}
              strokeColor={'#000'}
            />
            {/* <Polyline coordinates={this.state.newData} strokeWidth={3} /> */}
            <Marker coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,

            }}
            >
              <Image source={require('../assets/scooter.png')} style={{ height: 50, width: 50 }} />

            </Marker>


            <Marker coordinate={{
              latitude: parseFloat(this.props?.route?.params?.address?.selectedAddress?.latitude),
              longitude: parseFloat(this.props?.route?.params?.address?.selectedAddress?.longitude),
              latitudeDelta: 0.015,
              longitudeDelta: 0.015,
            }}
            >
              <Image source={require('../assets/flag.png')} style={{ height: 50, width: 50 }} />
            </Marker>

          </MapView>
          : <View style={this.state.delStatus == 'started_for_delivery' || this.state.delStatus == 'reached_for_delivery' ? {
            flex: 0.9,
            width: Dimensions.get('window').width,

          } : {
              flex: 0.6,
              width: Dimensions.get('window').width,

            }} />}
        {
          this.state.delStatus == 'started_for_delivery' || this.state.delStatus == 'reached_for_delivery' ?
            <View style={{ flex: 0.1, padding: 5, }}>
              <View style={{ backgroundColor: '#fff', padding: 5, paddingHorizontal: 5 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Icon name="cube-outline" type="ionicon" size={25} color="#868E8C" style={{}} />
                  <View>
                    <Text style={{ fontFamily: 'SFUIText-Bold', fontSize: 18, color: '#000' }}>{this.state.delStatus == 'reached_for_delivery' ? 'Order Delivered' : 'Started For Delivery'}</Text>
                    <Text style={{ fontSize: 14, color: '#979D9C' }}>{this.state.delName} has picked up your order</Text>
                    <Text style={{ fontSize: 14, color: Colors.primary }}
                      onPress={() => Linking.openURL(`tel:${this.state.delPhone}`)}>Call {this.state.delName}</Text>
                  </View>
                  <Image style={{ height: 60, width: 60, borderRadius: 10 }} source={{ uri: 'data:image/jpeg;base64,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' }} />
                </View>
              </View>
            </View>

            :
            <View style={{ flex: 0.4, }}>
              <View style={{ padding: 5 }}>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5, }}>
                  <Icon name="receipt-outline" type="ionicon" size={25} color="#868E8C" style={{ top: '10%', paddingLeft: 5 }} />
                  <View style={{ padding: 5, left: '20%' }}>

                    <Text
                      style={[{ fontSize: 18, fontFamily: 'SFUIText-Bold', textTransform: 'capitalize' }
                        , this.state.delStatus == 'runner_accepted' ? { color: 'black' } : { color: '#979D9C' }]}>
                      Order Received</Text>

                    <Text style={{ fontSize: 13, color: '#979D9C' }}>Delivery Partner is going to pickup your order</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10, }}>
                      <IonIcon name="call" size={20} color={Colors.primary} />
                      <Text style={{ fontFamily: 'SFUIText-Bold', color: Colors.primary, left: 5 }}
                        onPress={() => Linking.openURL(`tel:${this.state.delPhone}`)}>Call Delivery Agent</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }} />
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 10, paddingVertical: 20, alignItems: 'center' }}>
                  <IonIcon name="restaurant-outline" size={25} color="#868E8C" style={{}} />
                  <View style={{ padding: 5, left: '22%' }}>
                    <Text style={[{ fontSize: 18, fontFamily: 'SFUIText-Bold', textTransform: 'capitalize' },
                    this.state.delStatus == 'reached_for_pickup' ? { color: 'black' } : { color: '#979D9C' }]}>Reached For Pickup</Text>

                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }} />

                <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5, paddingVertical: 20, alignItems: 'center' }}>
                  <IonIcon name="cube-outline" size={25} color="#868E8C" style={{}} />
                  <View style={{ padding: 5, left: '22%' }}>
                    <Text style={[{ fontSize: 18, fontFamily: 'SFUIText-Bold', textTransform: 'capitalize', color: '#979D9C' }]}>Started For Delivery</Text>

                  </View>
                </View>
                <View style={{ height: 1, backgroundColor: 'lightgray', width: '100%' }} />

                {/* <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5 , paddingVertical: 20 , alignItems: 'center'}}>
                                          <Text style={{ fontSize: 18, fontWeight: 'bold',textTransform: 'capitalize', color: '#8bc34a' }}>Cancel Order</Text>
                                    </View> */}

              </View>
            </View>
        }
      </View>
    );
  }
}
export default TrackingScreen;

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  // mapStyle: {
  //     position: 'absolute',
  //     top: 0,
  //     left: 0,
  //     right: 0,
  //     bottom: 0,
  //   },
});