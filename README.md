# qif-writer [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JS library to write QIF (Quicken Interchange Format) files


## Install

```sh
$ npm install --save qif-writer
```


## Usage

```js
var qif = require('qif-writer');

var transactions = [
  {
    date: '1/Jan/2015',
    amount: 10.50,
    payee: 'Local Coffee',
    category: 'Cafe'
  },
  {
    date: '2/Jan/2015',
    amount: 105,
    payee: 'Sample',
    memo: 'To demonstrate split',
    splits: [
      {
        amount: 5,
        category: 'Bank Charges',
        memo: 'Bank fees'  
      },
      {
        amount: 100,
        category: 'Transfer: Savings'
      }
    ]
  }
];
var options = {
  type: 'Bank'
};
qif.write(transactions, options);
```
This write the following to `stdout`:
```
!Type:Bank
D1/Jan/2015
T10.5
PLocal Coffee
LCafe
^
D2/Jan/2015
T105
PSample
MTo demonstrate split
$5
SBank Charges
EBank fees
$100
STransfer: Savings
^
```

### Options
Default options are:
```js
{
  type: 'Cash',
  output: process.stdout.write.bind(process.stdout)
};
```

## License

MIT © [Mikhail Diatchenko](https://github.com/muxa)


[npm-image]: https://badge.fury.io/js/qif-writer.svg
[npm-url]: https://npmjs.org/package/qif-writer
[travis-image]: https://travis-ci.org/muxa/qif-writer.svg?branch=master
[travis-url]: https://travis-ci.org/muxa/qif-writer
[daviddm-image]: https://david-dm.org/muxa/qif-writer.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/muxa/qif-writer
