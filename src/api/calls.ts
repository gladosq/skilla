import { FiltersType } from '@/components/PhoneCallsTable/PhoneCallsTable';
import { CallsDataType } from '@/types/calls';
import { objToQueryString } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';

type RecordParams = {
  record?: string;
  partnership_id?: string;
};

type CallsResponseType = {
  results: CallsDataType[];
  total_rows: string;
};

export const getCallsFetcher = async (params: FiltersType): Promise<CallsResponseType> => {
  const res = await fetch(
    `https://api.skilla.ru/mango/getList?${objToQueryString(params)}`,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer testtoken'
      }
    });

  if (!res.ok) {
    throw new Error('Calls info error');
  }

  return res.json();
};

export const getRecordFetcher = async (params: RecordParams) => {
  const res = await fetch(
    `https://api.skilla.ru/mango/getRecord?${objToQueryString(params)}`,
    {
      method: 'POST',
      headers: {
        'Content-type': 'audio/mpeg, audio/x-mpeg, audio/x-mpeg-3, audio/mpeg3',
        'Content-Transfer-Encoding': 'binary',
        'Content-Disposition': 'filename="record.mp3"',
        Authorization: 'Bearer testtoken'
      }
    });

  if (!res.ok) {
    throw new Error('Sourses info error');
  }

  return res;
};

export function useCalls(params: FiltersType) {
  return useQuery({
    queryKey: ['calls', params],
    queryFn: () => getCallsFetcher(params),
    enabled: !!params,
    staleTime: 0
  });
}
