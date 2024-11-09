import * as vscode from 'vscode';
import { appendAliasToZshrc, getAliases } from './aliases';
import {
  ALIAS_IS_NOT_EMPTY,
  CREATE_ALIAS_PLACEHOLDER,
  DUPLICATE_ALIAS_NAME,
  NEED_CHECK_THE_FORMAT,
  SYSTEM_ALIAS,
} from './constants';
import { isEmpty, isNonEmptyArray } from 'rattail';
import { getAliasName } from './utils';

export function activate(context: vscode.ExtensionContext) {
  const aliasView = new AliasView();

  context.subscriptions.push(vscode.window.registerTreeDataProvider('aliasView', aliasView));

  context.subscriptions.push(vscode.commands.registerCommand('aliasView.refresh', () => aliasView.refresh()));

  context.subscriptions.push(vscode.commands.registerCommand('aliasView.add', () => aliasView.addAlias()));
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

    appendAliasToZshrc(alias!);

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
    const children = getAliases().map((alias) => {
      const { key, value } = alias;
      return new AliasItem(`${key} = '${value}'`);
    });

    return [new AliasItem(SYSTEM_ALIAS, children)];
  }
}
class AliasItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly children: AliasItem[] = [],
  ) {
    super(
      label,
      isNonEmptyArray(children) ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None,
    );
  }
}

export function deactivate() {}
