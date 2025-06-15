function formatBalance(balance) {
    const roundedBalance = Number(balance).toFixed(2);
    const [whole, decimal] = roundedBalance.split('.');
    
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    

    return `${formattedWhole},${decimal}`;
}

let isUpdating = false;

function cleanupBalance(balanceElement) {

    if (!balanceElement) return;
    
    let content = balanceElement.textContent || '';
    
    content = content
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/[₽$S₹]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
        
    return content;
}

function updatePCBalance(balance, currency = 'RUB') {
    if (isUpdating) return;
    isUpdating = true;
    
    try {
        const parentWindow = window.top || window.parent || window;
        const balanceElement = parentWindow.document.querySelector('.HeaderBalanceInfo_balance_Gw9TU');
        const currencyNameElement = parentWindow.document.querySelector('.HeaderBalanceInfo_name_u2NJV');
        
        if (balanceElement) {

            balanceElement.innerHTML = '';

            balanceElement.textContent = formatBalance(balance);
            

            let content = balanceElement.textContent;
            if (content.includes('&amp;nbsp;') || content.includes('₽')) {
                content = content
                    .replace(/&amp;nbsp;/g, '')
                    .replace(/&nbsp;/g, '')
                    .replace(/₽/g, '')
                    .trim();
                balanceElement.textContent = content;
            }
        }

        if (currencyNameElement) {
            currencyNameElement.textContent = currency;
        }
    } finally {

        isUpdating = false;
    }
}

function fetchBalance() {
    const accessKey = localStorage.getItem('access_key') || 
                    localStorage.getItem('accessKey') || 
                    localStorage.getItem('key');
                    
    if (!accessKey) {
        console.error('Access key not found');
        return;
    }

    fetch('/get_balance', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': accessKey
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const numericBalance = parseFloat(data.balance);
            updatePCBalance(numericBalance, data.currency);
        }
    })
    .catch(error => {
        console.error('Error fetching balance:', error);
    });
}

window.updatePCBalance = updatePCBalance;


fetchBalance(); 
setInterval(fetchBalance, 5000);

document.addEventListener('DOMContentLoaded', function() {
    const parentWindow = window.top || window.parent || window;
    const balanceElement = parentWindow.document.querySelector('.HeaderBalanceInfo_balance_Gw9TU');
    
    if (balanceElement) {

        let content = balanceElement.textContent || '';
        content = content
            .replace(/&amp;nbsp;/g, '')
            .replace(/&nbsp;/g, '')
            .replace(/₽/g, '')
            .trim();
        
        if (content) {

            try {
                const numericValue = parseFloat(content.replace(/\s/g, '').replace(',', '.'));
                if (!isNaN(numericValue)) {
                    balanceElement.textContent = formatBalance(numericValue);
                }
            } catch (e) {
                console.error('Error formatting initial balance:', e);
            }
        }
    }
});
