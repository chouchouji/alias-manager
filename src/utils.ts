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
