import { Language } from './types';

const texts = {
  [Language['zh-CN']]: {
    CREATE_ALIAS_PLACEHOLDER: '请输入新的别名',
    DUPLICATE_ALIAS_NAME: '别名重复',
    NEED_CHECK_THE_FORMAT: '请检查输入内容的格式',
    ALIAS_IS_NOT_EMPTY: '别名不能为空',
    NO_ANY_ALIAS: '没有任何别名',
    COPY_ALIAS_SUCCESSFULLY: '别名已成功复制到剪贴板',
    CREATE_GROUP_PLACEHOLDER: '请输入新分组',
    GROUP_IS_NOT_EMPTY: '分组不能为空',
    DUPLICATE_GROUP_NAME: '分组名称重复',
    CHOOSE_GROUP_PLACEHOLDER: '请选择一个分组添加别名',
  },
  [Language['en-US']]: {
    CREATE_ALIAS_PLACEHOLDER: 'Please enter new alias',
    DUPLICATE_ALIAS_NAME: 'Duplicate alias',
    NEED_CHECK_THE_FORMAT: 'Please check the format of the input content',
    ALIAS_IS_NOT_EMPTY: 'Alias is mandatory to execute this action',
    NO_ANY_ALIAS: 'No alias',
    COPY_ALIAS_SUCCESSFULLY: 'Alias has been added to the clipboard Successfully',
    CREATE_GROUP_PLACEHOLDER: 'Please enter new group',
    GROUP_IS_NOT_EMPTY: 'Group is mandatory to execute this action',
    DUPLICATE_GROUP_NAME: 'Duplicate group',
    CHOOSE_GROUP_PLACEHOLDER: 'Please choose a group to add',
  },
};

export type LanguageKey = keyof (typeof texts)['zh-CN'];

export function t(language: Language) {
  return (key: LanguageKey) => texts[language][key];
}
