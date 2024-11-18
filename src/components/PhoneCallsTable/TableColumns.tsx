import { MOCK_SOURSES } from "@/const";
import { CallsDataType } from "@/types/calls";
import IncomingIcon from "@/ui/IncomingIcon";
import OutgoingIcon from "@/ui/OutgoingIcon";
import { getRandomNumber, secondsToMinutesSeconds } from "@/utils/utils";
import { TableColumnsType, Tag } from "antd";
import dayjs from "dayjs";
import s from './PhonecallsTable.module.scss';
import AudioPlayerComponent from "../AudioPlayerComponent/AudioPlayerComponent";
import { qualityTags } from "../const";
import DropdownArrowIcon from "@/ui/DropdownArrowIcon";

export const tableColumns: TableColumnsType<CallsDataType> = [
  {
    title: 'Тип',
    dataIndex: 'in_out',
    key: 'in_out',
    width: '5%',
    render: (type: number) => {
      if (type === 0) return <IncomingIcon />;
      if (type === 1) return <OutgoingIcon />;
    },
  },
  {
    title: 'Время',
    dataIndex: 'date',
    key: 'date',
    width: '7%',
    sortDirections: ['descend'],
    render: (date: string) => dayjs(date).format('HH:mm'),
    sorter: (a, b) => {
      return a.time.length - b.time.length;
    },
    sortIcon: () => <DropdownArrowIcon/>,
  },
  {
    title: 'Сотрудник',
    dataIndex: 'person_avatar',
    key: 'person_avatar',
    width: '9%',
    render: (person: string) => {
      if (person) return <img className={s.person} src={person} alt='Аватар' />;
    },
  },
  {
    title: 'Звонок',
    dataIndex: 'from_number',
    key: 'from_number',
    width: '240px',
    render: (from_number, record) => {
      return (
        <>
          {record.contact_name && <p>{record.contact_name}</p>}
          {record.contact_company && <p className={s.contactCompany}>{record.contact_company}</p>}
          {!(record.contact_name || record.contact_company) && from_number}
        </>
      );
    }
  },
  {
    title: 'Источник',
    dataIndex: 'sourse',
    key: 'sourse',
    width: '240px',
    render: () => {
      return <span className={s.sourse}>{MOCK_SOURSES[getRandomNumber(0, MOCK_SOURSES.length - 1)]}</span>;
    },
  },
  {
    title: 'Оценка',
    dataIndex: 'errors',
    key: 'errors',
    width: '20%',
    render: (errors) => {
      const randomNumber = getRandomNumber(0, qualityTags.length - 1);
      if (errors.length) {
        return <span className={s.error}>{errors[0]}</span>;
      }
      return (
        <Tag className={s.tag} color={qualityTags[randomNumber].color} key={qualityTags[randomNumber].name}>
          {qualityTags[randomNumber].name}
        </Tag>
      )
    },
  },
  {
    title: 'Длительность',
    sortIcon: () => <DropdownArrowIcon/>,
    sortDirections: ['descend'],
    dataIndex: 'time',
    key: 'time',
    ellipsis: true,
    width: '360px',
    sorter: (a, b) => {
      return a.time.length - b.time.length;
    },
    render: (time: number, record) => {
      const formattedDuration = secondsToMinutesSeconds(time);
      return (
        !!time && record.record && <div className={s.durationCell}>
          <div className={s.audio}>
            <AudioPlayerComponent
              duration={formattedDuration}
              recordId={record.record}
              partnershipId={record.partnership_id}
              rowId={record.id}
            />
          </div>
          <div className={s.time}>
            {formattedDuration}
          </div>
        </div>
      );
    },
    align: 'right',
  },
];
