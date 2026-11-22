var $ = function (id) { return document.getElementById(id); };

function aviso(texto, erro) {
  $("msg").style.color = erro ? "#c0392b" : "#1e7e34";
  $("msg").textContent = texto;
}

async function iniciar() {
  var s = await db.auth.getSession();
  if (!s.data.session) { location.href = "login.html"; return; }
  var p = await db.from("perfis").select("role").eq("id", s.data.session.user.id).single();
  if (!p.data || p.data.role !== "admin") { location.href = "index.html"; return; }
  await listarCategorias();
  await listarProdutos();
}

async function listarCategorias() {
  var r = await db.from("categorias").select("*").order("nome");
  var cats = r.data || [];
  $("cat-lista").innerHTML = cats.map(function (c) {
    return '<div class="linha"><span class="info">' + c.nome + '</span>' +
      '<button class="mini vermelho" data-delcat="' + c.id + '">Apagar</button></div>';
  }).join("");
  $("p-cat").innerHTML = '<option value="">Sem categoria</option>' +
    cats.map(function (c) { return '<option value="' + c.id + '">' + c.nome + '</option>'; }).join("");
}

async function listarProdutos() {
  var r = await db.from("produtos").select("*").order("criado_em", { ascending: false });
  var lista = r.data || [];
  $("p-lista").innerHTML = lista.length ? lista.map(function (p) {
    return '<div class="linha">' +
      '<img src="' + (p.imagem_url || "img/logo.png") + '" alt="">' +
      '<span class="info"><b>' + p.nome + '</b><br>' + kz(p.preco) +
      ' · stock ' + p.stock + (p.ativo ? "" : " · oculto") + '</span>' +
      '<button class="mini" data-toggle="' + p.id + '" data-ativo="' + p.ativo + '">' +
      (p.ativo ? "Ocultar" : "Mostrar") + '</button>' +
      '<button class="mini vermelho" data-delprod="' + p.id + '">Apagar</button></div>';
  }).join("") : "<p>Nenhum produto ainda.</p>";
}

$("cat-add").onclick = async function () {
  var nome = $("cat-nome").value.trim();
  if (!nome) return;
  var r = await db.from("categorias").insert({ nome: nome });
  if (r.error) { aviso(r.error.message, true); return; }
  $("cat-nome").value = "";
  aviso("Categoria adicionada.");
  listarCategorias();
};

$("p-add").onclick = async function () {
  var nome = $("p-nome").value.trim();
  var preco = parseFloat($("p-preco").value);
  if (!nome || isNaN(preco)) { aviso("Preencha o nome e o preço.", true); return; }
  aviso("A guardar...");
  var url = null;
  var foto = $("p-foto").files[0];
  if (foto) {
    var ext = (foto.name.split(".").pop() || "jpg").toLowerCase();
    var caminho = Date.now() + "." + ext;
    var up = await db.storage.from("produtos").upload(caminho, foto);
    if (up.error) { aviso("Erro na foto: " + up.error.message, true); return; }
    url = db.storage.from("produtos").getPublicUrl(caminho).data.publicUrl;
  }
  var r = await db.from("produtos").insert({
    nome: nome,
    preco: preco,
    stock: parseInt($("p-stock").value) || 0,
    categoria_id: $("p-cat").value ? Number($("p-cat").value) : null,
    descricao: $("p-desc").value.trim(),
    imagem_url: url
  });
  if (r.error) { aviso(r.error.message, true); return; }
  ["p-nome", "p-preco", "p-stock", "p-desc", "p-foto"].forEach(function (id) { $(id).value = ""; });
  aviso("Produto guardado!");
  listarProdutos();
};

document.addEventListener("click", async function (e) {
  var d = e.target.dataset;
  if (d.delcat) {
    if (!confirm("Apagar esta categoria?")) return;
    await db.from("categorias").delete().eq("id", d.delcat);
    listarCategorias();
  }
  if (d.delprod) {
    if (!confirm("Apagar este produto?")) return;
    await db.from("produtos").delete().eq("id", d.delprod);
    listarProdutos();
  }
  if (d.toggle) {
    await db.from("produtos").update({ ativo: d.ativo !== "true" }).eq("id", d.toggle);
    listarProdutos();
  }
});

iniciar();
