/** @format */

import upperFirst from 'lodash/upperFirst';
import models from './models';
export default {
  mixins: [models],
  data() {
    return {};
  },
  computed: {
    formAnamnesis() {
      return { ['anamnesis']: this.buildAnamnesisForm() };
    },
  },
  methods: {
    fillModelFields(m) {
      //console.log("fillModelFields", m);
      let res = this['model' + upperFirst(m)];
      for (let [i, el] of res.entries()) {
        if (el.fields) {
          let arr = el.fields;
          let def = [
            {
              //name: el.name,
              name: el.title,
              parent: el.name,
              title: this.$t(el.title),
              //title: el.title,
              validator: [],
              type: 'text',
            },
          ];
          if (arr.length !== 0) {
            arr.forEach((a) => {
              a.title = this.$t(a.title);
            });
            if (arr.find((a) => a.name === el.title)) {
              def = arr;
            } else {
              def = def.concat(arr);
            }
          }
          res[i].fields = def;
        }
      }
      return res;
    },
    createObjectFormFromModel(model, val = null) {
      let d2 = {};
      for (let el of model) {
        if (el.hasOwnProperty('fields')) {
          d2 = Object.assign({}, d2, {
            [el.name]: this.createObjectFormFromModel(el.fields, null),
          });
        } else {
          if (!d2[el.name]) {
            d2 = Object.assign({}, d2, { [el.name]: null });
          }
        }
      }
      return d2;
    },
    buildAnamnesisForm() {
      let anamnesis = this.fillModelFields('anamnesis');
      let objA = this.createObjectFormFromModel(anamnesis, []);

      let src;
      let keys = Object.create(null);
      function getMap(o, path = '') {
        Object.keys(o).forEach(function(k) {
          if (typeof o[k] === 'object' && !Array.isArray(o[k]) && o[k] !== null) {
            return getMap(o[k], path ? `${path}.["${k}"]` : `["${k}"]`);
          }
          keys[k] = path ? `${path}.["${k}"]` : `["${k}"]`;
        });
      }
      getMap(objA);

      //console.log(objA);
      function addInForm(src) {
        Object.keys(src).forEach(function(k) {
          if (keys[k]) {
            let v = _.get(objA, keys[k]);
            //console.log(0, v, k, src[k]);
            if (!Array.isArray(v)) {
              v = Array.isArray(src[k]) ? src[k] : [src[k]];
              //console.log('not Array', v);
            } else {
              v.unshift(src[k]);
              //console.log('Array', v);
            }
            _.set(objA, keys[k], v);
            //console.log(1, k, keys[k], v, objA);
          } else {
            if (!objA.other) {
              objA.other = {};
            }
            objA.other[k] = src[k];
          }
        });
      }
      function getAllval(o) {
        Object.keys(o).forEach(function(k) {
          if (typeof o[k] === 'object' && !Array.isArray(o[k])) {
            //console.log(k, typeof o[k]);
            return getAllval(o[k]);
          }
          src = { [k]: o[k] };
          if (o[k].length) {
            //console.log('try to write', k, src);
            if (10) addInForm(src);
          }
        });
      }
      let records = this.selectedPatientClinicalRecords;
      let patient = this.selectedPatient;
      let recordData = {};
      function getAllval2(o) {
        Object.keys(o).forEach(function(k) {
          if (typeof o[k] === 'object' && !Array.isArray(o[k])) {
            return getAllval2(o[k]);
          }
          src = {
            [k]: {
              id: recordData.id,
              body: o[k],
              doctor_id: recordData.doctor_id,
              created: recordData.createdon,
            },
          };
          if (o[k].length) {
            if (10) addInForm(src);
          }
        });
      }

      patient && getAllval(patient.anamnesis);

      records &&
        records.forEach(function(record) {
          if (record.anamnesis) {
            recordData = record;

            getAllval2(JSON.parse(record.anamnesis));
          }
        });
      console.log(objA);
      return objA;
    },
    fillFormData(src, dst) {
      Object.keys(src).forEach(function(key) {
        if (typeof src[key] === 'object') dst[newkey] = dst[key];
        delete dst[key];
      });
    },
  },
};
