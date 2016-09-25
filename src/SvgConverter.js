// https://raw.githubusercontent.com/likr/d3-downloadable/master/src/index.js
import d3 from 'd3';


export function toDownloadLinks(svg, svgLink, pngLink, jpegLink) {
    let {width, height} = svg.node().getBoundingClientRect();
    let svgNode = svg.node().cloneNode(true);
    d3.select(svgNode)
        .attr({
            version: '1.1',
            xmlns: 'http://www.w3.org/2000/svg',
            //'xmlns:xmlns:xlink': 'http://www.w3.org/1999/xlink',
            width: width,
            height: height
        });

    let svgHtml = svgNode.outerHTML;
    let base64EncodedText = btoa(
        encodeURIComponent(svgHtml)
            .replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1))
        );

    let canvasNode = document.createElement('canvas');
    canvasNode.width = width;
    canvasNode.height = height;
    let graphicsContext = canvasNode.getContext('2d');
    let imageNode = new Image();
    imageNode.onload = () => {
        graphicsContext.drawImage(imageNode, 0, 0);
        svgLink.attr('href', 'data:image/svg+xml;charset=utf-8;base64,' + base64EncodedText);
        pngLink.attr('href', canvasNode.toDataURL('image/png'));
        jpegLink.attr('href', canvasNode.toDataURL('image/jpeg'));
    };
    let imageSource = 'data:image/svg+xml;charset=utf-8;base64,' + base64EncodedText;
    imageNode.src = imageSource;
}
