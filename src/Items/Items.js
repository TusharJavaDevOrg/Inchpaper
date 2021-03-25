/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  FlatList, Image,






  ScrollView, StatusBar,
  StyleSheet, Text,


  TouchableOpacity,




  TouchableWithoutFeedback, View
} from 'react-native';
import { Avatar, Header, Icon } from 'react-native-elements';
import { SliderBox } from 'react-native-image-slider-box';
// import {currentPage} from '../config/constants';
import { ActivityIndicator, Card } from 'react-native-paper';
import Stars from 'react-native-stars';
import IconHeaderComponenet from '../Components/IconHeaderComponenet';


export default class Items extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryId: '',
      catergoryProductList: [],
      categoryName: '',
      categoryProductId: '',
      currentPage: 1,
      pImages: [
        "https://www.ikea.com/in/en/images/products/friheten-three-seat-sofa-bed-bomstad-black__0525511_PE644872_S5.JPG?f=xxs",
        "https://www.ikea.com/in/en/images/products/friheten-three-seat-sofa-bed-bomstad-black__0620064_PE689377_S5.JPG?f=xxs",
        "https://www.ikea.com/in/en/images/products/friheten-three-seat-sofa-bed-bomstad-black__0833773_PE644647_S5.JPG?f=xxs",
        "https://www.ikea.com/in/en/images/products/friheten-three-seat-sofa-bed-bomstad-black__0833764_PE518008_S5.JPG?f=xxs",
      ],
      colorVariant: [
        { "colrName": "#CE0000", "ColorName": "Marron" },
        { "colrName": "#050000", "ColorName": "Black" },
        { "colrName": "#F5F500", "ColorName": "Yellow" },
        { "colrName": "#CE05D1", "ColorName": "Dark Purple" },
      ],
      userReviews: [
        { "avatarColor": "green", "avatarTitle": "Tb", "username": "Toddd Bensan", "rating": 3, "message": "It is a long established fact that a reader will be distracted by the readable", "date": "1 jan 2021" },
        { "avatarColor": "purple", "avatarTitle": "Sl", "username": "sam lensan", "rating": 5, "message": "It is a long established fact that a reader will be distracted by the readable", "date": "1 0oct 2021" },
        { "avatarColor": "#C70039", "avatarTitle": "Tm", "username": "Tod mmssa", "rating": 2, "message": "It is a long established fact that a reader will be distracted by the readable", "date": "1 feb 2020" },
      ],
    };
  }

  componentDidMount() {
    // make a call to the api for subCatergory by passing the category id
    // getSubCategory();
    // console.log(this.props);
    // console.log(this.props.route.params.categoryId);
    // console.log(this.props.route.params.title);

    const { categoryId, title } = this.props.route.params;
    this.setCategoryId(categoryId);
    // let newCategoryName = this.props.route.params.title;
    this.setCategoryName(title);

    // Fetch the product list for a particular category using category Id

  }

  setCategoryId(newcategoryId) {
    this.setState({ categoryId: newcategoryId });
  }

  setCategoryName(newCategoryName) {
    this.setState({ categoryName: newCategoryName });
  }

  loadMoreProducts = () => {
    console.warn('Load more products');
    this.setState(
      (prevState) => ({ currentPage: prevState.currentPage + 1 }),
      () => {
        console.log('ffff')
      })
  };
  renderFooter() {
    return (
      <View>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <Header backgroundColor="#fff"
          leftComponent={<IconHeaderComponenet onPress={() => this.props.navigation.navigate('Home')} iconName='arrow-back-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
          rightComponent={<IconHeaderComponenet iconName='cart-outline' iconType="ionicon" iconColor="#000" iconSize={25} />}
        />
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            <View style={{ borderBottomColor: '#B0AEB0', borderBottomWidth: 1 }}>
              <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('ViewFullImage', { imageUrl: images })}>
                <SliderBox on images={this.state.pImages} sliderBoxHeight={400} resizeMode={'cover'} />
              </TouchableWithoutFeedback>
            </View>

            <View style={{ padding: 10 }}>
              <View>
                <Text style={{ fontSize: 12 }}>Three-seat sofa-bed, Bomstad </Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', paddingTop: 10, letterSpacing: 1 }}>FRIHETEN</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 13, }}>Rs <Text style={{ fontSize: 17 }}>43,990</Text></Text>
              </View>
              <View style={{ paddingVertical: '5%' }}>
                <Text style={{ fontSize: 14, fontFamily: 'sans' }}>It is a long established fact that a reader will be distracted by the readable content of a
                age when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal
                distribution of letters, as opposed to using 'Content here, content here',</Text>
              </View>
              <View>
                <Text style={{ fontSize: 15 }}>Select by Color: <Text style={{ fontWeight: 'bold' }}>Grey</Text></Text>
                <FlatList horizontal={true} data={this.state.colorVariant} keyExtractor={(item, index) => String(index)} renderItem={({ item, index }) => (
                  <View style={{ padding: 5 }}>
                    <TouchableOpacity style={{ backgroundColor: item.colrName, padding: 18, borderRadius: 40 }}>

                    </TouchableOpacity>
                  </View>
                )} />
              </View>
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 15, }}>Products Review</Text>
                  <Text onPress={() => this.props.navigation.navigate('Review')} style={{ fontWeight: 'bold', fontSize: 12, color: '#A50000', }}>See all reviews</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <FlatList data={this.state.userReviews} key={(item, index) => String(index)} contentContainerStyle={{ paddingBottom: 20 }} renderItem={({ item }) => (
                    <View style={{ padding: 5, }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Avatar rounded title={item.avatarTitle} titleStyle={{ fontSize: 15 }} containerStyle={{ backgroundColor: item.avatarColor }} />
                        <Text style={styles.commentHeading}>{item.username} :</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: '3%' }}>
                        <Stars
                          default={item.rating}
                          spacing={5}
                          fullStar={<Icon type='entypo' name={'star'} size={12} color={'#ffb300'} />}
                          emptyStar={<Icon type='entypo' name={'star-outlined'} size={12} color={'#000'} />}
                          count={5}
                          starSize={25}
                        />
                        <Text style={styles.commentDate}>{item.date}</Text>

                      </View>
                      <Text style={styles.comment}>{item.message}</Text>

                    </View>
                  )} ItemSeparatorComponent={() => (
                    <View style={{ height: 5, }} />
                  )} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 13, color: '#28B463', paddingRight: 10, bottom: 10, }}>Write a review</Text>
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={{ padding: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ borderColor: 'red', borderWidth: 1.5, borderRadius: 5, padding: 5, width: '20%', alignItems: 'center' }}>
              <Icon name="heart-outline" type="ionicon" color="red" size={30} />
            </View>
            <TouchableOpacity style={{ backgroundColor: '#A50000', padding: 14, borderRadius: 3, width: '75%' }}>
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', letterSpacing: 1, }}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={styles.header}>
          <TouchableOpacity
            // onPress={() => this.props.navigation.navigate('Home')
            onPress={() => this.props.navigation.goBack()}>
            <Icon style={Style.icon} name="arrow-back" />
          </TouchableOpacity>

          <Title style={styles.headline}>{this.state.categoryName}</Title>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('Filter', {
                categoryId: this.state.categoryId,
              })
            }>
            <Icon
              style={styles.icon}
              name="filter-menu"
              type="MaterialCommunityIcons"
            />
          </TouchableOpacity>
        </View> */}

        {/* <ScrollView> */}
        {/* <TouchableOpacity> */}
        {/* <View
          style={{
            flexDirection: 'row',
            // flexDirection: 'column',
            flexWrap: 'wrap',
          }}> */}
        {/* <FlatList
          data={this.state.catergoryProductList}
          vertical
          // horizontal={false}
          showsVerticalScrollIndicator={false}
          renderItem={this.renderItem}
          keyExtractor={(item, i) => i.toString()}
          numColumns={2}
          onEndReached={this.loadMoreProducts}
          onEndReachedThreshold={0.3}
          ListFooterComponent={this.renderFooter}
        /> */}

        {/* <FlatList
                data={this.state.catergoryProductList}
                // data={[
                //   {
                //     image: require('../assets/F6.png'),
                //     title: 'Home corner sofa',
                //     subtittle: 'Home made edge in waeve Engineered wooden',
                //   },
                //   {
                //     image: require('../assets/F5.png'),
                //     title: 'Home corner sofa',
                //     subtittle: 'Home made edge in waeve Engineered wooden',
                //   },
                //   {
                //     image: require('../assets/F4.png'),
                //     title: 'Home corner sofa',
                //     subtittle: 'Home made edge in waeve Engineered wooden',
                //   },
                //   {
                //     image: require('../assets/F3.png'),
                //     title: 'Home corner sofa',
                //     subtittle: 'Home made edge in waeve Engineered wooden',
                //   },
                //   {
                //     image: require('../assets/F2.png'),
                //     title: 'Home corner sofa',
                //     subtittle: 'Home made edge in waeve Engineered wooden',
                //   },
                //   {
                //     image: require('../assets/F4.png'),
                //     title: 'Home corner sofa',
                //     subtittle: 'Home made edge in waeve Engineered wooden',
                //   },
                //   {
                //     image: require('../assets/F1.png'),
                //     title: 'Home corner sofa',
                //     subtittle: 'Home made edge in waeve Engineered wooden',
                //   },
                // ]}
                vertical
                showsVerticalScrollIndicator={false}
                renderItem={this.renderItem}
                keyExtractor={(item, i) => i.toString()}
              /> */}
        {/* </View> */}
        {/* </TouchableOpacity> */}
        {/* </ScrollView> */}
      </View>
    );
  }
  renderItem = ({ item, index }) => (
    <View style={styles.flatistview}>
      <Card
        onPress={() =>
          this.props.navigation.navigate('ItemDetail', {
            categoryId: this.state.categoryId,
            categoryProductId: item.categoryProductId,
          })
        }
        elevation={9}
        style={{ borderRadius: 10 }}>
        {/* <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('ItemDetail', {
              categoryId: this.state.categoryId,
              categoryProductId: item.categoryProductId,
            })
          }> */}
        <Image source={{ uri: item.image }} style={styles.img} />
        {/* <Card.Cover source={{uri: item.image}} style={styles.img} /> */}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          {/* <Text numberOfLines={3} style={styles.subtittle}>
              {item.subtitle}
            </Text> */}
        </View>
        {/* </TouchableOpacity> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <Text style={{ paddingStart: 5, marginTop: 9 }}>
            Rs.{item.priceTag}
          </Text>
          <Icon style={{ marginTop: 9, fontSize: 18 }} name="bookmark-outline" />
        </View>
      </Card>
    </View>
  );
}

// const styles = StyleSheet.create({
//   headline: {alignSelf: 'center', color: 'black', fontWeight: 'bold'},
//   icon: {marginHorizontal: 15, marginTop: 15, fontSize: 24},
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     height: 50,
//   },
//   flatistview: {
//     flexDirection: 'column',
//     // flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',

//     // marginVertical: 1,
//     padding: 5,
//     elevation: 0.5,
//     // borderWidth: 0.1,
//     // marginHorizontal: 1,
//     margin: 2,
//     height: 300,
//   },
//   img: {
//     height: 200,
//     width: 180,
//   },
//   title: {
//     paddingStart: 5,
//     marginTop: 5,
//     fontSize: 16,
//     color: 'black',
//     width: 170,
//   },
//   subtittle: {color: 'grey', paddingStart: 5, width: 180},
// });

const styles = StyleSheet.create({
  commentHeading: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
    paddingHorizontal: 5
  },
  comment: {
    fontSize: 14,
    color: 'grey',
    width: '99%',
  },
  commentDate: {
    fontSize: 13,
    color: '#A6ACA6',
    paddingHorizontal: 5
  },
});
