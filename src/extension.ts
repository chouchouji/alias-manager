import * as vscode from 'vscode';
import os from 'node:os';
import path from 'node:path';
import { appendAliasToStoreFile, deleteAliases, getAliases, renameAliases, getCopyAliases } from './aliases';
import {
  ALIAS_IS_NOT_EMPTY,
  CHOOSE_GROUP_PLACEHOLDER,
  COPY_ALIAS_SUCCESSFULLY,
  CREATE_ALIAS_PLACEHOLDER,
  CREATE_GROUP_PLACEHOLDER,
  DUPLICATE_ALIAS_NAME,
  DUPLICATE_GROUP_NAME,
  GROUP_IS_NOT_EMPTY,
  NEED_CHECK_THE_FORMAT,
  NO_ANY_ALIAS,
  SYSTEM_ALIAS,
} from './constants';
import { isNonEmptyArray } from 'rattail';
import { resolveAlias, isSameAlias } from './utils';
import { Alias } from './types';
import storePath from './path';

export function activate(context: vscode.ExtensionContext) {
  // set default store path
  storePath.path = path.join(os.homedir(), '.zshrc');

  const globalState = context.globalState;

  const aliasView = new AliasView(globalState);

  context.subscriptions.push(
    // watch store path
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('alias-manager.defaultStorePath')) {
        const defaultStorePath = vscode.workspace.getConfiguration('alias-manager').get<string>('defaultStorePath');
        if (defaultStorePath) {
          storePath.path = defaultStorePath;
          aliasView.refresh();
        }
      }
    }),
  );

  context.subscriptions.push(vscode.window.registerTreeDataProvider('aliasView', aliasView));

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.refresh', (alias?: AliasItem) => aliasView.refresh(alias)),
  );

  context.subscriptions.push(vscode.commands.registerCommand('aliasView.add', () => aliasView.addAlias()));

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.delete', (alias: AliasItem) => aliasView.deleteAlias(alias)),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.rename', (alias: AliasItem) => aliasView.renameAlias(alias)),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.run', (alias: AliasItem) => aliasView.runAlias(alias)),
  );

  context.subscriptions.push(vscode.commands.registerCommand('aliasView.copyAll', () => aliasView.copyAllAlias()));

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.copy', (alias: AliasItem) => aliasView.copyAlias(alias)),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.renameGroup', (alias: AliasItem) => aliasView.renameGroup(alias)),
  );

  context.subscriptions.push(vscode.commands.registerCommand('aliasView.newGroup', () => aliasView.addNewGroup()));

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.deleteGroup', (alias: AliasItem) => aliasView.deleteGroup(alias)),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.addToGroup', (alias: AliasItem) => aliasView.addToGroup(alias)),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.removeFromCurrentGroup', (alias: AliasItem) =>
      aliasView.removeFromCurrentGroup(alias),
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.sortByAlphabet', (alias: AliasItem) => aliasView.sortByAlphabet(alias)),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.sortByFrequency', (alias: AliasItem) =>
      aliasView.sortByFrequency(alias),
    ),
  );
}

