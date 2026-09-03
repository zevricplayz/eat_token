// Simpler inline approach - all handlers on window
console.log('Script loaded!');

// Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Ready!');
    initializeApp();
});

function initializeApp() {
    console.log('Initializing app...');
    
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const providerBtns = document.querySelectorAll('.provider-btn');
    
    console.log('Found:', {
        generateBtn: !!generateBtn,
        clearBtn: !!clearBtn,
        providers: providerBtns.length
    });
    
    // Attach click handlers
    if (generateBtn) {
        generateBtn.onclick = generateToken;
        console.log('Generate button attached');
    }
    
    if (clearBtn) {
        clearBtn.onclick = clearAll;
        console.log('Clear button attached');
    }
    
    if (providerBtns.length > 0) {
        providerBtns.forEach((btn, index) => {
            btn.onclick = handleProviderLogin;
            console.log('Provider button', index, 'attached');
        });
    }
}

function generateToken() {
    console.log('Generate token clicked!');
    
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('❌ Please paste a callback URL');
        return;
    }
    
    console.log('URL:', url.substring(0, 50));
    
    // Find EAT token
    const eatMatch = url.match(/[?&]eat=([^&]+)/i);
    if (!eatMatch) {
        alert('❌ EAT token not found!\n\nMake sure URL contains: ?eat=');
        return;
    }
    
    const eatToken = decodeURIComponent(eatMatch[1]);
    console.log('Token found:', eatToken.substring(0, 20) + '...');
    
    // Extract all parameters
    const params = {};
    const paramRegex = /[?&]([^&=]+)=([^&]*)/g;
    let match;
    while ((match = paramRegex.exec(url)) !== null) {
        params[match[1]] = decodeURIComponent(match[2] || '');
    }
    
    // Generate access token
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const accessToken = `ff_access_${random}_${timestamp}`;
    
    // Create response
    const response = {
        eat_token: eatToken,
        access_token: accessToken,
        token_type: 'Bearer',
        expires_in: 3600,
        parameters: params,
        generated_at: new Date().toISOString()
    };
    
    // Display results
    const outputSection = document.getElementById('outputSection');
    const eatTokenOutput = document.getElementById('eatTokenOutput');
    const tokenResponseOutput = document.getElementById('tokenResponseOutput');
    const fullResponseOutput = document.getElementById('fullResponseOutput');
    
    eatTokenOutput.textContent = eatToken;
    tokenResponseOutput.textContent = accessToken;
    fullResponseOutput.textContent = JSON.stringify(response, null, 2);
    
    outputSection.style.display = 'block';
    outputSection.scrollIntoView({ behavior: 'smooth' });
    
    showNotification('✅ Token generated successfully!', 'success');
}

function clearAll() {
    console.log('Clear clicked!');
    
    document.getElementById('urlInput').value = '';
    document.getElementById('outputSection').style.display = 'none';
    document.getElementById('eatTokenOutput').textContent = '';
    document.getElementById('tokenResponseOutput').textContent = '';
    document.getElementById('fullResponseOutput').textContent = '';
    document.getElementById('urlInput').focus();
    
    showNotification('✅ Cleared!', 'success');
}

function handleProviderLogin(e) {
    console.log('Provider clicked!');
    const provider = e.target.closest('.provider-btn').querySelector('span').textContent;
    console.log('Provider:', provider);
    
    showNotification('🔐 Opening ' + provider + ' login...', 'info');
    
    setTimeout(() => {
        alert(`📝 Steps for ${provider} login:\n\n1. Login to your Garena account\n2. After redirect, check browser history (Ctrl+H)\n3. Look for URLs containing "?eat="\n4. Copy the full callback URL\n5. Paste it here and click Generate!\n\n⚠️ Only URLs with ?eat= parameter will work`);
    }, 300);
    
    window.open('https://account.garena.com/login', '_blank');
}

function copyToClipboard(elementId) {
    console.log('Copy clicked:', elementId);
    
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    if (!text) {
        showNotification('❌ Nothing to copy!', 'error');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✅ Copied to clipboard!', 'success');
    }).catch(err => {
        console.error(err);
        showNotification('❌ Failed to copy!', 'error');
    });
}

function showNotification(message, type = 'info') {
    const div = document.createElement('div');
    const bgColor = type === 'success' ? '#4ade80' : 
                   type === 'error' ? '#ef4444' : '#3b82f6';
    const textColor = type === 'success' ? '#000' : '#fff';
    
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 2000;
    `;
    div.textContent = message;
    document.body.appendChild(div);
    
    const duration = type === 'error' ? 4000 : 3000;
    setTimeout(() => div.remove(), duration);
}

console.log('✅ Script ready!');
