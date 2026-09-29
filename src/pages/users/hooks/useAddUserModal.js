import { useEffect, useState } from 'react';
import { UserDraft } from '../model/user-draft';

export const useAddUserModal = (onAddUser, onClose, isOpen) => {
  const [formData, setFormData] = useState(() => new UserDraft());
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    try {
      await onAddUser(formData.toPayload());
      onClose();
    } catch {
      setSubmitError('Не удалось добавить пользователя. Проверьте данные и повторите попытку.');
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (value, field) => {
    setFormData((prev) => prev.withField(field, value));
  };

  return {
    formData,
    submitError,
    handleSubmit,
    handleOverlayClick,
    handleChange,
  };
};
