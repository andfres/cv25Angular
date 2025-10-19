import { TranslateService } from '@ngx-translate/core';

export function formatPeriod(
  startDate: string | undefined,
  endDate: string | 'present' | undefined,
  translate: TranslateService,
): string {
  if (!startDate) {
    return ''; // O un valor por defecto como 'N/A' o 'Fecha no disponible'
  }

  const start = new Date(startDate);
  const end =
    endDate === 'present'
      ? translate.instant('sections.present')
      : endDate
        ? new Date(endDate)
        : undefined;

  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };

  const formattedStart = start.toLocaleDateString(translate.currentLang, options);
  const formattedEnd =
    end instanceof Date ? end.toLocaleDateString(translate.currentLang, options) : end;

  return `${formattedStart} – ${formattedEnd}`;
}
