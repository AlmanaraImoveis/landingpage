// Configuração da aplicação
const appConfig = {
    whatsappNumber: "+5511988434718", // Número do WhatsApp para redirecionamento
    messageTemplate: `🏠 *NOVO LEAD - ANÁLISE DE CRÉDITO*

👤 *Nome:* {nome}
📱 *WhatsApp:* {celular}
💼 *Tipo de Renda:* {tipo_renda}
💰 *Renda Mensal:* R$ {renda}
🏦 *FGTS Disponível:* R$ {fgts}
📍 *Bairro de Interesse:* {bairro}
💵 *Valor para Entrada:* {entrada}`
};

// Aguardar o DOM ser carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Elementos do DOM
    const form = document.getElementById('creditForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    const celularInput = document.getElementById('celular');
    const rendaInput = document.getElementById('renda');
    const fgtsInput = document.getElementById('fgts');

    if (!form || !submitBtn || !celularInput || !rendaInput || !fgtsInput) {
        console.error('Elementos essenciais não encontrados no DOM');
        return;
    }

    // Configurar máscaras e formatação
    setupPhoneMask(celularInput);
    setupCurrencyFormatting(rendaInput);
    setupCurrencyFormatting(fgtsInput);
    
    // Configurar validação em tempo real
    setupValidation();
    
    // Configurar envio do formulário
    setupFormSubmission(form, submitBtn, btnText, btnLoading);
    
    // Configurar animações
    setupAnimations();
    
    // Corrigir problema do dropdown
    fixDropdownIssues();
}

// Máscara para telefone brasileiro - versão corrigida
function applyPhoneMask(value) {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limitedNumbers = numbers.substring(0, 11);
    
    // Aplica a formatação baseada no tamanho
    if (limitedNumbers.length <= 2) {
        return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
        return `(${limitedNumbers.substring(0, 2)}) ${limitedNumbers.substring(2)}`;
    } else if (limitedNumbers.length <= 10) {
        return `(${limitedNumbers.substring(0, 2)}) ${limitedNumbers.substring(2, 6)}-${limitedNumbers.substring(6)}`;
    } else {
        return `(${limitedNumbers.substring(0, 2)}) ${limitedNumbers.substring(2, 7)}-${limitedNumbers.substring(7)}`;
    }
}

function setupPhoneMask(input) {
    if (!input) return;
    
    // Aplicar máscara no input
    input.addEventListener('input', function(e) {
        const cursorPosition = e.target.selectionStart;
        const originalValue = e.target.value;
        const newValue = applyPhoneMask(originalValue);
        
        // Atualizar o valor se mudou
        if (newValue !== originalValue) {
            e.target.value = newValue;
            
            // Ajustar posição do cursor
            const lengthDiff = newValue.length - originalValue.length;
            const newCursorPosition = cursorPosition + lengthDiff;
            e.target.setSelectionRange(newCursorPosition, newCursorPosition);
        }
        
        // Remover erro se o campo tinha erro
        if (input.classList.contains('error')) {
            validatePhone(input);
        }
    });

    // Permitir apenas números
    input.addEventListener('keypress', function(e) {
        const charCode = e.which ? e.which : e.keyCode;
        // Permitir apenas números e teclas de controle
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            e.preventDefault();
        }
    });

    // Aplicar máscara também no paste
    input.addEventListener('paste', function(e) {
        setTimeout(() => {
            const currentValue = e.target.value;
            e.target.value = applyPhoneMask(currentValue);
        }, 10);
    });
}

// Formatação monetária - versão corrigida
function applyCurrencyMask(value) {
    // Remove tudo que não é número
    let numbers = value.replace(/\D/g, '');
    
    // Se vazio, retorna vazio
    if (numbers === '') return '';
    
    // Converte para número e divide por 100 para ter centavos
    const numberValue = parseInt(numbers) / 100;
    
    // Formatar como moeda brasileira
    return numberValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function setupCurrencyFormatting(input) {
    if (!input) return;
    
    // Aplicar formatação monetária
    input.addEventListener('input', function(e) {
        const cursorPosition = e.target.selectionStart;
        const originalValue = e.target.value;
        const newValue = applyCurrencyMask(originalValue);
        
        // Atualizar o valor se mudou
        if (newValue !== originalValue) {
            e.target.value = newValue;
            
            // Ajustar posição do cursor
            const newCursorPosition = Math.min(cursorPosition, newValue.length);
            e.target.setSelectionRange(newCursorPosition, newCursorPosition);
        }
        
        // Remover erro se o campo tinha erro
        if (input.classList.contains('error')) {
            validateCurrency(input);
        }
    });

    // Permitir apenas números
    input.addEventListener('keypress', function(e) {
        const charCode = e.which ? e.which : e.keyCode;
        // Permitir apenas números e teclas de controle
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            e.preventDefault();
        }
    });

    // Aplicar formatação também no paste
    input.addEventListener('paste', function(e) {
        setTimeout(() => {
            const currentValue = e.target.value;
            e.target.value = applyCurrencyMask(currentValue);
        }, 10);
    });
}

