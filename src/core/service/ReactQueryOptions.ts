import { keepPreviousData } from "@tanstack/react-query";

export const ReactQueryOptions = {
    // Options used in ComprehensiveDisplay.tsx
    displayOptions: {
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
    },

    // Options used in ModernDataTable.tsx
    tableOptions: {
        placeholderData: keepPreviousData,
        refetchOnWindowFocus: false,
    },

    // Options used in ComprehensiveCreate.tsx (for fetching initial data)
    editOptions: {
        retry: 1,
    },

    /*
    Other common React Query options:
    - enabled: boolean (Set to false to disable automatic refetching)
    - refetchInterval: number (Refetch frequency in milliseconds)
    - refetchIntervalInBackground: boolean (Refetch even when window is not focused)
    - refetchOnMount: boolean | "always" (Refetch on component mount)
    - refetchOnReconnect: boolean | "always" (Refetch on network reconnect)
    - notifyOnChangeProps: string[] | "all" (Props to watch for changes)
    - select: (data: TData) => TResult (Transform data)
    - initialData: TData (Initial data to use)
    - initialDataUpdatedAt: number (Timestamp of initial data)
    - gcTime: number (Garbage collection time in milliseconds, formerly cacheTime)
    */
};
