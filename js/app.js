var todos = [];
var categoriaAtual = null;

function atualizarContador(){
  var c = lerCarrinho();
  var totalQtd = 0;
  c.forEach(function(i){ totalQtd += i.qtd; });
  var el = document.getElementById("contador");
  if(el) el.textContent = totalQtd;
}

async function carregar() {
  atualizarContador();
  var box = document.getElementById("produtos");
  if(box) box.innerHTML = '<p class="aviso">A carregar...</p>';
  var cats = await db.from("categorias").select("*").order("nome");
  var prods = await db.from("produtos").select("*").eq("ativo", true).order("criado_em", { ascending: false });
  if (prods.error) {
    document.getElementById("produtos").innerHTML = '<p class="aviso">Erro: ' + prods.error.message + '</p>';
    return;
  }
  if (!prods.data || !prods.data.length) {
    document.getElementById("produtos").innerHTML = '<p class="aviso">Nenhum produto ainda.</p>';
    return;
  }
  todos = prods.data;
  desenharCategorias(cats.data || []);
  desenharProdutos();
}
function desenharCategorias(cats) {
  var box = document.getElementById("categorias");
  if(!box) return;
  box.innerHTML = '<button class="chip ativo" data-id="">Todos</button>' +
    cats.map(function (c) { return '<button class="chip" data-id="' + c.id + '">' + c.nome + '</button>'; }).join("");
  box.onclick = function (e) {
    if (!e.target.classList.contains("chip")) return;
    categoriaAtual = e.target.dataset.id ? Number(e.target.dataset.id) : null;
    box.querySelectorAll(".chip").forEach(function (b) { b.classList.toggle("ativo", b === e.target); });
    desenharProdutos();
  };
}
function desenharProdutos() {
  var termo = document.getElementById("busca") ? document.getElementById("busca").value.toLowerCase() : "";
  var lista = todos.filter(function (p) {
    return (!categoriaAtual || p.categoria_id === categoriaAtual) && p.nome.toLowerCase().includes(termo);
  });
  var box = document.getElementById("produtos");
  if (!lista.length) { box.innerHTML = '<p class="aviso">Nenhum produto encontrado.</p>'; return; }
  box.innerHTML = lista.map(function (p) {
    var botao = p.stock > 0 ? '<button class="btn" data-add="' + p.id + '">Adicionar</button>' : '<button class="btn" disabled>Esgotado</button>';
    return '<div class="card"><a href="produto.html?id=' + p.id + '"><img src="' + (p.imagem_url || "logo.png") + '" alt="' + p.nome + '" loading="lazy"><h3>' + p.nome + '</h3></a><p class="preco">' + kz(p.preco) + '</p>' + botao + '</div>';
  }).join("");
}
document.addEventListener("click", function (e) {
  var id = e.target.dataset && e.target.dataset.add;
  if (!id) return;
  var p = todos.find(function (x) { return x.id === Number(id); });
  adicionarAoCarrinho(p);
  atualizarContador();
  e.target.textContent = "Adicionado ✓";
  setTimeout(function () { e.target.textContent = "Adicionar"; }, 1200);
});
var buscaInput = document.getElementById("busca");
if(buscaInput) buscaInput.addEventListener("input", desenharProdutos);
carregar();