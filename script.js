// Initialize script
console.log('Script loaded!');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Ready - Initializing...');
    
    // Get all elements
    const urlInput = document.getElementById('urlInput');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const outputSection = document.getElementById('outputSection');
    const eatTokenOutput = document.getElementById('eatTokenOutput');
    const tokenResponseOutput = document.getElementById('tokenResponseOutput');
    const fullResponseOutput = document.getElementById('fullResponseOutput');
    const providerBtns = document.querySelectorAll('.provider-btn');
    
    console.log('Elements found:', {
        urlInput: !!urlInput,
        generateBtn: !!generateBtn,
        clearBtn: !!clearBtn,
        providerBtns: providerBtns.length
    });
    
    // Add event listeners
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            console.log('Generate clicked');
            generateToken();
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            console.log('Clear clicked');
            clearAll();
        });
    }
    
    if (providerBtns.length > 0) {
        providerBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                console.log('Provider clicked');
                handleProviderLogin(e);
            });
        });
    }
    
    // Generate Token Function
    function generateToken() {
        console.log('generateToken called');
        const url = urlInput.value.trim();
        
        if (!url) {
            showError('Please paste a callback URL');
            return;
        }
        
        console.log('URL:', url.substring(0, 50) + '...');
        
        // Extract EAT token
        const eatMatch = url.match(/[?&]eat=([^&]+)/i);
        if (!eatMatch || !eatMatch[1]) {
            showError('EAT token not found! Make sure the URL contains ?eat=');
            return;
        }
        
        const eatToken = decodeURIComponent(eatMatch[1]);
        console.log('EAT Token found:', eatToken.substring(0, 20) + '...');
        
        // Extract parameters
        const params = {};
        const paramMatches = url.match(/[?&]([^&=]+)=([^&]*)/g);
        if (paramMatches) {
            paramMatches.forEach(param => {
                const [key, value] = param.replace(/[?&]/, '').split('=');
                params[key] = decodeURIComponent(value || '');
            });
        }
        
        // Generate access token
        const accessToken = 'ff_access_' + Math.random().toString(36).substring(2, 15) + 
                          Math.random().toString(36).substring(2, 15);
        
        const fullResponse = {
            eat_token: eatToken,
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: 3600,
            parameters: params,
            generated_at: new Date().toISOString()
        };
        
        // Display results
        eatTokenOutput.textContent = eatToken;
        tokenResponseOutput.textContent = accessToken;
        fullResponseOutput.textContent = JSON.stringify(fullResponse, null, 2);
        
        outputSection.style.display = 'block';
        outputSection.scrollIntoView({ behavior: 'smooth' });
        
        showSuccess('Token generated successfully!');
    }
    
    // Clear All
    function clearAll() {
        urlInput.value = '';
        outputSection.style.display = 'none';
        eatTokenOutput.textContent = '';
        tokenResponseOutput.textContent = '';
        fullResponseOutput.textContent = '';
        urlInput.focus();
        showSuccess('Cleared!');
    }
    
    // Copy to Clipboard
    window.copyToClipboard = function(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        
        if (!text) {
            showError('Nothing to copy!');
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            showSuccess('Copied to clipboard!');
        }).catch(err => {
            console.error('Copy error:', err);
            showError('Failed to copy!');
        });
    };
    
    // Show Error
    function showError(message) {
        const div = document.createElement('div');
        div.style.cssText = `
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
        `;
        div.textContent = '❌ ' + message;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    }
    
    // Show Success
    function showSuccess(message) {
        const div = document.createElement('div');
        div.style.cssText = `
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
        `;
        div.textContent = '✅ ' + message;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
    
    // Handle Provider Login
    function handleProviderLogin(event) {
        const provider = event.currentTarget.querySelector('span').textContent;
        showSuccess('Opening ' + provider + ' login...');
        setTimeout(() => {
            alert('Login steps:\n\n1. Complete login on Garena\n2. Check browser history (Ctrl+H)\n3. Look for URLs with ?eat=\n4. Copy and paste here\n5. Click Generate!');
        }, 500);
        window.open('https://account.garena.com/login', '_blank');
    }
});

console.log('Script initialization complete!');
