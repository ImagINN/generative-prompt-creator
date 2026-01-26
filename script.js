/**
 * ImagINN - Profesyonel Prompt Oluşturucu
 * Master görsel desteği ve gelişmiş şablon sistemi
 */

// ========================================
// DOM Elements
// ========================================
const uploadArea = document.getElementById('uploadArea');
const masterImageInput = document.getElementById('masterImage');
const uploadContent = document.getElementById('uploadContent');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const removeImageBtn = document.getElementById('removeImage');
const promptPreview = document.getElementById('promptPreview');
const copyBtn = document.getElementById('copyBtn');
const sendToGeminiBtn = document.getElementById('sendToGemini');
const toast = document.getElementById('toast');
const tooltip = document.getElementById('tooltip');

// Form Elements
const formElements = {
    subject: document.getElementById('subject'),
    environment: document.getElementById('environment'),
    typography: document.getElementById('typography'),
    manualCommands: document.getElementById('manualCommands')
};

// Selection Groups
const selectionGroups = {
    aspectRatio: null,
    cameraAngle: null,
    shotScale: null,
    lens: null,
    style: null,
    lighting: null,
    colorPalette: null
};

// Master Image Data
let masterImageData = null;
let currentPrompt = '';

// ========================================
// Translation Maps
// ========================================
const translations = {
    aspectRatio: {
        '1:1': '1:1 square aspect ratio',
        '4:3': '4:3 aspect ratio',
        '3:4': '3:4 vertical aspect ratio',
        '16:9': '16:9 widescreen aspect ratio',
        '9:16': '9:16 vertical/portrait aspect ratio',
        '21:9': '21:9 ultrawide cinematic aspect ratio'
    },
    cameraAngle: {
        'eye-level': 'eye level camera angle',
        'shoulder-level': 'shoulder level camera angle',
        'waist-level': 'waist level camera angle',
        'knee-level': 'knee level camera angle',
        'ground-level': 'ground level shot',
        'worms-eye': "worm's eye view, looking up from ground",
        'low-angle': 'low angle shot, looking up',
        'high-angle': 'high angle shot, looking down',
        'birds-eye': "bird's eye view, top-down perspective",
        'drone-shot': 'aerial drone shot',
        'satellite': 'satellite view, extreme aerial perspective',
        'dutch-angle': 'dutch angle, tilted frame'
    },
    shotScale: {
        'extreme-close-up': 'extreme close-up shot, detail shot',
        'close-up': 'close-up shot, face detail',
        'medium-close-up': 'medium close-up, shoulder shot',
        'medium-shot': 'medium shot, waist up',
        'medium-full': 'medium full shot, knee up',
        'full-shot': 'full body shot',
        'wide-shot': 'wide shot, full figure with environment',
        'extreme-wide': 'extreme wide shot, establishing shot'
    },
    lens: {
        '14mm-ultra-wide': '14mm ultra wide angle lens, dramatic perspective',
        '24mm-wide': '24mm wide angle lens',
        '35mm-wide': '35mm wide lens, natural perspective',
        '50mm-natural': '50mm lens, natural field of view',
        '85mm-portrait': '85mm portrait lens, shallow depth of field',
        '135mm-tele': '135mm telephoto lens, compressed perspective',
        '200mm-tele': '200mm telephoto lens, strong background compression',
        'macro': 'macro lens, extreme close-up detail'
    },
    style: {
        'photorealistic': 'photorealistic, hyperrealistic, 8K UHD',
        'cinematic': 'cinematic style, movie still, film grain',
        'anime': 'anime style, anime art, Japanese animation',
        'manga': 'manga style, black and white manga art',
        'oil-painting': 'oil painting style, classical art, brush strokes visible',
        'watercolor': 'watercolor painting, soft edges, flowing colors',
        'digital-art': 'digital art, digital illustration, modern art',
        '3d-render': '3D render, 3D art, CGI, Octane render',
        'pixel-art': 'pixel art, 8-bit style, retro game aesthetic',
        'cyberpunk': 'cyberpunk style, neon lights, futuristic dystopia',
        'fantasy': 'fantasy art, magical, ethereal, mythical',
        'minimalist': 'minimalist style, clean, simple, modern',
        'vintage': 'vintage style, retro, nostalgic, old photograph',
        'sketch': 'pencil sketch, hand-drawn, artistic sketch',
        'comic-book': 'comic book style, bold lines, halftone dots',
        'pop-art': 'pop art style, bold colors, Andy Warhol inspired'
    },
    lighting: {
        'natural': 'natural lighting, ambient daylight',
        'golden-hour': 'golden hour lighting, warm sunset light',
        'blue-hour': 'blue hour lighting, twilight, cool tones',
        'studio': 'professional studio lighting, controlled lighting',
        'soft-light': 'soft diffused lighting, gentle shadows',
        'hard-light': 'hard lighting, strong shadows, high contrast',
        'backlit': 'backlit, rim lighting, light from behind',
        'rim-light': 'rim light, edge lighting, subject outline',
        'neon': 'neon lighting, colorful neon lights, cyberpunk',
        'moonlight': 'moonlight, night scene, lunar glow',
        'candlelight': 'candlelight, warm intimate lighting',
        'volumetric': 'volumetric lighting, god rays, light beams',
        'dramatic': 'dramatic lighting, high contrast, moody',
        'chiaroscuro': 'chiaroscuro lighting, strong light-dark contrast',
        'silhouette': 'silhouette lighting, backlit figure',
        'foggy': 'foggy atmosphere, misty, atmospheric haze'
    },
    colorPalette: {
        'pastel': 'pastel color palette, soft muted colors',
        'vibrant': 'vibrant colors, saturated, bold colors',
        'muted': 'muted color palette, desaturated',
        'earth-tones': 'earth tones, natural brown and green colors',
        'monochrome': 'monochrome, single color variations',
        'black-white': 'black and white, grayscale, noir',
        'sepia': 'sepia tones, vintage brown tint',
        'warm': 'warm color palette, orange and red tones',
        'cool': 'cool color palette, blue and green tones',
        'teal-orange': 'teal and orange color grading, cinematic',
        'high-contrast': 'high contrast colors, bold shadows and highlights',
        'low-contrast': 'low contrast, flat lighting, soft tones',
        'neon-colors': 'neon colors, fluorescent, glowing',
        'gradient': 'gradient colors, smooth color transitions',
        'duotone': 'duotone effect, two-color scheme',
        'tritone': 'tritone effect, three-color scheme'
    }
};

