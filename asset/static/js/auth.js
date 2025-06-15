// Отключаем консоль логи
console.log = function() {};
console.debug = function() {};
console.info = function() {};

console.log('Auth.js loading...'); 


function initAuth() {
    console.log('Initializing auth...'); 
    
    
    const authStyles = `
        /* Сначала показываем игру */
        #root {
            display: block !important;
            filter: blur(10px);
            -webkit-filter: blur(10px);
            transition: filter 0.3s ease;
            -webkit-transition: -webkit-filter 0.3s ease;
        }

        /* После авторизации убираем размытие */
        #root.authorized {
            filter: none;
            -webkit-filter: none;
        }

        .auth-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        /* Полупрозрачный фон поверх игры */
        .auth-modal::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.2);
        }

        .auth-modal__content {
            position: relative;
            background: rgba(28, 32, 40, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 12px;
            width: 320px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
        }

        .auth-modal__title {
            font-size: 24px;
            color: #fff;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 500;
        }

        .auth-modal__input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 6px;
            font-size: 16px;
            color: #fff;
            transition: all 0.2s ease;
        }

        .auth-modal__input:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.3);
            background: rgba(255, 255, 255, 0.1);
        }

        .auth-modal__input::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }

        .auth-modal__button {
            width: 100%;
            padding: 12px;
            margin-top: 20px;
            background: #2563eb;
            border: none;
            border-radius: 6px;
            color: #fff;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .auth-modal__button:hover {
            background: #1d4ed8;
        }

        .auth-modal__error {
            display: none;
            color: #ef4444;
            margin-top: 10px;
            text-align: center;
            font-size: 14px;
        }
    `;

    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = authStyles;
    document.head.appendChild(styleSheet);

    
    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="auth-modal__content">
            <h2 class="auth-modal__title">Авторизация</h2>
            <input type="text" class="auth-modal__input" placeholder="Введите ключ доступа" />
            <button class="auth-modal__button">Войти</button>
            <div class="auth-modal__error">Неверный ключ доступа</div>
        </div>
    `;

    
    document.body.appendChild(modal);

    
    const savedKey = localStorage.getItem('accessKey');
    if (savedKey) {
        window.verifyAccessKey(savedKey);
    }

    
    const button = modal.querySelector('.auth-modal__button');
    button.addEventListener('click', () => window.verifyAccessKey());

    
    const input = modal.querySelector('.auth-modal__input');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            window.verifyAccessKey();
        }
    });

    console.log('Auth initialized'); 
}


function handleAuthError() {
    
    localStorage.removeItem('accessKey');
    window.accessKey = null;
    
    
    const authModal = document.querySelector('.auth-modal');
    if (authModal) {
        authModal.style.display = 'flex';
    }
    
    
    const root = document.getElementById('root');
    if (root) {
        root.classList.remove('authorized');
    }
}


const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'https://rokin-api.lunaweb.ru'
    : 'https://rokin-api.lunaweb.ru';


window.verifyAccessKey = function(savedKey) {
    const key = savedKey || document.querySelector('.auth-modal__input').value;
    
    console.log('API_BASE_URL:', API_BASE_URL); 
    console.log('Making auth request to:', `${API_BASE_URL}/auth/verify`); 
    
    fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Access-Key': key
        },
        body: JSON.stringify({ access_key: key }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('accessKey', key);
            window.accessKey = key;
            document.querySelector('.auth-modal').style.display = 'none';
            document.getElementById('root').classList.add('authorized');
        } else {
            document.querySelector('.auth-modal__error').style.display = 'block';
        }
    })
    .catch(() => {
        document.querySelector('.auth-modal__error').style.display = 'block';
    });
};


const originalFetch = window.fetch;
window.fetch = function() {
    let [resource, config] = arguments;
    
    console.log('Fetch interceptor - Original resource:', resource); 
    
    if (resource.startsWith('/') && !resource.startsWith('/static/media')) {
        resource = API_BASE_URL + resource;
        console.log('Fetch interceptor - Modified resource:', resource); 
    }
    
    config = config || {};
    config.headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    
    const accessKey = localStorage.getItem('accessKey');
    if (accessKey) {
        config.headers['X-Access-Key'] = accessKey;
    }
    
    config.credentials = 'include';
    
    return originalFetch(resource, config)
        .then(response => {
            if (response.status === 401) {
                handleAuthError();
                return Promise.reject('Unauthorized');
            }
            if (!response.ok) {
                return response.json().then(err => Promise.reject(err));
            }
            return response;
        })
        .catch(error => {
            if (error === 'Unauthorized') {
                throw error;
            }
            throw error;
        });
};


const originalXHR = window.XMLHttpRequest;
window.XMLHttpRequest = function() {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    
    xhr.open = function() {
        let [method, url] = arguments;
        console.log('XHR Open - Original URL:', url); 
        
        if (url.startsWith('/') && !url.startsWith('/static/media')) {
            url = API_BASE_URL + url;
            console.log('XHR Open - Modified URL:', url); 
        }
        
        
        xhr._originalUrl = url;
        
        originalOpen.apply(xhr, [method, url, ...Array.prototype.slice.call(arguments, 2)]);
        
        
        xhr.onerror = function() {
            console.error('XHR Error:', {
                method: method,
                url: url,
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
    };
    
    
    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === 1) { 
            const url = xhr._originalUrl || '';
            
            if (!url.startsWith('/static/media')) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Accept', 'application/json');
                
                const accessKey = localStorage.getItem('accessKey');
                if (accessKey) {
                    xhr.setRequestHeader('X-Access-Key', accessKey);
                }
            }
        }
    });
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 401) {
                handleAuthError();
            }
        }
    };
    
    return xhr;
};


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
} 