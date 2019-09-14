export const MODE = {
    HAND: 'HAND',
    DRAW_LINE: 'DRAW_LINE',
    DRAG_IMAGE: 'DRAG_IMAGE',
    NW_RESIZE_IMAGE: 'NW_RESIZE_IMAGE',
    NE_RESIZE_IMAGE: 'NE_RESIZE_IMAGE',
    SE_RESIZE_IMAGE: 'SE_RESIZE_IMAGE',
    SW_RESIZE_IMAGE: 'SW_RESIZE_IMAGE'
}

export const SVG_ELEMENT_TYPE = {
    LINE: 'LINE',
    IMAGE: 'IMAGE'
}

export type ModeType =
    typeof MODE.HAND |
    typeof MODE.DRAW_LINE |
    typeof MODE.DRAG_IMAGE |
    typeof MODE.NW_RESIZE_IMAGE |
    typeof MODE.NE_RESIZE_IMAGE |
    typeof MODE.SE_RESIZE_IMAGE |
    typeof MODE.SW_RESIZE_IMAGE

export type ResizeType =
    typeof MODE.NW_RESIZE_IMAGE |
    typeof MODE.NE_RESIZE_IMAGE |
    typeof MODE.SE_RESIZE_IMAGE |
    typeof MODE.SW_RESIZE_IMAGE
