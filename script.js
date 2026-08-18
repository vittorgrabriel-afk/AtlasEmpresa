/* ============================================================
   ATLAS — JAVASCRIPT
   Aqui ficam as funções que fazem o site funcionar.
   ============================================================ */


/* ============================================================
   DADOS
   ============================================================ */

/*
   Recupera os produtos salvos no navegador.

   Se ainda não existir nenhum produto,
   começa com uma lista vazia.
*/

let produtos =
    JSON.parse(
        localStorage.getItem("atlasProdutos")
    ) || [];


/*
   Recupera as movimentações financeiras.
*/

let movimentos =
    JSON.parse(
        localStorage.getItem("atlasMovimentos")
    ) || [];



/* ============================================================
   NAVEGAÇÃO
   ============================================================ */


/*
   Abre a tela de login.
*/

function abrirLogin() {

    document
        .getElementById("homePage")
        .classList
        .add("hidden");


    document
        .getElementById("dashboardPage")
        .classList
        .add("hidden");


    document
        .getElementById("loginPage")
        .classList
        .remove("hidden");
}



/*
   Faz o login.
*/

function fazerLogin(event) {

    /*
       Impede o navegador de atualizar a página.
    */

    event.preventDefault();


    /*
       Pega o usuário digitado.
    */

    const usuario =
        document
            .getElementById("usuario")
            .value
            .trim();


    /*
       Pega a senha digitada.
    */

    const senha =
        document
            .getElementById("senha")
            .value;


    /*
       Login padrão do projeto.

       Usuário:
       Adm123

       Senha:
       123456
    */

    if (
        usuario.toLowerCase() === "adm123" &&
        senha === "123456"
    ) {


        /*
           Remove mensagem de erro.
        */

        document
            .getElementById("loginError")
            .textContent = "";


        /*
           Esconde o login.
        */

        document
            .getElementById("loginPage")
            .classList
            .add("hidden");


        /*
           Mostra o painel.
        */

        document
            .getElementById("dashboardPage")
            .classList
            .remove("hidden");


        /*
           Abre Cadastro automaticamente.
        */

        abrirPainel("cadastro");

    }

    else {


        /*
           Mostra erro caso a senha
           ou usuário estejam errados.
        */

        document
            .getElementById("loginError")
            .textContent =
            "Usuário ou senha incorretos.";

    }

}



/* ============================================================
   MOSTRAR / ESCONDER SENHA
   ============================================================ */

function mostrarSenha() {

    /*
       Pega o campo de senha.
    */

    const campo =
        document.getElementById("senha");


    /*
       Se estiver escondido,
       mostra.

       Se estiver aparecendo,
       esconde novamente.
    */

    if (campo.type === "password") {

        campo.type = "text";

    }

    else {

        campo.type = "password";

    }

}



/* ============================================================
   SAIR
   ============================================================ */

function sair() {

    /*
       Esconde o painel.
    */

    document
        .getElementById("dashboardPage")
        .classList
        .add("hidden");


    /*
       Esconde o login.
    */

    document
        .getElementById("loginPage")
        .classList
        .add("hidden");


    /*
       Volta para a página inicial.
    */

    document
        .getElementById("homePage")
        .classList
        .remove("hidden");

}



/* ============================================================
   MENU DO PAINEL
   ============================================================ */

function abrirPainel(nome) {


    /*
       Esconde todas as áreas
       do painel.
    */

    document
        .querySelectorAll(".panel-section")
        .forEach(
            secao => {

                secao
                    .classList
                    .add("hidden");

            }
        );


    /*
       Mostra somente a área escolhida.
    */

    document
        .getElementById(nome + "Panel")
        .classList
        .remove("hidden");


    /*
       Atualiza o botão ativo
       do menu lateral.
    */

    document
        .querySelectorAll(".nav-item")
        .forEach(
            botao => {

                botao.classList.toggle(
                    "active",
                    botao.dataset.page === nome
                );

            }
        );


    /*
       Atualizações específicas
       para cada área.
    */

    if (nome === "estoque") {

        atualizarEstoque();

    }


    if (nome === "financeiro") {

        atualizarFinanceiro();

    }


    if (nome === "graficos") {

        desenharGraficos();

    }

}



/* ============================================================
   SALVAR DADOS
   ============================================================ */

function salvarDados() {

    /*
       Salva os produtos.
    */

    localStorage.setItem(
        "atlasProdutos",
        JSON.stringify(produtos)
    );


    /*
       Salva as movimentações.
    */

    localStorage.setItem(
        "atlasMovimentos",
        JSON.stringify(movimentos)
    );

}



/* ============================================================
   CADASTRO DE PRODUTO
   ============================================================ */