// Role descriptions based on style
const roleDescriptions = {
    'photorealistic': 'dünyaca ünlü bir fotoğrafçı',
    'cinematic': 'ödüllü bir sinematograf',
    'anime': 'tanınmış bir anime sanatçısı',
    'manga': 'ünlü bir manga çizeri',
    'oil-painting': 'klasik bir yağlıboya ressamı',
    'watercolor': 'yetenekli bir suluboya sanatçısı',
    'digital-art': 'modern bir dijital sanatçı',
    '3d-render': 'profesyonel bir 3D sanatçısı',
    'pixel-art': 'retro oyun sanatçısı',
    'cyberpunk': 'gelecekçi bir konsept sanatçısı',
    'fantasy': 'fantastik illüstratör',
    'minimalist': 'minimalist tasarımcı',
    'vintage': 'nostaljik fotoğrafçı',
    'sketch': 'yetenekli bir çizer',
    'comic-book': 'çizgi roman sanatçısı',
    'pop-art': 'pop art sanatçısı',
    'default': 'profesyonel bir görsel sanatçı'
};

// ========================================
// Initialize
// ========================================
function init() {
    setupImageUpload();
    setupOptionButtons();
    setupTooltips();
    setupFormListeners();

    copyBtn.addEventListener('click', copyPrompt);
    sendToGeminiBtn.addEventListener('click', sendToGemini);

    updatePrompt();
}

// ========================================
// Image Upload Handling
// ========================================
function setupImageUpload() {
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    });

    // File input change
    masterImageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageFile(e.target.files[0]);
        }
    });

    // Remove image
    removeImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeImage();
    });
}

function handleImageFile(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Lütfen bir görsel dosyası seçin.');
        return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
        alert('Dosya boyutu 10MB\'dan küçük olmalıdır.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        masterImageData = e.target.result;
        previewImg.src = masterImageData;
        uploadArea.classList.add('has-image');
        updatePrompt();
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    masterImageData = null;
    previewImg.src = '';
    masterImageInput.value = '';
    uploadArea.classList.remove('has-image');
    updatePrompt();
}

// ========================================
// Option Button Selection
// ========================================
function setupOptionButtons() {
    const optionGrids = document.querySelectorAll('.option-grid');

    optionGrids.forEach(grid => {
        const groupName = grid.dataset.group;
        const buttons = grid.querySelectorAll('.option-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle selection
                if (btn.classList.contains('selected')) {
                    btn.classList.remove('selected');
                    selectionGroups[groupName] = null;
                } else {
                    // Remove selection from other buttons in same group
                    buttons.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    selectionGroups[groupName] = btn.dataset.value;
                }

                updatePrompt();
            });
        });
    });
}

