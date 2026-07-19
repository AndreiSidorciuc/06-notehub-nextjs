import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { Suspense } from "react";

import { fetchNotes } from "../../lib/api";

import NotesClient from "./Notes.client";

// Notes list changes often (create/delete), so fetch fresh data on every request
// instead of using the build-time static cache.
export const dynamic = "force-dynamic";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, ""],
    queryFn: () => fetchNotes({ page: 1, search: "" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<p>Loading, please wait...</p>}>
        <NotesClient />
      </Suspense>
    </HydrationBoundary>
  );
}
