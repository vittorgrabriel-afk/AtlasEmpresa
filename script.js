let produtos =
    JSON.parse(
        localStorage.getItem("atlasProdutos")
    ) || [];

let movimentos =
    JSON.parse(
        localStorage.getItem("atlasMovimentos")
    ) || [];

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

function fazerLogin(event) {

    event.preventDefault();

    const usuario =
        document
            .getElementById("usuario")
            .value
            .trim();

    const senha =
        document
            .getElementById("senha")
            .value;

    if (
        usuario.toLowerCase() === "adm123" &&
        senha === "123456"
    ) {

        document
            .getElementById("loginError")
            .textContent = "";

        document
            .getElementById("loginPage")
            .classList
            .add("hidden");

        document
            .getElementById("dashboardPage")
            .classList
            .remove("hidden");

        abrirPainel("cadastro");

    } else {

        document
            .getElementById("loginError")
            .textContent =
            "Usuário ou senha incorretos.";

    }

}

function mostrarSenha() {

    const campo =
        document.getElementById("senha");

    if (campo.type === "password") {

        campo.type = "text";

    } else {

        campo.type = "password";

    }

}

function sair() {

    document
        .getElementById("dashboardPage")
        .classList
        .add("hidden");

    document
        .getElementById("loginPage")
        .classList
        .add("hidden");

    document
        .getElementById("homePage")
        .classList
        .remove("hidden");

}

function abrirPainel(nome) {

    document
        .querySelectorAll(".panel-section")
        .forEach(
            secao => {

                secao
                    .classList
                    .add("hidden");

            }
        );

    document
        .getElementById(nome + "Panel")
        .classList
        .remove("hidden");

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

function salvarDados() {

    localStorage.setItem(
        "atlasProdutos",
        JSON.stringify(produtos)
    );

    localStorage.setItem(
        "atlasMovimentos",
        JSON.stringify(movimentos)
    );

}

function cadastrarProduto(event) {

    event.preventDefault();

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

    produtos.push(produto);

    salvarDados();

    event.target.reset();

    alert(
        "Produto cadastrado com sucesso!"
    );

    abrirPainel("estoque");

}

function formatarData(data) {

    if (!data) {

        return "-";

    }

    const partes =
        data.split("-");

    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}

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

function atualizarEstoque() {

    const body =
        document
            .getElementById("estoqueBody");

    const vazio =
        document
            .getElementById("estoqueVazio");

    body.innerHTML = "";

    if (produtos.length === 0) {

        vazio.style.display = "block";

        return;

    }

    vazio.style.display = "none";

    produtos.forEach(
        produto => {

            const tr =
                document.createElement("tr");

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

            body.appendChild(tr);

        }
    );

}

function excluirProduto(id) {

    if (
        !confirm(
            "Deseja excluir este produto?"
        )
    ) {

        return;

    }

    produtos =
        produtos.filter(
            produto =>
                produto.id !== id
        );

    salvarDados();

    atualizarEstoque();

}

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

function adicionarMovimento() {

    const tipo =
        document
            .getElementById("tipoMovimento")
            .value;

    const valor =
        Number(
            document
                .getElementById("valorMovimento")
                .value
        );

    const descricao =
        document
            .getElementById("descricaoMovimento")
            .value
            .trim();

    if (!valor || valor <= 0) {

        alert(
            "Digite um valor válido."
        );

        return;

    }

    movimentos.push({

        id: Date.now(),

        tipo: tipo,

        valor: valor,

        descricao: descricao,

        data:
            new Date().toISOString()

    });

    salvarDados();

    document
        .getElementById("valorMovimento")
        .value = "";

    document
        .getElementById("descricaoMovimento")
        .value = "";

    atualizarFinanceiro();

}

function calcularTotais() {

    let entradas = 0;

    let saidas = 0;

    movimentos.forEach(
        movimento => {

            if (
                movimento.tipo ===
                "entrada"
            ) {

                entradas +=
                    Number(
                        movimento.valor
                    );

            } else {

                saidas +=
                    Number(
                        movimento.valor
                    );

            }

        }
    );

    return {

        entradas: entradas,

        saidas: saidas,

        saldo:
            entradas - saidas

    };

}

function atualizarFinanceiro() {

    const totais =
        calcularTotais();

    document
        .getElementById("totalEntradas")
        .textContent =
        moeda(totais.entradas);

    document
        .getElementById("totalSaidas")
        .textContent =
        moeda(totais.saidas);

    document
        .getElementById("saldoFinanceiro")
        .textContent =
        moeda(totais.saldo);

    atualizarPeriodo();

}

function atualizarPeriodo() {

    const body =
        document
            .getElementById("periodoBody");

    const agora =
        new Date();

    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(2, "0");

    const periodo =
        `${agora.getFullYear()}-${mes}`;

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

function selecionarPeriodo(botao) {

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

    botao.classList
        .add("selected");

}

function desenharGraficos() {

    desenharGraficoFinanceiro();

    desenharGraficoEstoque();

}

function prepararCanvas(id) {

    const canvas =
        document
            .getElementById(id);

    const rect =
        canvas.getBoundingClientRect();

    const dpr =
        window.devicePixelRatio || 1;

    canvas.width =
        rect.width * dpr;

    canvas.height =
        250 * dpr;

    const ctx =
        canvas.getContext("2d");

    ctx.scale(
        dpr,
        dpr
    );

    return {

        canvas: canvas,

        ctx: ctx,

        width: rect.width,

        height: 250

    };

}

function desenharGraficoFinanceiro() {

    const {
        ctx,
        width,
        height
    } =
        prepararCanvas(
            "financeChart"
        );

    const totais =
        calcularTotais();

    const max =
        Math.max(
            totais.entradas,
            totais.saidas,
            1
        );

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

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

    const valores = [
        totais.entradas,
        totais.saidas
    ];

    const nomes = [
        "Entradas",
        "Saídas"
    ];

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

            ctx.fillText(
                moeda(valor),
                x +
                barWidth / 2,
                y - 8
            );

        }
    );

}

function desenharGraficoEstoque() {

    const {
        ctx,
        width,
        height
    } =
        prepararCanvas(
            "stockChart"
        );

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

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

    const max =
        Math.max(
            ...produtos.map(
                produto =>
                    produto.quantidade
            ),
            1
        );

    const area =
        width - 75;

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

                ctx.fillStyle =
                    "#155df5";

                ctx.fillRect(
                    x,
                    y,
                    barWidth,
                    barHeight
                );

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

                let nome =
                    produto.nome;

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

window.addEventListener(
    "resize",
    () => {

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
```
