// DOM Elements
const urlInput = document.getElementById('urlInput');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const outputSection = document.getElementById('outputSection');
const eatTokenOutput = document.getElementById('eatTokenOutput');
const tokenResponseOutput = document.getElementById('tokenResponseOutput');
const fullResponseOutput = document.getElementById('fullResponseOutput');
const providerBtns = document.querySelectorAll('.provider-btn');

// Event Listeners
generateBtn.addEventListener('click', generateToken);
clearBtn.addEventListener('click', clearAll);
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) generateToken();
});

providerBtns.forEach(btn => {
    btn.addEventListener('click', handleProviderLogin);
});

// Generate Token Function with Enhanced Error Handling
function generateToken() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('⚠️ Please paste a callback URL');
        urlInput.focus();
        return;
    }

    try {
        // Validate URL format
        if (!isValidURLFormat(url)) {
            showError('❌ Invalid URL format. Please paste a valid callback URL.');
            return;
        }

        // Extract EAT token from URL
        const eatToken = extractEATToken(url);
        
        if (!eatToken) {
            showError('❌ EAT token not found! Make sure you pasted the correct callback URL containing "?eat=" parameter.');
            return;
        }

        // Extract other parameters
        const params = extractParams(url);
        
        // Generate access token response
        const accessToken = generateAccessToken(eatToken);
        const fullResponse = {
            eat_token: eatToken,
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: 3600,
            scope: 'user:email user:profile',
            parameters: params,
            generated_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 3600000).toISOString()
        };

        // Display output
        eatTokenOutput.textContent = eatToken;
        tokenResponseOutput.textContent = accessToken;
        fullResponseOutput.textContent = JSON.stringify(fullResponse, null, 2);
        
        outputSection.style.display = 'block';
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        showSuccess('✅ Token generated successfully!');
        
    } catch (error) {
        showError('❌ Error: ' + error.message);
        console.error('Generation Error:', error);
    }
}

// Validate URL Format
function isValidURLFormat(url) {
    // Check if it looks like a valid URL or contains query parameters
    const urlPatterns = [
        /^https?:\/\//i,
        /\?eat=/i,
        /eat=/i
    ];
    
    return urlPatterns.some(pattern => pattern.test(url));
}

// Extract EAT Token from URL - IMPROVED
function extractEATToken(url) {
    const patterns = [
        /[?&]eat=([^&]+)/i,
        /eat=([^&/]+)/i,
        /eat=([a-zA-Z0-9_\-\.]+)/i
    ];

    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            const token = match[1].trim();
            // Token should be at least 10 characters and not a URL
            if (token.length >= 10 && !token.includes('http') && !token.includes('://')) {
                try {
                    return decodeURIComponent(token);
                } catch (e) {
                    console.warn('Decoding error, returning raw token:', token);
                    return token;
                }
            }
        }
    }

    return null;
}

// Extract URL Parameters - IMPROVED with better error handling
function extractParams(url) {
    const params = {};
    
    try {
        // Try to parse as full URL
        let urlObj;
        if (url.startsWith('http')) {
            urlObj = new URL(url);
        } else {
            // If not full URL, add protocol and try again
            const protocoledUrl = url.startsWith('//') ? 'https:' + url : 'https://' + url;
            urlObj = new URL(protocoledUrl);
        }
        
        // Extract all parameters
        urlObj.searchParams.forEach((value, key) => {
            try {
                params[key] = decodeURIComponent(value);
            } catch (e) {
                params[key] = value;
            }
        });
        
        // If no params found, try manual extraction
        if (Object.keys(params).length === 0) {
            const queryMatch = url.match(/[?&]([^&=]+)=([^&]*)/g);
            if (queryMatch) {
                queryMatch.forEach(pair => {
                    const [key, value] = pair.replace(/[?&]/, '').split('=');
                    params[key] = decodeURIComponent(value || '');
                });
            }
        }
    } catch (e) {
        console.error('URL parsing error:', e);
        // Fallback: manual extraction
        const queryMatch = url.match(/[?&]([^&=]+)=([^&]*)/g);
        if (queryMatch) {
            queryMatch.forEach(pair => {
                const [key, value] = pair.replace(/[?&]/, '').split('=');
                try {
                    params[key] = decodeURIComponent(value || '');
                } catch {
                    params[key] = value || '';
                }
            });
        }
    }

    return params;
}

// Generate Access Token - More realistic format
function generateAccessToken(eatToken) {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const tokenHash = btoa(eatToken.substring(0, 10) + timestamp).substring(0, 20);
    const accessToken = `ff_access_${tokenHash}_${randomStr}`;
    
    return accessToken;
}

// Copy to Clipboard - Enhanced
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    if (!text) {
        showError('❌ Nothing to copy!');
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('✅ Copied to clipboard!');
    }).catch(err => {
        console.error('Copy failed:', err);
        // Fallback for older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showSuccess('✅ Copied to clipboard!');
        } catch (e) {
            showError('❌ Failed to copy! Try manually selecting and copying.');
        }
    });
}

// Show Error Message - Enhanced
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 2000;
        animation: slideDown 0.3s ease-out;
        border-left: 4px solid #dc2626;
        max-width: 300px;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 4000);
}

// Show Success Message - Enhanced
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4ade80;
        color: #000;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 2000;
        animation: slideDown 0.3s ease-out;
        border-left: 4px solid #22c55e;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Clear All - Enhanced
function clearAll() {
    urlInput.value = '';
    outputSection.style.display = 'none';
    eatTokenOutput.textContent = '';
    tokenResponseOutput.textContent = '';
    fullResponseOutput.textContent = '';
    urlInput.focus();
    showSuccess('✅ Cleared!');
}

// Handle Provider Login - Enhanced
function handleProviderLogin(event) {
    const provider = event.currentTarget.querySelector('span').textContent;
    const garenaAuthUrl = 'https://account.garena.com/login';
    
    showSuccess(`🔐 Opening ${provider} login...`);
    
    setTimeout(() => {
        alert(`📝 Steps for ${provider} login:\n\n1. Complete login on Garena page\n2. You'll be redirected\n3. Check browser history (Ctrl+H)\n4. Look for URLs with "?eat=" parameter\n5. Copy the full callback URL\n6. Paste it here and click Generate!\n\nNote: Only the callback URL with ?eat= parameter will work.`);
    }, 500);
    
    window.open(garenaAuthUrl, '_blank');
}

// Add keyboard shortcut listener
document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+C to clear
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        clearAll();
        e.preventDefault();
    }
});

// Initialize with console message
console.log('%c🔥 Free Fire EAT Token Generator v2.0', 'color: #ff6b00; font-size: 16px; font-weight: bold;');
console.log('%cReady to generate tokens! 🚀', 'color: #4ade80; font-size: 12px;');
