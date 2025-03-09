import { exec } from 'node:child_process'
import fs from 'node:fs'
import { isEmpty, normalizeToArray } from 'rattail'
import type { Alias } from './types'
import { filterAliases, isSameAlias, resolveAlias } from './utils'

function reloadStoreFile(path: fs.PathOrFileDescriptor) {
  exec(`source ${path}`, { shell: '/bin/bash' })
}

export function getContentFromPath(path: fs.PathOrFileDescriptor) {
  return fs.readFileSync(path, 'utf-8')
}

export function getAliases(path: fs.PathOrFileDescriptor) {
  const content = getContentFromPath(path)

  return filterAliases(content)
}

export function appendAliasToStoreFile(path: fs.PathOrFileDescriptor, content: string) {
  fs.appendFileSync(path, content)

  reloadStoreFile(path)
}

export function deleteAliases(path: fs.PathOrFileDescriptor, specificAlias: Alias | Alias[] = []) {
  const content = getContentFromPath(path)

  if (isEmpty(content)) {
    return
  }

  const specificAliases = normalizeToArray(specificAlias)
  const data = content
    .split('\n')
    .map((text) => text.trim())
    .filter((text) => {
      const alias = resolveAlias(text)

      if (!specificAliases.length) {
        return !alias
      }

      if (alias) {
        return !specificAliases.some((specificAlias) => isSameAlias(alias, specificAlias))
      }

      return true
    })
    .join('\n')

  fs.writeFileSync(path, data)

  reloadStoreFile(path)
}

export function renameAliases(
  path: fs.PathOrFileDescriptor,
  specificAlias: Alias,
  targetAlias: Pick<Alias, 'aliasName' | 'command'>,
) {
  const content = getContentFromPath(path)

  if (isEmpty(content)) {
    return
  }

  const data = content
    .split('\n')
    .map((text) => text.trim())
    .reduce((acc: string[], text) => {
      const alias = resolveAlias(text)

      if (alias && isSameAlias(alias, specificAlias)) {
        acc.push(`alias ${targetAlias.aliasName}='${targetAlias.command}'`)
      } else {
        acc.push(text)
      }

      return acc
    }, [])
    .join('\n')

  fs.writeFileSync(path, data)

  reloadStoreFile(path)
}
