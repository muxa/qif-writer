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
    assert(bufferWriter.buffer.should.startWith('!Type:Test'));
  });
});
