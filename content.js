// AI Chat Navigator - Multi-Platform Support (Gemini, ChatGPT, Claude)

class MultiPlatformChatNavigator {
  constructor() {
    this.sidebar = null;
    this.floatingTab = null;
    this.messageList = null;
    this.messages = [];
    this.observer = null;
    this.lastContentHash = '';
    this.platform = this.detectPlatform();
    this.init();
  }

  detectPlatform() {
    const url = window.location.href;
    if (url.includes('gemini.google.com') || url.includes('aistudio.google.com')) {
      return 'gemini';
    } else if (url.includes('chatgpt.com') || url.includes('chat.openai.com')) {
      return 'chatgpt';
    } else if (url.includes('claude.ai')) {
      return 'claude';
    }
    return 'unknown';
  }

  init() {
    if (!this.isInChatPage()) {
      this.observeUrlChanges();
      return;
    }
    
    this.injectHighlightStyles();
    this.createSidebar();
    this.createFloatingTab();
    this.observeMessages();
    this.setupEventListeners();
    
    // ChatGPT 需要更长的加载时间，其他平台 1 秒足够
    const scanDelay = this.platform === 'chatgpt' ? 2000 : 1000;
    setTimeout(() => this.scanMessages(), scanDelay);
  }

  injectHighlightStyles() {
    const styleId = 'chat-navigator-dynamic-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        /* 基础高亮样式 */
        .chat-message-highlight-pulse {
          position: relative;
          border-radius: 8px !important;
          transition: all 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }
        
        /* Gemini 平台高亮 - 蓝色 */
        .chat-message-highlight-pulse[data-highlight-platform="gemini"] {
          box-shadow: inset 4px 0 0 0 #4b90ff, 0 8px 24px rgba(75, 144, 255, 0.25) !important;
          background: linear-gradient(90deg, rgba(75, 144, 255, 0.12) 0%, rgba(75, 144, 255, 0.04) 50%, rgba(75, 144, 255, 0) 100%) !important;
        }
        
        /* ChatGPT 平台高亮 - 绿色 */
        .chat-message-highlight-pulse[data-highlight-platform="chatgpt"] {
          box-shadow: inset 4px 0 0 0 #10a37f, 0 8px 24px rgba(16, 163, 127, 0.25) !important;
          background: linear-gradient(90deg, rgba(16, 163, 127, 0.12) 0%, rgba(16, 163, 127, 0.04) 50%, rgba(16, 163, 127, 0) 100%) !important;
        }
        
        /* Claude 平台高亮 - 棕橙色 */
        .chat-message-highlight-pulse[data-highlight-platform="claude"] {
          box-shadow: inset 4px 0 0 0 #cc785c, 0 8px 24px rgba(204, 120, 92, 0.25) !important;
          background: linear-gradient(90deg, rgba(204, 120, 92, 0.12) 0%, rgba(204, 120, 92, 0.04) 50%, rgba(204, 120, 92, 0) 100%) !important;
        }
        
        /* 默认高亮（兜底方案） */
        .chat-message-highlight-pulse:not([data-highlight-platform]) {
          box-shadow: inset 4px 0 0 0 #4b90ff, 0 8px 24px rgba(75, 144, 255, 0.25) !important;
          background: linear-gradient(90deg, rgba(75, 144, 255, 0.12) 0%, rgba(75, 144, 255, 0.04) 50%, rgba(75, 144, 255, 0) 100%) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  isInChatPage() {
    const url = window.location.href;
    
    switch(this.platform) {
      case 'gemini':
        // Gemini: 必须在 /app/[chat-id] 格式的页面
        return url.includes('/app/') && url.split('/app/')[1].length > 0;
      
      case 'chatgpt':
        // ChatGPT: 必须在 /c/[chat-id] 格式的页面，排除首页
        // 首页通常是 chatgpt.com/ 或 chatgpt.com/?model=xxx
        if (url.includes('/c/')) {
          const chatId = url.split('/c/')[1];
          // 确保有实际的对话 ID（不只是 /c/ 或 /c/new）
          return chatId && chatId.length > 10 && !chatId.startsWith('new');
        }
        return false;
      
      case 'claude':
        // Claude: 必须在 /chat/[chat-id] 格式的页面
        if (url.includes('/chat/')) {
          const chatId = url.split('/chat/')[1];
          return chatId && chatId.length > 0;
        }
        return false;
      
      default:
        return false;
    }
  }

  observeUrlChanges() {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        const newPlatform = this.detectPlatform();
        if (newPlatform !== this.platform) {
          this.platform = newPlatform;
          this.cleanup();
        }
        
        if (this.isInChatPage() && !this.sidebar) {
          this.createSidebar();
          this.createFloatingTab();
          this.observeMessages();
          this.setupEventListeners();
          
          // ChatGPT 需要更长的加载时间
          const scanDelay = this.platform === 'chatgpt' ? 2000 : 1000;
          setTimeout(() => this.scanMessages(), scanDelay);
        } else if (!this.isInChatPage()) {
          this.cleanup();
        }
      }
    }).observe(document, { subtree: true, childList: true });
  }

  cleanup() {
    if (this.sidebar) { this.sidebar.remove(); this.sidebar = null; }
    if (this.floatingTab) { this.floatingTab.remove(); this.floatingTab = null; }
    if (this.observer) { this.observer.disconnect(); this.observer = null; }
    this.lastContentHash = '';
  }

  getPlatformConfig() {
    const configs = {
      gemini: {
        name: 'Gemini',
        color: '#4b90ff',
        gradient: 'linear-gradient(135deg, #4b90ff 0%, #ff5546 100%)',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" stroke-width="2" fill="none"/>
          <circle cx="12" cy="12" r="3" fill="white"/>
        </svg>`
      },
      chatgpt: {
        name: 'ChatGPT',
        color: '#10a37f',
        gradient: 'linear-gradient(135deg, #10a37f 0%, #1a7f64 100%)',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
        </svg>`
      },
      claude: {
        name: 'Claude',
        color: '#cc785c',
        gradient: 'linear-gradient(135deg, #cc785c 0%, #d4936f 100%)',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3C7.448 3 7 3.448 7 4V8C7 8.552 7.448 9 8 9H10V15H8C7.448 15 7 15.448 7 16V20C7 20.552 7.448 21 8 21H16C16.552 21 17 20.552 17 20V16C17 15.448 16.552 15 16 15H14V9H16C16.552 9 17 8.552 17 8V4C17 3.448 16.552 3 16 3H8Z"/>
        </svg>`
      }
    };
    return configs[this.platform] || configs.gemini;
  }

  createFloatingTab() {
    const config = this.getPlatformConfig();
    this.floatingTab = document.createElement('div');
    this.floatingTab.className = 'chat-floating-tab';
    this.floatingTab.style.background = config.gradient;
    this.floatingTab.innerHTML = config.icon;
    document.body.appendChild(this.floatingTab);
    this.floatingTab.addEventListener('mouseenter', () => this.showSidebar());
  }

  createSidebar() {
    const config = this.getPlatformConfig();
    this.sidebar = document.createElement('div');
    this.sidebar.id = 'chat-nav-sidebar';
    this.sidebar.className = 'chat-nav-sidebar collapsed';
    this.sidebar.dataset.platform = this.platform;
    
    this.sidebar.innerHTML = `
      <div class="top-bar">
        <div class="search-wrapper">
          <div class="search-icon"></div>
          <input type="text" id="search-input" placeholder="搜索消息..." />
        </div>
        <button id="refresh-btn" class="refresh-btn" title="刷新列表">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </button>
      </div>
      <div class="message-list" id="message-list"></div>
    `;
    
    document.body.appendChild(this.sidebar);
    this.messageList = document.getElementById('message-list');
    
    this.sidebar.addEventListener('mouseleave', () => this.hideSidebar());
    this.sidebar.addEventListener('mouseenter', () => clearTimeout(this.hideTimeout));
  }

  setupEventListeners() {
    const refreshBtn = document.getElementById('refresh-btn');
    refreshBtn?.addEventListener('click', () => {
      this.lastContentHash = '';
      this.scanMessages();
      refreshBtn.style.transform = 'rotate(360deg)';
      setTimeout(() => refreshBtn.style.transform = '', 300);
    });
    
    const searchInput = document.getElementById('search-input');
    searchInput?.addEventListener('input', (e) => this.filterMessages(e.target.value));
  }

  showSidebar() {
    clearTimeout(this.hideTimeout);
    this.sidebar.classList.add('show');
    this.sidebar.classList.remove('collapsed');
    this.floatingTab.classList.add('hidden');
  }

  hideSidebar() {
    this.hideTimeout = setTimeout(() => {
      this.sidebar.classList.remove('show');
      this.sidebar.classList.add('collapsed');
      this.floatingTab.classList.remove('hidden');
    }, 200);
  }

  observeMessages() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    
    this.observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      for (const mutation of mutations) {
        if (this.sidebar && (this.sidebar === mutation.target || this.sidebar.contains(mutation.target))) {
          continue;
        }
        if (mutation.addedNodes.length > 0) {
          shouldUpdate = true;
          break;
        }
      }
      if (shouldUpdate) {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => this.scanMessages(), 1000);
      }
    });
    
    this.observer.observe(targetNode, config);
  }

  scanMessages() {
    let userElements = [];
    
    switch(this.platform) {
      case 'gemini':
        userElements = this.scanGeminiMessages();
        break;
      case 'chatgpt':
        userElements = this.scanChatGPTMessages();
        break;
      case 'claude':
        userElements = this.scanClaudeMessages();
        break;
    }

    const newMessages = [];
    const tempSeenTexts = new Set();
    
    userElements.forEach((element) => {
      const messageData = this.extractMessageContent(element);
      if (!messageData || !messageData.text) return;
      
      const contentKey = messageData.text.trim().substring(0, 100);
      if (tempSeenTexts.has(contentKey)) return;
      tempSeenTexts.add(contentKey);
      
      newMessages.push({
        element: element,
        text: messageData.text,
        preview: messageData.preview,
        hasFile: messageData.hasFile,
        fileName: messageData.fileName
      });
    });

    const currentHash = newMessages.length + '|' + (newMessages.length > 0 ? newMessages[newMessages.length-1].text.substring(0, 20) : '');
    
    if (this.lastContentHash === currentHash) return;
    
    this.lastContentHash = currentHash;
    this.messages = newMessages;
    this.updateMessageList();
  }

  scanGeminiMessages() {
    const selectors = ['[data-message-author-role="user"]', '.user-query', '[class*="user"]'];
    let userElements = [];
    
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        userElements = Array.from(elements);
        break;
      }
    }
    
    if (userElements.length === 0) {
      const allElements = document.querySelectorAll('div[class*="message"], div[class*="query"], div[class*="turn"], article');
      userElements = Array.from(allElements).filter(el => this.isUserMessage(el));
    }
    
    return userElements;
  }

  scanChatGPTMessages() {
    // ChatGPT 使用 data-message-author-role="user" 或特定的结构
    const userMessages = document.querySelectorAll('[data-message-author-role="user"]');
    if (userMessages.length > 0) {
      return Array.from(userMessages);
    }
    
    // 备用方案：查找对话区域中的消息
    // ChatGPT 的对话容器通常有特定的类名或结构
    const mainContent = document.querySelector('main') || document.querySelector('[role="main"]') || document.body;
    
    // 排除左侧边栏（通常在 nav 或 aside 中）
    const excludeSelectors = ['nav', 'aside', '[role="navigation"]', '[class*="sidebar"]', '[class*="menu"]'];
    
    // 在主内容区查找消息
    const allMessages = mainContent.querySelectorAll('[class*="group"]');
    
    return Array.from(allMessages).filter(el => {
      // 1. 排除左侧边栏元素
      for (const selector of excludeSelectors) {
        const excludeContainer = el.closest(selector);
        if (excludeContainer) return false;
      }
      
      // 2. 必须在主对话区域内
      const inMainContent = el.closest('main') || el.closest('[role="main"]');
      if (!inMainContent) return false;
      
      const html = el.innerHTML.toLowerCase();
      const text = el.textContent.trim();
      
      // 3. 排除明显的 AI 回复
      if (html.includes('assistant') || html.includes('chatgpt')) return false;
      
      // 4. 必须有足够的文本内容（排除空消息和导航项）
      if (text.length < 10) return false;
      
      // 5. 排除常见的 UI 元素文本
      const uiKeywords = ['新聊天', '搜索聊天', '项目', '你的聊天', 'gpt', '升级', '设置'];
      const hasUIKeyword = uiKeywords.some(keyword => text.includes(keyword) && text.length < 30);
      if (hasUIKeyword) return false;
      
      // 6. 检查是否在对话流中（通常有特定的父容器）
      const hasConversationParent = el.closest('[class*="conversation"]') || 
                                     el.closest('[class*="thread"]') ||
                                     el.closest('[class*="message"]');
      
      return text.length > 5 && (hasConversationParent || !html.includes('assistant'));
    });
  }

  scanClaudeMessages() {
    // Claude uses data-test-render-count and specific structure
    const userMessages = document.querySelectorAll('[data-is-model-response="false"]');
    if (userMessages.length > 0) {
      return Array.from(userMessages);
    }
    
    // Alternative: Look for user message containers
    const allMessages = document.querySelectorAll('[class*="font-user-message"]');
    if (allMessages.length > 0) {
      return Array.from(allMessages);
    }
    
    // Fallback: Parse by structure
    const containers = document.querySelectorAll('div[class*="contents"]');
    return Array.from(containers).filter(el => {
      const html = el.innerHTML.toLowerCase();
      const isUser = !html.includes('assistant') && !html.includes('claude');
      const hasContent = el.textContent.trim().length > 5;
      return isUser && hasContent;
    });
  }

  extractMessageContent(element) {
    const fullText = element.innerText?.trim() || '';
    if (!fullText || fullText.length < 2) return null;
    
    // 过滤常见的 UI 元素文本（ChatGPT 特有问题）
    const uiTexts = [
      '新聊天', '搜索聊天', '搜索消息', '项目', '新项目', '你的聊天', 
      '升级', '设置', '帮助', '探索 GPT', '应用', '图片'
    ];
    
    // 如果文本很短且匹配 UI 关键词，直接过滤
    if (fullText.length < 20) {
      for (const uiText of uiTexts) {
        if (fullText.includes(uiText)) return null;
      }
    }
    
    const hasFile = this.hasFileAttachment(element);
    let fileName = '';
    let textContent = fullText;
    
    if (hasFile) {
      fileName = this.extractFileName(element);
      const textOnly = this.extractTextWithoutFileName(fullText, fileName);
      if (textOnly && textOnly.length > 5) textContent = textOnly;
      else if (fileName) textContent = fileName;
    }
    
    // 最终验证：确保不是单纯的导航文本
    if (textContent.length < 5) return null;
    
    return {
      text: textContent,
      preview: this.createPreview(textContent),
      hasFile: hasFile,
      fileName: fileName
    };
  }

  hasFileAttachment(element) {
    const html = element.innerHTML.toLowerCase();
    return html.includes('file') || html.includes('image') || 
           html.includes('attachment') || html.includes('upload') ||
           element.querySelector('img') !== null ||
           element.querySelector('[type="file"]') !== null;
  }

  extractFileName(element) {
    const fileElements = element.querySelectorAll('[class*="file"], [class*="attachment"]');
    for (const fileEl of fileElements) {
      const text = fileEl.textContent?.trim();
      if (text && text.length > 0 && text.length < 100) return text;
    }
    
    const text = element.innerText;
    const filePattern = /([a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|pdf|doc|docx|txt|zip|rar))/i;
    const match = text.match(filePattern);
    return match ? match[1] : '';
  }

  extractTextWithoutFileName(text, fileName) {
    if (!fileName) return text;
    let cleanText = text.replace(fileName, '').trim();
    cleanText = cleanText.replace(/已上传|上传|附件|文件|image|file/gi, '').trim();
    return cleanText;
  }

  isUserMessage(element) {
    const htmlLower = element.outerHTML.toLowerCase();
    const hasUserIndicator = htmlLower.includes('data-message-author-role="user"') ||
                            htmlLower.includes('class="user') ||
                            htmlLower.includes('user-query') ||
                            htmlLower.includes('user-message');
    const hasAIIndicator = htmlLower.includes('model') ||
                          htmlLower.includes('assistant') ||
                          htmlLower.includes('gemini') ||
                          htmlLower.includes('chatgpt') ||
                          htmlLower.includes('claude') ||
                          htmlLower.includes('response');
    
    if (hasUserIndicator && !hasAIIndicator) return true;
    if (hasAIIndicator) return false;
    
    const textContent = element.textContent || '';
    const hasCodeBlock = textContent.includes('```') || htmlLower.includes('<pre') || htmlLower.includes('<code');
    const isShort = textContent.length < 500;
    
    return isShort && !hasCodeBlock;
  }

  createPreview(text) {
    const maxLength = 60;
    let preview = text.replace(/\s+/g, ' ').trim();
    if (preview.length > maxLength) preview = preview.substring(0, maxLength) + '...';
    return preview;
  }

  updateMessageList() {
    if (!this.messageList) return;
    this.messageList.innerHTML = '';
    
    if (this.messages.length === 0) {
      this.messageList.innerHTML = '<div style="text-align:center;padding:20px;color:#999;font-size:12px">暂无消息</div>';
      return;
    }
    
    const fragment = document.createDocumentFragment();
    this.messages.forEach((msg, index) => {
      const item = document.createElement('div');
      item.className = 'message-item';
      if (msg.hasFile) item.classList.add('has-file');
      item.dataset.index = index;
      
      item.innerHTML = `
        <div class="message-number">${index + 1}</div>
        <div class="message-text">${this.escapeHtml(msg.preview)}</div>
      `;
      
      item.addEventListener('click', () => this.scrollToMessage(msg.element));
      fragment.appendChild(item);
    });
    this.messageList.appendChild(fragment);
  }

  filterMessages(searchTerm) {
    const items = this.messageList.querySelectorAll('.message-item');
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      items.forEach(item => item.style.display = 'flex');
      return;
    }
    
    items.forEach((item, index) => {
      const msg = this.messages[index];
      if (msg && msg.text.toLowerCase().includes(term)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  scrollToMessage(element) {
    if (!element) return;
    
    // 1. 平滑滚动
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // 2. 移除旧的高亮类
    element.classList.remove('chat-message-highlight-pulse');
    
    // 3. 添加平台特定的 data 属性（用于 CSS 变量）
    element.setAttribute('data-highlight-platform', this.platform);
    
    // 4. 强制重绘以重新触发动画
    void element.offsetWidth;
    
    // 5. 添加高亮类
    element.classList.add('chat-message-highlight-pulse');
    
    // 6. 2.5秒后移除高亮
    setTimeout(() => {
      element.classList.remove('chat-message-highlight-pulse');
      element.removeAttribute('data-highlight-platform');
    }, 2500);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new MultiPlatformChatNavigator());
} else {
  new MultiPlatformChatNavigator();
}