import { DateFiltersEnum } from "@/types/calls";
import { TagsType } from "@/types/tags";

export const DEFAULT_PAGE_SIZE = 50;

export const PresetDateSelectorMapper = [
  DateFiltersEnum.ThreeDays, 
  DateFiltersEnum.Week, 
  DateFiltersEnum.Month, 
  DateFiltersEnum.Year
];

export const qualityTags: TagsType = [
  { name: 'Плохо', color: 'red' },
  { name: 'Хорошо', color: 'blue' },
  { name: 'Отлично', color: 'green' },
];
