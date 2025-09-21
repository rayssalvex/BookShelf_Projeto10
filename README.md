# 📚 BookShelf - Projeto 10

## 🚀 Visão Geral
O **BookShelf** é uma aplicação web moderna para gerenciamento de biblioteca pessoal.  
Permite aos usuários **catalogar, organizar e acompanhar o progresso de leitura** de seus livros, com uma interface responsiva, acessível e de alto desempenho.

---

## 🛠️ Tecnologias
- **Next.js 15** (App Router)  
- **React 19**  
- **TypeScript**  
- **Tailwind CSS**  
- **shadcn/ui** (design system e componentes)  

---

## ✨ Funcionalidades
- **Dashboard** com estatísticas (livros cadastrados, em leitura, finalizados, páginas lidas).  
- **Biblioteca**: listagem de livros com busca, filtros e cards completos.  
- **Adicionar/Editar Livro**: formulários com preview de capa, barra de progresso, validação e feedback visual.  
- **Detalhes do Livro**: exibição de sinopse e informações completas.  
- **Excluir Livro**: confirmação antes da exclusão, com feedback claro.  

---

## 📖 Estrutura de Dados
Cada **Livro** possui:  
- `id`, `title`, `author` (obrigatórios)  
- `genre`, `year`, `pages`, `rating`, `synopsis`, `cover`  

**Status de leitura**: `QUERO_LER`, `LENDO`, `LIDO`, `PAUSADO`, `ABANDONADO`.  
**Gêneros disponíveis**: Literatura Brasileira, Ficção Científica, Realismo Mágico, Fantasia, Romance, Biografia, História, Autoajuda, Tecnologia, Programação, Negócios, Psicologia, Filosofia, Poesia.  

---

## 🎨 Requisitos de Interface
- Design **mobile-first** responsivo.  
- **Acessibilidade**: navegação por teclado, contraste adequado, labels em formulários.  
- **Performance**: lazy loading, otimização de imagens, estados de loading.  
- **Feedback Visual**: toasts, notificações e confirmações para ações destrutivas.  

---

## 📦 Dados Iniciais
O sistema inicia com **5 livros pré-cadastrados** contendo:  
- Diferentes gêneros  
- Diferentes anos de publicação  
- Avaliações variadas  
- Sinopses completas  
- Capas funcionais  

---

## 📚 Recursos Recomendados
- [Next.js 15 Docs](https://nextjs.org/docs)  
- [shadcn/ui Docs](https://ui.shadcn.com)  
- [React Docs](https://react.dev)  
- [Tailwind CSS Docs](https://tailwindcss.com/docs)  
