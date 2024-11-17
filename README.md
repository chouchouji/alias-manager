<div align="center">
  <img src="https://github.com/user-attachments/assets/5ccef482-e2f6-410d-bcd5-857450e5c326" alt="logo" />
  <h1>Alias Manager</h1>
  <p>A vscode extension used to manage your system aliases</p>
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

## Usage

### Create Alias

You can create a new alias.

> [!TIP]
> Please ensure that you have understood how to create a right alias.
> Don't allow to add `duplicate` alias.

![add](https://github.com/user-attachments/assets/1af0175f-c5b2-4b1b-a5bb-26f48688f73f)

### Rename Alias

It supports renaming an alias.

![rename](https://github.com/user-attachments/assets/a2c71fc5-0dc0-4873-9427-7bd509193b5b)

### Delete Alias(es)

It supports deleting all aliases or one alias.

![delete](https://github.com/user-attachments/assets/5817a6e2-78ab-48bb-9a89-4bbb2d4379dc)

### Run Alias

Click `run` button, it will activate terminal and execute that command.

> [!TIP]
> If the terminal shows error like `command not found`, reopen terminal and try again.

![run](https://github.com/user-attachments/assets/ad3f5b4d-f9d8-4eda-8b48-1b6f6a2705c5)

### Copy Alias

It supports copying an alias or all aliases.

![copy](https://github.com/user-attachments/assets/b9f4522e-4b87-4ba5-892c-1aafbbe0f187)

### Group Alias

It support creating, deleting and renaming a new group, adding an alias to a group and removing an alias from a group.

All aliases are included in `System Aliases` which is data source. You can group different aliases by creating different groups. This is very helpful for you to quickly find aliases and operate aliases.

#### Create, Delete And Rename

![create-group](https://github.com/user-attachments/assets/1b9e6e22-3308-4ff6-9811-0c91ac416d7a)

#### Add Or Remove An Alias

![move-group](https://github.com/user-attachments/assets/9079a8cc-3be3-42a2-8c09-5b60aab64c07)

### Sort Alias

![sort](https://github.com/user-attachments/assets/fb904718-c01d-416a-9c7a-4f6795cee2eb)

### Set Description 

You can set description for every alias. Clear input box to hide the description. 

![description](https://github.com/user-attachments/assets/930dcf4f-6e62-4216-91ba-ca9d1de5c369)

### Set Store Path

The default store path is `${homedir}/.zshrc`, like `/Users/chouchouji/.zshrc`. If you want to custom your alias store path, modify it by `Setting/Extensions/Alias Manager` 

![store-path](https://github.com/user-attachments/assets/9db44131-99a9-4aa7-b83d-2f0352488553)


## Internationalization

The default language is `english`. If you have added [chinese vscode extension](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans) in vscode extensions, the language of `alias manager` extension will be changed to chinese automatically after restarting vscode.

## Feedback

If you encounter problems or have good ideas and suggestions, please [report](https://github.com/chouchouji/alias-manager/issues) here.

## ChangeLog

[ChangeLog](CHANGELOG.md)

## License

[MIT](LICENSE)
