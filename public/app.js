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
    if (document.getElementById('attachment_url')) {
      document.getElementById('attachment_url').value = data.attachment_url || '';
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
