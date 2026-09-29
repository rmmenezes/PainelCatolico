# Paz em Oração

Plataforma web de oração católica e apoio à saúde mental (pt-BR). Sem dependências e sem etapa de build: HTML, CSS e JavaScript puro, pronta para GitHub Pages.

## Recursos
- **Orações em português e latim**: alternador PT / LA / PT·LA (lado a lado) no topo. Pai Nosso, Ave Maria, Credo, Salve Rainha, Memorare, Anima Christi, Completas e outras, além de orações originais para ansiedade, pânico, tristeza e culpa.
- **Música ambiente gregoriana**: gerada no navegador (Web Audio): bordão grave, melodia lenta no modo dórico e órgão paralelo. Sem arquivos de áudio. Inicia no primeiro toque na página; pausa e volume no topo.
- **Práticas**: Santo Terço guiado (mistérios do dia), respiração com oração (4-4-6, 4-7-8, quadrada), aterramento 5-4-3-2-1, Lectio Divina, silêncio com sino, contador de jaculatórias e exame do dia.
- **Leituras** sobre ansiedade, sono, culpa, santos que sofreram e quando buscar ajuda, cada uma com uma oração.
- **Check-in de humor** e **diário** (salvos apenas no aparelho, via localStorage).
- **Ajuda imediata**: CVV 188, SAMU 192, Bombeiros 193, CAPS/UBS.
- Tema claro/escuro, responsivo, acessível por teclado.

## Estrutura
- `index.html`: casca da página
- `src/data.js`: orações, mistérios, práticas · `src/articles.js`: leituras
- `src/audio.js`: música ambiente · `src/app.js`: telas · `src/styles.css`: visual

## Publicar no GitHub Pages
Em **Settings → Pages → Source**, escolha **GitHub Actions**. O workflow `.github/workflows/pages.yml` publica a cada push na `main`.

## Executar localmente
```
python3 -m http.server 8000   # e abra http://localhost:8000
```

> Este app oferece apoio espiritual e bem-estar e não substitui atendimento psicológico, psiquiátrico ou médico. Sugere-se revisão dos textos por um sacerdote ou pastoral.
