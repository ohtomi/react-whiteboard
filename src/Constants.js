// @flow

export const MODE = {
    HAND: {},
    DRAW_LINE: {},
    DRAG_IMAGE: {},
    NW_RESIZE_IMAGE: {},
    NE_RESIZE_IMAGE: {},
    SE_RESIZE_IMAGE: {},
    SW_RESIZE_IMAGE: {},
};

export const SVG_ELEMENT_TYPE = {
    LINE: {},
    IMAGE: {},
};

export type ModeType = $Either<typeof MODE.HAND,
    typeof MODE.DRAW_LINE,
    typeof MODE.DRAG_IMAGE,
    typeof MODE.NW_RESIZE_IMAGE,
    typeof MODE.NE_RESIZE_IMAGE,
    typeof MODE.SE_RESIZE_IMAGE,
    typeof MODE.SW_RESIZE_IMAGE>

export type ResizeType = $Either<typeof MODE.NW_RESIZE_IMAGE,
    typeof MODE.NE_RESIZE_IMAGE,
    typeof MODE.SE_RESIZE_IMAGE,
    typeof MODE.SW_RESIZE_IMAGE>;
