import {create} from 'zustand';

type RecordState = {
  record: string | null;
  setRecord: (value: string) => void;
};

const useRecordStore = create<RecordState>((set) => ({
  record: null,
  setRecord: (value) => set(() => ({record: value})),
}));

export default useRecordStore;
