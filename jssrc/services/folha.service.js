export default function folhaService(folhaRepository) {

  this.pesquisa = (pagina) => {
    return folhaRepository.pesquisaTudo(pagina);
  }
}