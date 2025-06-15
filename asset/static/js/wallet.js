function checkAccessKey() {
    const accessKey = localStorage.getItem('access_key') || 
                     localStorage.getItem('accessKey') || 
                     localStorage.getItem('key');
    console.log('Found access_key:', accessKey);
    return accessKey;
}


function addBalanceClickHandler() {
    const balanceElement = document.querySelector('.HeaderGameRelatedBalance_balance_YTN_l');
    if (balanceElement) {
        balanceElement.style.cursor = 'pointer';
        balanceElement.onclick = showBalanceEditModal;
        console.log('Added click handler to balance element in game');
    }
}


function showBalanceEditModal() {
    const accessKey = checkAccessKey();
    if (!accessKey) {
        alert('Access key not found. Please login again.');
        return;
    }


    const modal = document.createElement('div');
    modal.className = 'balance-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 99999;
        display: flex;
        justify-content: center;
        align-items: center;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        background: rgba(0, 0, 0, 0.2);
    `;


    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        position: relative;
        background: rgba(28, 32, 40, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 30px;
        border-radius: 12px;
        width: 320px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
    `;

    modalContent.innerHTML = `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; gap: 10px;">
                <button onclick="switchTab('base')" id="baseTab" style="
                    flex: 1;
                    padding: 4px;
                    background: #2563eb;
                    border: none;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                ">База</button>
                <button onclick="switchTab('additional')" id="additionalTab" style="
                    flex: 1;
                    padding: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                ">Доп</button>
            </div>
        </div>

        <h3 style="
            font-size: 24px;
            color: #fff;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
        ">Изменение баланса</h3>
        
        <div id="baseContent">
        <input type="number" id="balanceInput" style="
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            font-size: 16px;
            color: #fff;
            transition: all 0.2s ease;
            box-sizing: border-box;
        " placeholder="Введите сумму" step="0.01" min="0">
        
        <div id="errorMessage" style="
            display: none;
            color: #ef4444;
            margin-top: 10px;
            text-align: center;
            font-size: 14px;
        "></div>
        
        <div style="margin: 20px 0;">
                <p style="color: #fff; margin-bottom: 10px; text-align: center; font-size: 16px;">
                    Язык игры:
                </p>
            <div style="display: flex; justify-content: space-between; gap: 10px;">
                <button onclick="changeGameLanguage('ru')" style="
                    flex: 1;
                    padding: 12px;
                    background: #2563eb;
                    border: none;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                ">RU</button>
                <button onclick="changeGameLanguage('en')" style="
                    flex: 1;
                    padding: 12px;
                    background: #2563eb;
                    border: none;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                ">EN</button>
                <button onclick="changeGameLanguage('uz')" style="
                    flex: 1;
                    padding: 12px;
                    background: #2563eb;
                    border: none;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                ">UZ</button>
                <button onclick="changeGameLanguage('hi')" style="
                    flex: 1;
                    padding: 12px;
                    background: #2563eb;
                    border: none;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                ">HI</button>
            </div>
        </div>

            <div style="margin: 20px 0;">
                <p style="color: #fff; margin-bottom: 10px; text-align: center; font-size: 16px;">
                    Валюта:
                </p>
                <div style="display: flex; justify-content: space-between; gap: 10px;">
                    <button onclick="changeCurrency('RUB')" style="
                        flex: 1;
                        padding: 12px;
                        background: #2563eb;
                        border: none;
                        border-radius: 6px;
                        color: #fff;
                        font-size: 16px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">RUB</button>
                    <button onclick="changeCurrency('USD')" style="
                        flex: 1;
                        padding: 12px;
                        background: #2563eb;
                        border: none;
                        border-radius: 6px;
                        color: #fff;
                        font-size: 16px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">USD</button>
                    <button onclick="changeCurrency('UZS')" style="
                        flex: 1;
                        padding: 12px;
                        background: #2563eb;
                        border: none;
                        border-radius: 6px;
                        color: #fff;
                        font-size: 16px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">UZS</button>
                    <button onclick="changeCurrency('INR')" style="
                        flex: 1;
                        padding: 12px;
                        background: #2563eb;
                        border: none;
                        border-radius: 6px;
                        color: #fff;
                        font-size: 16px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    ">INR</button>
                </div>
            </div>

        <button id="saveButton" style="
            width: 100%;
            padding: 12px;
            background: #2563eb;
            border: none;
            border-radius: 6px;
            color: #fff;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        ">Сохранить</button>
        </div>

        <div id="additionalContent" style="display: none;">
            <p style="
                color: #fff;
                margin-bottom: 20px;
                text-align: center;
                font-size: 16px;
                line-height: 1.5;
            ">
                Внимание! Эта функция завершит текущую игровую сессию.<br>
                Используйте только если игра зависла, и при ребут сайта не помогает.
            </p>
            
            <button onclick="rebootCurrentSession()" style="
                width: 100%;
                padding: 12px;
                background: #dc2626;
                border: none;
                border-radius: 6px;
                color: #fff;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                margin: 20px 0;
            ">Reboot Session</button>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const buttons = modal.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.textContent === 'Reboot Session') {
            button.addEventListener('mouseover', () => {
                button.style.background = '#b91c1c';
            });
            button.addEventListener('mouseout', () => {
                button.style.background = '#dc2626';
            });
        } else {
        button.addEventListener('mouseover', () => {
            button.style.background = '#1d4ed8';
        });
        button.addEventListener('mouseout', () => {
            button.style.background = '#2563eb';
        });
        }
    });


    const input = modal.querySelector('#balanceInput');
    input.addEventListener('focus', () => {
        input.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        input.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    input.addEventListener('blur', () => {
        input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        input.style.background = 'rgba(255, 255, 255, 0.05)';
    });


    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });


    function showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }

    function hideError() {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.style.display = 'none';
    }

    document.getElementById('balanceInput').addEventListener('input', hideError);

    document.getElementById('saveButton').addEventListener('click', () => {
        const value = document.getElementById('balanceInput').value;
        if (!value || value < 0) {
            showError('Пожалуйста, введите корректную сумму');
            return;
        }

        fetch('/update_balance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': accessKey
            },
            body: JSON.stringify({
                balance: parseFloat(value)
            })
        })
        .then(handleApiResponse)
        .then(data => {
            if (data.success) {
                updateAllBalances(data.new_balance);
                if (window.updatePCBalance) {
                    window.updatePCBalance(data.new_balance);
                }
                document.body.removeChild(modal);
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError(error.message || 'Ошибка обновления баланса');
        });
    });
}

function changeCurrency(currency) {
    const accessKey = checkAccessKey();
    if (!accessKey) {
        alert('Access key not found. Please login again.');
        return;
    }

    fetch('/update_currency', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Access-Key': accessKey
        },
        body: JSON.stringify({
            currency: currency
        })
    })
    .then(handleApiResponse)
    .then(data => {
        console.log('Currency update response:', data);
        updateAllBalances(data.new_balance, data.currency_symbol, data.new_currency);
        updateGameCurrency(data.currency_symbol);
        
        setTimeout(() => {
            window.location.reload();
        }, 500);
    })
    .catch(error => {
        console.error('Error details:', error);
        alert('Ошибка обновления валюты: ' + error.message);
    });
}

function updateAllBalances(newBalance, currencySymbol = null, currency = null) {

    if (!currencySymbol) {
        const accessKey = checkAccessKey();
        if (accessKey) {
            fetch('/get_user_settings', {
                headers: {
                    'X-Access-Key': accessKey
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const symbols = {"RUB": "₽", "USD": "$", "UZS": "S","INR": "₹"};
                    updateAllBalances(newBalance, symbols[data.currency], data.currency);
                }
            })
            .catch(error => console.error('Error getting currency symbol:', error));
            return;
        }
    }

    const formattedBalance = Number(newBalance).toFixed(2).replace('.', ',');
    

    const elements = [
        {
            selector: '#walletValue',
            update: (el) => el.textContent = `${formattedBalance} ${currencySymbol}`
        },
        {
            selector: '.HeaderGameRelatedBalance_balance_YTN_l',
            update: (el) => el.innerHTML = `${formattedBalance}&nbsp;${currencySymbol}`
        },
        {
            selector: '.HeaderBalanceInfo_balance_Gw9TU',
            update: (el) => {

                const roundedBalance = Number(newBalance).toFixed(2);
                const [whole, decimal] = roundedBalance.split('.');
                const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
                el.textContent = `${formattedWhole},${decimal}`;
                

                const currencyNameElement = el.parentElement.parentElement.querySelector('.HeaderBalanceInfo_name_u2NJV');
                if (currencyNameElement && currency) {
                    currencyNameElement.textContent = currency;
                }
            }
        }
    ];

    elements.forEach(({selector, update}) => {
        const element = document.querySelector(selector);
        if (element) {
            update(element);
            console.log(`Updated ${selector} with balance:`, formattedBalance, currencySymbol);
        }
    });


    document.querySelectorAll('.currency-symbol').forEach(el => {
        el.textContent = currencySymbol;
    });


    if (currencySymbol) {
        updateGameCurrency(currencySymbol);
    }
}


function addPCBalanceClickHandler() {
    const balanceElement = document.querySelector('.HeaderBalanceInfo_balance_Gw9TU');
    if (balanceElement) {
        balanceElement.style.cursor = 'pointer';
        balanceElement.onclick = showBalanceEditModal;
        console.log('Added click handler to PC balance element');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const walletButton = document.querySelector('[id="walletValue"]')?.closest('button');
                if (walletButton) {
                    walletButton.removeAttribute('disabled');
                    walletButton.classList.remove('cursor-not-allowed');
                    walletButton.classList.add('cursor-pointer');
                    walletButton.onclick = showBalanceEditModal;
                    observer.disconnect();
                }
            }
        });
    });

    
    const gameObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const balanceElement = document.querySelector('.HeaderGameRelatedBalance_balance_YTN_l');
                if (balanceElement) {
                    addBalanceClickHandler();
                    gameObserver.disconnect();
                }
            }
        });
    });

    
    const pcObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const balanceElement = document.querySelector('.HeaderBalanceInfo_balance_Gw9TU');
                if (balanceElement) {
                    addPCBalanceClickHandler();
                    
                    const accessKey = checkAccessKey();
                    if (accessKey) {
                        fetch('/get_balance', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Access-Key': accessKey
                            }
                        })
                        .then(handleApiResponse)
                        .then(data => {
                            if (data.success) {
                                updateAllBalances(data.balance);
                            }
                        })
                        .catch(error => console.error('Error fetching balance:', error));
                    }
                    pcObserver.disconnect();
                }
            }
        });
    });

    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    gameObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    pcObserver.observe(document.body, {
        childList: true,
        subtree: true
    });


    const accessKey = checkAccessKey();
    if (accessKey) {

        fetch('/get_user_settings', {
            headers: {
                'X-Access-Key': accessKey
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const currencySymbols = {
                    "RUB": "₽",
                    "USD": "$",
                    "UZS": "S"
                };
                const currencySymbol = currencySymbols[data.currency];
                updateAllBalances(data.balance, currencySymbol, data.currency);
                updateGameCurrency(currencySymbol);
            }
        })
        .catch(error => console.error('Error loading user settings:', error));
    }
});

function changeGameLanguage(lang) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('language', lang);
    window.location.href = currentUrl.toString();
}

function updateGameCurrency(currencySymbol) {

    const currencyElements = [
        '#prizeCurrency',
        '.currency-symbol',
        '[data-currency]',
        '.game-currency',
        '.bet-currency',
        '.prize-currency',
        '.HeaderGameRelatedBalance_currency',
        '.HeaderBalanceInfo_currency_3XByG'
    ];

    currencyElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.textContent = currencySymbol;
        });
    });


    document.querySelectorAll('span').forEach(el => {
        if (el.textContent === '₽' || el.textContent === '$' || el.textContent === 'S') {
            el.textContent = currencySymbol;
        }
    });


    document.querySelectorAll('[data-currency]').forEach(el => {
        el.setAttribute('data-currency', currencySymbol);
    });
}

function rebootCurrentSession() {
    const accessKey = checkAccessKey();
    if (!accessKey) {
        showRebootMessage('Access key not found. Please login again.', true);
        return;
    }

    const messageElement = document.getElementById('additionalContent').querySelector('p');
    messageElement.style.color = '#fff';
    messageElement.innerHTML = 'Завершение сессии...<br>Пожалуйста, подождите.';

  
    fetch('/mines/sessions?filter={"states":["Active"]}', {
        headers: {
            'X-Access-Key': accessKey
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.data && data.data.length > 0) {
            const activeSession = data.data[0];

            return fetch(`/mines/session/${activeSession.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Key': accessKey
                },
                body: JSON.stringify({
                    state: 'Finished',  
                    endDate: new Date().toISOString()  
                })
            });
        } else {
            showRebootMessage('Активная сессия не найдена.<br>Возможно, игра уже завершена.', true);
            throw new Error('No active session found');
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Session ended:', data);
        showRebootMessage('Сессия успешно завершена.<br>Страница будет перезагружена через 1 секунды.');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    })
    .catch(error => {
        console.error('Error rebooting session:', error);
        if (error.message !== 'No active session found') {
            showRebootMessage('Ошибка перезагрузки сессии:<br>' + error.message, true);
        }
    });
}

