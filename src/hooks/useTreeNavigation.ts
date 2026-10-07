import { useState, useCallback } from 'react';

export interface UseTreeNavigationReturn {
  povId: string | null;
  isSidebarCollapsed: boolean;
  setPovId: (id: string | null) => void;
  setIsSidebarCollapsed: (val: boolean) => void;
  handleOpenDetail: (personId: string) => void;
}

export function useTreeNavigation(initialPovId: string | null = null): UseTreeNavigationReturn {
  const [povId, setPovId] = useState<string | null>(initialPovId);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);

  // Focus person and expand sidebar to detail view
  const handleOpenDetail = useCallback((personId: string) => {
    setPovId(personId);
    setIsSidebarCollapsed(false);
  }, []);

  return {
    povId,
    isSidebarCollapsed,
    setPovId,
    setIsSidebarCollapsed,
    handleOpenDetail
  };
}
