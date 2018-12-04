const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    var fileLocation = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(fileLocation, text, (err) => {
      if (err) {
        throw ('error writing text');
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, items) => {
    var arr = [];
    items.forEach(item => {
      item = item.slice(0, 5);
      arr.push({ id: item, text: item });
    });
    callback(null, arr);
  });
};

exports.readOne = (id, callback) => {
  let fileLocation = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(fileLocation, 'utf8', (err, text) => {
    var input = { id, text };
    callback(err, input);
  });
};

exports.update = (id, text, callback) => {
  var fileLocation = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(fileLocation, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(fileLocation, text, () => {
        callback(null, { id, text });
      });
    }
  });
};

exports.delete = (id, callback) => {
  var fileLocation = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(fileLocation, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.unlink(fileLocation, callback);
    }
  });
};


// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