function cadastrarProduto(event) {

    /*
       Impede o formulário
       de atualizar a página.
    */

    event.preventDefault();


    /*
       Cria um novo produto.
    */

    const produto = {

        id: Date.now(),

        nome:
            document
                .getElementById("nomeProduto")
                .value
                .trim(),

        preco:
            Number(
                document
                    .getElementById("precoProduto")
                    .value
            ),

        quantidade:
            Number(
                document
                    .getElementById("quantidadeProduto")
                    .value
            ),

        validade:
            document
                .getElementById("validadeProduto")
                .value,

        lote:
            document
                .getElementById("loteProduto")
                .value
                .trim()

    };


    /*
       Adiciona o produto à lista.
    */

    produtos.push(produto);


    /*
       Salva no navegador.
    */

    salvarDados();


    /*
       Limpa os campos.
    */

    event.target.reset();


    /*
       Mostra confirmação.
    */

    alert(
        "Produto cadastrado com sucesso!"
    );


    /*
       Abre automaticamente
       a tela de estoque.
    */

    abrirPainel("estoque");

}



/* ============================================================
   FORMATAÇÃO DE DATA
   ============================================================ */

function formatarData(data) {

    if (!data) {

        return "-";

    }


    /*
       Divide:

       2026-08-18

       em:

       2026
       08
       18
    */

    const partes =
        data.split("-");


    /*
       Retorna:

       18/08/2026
    */

    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}



/* ============================================================
   FORMATAÇÃO DE DINHEIRO
   ============================================================ */

function moeda(valor) {

    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}



/* ============================================================
   MOSTRAR ESTOQUE
   ============================================================ */

function atualizarEstoque() {

    /*
       Pega a tabela.
    */

    const body =
        document
            .getElementById("estoqueBody");


    /*
       Pega a mensagem
       de estoque vazio.
    */

    const vazio =
        document
            .getElementById("estoqueVazio");


    /*
       Limpa a tabela.
    */

    body.innerHTML = "";


    /*
       Se não houver produtos,
       mostra a mensagem.
    */

    if (produtos.length === 0) {

        vazio.style.display = "block";

        return;

    }


    /*
       Esconde a mensagem.
    */

    vazio.style.display = "none";


    /*
       Percorre todos os produtos.
    */

    produtos.forEach(
        produto => {


            /*
               Cria uma nova linha.
            */

            const tr =
                document.createElement("tr");


            /*
               Coloca os dados
               dentro da linha.
            */

            tr.innerHTML = `

                <td>
                    ${escapar(produto.nome)}
                </td>

                <td>
                    ${moeda(produto.preco)}
                </td>

                <td>
                    ${produto.quantidade}
                </td>

                <td>
                    ${formatarData(produto.validade)}
                </td>

                <td>
                    ${escapar(produto.lote)}
                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="excluirProduto(${produto.id})">

                        Excluir

                    </button>

                </td>

            `;


            /*
               Adiciona a linha à tabela.
            */

            body.appendChild(tr);

        }
    );

}



/* ============================================================
   EXCLUIR PRODUTO
   ============================================================ */

function excluirProduto(id) {


    /*
       Pergunta antes de excluir.
    */

    if (
        !confirm(
            "Deseja excluir este produto?"
        )
    ) {

        return;

    }


    /*
       Mantém somente
       os produtos diferentes
       do escolhido.
    */

    produtos =
        produtos.filter(
            produto =>
                produto.id !== id
        );


    /*
       Salva a nova lista.
    */

    salvarDados();


    /*
       Atualiza a tabela.
    */

    atualizarEstoque();

}



/* ============================================================
   SEGURANÇA DO TEXTO
   ============================================================ */

function escapar(texto) {

    return String(texto)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}



/* ============================================================
   FINANCEIRO
   ============================================================ */

function adicionarMovimento() {


    /*
       Descobre se é entrada
       ou saída.
    */

    const tipo =
        document
            .getElementById("tipoMovimento")
            .value;


    /*
       Pega o valor.
    */

    const valor =
        Number(
            document
                .getElementById("valorMovimento")
                .value
        );


    /*
       Pega a descrição.
    */

    const descricao =
        document
            .getElementById("descricaoMovimento")
            .value
            .trim();


    /*
       Verifica se o valor é válido.
    */

    if (!valor || valor <= 0) {

        alert(
            "Digite um valor válido."
        );

        return;

    }


    /*
       Cria a movimentação.
    */

    movimentos.push({

        id: Date.now(),

        tipo: tipo,

        valor: valor,

        descricao: descricao,

        data:
            new Date().toISOString()

    });


    /*
       Salva.
    */

    salvarDados();


    /*
       Limpa os campos.
    */

    document
        .getElementById("valorMovimento")
        .value = "";


    document
        .getElementById("descricaoMovimento")
        .value = "";


    /*
       Atualiza os valores.
    */

    atualizarFinanceiro();

}



/* ============================================================
   CALCULAR FINANCEIRO
   ============================================================ */

