import { DateFiltersEnum } from "@/types/calls";
import dayjs from "dayjs";

/**
 * Генерирует случайное число в заданном диапазоне.
 *
 * @param min - Минимальное значение диапазона (включительно).
 * @param max - Максимальное значение диапазона (включительно).
 * @returns Случайное число в заданном диапазоне.
 */
export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Преобразует количество секунд в строку формата "минуты:секунды".
 *
 * @param seconds - Количество секунд для преобразования.
 * @returns Строка в формате "минуты:секунды", где секунды всегда отображаются двумя цифрами (например, "02:05").
 */
export const secondsToMinutesSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
  return `${formattedMinutes}:${formattedSeconds}`;
};

/**
 * Преобразует объект в строку запроса (query string).
 *
 * @param obj - Объект, ключи и значения которого будут преобразованы в строку запроса.
 * @returns Строка запроса, где ключи и значения объекта кодируются с помощью `encodeURIComponent` и соединяются символом `&`.
 */
export const objToQueryString = (obj: Record<string, any>): string => {
  const keyValuePairs = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
    }
  }
  return keyValuePairs.join('&');
};

/**
 * Фильтрует объект, исключая ключи со значением null.
 *
 * @param obj - Объект, который нужно отфильтровать.
 * @returns Новый объект, содержащий только те ключи, значения которых не являются null.
 */
export const filterNullValues = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (obj[key] !== null) {
      result[key] = obj[key];
    }
  }

  return result;
};

/**
 * Преобразует диапазон времени в объект с датами начала и конца.
 *
 * @param range - Диапазон времени, который может быть "3 дня", "неделя", "месяц" или "год".
 * @returns Объект с датами начала и конца в формате YYYY-MM-DD.
 */
export const getDateRange = (range: DateFiltersEnum): { date_start: string; date_end: string } => {
  const today = dayjs();
  let startDate: dayjs.Dayjs;

  switch (range) {
    case DateFiltersEnum.ThreeDays:
      startDate = today.subtract(3, 'day');
      break;
    case DateFiltersEnum.Week:
      startDate = today.subtract(1, 'week');
      break;
    case DateFiltersEnum.Month:
      startDate = today.subtract(1, 'month');
      break;
    case DateFiltersEnum.Year:
      startDate = today.subtract(1, 'year');
      break;
    default:
      throw new Error('Invalid range');
  }

  return {
    date_start: startDate.format('YYYY-MM-DD'),
    date_end: today.format('YYYY-MM-DD')
  };
};

/**
 * Преобразует ReadableStream в Blob.
 *
 * @param stream - ReadableStream, который нужно преобразовать в Blob.
 * @returns Promise, который разрешается в Blob, содержащий все данные из ReadableStream.
 */
export const streamToBlob = (stream: ReadableStream): Promise<Blob> => {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];

  return new Promise((resolve, reject) => {
    reader.read().then(function processText({ done, value }) {
      if (done) {
        resolve(new Blob(chunks));
        return;
      }
      chunks.push(value);
      reader.read().then(processText);
    }).catch(reject);
  });
};
