'use client';

import '@ant-design/v5-patch-for-react-19';
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {App as AntApp, ConfigProvider} from "antd";
import type * as React from "react";

export function AntdProvider({children}: React.PropsWithChildren) {
  const primaryColor = process.env.NEXT_PUBLIC_PRIMARY_COLOR;

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: primaryColor,
          },
          cssVar: true,
          hashed: false,
        }}
      >
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </AntdRegistry>
  );
}
