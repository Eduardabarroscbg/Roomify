# 🏠 Roomify — Visualizador de Plantas com IA

O **Roomify** é uma plataforma web que usa inteligência artificial para transformar plantas baixas 2D em renders 3D fotorrealistas. Basta enviar a imagem da sua planta e em segundos você vê como os ambientes ficariam decorados e mobiliados.

---
....
## ✨ O que o Roomify faz?

- **Envio de planta baixa** — Você faz upload de uma imagem da sua planta (JPEG, PNG ou WEBP)
- **Geração com IA** — A IA interpreta os cômodos e gera uma visualização 3D isométrica com móveis, piso, iluminação e decoração
- **Comparação Antes & Depois** — Slider interativo para comparar a planta original com o render gerado
- **Exportar** — Baixe a imagem do render gerado com um clique
- **Salvar projetos** — Todos os seus projetos ficam salvos na sua conta Puter

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18 ou superior
- Conta gratuita no [Puter](https://puter.com)

### Passo a passo

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev

# 3. Acesse no navegador
http://localhost:5173
```

---

## 🔑 Configuração da chave de IA (opcional)

O app funciona sem configuração extra usando o DALL-E 3 via Puter.

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
