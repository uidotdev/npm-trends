import { useQuery, useQueries } from 'react-query';
import Fetch from 'services/Fetch';
import Package from 'services/Package';
import IPackage from 'types/IPackage';
import PackageDownloads from 'services/PackageDownloads';

export function useRelatedPackages(searchQueryParams: string) {
  return useQuery(
    ['related-packages', searchQueryParams],
    async ({ signal }) => {
      const data = await Fetch.getJSON(`/s/related_packages?${searchQueryParams}&limit=5`, { signal });
      return data;
    },
    {
      enabled: Boolean(searchQueryParams),
      refetchOnWindowFocus: false,
    },
  );
}

export function usePackage({ packageName, isOpen }: { packageName: string; isOpen: boolean }) {
  return useQuery(
    ['package', packageName],
    async () => {
      const result = await Package.fetchPackage(packageName);
      return result;
    },
    {
      enabled: isOpen,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  );
}

export function usePackagesData(packets: string[], initialData: { packets: IPackage[] } = { packets: [] }) {
  return useQuery(
    ['packages', packets],
    async () => {
      if (!packets.length) {
        return { packets: [] };
      }
      const { validPackages } = await Package.fetchPackages(packets);
      const maxPacketsForSearch = 10;
      return { packets: validPackages.slice(0, maxPacketsForSearch) };
    },
    {
      initialData,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    },
  );
}

export function useSearchPackages(searchQuery: string) {
  return useQuery(
    ['search-packages', searchQuery],
    async () => {
      const suggestQuery = {
        autocomplete_suggest: {
          text: searchQuery,
          completion: {
            field: 'suggest',
            size: 10,
          },
        },
      };

      const data = await Fetch.getJSON(
        `${process.env.NEXT_PUBLIC_ELASTICSEARCH_URL}/npm/_suggest?source=${JSON.stringify(suggestQuery)}`,
      );

      return data.autocomplete_suggest[0].options;
    },
    {
      initialData: [],
      enabled: Boolean(searchQuery),
      refetchOnWindowFocus: false,
    },
  );
}

export function usePackageDownloads(packets: IPackage[], startDate: string, endDate: string, initialData = []) {
  return useQuery(
    ['package-downloads', { startDate, endDate, packets }],
    () =>
      Promise.all(packets.map(({ name, color }) => PackageDownloads.fetchDownloads(name, color, startDate, endDate))),
    {
      initialData,
      keepPreviousData: true,
    },
  );
}
