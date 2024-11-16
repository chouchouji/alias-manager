export interface Alias {
  aliasName: string;
  command: string;
  frequency?: number;
}

export enum Language {
  'zh-CN' = 'zh-CN',
  'en-US' = 'en-US',
}
