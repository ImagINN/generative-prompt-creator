/**
 * Prompt Creator - Gemini AI için Görsel & Video Prompt Oluşturucu
 */

// DOM Elements
const modeSwitch = document.getElementById('modeSwitch');
const modeDescription = document.getElementById('modeDescription');
const modeBadge = document.getElementById('modeBadge');
const modeHint = document.getElementById('modeHint');
const motionGroup = document.getElementById('motionGroup');
const promptPreview = document.getElementById('promptPreview');
const copyBtn = document.getElementById('copyBtn');
const sendToGeminiBtn = document.getElementById('sendToGemini');
const btnText = document.getElementById('btnText');
const toast = document.getElementById('toast');

// Form Elements
const formElements = {
    subject: document.getElementById('subject'),
    style: document.getElementById('style'),
    mood: document.getElementById('mood'),
    lighting: document.getElementById('lighting'),
    camera: document.getElementById('camera'),
    motion: document.getElementById('motion'),
    details: document.getElementById('details'),
    tags: document.querySelectorAll('.tag-chip input')
};

// Style translations for better prompts
const styleTranslations = {
    'realistic': 'realistic, photorealistic',
    'anime': 'anime style, anime art',
    'cartoon': 'cartoon style, illustrated',
    'oil-painting': 'oil painting style, classical art',
    'watercolor': 'watercolor painting, soft edges',
    'digital-art': 'digital art, digital illustration',
    '3d-render': '3D render, 3D art, CGI',
    'pixel-art': 'pixel art, 8-bit style',
    'cyberpunk': 'cyberpunk style, neon, futuristic',
    'fantasy': 'fantasy art, magical, ethereal',
    'minimalist': 'minimalist, clean, simple',
    'vintage': 'vintage, retro, nostalgic',
    'cinematic': 'cinematic, movie still, dramatic',
    'photographic': 'professional photography, DSLR'
};

const moodTranslations = {
    'dramatic': 'dramatic atmosphere, intense mood',
    'peaceful': 'peaceful, serene, calm',
    'mysterious': 'mysterious, enigmatic, intriguing',
    'energetic': 'energetic, dynamic, vibrant',
    'melancholic': 'melancholic, sad, emotional',
    'joyful': 'joyful, happy, cheerful',
    'dark': 'dark atmosphere, moody, shadowy',
    'bright': 'bright, luminous, radiant',
    'ethereal': 'ethereal, dreamy, otherworldly',
    'intense': 'intense, powerful, striking'
};

const lightingTranslations = {
    'golden-hour': 'golden hour lighting, warm sunlight',
    'blue-hour': 'blue hour, twilight, cool tones',
    'studio': 'studio lighting, professional lighting',
    'natural': 'natural lighting, ambient light',
    'neon': 'neon lighting, colorful lights',
    'moonlight': 'moonlight, night scene, lunar glow',
    'dramatic': 'dramatic lighting, chiaroscuro',
    'soft': 'soft lighting, diffused light',
    'backlit': 'backlit, rim lighting, silhouette',
    'volumetric': 'volumetric lighting, god rays, light beams'
};

const cameraTranslations = {
    'close-up': 'close-up shot, detailed view',
    'wide-shot': 'wide shot, establishing shot',
    'birds-eye': "bird's eye view, top-down perspective",
    'low-angle': 'low angle shot, looking up',
    'portrait': 'portrait composition, centered subject',
    'landscape': 'landscape orientation, scenic view',
    'macro': 'macro shot, extreme close-up',
    'dutch-angle': 'dutch angle, tilted frame',
    'symmetrical': 'symmetrical composition, balanced',
    'dynamic': 'dynamic angle, action shot'
};

const motionTranslations = {
    'zoom-in': 'slow zoom in',
    'zoom-out': 'slow zoom out',
    'pan-left': 'pan left',
    'pan-right': 'pan right',
    'tilt-up': 'tilt up',
    'tilt-down': 'tilt down',
    'tracking': 'tracking shot, following movement',
    'orbit': 'orbit shot, rotating around subject',
    'static': 'static camera, fixed position',
    'slow-motion': 'slow motion effect',
    'time-lapse': 'time-lapse effect'
};

// Current Mode
let isVideoMode = false;
let currentPrompt = '';

