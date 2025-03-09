import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { isArray, isNonEmptyArray } from 'rattail'
import * as vscode from 'vscode'
import { appendAliasToStoreFile, deleteAliases, getAliases, renameAliases } from './aliases'
import { SYSTEM_ALIAS } from './constants'
import storePath from './path'
import type { Alias } from './types'
import {
  filterAliases,
  formatUnaliasCommand,
  isAliasSubset,
  isSameAlias,
  mergeAlias,
  normalizeAliasesToArray,
  resolveAlias,
} from './utils'

export async function activate(context: vscode.ExtensionContext) {
  // set default store path
  storePath.path = path.join(os.homedir(), '.zshrc')
  if (!fs.existsSync(storePath.path)) {
    const text = await vscode.window.showInformationMessage(
      vscode.l10n.t("The .zshrc file on {path} doesn't exist. Do you want to create .zshrc file in this path?", {
        path: os.homedir(),
      }),
      { modal: true },
      vscode.l10n.t('Confirm'),
    )

    // click confirm button
    if (text !== undefined) {
      fs.writeFileSync(storePath.path, '')
      vscode.window.showInformationMessage(
        vscode.l10n.t('Create .zshrc file on {path} successfully', { path: os.homedir() }),
      )
    }
  }

  const globalState = context.globalState

  const aliasView = new AliasView(globalState)

  context.subscriptions.push(
    // watch store path
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('alias-manager.defaultStorePath')) {
        const defaultStorePath = vscode.workspace.getConfiguration('alias-manager').get<string>('defaultStorePath')

        if (defaultStorePath) {
          storePath.path = defaultStorePath.startsWith('~')
            ? defaultStorePath.replace('~', os.homedir())
            : defaultStorePath
          if (!fs.existsSync(storePath.path)) {
            vscode.window.showErrorMessage(vscode.l10n.t('Please check if the file exists'))
            return
          }
          aliasView.refresh()
        }
      }
    }),
  )

  context.subscriptions.push(vscode.window.registerTreeDataProvider('aliasView', aliasView))

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.refresh', (alias?: AliasItem) => aliasView.refresh(alias)),
  )

  context.subscriptions.push(vscode.commands.registerCommand('aliasView.add', () => aliasView.addAlias()))

  context.subscriptions.push(vscode.commands.registerCommand('aliasView.export', () => aliasView.exportAlias()))

  context.subscriptions.push(vscode.commands.registerCommand('aliasView.import', () => aliasView.importAlias()))

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.deleteAlias', (alias: AliasItem) => aliasView.deleteAlias(alias)),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.deleteAllAlias', () => aliasView.deleteAllAlias()),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.renameAliasName', (alias: AliasItem) =>
      aliasView.renameAliasName(alias),
    ),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.renameAliasCommand', (alias: AliasItem) =>
      aliasView.renameAliasCommand(alias),
    ),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.run', (alias: AliasItem) => aliasView.runAlias(alias)),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.copyAllAlias', (alias: AliasItem) => aliasView.copyAllAlias(alias)),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.copy', (alias: AliasItem) => aliasView.copyAlias(alias)),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.renameGroup', (alias: AliasItem) => aliasView.renameGroup(alias)),
  )

  context.subscriptions.push(vscode.commands.registerCommand('aliasView.newGroup', () => aliasView.addNewGroup()))

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.deleteGroup', (alias: AliasItem) => aliasView.deleteGroup(alias)),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.setDescription', (alias: AliasItem) => aliasView.setDescription(alias)),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.addToGroup', (alias: AliasItem) => aliasView.addToGroup(alias)),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.removeFromCurrentGroup', (alias: AliasItem) =>
      aliasView.removeFromCurrentGroup(alias),
    ),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.sortByAlphabet', (alias: AliasItem) => aliasView.sortByAlphabet(alias)),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.sortByFrequency', (alias: AliasItem) =>
      aliasView.sortByFrequency(alias),
    ),
  )
}

function executeCommandInTerminal(command: string) {
  const activeTerminal = vscode.window.activeTerminal ?? vscode.window.createTerminal()
  activeTerminal.show()
  activeTerminal.sendText(command)
}

function setTooltip(frequency = 0) {
  return vscode.l10n.t('frequency: {frequency}', { frequency })
}

