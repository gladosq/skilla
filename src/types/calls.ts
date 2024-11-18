export type CallsDataType = {
  id: string;
  in_out: number;
  from_number: string;
  date: string;
  person_avatar: string;
  time: string;
  contact_name: string;
  contact_company: string;
  record: string;
  partnership_id: string;
  errors: string[];
  status: string;
};

export enum FilterByTypeEnum {
  Incoming = 'Входящие',
  Outgoing = 'Исходящие',
  All = 'Все типы'
}

export const FilterByTypeMapper: Record<FilterByTypeEnum, number | null> = {
  [FilterByTypeEnum.Incoming]: 1,
  [FilterByTypeEnum.Outgoing]: 0,
  [FilterByTypeEnum.All]: null,
};

export enum DateFiltersEnum {
  ThreeDays = '3 дня',
  Week = 'Неделя',
  Month = 'Месяц',
  Year = 'Год',
}
