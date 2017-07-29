export default class SvgConverter {

    static toSvgData(sourceNode) {
        let htmlText = sourceNode.outerHTML;
        let base64EncodedText = window.btoa(
            window.encodeURIComponent(htmlText)
                .replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(window.parseInt('0x' + p1))));

        return new Promise(resolve => {
            resolve('data:image/svg+xml;charset=utf-8;base64,' + base64EncodedText);
        });
    }

    static toPngData(sourceNode) {
        return SvgConverter.toDataUrl(sourceNode, 'image/png');
    }

    static toJpegData(sourceNode) {
        return SvgConverter.toDataUrl(sourceNode, 'image/jpeg');
    }

    static toDataUrl(sourceNode, imageType) {
        return new Promise(resolve => {
            SvgConverter.toSvgData(sourceNode).then(svgdata => {
                let {width, height} = sourceNode.getBoundingClientRect();

                let imageNode = new window.Image();
                imageNode.onload = () => {
                    let canvasNode = document.createElement('canvas');
                    canvasNode.width = width;
                    canvasNode.height = height;

                    let graphicsContext = canvasNode.getContext('2d');
                    graphicsContext.drawImage(imageNode, 0, 0);

                    resolve(canvasNode.toDataURL(imageType));
                };
                imageNode.src = svgdata;
            });
        });
    }

    static fromPngImage(imageUrl) {
        return SvgConverter.fromImageUrl(imageUrl, 'image/png');
    }

    static fromJpegImage(imageUrl) {
        return SvgConverter.fromImageUrl(imageUrl, 'image/jpeg');
    }

    static fromGifImage(imageUrl) {
        return SvgConverter.fromImageUrl(imageUrl, 'image/gif');
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

                resolve({width: imageNode.width, height: imageNode.height, dataUrl: canvasNode.toDataURL(imageType)});
            };
            imageNode.crossOrigin = 'anonymous';
            imageNode.src = imageUrl;
        });
    }
}
