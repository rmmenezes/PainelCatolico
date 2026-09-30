# Paz em Oração

Plataforma web de oração católica e apoio à saúde mental (pt-BR). Sem dependências e sem etapa de build: HTML, CSS e JavaScript puro, pronta para GitHub Pages.

## Recursos
- **Orações em português e latim**: alternador PT / LA / PT·LA (lado a lado) no topo. Pai Nosso, Ave Maria, Credo, Salve Rainha, Memorare, Anima Christi, Completas e outras, além de orações originais para ansiedade, pânico, tristeza e culpa.
- **Música de fundo** (14 faixas geradas no navegador, em 4 grupos): Sacro (gregoriano, vésperas, órgão, harpa, sinos do Ângelus), Brasil (bendito do sertão, viola de romaria, sanfona de novena), Clássicos (Cânon de Pachelbel, Noite Feliz, violoncelos, piano) e Natureza (flauta, chuva). Cada faixa toca num canal próprio, que é cortado ao trocar.
- **Gravações próprias**: coloque MP3 em `musicas/` e registre em `src/playlist.js` (ex.: cantos tradicionais gravados pela sua paróquia); eles entram na lista do player.
- **Cantos tradicionais brasileiros** (letras): A treze de maio, Queremos Deus, Com minha Mãe estarei, Tão sublime sacramento.
- **Práticas**: Santo Terço guiado (mistérios do dia), respiração com oração (4-4-6, 4-7-8, quadrada), aterramento 5-4-3-2-1, Lectio Divina, silêncio com sino, contador de jaculatórias e exame do dia.
- **Santos na tribulação**: 16 santos (Teresa de Ávila, Agostinho, Francisco de Sales, Padre Pio, Teresinha, Faustina, Santa Dulce dos Pobres, Carlo Acutis…) com biografia, como enfrentaram a dor, frases com fonte, conselho prático e pedido de intercessão. Mural de frases filtrável por tema (ansiedade, medo, doença, culpa…).
- **Via Sacra**: as 14 estações com meditação, oração e Stabat Mater (PT/LA); guia de 25 obras de arte (Aleijadinho, Portinari, El Greco, Caravaggio, Rubens…) e de 8 lugares para rezar e fotografar, com links para imagens livres no Wikimedia Commons.
- **Terço da Misericórdia** guiado, Ângelus, Regina Caeli, São Miguel e 7 salmos (PT e Vulgata).
- **Leituras** sobre ansiedade, sono, culpa, santos que sofreram e quando buscar ajuda, cada uma com uma oração.
- **Check-in de humor** e **diário** (salvos apenas no aparelho, via localStorage).
- **Ajuda imediata**: CVV 188, SAMU 192, Bombeiros 193, CAPS/UBS.
- Tema claro/escuro, responsivo, acessível por teclado.

## Meu caminho (perfil e desempenho)
- **Perfil local** com nome e PIN opcional (vários perfis por aparelho). Sem servidor: os dados ficam no navegador. O PIN separa pessoas que dividem o aparelho; não é criptografia.
- **Plano diário** (modelos prontos ou itens próprios) que se marca sozinho ao concluir práticas, rezar orações, fazer o devocional ou ler textos.
- **Desempenho**: sequência de dias, melhor sequência, minutos e dias no mês, calendário de 12 semanas, minutos por dia (14 dias, com tabela) e atividades recentes.
- **Backup** em arquivo JSON para levar o perfil a outro aparelho.
- **Devocional diário**: versículo, reflexão, gesto concreto e oração, com os dias anteriores.

## Aparência
Botão **Aa** no topo: 5 estilos de fonte (Clássico, Tradicional, Moderno, Suave e Leitura fácil, com Atkinson Hyperlegible para baixa visão), 4 tamanhos de texto e tema automático, claro ou escuro. As fontes são auto-hospedadas em `fonts/` (licença OFL), sem Google Fonts.

## Imagens da Via Sacra
As obras e os lugares aparecem dentro do app, buscados pelo navegador do visitante na API pública do Wikimedia Commons (licenças livres, com autor e licença na legenda; cache de 30 dias). Sem conexão, o app mostra as ilustrações próprias. Obras ainda protegidas por direito autoral (Portinari, Dalí) não são exibidas.

## Estrutura
- `index.html`: casca da página
- `src/data.js`: orações, mistérios, práticas · `src/articles.js`: leituras · `src/saints.js`: santos · `src/viasacra.js`: Via Sacra
- `src/progress.js`: perfis, plano e registro · `src/devocional.js`: devocionais · `src/commons.js`: imagens do acervo
- `src/playlist.js` + `musicas/`: gravações opcionais
- `src/art.js`: ilustrações sacras em SVG (vitral, terço, pomba, velas, Bíblia, Sagrado Coração, lírios, noite)
- `src/audio.js`: música ambiente · `src/app.js`: telas · `src/styles.css`: visual

## Publicar no GitHub Pages
Em **Settings → Pages → Source**, escolha **GitHub Actions**. O workflow `.github/workflows/pages.yml` publica a cada push na `main`.

## Executar localmente
```
python3 -m http.server 8000   # e abra http://localhost:8000
```

> Este app oferece apoio espiritual e bem-estar e não substitui atendimento psicológico, psiquiátrico ou médico. Sugere-se revisão dos textos por um sacerdote ou pastoral.
