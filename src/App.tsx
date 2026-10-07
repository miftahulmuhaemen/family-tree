import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FamilyTreePage } from './pages/FamilyTreePage';
import { NotificationProvider } from './context/NotificationContext';
import { StackedToastContainer } from './components/toast/StackedToastContainer';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <FamilyTreePage />
        <StackedToastContainer />
      </NotificationProvider>
    </QueryClientProvider>
  );
}
