import { useRouter, useSearchParams } from 'next/navigation';
import { Key } from 'antd/es/table/interface';
import { Dispatch, SetStateAction, useState } from 'react';
import APIRequest from '@/data/api/api.utils';
import { API_ENDPOINTS } from '@/data/api/api.data';
import { Form, TreeProps } from 'antd';

import { DataNode } from 'antd/es/tree';
import { APP_PATHS } from '@/data/paths.data';

export interface ITreeRow {
  name: string;
  id: number;
  parentId?: number;
  label?: string;
  description?: string;
  subCategories?: number;
  count: number;
}

interface IProps {
  fetchDataProducts: (id: number) => Promise<void>;
}

export const useTreeCategories = ({ fetchDataProducts }: IProps) => {
  const onClick: TreeProps['onClick'] = (selectedKeys: any, info: any) => {
    if (info) {
      fetchDataProducts(info.key);
    }
  };

  return {
    onClick,
  };
};
