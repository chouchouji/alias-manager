<div align="center">
  <img src="https://github.com/user-attachments/assets/5ccef482-e2f6-410d-bcd5-857450e5c326" alt="logo" />
  <h1>Alias Manager</h1>
  <p>管理系统别名的vscode插件</p>
  <p>
    <a href="https://github.com/chouchouji/alias-manager/blob/main/README.md">English Introduction</a>
  </p>
  <p>
    <img src="https://img.shields.io/github/package-json/v/chouchouji/alias-manager" alt="version">
    <img src="https://img.shields.io/github/stars/chouchouji/alias-manager" alt="stars">
    <img src="https://img.shields.io/github/license/chouchouji/alias-manager" alt="license">
  </p>
</div>

---

## 特性

- 🎨 &nbsp;支持创建、删除、重命名、复制和运行别名
- 📦 &nbsp;支持别名分组
- 🔠 &nbsp;支持按使用频率和字母排序
- 📝 &nbsp;支持为别名添加备注
- 🔧 &nbsp;支持自定义存储别名的路径
- 🌍 &nbsp;支持国际化

## 使用指南

> [!TIP]
> 此插件暂不支持 `windows`，如果你有兴趣实现，欢迎提交pr。

### 创建

支持创建新的别名

> [!TIP]
> 请确认你已经知道了如何正确的创建别名
> 别名不能重复

![add](https://github.com/user-attachments/assets/1af0175f-c5b2-4b1b-a5bb-26f48688f73f)

### 重命名

支持对已有别名的名称和指令名称重命名

![rename](https://github.com/user-attachments/assets/088510aa-d8dc-487b-bc17-a408579fa9d2)

### 删除

支持删除一个别名或者所有别名

![delete](https://github.com/user-attachments/assets/5817a6e2-78ab-48bb-9a89-4bbb2d4379dc)

### 运行

点击运行按钮，会在控制台执行该命令

> [!TIP]
> 如果控制台报错 `command not found`, 先关闭控制台再执行。

![run](https://github.com/user-attachments/assets/ad3f5b4d-f9d8-4eda-8b48-1b6f6a2705c5)

### 复制

支持复制单个别名和分组下的所有别名

![copy](https://github.com/user-attachments/assets/23991d48-8de3-4a49-9dd9-f6ef6a6dd2b8)

### 分组

支持创建，删除，重命名分组，可以将别名添加或移出分组。

所有的别名都在 `System Aliases` 组下，这个是数据源。可以为不同的别名划分不同的组，这对于快速查找和操作别名很有帮助。

#### 创建、删除、重命名分组

> [!TIP]
> 不允许创建 `名称相同的` 分组

![create-group](https://github.com/user-attachments/assets/1b9e6e22-3308-4ff6-9811-0c91ac416d7a)

#### 分组添加或移出别名

![move-group](https://github.com/user-attachments/assets/9079a8cc-3be3-42a2-8c09-5b60aab64c07)

### 排序

![sort](https://github.com/user-attachments/assets/fb904718-c01d-416a-9c7a-4f6795cee2eb)

### 备注

支持为每个别名添加备注，清空输入框可以隐藏备注。 

![description](https://github.com/user-attachments/assets/930dcf4f-6e62-4216-91ba-ca9d1de5c369)

### 存储路径

默认存储路径是 `{homedir}/.zshrc`, 比如 `~/.zshrc` 或者 `/Users/chouchouji/.zshrc`。 如果你想自定义存储路径, 可通过 `Setting/Extensions/Alias Manager` 修改。

![store-path](https://github.com/user-attachments/assets/2f3e5dfd-b97b-45d1-bb35-46c10fb89e80)


## 国际化

默认语言是 `英文`。如果你安装了 [chinese vscode extension](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)，重启vscode，`alias manager`插件会自动切换为中文。

## 反馈

如果你遇到了问题或者有好的想法和建议, 欢迎在此 [留言](https://github.com/chouchouji/alias-manager/issues)。

## 更新日志

[更新日志](CHANGELOG.md)

## 许可证

[MIT](LICENSE)