// ========================================
// Tooltip System
// ========================================
function setupTooltips() {
    const infoButtons = document.querySelectorAll('.info-btn');

    infoButtons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            const tooltipText = btn.dataset.tooltip;
            if (!tooltipText) return;

            tooltip.textContent = tooltipText;
            tooltip.classList.add('visible');

            positionTooltip(e, btn);
        });

        btn.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });

        // Touch support
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tooltipText = btn.dataset.tooltip;
            if (!tooltipText) return;

            tooltip.textContent = tooltipText;
            tooltip.classList.toggle('visible');

            if (tooltip.classList.contains('visible')) {
                positionTooltip(e, btn);
            }
        });
    });

    // Hide tooltip when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.info-btn')) {
            tooltip.classList.remove('visible');
        }
    });
}

function positionTooltip(e, btn) {
    const rect = btn.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let top = rect.bottom + 10;

    // Keep tooltip in viewport
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }

    if (top + tooltipRect.height > window.innerHeight - 10) {
        top = rect.top - tooltipRect.height - 10;
    }

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
}

// ========================================
// Form Listeners
// ========================================
function setupFormListeners() {
    Object.values(formElements).forEach(element => {
        if (element) {
            element.addEventListener('input', updatePrompt);
            element.addEventListener('change', updatePrompt);
        }
    });
}

// ========================================
// Prompt Generation
// ========================================
function generatePrompt() {
    const subject = formElements.subject?.value?.trim() || '';
    const environment = formElements.environment?.value?.trim() || '';
    const typography = formElements.typography?.value?.trim() || '';
    const manualCommands = formElements.manualCommands?.value?.trim() || '';

    // If no selections made, return empty
    const hasSelections = Object.values(selectionGroups).some(v => v !== null);
    const hasTextInputs = subject || environment || typography || manualCommands;

    if (!hasSelections && !hasTextInputs && !masterImageData) {
        return '';
    }

    // Build the structured prompt
    const promptParts = [];

    // === ROL & BAĞLAM ===
    const selectedStyle = selectionGroups.style;
    const role = roleDescriptions[selectedStyle] || roleDescriptions.default;
    promptParts.push(`**[ROL & BAĞLAM]**`);
    promptParts.push(`Sen ${role}sın. Amacımız profesyonel, yüksek kaliteli bir görsel oluşturmak.`);
    promptParts.push('');

    // === SAHNE PLANI & MANTIK ===
    if (selectionGroups.lighting || selectionGroups.colorPalette || masterImageData) {
        promptParts.push(`**[SAHNE PLANI & MANTIK (Blueprint)]**`);
        let blueprintText = 'Görseli oluşturmadan önce şu mantığı kur: ';

        const blueprintDetails = [];
        if (selectionGroups.lighting) {
            blueprintDetails.push(`Işık ${translations.lighting[selectionGroups.lighting]} şeklinde düzenlenmeli`);
        }
        if (selectionGroups.colorPalette) {
            blueprintDetails.push(`Renk paleti ${translations.colorPalette[selectionGroups.colorPalette]} olarak uygulanmalı`);
        }
        if (masterImageData) {
            blueprintDetails.push('Referans görselindeki kompozisyon ve atmosfer dikkate alınmalı');
        }

        blueprintText += blueprintDetails.join('. ') + '.';
        promptParts.push(blueprintText);
        promptParts.push('');
    }

    // === ANA KONU (Subject) ===
    if (subject) {
        promptParts.push(`**[ANA KONU (Subject)]**`);
        let subjectText = `Görüntünün merkezinde ${subject}`;

        if (selectionGroups.shotScale) {
            subjectText += `. Çekim ölçeği: ${translations.shotScale[selectionGroups.shotScale]}`;
        }

        promptParts.push(subjectText);
        promptParts.push('');
    }

    // === ORTAM & ATMOSFER ===
    if (environment) {
        promptParts.push(`**[ORTAM & ATMOSFER]**`);
        promptParts.push(`Sahne ${environment}`);
        promptParts.push('');
    }

    // === TEKNİK DETAYLAR & IŞIK ===
    const technicalDetails = [];

    if (selectionGroups.aspectRatio) {
        technicalDetails.push(`**Aspect Ratio:** ${translations.aspectRatio[selectionGroups.aspectRatio]}`);
    }
    if (selectionGroups.cameraAngle) {
        technicalDetails.push(`**Kamera Açısı:** ${translations.cameraAngle[selectionGroups.cameraAngle]}`);
    }
    if (selectionGroups.lens) {
        technicalDetails.push(`**Lens:** ${translations.lens[selectionGroups.lens]}`);
    }
    if (selectionGroups.lighting) {
        technicalDetails.push(`**Işıklandırma:** ${translations.lighting[selectionGroups.lighting]}`);
    }
    if (selectionGroups.style) {
        technicalDetails.push(`**Stil:** ${translations.style[selectionGroups.style]}`);
    }
    if (selectionGroups.colorPalette) {
        technicalDetails.push(`**Renk Paleti:** ${translations.colorPalette[selectionGroups.colorPalette]}`);
    }

    if (technicalDetails.length > 0) {
        promptParts.push(`**[TEKNİK DETAYLAR & IŞIK]**`);
        promptParts.push(technicalDetails.join('\n'));
        promptParts.push('');
    }

    // === TYPOGRAPHY ===
    if (typography) {
        promptParts.push(`**[METİN (Typography)]**`);
        promptParts.push(`Görselin içinde şu metin net ve hatasız bir şekilde yer almalı: "${typography}"`);
        promptParts.push('');
    }

    // === MANUEL KOMUTLAR ===
    if (manualCommands) {
        promptParts.push(`**[EK DETAYLAR]**`);
        promptParts.push(manualCommands);
        promptParts.push('');
    }

    // === MASTER GÖRSEL REFERANSI ===
    if (masterImageData) {
        promptParts.push(`**[REFERANS]**`);
        promptParts.push('Yüklenen referans görseline benzer bir atmosfer ve kompozisyon kullanılmalı.');
        promptParts.push('');
    }

    return promptParts.join('\n').trim();
}

