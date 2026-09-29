import { useEffect, useState } from 'react';

export const useAddUserModal = (onAddUser, onClose, isOpen) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    groupId: '',
    status: 'active',
  });
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

    const payload = {
      fullName: formData.fullName.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      groupId: Number(formData.groupId) || null,
      status: formData.status,
    };

    try {
      await onAddUser(payload);
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
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    submitError,
    handleSubmit,
    handleOverlayClick,
    handleChange,
  };
};
