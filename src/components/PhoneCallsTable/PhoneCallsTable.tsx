import { Table } from "antd";
import { useEffect, useState } from "react";
import s from './PhonecallsTable.module.scss';
import { useCalls } from "@/api/calls";
import { filterNullValues } from "@/utils/utils";
import { CallsDataType } from "@/types/calls";
import TableFilters from "../TableFilters/TableFilters";
import { tableColumns } from "./TableColumns";
import { DEFAULT_PAGE_SIZE } from "../const";

export type FiltersType = {
  date_start?: string;
  date_end?: string;
  in_out?: number | null;
  offset?: number;
}

export default function PhoneCallsTable() {
  const [calls, setCalls] = useState<CallsDataType[]>([]);
  const [filters, setFilters] = useState<FiltersType | undefined>();

  const { data: callsData, isSuccess, isLoading } = useCalls(filters!);

  useEffect(() => {
    if (isSuccess) {
      setCalls([
        ...callsData.results.map((item) => {
          return { ...item, key: item.id }
        })
      ]);
    }
  }, [isSuccess, callsData]);
  //     title: 'Тип',
  //     dataIndex: 'in_out',
  //     key: 'in_out',
  //     width: '5%',
  //     render: (type: number) => {
  //       if (type === 0) return <IncomingIcon />;
  //       if (type === 1) return <OutgoingIcon />;
  //     },
  //   },
  //   {
  //     title: 'Время',
  //     dataIndex: 'date',
  //     key: 'date',
  //     width: '7%',
  //     render: (date: string) => dayjs(date).format('HH:mm'),
  //   },
  //   {
  //     title: 'Сотрудник',
  //     dataIndex: 'person_avatar',
  //     key: 'person_avatar',
  //     width: '9%',
  //     render: (person: string) => {
  //       if (person) return <img className={s.person} src={person} alt='Аватар' />;
  //     },
  //   },
  //   {
  //     title: 'Звонок',
  //     dataIndex: 'from_number',
  //     key: 'from_number',
  //     width: '240px',
  //     render: (from_number, record) => {
  //       return (
  //         <>
  //           {record.contact_name && <p>{record.contact_name}</p>}
  //           {record.contact_company && <p className={s.contactCompany}>{record.contact_company}</p>}
  //           {!(record.contact_name || record.contact_company) && from_number}
  //         </>
  //       );
  //     }
  //   },
  //   {
  //     title: 'Источник',
  //     dataIndex: 'sourse',
  //     key: 'sourse',
  //     width: '240px',
  //     render: () => {
  //       return <span className={s.sourse}>{MOCK_SOURSES[getRandomNumber(0, MOCK_SOURSES.length - 1)]}</span>;
  //     },
  //   },
  //   {
  //     title: 'Оценка',
  //     dataIndex: 'errors',
  //     key: 'errors',
  //     width: '20%',
  //     render: (errors) => {
  //       const randomNumber = getRandomNumber(0, tags.length - 1);
  //       if (errors.length) {
  //         return <span className={s.error}>{errors[0]}</span>;
  //       }
  //       return (
  //         <Tag className={s.tag} color={tags[randomNumber].color} key={tags[randomNumber].name}>
  //           {tags[randomNumber].name}
  //         </Tag>
  //       )
  //     },
  //   },
  //   {
  //     title: 'Длительность',
  //     dataIndex: 'time',
  //     key: 'time',
  //     ellipsis: true,
  //     width: '360px',
  //     render: (time: number, record) => {
  //       const formattedDuration = secondsToMinutesSeconds(time);
  //       return (
  //         !!time && <div className={s.durationCell}>
  //           <div className={s.audio}>
  //             <AudioPlayerComponent
  //               duration={formattedDuration}
  //               recordId={record.record}
  //               partnershipId={record.partnership_id}
  //             />
  //           </div>
  //           <div className={s.time}>
  //             {formattedDuration}
  //           </div>
  //         </div>
  //       );
  //     },
  //     align: 'right',
  //   },
  // ];

  const handleFilters = (value: FiltersType) => {
    setFilters((prevState) => {
      const filteredNullObj = filterNullValues({
        ...prevState,
        ...value,
        offset: 0
      });

      return filteredNullObj;
    });
  };

  const handleTableChange = (_: any, __: any, sorter: any) => {
    const { field, order } = sorter;

    setFilters((prevState) => {
      return {
        ...prevState,
        in_out: null,
        sort_by: field === 'time' ? 'duration' : 'date',
        order: order === 'descend' ? 'DESC' : 'ASC',
        limit: DEFAULT_PAGE_SIZE
      };
    });
  };

  return (
    <div className={s.root}>
      <TableFilters
        onChangeFilters={handleFilters}
      />
      <Table<CallsDataType>
        columns={tableColumns}
        dataSource={calls}
        scroll={{ x: 1440 }}
        loading={isLoading}
        rowClassName={s.row}
        pagination={{
          pageSize: 50,
          ...(!calls.length && { current: 1 }),
          showSizeChanger: false,
          hideOnSinglePage: true,
          onChange: (e) => {
            setFilters((prevState) => {
              return {
                ...prevState,
                offset: ((e - 1) * DEFAULT_PAGE_SIZE),
                limit: DEFAULT_PAGE_SIZE
              };
            });
          },
          total: Number(callsData?.total_rows)
        }}
        onChange={handleTableChange}
        locale={{
          emptyText:
            <div className={s.emptyData}>
              Нет данных
            </div>
        }}
      />
    </div>
  );
}
