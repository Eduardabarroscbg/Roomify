# 🏠 Roomify — Visualizador de Plantas com IA

O **Roomify** é uma plataforma web que usa inteligência artificial para transformar plantas baixas 2D em renders 3D fotorrealistas. Basta enviar a imagem da sua planta e em segundos você vê como os ambientes ficariam decorados e mobiliados.

## 📌 Sobre
Este projeto é uma implementação **focada em aprendizado** de uma plataforma de visualização de interiores com IA, explorando:
- **Integração com modelos de IA generativa** (DALL-E 3 e Gemini) para renderização de ambientes.
- **Comparação interativa** antes & depois com slider animado.
- **Autenticação e persistência de dados** via Puter.js.
- **Design responsivo** com Tailwind CSS.
- **Upload por drag & drop** com suporte a JPEG, PNG e WEBP.

## 🛠 Tech Stack

- [![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/) - Biblioteca principal para a interface.
- [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) - Tipagem estática para maior segurança.
- [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/) - Build tool de próxima geração.
- [![Tailwind CSS](https://img.shields.io/badge/Tailwind-ffffff?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8)](https://tailwindcss.com/) - Framework CSS utilitário.
- [![Puter.js](https://img.shields.io/badge/Puter.js-FF6B35?style=for-the-badge&logo=javascript&logoColor=white)](https://puter.com) - Autenticação, banco de dados KV e hospedagem.
- [![DALL-E 3](https://img.shields.io/badge/DALL--E%203-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/dall-e-3) - Geração de imagens 3D via IA.
- [![Gemini](https://img.shields.io/badge/Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com) - Modelo alternativo com referência visual.

## 🚀 Funcionalidades
- 🏗️ **Renders 3D isométricos gerados por IA** a partir de plantas baixas.
- 🔁 **Slider interativo de comparação** Antes & Depois.
- 💾 **Salvamento de projetos** vinculado à conta Puter do usuário.
- 📤 **Exportação da imagem** gerada com um clique.
- 📱 **Layout responsivo** para todos os tamanhos de tela.
- 🖱️ **Upload por drag & drop** com suporte a múltiplos formatos.

## 📂 Estrutura do Projeto
```
src/
├── components/
│   ├── Navbar.tsx          # Barra de navegação com login/logout
│   ├── Upload.tsx          # Componente de envio de arquivos (drag & drop)
│   └── ui/
│       └── Button.tsx      # Botão reutilizável
├── context/
│   └── AuthContext.ts      # Contexto de autenticação via Puter
├── lib/
│   ├── ai.action.ts        # Chamada da IA para geração do render
│   ├── puter.action.ts     # CRUD de projetos no banco Puter (KV)
│   ├── puter.hosting.ts    # Upload de imagens no Puter
│   ├── constants.ts        # Constantes e prompt da IA
│   └── utils.ts            # Funções auxiliares
├── routes/
│   ├── Home.tsx            # Página inicial com hero e lista de projetos
│   └── Visualizer.tsx      # Página do render com comparação antes/depois
├── App.tsx                 # Rotas e contexto de autenticação
├── index.css               # Tema visual (cores laranja/marrom)
└── main.tsx                # Ponto de entrada do React
```

## 🔧 Como rodar

>[!IMPORTANT]
>Você precisará ter o [Node.js](https://nodejs.org/) 18 ou superior instalado, além de uma conta gratuita no [Puter](https://puter.com).

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Eduardabarroscbg/roomify.git
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Rode o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
4. Acesse [http://localhost:5173](http://localhost:5173) no navegador.

## 🔑 Configuração da chave de IA (opcional)

O app funciona sem configuração extra usando o **DALL-E 3 via Puter**.

Se quiser usar o **Gemini com a sua planta como referência** (render mais fiel ao layout), obtenha uma chave gratuita em [aistudio.google.com](https://aistudio.google.com) e crie um arquivo `.env.local` na raiz:

```env
VITE_GEMINI_API_KEY=SuaChaveAqui
```

> ⚠️ Nunca compartilhe sua chave de API publicamente.

---

## 🗂️ Estrutura do projeto

```
roomify/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx          # Barra de navegação com login/logout
│   │   ├── Upload.tsx          # Componente de envio de arquivos (drag & drop)
│   │   └── ui/Button.tsx       # Botão reutilizável
│   ├── context/
│   │   └── AuthContext.ts      # Contexto de autenticação via Puter
│   ├── lib/
│   │   ├── ai.action.ts        # Chamada da IA para geração do render
│   │   ├── puter.action.ts     # CRUD de projetos no banco Puter (KV)
│   │   ├── puter.hosting.ts    # Upload de imagens no Puter
│   │   ├── constants.ts        # Constantes e prompt da IA
│   │   └── utils.ts            # Funções auxiliares
│   ├── routes/
│   │   ├── Home.tsx            # Página inicial com hero e lista de projetos
│   │   └── Visualizer.tsx      # Página do render com comparação antes/depois
│   ├── App.tsx                 # Rotas e contexto de autenticação
│   ├── index.css               # Tema visual (cores laranja/marrom)
│   └── main.tsx                # Ponto de entrada do React
├── index.html                  # Carrega o script do Puter via CDN
└── package.json
```

---

## 🛠️ Tecnologias usadas

| Tecnologia | Função |
|---|---|
| React 18 + TypeScript | Interface do usuário |
| Vite | Build e servidor de desenvolvimento |
| Tailwind CSS | Estilização base |
| Puter.js (CDN) | Autenticação, banco de dados KV e hospedagem |
| DALL-E 3 via Puter | Geração das imagens 3D |
| react-compare-slider | Slider de comparação Antes/Depois |
| lucide-react | Ícones |

---

## 📋 Como usar o app

1. **Acesse** `http://localhost:5173`
2. **Clique em "Entrar"** no canto superior direito e faça login com sua conta Puter
3. **Envie uma planta baixa** — arraste o arquivo para a área de upload ou clique nela
4. **Aguarde a IA gerar** o render 3D (pode levar de 30 segundos a 2 minutos)
5. **Compare** a planta original com o render usando o slider
6. **Exporte** a imagem clicando no botão "Exportar"

---

## ⚠️ Observações importantes

- **A IA não replica a planta exatamente** — ela interpreta os cômodos e gera uma visualização inspirada no layout, mas pode variar proporções e adicionar elementos decorativos
- **O Puter é necessário** para autenticação e para salvar os projetos. É gratuito e não precisa de cartão
- **O modelo gratuito (DALL-E 3)** gera imagens de alta qualidade, mas sem usar sua planta como referência direta
- **O modelo Gemini** (com chave da API) usa sua planta como referência, gerando resultados mais fiéis ao layout

---

## 📄 Licença

Projeto criado para fins educacionais baseado no tutorial da JS Mastery.