// Função para extrair número puro da moeda formatada
function extractCurrencyValue(formattedValue) {
    const numbers = formattedValue.replace(/\D/g, '');
    if (numbers === '') return 0;
    return parseInt(numbers) / 100;
}

// Validação de campos
function validateField(field, minLength = 1) {
    if (!field) return false;
    
    const value = field.value.trim();
    const errorElement = document.getElementById(field.name + 'Error');
    
    if (!errorElement) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && value.length < minLength) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório';
    }
    
    // Validação específica para nome
    if (field.name === 'nome' && value.length > 0 && value.length < 2) {
        isValid = false;
        errorMessage = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    // Atualizar UI
    updateFieldValidation(field, errorElement, isValid, errorMessage);
    return isValid;
}

function validatePhone(field) {
    if (!field) return false;
    
    const value = field.value.replace(/\D/g, '');
    const errorElement = document.getElementById('celularError');
    
    if (!errorElement) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    if (value.length === 0) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório';
    } else if (value.length < 10) {
        isValid = false;
        errorMessage = 'Digite um telefone válido (10 ou 11 dígitos)';
    } else if (value.length === 10) {
        // Validar telefone fixo
        if (!value.match(/^\d{2}[2-5]\d{7}$/)) {
            isValid = false;
            errorMessage = 'Digite um telefone válido';
        }
    } else if (value.length === 11) {
        // Validar celular
        if (!value.match(/^\d{2}9\d{8}$/)) {
            isValid = false;
            errorMessage = 'Digite um celular válido';
        }
    } else {
        isValid = false;
        errorMessage = 'Digite um telefone válido';
    }
    
    // Atualizar UI
    updateFieldValidation(field, errorElement, isValid, errorMessage);
    return isValid;
}

function validateCurrency(field) {
    if (!field) return false;
    
    const formattedValue = field.value.trim();
    const value = extractCurrencyValue(formattedValue);
    const errorElement = document.getElementById(field.name + 'Error');
    
    if (!errorElement) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    // Verificar se o campo está vazio quando é obrigatório
    if (field.hasAttribute('required')) {
        if (formattedValue === '' || value <= 0) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório e deve ser maior que zero';
        }
    }
    
    // Validações específicas por campo
    if (isValid && value > 0) {
        if (field.name === 'renda') {
            if (value < 500) {
                isValid = false;
                errorMessage = 'Renda muito baixa para análise (mínimo R$ 500,00)';
            } else if (value > 100000) {
                isValid = false;
                errorMessage = 'Valor muito alto. Entre em contato diretamente';
            }
        }
        
        if (field.name === 'fgts') {
            if (value > 500000) {
                isValid = false;
                errorMessage = 'Valor muito alto. Entre em contato diretamente';
            }
        }
    }
    
    // Atualizar UI
    updateFieldValidation(field, errorElement, isValid, errorMessage);
    return isValid;
}

function updateFieldValidation(field, errorElement, isValid, errorMessage) {
    if (isValid) {
        field.classList.remove('error');
        errorElement.textContent = '';
    } else {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
    }
}

function setupValidation() {
    const requiredFields = ['nome', 'celular', 'tipo_renda', 'renda', 'fgts', 'bairro'];
    
    requiredFields.forEach(fieldName => {
        const element = document.getElementById(fieldName);
        if (!element) return;
        
        // Validação ao sair do campo
        element.addEventListener('blur', function() {
            validateFieldByName(fieldName, element);
        });
        
        // Validação em tempo real (apenas se já teve erro)
        const event = element.tagName.toLowerCase() === 'select' ? 'change' : 'input';
        element.addEventListener(event, function() {
            if (element.classList.contains('error')) {
                validateFieldByName(fieldName, element);
            }
        });
    });
}

