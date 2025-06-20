function formatBalance(balance, currencySymbol = '₽') {
    const roundedBalance = Number(balance).toFixed(2);
    const [whole, decimal] = roundedBalance.split('.');
    const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedWhole},${decimal}&nbsp;${currencySymbol}`;
}

function updateBalanceDisplay(balance, currency) {
    const parentWindow = window.parent || window;
    const balanceElement = parentWindow.document.querySelector('.HeaderGameRelatedBalance_balance_YTN_l');
    
    if (balanceElement) {
        const currencySymbols = {
            "RUB": "₽",
            "USD": "$",
            "UZS": "S",
            "INR": "₹"
        };
        balanceElement.innerHTML = formatBalance(balance, currencySymbols[currency]);
        console.log('Balance updated:', balance, 'Currency:', currency);
    }
}

function getAccessKey() {
    // Если вы хотите полностью удалить логику access key, эта функция может возвращать null.
    // Если ваш бэкенд все еще требует ключ, но вы хотите обойти фактическую аутентификацию,
    // вы можете вернуть предопределенный, нечувствительный фиктивный ключ.
    return null;
}

let updateInterval = null;

function fetchBalance() {
    // Удалена проверка access key.
    // const accessKey = getAccessKey();
    // if (!accessKey) {
    //     console.error('Access key not found');
    //     return;
    // }

    fetch('/get_balance', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
            // Удален заголовок 'X-Access-Key', если он не нужен вашему бэкенду без аутентификации
            // 'X-Access-Key': accessKey 
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            updateBalanceDisplay(data.balance, data.currency);
        } else {
            console.error('Failed to fetch balance:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function startUpdates() {
    if (!updateInterval) {
        fetchBalance(); 
        updateInterval = setInterval(fetchBalance, 5000);
        console.log('Started balance updates');
    }
}

function stopUpdates() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
        console.log('Stopped balance updates');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const parentWindow = window.parent || window;
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const balanceElement = parentWindow.document.querySelector('.HeaderGameRelatedBalance_balance_YTN_l');
                if (balanceElement) {
                    startUpdates();
                    observer.disconnect();
                }
            }
        });
    });

    observer.observe(parentWindow.document.body, {
        childList: true,
        subtree: true
    });

    const balanceElement = parentWindow.document.querySelector('.HeaderGameRelatedBalance_balance_YTN_l');
    if (balanceElement) {
        startUpdates();
    }
});

window.updateGameBalance = function(newBalance) {
    updateBalanceDisplay(newBalance);
};

window.forceBalanceUpdate = function() {
    fetchBalance();
};

window.addEventListener('beforeunload', stopUpdates);
