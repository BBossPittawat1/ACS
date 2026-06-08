'use client';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';
import thTH from 'antd/locale/th_TH';
import type { ReactNode } from 'react';

const theme = {
  token: {
    colorPrimary: '#e879a9',
    colorSuccess: '#10b981',
    colorWarning: '#fbbf24',
    colorError: '#f43f5e',
    borderRadius: 16,
    fontFamily: 'var(--font-prompt), system-ui, sans-serif',
  },
  components: {
    Button: { controlHeight: 44, paddingContentHorizontal: 20 },
    Input: { controlHeight: 44 },
    Select: { controlHeight: 44 },
    DatePicker: { controlHeight: 44 },
  },
};

export function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider locale={thTH} theme={theme}>
        <App>
          {children}
        </App>
      </ConfigProvider>
    </AntdRegistry>
  );
}
