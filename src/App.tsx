import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FamilyTreePage } from './pages/FamilyTreePage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FamilyTreePage />
    </QueryClientProvider>
  );
}