// Initialize
function init() {
    // Add event listeners
    modeSwitch.addEventListener('change', handleModeSwitch);
    copyBtn.addEventListener('click', copyPrompt);
    sendToGeminiBtn.addEventListener('click', sendToGemini);
    
    // Add input listeners to all form elements
    Object.values(formElements).forEach(element => {
        if (element instanceof NodeList) {
            element.forEach(el => el.addEventListener('change', updatePrompt));
        } else if (element) {
            element.addEventListener('input', updatePrompt);
            element.addEventListener('change', updatePrompt);
        }
    });
    
    // Initial update
    updatePrompt();
}

// Handle Mode Switch
function handleModeSwitch() {
    isVideoMode = modeSwitch.checked;
    
    // Update body class
    document.body.classList.toggle('video-mode', isVideoMode);
    
    // Update UI elements
    if (isVideoMode) {
        modeDescription.innerHTML = '🎬 Video üretim modu aktif';
        modeBadge.textContent = 'Video Modu';
        modeHint.innerHTML = '🎬 Video üretim ayarları ile açılacak';
        motionGroup.classList.add('active');
    } else {
        modeDescription.innerHTML = '🖼️ Görsel üretim modu aktif';
        modeBadge.textContent = 'Görsel Modu';
        modeHint.innerHTML = '🖼️ Görsel üretim ayarları ile açılacak';
        motionGroup.classList.remove('active');
    }
    
    // Update prompt
    updatePrompt();
}

// Generate Prompt
function generatePrompt() {
    const parts = [];
    
    // Subject (required for a valid prompt)
    const subject = formElements.subject.value.trim();
    if (subject) {
        parts.push(subject);
    }
    
    // Style
    const style = formElements.style.value;
    if (style && styleTranslations[style]) {
        parts.push(styleTranslations[style]);
    }
    
    // Mood
    const mood = formElements.mood.value;
    if (mood && moodTranslations[mood]) {
        parts.push(moodTranslations[mood]);
    }
    
    // Lighting
    const lighting = formElements.lighting.value;
    if (lighting && lightingTranslations[lighting]) {
        parts.push(lightingTranslations[lighting]);
    }
    
    // Camera/Composition
    const camera = formElements.camera.value;
    if (camera && cameraTranslations[camera]) {
        parts.push(cameraTranslations[camera]);
    }
    
    // Motion (video only)
    if (isVideoMode) {
        const motion = formElements.motion.value;
        if (motion && motionTranslations[motion]) {
            parts.push(motionTranslations[motion]);
        }
    }
    
    // Additional details
    const details = formElements.details.value.trim();
    if (details) {
        parts.push(details);
    }
    
    // Quality tags
    const selectedTags = [];
    formElements.tags.forEach(tag => {
        if (tag.checked) {
            selectedTags.push(tag.value);
        }
    });
    if (selectedTags.length > 0) {
        parts.push(selectedTags.join(', '));
    }
    
    return parts.join(', ');
}

// Update Prompt Preview
function updatePrompt() {
    currentPrompt = generatePrompt();
    
    if (currentPrompt) {
        promptPreview.innerHTML = `<span>${currentPrompt}</span>`;
        sendToGeminiBtn.disabled = false;
    } else {
        promptPreview.innerHTML = '<p class="preview-placeholder">Prompt oluşturmak için yukarıdaki parametreleri doldurun...</p>';
        sendToGeminiBtn.disabled = true;
    }
}

// Copy Prompt to Clipboard
async function copyPrompt() {
    if (!currentPrompt) return;
    
    try {
        await navigator.clipboard.writeText(currentPrompt);
        showToast();
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentPrompt;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast();
    }
}

// Show Toast Notification
function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Send to Gemini
function sendToGemini() {
    if (!currentPrompt) return;
    
    // Encode the prompt for URL
    const encodedPrompt = encodeURIComponent(currentPrompt);
    
    // Gemini URL with appropriate settings
    // For image generation: include image generation instruction
    // For video generation: include video generation instruction
    
    let geminiUrl;
    
    if (isVideoMode) {
        // Video generation mode
        // We'll add a prefix to make Gemini understand we want video
        const videoPrompt = `Generate a video: ${currentPrompt}`;
        geminiUrl = `https://gemini.google.com/app?hl=tr&q=${encodeURIComponent(videoPrompt)}`;
    } else {
        // Image generation mode
        // We'll add a prefix to make Gemini understand we want an image
        const imagePrompt = `Generate an image: ${currentPrompt}`;
        geminiUrl = `https://gemini.google.com/app?hl=tr&q=${encodeURIComponent(imagePrompt)}`;
    }
    
    // Open Gemini in a new tab
    window.open(geminiUrl, '_blank');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
