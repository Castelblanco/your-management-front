export const validObjects = (entitie?: object, comparation?: object): boolean => {
	return JSON.stringify(entitie) === JSON.stringify(comparation);
};
