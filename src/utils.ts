export function isArray(val: unknown): val is Array<any> {
  return Array.isArray(val);
}

export function isNonEmptyArray(val: unknown): val is Array<any> {
  return isArray(val) && !!val.length;
}

export function isEmpty(val: unknown) {
  return val === undefined || val === null || val === '' || (isArray(val) && !val.length);
}

export function getAliasName(alias: string) {
  if (!alias.includes('=')) {
    return undefined;
  }

  let res = '';
  for (let i = 0; i < alias.length; i++) {
    const char = alias.charAt(i);
    if (char === '=') {
      return res;
    }

    res += char;
  }
}
