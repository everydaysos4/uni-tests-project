import { createPortal } from 'react-dom';
import styles from './add-user-modal.module.css';
import { useAddUserModal } from '../../hooks/useAddUserModal';
import { STATUS_LABELS } from '../../../../shared/constants';

export const AddUserModal = ({ isOpen, onClose, groups, onAddUser }) => {
  const { formData, submitError, handleSubmit, handleOverlayClick, handleChange } =
    useAddUserModal(onAddUser, onClose, isOpen);

  const showStatusOptions = () => {
    return Object.entries(STATUS_LABELS).map(([value, label]) => (
      <option key={value} value={value}>
        {label}
      </option>
    ));
  };

  return createPortal(
    <div className={styles.modalOverlay} onClick={handleOverlayClick} data-testid="modal-overlay">
      <div className={styles.modalContent} role="dialog" aria-modal="true">
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Добавить пользователя</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>
        <div className={styles.modalBody}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="fullName">Полное имя</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Введите ФИО..."
              value={formData.fullName}
              onChange={(e) => handleChange(e.target.value, 'fullName')}
              required
            />

            <label htmlFor="username">Юзернейм</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Введите юзернейм..."
              value={formData.username}
              onChange={(e) => handleChange(e.target.value, 'username')}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Введите email..."
              value={formData.email}
              onChange={(e) => handleChange(e.target.value, 'email')}
              required
            />

            <label htmlFor="group">Группа</label>
            <select
              id="group"
              name="group"
              value={formData.groupId}
              onChange={(e) => handleChange(e.target.value, 'groupId')}
            >
              <option value="">Без группы</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>

            <label htmlFor="status">Статус</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={(e) => handleChange(e.target.value, 'status')}
            >
              {showStatusOptions()}
            </select>

            <button className={styles.formButton} type="submit">
              Добавить
            </button>
            {submitError && <p role="alert">{submitError}</p>}
          </form>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root'),
  );
};
