import handlebars from 'handlebars';
import fs from 'fs';
import yaml from 'js-yaml';
import _ from 'lodash';
import { Component, Property } from 'immutable-ics'
import moment from 'moment';
import uuid from 'uuid';

const now = new moment();
var loadBuiltinHelpers = require('./loadBuiltinHelpers');
var loadPartials = require('./loadPartials');

loadBuiltinHelpers(handlebars, './helpers/');
loadPartials(handlebars, './');


_.mixin({
    'sortKeysBy': function (obj, comparator) {
        var keys = _.sortBy(_.keys(obj), function (key) {
            return comparator ? comparator(obj[key], key) : key;
        });

        return _.zipObject(keys, _.map(keys, function (key) {
            return obj[key];
        }));
    }
});



class Semesterplan {

  constructor(data) {
    this.path_data = data.data || '';
    this.path_template = data.template || '';
    this.path_dest = data.dest || '';
    this.path_ics = data.ics || '';
  }

  loader() {

      // get yml data
      try {
        this.data = yaml.safeLoad(fs.readFileSync(this.path_data, 'utf8'));

        // console.log(doc);
      } catch (e) {
        console.log(e);
      }

      this.template =fs.readFileSync(this.path_template, 'utf8')
      // this.dest =fs.readFileSync(this.path_data, 'utf8')
  }

  _addTimeToLession(lessionKey) {
    if (lessionKey) {
      let data = this.data;
      data.lessions[lessionKey].total += 4;
    }
  }

  _addDayToLession(lessionKey, lessionDate) {
    if (lessionKey) {
      let data = this.data;
      if (!data.lessions[lessionKey].days) {
        data.lessions[lessionKey].days = [];
      }
      data.lessions[lessionKey].days.push(lessionDate);
    }
  }

  calcTotal() {

    let data = this.data;

    // add everywhere a total key to the lessions
    _.forEach(data.lessions, (value, key) => {
      data.lessions[key].total = 0;
    });

    // calculate total numbers of lessions
    _.forEach(data.semester.planing, (value, key) => {

      if (value.FR) {

        this._addTimeToLession(value.FR.morning.lession);
        this._addTimeToLession(value.FR.afternoon.lession);
        this._addDayToLession(value.FR.morning.lession, {KW: value.KW, day: 5, text:' 08:15 – 11:40'});
        this._addDayToLession(value.FR.afternoon.lession, {KW: value.KW, day: 5, text:' 13:15 – 16:45'});
      }

      if (value.SA) {
        this._addTimeToLession(value.SA.morning.lession);
        this._addTimeToLession(value.SA.afternoon.lession);
        this._addDayToLession(value.SA.morning.lession, {KW: value.KW, day: 6, text:' 08:15 – 11:40'});
        this._addDayToLession(value.SA.afternoon.lession, {KW: value.KW, day: 6, text:' 13:15 – 16:45'});
      }
    });
    data.lessions = _.sortKeysBy(data.lessions, (item) => { return item.title; });
  }


  icsEvent(data) {
    // console.log(JSON.stringify(data, null, '  '))

    var title = data.comment || '';

    if (data.resolve.lession && data.resolve.lession.title) {
      title = data.resolve.lession.title;
    }

    var event = new Component({
            name: 'VEVENT',
            // components: [
            //   new Component({
            //     name: 'VALARM',
            //     properties: [
            //       new Property({ name: 'ACTION', value: 'DISPLAY' }),
            //       new Property({ name: 'TRIGGER', value: '-PT12H' }),
            //       new Property({ name: 'DESCRIPTION', value: 'Event reminder' })
            //     ]
            //   })
            // ],
            properties: [
              new Property({ name: 'UID', value: uuid.v1() }),
              new Property({
                name: 'DTSTAMP',
                value: now.toDate(),
                parameters: {
                  VALUE: 'DATE-TIME',
                  TZID: 'Europe/Zurich',
                }
              }),
              new Property({
                name: 'SUMMARY',
                value: title,
              }),
              new Property({
                name: 'DTSTART',
                value: data.resolve.dates.start.toDate(),
                parameters: {
                  VALUE: 'DATE-TIME',
                  TZID: 'Europe/Zurich',
                }
              }),
              new Property({
                name: 'DTEND',
                value: data.resolve.dates.end.toDate(),
                parameters: {
                  VALUE: 'DATE-TIME',
                  TZID: 'Europe/Zurich',
                }
              }),
              new Property({
                name: 'DESCRIPTION',
                value: 'Lehrer: ' + (data.resolve.teacher || 'noch offen'),
              }),
              // new Property({
              //   name: 'ATTENDEE',
              //   parameters: {
              //     CN: 'Sample Company',
              //     RSVP: 'FALSE:foo@example.com'
              //   }
              // })
            ]
          });
          return event;
  }

