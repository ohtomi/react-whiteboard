# react-whiteboard

## Description

A whiteboard component based on D3.js for React.js

## Requirements

- React.js v0.14.7+

## How to use

```javascript
render() {
    return (
        <div style={{margin: 30}}>
            <Whiteboard
                width={800} height={600} listener={function() {}}
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
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
