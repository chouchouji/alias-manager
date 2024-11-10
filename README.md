<div align="center">
  <img src="https://github.com/user-attachments/assets/723ef410-5dc0-46e6-966f-fa740107e856" alt="logo" />
  <h1>Alias Manager</h1>
  <p>A tool used to manage your system aliases</p>
  <p>
    <img src="https://img.shields.io/github/package-json/v/chouchouji/alias-manager" alt="version">
    <img src="https://img.shields.io/github/stars/chouchouji/alias-manager" alt="stars">
    <img src="https://img.shields.io/github/license/chouchouji/alias-manager" alt="license">
  </p>
</div>

---

## Features

- 🎨 &nbsp; Support create, delete, rename and run system alias
- 📦 &nbsp; Support custom path that used to store aliases

## Usage

### Create Alias

You can create a new alias.

> [!TIP]
> Please ensure that you have understood how to create a right alias.
> Don't allow to add `duplicate` alias.

![create-alias](https://github.com/user-attachments/assets/29caefb6-fcbc-4324-b4a6-d3a8d6d30d82)

### Rename Alias

It supports rename an alias.

![rename-alias](https://github.com/user-attachments/assets/1bd4e199-5476-4d8e-b126-7a62d5b35201)

### Delete Alias(es)

It supports delete all aliases or one alias.

![delete-alias](https://github.com/user-attachments/assets/c61cd617-526b-45fb-9cf5-78d7eecbaa4e)

### Run Alias

Click `run` button, it will activate terminal and exec that command.

If the terminal shows error like `command not found`, close terminal and try again.

![run-alias](https://github.com/user-attachments/assets/eb0cda22-cea0-4eed-a8d5-100a2a95a66b)

### Set Store Path

The default store path is `${homedir}/.zshrc`, like `/Users/xxx/.zshrc`. If you want to custom your alias store path, modify it by `Setting/Extensions/Alias Manager` 

![store-path](https://github.com/user-attachments/assets/5508beeb-1983-45d9-bbcd-4a0201205a23)

## Feedback

If you encounter problems or have good ideas and suggestions, please [report](https://github.com/chouchouji/alias-manager/issues) here.

## ChangeLog

[ChangeLog](CHANGELOG.md)

## License

[MIT](LICENSE)
