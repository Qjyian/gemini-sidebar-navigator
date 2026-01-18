# Gemini Sidebar Navigator (Gemini 对话侧边栏)

![Version](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

一个轻量级、极简风格的 Chrome 浏览器扩展，为 Google Gemini 添加侧边栏导航功能，帮助你快速定位和管理长对话历史。

> **设计理念**：采用 Gemini 原生的 Ethereal Design（空灵设计）语言，结合毛玻璃特效与呼吸感光标动画，像原生功能一样自然。

![预览图](preview.png)
*(建议：将你最好看的一张截图重命名为 preview.png 放在项目根目录，这样这里就能显示出来了)*

## ✨ 功能特点 (Features)

* **🎨 极简美学**: 采用 Glassmorphism (毛玻璃) 视觉风格，完美适配 Gemini 亮色/暗色主题。
* **📍 智能导航**: 自动提取对话中的用户提问生成目录，点击即可平滑滚动定位。
* **🔍 快速检索**: 顶部内置搜索框，支持实时过滤历史对话记录，查找过往思路快人一步。
* **⚡ 性能优化**: 智能监听 DOM 变化，去重防抖，确保长对话流畅无卡顿。
* **✨ 交互细节**: 
    * 鼠标悬停左侧唤出，移出自动收起，不遮挡正文。
    * 点击消息后，对应对话气泡会有柔和的“呼吸光效”高亮。

## 🚀 安装方法 (Installation)

由于本项目尚未发布到 Chrome Web Store，你需要手动加载：

1.  **下载代码**：点击本页面右上角的 `Code` -> `Download ZIP`，下载并解压（或者使用 `git clone`）。
2.  **打开扩展管理**：在 Chrome 地址栏输入 `chrome://extensions/` 并回车。
3.  **开启开发者模式**：打开右上角的开关 **"Developer mode"**。
4.  **加载扩展**：点击左上角的 **"Load unpacked"** (加载已解压的扩展程序)。
5.  **选择文件夹**：选择你解压后的项目文件夹（包含 `manifest.json` 的那个）。
6.  **完成**：刷新 Gemini 页面，将鼠标移动到屏幕右侧边缘即可唤出侧边栏。

## 🛠️ 技术栈 (Tech Stack)

* **Core**: Manifest V3, Vanilla JavaScript (无第三方依赖)
* **Style**: CSS3 (Flexbox, Backdrop-filter, CSS Animations)
* **Icons**: SVG

## 📝 更新日志 (Changelog)

### v1.0.0
- 初始版本发布。
- 实现基础的侧边栏导航、搜索、刷新功能。
- 优化 UI 为极简风格，移除冗余的标题栏。
- 添加消息定位的高亮呼吸动画。

## 📄 License

本项目基于 [MIT License](LICENSE) 开源，欢迎 Fork 和 Star！🌟