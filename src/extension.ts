import * as vscode from 'vscode';
import os from 'node:os';
import path from 'node:path';
import { appendAliasToStoreFile, deleteAliases, getAliases, renameAliases, getCopyAliases } from './aliases';
import {
  ALIAS_IS_NOT_EMPTY,
  COPY_ALIAS_SUCCESSFULLY,
  CREATE_ALIAS_PLACEHOLDER,
  DUPLICATE_ALIAS_NAME,
  NEED_CHECK_THE_FORMAT,
  NO_ANY_ALIAS,
  SYSTEM_ALIAS,
} from './constants';
import { isNonEmptyArray } from 'rattail';
import { resolveAlias } from './utils';
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

  context.subscriptions.push(vscode.commands.registerCommand('aliasView.refresh', () => aliasView.refresh()));

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

  refresh() {
    this._onDidChangeTreeData.fire();
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

      this.refresh();
      return;
    }

    // delete specific alias
    deleteAliases(alias.data);

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

    const activeTerminal = vscode.window.activeTerminal ?? vscode.window.createTerminal();
    activeTerminal.show();
    activeTerminal.sendText(`alias ${alias.data.aliasName}='${command}'`);

    this.refresh();
  }

  runAlias(alias: AliasItem) {
    if (!alias.data) {
      return;
    }

    const activeTerminal = vscode.window.activeTerminal ?? vscode.window.createTerminal();
    activeTerminal.show();
    activeTerminal.sendText(alias.data.aliasName);
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
        return new AliasItem(`${aliasName} = '${command}'`, [], alias);
      });

      aliases.push(new AliasItem(key, children, undefined, false));
      return aliases;
    }, []);

    return aliasTree;
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
