import React, { Component } from 'react';
import {CalendarList} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import moment from 'moment'
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import {
    View,
    Image,
} from 'react-native';
import New_Notify from "./New_Notify";
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
export default class Calendar_ extends React.Component {
    // It is not possible to select some to current day.
    initialState = {
        [_today]: {selected:true},
    };

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
        return (
            <View style={{flex: 1,backgroundColor:'#2979FF'}}>
                <Image source={require('../icons/volna1.png')} style = {{position:'absolute',bottom:0,left:0,width:vw(60),height:vw(60)}}></Image>
                <Image source={require('../icons/volna2.png')} style = {{position:'absolute',bottom:0,left:0,width:vw(60),height:vw(60)}}></Image>
                <Image source={require('../icons/volna1.png')} style = {{position:'absolute',top:0,right:0,width:vw(60),height:vw(60),transform: [{ rotate: '180deg'}]}}></Image>
                <Image source={require('../icons/volna2.png')} style = {{position:'absolute',top:0,right:0,width:vw(60),height:vw(60),transform: [{ rotate: '180deg'}]}}></Image>
                <View style = {{flex:1,margin:10,backgroundColor:'white',borderRadius:10}}>
                    <CalendarList
                        style={{margin:5}}
                        onDayPress={this.onDaySelect}
                        markedDates={this.state._markedDates}
                    /></View>
                <New_Notify
                    style = {{flex:1,flexDirection:"column",borderRadius:10,justifyContent:'center',margin:10}}
                    date = {Object.keys(this.state._markedDates)[0]}
                ></New_Notify>
            </View>
        );
    }
}