// src/core/utils/date-utils.ts

/**
 * Retorna a data atual ajustada para o fuso horário local (menos 3 horas)
 * Útil para ajustar a hora UTC para o horário brasileiro (UTC-3)
 */
export function getCurrentDate(): Date {
	const currentDate = new Date();
	currentDate.setHours(currentDate.getHours() - 3);
	return currentDate;
}
