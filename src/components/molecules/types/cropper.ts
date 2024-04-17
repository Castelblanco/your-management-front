export type CropShape = 'rect' | 'round';
export type CropEvent = CustomEvent<{ percent: CropArea; pixels: CropArea }>;

export interface Size {
	width: number;
	height: number;
}
export interface CropImageSize {
	width: number;
	height: number;
	naturalWidth: number;
	naturalHeight: number;
}
export interface CropPoint {
	x: number;
	y: number;
}
export interface CropArea {
	x: number;
	y: number;
	width: number;
	height: number;
}
export interface CropDispatchEvents {
	cropcomplete: {
		percent: CropArea;
		pixels: CropArea;
	};
}
