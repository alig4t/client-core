// src/hooks/useDeleteWithConfirmation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { QueryKey } from "@tanstack/react-query";

interface UseDeleteWithConfirmationProps<T = unknown> {
  deleteFn: (id: number) => Promise<T>;
  invalidateQueryKey: QueryKey;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useDeleteWithConfirmation = <T = unknown>({
  deleteFn,
  invalidateQueryKey,
  onSuccess,
  onError,
}: UseDeleteWithConfirmationProps<T>) => {
  const queryClient = useQueryClient();
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: deleteFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
      onSuccess?.();
      closeModal();
    },
    onError: (error) => {
      onError?.(error);
      closeModal();
    },
  });

  const openModal = (id: number) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIdToDelete(null);
  };

  const handleConfirm = () => {
    if (idToDelete !== null) {
      deleteMutation.mutate(idToDelete);
    }
  };

  return {
    isModalOpen,
    idToDelete,
    isDeleting: deleteMutation.isPending,
    openModal,
    closeModal,
    handleConfirm,
  };
};