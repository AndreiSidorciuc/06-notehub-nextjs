"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchNotes } from "../../lib/api";
import SearchBox from "../../components/SearchBox/SearchBox";
import NoteList from "../../components/NoteList/NoteList";
import NoteForm from "../../components/NoteForm/NoteForm";
import Pagination from "../../components/Pagination/Pagination";
import Modal from "../../components/Modal/Modal";
import css from "./Notes.module.css";

export default function NotesClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const page = Number(params.get("page") ?? 1);
  const search = params.get("search") ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, search }),
    refetchOnMount: false,
  });

  const handleSearch = (value: string) => {
    router.push(`/notes?search=${encodeURIComponent(value)}&page=1`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/notes?page=${newPage}&search=${encodeURIComponent(search)}`);
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <main className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={search} onSearch={handleSearch} />

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <button
          type="button"
          className={css.button}
          onClick={() => setIsFormOpen(true)}
        >
          Create note +
        </button>
      </div>

      {isFormOpen && (
        <Modal onClose={() => setIsFormOpen(false)}>
          <NoteForm onClose={() => setIsFormOpen(false)} />
        </Modal>
      )}

      {data?.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found.</p>
      )}
    </main>
  );
}
