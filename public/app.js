// 共享的 JS 工具函數

// Modal 控制
function openModal(data = null) {
  const modal = document.getElementById('modal');
  const form = document.querySelector('form');
  
  if (data) {
    // 編輯模式
    document.getElementById('modalTitle').textContent = '編輯';
    document.getElementById('id').value = data.id || '';
    document.getElementById('date').value = data.date || '';
    
    // 行程表單
    if (document.getElementById('day_number')) {
      document.getElementById('day_number').value = data.day_number || '';
    }
    if (document.getElementById('location')) {
      document.getElementById('location').value = data.location || '';
    }
    if (document.getElementById('activity')) {
      document.getElementById('activity').value = data.activity || '';
    }
    if (document.getElementById('driving_info')) {
      document.getElementById('driving_info').value = data.driving_info || '';
    }
    if (document.getElementById('accommodation')) {
      document.getElementById('accommodation').value = data.accommodation || '';
    }
    if (document.getElementById('guide_tips')) {
      document.getElementById('guide_tips').value = data.guide_tips || '';
    }
    if (document.getElementById('recommendations')) {
      document.getElementById('recommendations').value = data.recommendations || '';
    }
    // 載入自訂地點
    if (document.getElementById('customLocationsContainer')) {
      const locContainer = document.getElementById('customLocationsContainer');
      locContainer.innerHTML = '';
      try {
        let locations = data.custom_locations;
        if (typeof locations === 'string') {
          locations = locations ? JSON.parse(locations) : [];
        }
        if (Array.isArray(locations) && locations.length > 0) {
          locations.forEach(loc => {
            const row = document.createElement('div');
            row.className = 'custom-location-row';
            row.style = 'display:flex; gap:0.5rem; margin-bottom:0.3rem;';
            row.innerHTML = `
              <input type="text" class="custom-loc-name" placeholder="標籤名稱" value="${escapeHtml(loc.name || '')}" style="flex:1; padding:0.5rem; border:1px solid #ddd; border-radius:4px;">
              <input type="url" class="custom-loc-url" placeholder="Google Maps 連結" value="${escapeHtml(loc.url || '')}" style="flex:2; padding:0.5rem; border:1px solid #ddd; border-radius:4px;">
              <button type="button" onclick="removeCustomLocRow(this)" style="padding:0.5rem; background:#ff4444; color:white; border:none; border-radius:4px; cursor:pointer;">✕</button>
            `;
            locContainer.appendChild(row);
          });
        } else {
          addCustomLocRow();
        }
      } catch(e) {
        locContainer.innerHTML = '';
        addCustomLocRow();
      }
    }
    // 載入附件
    if (document.getElementById('attachmentsContainer')) {
      const attContainer = document.getElementById('attachmentsContainer');
      attContainer.innerHTML = '';
      try {
        let attachments = data.attachments;
        if (typeof attachments === 'string') {
          attachments = attachments ? JSON.parse(attachments) : [];
        }
        if (Array.isArray(attachments) && attachments.length > 0) {
          attachments.forEach(att => {
            const row = document.createElement('div');
            row.className = 'attachment-row';
            row.style = 'display:flex; gap:0.5rem; margin-bottom:0.3rem;';
            row.innerHTML = `
              <input type="text" class="attachment-name" placeholder="附件名稱" value="${escapeHtml(att.name || '')}" style="flex:1; padding:0.5rem; border:1px solid #ddd; border-radius:4px;">
              <input type="url" class="attachment-url" placeholder="檔案連結" value="${escapeHtml(att.url || '')}" style="flex:2; padding:0.5rem; border:1px solid #ddd; border-radius:4px;">
              <button type="button" onclick="removeAttachmentRow(this)" style="padding:0.5rem; background:#ff4444; color:white; border:none; border-radius:4px; cursor:pointer;">✕</button>
            `;
            attContainer.appendChild(row);
          });
        } else {
          addAttachmentRow();
        }
      } catch(e) {
        attContainer.innerHTML = '';
        addAttachmentRow();
      }
    }
    if (document.getElementById('notes')) {
      document.getElementById('notes').value = data.notes || '';
    }
    if (document.getElementById('backup_plan')) {
      document.getElementById('backup_plan').value = data.backup_plan || '';
    }
    
    // 花費表單
    if (document.getElementById('category')) {
      document.getElementById('category').value = data.category || '其他';
    }
    if (document.getElementById('amount')) {
      document.getElementById('amount').value = data.amount || '';
    }
    if (document.getElementById('paid_by')) {
      document.getElementById('paid_by').value = data.paid_by || '小肉';
    }
    if (document.getElementById('description')) {
      document.getElementById('description').value = data.description || '';
    }
  } else {
    // 新增模式
    form.reset();
    document.getElementById('modalTitle').textContent = '新增';
    document.getElementById('id').value = '';
  }
  
  modal.classList.add('show');
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
}

// 點擊背景關閉 Modal
document.getElementById('modal')?.addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    closeModal();
  }
});

// ESC 鍵關閉 Modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

// 格式化日期 (YYYY-MM-DD -> 民國年 MM/DD)
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const ROCyear = date.getFullYear() - 1911;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${ROCyear}/${month}/${day}`;
}

// HTML 跳脫
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 帶認證的 fetch
async function authFetch(url, options = {}) {
  const sessionId = sessionStorage.getItem('nzSessionId');
  if (sessionId) {
    options.headers = {
      ...options.headers,
      'x-session-id': sessionId
    };
  }
  const res = await fetch(url, options);
  
  // 如果是 401，重新登入
  if (res.status === 401) {
    sessionStorage.removeItem('nzSessionId');
    window.location.href = '/login.html';
    throw new Error('Unauthorized');
  }
  return res;
}
