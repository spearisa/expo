import { useCallback, useEffect, useState } from 'react';
import { Property, PropertyFilter, SortOption } from '@/types';
import { propertiesService } from '@/services/mock';

type State = {
  data: Property[];
  loading: boolean;
  error: Error | null;
};

export function useProperties(
  filter?: PropertyFilter,
  sort: SortOption = 'newest',
  search?: string
) {
  const [state, setState] = useState<State>({ data: [], loading: true, error: null });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await propertiesService.list(filter, sort, search);
      setState({ data, loading: false, error: null });
    } catch (err) {
      setState({ data: [], loading: false, error: err as Error });
    }
  }, [filter, sort, search]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, refetch: load };
}

export function useProperty(id: string | undefined) {
  const [state, setState] = useState<{
    data: Property | undefined;
    loading: boolean;
    error: Error | null;
  }>({ data: undefined, loading: true, error: null });

  useEffect(() => {
    if (!id) return;
    setState({ data: undefined, loading: true, error: null });
    propertiesService
      .byId(id)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => setState({ data: undefined, loading: false, error }));
  }, [id]);

  return state;
}
