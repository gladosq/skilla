import { DatePicker, Popover } from 'antd';
import s from './TableFilters.module.scss';
import { useEffect, useState } from 'react';
import DropdownArrowIcon from '@/ui/DropdownArrowIcon';
import clsx from 'clsx';
import { DateFiltersEnum, FilterByTypeEnum, FilterByTypeMapper } from '@/types/calls';
import { getDateRange } from '@/utils/utils';
import RightArrowIcon from '@/ui/RightArrowIcon';
import LeftArrowIcon from '@/ui/LeftArrowIcon';
import CalendarIcon from '@/ui/CalendarIcon';
import CloseIcon from '@/ui/CloseIcon';
import { DEFAULT_PAGE_SIZE, PresetDateSelectorMapper } from '../const';

const { RangePicker } = DatePicker;

type TableFiltersProps = {
  onChangeFilters: (value: any) => void;
}

export default function TableFilters({ onChangeFilters }: TableFiltersProps) {
  const [openPopoverType, setOpenPopoverType] = useState(false);
  const [openPopoverDatePicker, setOpenPopoverDatePicker] = useState(false);
  const [sortType, setSortType] = useState(FilterByTypeEnum.All);
  const [sortDate, setSortDate] = useState<DateFiltersEnum | null>(DateFiltersEnum.ThreeDays);

  const [date, setDate] = useState<{ value: any, formattedValue: { date_start: string, date_end: string } } | null>(null);

  useEffect(() => {
    const dateRange = date ? date.formattedValue : getDateRange(sortDate ?? DateFiltersEnum.ThreeDays);

    onChangeFilters({
      in_out: FilterByTypeMapper[sortType],
      date_start: dateRange.date_start,
      date_end: dateRange.date_end,
      limit: DEFAULT_PAGE_SIZE
    });
    setOpenPopoverType(false);
    setOpenPopoverDatePicker(false);
  }, [sortType, sortDate, date]);

  const resetDatePickerToDefault = () => {
    setDate(null);
    setSortDate(DateFiltersEnum.ThreeDays);
  };

  const resetAllFilters = () => {
    resetDatePickerToDefault();

    const dateRange = getDateRange(DateFiltersEnum.ThreeDays);

    onChangeFilters({
      in_out: null,
      date_start: dateRange.date_start,
      date_end: dateRange.date_end,
      sort_by: 'duration',
      limit: DEFAULT_PAGE_SIZE
    });
    setSortType(FilterByTypeEnum.All);
    setSortDate(DateFiltersEnum.ThreeDays);
  };

  const handleNextDateSort = () => {
    resetDatePickerToDefault();
    const currentIndex = PresetDateSelectorMapper.indexOf(sortDate!);
    const nextIndex = (currentIndex + 1) % PresetDateSelectorMapper.length;
    setSortDate(PresetDateSelectorMapper[nextIndex]);
  };

  const handlePreviousDateSort = () => {
    resetDatePickerToDefault();
    const currentIndex = PresetDateSelectorMapper.indexOf(sortDate!);
    const previousIndex = (currentIndex - 1 + PresetDateSelectorMapper.length) % PresetDateSelectorMapper.length;
    setSortDate(PresetDateSelectorMapper[previousIndex]);
  };

  const popoverTypeContent = (
    <div className={s.popoverWrapper}>
      <button
        className={clsx(s.popoverItem, sortType === FilterByTypeEnum.All && s.popoverItem_active)}
        onClick={() => setSortType(FilterByTypeEnum.All)}
      >
        {FilterByTypeEnum.All}
      </button>
      <button
        className={clsx(s.popoverItem, sortType === FilterByTypeEnum.Incoming && s.popoverItem_active)}
        onClick={() => setSortType(FilterByTypeEnum.Incoming)}
      >
        {FilterByTypeEnum.Incoming}
      </button>
      <button
        className={clsx(s.popoverItem, sortType === FilterByTypeEnum.Outgoing && s.popoverItem_active)}
        onClick={() => setSortType(FilterByTypeEnum.Outgoing)}
      >
        {FilterByTypeEnum.Outgoing}
      </button>
    </div>
  );

  const sortDateHandler = (value: DateFiltersEnum) => {
    setSortDate(value);
    setDate(null);
  };

  const popoverDateContent = (
    <div className={s.popoverDatePicker}>
      <button
        className={clsx(s.popoverItemDate, sortDate === DateFiltersEnum.ThreeDays && s.popoverItemDate_active)}
        onClick={() => sortDateHandler(DateFiltersEnum.ThreeDays)}
      >
        {DateFiltersEnum.ThreeDays}
      </button>
      <button
        className={clsx(s.popoverItem, sortDate === DateFiltersEnum.Week && s.popoverItemDate_active)}
        onClick={() => sortDateHandler(DateFiltersEnum.Week)}
      >
        {DateFiltersEnum.Week}
      </button>
      <button
        className={clsx(s.popoverItemDate, sortDate === DateFiltersEnum.Month && s.popoverItemDate_active)}
        onClick={() => sortDateHandler(DateFiltersEnum.Month)}
      >
        {DateFiltersEnum.Month}
      </button>
      <button
        className={clsx(s.popoverItemDate, sortDate === DateFiltersEnum.Year && s.popoverItemDate_active)}
        onClick={() => sortDateHandler(DateFiltersEnum.Year)}
      >
        {DateFiltersEnum.Year}
      </button>
      <div className={s.container}>
        <p>Указать даты</p>
        <RangePicker
          allowClear={false}
          separator={<span className={s.separator}>–</span>}
          variant='borderless'
          placeholder={['__.__.__', '__.__.__']}
          suffixIcon={<CalendarIcon />}
          className={s.rangePicker}
          value={date?.value}
          onChange={(value, dateString) => {
            setDate({
              value,
              formattedValue: {
                date_start: dateString[0],
                date_end: dateString[1]
              }
            });
            setSortDate(null);
          }}
          format={'YYYY-MM-DD'}
        />
      </div>
    </div>
  );

  return (
    <div className={s.root}>
      <Popover
        arrow={false}
        placement='bottomLeft'
        content={popoverTypeContent}
        trigger='click'
        color={'#fff'}
        open={openPopoverType}
        onOpenChange={() => setOpenPopoverType((prevState) => !prevState)}
        overlayInnerStyle={{ borderRadius: '8px', padding: 0 }}
      >
        <button className={s.typeButton}>
          {sortType}
          <DropdownArrowIcon />
        </button>
      </Popover>
      {(sortType !== FilterByTypeEnum.All || sortDate !== DateFiltersEnum.ThreeDays) && (
        <button
          className={s.resetButton}
          onClick={resetAllFilters}
        >
          Сбросить фильтры
          <CloseIcon />
        </button>
      )}
      <div className={s.dateWrapper}>
        <button className={s.arrow} onClick={handleNextDateSort}>
          <LeftArrowIcon />
        </button>
        <Popover
          arrow={false}
          placement='bottomRight'
          content={popoverDateContent}
          trigger='click'
          color={'#fff'}
          open={openPopoverDatePicker}
          onOpenChange={() => setOpenPopoverDatePicker((prevState) => !prevState)}
          overlayInnerStyle={{ borderRadius: '4px', padding: 0, border: '1px solid #EAF0FA' }}
        >
          <button className={s.datePicker_select}>
            <CalendarIcon />
            {date ? `${date.formattedValue.date_start} - ${date.formattedValue.date_end}` : sortDate}
          </button>
        </Popover>
        <button className={s.arrow} onClick={handlePreviousDateSort}>
          <RightArrowIcon />
        </button>
      </div>
    </div>
  );
}
