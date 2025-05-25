export const formatPhoneNumber = (
	phone: string | number | undefined | null,
) => {
	if (!phone) {
		return '';
	}
	const formattedPhone = phone.toString().replace(/\D/g, '');

	if (!formattedPhone?.length) {
		return '';
	} else if (formattedPhone.length === 4) {
		return formattedPhone;
	} else if (formattedPhone.length === 9) {
		return `(${formattedPhone.slice(0, 2)}) ${formattedPhone.slice(2, 5)} ${formattedPhone.slice(5, 7)} ${formattedPhone.slice(7)}`;
	} else {
		return formattedPhone;
	}
};
