import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import ru_RU from "antd/lib/locale/ru_RU";
import "dayjs/locale/ru";
import dayjs from 'dayjs';
dayjs.locale("ru");

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 5 * 1000,
        retry: 0
      }
    }
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
         locale={ru_RU}
        theme={{
          token: {
            fontFamily: 'SF Pro Display',
            colorText: '#122945'
          },
          components: {
            DatePicker: {
              inputFontSize: 26,
              inputFontSizeLG: 36,
              inputFontSizeSM: 40
            },
            Table: {
              fontSize: 15,
              cellPaddingBlock: 13,
              rowHoverBg: 'rgba(212, 223, 243, 0.17)',
              headerBg: '#FFFFFF',
              headerColor: '#5E7793',
            }
          }
        }}
      >
        {children}
      </ConfigProvider>
    </QueryClientProvider>
  );
}
