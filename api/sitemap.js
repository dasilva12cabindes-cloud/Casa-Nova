export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://casa-nova-six.vercel.app/</loc></url>
  <url><loc>https://casa-nova-six.vercel.app/sobre.html</loc></url>
  <url><loc>https://casa-nova-six.vercel.app/loja.html</loc></url>
  <url><loc>https://casa-nova-six.vercel.app/produto.html</loc></url>
  <url><loc>https://casa-nova-six.vercel.app/promocao.html</loc></url>
  <url><loc>https://casa-nova-six.vercel.app/blog.html</loc></url>
  <url><loc>https://casa-nova-six.vercel.app/contato.html</loc></url>
  <url><loc>https://casa-nova-six.vercel.app/carrinho.html</loc></url>
  <url><loc>https://casa-nova-six.vercel.app/checkout.html</loc></url>
  <url><loc>https://casa-nova-six.vercel.app/favoritos.html</loc></url>
</urlset>`);
}