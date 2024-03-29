'use strict';

var extend = require('extend');

function writeQif(transactions, options) {
  var params = {
    output: process.stdout.write.bind(process.stdout),
    type: 'Cash'
  };
  extend(params, options);

  function write() {
    for (var i = 0; i < arguments.length; i++) {
      params.output(arguments[i] + '');
    }
  }

  write('!Type:', params.type, '\n');
  for (var i = 0; i < transactions.length; i++) {
    var txn = transactions[i];

    write('D', txn.date, '\n');
    write('T', txn.amount, '\n');
    if (txn.payee) {
      write('P', txn.payee, '\n');
    }
    if (txn.memo) {
      write('M', txn.memo, '\n');
    }
    if (txn.category) {
      write('L', txn.category, '\n');
    }
    if (txn.splits) {
      var totalSplits = 0;
      for (var j = 0; j < txn.splits.length; j++) {
        var split = txn.splits[j];
        totalSplits += split.amount;
        write('$', split.amount, '\n');
        if (split.category) {
          write('S', split.category, '\n');
        }
        if (split.memo) {
          write('E', split.memo, '\n');
        }
      }
      if (totalSplits != txn.amount) {
        console.log(totalSplits, txn.amount);
        throw new Error('Total amount and sum of splits is not the same');
      }
    }
    write('^\n');
  }
}

module.exports = {
  write: writeQif
};
