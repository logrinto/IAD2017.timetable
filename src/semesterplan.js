import handlebars from 'handlebars';
import fs from 'fs';
import yaml from 'js-yaml';
import _ from 'lodash';

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

  process() {

    this.loader();
    this.calcTotal();

    let template = handlebars.compile(this.template);
    let out = template(this.data);

    fs.writeFileSync(this.path_dest, out);
  }
}


export default Semesterplan;
