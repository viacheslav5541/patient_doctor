import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import moment from 'moment'
import Notifications from './Notifycations';
import {
    AsyncStorage,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    NativeAppEventEmitter,
    NativeEventEmitter,
    NativeModules,
    Platform,
    PermissionsAndroid,
    ScrollView,
    AppState,
    FlatList,
    Dimensions,
    Button,
    Image,
    TouchableOpacity,
    Animated,
    BackHandler
} from 'react-native';
LocaleConfig.locales['ru'] = {
    monthNames: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ],
    monthNamesShort: [
        'Янв',
        'Фев',
        'Мар',
        'Апр',
        'Май',
        'Июн',
        'Июл',
        'Авг',
        'Сен',
        'Окт',
        'Ноя',
        'Дек',
    ],
    dayNames: [
        'воскресенье',
        'понедельник',
        'вторник',
        'среда',
        'четверг',
        'пятница',
        'суббота',
    ],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    today: 'Сегодня',
};
LocaleConfig.defaultLocale = 'ru';



const _format = 'YYYY-MM-DD'
const _today = moment().format(_format)
const _maxDate = moment().add(15, 'days').format(_format)
export default
class Calendar_ extends React.Component {
    // It is not possible to select some to current day.
    initialState = {
        [_today]: {selected:true},

    }

    constructor() {
        super();

        this.state = {
            _markedDates: {[_today]: {selected: true}}
        }
    }

    onDaySelect = (day) => {
        const _selectedDay = moment(day.dateString).format(_format);
        this.setState({_markedDates:{[_selectedDay]:{selected:true}}})
    }
    componentDidMount(): void {
    }

    render() {
        console.log(Object.keys(this.state._markedDates)[0])
        return (
            <View style={{flex: 1}}>
                <Calendar
                    style={{flex:1}}
                    // we use moment.js to give the minimum and maximum dates.
                    minDate={_today}

                    // hideArrows={true}

                    onDayPress={this.onDaySelect}
                    markedDates={this.state._markedDates}
                />
                <Notifications
                    style = {{flex:1,flexDirection:"column",borderRadius:10,backgroundColor:'#1E88E5',justifyContent:'center',margin:10}}
                    date = {Object.keys(this.state._markedDates)[0]}
                ></Notifications>
            </View>
        );
    }
}