class AliasView implements vscode.TreeDataProvider<AliasItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<AliasItem | undefined | null | undefined> = new vscode.EventEmitter<
    AliasItem | undefined | null | undefined
  >()

  readonly onDidChangeTreeData: vscode.Event<AliasItem | undefined | null | undefined> = this._onDidChangeTreeData.event

  globalState: vscode.Memento

  constructor(globalState: vscode.Memento) {
    this.globalState = globalState
    this.globalState.update(SYSTEM_ALIAS, getAliases(storePath.path))
  }

  refresh(alias?: AliasItem) {
    this._onDidChangeTreeData.fire(alias)
  }

  convertAliasToObject() {
    const data = this.globalState.keys().reduce((acc: Record<string, Alias[]>, key: string) => {
      const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(key))
      Reflect.set(acc, key, aliases)

      return acc
    }, {})

    return data
  }

  async exportAlias() {
    const filePath = await vscode.window.showSaveDialog({
      filters: {
        'JSON Files': ['json'],
      },
    })
    if (!filePath) {
      return
    }

    fs.writeFile(filePath.fsPath, JSON.stringify(this.convertAliasToObject()), (err) => {
      if (err) {
        vscode.window.showErrorMessage(
          vscode.l10n.t('Fail to save json file, the error message is {message}', { message: err.message }),
        )
      } else {
        vscode.window.showInformationMessage(
          vscode.l10n.t('Save file successfully, the path is {path}', { path: filePath.fsPath }),
        )
      }
    })
  }

  async importAlias() {
    const clipboard = vscode.l10n.t('clipboard')
    const json = vscode.l10n.t('json')
    const selectedWay = await vscode.window.showQuickPick([clipboard, json], {
      placeHolder: vscode.l10n.t('Please choose the way you want to import data'),
    })

    // cancel pick group
    if (selectedWay === undefined) {
      return
    }

    switch (selectedWay) {
      case clipboard:
        {
          const content = await vscode.env.clipboard.readText()
          const aliases = filterAliases(content)

          if (aliases.length === 0 || isAliasSubset(Reflect.get(this.convertAliasToObject(), SYSTEM_ALIAS), aliases)) {
            vscode.window.showInformationMessage(vscode.l10n.t('No any alias need to import'))
            return
          }

          const result = mergeAlias(this.convertAliasToObject(), {
            [SYSTEM_ALIAS]: aliases,
          })
          const systemAliases: Alias[] = Reflect.get(result, SYSTEM_ALIAS)
          await this.globalState.update(SYSTEM_ALIAS, systemAliases)
          deleteAliases(storePath.path)
          appendAliasToStoreFile(
            storePath.path,
            systemAliases.map((alias) => `\nalias ${alias.aliasName}='${alias.command}'`).join(''),
          )
          executeCommandInTerminal(
            systemAliases.map((alias) => `alias ${alias.aliasName}='${alias.command}'`).join('; '),
          )
          this.refresh()
          vscode.window.showInformationMessage(vscode.l10n.t('Import clipboard text successfully'))
        }
        break
      case json:
        {
          const fileUris = await vscode.window.showOpenDialog({
            filters: {
              'JSON Files': ['json'],
            },
            canSelectMany: false,
          })

          if (isNonEmptyArray(fileUris)) {
            const filePath = fileUris[0].fsPath
            fs.readFile(filePath, 'utf-8', async (err, data) => {
              if (err) {
                vscode.window.showErrorMessage(vscode.l10n.t('Fail to read file: {message}', { message: err.message }))
                return
              }

              try {
                const json = JSON.parse(data)
                const targetAlias = Object.entries(json).reduce((acc: Record<string, Alias[]>, [key, value]) => {
                  if (isArray(value)) {
                    const aliases = value.filter((item) => item.aliasName && item.command)
                    if (aliases.length > 0) {
                      Reflect.set(acc, key, aliases)
                    }
                  }

                  return acc
                }, {})

                if (Object.values(targetAlias).length > 0) {
                  const result = mergeAlias(this.convertAliasToObject(), targetAlias)
                  for (const [groupName, aliases] of Object.entries(result)) {
                    await this.globalState.update(groupName, aliases)
                  }

                  const systemAliases: Alias[] = Reflect.get(result, SYSTEM_ALIAS)
                  deleteAliases(storePath.path)
                  appendAliasToStoreFile(
                    storePath.path,
                    systemAliases.map((alias) => `\nalias ${alias.aliasName}='${alias.command}'`).join(''),
                  )
                  executeCommandInTerminal(
                    systemAliases.map((alias) => `alias ${alias.aliasName}='${alias.command}'`).join('; '),
                  )
                  this.refresh()
                  vscode.window.showInformationMessage(vscode.l10n.t('Import json file successfully'))
                } else {
                  vscode.window.showInformationMessage(vscode.l10n.t('No any alias need to import'))
                }
              } catch (parseError: any) {
                vscode.window.showErrorMessage(
                  vscode.l10n.t('Fail to resolve json file: {message}', { message: parseError.message }),
                )
              }
            })
          }
        }
        break
    }
  }

  async setDescription(alias: AliasItem) {
    if (!alias.data) {
      return
    }

    const description = await vscode.window.showInputBox({
      placeHolder: vscode.l10n.t('Please enter new description'),
      value: alias.description,
    })

    // cancel input alias
    if (description === undefined) {
      return
    }

    for (const groupName of this.globalState.keys()) {
      const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(groupName))
      const sameAlias = aliases.find((aliasItem) => isSameAlias(alias.data as Alias, aliasItem))

      if (sameAlias) {
        sameAlias.description = description
        this.globalState.update(groupName, aliases)
      }
    }

    this.refresh()
  }

  async addAlias() {
    const alias = await vscode.window.showInputBox({
      placeHolder: vscode.l10n.t(`Please enter new alias. e.g. nv='node -v'`),
      value: undefined,
    })

    // cancel input alias
    if (alias === undefined) {
      return
    }

    if (alias.length === 0) {
      vscode.window.showErrorMessage(vscode.l10n.t('Alias is mandatory to execute this action'))
      return
    }

    const resolvedAlias = resolveAlias(`alias ${alias}`)
    if (!resolvedAlias) {
      vscode.window.showErrorMessage(vscode.l10n.t('Please check the format of the input content'))
      return
    }

    const aliasNames = getAliases(storePath.path).map((alias) => alias.aliasName)
    if (aliasNames.includes(resolvedAlias.aliasName)) {
      vscode.window.showWarningMessage(vscode.l10n.t('Duplicate alias'))
      return
    }

    appendAliasToStoreFile(
      storePath.path,
      `
alias ${alias}`,
    )

    // add this alias to system group
    const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(SYSTEM_ALIAS))
    aliases.push({
      ...resolvedAlias,
      frequency: 0,
      description: '',
    })
    this.globalState.update(SYSTEM_ALIAS, aliases)

    executeCommandInTerminal(`alias ${alias}`)

    this.refresh()
  }

  async deleteAllAlias() {
    const aliases = getAliases(storePath.path)
    if (aliases.length === 0) {
      vscode.window.showWarningMessage(vscode.l10n.t('No alias can be deleted'))
      return
    }

    const selectedAliases = await vscode.window.showQuickPick(
      aliases.map((alias) => alias.aliasName),
      {
        placeHolder: vscode.l10n.t('Please choose the aliases you want to delete'),
        canPickMany: true,
      },
    )

    // cancel pick group
    if (selectedAliases === undefined || selectedAliases.length === 0) {
      return
    }

    if (selectedAliases.length === aliases.length) {
      const text = await vscode.window.showInformationMessage(
        vscode.l10n.t('Are you sure to delete all aliases?'),
        { modal: true },
        vscode.l10n.t('Confirm'),
      )
      // click cancel button
      if (text === undefined) {
        return
      }
    }

    const needDeleteAliases = aliases.filter((alias) => selectedAliases.includes(alias.aliasName))

    executeCommandInTerminal(formatUnaliasCommand(needDeleteAliases))

    deleteAliases(storePath.path, needDeleteAliases)

    // remove aliases under every groups
    for (const groupName of this.globalState.keys()) {
      const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(groupName)).filter((aliasItem) => {
        return !needDeleteAliases.some((alias) => isSameAlias(alias, aliasItem))
      })
      this.globalState.update(groupName, aliases)
    }

    this.refresh()
  }

  deleteAlias(alias: AliasItem) {
    if (!alias.data) {
      return
    }

    // delete specific alias
    deleteAliases(storePath.path, alias.data)

    // remove all aliases under every groups
    for (const groupName of this.globalState.keys()) {
      const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(groupName)).filter(
        (aliasItem) => !isSameAlias(alias.data as Alias, aliasItem),
      )

      this.globalState.update(groupName, aliases)
    }

    executeCommandInTerminal(formatUnaliasCommand([alias.data]))

    this.refresh()
  }

  async renameAliasName(alias: AliasItem) {
    if (!alias.data) {
      return
    }

    const aliasName = await vscode.window.showInputBox({
      placeHolder: vscode.l10n.t('Please enter new alias name'),
      value: alias.data.aliasName,
    })

    // cancel input aliasName
    if (aliasName === undefined) {
      return
    }

    if (aliasName.length === 0) {
      vscode.window.showErrorMessage(vscode.l10n.t('Alias name is mandatory to execute this action'))
      return
    }

    renameAliases(storePath.path, alias.data, {
      aliasName,
      command: alias.data.command,
    })

    // rename one alias under every groups
    for (const groupName of this.globalState.keys()) {
      const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(groupName))
      const sameAlias = aliases.find((aliasItem) => isSameAlias(alias.data as Alias, aliasItem))

      if (sameAlias) {
        sameAlias.aliasName = aliasName
        this.globalState.update(groupName, aliases)
      }
    }

    executeCommandInTerminal(`alias ${aliasName}='${alias.data.command}'`)
    this.refresh()
  }

  async renameAliasCommand(alias: AliasItem) {
    if (!alias.data) {
      return
    }

    const command = await vscode.window.showInputBox({
      placeHolder: vscode.l10n.t('Please enter new alias command'),
      value: alias.data.command,
    })

    // cancel input command
    if (command === undefined) {
      return
    }

    if (command.length === 0) {
      vscode.window.showErrorMessage(vscode.l10n.t('Alias command is mandatory to execute this action'))
      return
    }

    renameAliases(storePath.path, alias.data, {
      aliasName: alias.data.aliasName,
      command,
    })

    // rename one alias under every groups
    for (const groupName of this.globalState.keys()) {
      const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(groupName))
      const sameAlias = aliases.find((aliasItem) => isSameAlias(alias.data as Alias, aliasItem))

      if (sameAlias) {
        sameAlias.command = command
        this.globalState.update(groupName, aliases)
      }
    }

    executeCommandInTerminal(`alias ${alias.data.aliasName}='${command}'`)
    this.refresh()
  }

  runAlias(alias: AliasItem) {
    if (!alias.data) {
      return
    }

    const systemAliases = normalizeAliasesToArray<Alias>(this.globalState.get(alias.group))
    const runAlias = systemAliases.find((systemAlias) => isSameAlias(alias.data as Alias, systemAlias))
    if (runAlias) {
      runAlias.frequency = (runAlias.frequency ?? 0) + 1
      this.globalState.update(alias.group, systemAliases)

      alias.tooltip = setTooltip(runAlias.frequency)
      this.refresh(alias)
    }

    executeCommandInTerminal(alias.data.aliasName)
  }

  copyAlias(alias: AliasItem) {
    if (!alias.data) {
      return
    }

    const { aliasName, command } = alias.data
    const content = `alias ${aliasName}='${command}'`

    vscode.env.clipboard.writeText(content)
    vscode.window.showInformationMessage(vscode.l10n.t('Alias has been added to the clipboard Successfully'))
  }

  copyAllAlias(alias: AliasItem) {
    const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(alias.groupName))
    if (aliases.length === 0) {
      vscode.window.showWarningMessage(vscode.l10n.t('No alias'))
      return
    }

    const content = aliases.map(({ aliasName, command }) => `alias ${aliasName}='${command}'`).join('\n')

    vscode.env.clipboard.writeText(content)
    vscode.window.showInformationMessage(vscode.l10n.t('Alias has been added to the clipboard Successfully'))
  }

  removeFromCurrentGroup(alias: AliasItem) {
    if (!alias.data) {
      return
    }

    const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(alias.group)).filter(
      (aliasItem) => !isSameAlias(alias.data as Alias, aliasItem),
    )

    this.globalState.update(alias.group, aliases)

    this.refresh()
  }

  async addToGroup(alias: AliasItem) {
    if (!alias.data) {
      return
    }

    const groups = this.globalState.keys().filter((key) => ![SYSTEM_ALIAS, alias.group].includes(key))
    if (groups.length === 0) {
      vscode.window.showWarningMessage('No any group can be added')
      return
    }

    const selectedGroup = await vscode.window.showQuickPick(groups, {
      placeHolder: vscode.l10n.t('Please choose a group to add'),
    })

    // cancel pick group
    if (selectedGroup === undefined) {
      return
    }

    const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(selectedGroup))
    aliases.push(alias.data)
    this.globalState.update(selectedGroup, aliases)

    this.refresh()
  }

  deleteGroup(alias: AliasItem) {
    this.globalState.update(alias.group, undefined)
    this.refresh()
  }

  async renameGroup(alias: AliasItem) {
    const group = await vscode.window.showInputBox({
      placeHolder: vscode.l10n.t('Please enter new group'),
      value: alias.group,
    })

    // cancel input group
    if (group === undefined) {
      return
    }

    if (group.length === 0) {
      vscode.window.showErrorMessage(vscode.l10n.t('Group is mandatory to execute this action'))
      return
    }

    const hasSameGroup = this.globalState.keys().includes(group)
    if (hasSameGroup) {
      vscode.window.showErrorMessage(vscode.l10n.t('Duplicate group'))
      return
    }

    const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(alias.group))
    this.globalState.update(alias.group, undefined)
    this.globalState.update(group, aliases)

    this.refresh()
  }

  async addNewGroup() {
    const group = await vscode.window.showInputBox({
      placeHolder: vscode.l10n.t('Please enter new group'),
      value: undefined,
    })

    // cancel input group
    if (group === undefined) {
      return
    }

    if (group.length === 0) {
      vscode.window.showErrorMessage(vscode.l10n.t('Group is mandatory to execute this action'))
      return
    }

    const hasSameGroup = this.globalState.keys().includes(group)
    if (hasSameGroup) {
      vscode.window.showErrorMessage(vscode.l10n.t('Duplicate group'))
      return
    }

    this.globalState.update(group, [])

    this.refresh()
  }

  sortByAlphabet(alias: AliasItem) {
    const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(alias.group))

    if (aliases.length === 0) {
      return
    }

    aliases.sort((a, b) => a.aliasName.toLowerCase().localeCompare(b.aliasName.toLowerCase()))
    this.globalState.update(alias.group, aliases)

    this.refresh()
  }

  sortByFrequency(alias: AliasItem) {
    const aliases = normalizeAliasesToArray<Alias>(this.globalState.get(alias.group))

    if (aliases.length === 0) {
      return
    }

    aliases.sort((a, b) => (a.frequency ?? 0) - (b.frequency ?? 0))
    this.globalState.update(alias.group, aliases)

    this.refresh()
  }

  getTreeItem(element: AliasItem): vscode.TreeItem {
    return element
  }

  getChildren(element?: AliasItem): Thenable<AliasItem[]> {
    if (element) {
      return Promise.resolve(element.children)
    }

    return Promise.resolve(this.getAliasTree())
  }

  private getAliasTree(): AliasItem[] {
    this.globalState.update(SYSTEM_ALIAS, getAliases(storePath.path))
    const aliasTree = this.globalState.keys().reduce((aliases: AliasItem[], key: string) => {
      const children = normalizeAliasesToArray<Alias>(this.globalState.get(key)).map((alias) => {
        const { aliasName, command, description = '' } = alias
        return new AliasItem(`${aliasName} = '${command}'`, alias, key, description, [], true)
      })

      aliases.push(new AliasItem(key, undefined, key, '', children, false))
      return aliases
    }, [])

    return aliasTree
  }
}
class AliasItem extends vscode.TreeItem {
  contextValue = 'alias_child'
  description = ''
  data: Alias | undefined = undefined
  groupName: string

  constructor(
    public readonly label: string,
    public readonly alias: Alias | undefined,
    public readonly group: string,
    public readonly remark: string,
    public readonly children: AliasItem[] = [],
    public readonly isLeafNode: boolean = true,
  ) {
    super(
      label,
      isNonEmptyArray(children) ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None,
    )

    this.data = alias
    this.groupName = group
    this.description = remark

    this.tooltip = setTooltip(this.alias?.frequency)

    if (!isLeafNode) {
      // parent node
      this.contextValue = label === SYSTEM_ALIAS ? 'alias_system_parent' : 'alias_parent'
    } else {
      // leaf node
      this.contextValue = group === SYSTEM_ALIAS ? 'alias_system_child' : 'alias_child'
    }
  }
}

export function deactivate() {}
