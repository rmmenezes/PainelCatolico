// Santos e a tribulação. Citações com fonte indicada; as marcadas com attr:true são atribuições tradicionais
// sem fonte documental precisa. Biografias e conselhos: textos originais deste projeto.
window.SAINTS = [
  {
    id: 'teresa-avila', name: 'Santa Teresa de Ávila', dates: '1515–1582', title: 'Doutora da Igreja · Reformadora do Carmelo',
    colors: ['#6b3a7a', '#2a1633'], themes: ['Ansiedade', 'Confiança'],
    trial: 'Passou anos com doenças graves, dores e desmaios; chegou a ficar dias em coma e quase foi enterrada. Enfrentou incompreensões, denúncias e oposição à reforma que conduzia. Por quase vinte anos, disse ela, rezou com secura e dispersão.',
    quotes: [
      { pt: 'Nada te perturbe, nada te espante; tudo passa, Deus não muda. A paciência tudo alcança; quem a Deus tem nada lhe falta: só Deus basta.', orig: 'Nada te turbe, nada te espante, todo se pasa, Dios no se muda; la paciencia todo lo alcanza; quien a Dios tiene nada le falta: sólo Dios basta.', src: 'Poema encontrado em seu breviário', themes: ['Ansiedade', 'Confiança'] },
      { pt: 'A oração mental não é outra coisa senão tratar de amizade, estando muitas vezes a sós com quem sabemos que nos ama.', src: 'Livro da Vida, 8,5', themes: ['Oração'] }
    ],
    help: 'Quando a mente se agita, repita devagar o “Nada te perturbe”, uma frase por respiração. Teresa ensinava que não é preciso pensar muito na oração, mas amar muito: basta olhar para Jesus como a um amigo.',
    prayer: 'Santa Teresa de Ávila, que conheceste a dor e a secura, ensina-me a permanecer na amizade de Deus quando nada sinto. Rogai por nós.'
  },
  {
    id: 'agostinho', name: 'Santo Agostinho', dates: '354–430', title: 'Bispo de Hipona · Doutor da Igreja',
    colors: ['#8a2a3b', '#2b0e16'], themes: ['Inquietação', 'Culpa', 'Confiança'],
    trial: 'Viveu anos de busca angustiada, dividido entre desejos que não o satisfaziam. Sua mãe, Santa Mônica, rezou por ele durante quase vinte anos. Depois da conversão, perdeu a mãe, o filho e amigos queridos, e escreveu com honestidade sobre as próprias lágrimas.',
    quotes: [
      { pt: 'Fizeste-nos para Ti, e inquieto está o nosso coração enquanto não repousa em Ti.', la: 'Fecisti nos ad te, et inquietum est cor nostrum, donec requiescat in te.', src: 'Confissões, I,1', themes: ['Inquietação'] },
      { pt: 'Deus não manda coisas impossíveis; mas, ao mandar, exorta-te a fazer o que podes e a pedir o que não podes, e ajuda-te para que possas.', src: 'A natureza e a graça, 43,50', themes: ['Confiança'] },
      { pt: 'Tarde Te amei, ó Beleza tão antiga e tão nova, tarde Te amei!', la: 'Sero te amavi, pulchritudo tam antiqua et tam nova, sero te amavi!', src: 'Confissões, X,27', themes: ['Culpa'] }
    ],
    help: 'A inquietação do coração não é sinal de que você está longe de Deus: pode ser justamente o caminho até Ele. Faça o que está ao seu alcance hoje e peça, sem vergonha, a graça para o que não consegue.',
    prayer: 'Santo Agostinho, que buscaste a paz por tantos caminhos, ajuda-me a repousar o coração inquieto em Deus. Rogai por nós.'
  },
  {
    id: 'francisco-sales', name: 'São Francisco de Sales', dates: '1567–1622', title: 'Bispo de Genebra · Doutor da Igreja',
    colors: ['#2d6f7c', '#0f2a30'], themes: ['Ansiedade', 'Paciência'],
    trial: 'Na juventude, em Paris, viveu uma crise terrível: convenceu-se de que estava condenado e passou semanas em angústia, sem dormir nem comer direito. Libertou-se ao rezar diante de uma imagem de Nossa Senhora e entregar-se, com o “Lembrai-vos”, ao amor de Deus.',
    quotes: [
      { pt: 'A inquietação é o maior mal que pode sobrevir a uma alma, exceto o pecado.', src: 'Introdução à Vida Devota (Filoteia), IV,11', themes: ['Ansiedade'] },
      { pt: 'Não temais o que pode acontecer amanhã. O mesmo Pai amoroso que cuida de vós hoje cuidará de vós amanhã e todos os dias.', src: 'De suas cartas', attr: true, themes: ['Ansiedade', 'Confiança'] },
      { pt: 'Tende paciência com todas as coisas, mas sobretudo convosco mesmos.', src: 'De suas cartas', attr: true, themes: ['Paciência', 'Culpa'] }
    ],
    help: 'Francisco ensinava a desejar as coisas boas “sem pressa nem inquietação”. Quando perceber que se agitou, não se irrite consigo: volte com calma, como quem reconduz um barco ao rumo, quantas vezes forem precisas.',
    prayer: 'São Francisco de Sales, que venceste a angústia pela confiança, ensina-me a mansidão comigo mesmo e a paz nas pequenas coisas. Rogai por nós.'
  },
  {
    id: 'padre-pio', name: 'São Pio de Pietrelcina', dates: '1887–1968', title: 'Frade capuchinho · Padre Pio',
    colors: ['#6b4a2b', '#24170c'], themes: ['Ansiedade', 'Doença', 'Confiança'],
    trial: 'Teve saúde frágil a vida toda. Carregou por cinquenta anos os estigmas, com dores constantes, e foi alvo de suspeitas e investigações; por anos ficou proibido de celebrar missa em público e de receber fiéis. Obedeceu em silêncio.',
    quotes: [
      { pt: 'Reza, espera e não te preocupes. A preocupação é inútil. Deus é misericordioso e ouvirá a tua oração.', src: 'Conselho frequente em sua direção espiritual', attr: true, themes: ['Ansiedade', 'Confiança'] },
      { pt: 'Fica comigo, Senhor, porque está anoitecendo e a noite se aproxima.', src: 'Oração após a Comunhão, inspirada em Lc 24,29', themes: ['Solidão', 'Confiança'] }
    ],
    help: '“Reza, espera e não te preocupes” pode ser um plano simples para o dia: reze um pouco, faça o que é possível e, quando a preocupação voltar, entregue-a de novo, sem brigar com ela.',
    prayer: 'São Padre Pio, que sofreste no corpo e na alma com paciência, alcança-me confiança nas horas de angústia. Rogai por nós.'
  },
  {
    id: 'teresinha', name: 'Santa Teresinha do Menino Jesus', dates: '1873–1897', title: 'Carmelita · Doutora da Igreja',
    colors: ['#a0526b', '#3a1624'], themes: ['Tristeza', 'Culpa', 'Confiança'],
    trial: 'Perdeu a mãe aos quatro anos e, criança, passou por uma doença com sintomas de grande sofrimento psíquico. Viveu escrúpulos e uma sensibilidade extrema. No último ano de vida, com tuberculose, atravessou uma escuridão interior em que a fé parecia não lhe dar consolo.',
    quotes: [
      { pt: 'Tudo é graça.', orig: 'Tout est grâce.', src: 'Últimos Colóquios, 5 de junho de 1897', themes: ['Confiança'] },
      { pt: 'Minha vida é só um instante, uma hora passageira… Para Te amar, meu Deus, só tenho o dia de hoje.', src: 'Poesia “Meu canto de hoje”', themes: ['Ansiedade'] },
      { pt: 'Para mim, a oração é um impulso do coração, um simples olhar lançado ao céu, um grito de gratidão e de amor, tanto no meio da provação como no meio da alegria.', src: 'Manuscrito C, 25r', themes: ['Oração', 'Tristeza'] }
    ],
    help: 'O “pequeno caminho” de Teresinha cabe num dia difícil: não tente resolver a vida inteira. Viva só o dia de hoje, com pequenos gestos de amor e confiança, como uma criança nos braços do Pai.',
    prayer: 'Santa Teresinha, que confiaste mesmo na escuridão, ensina-me o pequeno caminho do abandono. Rogai por nós.'
  },
  {
    id: 'faustina', name: 'Santa Faustina Kowalska', dates: '1905–1938', title: 'Apóstola da Divina Misericórdia',
    colors: ['#2f5aa0', '#0d1a36'], themes: ['Confiança', 'Culpa', 'Doença'],
    trial: 'De família pobre, estudou pouco e fazia trabalhos simples no convento. Sofreu com tuberculose e com a incompreensão de irmãs e superiores, que duvidavam de suas experiências. Viveu longos períodos de aridez e provações interiores.',
    quotes: [
      { pt: 'Jesus, eu confio em Vós.', la: 'Iesu, in te confido.', src: 'Inscrição pedida para a imagem da Misericórdia, Diário 47', themes: ['Confiança', 'Ansiedade'] },
      { pt: 'A humanidade não encontrará paz enquanto não se voltar com confiança à Minha misericórdia.', src: 'Palavras de Jesus registradas no Diário, 300', themes: ['Confiança'] }
    ],
    help: 'Use “Jesus, eu confio em Vós” como âncora: uma parte ao inspirar, outra ao expirar. Às 15h, a Hora da Misericórdia, pare um minuto e entregue a Jesus aquilo que mais pesa.',
    prayer: 'Santa Faustina, que confiaste na Misericórdia em meio às provações, ajuda-me a repetir de coração: Jesus, eu confio em Vós. Rogai por nós.'
  },
  {
    id: 'joao-cruz', name: 'São João da Cruz', dates: '1542–1591', title: 'Carmelita · Doutor da Igreja',
    colors: ['#3a3f6e', '#0e1026'], themes: ['Tristeza', 'Solidão', 'Confiança'],
    trial: 'Foi sequestrado e preso pelos próprios irmãos de hábito em Toledo, numa cela minúscula e escura, com pouca comida e castigos, por nove meses. Ali compôs alguns dos mais belos poemas da língua espanhola. Descreveu a “noite escura”: tempos em que Deus parece ausente.',
    quotes: [
      { pt: 'No entardecer da vida, seremos examinados no amor.', orig: 'A la tarde te examinarán en el amor.', src: 'Ditos de luz e amor, 59', themes: ['Confiança'] },
      { pt: 'Onde não há amor, põe amor e colherás amor.', orig: 'Donde no hay amor, ponga amor, y sacará amor.', src: 'Carta a Madre María de la Encarnación, 1591', themes: ['Solidão'] }
    ],
    help: 'A escuridão interior não significa que Deus foi embora. São João da Cruz ensinava a permanecer, com paciência, mesmo sem sentir nada. Se a “noite” se prolongar e vier com perda de sono, apetite e vontade de viver, procure também um profissional: a depressão tem tratamento.',
    prayer: 'São João da Cruz, que encontraste Deus na noite escura, sustenta-me quando eu não enxergar o caminho. Rogai por nós.'
  },
  {
    id: 'bento', name: 'São Bento de Núrsia', dates: '480–547', title: 'Pai do monaquismo ocidental · Padroeiro da Europa',
    colors: ['#2c2c2c', '#0a0a0a'], themes: ['Esperança', 'Paciência'],
    trial: 'Fugiu da corrupção de Roma e viveu anos sozinho numa gruta. Monges que ele guiava tentaram envenená-lo por não suportarem a disciplina. Recomeçou em outro lugar, com humildade, e escreveu uma Regra marcada pelo equilíbrio e pela misericórdia.',
    quotes: [
      { pt: 'E nunca desesperar da misericórdia de Deus.', la: 'Et de Dei misericordia numquam desperare.', src: 'Regra de São Bento, cap. 4', themes: ['Esperança', 'Culpa'] },
      { pt: 'Escuta, filho, os preceitos do mestre e inclina o ouvido do teu coração.', la: 'Ausculta, o fili, praecepta magistri, et inclina aurem cordis tui.', src: 'Regra de São Bento, Prólogo', themes: ['Oração'] }
    ],
    help: 'A tradição beneditina ensina o ritmo como remédio: horários regulares de oração, trabalho, refeição e descanso. Quando tudo está confuso, uma rotina simples ajuda o corpo e a alma a se acalmarem.',
    prayer: 'São Bento, que nunca desesperaste da misericórdia de Deus, dá-me constância e paz no dia a dia. Rogai por nós.'
  },
  {
    id: 'bernardo', name: 'São Bernardo de Claraval', dates: '1090–1153', title: 'Abade cisterciense · Doutor da Igreja',
    colors: ['#8a6a2a', '#2a1f0a'], themes: ['Medo', 'Tristeza', 'Esperança'],
    trial: 'Teve saúde frágil durante toda a vida, com problemas digestivos graves. Carregou pesadas responsabilidades e sofreu com o fracasso de uma cruzada que havia pregado, sendo duramente criticado por isso.',
    quotes: [
      { pt: 'Se se levantam os ventos das tentações, se tropeças nos escolhos das tribulações, olha a estrela, invoca Maria. […] Seguindo-a, não te desvias; rezando a ela, não desesperas.', la: 'Respice stellam, voca Mariam.', src: 'Homilias sobre o “Missus est”, II,17', themes: ['Medo', 'Esperança'] }
    ],
    help: 'Nos momentos de tempestade, reze uma Ave-Maria bem devagar, ou apenas repita o nome de Maria. Ela é a estrela que ajuda a encontrar o rumo quando tudo balança.',
    prayer: 'São Bernardo, cantor de Maria, ensina-me a olhar a estrela e invocar a Mãe nas tempestades. Rogai por nós.'
  },
  {
    id: 'francisco-assis', name: 'São Francisco de Assis', dates: '1181–1226', title: 'Fundador dos Frades Menores',
    colors: ['#6b5a3a', '#221a0e'], themes: ['Paz', 'Doença', 'Ansiedade'],
    trial: 'Rompeu com o pai e foi ridicularizado em Assis. Nos últimos anos, quase cego e muito doente, viu a Ordem que fundou tomar rumos que o entristeciam. Foi nesse tempo que compôs o Cântico das Criaturas.',
    quotes: [
      { pt: 'Onde há quietude e meditação, aí não há preocupação nem dissipação.', la: 'Ubi est quies et meditatio, ibi neque sollicitudo neque vagatio.', src: 'Admoestações, 27', themes: ['Ansiedade', 'Paz'] },
      { pt: 'Louvado sejas, meu Senhor, por aqueles que perdoam por Teu amor e suportam enfermidades e tribulações.', src: 'Cântico das Criaturas', themes: ['Doença', 'Paz'] }
    ],
    help: 'Faça uma pequena caminhada sem pressa e agradeça por aquilo que vê: o céu, uma árvore, a água. A gratidão pela criação acalma a mente e devolve o coração ao presente.',
    prayer: 'São Francisco, que louvaste a Deus mesmo doente e cego, ensina-me a gratidão e a paz. Rogai por nós.'
  },
  {
    id: 'inacio', name: 'Santo Inácio de Loyola', dates: '1491–1556', title: 'Fundador da Companhia de Jesus',
    colors: ['#3a2a5a', '#120c1e'], themes: ['Culpa', 'Discernimento', 'Confiança'],
    trial: 'Ferido gravemente em batalha, passou meses de dor e convalescença. Depois da conversão, em Manresa, viveu escrúpulos tão fortes que chegou a pensar em tirar a própria vida. Com a ajuda de Deus e de um confessor, superou essa crise e aprendeu a discernir os movimentos do coração.',
    quotes: [
      { pt: 'Em tempo de desolação nunca fazer mudança, mas estar firme e constante nos propósitos e na determinação em que se estava antes.', src: 'Exercícios Espirituais, 318', themes: ['Discernimento', 'Tristeza'] },
      { pt: 'Tomai, Senhor, e recebei toda a minha liberdade, a minha memória, o meu entendimento e toda a minha vontade. […] Dai-me o vosso amor e a vossa graça, que isso me basta.', src: 'Exercícios Espirituais, 234 (Suscipe)', themes: ['Confiança'] }
    ],
    help: 'Regra de ouro de Inácio para dias escuros: não tome grandes decisões na desolação. Espere a calma voltar, converse com alguém de confiança e só então decida.',
    prayer: 'Santo Inácio, que venceste os escrúpulos e a desolação, ensina-me a discernir e a esperar a luz. Rogai por nós.'
  },
  {
    id: 'bakhita', name: 'Santa Josefina Bakhita', dates: '1869–1947', title: 'Religiosa canossiana · Padroeira do Sudão',
    colors: ['#7a4a2a', '#24140a'], themes: ['Trauma', 'Esperança', 'Perdão'],
    trial: 'Sequestrada ainda criança no Sudão, foi escravizada, vendida várias vezes e brutalmente maltratada; o trauma foi tanto que esqueceu o próprio nome. Na Itália, conquistou a liberdade, conheceu a fé e tornou-se religiosa, lembrada pela doçura e pelo perdão.',
    quotes: [
      { pt: 'Eu sou definitivamente amada e, aconteça o que acontecer, sou esperada por este Amor.', src: 'A esperança de Bakhita, nas palavras de Bento XVI, Spe salvi, 3', themes: ['Esperança', 'Trauma'] }
    ],
    help: 'Feridas profundas precisam de tempo, acolhimento e, muitas vezes, de ajuda especializada. A história de Bakhita lembra que o que sofremos não define quem somos: somos, antes de tudo, amados.',
    prayer: 'Santa Josefina Bakhita, que encontraste a liberdade no amor de Deus, cura as feridas de quem foi violentado e humilhado. Rogai por nós.'
  },
  {
    id: 'joao-paulo', name: 'São João Paulo II', dates: '1920–2005', title: 'Papa',
    colors: ['#b8892b', '#3a2a0a'], themes: ['Medo', 'Luto', 'Doença', 'Perdão'],
    trial: 'Aos 20 anos já havia perdido a mãe, o irmão e o pai. Viveu a ocupação nazista e o regime comunista. Como papa, foi baleado em 1981 e depois visitou e perdoou o agressor. Nos últimos anos, com Parkinson, mostrou ao mundo como viver a doença com dignidade.',
    quotes: [
      { pt: 'Não tenhais medo! Abri, ou melhor, escancarai as portas a Cristo!', src: 'Homilia de início do pontificado, 22 de outubro de 1978', themes: ['Medo'] }
    ],
    help: 'O medo diminui quando é partilhado. Diga em voz alta a Cristo aquilo que você teme e conte também a alguém de confiança. Luto e perdas precisam ser chorados: não há pressa.',
    prayer: 'São João Paulo II, que atravessaste perdas, violência e doença sem perder a esperança, ajuda-me a abrir as portas a Cristo. Rogai por nós.'
  },
  {
    id: 'dulce', name: 'Santa Dulce dos Pobres', dates: '1914–1992', title: 'Religiosa baiana · Primeira santa nascida no Brasil',
    colors: ['#2a6aa0', '#0a1f33'], themes: ['Doença', 'Caridade', 'Esperança'],
    trial: 'Viveu grande parte da vida com a capacidade respiratória muito reduzida e passou os últimos meses internada. Enfrentou falta de recursos, incompreensões e cansaço extremo para cuidar de doentes e pobres em Salvador, começando num antigo galinheiro.',
    quotes: [
      { pt: 'O importante é fazer a caridade, não falar de caridade.', src: 'Tradição oral', attr: true, themes: ['Caridade'] }
    ],
    help: 'Quando a tristeza fecha o coração, um pequeno gesto de cuidado com alguém pode abrir uma janela. Não precisa ser grande: uma visita, uma mensagem, um prato de comida.',
    prayer: 'Santa Dulce dos Pobres, anjo bom da Bahia, que serviste mesmo doente, intercede pelos enfermos e por quem cuida deles. Rogai por nós.'
  },
  {
    id: 'carlo', name: 'São Carlo Acutis', dates: '1991–2006', title: 'Jovem padroeiro da internet',
    colors: ['#3a6a9a', '#0e1e30'], themes: ['Jovens', 'Tristeza', 'Doença'],
    trial: 'Adolescente comum, gostava de videogames e de computadores. Aos 15 anos recebeu o diagnóstico de leucemia fulminante e morreu em poucos dias, oferecendo o sofrimento pela Igreja e pelo Papa.',
    quotes: [
      { pt: 'A Eucaristia é a minha autoestrada para o Céu.', src: 'Frase registrada por sua família', themes: ['Oração'] },
      { pt: 'A tristeza é o olhar voltado para si mesmo; a felicidade é o olhar voltado para Deus.', src: 'Frase registrada por sua família', themes: ['Tristeza'] }
    ],
    help: 'Carlo ensinava a usar a tecnologia para o bem. Que tal um pequeno “jejum digital” hoje: meia hora sem redes sociais, trocada por um momento de oração ou uma conversa com alguém?',
    prayer: 'São Carlo Acutis, amigo dos jovens, ajuda-me a olhar para Deus quando a tristeza me fechar em mim mesmo. Rogai por nós.'
  },
  {
    id: 'foucauld', name: 'São Carlos de Foucauld', dates: '1858–1916', title: 'Eremita no deserto do Saara',
    colors: ['#a0703a', '#2e1c0a'], themes: ['Solidão', 'Confiança'],
    trial: 'Perdeu os pais aos seis anos, afastou-se da fé e viveu uma juventude desregrada. Depois da conversão, passou anos sozinho no deserto, sem conseguir nenhum seguidor, e morreu assassinado. Sua vida pareceu um fracasso; hoje inspira milhares.',
    quotes: [
      { pt: 'Meu Pai, a Vós me abandono: fazei de mim o que Vos aprouver. O que quer que façais de mim, eu Vos agradeço. Estou pronto para tudo, aceito tudo.', src: 'Oração do Abandono', themes: ['Confiança', 'Ansiedade'] }
    ],
    help: 'Quando parecer que nada dá certo, lembre-se de que os frutos nem sempre aparecem no nosso tempo. Reze a Oração do Abandono devagar, parando nas palavras que mais tocarem.',
    prayer: 'São Carlos de Foucauld, irmão universal, ensina-me o abandono confiante nas mãos do Pai. Rogai por nós.'
  }
];
