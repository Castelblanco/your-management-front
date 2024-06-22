export const formatDateView = (date: Date): string => {
	const day = date.getDay();
	const year = date.getFullYear();
	const month = date.getMonth();

	const hours = date.getHours();
	const minutes = date.getMinutes();

	return `${day}/${month}/${year} - ${hours}:${minutes}`;
};
