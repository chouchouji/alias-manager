import { exec } from 'node:child_process'
import fs from 'node:fs'
import { isEmpty } from 'rattail'
import type { Alias } from './types'
import { isSameAlias, resolveAlias } from './utils'

function reloadStoreFile(path: fs.PathOrFileDescriptor) {
  exec(`source ${path}`, { shell: '/bin/bash' })
}

export function getContentFromPath(path: fs.PathOrFileDescriptor) {
  return fs.readFileSync(path, 'utf-8')
}

export function getAliases(path: fs.PathOrFileDescriptor) {
  const content = getContentFromPath(path)

  if (isEmpty(content)) {
    return []
  }

  const aliases = content
    .split('\n')
    .filter(Boolean)
    .map((text) => text.trim())
    .reduce((acc: Alias[], text) => {
      const alias = resolveAlias(text)
      if (alias) {
        const { aliasName, command } = alias
        acc.push({
          aliasName,
          command,
          frequency: 0,
          description: '',
        })
      }
      return acc
    }, [])

  return aliases
}

export function appendAliasToStoreFile(path: fs.PathOrFileDescriptor, content: string) {
  const data = `
alias ${content}`
  fs.appendFileSync(path, data)

  reloadStoreFile(path)
}

export function deleteAliases(path: fs.PathOrFileDescriptor, specificAlias?: Alias) {
  const content = getContentFromPath(path)

  if (isEmpty(content)) {
    return
  }

  const data = content
    .split('\n')
    .map((text) => text.trim())
    .filter((text) => {
      const alias = resolveAlias(text)

      if (!specificAlias) {
        return !alias
      }

      if (alias) {
        return !isSameAlias(alias, specificAlias)
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
