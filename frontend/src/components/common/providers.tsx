'use client';
import { ProgressProvider } from '@bprogress/next/app';
import ToastProvider from './ToastProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider />
      <ProgressProvider
        height="4px"
        color="#2563eb"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
    </QueryClientProvider>
  );
};

export default Providers;
