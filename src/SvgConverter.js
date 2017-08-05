// @flow

import type {ImageType} from "./EventStore";


export default class SvgConverter {

    static toSvgData(sourceNode: HTMLElement): Promise<string> {
        let htmlText = sourceNode.outerHTML;
        let base64EncodedText = window.btoa(
            window.encodeURIComponent(htmlText)
                .replace(/%([0-9A-F]{2})/g, (match: string, p1: string): string => String.fromCharCode(window.parseInt('0x' + p1))));

        return new Promise(resolve => {
            resolve('data:image/svg+xml;charset=utf-8;base64,' + base64EncodedText);
        });
    }

    static toPngData(sourceNode: HTMLElement): Promise<string> {
        return SvgConverter.toDataUrl(sourceNode, 'image/png');
    }

    static toJpegData(sourceNode: HTMLElement): Promise<string> {
        return SvgConverter.toDataUrl(sourceNode, 'image/jpeg');
    }

    static toDataUrl(sourceNode: HTMLElement, imageType: string): Promise<string> {
        return new Promise(resolve => {
            SvgConverter.toSvgData(sourceNode).then((svgdata: string) => {
                let {width, height} = sourceNode.getBoundingClientRect();

                let imageNode = new window.Image();
                imageNode.onload = () => {
                    let canvasNode = document.createElement('canvas');
                    canvasNode.width = width;
                    canvasNode.height = height;

                    let graphicsContext = canvasNode.getContext('2d');
                    if (graphicsContext) {
                        graphicsContext.drawImage(imageNode, 0, 0);
                    } else {
                        throw new Error('got no rendering context');
                    }

                    resolve(canvasNode.toDataURL(imageType));
                };
                imageNode.src = svgdata;
            });
        });
    }

    static fromPngImage(imageUrl: string): Promise<ImageType> {
        return SvgConverter.fromImageUrl(imageUrl, 'image/png');
    }

    static fromJpegImage(imageUrl: string): Promise<ImageType> {
        return SvgConverter.fromImageUrl(imageUrl, 'image/jpeg');
    }

    static fromGifImage(imageUrl: string): Promise<ImageType> {
        return SvgConverter.fromImageUrl(imageUrl, 'image/gif');
    }

    static fromImageUrl(imageUrl: string, imageType: string): Promise<ImageType> {
        return new Promise(resolve => {
            let imageNode = new window.Image();
            imageNode.onload = () => {
                let canvasNode = document.createElement('canvas');
                canvasNode.width = imageNode.width;
                canvasNode.height = imageNode.height;

                let graphicsContext = canvasNode.getContext('2d');
                if (graphicsContext) {
                    graphicsContext.drawImage(imageNode, 0, 0);
                } else {
                    throw new Error('got no rendering context');
                }

                resolve({width: imageNode.width, height: imageNode.height, dataUrl: canvasNode.toDataURL(imageType)});
            };
            imageNode.crossOrigin = 'anonymous';
            imageNode.src = imageUrl;
        });
    }
}
