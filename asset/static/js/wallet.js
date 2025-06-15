function checkAccessKey() {
    // Если вы полностью удаляете аутентификацию, эта функция может быть больше не нужна.
    // Или, вы можете вернуть фиктивное значение или null, если некоторые части кода все еще ожидают его.
    return null; // Или верните фиксированный "фиктивный" ключ, если вызовы API абсолютно требуют его.
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
    // Больше не проверяем access key здесь, если аутентификация удалена.
    // Модальное окно должно просто открываться, или действие должно продолжаться.
    // const accessKey = checkAccessKey();
    // if (!accessKey) {
    //     alert('Access key not found. Please login again.'); // УДАЛИТЕ ЭТО ПРЕДУПРЕЖДЕНИЕ
    //     return;
    // }


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
        background: rgba(28, 32, 51, 0.9);
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        text-align: center;
        color: #fff;
        max-width: 400px;
        width: 90%;
        box-sizing: border-box;
        opacity: 1;
        transform: translateY(0);
    `;

    modalContent.innerHTML = `
        <span class="balance-modal__close" onclick="closeBalanceEditModal()">&times;</span>
        <h2>Изменить баланс</h2>
        <input type="number" id="new-balance-input" placeholder="Введите новый баланс" value="0">
        <button onclick="updateBalance()">Обновить</button>
        <p id="balance-message" style="color: green; margin-top: 10px;"></p>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const currentBalanceText = document.querySelector('.HeaderGameRelatedBalance_balance_YTN_l').textContent;
    const currentBalanceValue = parseFloat(currentBalanceText.replace(/\s/g, '').replace(',', '.').replace('₽', '').replace('$', '').replace('S', '').replace('₹', ''));
    if (!isNaN(currentBalanceValue)) {
        document.getElementById('new-balance-input').value = currentBalanceValue;
    }
}

window.closeBalanceEditModal = function() {
    const modal = document.querySelector('.balance-modal');
    if (modal) {
        modal.remove();
    }
}

window.updateBalance = function() {
    const newBalance = document.getElementById('new-balance-input').value;
    const messageElement = document.getElementById('balance-message');

    if (isNaN(parseFloat(newBalance))) {
        messageElement.style.color = 'red';
        messageElement.innerHTML = 'Пожалуйста, введите корректное число.';
        return;
    }

    const accessKey = checkAccessKey(); // Эта функция теперь возвращает null
    
    // Если ваш бэкенд не требует access_key без аутентификации, то заголовок 'X-Access-Key' можно удалить.
    // Если требует, но аутентификации нет, то нужно решить, как бэкенд будет обрабатывать это.
    // Для простоты, если ключ не нужен, то просто не отправляйте его.
    const headers = {
        'Content-Type': 'application/json'
    };
    if (accessKey) { // Это условие будет ложным, если checkAccessKey() возвращает null
        headers['X-Access-Key'] = accessKey;
    }


    fetch('/update_balance', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ balance: parseFloat(newBalance) })
    })
    .then(response => {
        // Удалите эту проверку 401, так как handleApiResponse удалена
        // if (response.status === 401) {
        //     return response.json().then(data => {
        //         alert("Ваш ключ доступа истек. Пожалуйста, получите новый ключ.");
        //         localStorage.removeItem('access_key');
        //         window.location.reload();
        //         throw new Error(data.error);
        //     });
        // }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            messageElement.style.color = 'green';
            messageElement.innerHTML = 'Баланс успешно обновлен!';
            if (typeof window.updateGameBalance === 'function') {
                window.updateGameBalance(data.balance);
            }
            // Закрываем модальное окно через небольшой промежуток времени
            setTimeout(() => {
                closeBalanceEditModal();
            }, 1000);
        } else {
            messageElement.style.color = 'red';
            messageElement.innerHTML = 'Ошибка обновления баланса: ' + data.error;
        }
    })
    .catch(error => {
        messageElement.style.color = 'red';
        messageElement.innerHTML = 'Произошла ошибка: ' + error.message;
        console.error('Error:', error);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    addBalanceClickHandler();
});

// Удалите handleApiResponse полностью, так как она связана с обработкой 401 ошибок аутентификации
// function handleApiResponse(response) {
//     if (response.status === 401) {
//         return response.json().then(data => {
//             if (data.error === "Access key has expired") {
//                 alert("Ваш ключ доступа истек. Пожалуйста, получите новый ключ.");
//                 localStorage.removeItem('access_key');
//                 window.location.reload();
//             }
//             throw new Error(data.error);
//         });
//     }
//     return response.json().then(data => {
//         // ... (оставшаяся часть функции, если она не связана с аутентификацией)
//     });
// }
