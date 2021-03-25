import { ToastAndroid } from "react-native";
import { Toast } from "native-base";
export function toast(message) {
    ToastAndroid.showWithGravity(
        message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
    );
}
export function warnToast(message) {
    Toast.show({
        text: message,
        buttonText: 'Okay',
        type: 'warning',
        duration: 5000,
    });
}

export function defaultToast(message) {
    Toast.show({
        text: message,
        buttonText: 'Okay',


    });
}

export function successToast(message) {
    Toast.show({
        text: message,
        buttonText: "Okay",
        type: "success"
    })
}

export function errorToast(message) {
    Toast.show({
        text: message,
        buttonText: "Okay",
        type: "danger"
    })
}

export function createDefaultVariantObject(prodArr) {
    let finalArray = [];

    prodArr.map((item, index) => {
        if (item && item.productResponse) {
            finalArray.push({ productListings: [{ variantValues: [item.productResponse.productListings[0].variantValues[0]] }] })
        }
    })

    // console.log('final Array:::', finalArray)
    return finalArray;
}

export function createStringWithFirstLetterCapital(string) {
    var capitalisedArr = string
        .toLowerCase()
        .split(' ')
        .map((item, index) => {
            return item.charAt(0).toUpperCase() + item.slice(1);
        });
    return capitalisedArr.join(' ');
}

export function createStringWithAllLettersCapital(string) {
    var strArr = string.split('');
    var capitalisedArr = [];
    strArr.map((item, index) => {
        capitalisedArr.push(item.toUpperCase());
    });
    return capitalisedArr.join('');
}

export function getDate(date) {
    // console.log('New date', date);
    var newDate = date.split('-');
    var myDate =
        newDate[2][0] +
        newDate[2][1] +
        ' ' +
        getMonth(newDate[1]) +
        ' ' +
        newDate[0];
    return myDate;
}

export function convertDate(dateStr) {
    var newDate = new Date(dateStr);
    var date = newDate.toString().split(' ').slice(0, 4);
    var finalDate = date[0] + ',' + date[2] + '-' + date[1] + '-' + date[3];
    return finalDate;
}

export function getMonthForCheckout(num) {
    if (num == 0) {
        return 'Jan';
    } else if (num == 1) {
        return 'Feb';
    } else if (num == 2) {
        return 'March';
    } else if (num == 3) {
        return 'April';
    } else if (num == 4) {
        return 'May';
    } else if (num == 5) {
        return 'June';
    } else if (num == 6) {
        return 'July';
    } else if (num == 7) {
        return 'Aug';
    } else if (num == 8) {
        return 'Sep';
    } else if (num == 9) {
        return 'Oct';
    } else if (num == 10) {
        return 'Nov';
    } else if (num == 11) {
        return 'Dec';
    }
}

export function getMonth(num) {
    if (num === 1) {
        return 'Jan';
    } else if (num == 2) {
        return 'Feb';
    } else if (num == 3) {
        return 'March';
    } else if (num == 4) {
        return 'April';
    } else if (num == 5) {
        return 'May';
    } else if (num == 6) {
        return 'June';
    } else if (num == 7) {
        return 'July';
    } else if (num == 8) {
        return 'Aug';
    } else if (num == 9) {
        return 'Sep';
    } else if (num == 10) {
        return 'Oct';
    } else if (num == 11) {
        return 'Nov';
    } else if (num == 12) {
        return 'Dec';
    }
}

export function getDay(num) {
    if (num === 0) return 'SUN';
    if (num === 1) return 'MON';
    if (num === 2) return 'TUE';
    if (num === 3) return 'WED';
    if (num === 4) return 'THU';
    if (num === 5) return 'FRI';
    if (num === 6) return 'SAT';
}

export function getCurrentTimeinHours() {
    var currentdate = new Date();
    var datetime =
        'Last Sync: ' +
        currentdate.getDate() +
        '/' +
        (currentdate.getMonth() + 1) +
        '/' +
        currentdate.getFullYear() +
        ' @ ' +
        currentdate.getHours() +
        ':' +
        currentdate.getMinutes() +
        ':' +
        currentdate.getSeconds();

    // datetime stores this value 'Last Sync: 25/6/2020 @ 19:8:48'

    var currentHour = currentdate.getHours();
    return currentHour;
}

export function getDateAndTime(firestoreTimestamp) {
    var UTCDate = firestoreTimestamp.toDate();
    var dateAndTime =
        UTCDate.getFullYear() +
        '-' +
        (UTCDate.getMonth() + 1) +
        '-' +
        UTCDate.getDate();
    return dateAndTime;
}

export function findCartTotal(cart) {
    var total = 0;
    cart.map((item, index) => {
        total +=
            item.productListings.findIndex(
                x => x.variantValues[0] === item.variantSelectedByCustome,
            ) === -1
                ? item.productListings[0].sellingPrice * item.productCountInCart
                : item.productListings[
                    item.productListings.findIndex(
                        x => x.variantValues[0] === item.variantSelectedByCustome,
                    )
                ].sellingPrice * item.productCountInCart;
    });
    return total;
}

export function findCouponDiscount(lotOfData, cartTotal) {
    var discount = 0;
    // console.log(
    //   'Here is coupone response data from shared functions',
    //   lotOfData.data.object[0].type,
    //   lotOfData.data.object[0].value,
    // );
    const typeOfCoupon = lotOfData.data.object[0].type;
    const valueOfCoupon = lotOfData.data.object[0].value;
    if (typeOfCoupon === 'Fixed') {
        discount = valueOfCoupon;
    } else if (typeOfCoupon === 'Percent') {
        discount = (cartTotal / 100) * valueOfCoupon;
    }
    return Math.round(discount);
}
