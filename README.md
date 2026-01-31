# AI Chat Navigator

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Edge-orange.svg)

**一个优雅的浏览器扩展，为 Gemini、ChatGPT 和 Claude 添加智能对话导航侧边栏**

[功能特性](#-功能特性) • [安装方法](#-安装方法) • [使用指南](#-使用指南) • [更新日志](#-更新日志)

</div>

---

## 📖 简介

AI Chat Navigator 是一个轻量级的浏览器扩展，为主流 AI 对话平台提供统一的侧边栏导航体验。通过智能识别用户消息，让你快速定位和跳转到历史对话的任意位置。

### 支持的平台

| 平台 | 状态 | 主题色 |
|------|------|--------|
| 🔷 **Google Gemini** | ✅ 完全支持 | 蓝橙渐变 |
| 🟢 **ChatGPT** | ✅ 完全支持 | 绿色主题 |
| 🟤 **Claude** | ✅ 完全支持 | 棕橙主题 |

---

## ✨ 功能特性

### 🎯 核心功能

- **智能消息识别** - 自动区分用户消息和 AI 回复，只显示你的提问
- **快速导航跳转** - 点击消息即可平滑滚动到对应位置，带高亮动画
- **实时搜索过滤** - 输入关键词快速定位特定对话内容
- **多平台自适应** - 根据不同 AI 平台自动调整主题色和高亮效果
- **悬浮球交互** - 优雅的悬浮按钮，鼠标悬停展开侧边栏
- **暗色模式** - 完美适配系统主题，保护眼睛

### 🎨 设计亮点

- **毛玻璃效果** - 现代化的半透明背景和模糊效果
- **平滑动画** - 流畅的过渡和微交互动效
- **平台特定颜色** - 高亮效果与各平台品牌色完美融合
  - Gemini: 蓝色高亮 (#4b90ff)
  - ChatGPT: 绿色高亮 (#10a37f)
  - Claude: 暖橙色高亮 (#cc785c)
- **响应式布局** - 自适应不同屏幕尺寸

### 🚀 技术特性

- **零依赖** - 纯原生 JavaScript，轻量高效
- **性能优化** - 智能防抖和内容哈希对比
- **实时监听** - MutationObserver 自动检测新消息
- **无侵入式** - 不影响原网页功能和样式

---

## 📦 安装方法

### 方式一：从源码安装（开发者模式）

1. **下载项目文件**
   ```bash
   git clone https://github.com/Qiyian/ai-chat-navigator.git
   cd ai-chat-navigator
   ```

2. **加载扩展**
   - **Chrome**: 
     - 打开 `chrome://extensions/`
     - 开启右上角的「开发者模式」
     - 点击「加载已解压的扩展程序」
     - 选择项目文件夹
   
   - **Edge**: 
     - 打开 `edge://extensions/`
     - 开启左下角的「开发人员模式」
     - 点击「加载解压缩的扩展」
     - 选择项目文件夹

3. **验证安装**
   - 访问 [Gemini](https://gemini.google.com)、[ChatGPT](https://chatgpt.com) 或 [Claude](https://claude.ai)
   - 打开任意对话
   - 右侧应该出现悬浮球按钮

### 方式二：手动下载（推荐非开发者）

1. 从 [Releases](https://github.com/Qiyian/ai-chat-navigator/releases) 下载最新版本
2. 解压文件到任意文件夹
3. 按照上述步骤加载扩展

---

## 🎮 使用指南

### 基础操作

1. **打开侧边栏**
   - 鼠标悬停在右侧悬浮球上
   - 侧边栏自动展开

2. **浏览消息列表**
   - 滚动查看所有用户消息
   - 消息按发送顺序编号

3. **跳转到指定消息**
   - 点击任意消息项
   - 页面平滑滚动到对应位置
   - 消息高亮显示 2.5 秒

4. **搜索消息**
   - 在顶部搜索框输入关键词
   - 实时过滤匹配的消息
   - 清空搜索框恢复全部显示

5. **刷新列表**
   - 点击搜索框右侧的刷新按钮
   - 手动更新消息列表

### 快捷提示

- 💡 侧边栏会在鼠标移出后自动收起
- 💡 新消息会自动添加到列表底部
- 💡 搜索支持中英文混合匹配
- 💡 高亮颜色会根据当前平台自动调整

---

## 🛠️ 技术栈

- **原生 JavaScript (ES6+)** - 核心逻辑
- **CSS3** - 样式和动画
- **MutationObserver API** - DOM 变化监听
- **Chrome Extension Manifest V3** - 扩展规范

---

## 📝 文件结构

```
ai-chat-navigator/
├── manifest.json          # 扩展配置文件
├── content.js            # 核心逻辑脚本
├── sidebar.css           # 样式文件
├── icons/                # 图标资源
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── README.md             # 项目说明
├── INSTALLATION.md       # 详细安装指南
└── VERSION_COMPARISON.md # 版本对比文档
```

---

## 🔄 更新日志

### v2.0.0 (2025-01-31) - 多平台支持

**🎉 重大更新**
- ✨ 新增 ChatGPT 完整支持
- ✨ 新增 Claude 完整支持
- 🎨 平台特定的主题色和高亮效果
- 🔧 优化 ChatGPT 消息识别算法
- 🔧 修复首页误显示问题
- ⚡ 性能优化和防抖改进
- 🎨 移除冗余的平台徽章，界面更简洁

### v1.0.0 (2025-01-15) - 初始版本

- 🎉 支持 Google Gemini
- 📱 基础侧边栏功能
- 🔍 消息搜索和导航
- 🌙 暗色模式支持

[查看完整更新日志 →](./VERSION_COMPARISON.md)

---

## 🐛 故障排除

### 侧边栏不显示

**原因：** 可能未在对话页面，或页面加载未完成

**解决方法：**
1. 确认 URL 格式正确（包含对话 ID）
2. 刷新页面（F5）
3. 在扩展管理页面重新加载插件

### 消息列表为空

**原因：** 页面内容尚未加载，或没有用户消息

**解决方法：**
1. 等待页面完全加载
2. 点击刷新按钮手动更新
3. 发送至少一条消息

### ChatGPT 显示错误内容

**原因：** 页面加载时间较长

**解决方法：**
- v2.0 已修复，自动延长等待时间至 2 秒
- 如仍有问题，点击刷新按钮

### 样式错乱或重叠

**原因：** 可能与其他扩展冲突

**解决方法：**
1. 清除浏览器缓存
2. 禁用其他可能冲突的扩展
3. 重新加载插件

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发设置

```bash
# 克隆仓库
git clone https://github.com/Qiyian/ai-chat-navigator.git

# 进入目录
cd ai-chat-navigator

# 在浏览器中加载扩展
# 修改代码后刷新扩展即可测试
```

### 想要支持新平台？

1. Fork 本项目
2. 在 `detectPlatform()` 中添加平台检测
3. 实现对应的 `scan[Platform]Messages()` 方法
4. 在 `getPlatformConfig()` 中配置主题
5. 测试并提交 PR

---

## 📄 开源协议

本项目采用 [MIT License](./LICENSE) 开源协议。

---

## 🌟 支持项目

如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！

---

<div align="center">

**感谢使用 AI Chat Navigator！**

Made with ❤️ by wqj

</div>
