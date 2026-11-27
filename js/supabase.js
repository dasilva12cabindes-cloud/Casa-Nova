// Se a chave vier com nome diferente, apanha na mesma
var SUPABASE_CHAVE = typeof SUPABASE_ANON_KEY !== 'undefined' ? SUPABASE_ANON_KEY : SUPABASE_KEY;
var db = null;
try {
  db = supabase.createClient(SUPABASE_URL, SUPABASE_CHAVE);
  window.db = db;
} catch(e) {
  console.log("Erro Supabase:", e);
}

function kz(valor){
  return Number(valor || 0).toLocaleString('pt-AO') + ' Kz';
}
function lerCarrinho(){
  try { return JSON.parse(localStorage.getItem("carrinho") || "[]"); }
  catch(e){ return []; }
}
function gravarCarrinho(c){
  localStorage.setItem("carrinho", JSON.stringify(c));
}
function adicionarAoCarrinho(p){
  var c = lerCarrinho();
  var achado = c.find(function(x){ return x.id === p.id; });
  if(achado){ achado.qtd++; }
  else { c.push({ id: p.id, nome: p.nome, preco: p.preco, qtd: 1 }); }
  gravarCarrinho(c);
}