function validateFieldByName(fieldName, element) {
    if (fieldName === 'celular') {
        return validatePhone(element);
    } else if (fieldName === 'renda' || fieldName === 'fgts') {
        return validateCurrency(element);
    } else {
        return validateField(element, fieldName === 'nome' ? 2 : 1);
    }
}

function validateCompleteForm() {
    const requiredFields = ['nome', 'celular', 'tipo_renda', 'renda', 'fgts', 'bairro'];
    let isFormValid = true;
    
    requiredFields.forEach(fieldName => {
        const element = document.getElementById(fieldName);
        if (!element) return;
        
        const valid = validateFieldByName(fieldName, element);
        
        if (!valid) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

// Corrigir problemas do dropdown
function fixDropdownIssues() {
    const selectElements = document.querySelectorAll('select.form-control');
    
    selectElements.forEach(select => {
        // Remover eventos que podem causar problemas
        select.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        select.addEventListener('focus', function(e) {
            e.stopPropagation();
        });
    });
}

// Formatação da mensagem WhatsApp
function formatWhatsAppMessage(data) {
    let message = appConfig.messageTemplate;
    message = message.replace('{nome}', data.nome);
    message = message.replace('{celular}', data.celular);
    message = message.replace('{tipo_renda}', data.tipo_renda);
    message = message.replace('{renda}', data.renda); // Usar valor formatado
    message = message.replace('{fgts}', data.fgts); // Usar valor formatado
    message = message.replace('{bairro}', data.bairro);
    message = message.replace('{entrada}', data.entrada || 'Não informado');
    
    return message;
}

function openWhatsApp(message) {
    const phoneNumber = appConfig.whatsappNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    
    // Detectar se é mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let whatsappURL;
    if (isMobile) {
        whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
    } else {
        whatsappURL = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    }
    
    window.open(whatsappURL, '_blank');
}

function showLoading(show, btnText, btnLoading, submitBtn) {
    if (show) {
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        submitBtn.disabled = true;
    } else {
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

function collectFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value.trim();
    }
    
    return data;
}

function showMessage(type, text) {
    const message = document.createElement('div');
    message.className = `status-message ${type}`;
    message.innerHTML = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 4000);
}

function setupFormSubmission(form, submitBtn, btnText, btnLoading) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validar formulário
        if (!validateCompleteForm()) {
            const errorField = document.querySelector('.form-control.error');
            if (errorField) {
                errorField.focus();
                errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            showMessage('error', '❌ Por favor, corrija os erros no formulário');
            return;
        }
        
        // Mostrar loading
        showLoading(true, btnText, btnLoading, submitBtn);
        
        try {
            // Coletar dados
            const data = collectFormData(form);
            
            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Formatar mensagem
            const message = formatWhatsAppMessage(data);
            
            // Mostrar mensagem de sucesso
            showMessage('success', '✅ Redirecionando para WhatsApp...');
            
            // Abrir WhatsApp
            setTimeout(() => {
                openWhatsApp(message);
            }, 800);
            
            // Reset do formulário
            setTimeout(() => {
                form.reset();
                document.querySelectorAll('.form-control.error').forEach(field => {
                    field.classList.remove('error');
                });
                document.querySelectorAll('.error-message').forEach(error => {
                    error.textContent = '';
                });
                showLoading(false, btnText, btnLoading, submitBtn);
            }, 3000);
            
        } catch (error) {
            console.error('Erro ao processar formulário:', error);
            showMessage('error', '❌ Ocorreu um erro. Tente novamente.');
            showLoading(false, btnText, btnLoading, submitBtn);
        }
    });
}

function setupAnimations() {
    // Animação de elementos ao aparecer na tela
    const elements = document.querySelectorAll('.benefit-item, .testimonial');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        observer.observe(element);
    });
    
    // Scroll suave para badges
    const badges = document.querySelectorAll('.badge');
    const formSection = document.querySelector('.form-section');
    
    if (formSection) {
        badges.forEach(badge => {
            badge.style.cursor = 'pointer';
            badge.addEventListener('click', function() {
                formSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            });
        });
    }
}
