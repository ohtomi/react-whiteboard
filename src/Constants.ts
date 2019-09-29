export enum ModeEnum {
    HAND = 'HAND',
    DRAW_LINE = 'DRAW_LINE',
    DRAG_IMAGE = 'DRAG_IMAGE',
    NW_RESIZE_IMAGE = 'NW_RESIZE_IMAGE',
    NE_RESIZE_IMAGE = 'NE_RESIZE_IMAGE',
    SE_RESIZE_IMAGE = 'SE_RESIZE_IMAGE',
    SW_RESIZE_IMAGE = 'SW_RESIZE_IMAGE'
}

export enum SvgElementEnum {
    LINE = 'LINE',
    IMAGE = 'IMAGE'
}

export type ResizeImageDirection =
    typeof ModeEnum.NW_RESIZE_IMAGE |
    typeof ModeEnum.NE_RESIZE_IMAGE |
    typeof ModeEnum.SE_RESIZE_IMAGE |
    typeof ModeEnum.SW_RESIZE_IMAGE
