/**
 * CropGuardian AI - Upload Module
 * Manages drag & drop, file selection, camera capture, file validation,
 * and built-in interactive presets for immediate offline hackathon demonstrations.
 */

const UploadModule = (function() {
  let selectedFile = null;
  let selectedImageDataUrl = null;
  let activePresetId = 'tomato-early-blight';

  // High quality SVG templates for instantaneous offline hackathon demonstration
  const PRESET_LEAF_SVGS = {
    'tomato-early-blight': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='100%' height='100%'><defs><radialGradient id='lg' cx='40%' cy='30%' r='70%'><stop offset='0%' stop-color='%234ade80'/><stop offset='60%' stop-color='%2315803d'/><stop offset='100%' stop-color='%23052e16'/></radialGradient><radialGradient id='ts' cx='50%' cy='50%' r='50%'><stop offset='10%' stop-color='%231e1305'/><stop offset='40%' stop-color='%2378350f'/><stop offset='70%' stop-color='%23b45309'/><stop offset='90%' stop-color='%23fbbf24'/><stop offset='100%' stop-color='transparent'/></radialGradient></defs><rect width='100%' height='100%' fill='%23041209' rx='16'/><path d='M 200,40 C 260,80 340,160 320,260 C 300,340 220,370 200,390 C 180,370 100,340 80,260 C 60,160 140,80 200,40 Z' fill='url(%23lg)' stroke='%2322c55e' stroke-width='2'/><path d='M 200,40 L 200,390' stroke='%2386efac' stroke-width='3' opacity='0.85'/><path d='M 200,120 Q 250,140 290,170 M 200,180 Q 260,210 305,240 M 200,250 Q 245,280 275,310' stroke='%2386efac' stroke-width='2' opacity='0.65' fill='none'/><circle cx='160' cy='180' r='42' fill='url(%23ts)'/><circle cx='160' cy='180' r='28' fill='none' stroke='%23451a03' stroke-width='2.5' opacity='0.8'/><circle cx='245' cy='245' r='36' fill='url(%23ts)'/><circle cx='245' cy='245' r='22' fill='none' stroke='%23451a03' stroke-width='2' opacity='0.8'/><circle cx='210' cy='310' r='26' fill='url(%23ts)'/><text x='20' y='380' fill='%2386efac' font-size='12' font-family='sans-serif' font-weight='bold'>DEMO SAMPLE: Tomato Early Blight</text></svg>",

    'rice-leaf-blast': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='100%' height='100%'><defs><linearGradient id='rg' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%2386efac'/><stop offset='50%' stop-color='%2316a34a'/><stop offset='100%' stop-color='%2314532d'/></linearGradient></defs><rect width='100%' height='100%' fill='%23041209' rx='16'/><path d='M 70,360 Q 170,220 220,50 Q 235,200 330,360 Z' fill='url(%23rg)' stroke='%2322c55e' stroke-width='2'/><path d='M 220,50 Q 200,200 200,360' stroke='%23bbf7d0' stroke-width='2.5' fill='none' opacity='0.8'/><polygon points='180,160 210,140 240,160 210,180' fill='%2394a3b8' stroke='%2378350f' stroke-width='3'/><polygon points='188,160 210,146 232,160 210,174' fill='%23f1f5f9' stroke='%23451a03' stroke-width='1.5'/><polygon points='150,250 175,230 200,250 175,270' fill='%2394a3b8' stroke='%2378350f' stroke-width='2.5'/><polygon points='230,280 250,265 270,280 250,295' fill='%2394a3b8' stroke='%2378350f' stroke-width='2.5'/><text x='20' y='380' fill='%2386efac' font-size='12' font-family='sans-serif' font-weight='bold'>DEMO SAMPLE: Rice Blast Spindles</text></svg>",

    'cotton-leaf-spot': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='100%' height='100%'><defs><radialGradient id='cg' cx='50%' cy='50%' r='60%'><stop offset='0%' stop-color='%234ade80'/><stop offset='70%' stop-color='%2315803d'/><stop offset='100%' stop-color='%23062814'/></radialGradient></defs><rect width='100%' height='100%' fill='%23041209' rx='16'/><path d='M 200,60 Q 250,110 320,130 Q 270,190 320,260 Q 240,250 200,360 Q 160,250 80,260 Q 130,190 80,130 Q 150,110 200,60 Z' fill='url(%23cg)' stroke='%2322c55e' stroke-width='2'/><circle cx='160' cy='170' r='14' fill='%2378350f' stroke='%237e22ce' stroke-width='2.5'/><circle cx='160' cy='170' r='6' fill='%231c1917'/><circle cx='250' cy='190' r='18' fill='%2378350f' stroke='%237e22ce' stroke-width='3'/><circle cx='250' cy='190' r='8' fill='%231c1917'/><circle cx='200' cy='260' r='12' fill='%2378350f' stroke='%237e22ce' stroke-width='2'/><circle cx='130' cy='220' r='10' fill='%2378350f' stroke='%237e22ce' stroke-width='2'/><circle cx='260' cy='240' r='11' fill='%2378350f' stroke='%237e22ce' stroke-width='2'/><text x='20' y='380' fill='%2386efac' font-size='12' font-family='sans-serif' font-weight='bold'>DEMO SAMPLE: Cotton Leaf Spot</text></svg>",

    'potato-early-blight': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='100%' height='100%'><defs><radialGradient id='pg' cx='45%' cy='35%' r='65%'><stop offset='0%' stop-color='%2386efac'/><stop offset='60%' stop-color='%2315803d'/><stop offset='100%' stop-color='%23052e16'/></radialGradient></defs><rect width='100%' height='100%' fill='%23041209' rx='16'/><path d='M 200,50 C 290,100 310,240 280,310 C 250,370 210,380 200,380 C 190,380 150,370 120,310 C 90,240 110,100 200,50 Z' fill='url(%23pg)' stroke='%2322c55e' stroke-width='2'/><path d='M 200,50 L 200,380' stroke='%23bbf7d0' stroke-width='3' opacity='0.8'/><ellipse cx='160' cy='180' rx='30' ry='22' fill='%23854d0e' stroke='%23451a03' stroke-width='2'/><ellipse cx='160' cy='180' rx='18' ry='12' fill='%23713f12' stroke='%23451a03' stroke-width='1.5'/><ellipse cx='235' cy='240' rx='26' ry='18' fill='%23854d0e' stroke='%23451a03' stroke-width='2'/><ellipse cx='235' cy='240' rx='15' ry='10' fill='%23713f12' stroke='%23451a03' stroke-width='1.5'/><text x='20' y='380' fill='%2386efac' font-size='12' font-family='sans-serif' font-weight='bold'>DEMO SAMPLE: Potato Early Blight</text></svg>",

    'healthy-tomato': "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='100%' height='100%'><defs><radialGradient id='hg' cx='40%' cy='30%' r='70%'><stop offset='0%' stop-color='%2386efac'/><stop offset='40%' stop-color='%2322c55e'/><stop offset='85%' stop-color='%2315803d'/><stop offset='100%' stop-color='%23052e16'/></radialGradient></defs><rect width='100%' height='100%' fill='%23041209' rx='16'/><path d='M 200,40 C 260,80 340,160 320,260 C 300,340 220,370 200,390 C 180,370 100,340 80,260 C 60,160 140,80 200,40 Z' fill='url(%23hg)' stroke='%234ade80' stroke-width='2.5'/><path d='M 200,40 L 200,390' stroke='%23dcfce7' stroke-width='3' stroke-linecap='round'/><path d='M 200,120 Q 250,140 290,170 M 200,180 Q 260,210 305,240 M 200,250 Q 245,280 275,310' stroke='%23dcfce7' stroke-width='2' opacity='0.85' fill='none'/><path d='M 200,120 Q 150,140 110,170 M 200,180 Q 140,210 95,240 M 200,250 Q 155,280 125,310' stroke='%23dcfce7' stroke-width='2' opacity='0.85' fill='none'/><text x='20' y='380' fill='%2386efac' font-size='12' font-family='sans-serif' font-weight='bold'>DEMO SAMPLE: Healthy Crop Foliage</text></svg>"
  };

  function init() {
    const fileInput = document.getElementById('cropFileInput');
    const dropzoneBox = document.getElementById('dropzoneBox');
    const removeBtn = document.getElementById('btnRemovePreview');
    const presetButtons = document.querySelectorAll('.preset-item-btn');

    if (!fileInput || !dropzoneBox) return;

    dropzoneBox.addEventListener('click', (e) => {
      if (e.target !== fileInput && !e.target.closest('#cropFileInput')) {
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', handleFileSelect);

    ['dragenter', 'dragover'].forEach(name => {
      dropzoneBox.addEventListener(name, (e) => {
        e.preventDefault(); e.stopPropagation();
        dropzoneBox.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzoneBox.addEventListener(name, (e) => {
        e.preventDefault(); e.stopPropagation();
        dropzoneBox.classList.remove('dragover');
      }, false);
    });

    dropzoneBox.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        processUploadedFile(dt.files[0]);
      }
    });

    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        reset();
      });
    }

    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const presetId = btn.getAttribute('data-preset');
        selectPreset(presetId);
      });
    });

    selectPreset('tomato-early-blight');
  }

  function handleFileSelect(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      processUploadedFile(files[0]);
    }
  }

  function processUploadedFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (JPG, PNG, WebP).', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size exceeds 10MB limit.', 'error');
      return;
    }

    selectedFile = file;
    activePresetId = null;
    document.querySelectorAll('.preset-item-btn').forEach(b => b.classList.remove('active'));

    const reader = new FileReader();
    reader.onload = function(event) {
      selectedImageDataUrl = event.target.result;
      renderPreview(selectedImageDataUrl, file.name, (file.size / 1024).toFixed(1) + ' KB');
      showToast('Image loaded successfully! Ready for AI analysis.', 'success');
    };
    reader.readAsDataURL(file);
  }

  function selectPreset(presetId) {
    if (!PRESET_LEAF_SVGS[presetId]) return;
    activePresetId = presetId;
    selectedFile = null;
    selectedImageDataUrl = PRESET_LEAF_SVGS[presetId];

    document.querySelectorAll('.preset-item-btn').forEach(b => {
      if (b.getAttribute('data-preset') === presetId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    const titles = {
      'tomato-early-blight': 'Tomato Early Blight Preset',
      'rice-leaf-blast': 'Rice Leaf Blast Preset',
      'cotton-leaf-spot': 'Cotton Leaf Spot Preset',
      'potato-early-blight': 'Potato Early Blight Preset',
      'healthy-tomato': 'Healthy Tomato Foliage'
    };

    renderPreview(selectedImageDataUrl, titles[presetId] || 'Preset Sample', 'Demo Preset');
  }

  function renderPreview(imgSrc, title, sizeStr) {
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const previewFileName = document.getElementById('previewFileName');
    const previewFileSize = document.getElementById('previewFileSize');
    const dropzoneBox = document.getElementById('dropzoneBox');

    if (previewContainer && previewImage) {
      previewImage.src = imgSrc;
      if (previewFileName) previewFileName.textContent = title;
      if (previewFileSize) previewFileSize.textContent = sizeStr;
      previewContainer.classList.add('active');
      if (dropzoneBox) dropzoneBox.style.display = 'none';
    }
  }

  function reset() {
    selectedFile = null;
    selectedImageDataUrl = null;
    activePresetId = null;
    const fileInput = document.getElementById('cropFileInput');
    if (fileInput) fileInput.value = '';
    const previewContainer = document.getElementById('previewContainer');
    const dropzoneBox = document.getElementById('dropzoneBox');
    if (previewContainer) previewContainer.classList.remove('active');
    if (dropzoneBox) dropzoneBox.style.display = 'block';
    document.querySelectorAll('.preset-item-btn').forEach(b => b.classList.remove('active'));
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast ' + (type === 'error' ? 'toast-error' : '');
    toast.innerHTML = '<span>' + (type === 'error' ? '??' : '?') + '</span><span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  return {
    init,
    selectPreset,
    reset,
    getSelectedImage: () => selectedImageDataUrl,
    getSelectedFile: () => selectedFile,
    getActivePreset: () => activePresetId,
    showToast
  };
})();
