// src/hooks/usePagination.js
import { useState } from "react";

export default function usePagination(data = [], itemsPerPage = 5) {
  const [currentPage, setCurrentPage] = useState(1);

  const maxPage = Math.ceil(data.length / itemsPerPage);

  const currentData = () => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  };

  const next = () => {
    setCurrentPage((page) => Math.min(page + 1, maxPage));
  };

  const prev = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  const jump = (page) => {
    const pageNumber = Math.max(1, Math.min(page, maxPage));
    setCurrentPage(pageNumber);
  };

  return { currentData, currentPage, maxPage, next, prev, jump };
}
