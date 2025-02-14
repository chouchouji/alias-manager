<div align="center">
  <img src="https://github.com/user-attachments/assets/0142f86f-7d55-4708-a1de-0757188ac913" alt="logo" />
  <h1>Alias Manager</h1>
  <p>A vscode extension used to manage your system aliases</p>
  <p>
    <span>English</span> | 
    <a href="https://github.com/chouchouji/alias-manager/blob/main/README.zh-CN.md">中文介绍</a>
  </p>
  <p>
    <img src="https://img.shields.io/github/package-json/v/chouchouji/alias-manager" alt="version">
    <img src="https://img.shields.io/github/stars/chouchouji/alias-manager" alt="stars">
    <img src="https://img.shields.io/github/license/chouchouji/alias-manager" alt="license">
  </p>
</div>

---

## Features

- 🎨 &nbsp;Support creating, deleting, renaming, copying and running system alias
- 📦 &nbsp;Support grouping aliases
- 🔠 &nbsp;Support sorting aliases by frequency or alphabet
- 📝 &nbsp;Support setting description for every alias
- 🔧 &nbsp;Support custom path that used to store aliases
- 🌍 &nbsp;Support internationalization
- 📚 &nbsp;Support data export and import

## TIP

> [!TIP]
> It does not support `windows`. If you have interest to adapt, welcome to submit pr.

## Intro

### Basic Usage

#### Create Alias

You can create a new alias by `+` icon. It will show an input where you can set your favorite alias.

The format of alias likes `gpl='git pull'`, `gpl` is alias name, `git pull` is alias command.

![add](https://github.com/user-attachments/assets/1af0175f-c5b2-4b1b-a5bb-26f48688f73f)

#### Run Alias

Click `run` button, it will activate terminal and execute that command. Or, input the alias in terminal, the command will be executed.

> [!TIP]
> If the terminal shows error like `command not found`, reopen terminal and try again.

![run](https://github.com/user-attachments/assets/ad3f5b4d-f9d8-4eda-8b48-1b6f6a2705c5)

### Advanced Usage

#### Rename Alias

It supports renaming alias name and command for an alias.

![rename](https://github.com/user-attachments/assets/088510aa-d8dc-487b-bc17-a408579fa9d2)

#### Delete Alias

It supports deleting all aliases or one alias.

![delete](https://github.com/user-attachments/assets/5817a6e2-78ab-48bb-9a89-4bbb2d4379dc)

#### Copy Alias

It supports copying an alias or all aliases in one group.

![copy](https://github.com/user-attachments/assets/23991d48-8de3-4a49-9dd9-f6ef6a6dd2b8)

#### Group Alias

It support creating, deleting and renaming a new group, adding an alias to a group and removing an alias from a group.

All aliases are included in `System Aliases` which is data source. You can group different aliases by creating different groups. This is very helpful for you to quickly find aliases and operate aliases.

##### Create, Delete Or Rename Group

> [!TIP]
> Don't allow to create `duplicate` group.

![create-group](https://github.com/user-attachments/assets/1b9e6e22-3308-4ff6-9811-0c91ac416d7a)

##### Add Alias To Group Or Remove Alias From Group

![move-group](https://github.com/user-attachments/assets/9079a8cc-3be3-42a2-8c09-5b60aab64c07)

#### Sort Alias

![sort](https://github.com/user-attachments/assets/fb904718-c01d-416a-9c7a-4f6795cee2eb)

#### Set Description

You can set description for every alias. Clear input box to hide the description.

![description](https://github.com/user-attachments/assets/930dcf4f-6e62-4216-91ba-ca9d1de5c369)

#### Set Store Path

The default store path is `{homedir}/.zshrc`, like `~/.zshrc` or `/Users/chouchouji/.zshrc`. If you want to custom your alias store path, modify it by `Setting/Extensions/Alias Manager`

![store-path](https://github.com/user-attachments/assets/2f3e5dfd-b97b-45d1-bb35-46c10fb89e80)

## Sync Data

This extension supports data synchronization.

### Export Data

You can choose to copy one or all alias or export all alias data to json file.

![export](https://github.com/user-attachments/assets/864a18cb-ea2a-4ac0-a0bc-86081ecae695)

### Import Data

You can import data by clipboard or json file.

#### clipboard

![clipboard](https://github.com/user-attachments/assets/99249261-288c-4db8-9e88-81eaf17c3497)

#### json

![json](https://github.com/user-attachments/assets/0a51dc7c-f937-4b96-b0ac-2a1ee6a8a18c)

## Internationalization

The default language is `english`. If you have added [chinese vscode extension](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans) in vscode extensions, the language of `alias manager` extension will be changed to chinese automatically after restarting vscode.

## Feedback

If you encounter problems or have good ideas and suggestions, please [report](https://github.com/chouchouji/alias-manager/issues) here.

## Contributors

<a href="https://github.com/chouchouji/alias-manager/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chouchouji/alias-manager" alt="contributors" />
</a>

## ChangeLog

[ChangeLog](CHANGELOG.md)

## License

[MIT](LICENSE)