  ics() {
    var events = [];
    let data = this.data;

    _.forEach(data.semester.planing, (value, key) => {

      if (value.FR) {
        events.push(this.icsEvent(value.FR.morning))
        events.push(this.icsEvent(value.FR.afternoon))
      }
      if (value.SA) {
        events.push(this.icsEvent(value.SA.morning))
        events.push(this.icsEvent(value.SA.afternoon))
      }
    });

    const calendar = new Component({
      name: 'VCALENDAR',
      components: events,
      properties: [
        new Property({ name: 'VERSION', value: 2 }),
        new Property({ name: 'PRODID', value: 'logrinto' })
      ]
    })

    let out = calendar.toString();
    fs.writeFileSync(this.path_ics, out);
    console.log('ics written to ' + this.path_ics);
  }


  dataResolve() {
    let data = this.data;

    _.forEach(data.semester.planing, (value, key) => {
      // value.resolve = {
      //   dates: {
      //     fr: new moment(value.KW, '[KW]ww-YYYY').add(5, 'd'),
      //     sa: new moment(value.KW, '[KW]ww-YYYY').add(6, 'd')
      //   }
      // }

      if (value.FR) {
        value.FR.morning.resolve = {
          dates: {
            start: new moment(value.KW, '[KW]ww-YYYY').add(5, 'd').hour(8).minute(5),
            end: new moment(value.KW, '[KW]ww-YYYY').add(5, 'd').hour(11).minute(40),
          },
          teacher: data.teachers[value.FR.morning.teacher] || '',
          lession: data.lessions[value.FR.morning.lession] || {},
        }
        value.FR.afternoon.resolve = {
          dates: {
            start: new moment(value.KW, '[KW]ww-YYYY').add(5, 'd').hour(13).minute(15),
            end: new moment(value.KW, '[KW]ww-YYYY').add(5, 'd').hour(16).minute(45),
          },
          teacher: data.teachers[value.FR.afternoon.teacher] || '',
          lession: data.lessions[value.FR.afternoon.lession] || {},
        }
      }

      if (value.SA) {
        value.SA.morning.resolve = {
          dates: {
            start: new moment(value.KW, '[KW]ww-YYYY').add(6, 'd').hour(8).minute(5),
            end: new moment(value.KW, '[KW]ww-YYYY').add(6, 'd').hour(11).minute(40),
          },
          teacher: data.teachers[value.SA.morning.teacher],
          lession: data.lessions[value.SA.morning.lession] || {},
        }
        value.SA.afternoon.resolve = {
          dates: {
            start: new moment(value.KW, '[KW]ww-YYYY').add(6, 'd').hour(13).minute(15),
            end: new moment(value.KW, '[KW]ww-YYYY').add(6, 'd').hour(16).minute(45),
          },
          teacher: data.teachers[value.SA.afternoon.teacher],
          lession: data.lessions[value.SA.afternoon.lession] || {},
        }
      }

    });
  }

  process() {
    this.loader();
    this.dataResolve();
    this.calcTotal();

    let template = handlebars.compile(this.template);
    let out = template(this.data);

    fs.writeFileSync(this.path_dest, out);
    console.log('html written to ' + this.path_dest);
  }
}


export default Semesterplan;
