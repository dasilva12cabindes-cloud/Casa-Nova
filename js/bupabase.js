var db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function kz(valor) {
  return new Intl.NumberFormat("pt-AO", { maximumFractionDigits: 0 }).format(valor) + " Kz";
}

function lerCarrinho() {
  try { return JSON.parse(localStorage.getItem("carrinho")) || []; }
  catch (e) { return []; }
}
function gravarCarrinho(c) {
  try { localStorage.setItem("carrinho", JSON.stringify(c)); } catch (e) {}
  atualizarContador();
}
function adicionarAoCarrinho(p, qtd) {
  qtd = qtd || 1;
  var c = lerCarrinho();
  var item = c.find(function (i) { return i.id === p.id; });
  if (item) item.qtd += qtd;
  else c.push({ id: p.id, nome: p.nome, preco: p.preco, imagem_url: p.imagem_url, qtd: qtd });
  gravarCarrinho(c);
}
function atualizarContador() {
  var n = lerCarrinho().reduce(function (s, i) { return s + i.qtd; }, 0);
  var el = document.getElementById("cart-count");
  if (el) el.textContent = n;
}

async function atualizarCabecalho() {
  atualizarContador();
  var box = document.getElementById("auth-links");
  if (!box) return;
  var res = await db.auth.getSession();
  var session = res.data.session;
  if (!session) {
    box.innerHTML = '<a href="login.html">Entrar</a>';
    return;
  }
  var p = await db.from("perfis").select("role").eq("id", session.user.id).single();
  var html = "";
  if (p.data && p.data.role === "admin") html += '<a href="admin.html">Admin</a>';
  html += '<a href="#" id="sair">Sair</a>';
  box.innerHTML = html;
  document.getElementById("sair").onclick = async function (e) {
    e.preventDefault();
    await db.auth.signOut();
    location.href = "index.html";
  };
}
document.addEventListener("DOMContentLoaded", atualizarCabecalho);
