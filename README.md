# react-whiteboard

## Description

A whiteboard component based on D3.js for React.js

## Requirements

- React.js

## How to use

```javascript
render() {
    return (
        <div style={{margin: 30}}>
            <Whiteboard
                width={800} height={600} listener={this.handleEvent}
                style={{backgroundColor: 'lightyellow'}}
                renderPallete={true} renderDebugInfo={true}
            />
        </div>
    );
}
```
See [examples](examples).

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
