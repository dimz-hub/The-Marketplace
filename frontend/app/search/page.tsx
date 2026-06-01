import SearchResultsContent from './SearchClient';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchResultsPage({ searchParams }: PageProps) {
  // Safe asynchronous resolution on the server
  const resolvedParams = await searchParams;
  
  const findDescValue = typeof resolvedParams.find_desc === 'string' ? resolvedParams.find_desc : '';
  const locationValue = typeof resolvedParams.location === 'string' ? resolvedParams.location : 'Lagos';

  return (
    <SearchResultsContent findDesc={findDescValue} locationParam={locationValue} />
  );
}