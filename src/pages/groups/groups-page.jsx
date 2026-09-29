import { useEffect, useMemo, useState } from 'react';
import { usersApi } from '../users/api/users-api';
import { STATUS_LABELS } from '../../shared/constants';
import styles from './groups-page.module.css';

const STATUS_CLASSNAMES = {
  active: styles.statusActive,
  onDuty: styles.statusOnDuty,
  offDuty: styles.statusOffDuty,
  restricted: styles.statusRestricted,
  review: styles.statusReview,
};

const sortUsersByName = (users) => {
  return [...users].sort((leftUser, rightUser) =>
    leftUser.fullName.localeCompare(rightUser.fullName, 'ru'),
  );
};

const renderUsersList = (users) => {
  if (users.length === 0) {
    return <p className={styles.emptyState}>В этой группе пока нет назначенных специалистов.</p>;
  }

  return (
    <ul className={styles.usersList}>
      {users.map((user) => (
        <li className={styles.userItem} key={user.id}>
          <div className={styles.userTop}>
            <p className={styles.userName}>{user.fullName}</p>
            <span className={`${styles.status} ${STATUS_CLASSNAMES[user.status]}`}>
              {STATUS_LABELS[user.status]}
            </span>
          </div>
          <p className={styles.userMeta}>@{user.username}</p>
          <p className={styles.userMeta}>{user.email}</p>
        </li>
      ))}
    </ul>
  );
};

export const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const [groupsData, usersData] = await Promise.all([
          usersApi.getGroups(),
          usersApi.getUsers(),
        ]);

        setGroups(groupsData);
        setUsers(usersData);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const groupedUsers = useMemo(() => {
    return users.reduce((acc, user) => {
      const groupKey = user.groupId === null ? 'ungrouped' : String(user.groupId);

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }

      acc[groupKey].push(user);

      return acc;
    }, {});
  }, [users]);

  const groupsWithUsers = useMemo(() => {
    return groups.map((group) => ({
      ...group,
      users: sortUsersByName(groupedUsers[String(group.id)] || []),
    }));
  }, [groupedUsers, groups]);

  const ungroupedUsers = useMemo(() => {
    return sortUsersByName(groupedUsers.ungrouped || []);
  }, [groupedUsers]);

  return (
    <section className={styles.groupsSection}>
      <div className={styles.heroCard}>
        <p className={styles.kicker}>Рабочие группы</p>
        <h1 className={styles.title}>Команды и участники</h1>
        <p className={styles.description}>
          Обзор распределения специалистов по ключевым security-направлениям платформы. Карточки
          помогают быстро увидеть состав каждой группы и сотрудников без назначения.
        </p>
      </div>

      {isLoading ? (
        <div className={styles.loadingState}>Загружаем состав рабочих групп...</div>
      ) : isError ? (
        <div className={styles.loadingState}>
          Не удалось загрузить данные по группам. Проверьте доступность API и обновите страницу.
        </div>
      ) : (
        <>
          <div className={styles.cardsGrid}>
            {groupsWithUsers.map((group) => (
              <article className={styles.groupCard} key={group.id}>
                <div className={styles.cardHead}>
                  <div className={styles.cardTitleBlock}>
                    <h2 className={styles.cardTitle}>{group.name}</h2>
                    <p className={styles.cardDescription}>{group.description}</p>
                  </div>
                  <div className={styles.countBadge}>
                    <span className={styles.countValue}>{group.users.length}</span>
                    <span className={styles.countLabel}>участников</span>
                  </div>
                </div>
                {renderUsersList(group.users)}
              </article>
            ))}
            <article className={styles.groupCard}>
              <div className={styles.cardHead}>
                <div className={styles.cardTitleBlock}>
                  <h2 className={styles.cardTitle}>Без группы</h2>
                  <p className={styles.cardDescription}>
                    Специалисты, которые пока не закреплены за рабочим контуром.
                  </p>
                </div>
                <div className={styles.countBadge}>
                  <span className={styles.countValue}>{ungroupedUsers.length}</span>
                  <span className={styles.countLabel}>участников</span>
                </div>
              </div>
              {renderUsersList(ungroupedUsers)}
            </article>
          </div>
        </>
      )}
    </section>
  );
};
