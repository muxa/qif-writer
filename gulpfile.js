'use strict';
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');

gulp.task('static', function() {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    //.pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function(cb) {
  nsp('package.json', cb);
});

gulp.task('pre-test', function() {
  return gulp.src('lib/**/*.js')
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('sample', function() {
  var qif = require('./lib/index');

  qif.write([{
    date: '1/Jan/2015',
    amount: 10.50,
    payee: 'Local Coffee',
    category: 'Cafe'
  }, {
    date: '2/Jan/2015',
    amount: 105,
    payee: 'Sample',
    memo: 'To demonstrate split',
    splits: [{
      amount: 5,
      category: 'Bank Charges',
      memo: 'Bank fees'
    }, {
      amount: 100,
      category: 'Transfer: Savings'
    }]
  }], {
    type: 'Bank'
  });

});

gulp.task('test', ['pre-test'], function(cb) {
  var mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({
      reporter: 'spec'
    }))
    .on('error', function(err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function() {
      cb(mochaErr);
    });
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['static', 'test']);
