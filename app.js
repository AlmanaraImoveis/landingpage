// JAVASCRIPT ULTRA BÁSICO - SOMENTE FUNÇÕES INLINE
console.log('JavaScript carregado');

// Função para máscara de telefone - chamada inline
function mascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, '');
    valor = valor.substring(0, 11);
    
    if (valor.length >= 2) {
        if (valor.length <= 6) {
            valor = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
        } else if (valor.length <= 10) {
            valor = `(${valor.substring(0, 2)}) ${valor.substring(2, 6)}-${valor.substring(6)}`;
        } else {
            valor = `(${valor.substring(0, 2)}) ${valor.substring(2, 7)}-${valor.substring(7)}`;
        }
    }
    
    input.value = valor;
}

// Função para máscara de dinheiro - chamada inline
function mascaraDinheiro(input) {
    let valor = input.value.replace(/\D/g, '');
    
    if (valor === '') {
        input.value = '';
        return;
    }
    
    const numero = parseInt(valor) / 100;
    input.value = numero.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// Função principal - enviar para WhatsApp
function enviarWhatsApp() {
    console.log('Botão clicado - enviando para WhatsApp');
    
    // Pegar valores dos campos
    const nome = document.getElementById('nome').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const tipoRenda = document.getElementById('tipo_renda').value;
    const renda = document.getElementById('renda').value.trim();
    const fgts = document.getElementById('fgts').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const entrada = document.getElementById('entrada').value.trim();
    
    console.log('Dados coletados:', {nome, celular, tipoRenda, renda, fgts, bairro, entrada});
    
    // Validação simples
    if (!nome || nome.length < 2) {
        alert('Por favor, digite seu nome completo');
        document.getElementById('nome').focus();
        return;
    }
    
    if (!celular || celular.length < 10) {
        alert('Por favor, digite seu celular completo');
        document.getElementById('celular').focus();
        return;
    }
    
    if (!tipoRenda) {
        alert('Por favor, selecione seu tipo de renda');
        document.getElementById('tipo_renda').focus();
        return;
    }
    
    if (!renda) {
        alert('Por favor, digite sua renda mensal');
        document.getElementById('renda').focus();
        return;
    }
    
    if (!fgts) {
        alert('Por favor, digite o valor do FGTS disponível');
        document.getElementById('fgts').focus();
        return;
    }
    
    if (!bairro || bairro.length < 2) {
        alert('Por favor, digite o bairro de interesse');
        document.getElementById('bairro').focus();
        return;
    }
    
    if (!entrada) {
        alert('Por favor, digite o valor disponível para entrada');
        document.getElementById('entrada').focus();
        return;
    }
    
    // Criar mensagem do WhatsApp
    const mensagem = `🏠 *NOVO LEAD - ANÁLISE DE CRÉDITO*

👤 *Nome:* ${nome}
📱 *WhatsApp:* ${celular}
💼 *Tipo de Renda:* ${tipoRenda}
💰 *Renda Mensal:* R$ ${renda}
🏦 *FGTS Disponível:* R$ ${fgts}
📍 *Bairro de Interesse:* ${bairro}
💵 *Valor para Entrada:* R$ ${entrada}`;

    // Preparar URL do WhatsApp
    const numeroWhatsApp = '5511988434718';
    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    
    console.log('URL do WhatsApp:', urlWhatsApp);
    
    // Tentar abrir WhatsApp - Método 1
    const janela = window.open(urlWhatsApp, '_blank');
    
    // Se não abriu, usar fallback - Método 2
    setTimeout(function() {
        if (!janela || janela.closed || janela.location.href === 'about:blank') {
            console.log('Usando método alternativo');
            window.location.href = urlWhatsApp;
        }
    }, 1000);
    
    console.log('WhatsApp deve abrir agora');
}