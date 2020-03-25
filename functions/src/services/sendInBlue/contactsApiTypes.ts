export interface CreateContactParams {
  email: string,
  listIds: Array<number>,
  attributes?: Object,
  emailBlacklisted?: boolean,
  smsBlacklisted?: boolean,
  updateEnabled?: boolean,
  smtpBlacklistSender?: Array<string>,
}

export interface CreateContactReturn {
  id: number,
}
