import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import mockFs from 'mock-fs'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { appendAliasToStoreFile, deleteAliases, getAliases, getContentFromPath, renameAliases } from '../src/aliases'

const ZSHRC = path.join(os.homedir(), '.zshrc')

beforeAll(() => {
  mockFs({
    [ZSHRC]: '',
  })
})

afterAll(() => {
  mockFs.restore()
})

describe('test get content from .zshrc', () => {
  it('.zshrc file has no content', () => {
    expect(getContentFromPath(ZSHRC)).toBe('')
  })

  it('.zshrc file has content', () => {
    const content = `alias nv='node -v'`
    fs.appendFileSync(ZSHRC, content)
    expect(getContentFromPath(ZSHRC)).toBe(content)
  })
})

describe('test get all alias from .zshrc', () => {
  it('.zshrc file has one alias', () => {
    expect(getAliases(ZSHRC)).toStrictEqual([{ aliasName: 'nv', command: 'node -v', description: '', frequency: 0 }])
  })

  it('.zshrc file has multiple alias', () => {
    const content = `\nalias pv='pnpm -v'`
    fs.appendFileSync(ZSHRC, content)
    expect(getAliases(ZSHRC)).toStrictEqual([
      { aliasName: 'nv', command: 'node -v', description: '', frequency: 0 },
      { aliasName: 'pv', command: 'pnpm -v', description: '', frequency: 0 },
    ])
  })

  it('.zshrc file has multiple alias and other content', () => {
    const content = '\ntest\n#pnpm'
    fs.appendFileSync(ZSHRC, content)
    expect(getAliases(ZSHRC)).toStrictEqual([
      { aliasName: 'nv', command: 'node -v', description: '', frequency: 0 },
      { aliasName: 'pv', command: 'pnpm -v', description: '', frequency: 0 },
    ])
  })

  it('.zshrc file has no content', () => {
    fs.writeFileSync(ZSHRC, '')
    expect(getAliases(ZSHRC)).toStrictEqual([])
  })
})

describe('test append alias into .zshrc', () => {
  it('append one alias into .zshrc', () => {
    appendAliasToStoreFile(ZSHRC, `nv='node -v'`)
    expect(fs.readFileSync(ZSHRC, 'utf-8')).toBe(`\nalias nv='node -v'`)

    appendAliasToStoreFile(ZSHRC, `pv='pnpm -v'`)
    expect(fs.readFileSync(ZSHRC, 'utf-8')).toBe(`\nalias nv='node -v'\nalias pv='pnpm -v'`)
  })
})

describe('test rename alias in .zshrc', () => {
  it('rename alias command in .zshrc', () => {
    renameAliases(ZSHRC, { aliasName: 'nv', command: 'node -v' }, { aliasName: 'nv', command: 'node --version' })
    expect(fs.readFileSync(ZSHRC, 'utf-8')).toBe(`\nalias nv='node --version'\nalias pv='pnpm -v'`)
  })

  it('rename alias name in .zshrc', () => {
    renameAliases(ZSHRC, { aliasName: 'pv', command: 'pnpm -v' }, { aliasName: 'pnpm_version', command: 'pnpm -v' })
    expect(fs.readFileSync(ZSHRC, 'utf-8')).toBe(`\nalias nv='node --version'\nalias pnpm_version='pnpm -v'`)
  })
})

describe('test delete alias in .zshrc', () => {
  it('delete one alias in .zshrc', () => {
    deleteAliases(ZSHRC, { aliasName: 'nv', command: 'node --version' })
    expect(fs.readFileSync(ZSHRC, 'utf-8')).toBe(`\nalias pnpm_version='pnpm -v'`)
  })

  it('delete all alias in .zshrc', () => {
    deleteAliases(ZSHRC)
    expect(fs.readFileSync(ZSHRC, 'utf-8')).toBe('')
  })
})
