export type TMapper<TDOM, TAPI> = {
	apiToDom: (item: TAPI) => TDOM;
	domToApi: (item: TDOM) => TAPI;
};
