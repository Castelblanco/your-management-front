export type TAdapters<TDOM, TAPI> = {
	apiToDom: (item: TAPI) => TDOM;
	domToApi: (item: TDOM) => TAPI;
};
