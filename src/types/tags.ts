export type TagsColorMap = {
  Плохо: 'red';
  Хорошо: 'blue';
  Отлично: 'green';
};

export type TagsType = {
  name: keyof TagsColorMap;
  color: TagsColorMap[keyof TagsColorMap];
}[];
