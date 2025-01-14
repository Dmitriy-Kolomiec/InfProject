'use client';
import React, { useState } from 'react';
import { createContext } from 'react';
import {
  IAboutRequest,
  RequestContextData,
} from '@/interface/request/request.interface';

const initialRequestContext: RequestContextData = {
  dataRequest: {},
  setDataRequest: () => {},
  loadingTableFormationData: false,
  setLoadingTableFormationData: () => {},
};

export const RequestContext = createContext<RequestContextData>(
  initialRequestContext,
);

export const RequestProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dataRequest, setDataRequest] = useState<IAboutRequest>({});
  const [loadingTableFormationData, setLoadingTableFormationData] =
    useState<boolean>(false);

  return (
    <RequestContext.Provider
      value={{
        dataRequest,
        setDataRequest,
        loadingTableFormationData,
        setLoadingTableFormationData,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};
