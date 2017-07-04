// https://raw.githubusercontent.com/likr/d3-downloadable/master/src/index.js


export default class SvgConverter {

    constructor(sourceNode) {
        this.sourceNode = sourceNode;
    }

    toSvgData() {
        let htmlText = this.sourceNode.outerHTML;
        let base64EncodedText = window.btoa(
            window.encodeURIComponent(htmlText).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));

        return new Promise(resolve => {
            resolve('data:image/svg+xml;charset=utf-8;base64,' + base64EncodedText);
        });
    }

    toPngData() {
        return new Promise(resolve => {
            this.toSvgData().then(svgdata => {
                let {width, height} = this.sourceNode.getBoundingClientRect();
                let canvasNode = document.createElement('canvas');
                canvasNode.width = width;
                canvasNode.height = height;

                let graphicsContext = canvasNode.getContext('2d');

                let imageNode = new window.Image();
                imageNode.onload = () => {
                    graphicsContext.drawImage(imageNode, 0, 0);
                    resolve(canvasNode.toDataURL('image/png'));
                };
                imageNode.src = svgdata;
            });
        });
    }

    toJpegData() {
        return new Promise(resolve => {
            this.toSvgData().then(svgdata => {
                let {width, height} = this.sourceNode.getBoundingClientRect();
                let canvasNode = document.createElement('canvas');
                canvasNode.width = width;
                canvasNode.height = height;

                let graphicsContext = canvasNode.getContext('2d');

                let imageNode = new window.Image();
                imageNode.onload = () => {
                    graphicsContext.drawImage(imageNode, 0, 0);
                    resolve(canvasNode.toDataURL('image/jpeg'));
                };
                imageNode.src = svgdata;
            });
        });
    }

    static fromImageUrl(imageUrl, imageType) {
        return new Promise(resolve => {
            let imageNode = new window.Image();
            imageNode.onload = () => {
                let canvasNode = document.createElement('canvas');
                canvasNode.width = imageNode.width;
                canvasNode.height = imageNode.height;

                let graphicsContext = canvasNode.getContext('2d');
                graphicsContext.drawImage(imageNode, 0, 0);

                resolve(canvasNode.toDataURL('image/' + imageType));
            };
            imageNode.crossOrigin = 'anonymous';
            imageNode.src = imageUrl;
        });
    }
}
