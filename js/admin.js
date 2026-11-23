async function carregarAdmin(){
  const cats = await db.from("categorias").select("*").order("nome");
  const prods = await db.from("produtos").select("*, categorias(nome)").order("criado_em", {ascending:false});

  const sel = document.getElementById("p-cat");
  sel.innerHTML = (cats.data||[]).map(c=>`<option value="${c.id}">${c.nome}</option>`).join("");

  document.getElementById("cat-lista").innerHTML = (cats.data||[]).map(c=>`
    <div class="linha"><div class="info">${c.nome}</div>
    <button class="mini vermelho" onclick="apagarCat(${c.id})">Apagar</button></div>`).join("");

  document.getElementById("p-lista").innerHTML = (prods.data||[]).map(p=>`
    <div class="linha">
      <img src="${p.imagem_url || 'logo.png'}">
      <div class="info"><b>${p.nome}</b><br>${kz(p.preco)} | Stock: ${p.stock} | ${p.categorias ? p.categorias.nome : ''}</div>
      <button class="mini vermelho" onclick="apagarProd(${p.id})">Apagar</button>
    </div>`).join("");
}

document.getElementById("cat-add").onclick = async function(){
  const nome = document.getElementById("cat-nome").value.trim();
  if(!nome) return alert("Escreve o nome da categoria");
  const r = await db.from("categorias").insert({nome});
  if(r.error) return alert("Erro: " + r.error.message);
  document.getElementById("cat-nome").value = "";
  document.getElementById("msg").textContent = "Categoria adicionada ✓";
  carregarAdmin();
};

document.getElementById("p-add").onclick = async function(){
  const nome = document.getElementById("p-nome").value.trim();
  const preco = Number(document.getElementById("p-preco").value);
  const stock = Number(document.getElementById("p-stock").value || 10);
  const categoria_id = Number(document.getElementById("p-cat").value);
  const descricao = document.getElementById("p-desc").value.trim();
  const imagem_url = document.getElementById("p-foto").value.trim();

  if(!nome || !preco) return alert("Preenche nome e preço");

  const r = await db.from("produtos").insert({ nome, preco, stock, categoria_id, descricao, imagem_url, ativo: true });
  if(r.error) return alert("Erro: " + r.error.message);

  document.getElementById("msg").textContent = "Produto guardado ✓";
  document.getElementById("p-nome").value = "";
  document.getElementById("p-preco").value = "";
  document.getElementById("p-desc").value = "";
  document.getElementById("p-foto").value = "";
  carregarAdmin();
};

async function apagarCat(id){
  if(!confirm("Apagar categoria?")) return;
  const r = await db.from("categorias").delete().eq("id", id);
  if(r.error) return alert("Erro: " + r.error.message);
  carregarAdmin();
}
async function apagarProd(id){
  if(!confirm("Apagar produto?")) return;
  const r = await db.from("produtos").delete().eq("id", id);
  if(r.error) return alert("Erro: " + r.error.message);
  carregarAdmin();
}

carregarAdmin();