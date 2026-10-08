import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      // Retry network and server errors, never 4xx (bad input, auth)
      retry: (failureCount, error) => failureCount < 2 && (!error?.status || error.status >= 500),
    },
  },
});

export default queryClient;
