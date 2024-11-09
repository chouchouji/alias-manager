import * as vscode from 'vscode';
import { getAliases } from './aliases';
import { SYSTEM_ALIAS } from './constants';
import { isNonEmptyArray } from 'rattail';

export function activate(context: vscode.ExtensionContext) {
  const aliasView = new AliasView();

  context.subscriptions.push(vscode.window.registerTreeDataProvider('aliasView', aliasView));

  context.subscriptions.push(
    vscode.commands.registerCommand('aliasView.refresh', () => aliasView.refresh())
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
    const aliases = getAliases();

    const children = aliases.map((alias) => {
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