function calcularTotais() {


    let entradas = 0;

    let saidas = 0;


    /*
       Percorre as movimentações.
    */

    movimentos.forEach(
        movimento => {


            /*
               Entrada.
            */

            if (
                movimento.tipo ===
                "entrada"
            ) {

                entradas +=
                    Number(
                        movimento.valor
                    );

            }


            /*
               Saída.
            */

            else {

                saidas +=
                    Number(
                        movimento.valor
                    );

            }

        }
    );


    /*
       Retorna os valores.
    */

    return {

        entradas: entradas,

        saidas: saidas,

        saldo:
            entradas - saidas

    };

}



/* ============================================================
   ATUALIZAR FINANCEIRO
   ============================================================ */

function atualizarFinanceiro() {


    /*
       Calcula os totais.
    */

    const totais =
        calcularTotais();


    /*
       Mostra entradas.
    */

    document
        .getElementById("totalEntradas")
        .textContent =
        moeda(totais.entradas);


    /*
       Mostra saídas.
    */

    document
        .getElementById("totalSaidas")
        .textContent =
        moeda(totais.saidas);


    /*
       Mostra saldo.
    */

    document
        .getElementById("saldoFinanceiro")
        .textContent =
        moeda(totais.saldo);


    /*
       Atualiza a tabela.
    */

    atualizarPeriodo();

}



/* ============================================================
   TABELA DE PERÍODO
   ============================================================ */

function atualizarPeriodo() {


    const body =
        document
            .getElementById("periodoBody");


    const agora =
        new Date();


    /*
       Pega o mês atual.
    */

    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(2, "0");


    /*
       Cria o período.

       Exemplo:

       2026-08
    */

    const periodo =
        `${agora.getFullYear()}-${mes}`;


    /*
       Soma entradas.
    */

    const entradas =
        movimentos
            .filter(
                movimento =>
                    movimento.tipo ===
                    "entrada"
            )
            .reduce(
                (soma, movimento) =>
                    soma +
                    Number(
                        movimento.valor
                    ),
                0
            );


    /*
       Soma saídas.
    */

    const saidas =
        movimentos
            .filter(
                movimento =>
                    movimento.tipo ===
                    "saida"
            )
            .reduce(
                (soma, movimento) =>
                    soma +
                    Number(
                        movimento.valor
                    ),
                0
            );


    /*
       Mostra os dados.
    */

    body.innerHTML = `

        <tr>

            <td>
                ${periodo}
            </td>

            <td style="color:#20a45a">

                ${moeda(entradas)}

            </td>

            <td style="color:#e34646">

                ${moeda(saidas)}

            </td>

            <td>

                ${moeda(
                    entradas - saidas
                )}

            </td>

        </tr>

    `;

}



/* ============================================================
   BOTÕES DE PERÍODO
   ============================================================ */

function selecionarPeriodo(botao) {


    /*
       Remove a seleção
       de todos os botões.
    */

    document
        .querySelectorAll(
            ".period-buttons button"
        )
        .forEach(
            b => {

                b.classList
                    .remove(
                        "selected"
                    );

            }
        );


    /*
       Seleciona o botão clicado.
    */

    botao.classList
        .add("selected");

}



/* ============================================================
   GRÁFICOS
   ============================================================ */

function desenharGraficos() {

    /*
       Desenha o gráfico financeiro.
    */

    desenharGraficoFinanceiro();


    /*
       Desenha o gráfico de estoque.
    */

    desenharGraficoEstoque();

}



/* ============================================================
   PREPARAR CANVAS
   ============================================================ */

function prepararCanvas(id) {


    /*
       Localiza o gráfico.
    */

    const canvas =
        document
            .getElementById(id);


    /*
       Descobre o tamanho.
    */

    const rect =
        canvas.getBoundingClientRect();


    /*
       Melhora a qualidade
       em telas de alta resolução.
    */

    const dpr =
        window.devicePixelRatio || 1;


    /*
       Define largura.
    */

    canvas.width =
        rect.width * dpr;


    /*
       Define altura.
    */

    canvas.height =
        250 * dpr;


    /*
       Pega o contexto.
    */

    const ctx =
        canvas.getContext("2d");


    /*
       Ajusta escala.
    */

    ctx.scale(
        dpr,
        dpr
    );


    /*
       Retorna tudo
       para o gráfico.
    */

    return {

        canvas: canvas,

        ctx: ctx,

        width: rect.width,

        height: 250

    };

}



/* ============================================================
   GRÁFICO FINANCEIRO
   ============================================================ */