// Simple prompt for Gemini (without markdown formatting)
function generateSimplePrompt() {
    const subject = formElements.subject?.value?.trim() || '';
    const environment = formElements.environment?.value?.trim() || '';
    const typography = formElements.typography?.value?.trim() || '';
    const manualCommands = formElements.manualCommands?.value?.trim() || '';

    const parts = [];

    // Add prefix for image generation
    parts.push('Generate an image:');

    // Subject
    if (subject) {
        parts.push(subject);
    }

    // Environment
    if (environment) {
        parts.push(environment);
    }

    // Technical selections
    if (selectionGroups.style) {
        parts.push(translations.style[selectionGroups.style]);
    }
    if (selectionGroups.cameraAngle) {
        parts.push(translations.cameraAngle[selectionGroups.cameraAngle]);
    }
    if (selectionGroups.shotScale) {
        parts.push(translations.shotScale[selectionGroups.shotScale]);
    }
    if (selectionGroups.lens) {
        parts.push(translations.lens[selectionGroups.lens]);
    }
    if (selectionGroups.lighting) {
        parts.push(translations.lighting[selectionGroups.lighting]);
    }
    if (selectionGroups.colorPalette) {
        parts.push(translations.colorPalette[selectionGroups.colorPalette]);
    }
    if (selectionGroups.aspectRatio) {
        parts.push(translations.aspectRatio[selectionGroups.aspectRatio]);
    }

    // Typography
    if (typography) {
        parts.push(`text saying "${typography}"`);
    }

    // Manual commands
    if (manualCommands) {
        parts.push(manualCommands);
    }

    // Quality tags
    parts.push('high quality, detailed, professional');

    return parts.join(', ');
}

// ========================================
// Update Prompt Preview
// ========================================
function updatePrompt() {
    currentPrompt = generatePrompt();

    if (currentPrompt) {
        // Convert markdown-style formatting for display
        const formattedPrompt = currentPrompt
            .replace(/\*\*\[([^\]]+)\]\*\*/g, '<span class="section-label">[$1]</span>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        promptPreview.innerHTML = formattedPrompt;
        sendToGeminiBtn.disabled = false;
    } else {
        promptPreview.innerHTML = '<p class="preview-placeholder">Prompt oluşturmak için yukarıdaki parametreleri doldurun...</p>';
        sendToGeminiBtn.disabled = true;
    }
}

// ========================================
// Copy Prompt
// ========================================
async function copyPrompt() {
    if (!currentPrompt) return;

    // Remove markdown formatting for copy
    const plainPrompt = currentPrompt
        .replace(/\*\*/g, '')
        .replace(/\[/g, '[')
        .replace(/\]/g, ']');

    try {
        await navigator.clipboard.writeText(plainPrompt);
        showToast();
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = plainPrompt;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast();
    }
}

// ========================================
// Show Toast
// ========================================
function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// ========================================
// Send to Gemini
// ========================================
function sendToGemini() {
    if (!currentPrompt) return;

    // Use simple prompt for URL (without markdown formatting)
    const simplePrompt = generateSimplePrompt();
    const encodedPrompt = encodeURIComponent(simplePrompt);

    // Gemini URL
    const geminiUrl = `https://gemini.google.com/app?hl=tr&q=${encodedPrompt}`;

    // Open in new tab
    window.open(geminiUrl, '_blank');
}

// ========================================
// Initialize on DOM Ready
// ========================================
document.addEventListener('DOMContentLoaded', init);
