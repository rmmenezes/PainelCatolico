// Conteúdo do app. Orações tradicionais (domínio público) e reflexões originais.
window.DATA = {
  prayers: [
    { id: 'pai-nosso', title: 'Pai Nosso', tag: 'Tradicional',
      text: 'Pai nosso, que estais nos céus,\nsantificado seja o vosso nome;\nvenha a nós o vosso reino;\nseja feita a vossa vontade,\nassim na terra como no céu.\nO pão nosso de cada dia nos dai hoje;\nperdoai-nos as nossas ofensas,\nassim como nós perdoamos a quem nos tem ofendido;\ne não nos deixeis cair em tentação,\nmas livrai-nos do mal. Amém.' },
    { id: 'ave-maria', title: 'Ave Maria', tag: 'Tradicional',
      text: 'Ave, Maria, cheia de graça,\no Senhor é convosco;\nbendita sois vós entre as mulheres\ne bendito é o fruto do vosso ventre, Jesus.\nSanta Maria, Mãe de Deus,\nrogai por nós, pecadores,\nagora e na hora da nossa morte. Amém.' },
    { id: 'gloria', title: 'Glória ao Pai', tag: 'Tradicional',
      text: 'Glória ao Pai, ao Filho e ao Espírito Santo.\nComo era no princípio, agora e sempre,\npor todos os séculos dos séculos. Amém.' },
    { id: 'serenidade', title: 'Oração da Serenidade', tag: 'Ansiedade',
      text: 'Senhor, concedei-me a serenidade\npara aceitar as coisas que não posso mudar,\ncoragem para mudar as que posso\ne sabedoria para distinguir umas das outras. Amém.' },
    { id: 'sao-francisco', title: 'Oração de São Francisco', tag: 'Paz',
      text: 'Senhor, fazei de mim um instrumento de vossa paz.\nOnde houver ódio, que eu leve o amor;\nonde houver ofensa, que eu leve o perdão;\nonde houver discórdia, que eu leve a união;\nonde houver dúvidas, que eu leve a fé;\nonde houver erro, que eu leve a verdade;\nonde houver desespero, que eu leve a esperança;\nonde houver tristeza, que eu leve a alegria;\nonde houver trevas, que eu leve a luz.\nÓ Mestre, que eu procure mais consolar que ser consolado;\ncompreender que ser compreendido;\namar que ser amado.\nPois é dando que se recebe,\nperdoando que se é perdoado\ne morrendo que se vive para a vida eterna. Amém.' },
    { id: 'anjo', title: 'Anjo da Guarda', tag: 'Proteção',
      text: 'Santo Anjo do Senhor,\nmeu zeloso guardador,\nse a ti me confiou a piedade divina,\nsempre me rege, guarda, governa e ilumina. Amém.' },
    { id: 'salve-rainha', title: 'Salve Rainha', tag: 'Consolo',
      text: 'Salve, Rainha, Mãe de misericórdia,\nvida, doçura e esperança nossa, salve!\nA vós bradamos, os degredados filhos de Eva;\na vós suspiramos, gemendo e chorando neste vale de lágrimas.\nEia, pois, advogada nossa,\nesses vossos olhos misericordiosos a nós volvei;\ne depois deste desterro mostrai-nos Jesus,\nbendito fruto do vosso ventre,\nó clemente, ó piedosa, ó doce sempre Virgem Maria.' },
    { id: 'noite', title: 'Oração antes de dormir', tag: 'Insônia',
      text: 'Senhor, o dia terminou.\nEntrego em Tuas mãos o que fiz e o que deixei de fazer,\nas preocupações que ainda carrego\ne tudo o que não posso resolver esta noite.\nDá descanso ao meu corpo, quietude à minha mente\ne paz ao meu coração.\nQue teus anjos velem o meu sono. Amém.' },
    { id: 'ansiedade', title: 'Entrega da ansiedade', tag: 'Ansiedade',
      text: 'Jesus, Tu conheces o peso que carrego.\nEu respiro e me lembro de que não estou só.\nEntrego-Te o medo do amanhã e a culpa do ontem;\nensina-me a viver este momento com confiança.\nJesus, eu confio em Vós. Amém.' }
  ],
  reflections: [
    { verse: '"Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei." (Mt 11,28)', text: 'Cansaço não é fraqueza nem falta de fé. Hoje, permita-se descansar sem culpa e entregar um peso a Deus.' },
    { verse: '"Não andeis ansiosos por coisa alguma." (Fl 4,6)', text: 'Escolha uma preocupação e transforme-a em uma frase de oração. Depois faça apenas o próximo passo possível.' },
    { verse: '"O Senhor é o meu pastor; nada me faltará." (Sl 23,1)', text: 'Nomeie três coisas que hoje sustentam você: pessoas, hábitos, pequenas graças.' },
    { verse: '"Lançai sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós." (1Pd 5,7)', text: 'Pedir ajuda também é um ato de fé. Quem você pode procurar hoje para conversar?' },
    { verse: '"Estou convosco todos os dias." (Mt 28,20)', text: 'Nos dias de solidão, lembre-se: presença de Deus e presença de pessoas se complementam.' },
    { verse: '"Tudo posso naquele que me fortalece." (Fl 4,13)', text: 'Força não é fazer tudo sozinho. Hoje, faça só o essencial e acolha o seu limite.' },
    { verse: '"Bem-aventurados os que choram, porque serão consolados." (Mt 5,4)', text: 'Suas lágrimas não são vergonha. Deixe a tristeza ser dita, na oração ou no diário.' }
  ],
  moods: [
    { id: 'bem', emoji: '😊', label: 'Bem', prayer: 'gloria', tip: 'Agradeça pelo que está bom hoje: gratidão fortalece a alma.' },
    { id: 'calmo', emoji: '😌', label: 'Calmo', prayer: 'pai-nosso', tip: 'Aproveite a calma para uma oração sem pressa.' },
    { id: 'ansioso', emoji: '😰', label: 'Ansioso', prayer: 'ansiedade', tip: 'Tente a respiração guiada e depois a oração de entrega.' },
    { id: 'triste', emoji: '😢', label: 'Triste', prayer: 'salve-rainha', tip: 'Acolha o que sente. Conversar com alguém de confiança ajuda.' },
    { id: 'cansado', emoji: '😴', label: 'Cansado', prayer: 'noite', tip: 'Descanso também é cuidado. Diminua o ritmo hoje.' },
    { id: 'irritado', emoji: '😠', label: 'Irritado', prayer: 'sao-francisco', tip: 'Respire fundo antes de responder. A paz começa em você.' }
  ],
  help: [
    { name: 'CVV — Centro de Valorização da Vida', desc: 'Apoio emocional e prevenção do suicídio, 24h, gratuito e sigiloso.', tel: '188', link: 'https://www.cvv.org.br' },
    { name: 'SAMU', desc: 'Emergência médica e psiquiátrica.', tel: '192' },
    { name: 'Bombeiros / Emergência', desc: 'Risco imediato à vida.', tel: '193' },
    { name: 'CAPS', desc: 'Centros de Atenção Psicossocial do SUS: procure o mais próximo pela UBS da sua cidade.' }
  ]
};
