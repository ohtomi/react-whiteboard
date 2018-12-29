# react-whiteboard

[![npm](https://img.shields.io/npm/v/@ohtomi/react-whiteboard.svg)](https://www.npmjs.com/package/@ohtomi/react-whiteboard)
[![License](https://img.shields.io/npm/l/@ohtomi/react-whiteboard.svg)](LICENSE)
[![Build Status](https://travis-ci.org/ohtomi/react-whiteboard.svg?branch=master)](https://travis-ci.org/ohtomi/react-whiteboard)
[![Greenkeeper badge](https://badges.greenkeeper.io/ohtomi/react-whiteboard.svg)](https://greenkeeper.io/)

## Description

A whiteboard `React` component using `SVG`.

## How to use

```javascript
render() {
    return (
        <Whiteboard
            events={new EventStream()} eventStore={new EventStore()}
            width={800} height={600}
            style={{backgroundColor: 'lightyellow'}}
        />
    );
}
```

See [examples](stories).

## How to build

```bash
$ npm install
$ npm run build
```

## Contributing

1. Fork it!
1. Create your feature branch: `git checkout -b my-new-feature`
1. Commit your changes: `git commit -am 'Add some feature'`
1. Push to the branch: `git push origin my-new-feature`
1. Submit a pull request :D

## License

MIT

## Author

[Kenichi Ohtomi](https://github.com/ohtomi)
