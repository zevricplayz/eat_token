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
providerBtns.forEach(btn => {
    btn.addEventListener('click', handleProviderLogin);
});

// Generate Token Function
function generateToken() {
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Please paste a callback URL');
        return;
    }

    try {
        // Extract EAT token from URL
        const eatToken = extractEATToken(url);
        
        if (!eatToken) {
            showError('EAT token not found in the URL. Make sure you pasted the correct callback URL.');
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
            parameters: params,
            generated_at: new Date().toISOString()
        };

        // Display output
        eatTokenOutput.textContent = eatToken;
        tokenResponseOutput.textContent = accessToken;
        fullResponseOutput.textContent = JSON.stringify(fullResponse, null, 2);
        
        outputSection.style.display = 'block';
        outputSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        showError('Error processing URL: ' + error.message);
        console.error(error);
    }
}

// Extract EAT Token from URL
function extractEATToken(url) {
    // Try different URL formats
    const patterns = [
        /[?&]eat=([^&]+)/i,
        /eat=([^&/]+)/i,
    ];

    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            const token = match[1];
            if (token.length > 10) {
                return decodeURIComponent(token);
            }
        }
    }

    return null;
}

// Extract URL Parameters - FIXED
function extractParams(url) {
    const params = {};
    
    try {
        // Try to parse as full URL
        let urlObj;
        if (url.startsWith('http')) {
            urlObj = new URL(url);
        } else {
            // If not full URL, try to extract query string
            urlObj = new URL('http://example.com' + (url.includes('?') ? url.substring(url.indexOf('?')) : '?' + url));
        }
        
        urlObj.searchParams.forEach((value, key) => {
            params[key] = decodeURIComponent(value);
        });
    } catch (e) {
        // If URL parsing fails, try manual extraction
        const queryMatch = url.match(/[?&]([^&=]+)=([^&]*)/g);
        if (queryMatch) {
            queryMatch.forEach(pair => {
                const [key, value] = pair.replace(/[?&]/, '').split('=');
                params[key] = decodeURIComponent(value || '');
            });
        }
    }

    return params;
}

// Generate Access Token
function generateAccessToken(eatToken) {
    // Simulate access token generation
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const accessToken = `ff_access_${btoa(eatToken.substring(0, 10))}_${timestamp}_${randomStr}`;
    
    return accessToken;
}

// Copy to Clipboard
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showError('Failed to copy to clipboard');
    });
}

// Show Error Message
function showError(message) {
    alert('❌ Error: ' + message);
}

// Show Success Message
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
        z-index: 1000;
        animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = '✅ ' + message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Clear All
function clearAll() {
    urlInput.value = '';
    outputSection.style.display = 'none';
    urlInput.focus();
}

// Handle Provider Login
function handleProviderLogin(event) {
    const provider = event.currentTarget.querySelector('span').textContent;
    const garenaAuthUrl = 'https://account.garena.com/login';
    
    alert(`Redirecting to Garena login for ${provider}...\n\nAfter login, look for callback URLs in your browser history containing:\n- /callback/?eat=\n- ?eat=\n\nThen paste the full URL here to generate your access token.`);
    
    // In production, you would redirect to actual OAuth URLs
    window.open(garenaAuthUrl, '_blank');
}

// Initialize
console.log('Free Fire EAT Token Generator loaded successfully!');
