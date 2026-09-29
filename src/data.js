// Conteúdo do app. Orações tradicionais (domínio público) em português e latim;
// textos de reflexão e orações marcadas como "originais" foram escritos para este projeto.
window.DATA = {
  categories: ['Clássicas', 'Ansiedade', 'Noite', 'Paz', 'Consolo', 'Jaculatórias'],

  prayers: [
    { id: 'sinal-cruz', cat: 'Clássicas', title: 'Sinal da Cruz', latin: 'Signum Crucis',
      pt: 'Em nome do Pai, e do Filho, e do Espírito Santo. Amém.',
      la: 'In nómine Patris, et Fílii, et Spíritus Sancti. Amen.' },
    { id: 'pai-nosso', cat: 'Clássicas', title: 'Pai Nosso', latin: 'Pater Noster',
      pt: 'Pai nosso, que estais nos céus,\nsantificado seja o vosso nome;\nvenha a nós o vosso reino;\nseja feita a vossa vontade,\nassim na terra como no céu.\nO pão nosso de cada dia nos dai hoje;\nperdoai-nos as nossas ofensas,\nassim como nós perdoamos a quem nos tem ofendido;\ne não nos deixeis cair em tentação,\nmas livrai-nos do mal. Amém.',
      la: 'Pater noster, qui es in caelis,\nsanctificetur nomen tuum;\nadveniat regnum tuum;\nfiat voluntas tua,\nsicut in caelo et in terra.\nPanem nostrum quotidianum da nobis hodie;\net dimitte nobis debita nostra,\nsicut et nos dimittimus debitoribus nostris;\net ne nos inducas in tentationem;\nsed libera nos a malo. Amen.' },
    { id: 'ave-maria', cat: 'Clássicas', title: 'Ave Maria', latin: 'Ave Maria',
      pt: 'Ave, Maria, cheia de graça,\no Senhor é convosco;\nbendita sois vós entre as mulheres\ne bendito é o fruto do vosso ventre, Jesus.\nSanta Maria, Mãe de Deus,\nrogai por nós, pecadores,\nagora e na hora da nossa morte. Amém.',
      la: 'Ave, Maria, gratia plena,\nDominus tecum;\nbenedicta tu in mulieribus,\net benedictus fructus ventris tui, Iesus.\nSancta Maria, Mater Dei,\nora pro nobis peccatoribus,\nnunc et in hora mortis nostrae. Amen.' },
    { id: 'gloria', cat: 'Clássicas', title: 'Glória ao Pai', latin: 'Gloria Patri',
      pt: 'Glória ao Pai, ao Filho e ao Espírito Santo.\nComo era no princípio, agora e sempre,\npor todos os séculos dos séculos. Amém.',
      la: 'Gloria Patri, et Filio, et Spiritui Sancto.\nSicut erat in principio, et nunc, et semper,\net in saecula saeculorum. Amen.' },
    { id: 'credo', cat: 'Clássicas', title: 'Creio (Símbolo dos Apóstolos)', latin: 'Credo',
      pt: 'Creio em Deus Pai todo-poderoso, criador do céu e da terra;\ne em Jesus Cristo, seu único Filho, nosso Senhor,\nque foi concebido pelo poder do Espírito Santo,\nnasceu da Virgem Maria,\npadeceu sob Pôncio Pilatos,\nfoi crucificado, morto e sepultado;\ndesceu à mansão dos mortos,\nressuscitou ao terceiro dia,\nsubiu aos céus,\nestá sentado à direita de Deus Pai todo-poderoso,\ndonde há de vir a julgar os vivos e os mortos.\nCreio no Espírito Santo,\nna santa Igreja católica,\nna comunhão dos santos,\nna remissão dos pecados,\nna ressurreição da carne,\nna vida eterna. Amém.',
      la: 'Credo in Deum, Patrem omnipotentem,\nCreatorem caeli et terrae,\net in Iesum Christum, Filium eius unicum, Dominum nostrum,\nqui conceptus est de Spiritu Sancto,\nnatus ex Maria Virgine,\npassus sub Pontio Pilato,\ncrucifixus, mortuus, et sepultus,\ndescendit ad inferos,\ntertia die resurrexit a mortuis,\nascendit ad caelos,\nsedet ad dexteram Dei Patris omnipotentis,\ninde venturus est iudicare vivos et mortuos.\nCredo in Spiritum Sanctum,\nsanctam Ecclesiam catholicam,\nsanctorum communionem,\nremissionem peccatorum,\ncarnis resurrectionem,\nvitam aeternam. Amen.' },
    { id: 'fatima', cat: 'Clássicas', title: 'Oração de Fátima', latin: 'Oratio Fatimensis',
      pt: 'Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno,\nlevai as almas todas para o céu\ne socorrei principalmente as que mais precisarem.',
      la: 'O mi Iesu, dimitte nobis debita nostra,\nsalva nos ab igne inferni,\nconduc in caelum omnes animas,\npraesertim eas quae misericordiae tuae maxime indigent.' },
    { id: 'salve-rainha', cat: 'Consolo', title: 'Salve Rainha', latin: 'Salve Regina',
      pt: 'Salve, Rainha, Mãe de misericórdia,\nvida, doçura e esperança nossa, salve!\nA vós bradamos, os degredados filhos de Eva;\na vós suspiramos, gemendo e chorando neste vale de lágrimas.\nEia, pois, advogada nossa,\nesses vossos olhos misericordiosos a nós volvei;\ne depois deste desterro mostrai-nos Jesus,\nbendito fruto do vosso ventre,\nó clemente, ó piedosa, ó doce sempre Virgem Maria.',
      la: 'Salve, Regina, mater misericordiae,\nvita, dulcedo et spes nostra, salve.\nAd te clamamus, exsules filii Hevae.\nAd te suspiramus, gementes et flentes\nin hac lacrimarum valle.\nEia ergo, advocata nostra,\nillos tuos misericordes oculos ad nos converte.\nEt Iesum, benedictum fructum ventris tui,\nnobis post hoc exsilium ostende.\nO clemens, o pia, o dulcis Virgo Maria.' },
    { id: 'memorare', cat: 'Consolo', title: 'Lembrai-vos', latin: 'Memorare',
      pt: 'Lembrai-vos, ó piíssima Virgem Maria,\nque nunca se ouviu dizer que algum daqueles que tenham recorrido à vossa proteção,\nimplorado a vossa assistência e reclamado o vosso socorro,\nfosse por vós desamparado.\nAnimado eu, pois, com igual confiança,\na vós, Virgem entre todas singular, como a Mãe recorro;\nde vós me valho e, gemendo sob o peso dos meus pecados,\nme prostro aos vossos pés.\nNão rejeiteis as minhas súplicas, ó Mãe do Filho de Deus humanado,\nmas dignai-vos de as ouvir propícia e de me alcançar o que vos rogo. Amém.',
      la: 'Memorare, o piissima Virgo Maria,\nnon esse auditum a saeculo,\nquemquam ad tua currentem praesidia,\ntua implorantem auxilia,\ntua petentem suffragia, esse derelictum.\nEgo tali animatus confidentia,\nad te, Virgo virginum, Mater, curro,\nad te venio, coram te gemens peccator assisto.\nNoli, Mater Verbi, verba mea despicere;\nsed audi propitia et exaudi. Amen.' },
    { id: 'sub-tuum', cat: 'Consolo', title: 'Sob a vossa proteção', latin: 'Sub tuum praesidium',
      pt: 'Sob a vossa proteção nos refugiamos, Santa Mãe de Deus;\nnão desprezeis as nossas súplicas em nossas necessidades,\nmas livrai-nos sempre de todos os perigos,\nó Virgem gloriosa e bendita.',
      la: 'Sub tuum praesidium confugimus,\nSancta Dei Genetrix;\nnostras deprecationes ne despicias in necessitatibus,\nsed a periculis cunctis libera nos semper,\nVirgo gloriosa et benedicta.' },
    { id: 'de-profundis', cat: 'Ansiedade', title: 'Das profundezas (Salmo 130)', latin: 'De profundis',
      pt: 'Das profundezas clamo a Ti, Senhor;\nSenhor, ouve a minha voz.\nEstejam os Teus ouvidos atentos\nà voz da minha súplica.',
      la: 'De profundis clamavi ad te, Domine;\nDomine, exaudi vocem meam.\nFiant aures tuae intendentes\nin vocem deprecationis meae.' },
    { id: 'anjo', cat: 'Noite', title: 'Anjo da Guarda', latin: 'Angele Dei',
      pt: 'Santo Anjo do Senhor,\nmeu zeloso guardador,\nse a ti me confiou a piedade divina,\nsempre me rege, guarda, governa e ilumina. Amém.',
      la: 'Angele Dei, qui custos es mei,\nme tibi commissum pietate superna,\nillumina, custodi, rege et guberna. Amen.' },
    { id: 'completas', cat: 'Noite', title: 'Responsório das Completas', latin: 'In manus tuas',
      pt: 'Em vossas mãos, Senhor, entrego o meu espírito.\nVós nos remistes, Senhor, Deus da verdade.',
      la: 'In manus tuas, Domine, commendo spiritum meum.\nRedemisti nos, Domine, Deus veritatis.' },
    { id: 'antifona-completas', cat: 'Noite', title: 'Salvai-nos, Senhor, velando', latin: 'Salva nos, Domine',
      pt: 'Salvai-nos, Senhor, enquanto velamos;\nguardai-nos enquanto dormimos,\npara que vigiemos com Cristo\ne descansemos em paz.',
      la: 'Salva nos, Domine, vigilantes;\ncustodi nos dormientes,\nut vigilemus cum Christo\net requiescamus in pace.' },
    { id: 'anima-christi', cat: 'Paz', title: 'Alma de Cristo', latin: 'Anima Christi',
      pt: 'Alma de Cristo, santificai-me.\nCorpo de Cristo, salvai-me.\nSangue de Cristo, inebriai-me.\nÁgua do lado de Cristo, lavai-me.\nPaixão de Cristo, confortai-me.\nÓ bom Jesus, ouvi-me.\nDentro de Vossas chagas, escondei-me.\nNão permitais que eu me separe de Vós.\nDo espírito maligno, defendei-me.\nNa hora da minha morte, chamai-me,\ne mandai-me ir para Vós,\npara que com os Vossos santos Vos louve\npor todos os séculos. Amém.',
      la: 'Anima Christi, sanctifica me.\nCorpus Christi, salva me.\nSanguis Christi, inebria me.\nAqua lateris Christi, lava me.\nPassio Christi, conforta me.\nO bone Iesu, exaudi me.\nIntra tua vulnera absconde me.\nNe permittas me separari a te.\nAb hoste maligno defende me.\nIn hora mortis meae voca me,\net iube me venire ad te,\nut cum Sanctis tuis laudem te\nin saecula saeculorum. Amen.' },
    { id: 'veni-sancte', cat: 'Paz', title: 'Vinde, Espírito Santo', latin: 'Veni, Sancte Spiritus',
      pt: 'Vinde, Espírito Santo,\nenchei os corações dos vossos fiéis\ne acendei neles o fogo do vosso amor.',
      la: 'Veni, Sancte Spiritus,\nreple tuorum corda fidelium,\net tui amoris in eis ignem accende.' },
    { id: 'serenidade', cat: 'Ansiedade', title: 'Oração da Serenidade', latin: null,
      pt: 'Senhor, concedei-me a serenidade\npara aceitar as coisas que não posso mudar,\ncoragem para mudar as que posso\ne sabedoria para distinguir umas das outras. Amém.' },
    { id: 'sao-francisco', cat: 'Paz', title: 'Oração de São Francisco', latin: null,
      pt: 'Senhor, fazei de mim um instrumento de vossa paz.\nOnde houver ódio, que eu leve o amor;\nonde houver ofensa, que eu leve o perdão;\nonde houver discórdia, que eu leve a união;\nonde houver dúvidas, que eu leve a fé;\nonde houver erro, que eu leve a verdade;\nonde houver desespero, que eu leve a esperança;\nonde houver tristeza, que eu leve a alegria;\nonde houver trevas, que eu leve a luz.\nÓ Mestre, que eu procure mais consolar que ser consolado;\ncompreender que ser compreendido;\namar que ser amado.\nPois é dando que se recebe,\nperdoando que se é perdoado\ne morrendo que se vive para a vida eterna. Amém.' },
    // Orações originais para o momento de aflição
    { id: 'panico', cat: 'Ansiedade', title: 'Para a hora do pânico', latin: null,
      pt: 'Jesus, meu coração dispara e a mente corre.\nEu paro. Sinto o chão sob meus pés.\nTu estás aqui, mais perto do que meu medo.\nEu respiro devagar: em Ti, eu confio.\nEste momento vai passar, e Tu ficas. Amém.' },
    { id: 'ansiedade', cat: 'Ansiedade', title: 'Entrega da ansiedade', latin: null,
      pt: 'Jesus, Tu conheces o peso que carrego.\nEu respiro e me lembro de que não estou só.\nEntrego-Te o medo do amanhã e a culpa do ontem;\nensina-me a viver este momento com confiança.\nJesus, eu confio em Vós. Amém.' },
    { id: 'manha', cat: 'Ansiedade', title: 'Entrega do dia', latin: null,
      pt: 'Senhor, o dia começa e não sei o que ele traz.\nDá-me o necessário para hoje: fôlego, paciência, um passo de cada vez.\nO que não depende de mim, deixo contigo.\nQue eu encontre pequenas alegrias\ne tenha a humildade de pedir ajuda quando precisar. Amém.' },
    { id: 'noite', cat: 'Noite', title: 'Antes de dormir', latin: null,
      pt: 'Senhor, o dia terminou.\nEntrego em Tuas mãos o que fiz e o que deixei de fazer,\nas preocupações que ainda carrego\ne tudo o que não posso resolver esta noite.\nDá descanso ao meu corpo, quietude à minha mente\ne paz ao meu coração.\nQue teus anjos velem o meu sono. Amém.' },
    { id: 'tristeza', cat: 'Consolo', title: 'Na tristeza', latin: null,
      pt: 'Deus de toda consolação,\nhoje meu coração está pesado e nem sei explicar por quê.\nNão me peças que finja: eu Te mostro como estou.\nSegura-me quando eu não tiver forças,\nenvia-me alguém que me escute\ne guarda em mim uma pequena luz de esperança. Amém.' },
    { id: 'culpa', cat: 'Consolo', title: 'Quando a culpa pesa demais', latin: null,
      pt: 'Senhor misericordioso,\nTu és maior que o meu coração e conheces tudo.\nSe errei, dá-me a graça do arrependimento sereno, não da angústia que paralisa.\nQuero acolher o Teu perdão e perdoar a mim mesmo.\nJesus, eu confio em Vós. Amém.' },
    { id: 'cuidadores', cat: 'Consolo', title: 'Por quem sofre comigo', latin: null,
      pt: 'Senhor, abençoa quem sofre de ansiedade, depressão e solidão,\ne quem cuida dessas pessoas.\nDá paciência às famílias, sabedoria aos profissionais de saúde\ne a todos a certeza de que ninguém caminha sozinho. Amém.' },
    // Jaculatórias
    { id: 'jac-confio', cat: 'Jaculatórias', title: 'Jesus, eu confio em Vós', latin: 'Iesu, in te confido',
      pt: 'Jesus, eu confio em Vós.', la: 'Iesu, in te confido.' },
    { id: 'jac-piedade', cat: 'Jaculatórias', title: 'Senhor, tende piedade', latin: 'Domine, miserere',
      pt: 'Senhor, tende piedade de mim.', la: 'Domine, miserere mei.' },
    { id: 'jac-paz', cat: 'Jaculatórias', title: 'Dai-nos a paz', latin: 'Dona nobis pacem',
      pt: 'Senhor, dai-nos a paz.', la: 'Domine, dona nobis pacem.' },
    { id: 'jac-tudo', cat: 'Jaculatórias', title: 'Meu Deus e meu tudo', latin: 'Deus meus et omnia',
      pt: 'Meu Deus e meu tudo.', la: 'Deus meus et omnia.' },
    { id: 'jac-espirito', cat: 'Jaculatórias', title: 'Vinde, Espírito Santo', latin: 'Veni, Sancte Spiritus',
      pt: 'Vinde, Espírito Santo.', la: 'Veni, Sancte Spiritus.' }
  ],

  mysteries: {
    gozosos: { name: 'Mistérios Gozosos', days: [1, 6], items: ['A Anunciação do Anjo a Maria', 'A Visitação de Maria a Santa Isabel', 'O Nascimento de Jesus em Belém', 'A Apresentação de Jesus no Templo', 'A Perda e o Encontro de Jesus no Templo'] },
    luminosos: { name: 'Mistérios Luminosos', days: [4], items: ['O Batismo de Jesus no Jordão', 'As Bodas de Caná', 'O Anúncio do Reino de Deus', 'A Transfiguração do Senhor', 'A Instituição da Eucaristia'] },
    dolorosos: { name: 'Mistérios Dolorosos', days: [2, 5], items: ['A Agonia de Jesus no Horto', 'A Flagelação do Senhor', 'A Coroação de Espinhos', 'Jesus carrega a Cruz a caminho do Calvário', 'A Crucifixão e Morte de Jesus'] },
    gloriosos: { name: 'Mistérios Gloriosos', days: [0, 3], items: ['A Ressurreição de Jesus', 'A Ascensão do Senhor ao Céu', 'A Vinda do Espírito Santo', 'A Assunção de Maria', 'A Coroação de Maria no Céu'] }
  },

  moods: [
    { id: 'bem', label: 'Bem', glyph: '☀', prayer: 'gloria', tip: 'Agradeça pelo que está bom hoje: a gratidão fortalece a alma e prepara para os dias difíceis.' },
    { id: 'calmo', label: 'Calmo', glyph: '☾', prayer: 'pai-nosso', tip: 'Aproveite a calma para uma oração sem pressa, ou para uma Lectio Divina.' },
    { id: 'ansioso', label: 'Ansioso', glyph: '≋', prayer: 'panico', tip: 'Comece pela respiração com oração; depois, se puder, o exercício 5-4-3-2-1.', act: ['respirar', 'aterramento'] },
    { id: 'triste', label: 'Triste', glyph: '☂', prayer: 'tristeza', tip: 'Acolha o que sente. Conversar com alguém de confiança ajuda mais do que guardar tudo.', act: ['diario'] },
    { id: 'cansado', label: 'Cansado', glyph: '☁', prayer: 'noite', tip: 'Descanso também é cuidado. Diminua o ritmo e experimente alguns minutos de silêncio.', act: ['silencio'] },
    { id: 'irritado', label: 'Irritado', glyph: '⚡', prayer: 'sao-francisco', tip: 'Respire fundo antes de responder. A paz começa em você.', act: ['respirar'] }
  ],

  reflections: [
    { verse: 'Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos darei descanso.', ref: 'Mt 11,28', text: 'Cansaço não é fraqueza nem falta de fé. Hoje, permita-se descansar sem culpa e entregar um peso a Deus.' },
    { verse: 'Não vos inquieteis com nada; em toda oração, apresentai a Deus os vossos pedidos.', ref: 'Fl 4,6', text: 'Escolha uma preocupação e transforme-a em uma frase de oração. Depois faça apenas o próximo passo possível.' },
    { verse: 'O Senhor é o meu pastor; nada me faltará.', ref: 'Sl 23,1', text: 'Nomeie três coisas que hoje sustentam você: pessoas, hábitos, pequenas graças.' },
    { verse: 'Entregai-lhe todas as vossas preocupações, porque ele cuida de vós.', ref: '1Pd 5,7', text: 'Pedir ajuda também é um ato de fé. Quem você pode procurar hoje para conversar?' },
    { verse: 'Eu estou convosco todos os dias, até o fim dos tempos.', ref: 'Mt 28,20', text: 'Nos dias de solidão, lembre-se: a presença de Deus e a presença de pessoas se complementam.' },
    { verse: 'Não temas, porque estou contigo; não te assustes, porque sou o teu Deus.', ref: 'Is 41,10', text: 'O medo pode estar presente sem que você precise obedecê-lo. Dê um pequeno passo com ele ao lado.' },
    { verse: 'Deixo-vos a paz, dou-vos a minha paz. Não se perturbe o vosso coração.', ref: 'Jo 14,27', text: 'A paz de Cristo não é ausência de problemas, mas uma presença dentro deles.' }
  ],

  lectio: [
    { ref: 'Mt 11,28', pt: 'Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos darei descanso.', la: 'Venite ad me, omnes qui laboratis et onerati estis, et ego reficiam vos.' },
    { ref: 'Fl 4,6-7', pt: 'Não vos inquieteis com nada; mas, em toda oração e súplica, com ação de graças, apresentai a Deus os vossos pedidos.', la: 'Nihil solliciti sitis: sed in omni oratione et obsecratione, cum gratiarum actione, petitiones vestrae innotescant apud Deum.' },
    { ref: 'Jo 14,27', pt: 'Deixo-vos a paz, dou-vos a minha paz. Não vo-la dou como o mundo a dá. Não se perturbe o vosso coração, nem se acovarde.', la: 'Pacem relinquo vobis, pacem meam do vobis: non quomodo mundus dat, ego do vobis. Non turbetur cor vestrum, neque formidet.' },
    { ref: 'Is 41,10', pt: 'Não temas, porque estou contigo; não te assustes, porque sou o teu Deus. Eu te fortaleço e te ajudo.', la: 'Ne timeas, quia ego tecum sum; ne declines, quia ego Deus tuus; confortavi te, et auxiliatus sum tibi.' },
    { ref: 'Sl 23,1.4', pt: 'O Senhor é o meu pastor; nada me faltará. Ainda que eu passe pelo vale escuro, nada temerei, porque estais comigo.', la: 'Dominus pascit me, et nihil mihi deerit. Nam et si ambulavero in medio umbrae mortis, non timebo mala, quoniam tu mecum es.' }
  ],

  silence: { pt: 'Ficai quietos e sabei que eu sou Deus.', la: 'Vacate, et videte quoniam ego sum Deus.', ref: 'Sl 46,11' },

  grounding: [
    { n: 5, sense: 'ver', ask: 'Olhe ao redor e nomeie 5 coisas que você pode ver.', pray: 'Senhor, agradeço pelo que meus olhos alcançam.' },
    { n: 4, sense: 'tocar', ask: 'Perceba 4 coisas que você pode tocar: a roupa, a cadeira, o chão sob os pés.', pray: 'Senhor, estou aqui, no meu corpo, e Tu estás aqui comigo.' },
    { n: 3, sense: 'ouvir', ask: 'Escute 3 sons, próximos ou distantes.', pray: 'Senhor, que eu ouça a Tua voz também no silêncio.' },
    { n: 2, sense: 'cheirar', ask: 'Perceba 2 cheiros (ou lembre de 2 cheiros de que você gosta).', pray: 'Senhor, obrigado pelas pequenas coisas que me alegram.' },
    { n: 1, sense: 'saborear', ask: 'Nomeie 1 coisa de que você é grato hoje, ou 1 sabor que você sente.', pray: 'Senhor, o que me deste hoje é suficiente. Eu confio em Ti.' }
  ],

  examen: [
    { t: 'Presença', ask: 'Sente-se, respire devagar três vezes e coloque-se na presença de Deus. Peça luz para olhar o dia sem se julgar com dureza.' },
    { t: 'Gratidão', ask: 'Do que você é grato hoje? Lembre de três momentos, pessoas ou pequenas graças, ainda que o dia tenha sido difícil.' },
    { t: 'Revisão', ask: 'Percorra o dia do começo ao fim. Onde você sentiu paz, alegria, força? Onde sentiu angústia, cansaço, tristeza? Apenas observe, sem se acusar.' },
    { t: 'Perdão', ask: 'Peça perdão pelo que ficou aquém e perdoe a quem lhe feriu. Lembre-se: Deus é maior que o seu coração. Diga: "Jesus, eu confio em Vós".' },
    { t: 'Amanhã', ask: 'Olhe para o dia seguinte com confiança. Qual é um único passo simples que você quer dar? Entregue o restante ao Senhor.' }
  ],

  breathPhrases: [
    { id: 'jesus', label: 'Jesus, eu confio em Vós', pt: ['Jesus,', 'eu confio em Vós'], la: ['Iesu,', 'in te confido'] },
    { id: 'paz', label: 'Senhor, dai-nos a paz', pt: ['Senhor,', 'dai-nos a paz'], la: ['Domine,', 'dona nobis pacem'] },
    { id: 'kyrie', label: 'Kýrie, eléison', pt: ['Kýrie,', 'eléison'], la: ['Kýrie,', 'eléison'] }
  ],

  help: [
    { name: 'CVV — Centro de Valorização da Vida', desc: 'Apoio emocional e prevenção do suicídio, 24 horas, gratuito e sigiloso. Também por chat e e-mail no site.', tel: '188', link: 'https://www.cvv.org.br' },
    { name: 'SAMU', desc: 'Emergência médica e psiquiátrica.', tel: '192' },
    { name: 'Bombeiros', desc: 'Risco imediato à vida.', tel: '193' },
    { name: 'CAPS e UBS', desc: 'Os Centros de Atenção Psicossocial e as Unidades Básicas de Saúde do SUS oferecem acompanhamento gratuito. Procure a unidade mais próxima da sua casa.' }
  ]
};
