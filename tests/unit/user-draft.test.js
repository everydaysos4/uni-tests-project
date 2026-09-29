import { describe, expect, it } from 'vitest';
import { UserDraft } from '../../src/pages/users/model/user-draft';

describe('UserDraft', () => {
  it('задаёт безопасные начальные значения', () => {
    expect(new UserDraft()).toEqual({
      fullName: '',
      username: '',
      email: '',
      groupId: '',
      status: 'active',
    });
  });

  it('создаёт новый draft при изменении поля', () => {
    const draft = new UserDraft();
    const changedDraft = draft.withField('username', 'new-user');

    expect(changedDraft).not.toBe(draft);
    expect(changedDraft.username).toBe('new-user');
    expect(draft.username).toBe('');
  });

  it('обрезает строки и преобразует groupId в число', () => {
    const payload = new UserDraft({
      fullName: '  Иван Иванов  ',
      username: ' ivan ',
      email: ' ivan@example.com ',
      groupId: '2',
      status: 'review',
    }).toPayload();

    expect(payload).toEqual({
      fullName: 'Иван Иванов',
      username: 'ivan',
      email: 'ivan@example.com',
      groupId: 2,
      status: 'review',
    });
  });

  it('преобразует пустую группу в null', () => {
    expect(new UserDraft().toPayload().groupId).toBeNull();
  });
});
