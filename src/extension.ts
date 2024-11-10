import * as vscode from 'vscode';
import os from 'node:os';
import path from 'node:path';
import { appendAliasToStoreFile, deleteAliases, getAliases, renameAliases } from './aliases';
import {
  ALIAS_IS_NOT_EMPTY,
  CREATE_ALIAS_PLACEHOLDER,
  DUPLICATE_ALIAS_NAME,
  NEED_CHECK_THE_FORMAT,
  SYSTEM_ALIAS,
} from './constants';
import { isEmpty, isNonEmptyArray } from 'rattail';
import { getAliasName } from './utils';
import { Alias } from './types';
import storePath from './path';

export function activate(context: vscode.ExtensionContext) {
  // set default store path
  storePath.path = path.join(os.homedir(), '.zshrc');

  const aliasView = new AliasView();

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

  context.subscriptions.push(vscode.commands.registerCommand('aliasView.refresh', () => aliasView.refresh()));

  context.subscriptions.push(vscode.commands.registerCommand('aliasView.add', () => aliasView.addAlias()));

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.delete', (item: AliasItem) => aliasView.deleteAlias(item)),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.rename', (item: AliasItem) => aliasView.renameAlias(item)),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.run', (item: AliasItem) => aliasView.runAlias(item)),
  );
}

class AliasView implements vscode.TreeDataProvider<AliasItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<AliasItem | undefined | null | void> = new vscode.EventEmitter<
    AliasItem | undefined | null | void
  >();

  readonly onDidChangeTreeData: vscode.Event<AliasItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh() {
    this._onDidChangeTreeData.fire();
  }

  async addAlias() {
    const alias = await vscode.window.showInputBox({
      placeHolder: CREATE_ALIAS_PLACEHOLDER,
      value: '',
    });

    if (isEmpty(alias)) {
      vscode.window.showErrorMessage(ALIAS_IS_NOT_EMPTY);
      return;
    }

    const aliasName = getAliasName(alias!);
    if (!aliasName) {
      vscode.window.showErrorMessage(NEED_CHECK_THE_FORMAT);
      return;
    }

    const keys = getAliases().map((alias) => alias.key);
    if (keys.includes(aliasName)) {
      vscode.window.showWarningMessage(DUPLICATE_ALIAS_NAME);
      return;
    }

    appendAliasToStoreFile(alias!);

    this.refresh();
  }

  deleteAlias(alias: AliasItem) {
    // delete all aliases
    if (!alias.data) {
      deleteAliases();
      this.refresh();
      return;
    }

    // delete specific alias
    deleteAliases(alias.data);
    this.refresh();
  }

  async renameAlias(alias: AliasItem) {
    if (!alias.data) {
      return;
    }

    const command = await vscode.window.showInputBox({
      placeHolder: CREATE_ALIAS_PLACEHOLDER,
      value: alias.data.value,
    });

    if (isEmpty(command)) {
      vscode.window.showErrorMessage(ALIAS_IS_NOT_EMPTY);
      return;
    }

    renameAliases(alias.data, command!);
    this.refresh();
  }

  runAlias(alias: AliasItem) {
    if (!alias.data) {
      return;
    }

    const activeTerminal = vscode.window.activeTerminal ?? vscode.window.createTerminal();
    activeTerminal.show();
    activeTerminal.sendText(alias.data.key);
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
    const children = getAliases().map((alias) => {
      const { key, value } = alias;
      return new AliasItem(`${key} = '${value}'`, [], alias);
    });

    return [new AliasItem(SYSTEM_ALIAS, children, undefined, false)];
  }
}
class AliasItem extends vscode.TreeItem {
  contextValue = 'alias_child';
  data: Alias | undefined = undefined;

  constructor(
    public readonly label: string,
    public readonly children: AliasItem[] = [],
    public readonly alias: Alias | undefined,
    public readonly isLeafNode: boolean = true,
  ) {
    super(
      label,
      isNonEmptyArray(children) ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None,
    );

    this.data = alias;

    if (!isLeafNode) {
      this.contextValue = 'alias_parent';
    }
  }
}

export function deactivate() {}