function showRebootMessage(message, isError = false) {
    const messageElement = document.getElementById('additionalContent').querySelector('p');
    messageElement.style.color = isError ? '#ef4444' : '#fff';
    messageElement.innerHTML = message;
}

function switchTab(tab) {
    const baseTab = document.getElementById('baseTab');
    const additionalTab = document.getElementById('additionalTab');
    const baseContent = document.getElementById('baseContent');
    const additionalContent = document.getElementById('additionalContent');

    if (tab === 'base') {
        baseTab.style.background = '#2563eb';
        additionalTab.style.background = 'rgba(255, 255, 255, 0.1)';
        baseContent.style.display = 'block';
        additionalContent.style.display = 'none';
    } else {
        baseTab.style.background = 'rgba(255, 255, 255, 0.1)';
        additionalTab.style.background = '#2563eb';
        baseContent.style.display = 'none';
        additionalContent.style.display = 'block';
    }
}

// Добавляем функцию проверки ответа
function handleApiResponse(response) {
    if (response.status === 401) {
        return response.json().then(data => {
            if (data.error === "Access key has expired") {
                alert("Ваш ключ доступа истек. Пожалуйста, получите новый ключ.");
                localStorage.removeItem('access_key');
                window.location.reload();
            }
            throw new Error(data.error);
        });
    }
    return response.json().then(data => {
        if (!data.success && data.error) {
            throw new Error(data.error);
        }
        return data;
    });
} 