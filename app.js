document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicação iniciada');
    
    const form = document.getElementById('creditForm');
    
    if (!form) {
        console.error('Formulário não encontrado');
        return;
    }
    
    // Configuração das máscaras
    const celularInput = document.getElementById('celular');
    const rendaInput = document.getElementById('renda');
    const fgtsInput = document.getElementById('fgts');
    const entradaInput = document.getElementById('entrada');
    
    // Máscara de telefone
    if (celularInput) {
        celularInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 2) {
                    this.value = value;
                } else if (value.length <= 6) {
                    this.value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
                } else if (value.length <= 10) {
                    this.value = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`;
                } else {
                    this.value = `(${value.substring(0, 2)}) ${value.substring(2, 7)}-${value.substring(7)}`;
                }
            }
        });
        
        celularInput.addEventListener('keypress', function(e) {
            const charCode = e.which ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                e.preventDefault();
            }
        });
    }
    
    // Função para máscara de moeda
    function setupCurrencyMask(input) {
        if (!input) return;
        
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value === '') {
                this.value = '';
                return;
            }
            
            const numberValue = parseInt(value) / 100;
            
            this.value = numberValue.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        });
        
        input.addEventListener('keypress', function(e) {
            const charCode = e.which ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                e.preventDefault();
            }
        });
    }
    
    // Aplicar máscaras de moeda
    setupCurrencyMask(rendaInput);
    setupCurrencyMask(fgtsInput);
    setupCurrencyMask(entradaInput);
    
    // Evento de envio do formulário - VERSÃO CORRIGIDA
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulário enviado!');
        
        // Pegar valores dos campos
        const nome = document.getElementById('nome').value.trim();
        const celular = document.getElementById('celular').value.trim();
        const tipoRenda = document.getElementById('tipo_renda').value;
        const renda = document.getElementById('renda').value.trim();
        const fgts = document.getElementById('fgts').value.trim();
        const bairro = document.getElementById('bairro').value.trim();
        const entrada = document.getElementById('entrada').value.trim();
        
        console.log('Dados coletados:', { nome, celular, tipoRenda, renda, fgts, bairro, entrada });
        
        // Validar campos obrigatórios
        if (!nome || !celular || !tipoRenda || !renda || !fgts || !bairro || !entrada) {
            alert('Preencha todos os campos obrigatórios!');
            return;
        }
        
        // Elementos do botão
        const btnText = document.querySelector('.btn-text');
        const btnLoading = document.querySelector('.btn-loading');
        const submitBtn = document.getElementById('submitBtn');
        
        // Mostrar loading
        if (btnText && btnLoading && submitBtn) {
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
            submitBtn.disabled = true;
        }
        
        // Montar mensagem do WhatsApp
        const mensagem = `🏠 *NOVO LEAD - ANÁLISE DE CRÉDITO*

👤 *Nome:* ${nome}
📱 *WhatsApp:* ${celular}
💼 *Tipo de Renda:* ${tipoRenda}
💰 *Renda Mensal:* R$ ${renda}
🏦 *FGTS Disponível:* R$ ${fgts}
📍 *Bairro de Interesse:* ${bairro}
💵 *Valor para Entrada:* R$ ${entrada}`;
        
        console.log('Mensagem montada:', mensagem);
        
        // Codificar mensagem
        const mensagemCodificada = encodeURIComponent(mensagem);
        
        // Formar URL do WhatsApp - NÚMERO CORRETO
        const url = `https://wa.me/5511988434718?text=${mensagemCodificada}`;
        
        console.log('URL gerada:', url);
        
        // Delay simulado e redirecionamento
        setTimeout(() => {
            console.log('Abrindo WhatsApp...');
            
            // Tentar abrir WhatsApp
            try {
                window.open(url, '_blank');
                console.log('WhatsApp aberto com sucesso');
                
                // Mostrar mensagem de sucesso
                showSuccessMessage();
                
            } catch (error) {
                console.error('Erro ao abrir WhatsApp:', error);
                alert('Erro ao abrir WhatsApp. Tente novamente.');
            }
            
            // Restaurar botão
            if (btnText && btnLoading && submitBtn) {
                btnText.classList.remove('hidden');
                btnLoading.classList.add('hidden');
                submitBtn.disabled = false;
            }
            
        }, 1500);
    });
    
    // Função para mostrar mensagem de sucesso
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'status-message success';
        message.innerHTML = '✅ Redirecionando para WhatsApp...';
        
        // Adicionar estilos inline para garantir visibilidade
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.zIndex = '1000';
        message.style.backgroundColor = 'rgba(34, 197, 94, 0.15)';
        message.style.color = '#059669';
        message.style.border = '1px solid rgba(34, 197, 94, 0.25)';
        message.style.padding = '16px 24px';
        message.style.borderRadius = '8px';
        message.style.fontWeight = '500';
        message.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        
        document.body.appendChild(message);
        
        // Remover mensagem após 4 segundos
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 4000);
    }
});