class AliasView implements vscode.TreeDataProvider<AliasItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<AliasItem | undefined | null | void> = new vscode.EventEmitter<
    AliasItem | undefined | null | void
  >();

  readonly onDidChangeTreeData: vscode.Event<AliasItem | undefined | null | void> = this._onDidChangeTreeData.event;

  globalState: vscode.Memento;

  constructor(globalState: vscode.Memento) {
    this.globalState = globalState;
    this.globalState.update(SYSTEM_ALIAS, getAliases());
  }

  refresh(alias?: AliasItem) {
    this._onDidChangeTreeData.fire(alias);
  }

  async addAlias() {
    const alias = await vscode.window.showInputBox({
      placeHolder: CREATE_ALIAS_PLACEHOLDER,
      value: undefined,
    });

    // cancel input alias
    if (alias === undefined) {
      return;
    }

    if (!alias.length) {
      vscode.window.showErrorMessage(ALIAS_IS_NOT_EMPTY);
      return;
    }

    const resolvedAlias = resolveAlias(`alias ${alias}`);
    if (!resolvedAlias) {
      vscode.window.showErrorMessage(NEED_CHECK_THE_FORMAT);
      return;
    }

    const aliasNames = getAliases().map((alias) => alias.aliasName);
    if (aliasNames.includes(resolvedAlias.aliasName)) {
      vscode.window.showWarningMessage(DUPLICATE_ALIAS_NAME);
      return;
    }

    appendAliasToStoreFile(alias);

    // add this alias to system group
    const aliases = this.globalState.get(SYSTEM_ALIAS) as Alias[];
    this.globalState.update(SYSTEM_ALIAS, [...aliases, { ...resolvedAlias, frequency: 0 }]);

    const activeTerminal = vscode.window.activeTerminal ?? vscode.window.createTerminal();
    activeTerminal.show();
    activeTerminal.sendText(`alias ${alias}`);

    this.refresh();
  }

  deleteAlias(alias: AliasItem) {
    // delete all aliases
    if (!alias.data) {
      const commands = getAliases().reduce((acc, alias) => {
        return (acc += ` ${alias.aliasName}`);
      }, 'unalias');
      const activeTerminal = vscode.window.activeTerminal ?? vscode.window.createTerminal();
      activeTerminal.show();
      activeTerminal.sendText(commands);

      deleteAliases();

      // remove all aliases under every groups
      this.globalState.keys().forEach((group) => {
        this.globalState.update(group, []);
      });

      this.refresh();
      return;
    }

    // delete specific alias
    deleteAliases(alias.data);

    // remove all aliases under every groups
    this.globalState.keys().forEach((groupName) => {
      const aliases = (this.globalState.get(groupName) as Alias[]).filter((aliasItem) => {
        return !isSameAlias(alias.data!, aliasItem);
      });

      this.globalState.update(groupName, aliases);
    });

    const activeTerminal = vscode.window.activeTerminal ?? vscode.window.createTerminal();
    activeTerminal.show();
    activeTerminal.sendText(`unalias ${alias.data.aliasName}`);

    this.refresh();
  }

  async renameAlias(alias: AliasItem) {
    if (!alias.data) {
      return;
    }

    const command = await vscode.window.showInputBox({
      placeHolder: CREATE_ALIAS_PLACEHOLDER,
      value: alias.data.command,
    });

    // cancel input command
    if (command === undefined) {
      return;
    }

    if (!command.length) {
      vscode.window.showErrorMessage(ALIAS_IS_NOT_EMPTY);
      return;
    }

    renameAliases(alias.data, command);

    const { aliasName, frequency } = alias.data;
    // rename one alias under every groups
    this.globalState.keys().forEach((groupName) => {
      const aliases = this.globalState.get(groupName) as Alias[];
      const hasSameAlias = aliases.find((aliasItem) => isSameAlias(alias.data!, aliasItem));

      if (hasSameAlias) {
        const restAliases = aliases.filter((aliasItem) => !isSameAlias(alias.data!, aliasItem));
        restAliases.push({ aliasName, command, frequency });
        this.globalState.update(groupName, restAliases);
      }
    });

    const activeTerminal = vscode.window.activeTerminal ?? vscode.window.createTerminal();
    activeTerminal.show();
    activeTerminal.sendText(`alias ${alias.data.aliasName}='${command}'`);

    this.refresh();
  }

  runAlias(alias: AliasItem) {
    if (!alias.data) {
      return;
    }

    const systemAliases = this.globalState.get(alias.group) as Alias[];
    const runAlias = systemAliases.find((systemAlias) => isSameAlias(alias.data!, systemAlias));
    if (runAlias) {
      runAlias.frequency = (runAlias.frequency ?? 0) + 1;
      this.globalState.update(alias.group, systemAliases);
    }

    const activeTerminal = vscode.window.activeTerminal ?? vscode.window.createTerminal();
    activeTerminal.show();
    const { aliasName } = alias.data;
    activeTerminal.sendText(aliasName);
  }

  copyAlias(alias: AliasItem) {
    if (!alias.data) {
      return;
    }

    const { aliasName, command } = alias.data;
    const content = `alias ${aliasName}='${command}'`;

    vscode.env.clipboard.writeText(content);
    vscode.window.showInformationMessage(COPY_ALIAS_SUCCESSFULLY);
  }

  copyAllAlias() {
    const alias = getCopyAliases();
    if (!alias) {
      vscode.window.showWarningMessage(NO_ANY_ALIAS);
      return;
    }

    vscode.env.clipboard.writeText(alias);
    vscode.window.showInformationMessage(COPY_ALIAS_SUCCESSFULLY);
  }

  removeFromCurrentGroup(alias: AliasItem) {
    if (!alias.data) {
      return;
    }

    const aliases = (this.globalState.get(alias.group) as Alias[]).filter(
      (aliasItem) => !isSameAlias(alias.data!, aliasItem),
    );

    this.globalState.update(alias.group, aliases);

    this.refresh();
  }

  async addToGroup(alias: AliasItem) {
    if (!alias.data) {
      return;
    }

    const selectedGroup = await vscode.window.showQuickPick(
      this.globalState.keys().filter((key) => ![SYSTEM_ALIAS, alias.group].includes(key)),
      { placeHolder: CHOOSE_GROUP_PLACEHOLDER },
    );

    // cancel pick group
    if (selectedGroup === undefined) {
      return;
    }

    const aliases = (this.globalState.get(selectedGroup) ?? []) as Alias[];
    this.globalState.update(selectedGroup, [...aliases, alias.data]);

    this.refresh();
  }

  deleteGroup(group: AliasItem) {
    this.globalState.update(group.label, undefined);
    this.refresh();
  }

  async renameGroup(alias: AliasItem) {
    const group = await vscode.window.showInputBox({
      placeHolder: CREATE_GROUP_PLACEHOLDER,
      value: alias.group,
    });

    // cancel input group
    if (group === undefined) {
      return;
    }

    if (!group.length) {
      vscode.window.showErrorMessage(GROUP_IS_NOT_EMPTY);
      return;
    }

    const hasSameGroup = this.globalState.keys().includes(group);
    if (hasSameGroup) {
      vscode.window.showErrorMessage(DUPLICATE_GROUP_NAME);
      return;
    }

    const aliases = this.globalState.get(alias.group);
    this.globalState.update(alias.group, undefined);
    this.globalState.update(group, aliases);

    this.refresh();
  }

  async addNewGroup() {
    const group = await vscode.window.showInputBox({
      placeHolder: CREATE_GROUP_PLACEHOLDER,
      value: undefined,
    });

    // cancel input group
    if (group === undefined) {
      return;
    }

    if (!group.length) {
      vscode.window.showErrorMessage(GROUP_IS_NOT_EMPTY);
      return;
    }

    const hasSameGroup = this.globalState.keys().includes(group);
    if (hasSameGroup) {
      vscode.window.showErrorMessage(DUPLICATE_GROUP_NAME);
      return;
    }

    this.globalState.update(group, []);

    this.refresh();
  }

  sortByAlphabet(alias: AliasItem) {
    const aliases = this.globalState.get(alias.group) as Alias[];
    aliases.sort((a, b) => a.aliasName.toLowerCase().localeCompare(b.aliasName.toLowerCase()));

    this.globalState.update(alias.group, aliases);

    this.refresh();
  }

  sortByFrequency(alias: AliasItem) {
    const aliases = this.globalState.get(alias.group) as Alias[];
    aliases.sort((a, b) => (a.frequency ?? 0) - (b.frequency ?? 0));

    this.globalState.update(alias.group, aliases);

    this.refresh();
  }

  getTreeItem(element: AliasItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: AliasItem): Thenable<AliasItem[]> {
    if (element) {
      return Promise.resolve(element.children);
    } else {
      return Promise.resolve(this.getAliasTree());
    }
  }

  private getAliasTree(): AliasItem[] {
    const aliasTree = this.globalState.keys().reduce((aliases: AliasItem[], key: string) => {
      const children = (this.globalState.get(key) as Alias[]).map((alias) => {
        const { aliasName, command } = alias;
        return new AliasItem(`${aliasName} = '${command}'`, [], alias, true, key);
      });

      aliases.push(new AliasItem(key, children, undefined, false, key));
      return aliases;
    }, []);

    return aliasTree;
  }
}
class AliasItem extends vscode.TreeItem {
  contextValue = 'alias_child';
  data: Alias | undefined = undefined;
  groupName: string;

  constructor(
    public readonly label: string,
    public readonly children: AliasItem[] = [],
    public readonly alias: Alias | undefined,
    public readonly isLeafNode: boolean = true,
    public readonly group: string,
  ) {
    super(
      label,
      isNonEmptyArray(children) ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None,
    );

    this.data = alias;
    this.groupName = group;

    if (!isLeafNode) {
      // parent node
      this.contextValue = label === SYSTEM_ALIAS ? 'alias_system_parent' : 'alias_parent';
    } else {
      // leaf node
      this.contextValue = group === SYSTEM_ALIAS ? 'alias_system_child' : 'alias_child';
    }
  }
}

export function deactivate() {}
