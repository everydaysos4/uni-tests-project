export class UserDraft {
  constructor({
    fullName = '',
    username = '',
    email = '',
    groupId = '',
    status = 'active',
  } = {}) {
    this.fullName = fullName;
    this.username = username;
    this.email = email;
    this.groupId = groupId;
    this.status = status;
  }

  withField(field, value) {
    return new UserDraft({ ...this, [field]: value });
  }

  toPayload() {
    return {
      fullName: this.fullName.trim(),
      username: this.username.trim(),
      email: this.email.trim(),
      groupId: this.groupId === '' ? null : Number(this.groupId),
      status: this.status,
    };
  }
}
