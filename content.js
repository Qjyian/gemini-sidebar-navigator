// Gemini 对话导航侧边栏 - Final Perfected Version

class GeminiSidebarNavigator {
  constructor() {
    this.sidebar = null;
    this.floatingTab = null;
    this.messageList = null;
    this.messages = [];
    this.observer = null;
    this.lastContentHash = ''; 
    this.init();
  }

  init() {
    if (!this.isInChatPage()) {
      this.observeUrlChanges();
      return;
    }
    
    // 注入高亮所需的 CSS（防止 CSS 文件加载延迟导致的样式丢失）
    this.injectHighlightStyles();
    
    this.createSidebar();
    this.createFloatingTab();
    this.observeMessages();
    this.setupEventListeners();
    setTimeout(() => this.scanMessages(), 1000);
  }

  injectHighlightStyles() {
    // 确保高亮样式存在，即使 external CSS 加载慢
    const styleId = 'gemini-sidebar-dynamic-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .gemini-message-highlight-pulse {
          box-shadow: inset 4px 0 0 0 #4b90ff, 0 8px 24px rgba(66, 133, 244, 0.2) !important;
          background-color: rgba(66, 133, 244, 0.08) !important;
          border-radius: 6px !important;
          transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  isInChatPage() {
    const url = window.location.href;
    return url.includes('/app/') && url.split('/app/')[1].length > 0;
  }

  observeUrlChanges() {
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        if (this.isInChatPage() && !this.sidebar) {
          this.createSidebar();
          this.createFloatingTab();
          this.observeMessages();
          this.setupEventListeners();
          setTimeout(() => this.scanMessages(), 1000);
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

  createFloatingTab() {
    this.floatingTab = document.createElement('div');
    this.floatingTab.className = 'gemini-floating-tab';
    this.floatingTab.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="white"/>
      </svg>
    `;
    document.body.appendChild(this.floatingTab);
    this.floatingTab.addEventListener('mouseenter', () => this.showSidebar());
  }

  createSidebar() {
    this.sidebar = document.createElement('div');
    this.sidebar.id = 'gemini-nav-sidebar';
    this.sidebar.className = 'gemini-nav-sidebar collapsed';
    
    this.sidebar.innerHTML = `
      <div class="top-bar">
        <div class="search-wrapper">
          <div class="search-icon"></div>
          <input type="text" id="search-input" placeholder="搜索..." />
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
    const selectors = ['[data-message-author-role="user"]', '.user-query', '[class*="user"]'];
    let userElements = [];
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) { userElements = Array.from(elements); break; }
    }
    if (userElements.length === 0) {
      const allElements = document.querySelectorAll('div[class*="message"], div[class*="query"], div[class*="turn"], article');
      userElements = Array.from(allElements).filter(el => this.isUserMessage(el));
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

  extractMessageContent(element) {
    const fullText = element.innerText?.trim() || '';
    if (!fullText || fullText.length < 2) return null;
    const hasFile = this.hasFileAttachment(element);
    let fileName = '';
    let textContent = fullText;
    if (hasFile) {
      fileName = this.extractFileName(element);
      const textOnly = this.extractTextWithoutFileName(fullText, fileName);
      if (textOnly && textOnly.length > 5) textContent = textOnly;
      else if (fileName) textContent = fileName;
    }
    return { text: textContent, preview: this.createPreview(textContent), hasFile: hasFile, fileName: fileName };
  }

  hasFileAttachment(element) {
    const html = element.innerHTML.toLowerCase();
    return html.includes('file') || html.includes('image') || html.includes('attachment') || html.includes('upload') || element.querySelector('img') !== null || element.querySelector('[type="file"]') !== null;
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
    const hasUserIndicator = htmlLower.includes('data-message-author-role="user"') || htmlLower.includes('class="user') || htmlLower.includes('user-query') || htmlLower.includes('user-message');
    const hasAIIndicator = htmlLower.includes('model') || htmlLower.includes('assistant') || htmlLower.includes('gemini') || htmlLower.includes('response');
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
    if (!term) { items.forEach(item => item.style.display = 'flex'); return; }
    items.forEach((item, index) => {
      const msg = this.messages[index];
      if (msg && msg.text.toLowerCase().includes(term)) item.style.display = 'flex';
      else item.style.display = 'none';
    });
  }

  // --- 关键修改：简约的动效滚动 ---
  scrollToMessage(element) {
    if (!element) return;
    
    // 1. 平滑滚动
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // 2. 添加 CSS 类实现平滑动画，而不是直接操作 Style
    // 移除可能存在的旧类（防止快速点击时叠加）
    element.classList.remove('gemini-message-highlight-pulse');
    
    // 强制重绘，触发重新播放动画 (Reflow)
    void element.offsetWidth; 
    
    // 添加高亮类
    element.classList.add('gemini-message-highlight-pulse');
    
    // 3. 2.5秒后移除高亮
    setTimeout(() => {
      element.classList.remove('gemini-message-highlight-pulse');
    }, 2500);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new GeminiSidebarNavigator());
} else {
  new GeminiSidebarNavigator();
}