function desenharGraficoFinanceiro() {


    const {

        ctx,

        width,

        height

    } =
        prepararCanvas(
            "financeChart"
        );


    /*
       Pega os valores.
    */

    const totais =
        calcularTotais();


    /*
       Descobre o maior valor.
    */

    const max =
        Math.max(
            totais.entradas,
            totais.saidas,
            1
        );


    /*
       Limpa o gráfico.
    */

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
       Desenha os eixos.
    */

    ctx.strokeStyle =
        "#dfe3eb";

    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.moveTo(
        45,
        20
    );

    ctx.lineTo(
        45,
        height - 35
    );

    ctx.lineTo(
        width - 20,
        height - 35
    );

    ctx.stroke();


    /*
       Valores dos gráficos.
    */

    const valores = [

        totais.entradas,

        totais.saidas

    ];


    /*
       Nomes.
    */

    const nomes = [

        "Entradas",

        "Saídas"

    ];


    /*
       Desenha as duas barras.
    */

    valores.forEach(
        (valor, i) => {


            const barWidth =
                Math.min(
                    90,
                    width / 5
                );


            const x =
                width / 2 -
                barWidth -
                12 +
                i *
                (barWidth + 24);


            const barHeight =
                (valor / max) *
                170;


            const y =
                height -
                35 -
                barHeight;


            /*
               Cor da barra.
            */

            ctx.fillStyle =
                i === 0
                    ? "#20a45a"
                    : "#e34646";


            ctx.fillRect(

                x,

                y,

                barWidth,

                barHeight

            );


            /*
               Texto.
            */

            ctx.fillStyle =
                "#333";


            ctx.font =
                "10px Segoe UI";


            ctx.textAlign =
                "center";


            ctx.fillText(

                nomes[i],

                x +
                barWidth / 2,

                height - 15

            );


            /*
               Valor.
            */

            ctx.fillText(

                moeda(valor),

                x +
                barWidth / 2,

                y - 8

            );

        }
    );

}



/* ============================================================
   GRÁFICO DE ESTOQUE
   ============================================================ */

function desenharGraficoEstoque() {


    const {

        ctx,

        width,

        height

    } =
        prepararCanvas(
            "stockChart"
        );


    /*
       Limpa.
    */

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
       Eixos.
    */

    ctx.strokeStyle =
        "#dfe3eb";

    ctx.beginPath();

    ctx.moveTo(
        45,
        20
    );

    ctx.lineTo(
        45,
        height - 35
    );

    ctx.lineTo(
        width - 20,
        height - 35
    );

    ctx.stroke();


    /*
       Se não houver produto.
    */

    if (
        produtos.length === 0
    ) {

        ctx.fillStyle =
            "#777f8b";

        ctx.font =
            "11px Segoe UI";

        ctx.textAlign =
            "center";

        ctx.fillText(

            "Nenhum produto cadastrado.",

            width / 2,

            height / 2

        );

        return;

    }


    /*
       Descobre a maior quantidade.
    */

    const max =
        Math.max(
            ...produtos.map(
                produto =>
                    produto.quantidade
            ),
            1
        );


    /*
       Área disponível.
    */

    const area =
        width - 75;


    /*
       Largura das barras.
    */

    const quantidade =
        Math.min(
            produtos.length,
            8
        );


    const barWidth =
        Math.min(
            60,
            area / quantidade - 10
        );


    /*
       Cria cada barra.
    */

    produtos
        .slice(0, 8)
        .forEach(
            (produto, i) => {


                const x =
                    55 +
                    i *
                    (
                        area /
                        quantidade
                    );


                const barHeight =
                    (
                        produto.quantidade /
                        max
                    ) *
                    170;


                const y =
                    height -
                    35 -
                    barHeight;


                /*
                   Barra azul.
                */

                ctx.fillStyle =
                    "#155df5";


                ctx.fillRect(

                    x,

                    y,

                    barWidth,

                    barHeight

                );


                /*
                   Quantidade.
                */

                ctx.fillStyle =
                    "#333";

                ctx.font =
                    "9px Segoe UI";

                ctx.textAlign =
                    "center";


                ctx.fillText(

                    produto.quantidade,

                    x +
                    barWidth / 2,

                    y - 7

                );


                /*
                   Nome do produto.
                */

                let nome =
                    produto.nome;


                /*
                   Diminui nomes muito grandes.
                */

                if (
                    nome.length > 9
                ) {

                    nome =
                        nome.substring(
                            0,
                            9
                        ) +
                        "...";

                }


                ctx.fillText(

                    nome,

                    x +
                    barWidth / 2,

                    height - 15

                );

            }
        );

}



/* ============================================================
   ATUALIZAR GRÁFICOS AO REDIMENSIONAR A JANELA
   ============================================================ */

window.addEventListener(
    "resize",
    () => {


        /*
           Só redesenha se
           a página de gráficos
           estiver aberta.
        */

        if (

            !document
                .getElementById(
                    "graficosPanel"
                )
                .classList
                .contains("hidden")

        ) {

            desenharGraficos();

        }

    }
);