'use strict';

//var assert = require('assert');
var qifWriter = require('../lib');
var chai = require('chai');
chai.use(require('chai-string'));
var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

function BufferWriter() {
  var self = this;
  this.buffer = '';
  this.write = function(s) {
    self.buffer += s;
  };
}

describe('qif-writer', function() {
  var bufferWriter;
  var transactions;

  beforeEach(function() {
    // runs before each test in this block
    bufferWriter = new BufferWriter();
    transactions = [];
  });

  it('should write header', function() {
    // arrange

    // act
    qifWriter.write(transactions, {
      output: bufferWriter.write,
      type: 'Test'
    });

    // assert
    bufferWriter.buffer.should.startWith('!Type:Test');
  });

  it('should end transaction with ^', function() {
    // arrange
    transactions.push({});

    // act
    qifWriter.write(transactions, {
      output: bufferWriter.write
    });

    // assert
    bufferWriter.buffer.should.endWith('^\n');
  });

  it('should write transaction details', function() {
    // arrange
    transactions.push({
      date: '12/10/2015',
      amount: 10.99,
      payee: 'Payee',
      category: 'Category',
      memo: 'Memo'
    });

    // act
    qifWriter.write(transactions, {
      output: bufferWriter.write
    });

    // assert
    bufferWriter.buffer.should.contain('D12/10/2015\n');
    bufferWriter.buffer.should.contain('T10.99\n');
    bufferWriter.buffer.should.contain('PPayee\n');
    bufferWriter.buffer.should.contain('LCategory\n');
    bufferWriter.buffer.should.contain('MMemo\n');
  });

  it('should throw error when splits don\'t total to amount', function() {
    // arrange
    transactions.push({
      amount: 3,
      splits: [{
        amount: 1
      }, {
        amount: 1
      }]
    });

    function act() {
      qifWriter.write(transactions, {
        output: bufferWriter.write
      })
    }

    // act & assert
    act.should.Throw('Total amount and sum of splits is not the same');
  });

  it('should write transaction split', function() {
    // arrange
    transactions.push({
      date: '12/10/2015',
      amount: 10.99,
      splits: [{
        amount: 3.00,
        category: 'Split Category 1',
        memo: 'Split Memo 1'
      }, {
        amount: 7.99,
        category: 'Split Category 2',
        memo: 'Split Memo 2'
      }]
    });

    // act
    qifWriter.write(transactions, {
      output: bufferWriter.write
    });

    // assert
    assert(bufferWriter.buffer.should.contain('D12/10/2015\n'));
    assert(bufferWriter.buffer.should.contain('T10.99\n'));
    assert(bufferWriter.buffer.should.contain('$3\n'));
    assert(bufferWriter.buffer.should.contain('SSplit Category 1\n'));
    assert(bufferWriter.buffer.should.contain('ESplit Memo 1\n'));
    assert(bufferWriter.buffer.should.contain('$7.99\n'));
    assert(bufferWriter.buffer.should.contain('SSplit Category 2\n'));
    assert(bufferWriter.buffer.should.contain('ESplit Memo 2\n'));
  });
});
