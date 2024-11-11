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

![add](https://github.com/user-attachments/assets/1af0175f-c5b2-4b1b-a5bb-26f48688f73f)

### Rename Alias

It supports rename an alias.

![rename](https://github.com/user-attachments/assets/a2c71fc5-0dc0-4873-9427-7bd509193b5b)

### Delete Alias(es)

It supports delete all aliases or one alias.

![delete](https://github.com/user-attachments/assets/5817a6e2-78ab-48bb-9a89-4bbb2d4379dc)

### Run Alias

Click `run` button, it will activate terminal and exec that command.

If the terminal shows error like `command not found`, close terminal and try again.

![run](https://github.com/user-attachments/assets/ad3f5b4d-f9d8-4eda-8b48-1b6f6a2705c5)

### Set Store Path

The default store path is `${homedir}/.zshrc`, like `/Users/xxx/.zshrc`. If you want to custom your alias store path, modify it by `Setting/Extensions/Alias Manager` 

![store-path](https://github.com/user-attachments/assets/5508beeb-1983-45d9-bbcd-4a0201205a23)

## Feedback

If you encounter problems or have good ideas and suggestions, please [report](https://github.com/chouchouji/alias-manager/issues) here.

## ChangeLog

[ChangeLog](CHANGELOG.md)

## License

[MIT](LICENSE)
