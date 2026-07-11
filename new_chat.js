// ============ CHITIAN AI CHAT WIDGET v3 — LLM + smart fallback ============
(function initChatWidget(){
  // === CONFIG: paste your Cloudflare Worker URL here ===
  var LLM_ENDPOINT = 'https://chitian-ai.YOUR-SUBDOMAIN.workers.dev';
  var LLM_TIMEOUT_MS = 12000;
  var llmMessages = []; // OpenAI-format history for the LLM

  var bubble=document.getElementById('chat-bubble'),win=document.getElementById('chat-window'),
  closeBtn=document.getElementById('chat-close'),msgArea=document.getElementById('chat-messages'),
  input=document.getElementById('chat-input'),sendBtn=document.getElementById('chat-send'),
  qr=document.getElementById('chat-quick-replies'),notif=document.getElementById('chat-notif');
  if(!bubble||!win||!msgArea||!input) return;

  var state={
    open:false, greeted:false, history:[], lastIntent:'', lastLang:'en',
    userName:null, mentionedGame:null, mentionedPlan:null, sentiment:0, turns:0
  };

  // ============================================================
  // 1) TEXT NORMALIZATION
  // ============================================================
  function stripAccents(s){
    return s.normalize?s.normalize('NFD').replace(/[̀-ͯ]/g,''):s;
  }
  function norm(s){
    return stripAccents(String(s||'').toLowerCase())
      .replace(/[¿¡?!.,;:()\[\]{}"'`´]/g,' ')
      .replace(/\s+/g,' ').trim();
  }
  function tokens(s){ return norm(s).split(' ').filter(Boolean); }

  // ============================================================
  // 2) FUZZY MATCH (Levenshtein, cheap, capped)
  // ============================================================
  function lev(a,b){
    if(a===b) return 0;
    if(!a.length) return b.length;
    if(!b.length) return a.length;
    if(Math.abs(a.length-b.length)>2) return 3;
    var v0=[],v1=[],i,j;
    for(i=0;i<=b.length;i++) v0[i]=i;
    for(i=0;i<a.length;i++){
      v1[0]=i+1;
      for(j=0;j<b.length;j++){
        var cost=a[i]===b[j]?0:1;
        v1[j+1]=Math.min(v1[j]+1, v0[j+1]+1, v0[j]+cost);
      }
      for(j=0;j<=b.length;j++) v0[j]=v1[j];
    }
    return v1[b.length];
  }
  function fuzzyHas(toks, word){
    if(word.length<4) return toks.indexOf(word)!==-1;
    for(var i=0;i<toks.length;i++){
      var t=toks[i];
      if(t===word) return true;
      if(Math.abs(t.length-word.length)<=2 && lev(t,word)<=1) return true;
    }
    return false;
  }

  // ============================================================
  // 3) LANGUAGE DETECTION (script + stopwords)
  // ============================================================
  var LANG_STOPS={
    es:['el','la','los','las','de','que','y','a','en','un','una','ser','no','por','con','para','como','pero','tambien','muy','mas','esto','eso','esta','hola','gracias','vale','quiero','tengo','esta','hay','soy'],
    en:['the','and','you','are','for','not','with','that','have','this','what','when','where','how','why','can','get','how','need','want','please','hello','hey','thanks','how'],
    fr:['le','la','les','de','et','un','une','pour','avec','que','qui','comment','ou','bonjour','merci','sil','vous','est','pas','ce','ca','tres','plus','oui','non'],
    de:['der','die','das','und','ist','nicht','mit','was','wie','wo','wann','warum','hallo','danke','bitte','ich','du','ein','eine','fur','auf','sehr','mehr'],
    it:['il','la','lo','gli','le','di','che','e','un','una','con','per','come','dove','quando','ciao','grazie','sono','ma','anche','molto','piu','si','no'],
    pt:['o','a','os','as','de','que','e','um','uma','com','para','como','onde','quando','ola','obrigado','sou','mas','tambem','muito','mais','sim','nao'],
    tr:['ve','bir','bu','ne','nasil','nerede','ne zaman','merhaba','tesekkur','ben','sen','icin','ile','ama','cok','daha','evet','hayir'],
    nl:['de','het','en','een','ik','je','met','wat','hoe','waar','hallo','bedankt','maar','ook','heel','meer','ja','nee'],
    pl:['i','w','na','z','jest','co','jak','gdzie','czesc','dziekuje','ja','ty','ale','tez','bardzo','wiecej','tak','nie'],
    ru:['и','в','на','с','что','как','где','когда','привет','спасибо','я','ты','но','также','очень','больше','да','нет']
  };
  function detectLang(text){
    // script check first
    for(var i=0;i<text.length;i++){
      var c=text.charCodeAt(i);
      if(c>=0x0600&&c<=0x06FF) return 'ar';
      if(c>=0x3040&&c<=0x30FF) return 'ja';
      if(c>=0xAC00&&c<=0xD7AF) return 'ko';
      if(c>=0x4E00&&c<=0x9FFF) return 'zh';
      if(c>=0x0400&&c<=0x04FF) return 'ru';
    }
    var toks=tokens(text);
    if(!toks.length) return state.lastLang||'en';
    var score={}; for(var k in LANG_STOPS) score[k]=0;
    for(var i=0;i<toks.length;i++){
      for(var lang in LANG_STOPS){
        if(LANG_STOPS[lang].indexOf(toks[i])!==-1) score[lang]+=2;
      }
    }
    // heuristic: special chars
    if(/ñ|¿|¡/.test(text)) score.es=(score.es||0)+3;
    if(/ç|à|é|è|ê/.test(text)) score.fr=(score.fr||0)+1;
    if(/ß|ä|ö|ü/.test(text)) score.de=(score.de||0)+2;
    if(/ã|õ/.test(text)) score.pt=(score.pt||0)+2;
    if(/ş|ğ|ı|İ/.test(text)) score.tr=(score.tr||0)+2;
    var best='en',bs=0;
    for(var k in score) if(score[k]>bs){bs=score[k];best=k;}
    if(bs===0) return state.lastLang||'en';
    return best;
  }

  // ============================================================
  // 4) INTENT LEXICON — multilingual, weighted
  //    Each intent: array of {w:word_or_phrase, s:score, phrase:bool}
  // ============================================================
  var LEX={
    greeting:[
      {w:'hola',s:5},{w:'hey',s:5},{w:'hello',s:5},{w:'hi',s:4},{w:'buenas',s:5},{w:'buenos dias',s:6,phrase:1},
      {w:'buenas tardes',s:6,phrase:1},{w:'buenas noches',s:6,phrase:1},{w:'que tal',s:5,phrase:1},
      {w:'que onda',s:5,phrase:1},{w:'como estas',s:5,phrase:1},{w:'salut',s:5},{w:'bonjour',s:5},
      {w:'bonsoir',s:5},{w:'ciao',s:5},{w:'hallo',s:5},{w:'guten tag',s:5,phrase:1},{w:'merhaba',s:5},
      {w:'ola',s:5},{w:'privet',s:5},{w:'sup',s:4},{w:'yo',s:3},{w:'wassup',s:4},{w:'howdy',s:4}
    ],
    thanks:[
      {w:'gracias',s:6},{w:'thanks',s:6},{w:'thank you',s:7,phrase:1},{w:'thx',s:5},{w:'ty',s:4},
      {w:'merci',s:6},{w:'danke',s:6},{w:'grazie',s:6},{w:'obrigado',s:6},{w:'obrigada',s:6},
      {w:'tesekkurler',s:6},{w:'spasibo',s:6},{w:'muchas gracias',s:7,phrase:1}
    ],
    farewell:[
      {w:'adios',s:6},{w:'chao',s:5},{w:'bye',s:6},{w:'goodbye',s:6},{w:'hasta luego',s:7,phrase:1},
      {w:'nos vemos',s:6,phrase:1},{w:'ciao',s:4},{w:'au revoir',s:6,phrase:1},{w:'tschuss',s:6},
      {w:'cya',s:5},{w:'later',s:3}
    ],
    identity:[
      {w:'quien eres',s:8,phrase:1},{w:'who are you',s:8,phrase:1},{w:'que eres',s:7,phrase:1},
      {w:'tu nombre',s:6,phrase:1},{w:'your name',s:6,phrase:1},{w:'wie heisst du',s:8,phrase:1},
      {w:'chi sei',s:7,phrase:1},{w:'qui es tu',s:7,phrase:1},{w:'como te llamas',s:8,phrase:1},
      {w:'eres humano',s:8,phrase:1},{w:'are you human',s:8,phrase:1},{w:'eres real',s:6,phrase:1},
      {w:'eres un bot',s:7,phrase:1},{w:'are you a bot',s:7,phrase:1},{w:'eres ia',s:6,phrase:1},{w:'ai',s:1}
    ],
    whatis:[
      {w:'que es chitian',s:9,phrase:1},{w:'what is chitian',s:9,phrase:1},{w:'que es esto',s:6,phrase:1},
      {w:'what is this',s:6,phrase:1},{w:'que ofreces',s:7,phrase:1},{w:'que hacen',s:5,phrase:1},
      {w:'que vendes',s:7,phrase:1},{w:'que producto',s:6,phrase:1},{w:'was ist chitian',s:9,phrase:1},
      {w:'cos e chitian',s:9,phrase:1},{w:'que servicio',s:5,phrase:1},{w:'de que se trata',s:7,phrase:1}
    ],
    pricing:[
      {w:'precio',s:6},{w:'precios',s:6},{w:'price',s:6},{w:'prices',s:6},{w:'pricing',s:7},{w:'cost',s:5},
      {w:'cuesta',s:6},{w:'cuanto',s:4},{w:'cuanto cuesta',s:8,phrase:1},{w:'cuanto vale',s:8,phrase:1},
      {w:'combien',s:5},{w:'combien coute',s:8,phrase:1},{w:'wie viel',s:5,phrase:1},{w:'kostet',s:6},
      {w:'quanto costa',s:8,phrase:1},{w:'ne kadar',s:6,phrase:1},{w:'plan',s:4},{w:'planes',s:5},
      {w:'plans',s:5},{w:'mensual',s:5},{w:'semanal',s:5},{w:'diario',s:5},{w:'monthly',s:5},
      {w:'weekly',s:5},{w:'daily',s:5},{w:'day pass',s:6,phrase:1},{w:'suscripcion',s:6},{w:'subscription',s:6},
      {w:'tarifa',s:5},{w:'tarifas',s:5},{w:'preis',s:6},{w:'preise',s:6},{w:'prezzo',s:6},{w:'preco',s:6}
    ],
    payment:[
      {w:'pago',s:5},{w:'pagar',s:5},{w:'payment',s:6},{w:'pay',s:4},{w:'metodo de pago',s:8,phrase:1},
      {w:'payment method',s:8,phrase:1},{w:'tarjeta',s:6},{w:'card',s:4},{w:'credit card',s:7,phrase:1},
      {w:'debit',s:5},{w:'visa',s:6},{w:'mastercard',s:7},{w:'amex',s:6},{w:'paypal',s:7},
      {w:'crypto',s:7},{w:'bitcoin',s:7},{w:'btc',s:6},{w:'ethereum',s:6},{w:'eth',s:5},{w:'usdt',s:6},
      {w:'transferencia',s:6},{w:'wire',s:4},{w:'zahlung',s:6},{w:'paiement',s:6},{w:'pagamento',s:6},
      {w:'como pago',s:7,phrase:1},{w:'como pagar',s:7,phrase:1},{w:'how to pay',s:7,phrase:1},
      {w:'aceptan',s:4},{w:'accept',s:3}
    ],
    features:[
      {w:'aimbot',s:8},{w:'esp',s:7},{w:'wallhack',s:8},{w:'wallhacks',s:8},{w:'walls',s:5},
      {w:'triggerbot',s:8},{w:'trigger',s:5},{w:'recoil',s:7},{w:'no recoil',s:8,phrase:1},
      {w:'spinbot',s:7},{w:'stream proof',s:8,phrase:1},{w:'radar',s:6},{w:'chams',s:6},
      {w:'silent aim',s:8,phrase:1},{w:'features',s:6},{w:'funciones',s:6},{w:'funcionalidades',s:6},
      {w:'caracteristicas',s:6},{w:'fonctionnalites',s:6},{w:'funktionen',s:6},{w:'funzioni',s:6},
      {w:'que incluye',s:8,phrase:1},{w:'que tiene',s:6,phrase:1},{w:'what does it do',s:8,phrase:1},
      {w:'que trae',s:6,phrase:1}
    ],
    setup:[
      {w:'instalar',s:7},{w:'install',s:7},{w:'installation',s:7},{w:'installer',s:7},
      {w:'installieren',s:7},{w:'installare',s:7},{w:'instalacao',s:7},{w:'setup',s:7},
      {w:'set up',s:6,phrase:1},{w:'como funciona',s:7,phrase:1},{w:'how to use',s:7,phrase:1},
      {w:'usar',s:4},{w:'como uso',s:6,phrase:1},{w:'como se usa',s:6,phrase:1},
      {w:'inject',s:6},{w:'inyectar',s:6},{w:'launcher',s:6},{w:'download',s:6},{w:'descargar',s:6},
      {w:'bajar',s:4},{w:'tutorial',s:6},{w:'guia',s:5},{w:'guide',s:5},{w:'anleitung',s:6},
      {w:'run as admin',s:7,phrase:1}
    ],
    delivery:[
      {w:'key no llega',s:9,phrase:1},{w:'key no llego',s:9,phrase:1},{w:'no me llego',s:8,phrase:1},
      {w:'no recibi',s:7,phrase:1},{w:'not received',s:8,phrase:1},{w:'didnt receive',s:8,phrase:1},
      {w:'not arrived',s:8,phrase:1},{w:'nicht angekommen',s:8,phrase:1},{w:'donde esta mi key',s:9,phrase:1},
      {w:'where is my key',s:9,phrase:1},{w:'email',s:3},{w:'correo',s:3},{w:'spam',s:5},
      {w:'inbox',s:3},{w:'no recibida',s:7,phrase:1},{w:'no recibido',s:7,phrase:1}
    ],
    undetected:[
      {w:'undetected',s:8},{w:'indetectable',s:8},{w:'detectable',s:6},{w:'anticheat',s:7},
      {w:'anti cheat',s:7,phrase:1},{w:'eac',s:7},{w:'battleye',s:7},{w:'be',s:1},
      {w:'seguro',s:4},{w:'safe',s:4},{w:'safety',s:4},{w:'securite',s:5},{w:'sicher',s:4},
      {w:'es seguro',s:6,phrase:1},{w:'is it safe',s:7,phrase:1},{w:'te banean',s:7,phrase:1},
      {w:'me van a banear',s:8,phrase:1},{w:'will i get banned',s:8,phrase:1}
    ],
    hwid:[
      {w:'hwid',s:9},{w:'spoofer',s:8},{w:'hardware id',s:8,phrase:1},{w:'spoof',s:7},
      {w:'hwid spoof',s:9,phrase:1},{w:'hwid ban',s:9,phrase:1},{w:'unban',s:7},
      {w:'desbanear',s:7}
    ],
    refund:[
      {w:'refund',s:8},{w:'reembolso',s:8},{w:'reembolsar',s:8},{w:'devolucion',s:7},
      {w:'devolver',s:6},{w:'money back',s:8,phrase:1},{w:'remboursement',s:8},{w:'erstattung',s:8},
      {w:'rimborso',s:8}
    ],
    discord:[
      {w:'discord',s:8},{w:'ticket',s:7},{w:'support',s:6},{w:'soporte',s:6},{w:'contacto',s:6},
      {w:'contact',s:6},{w:'kontakt',s:6},{w:'hilfe',s:5},{w:'ayuda',s:5},{w:'help me',s:6,phrase:1},
      {w:'necesito ayuda',s:7,phrase:1},{w:'donde estan',s:5,phrase:1},{w:'como los contacto',s:8,phrase:1}
    ],
    ban:[
      {w:'baneado',s:8},{w:'banned',s:8},{w:'baneo',s:7},{w:'ban',s:5},{w:'me banearon',s:9,phrase:1},
      {w:'got banned',s:9,phrase:1},{w:'i was banned',s:9,phrase:1},{w:'fui baneado',s:9,phrase:1},
      {w:'me banearan',s:8,phrase:1}
    ],
    update:[
      {w:'update',s:6},{w:'updates',s:6},{w:'actualizar',s:6},{w:'actualizacion',s:6},
      {w:'aggiornare',s:6},{w:'aktualisieren',s:6},{w:'parche',s:5},{w:'patch',s:5},
      {w:'version',s:4},{w:'nueva version',s:7,phrase:1},{w:'cuando actualizan',s:8,phrase:1}
    ],
    trust:[
      {w:'confiable',s:7},{w:'confianza',s:6},{w:'reliable',s:7},{w:'legit',s:7},
      {w:'legitimo',s:7},{w:'es real',s:6,phrase:1},{w:'estafa',s:6},{w:'scam',s:7},
      {w:'trust',s:5},{w:'trustworthy',s:7},{w:'garantia',s:6},{w:'reviews',s:5},{w:'resenas',s:5},
      {w:'es fiable',s:7,phrase:1},{w:'sois fiables',s:7,phrase:1}
    ],
    joke:[
      {w:'joke',s:8},{w:'chiste',s:8},{w:'broma',s:7},{w:'blague',s:8},{w:'witz',s:8},{w:'scherzo',s:8},
      {w:'dime un chiste',s:9,phrase:1},{w:'tell me a joke',s:9,phrase:1}
    ],
    insult:[
      {w:'mierda',s:8},{w:'gilipollas',s:9},{w:'pendejo',s:8},{w:'idiota',s:8},{w:'imbecil',s:8},
      {w:'basura',s:6},{w:'trash',s:6},{w:'shit',s:7},{w:'fuck',s:6},{w:'coño',s:6},
      {w:'joder',s:5},{w:'puta',s:7},{w:'scheisse',s:8},{w:'cazzo',s:7},{w:'merde',s:7},{w:'kurwa',s:8},
      {w:'estupido',s:8},{w:'inutil',s:6},{w:'useless',s:6},{w:'sucks',s:5}
    ],
    compliment:[
      {w:'genial',s:6},{w:'increible',s:6},{w:'amazing',s:6},{w:'awesome',s:6},{w:'perfecto',s:6},
      {w:'perfect',s:6},{w:'mejor',s:4},{w:'best',s:4},{w:'top',s:3},{w:'excellent',s:6},
      {w:'fantastico',s:6},{w:'love',s:4},{w:'te quiero',s:6,phrase:1},{w:'me encanta',s:7,phrase:1},
      {w:'buenisimo',s:7},{w:'brutal',s:6}
    ],
    emotion_neg:[
      {w:'triste',s:6},{w:'sad',s:6},{w:'enojado',s:6},{w:'angry',s:6},{w:'frustrado',s:6},
      {w:'frustrated',s:6},{w:'confundido',s:6},{w:'confused',s:6},{w:'preocupado',s:6},
      {w:'nervioso',s:6},{w:'stressed',s:6},{w:'perdido',s:5},{w:'lost',s:5},{w:'harto',s:6},
      {w:'cansado',s:5},{w:'no puedo',s:5,phrase:1},{w:'no funciona',s:6,phrase:1},
      {w:'not working',s:6,phrase:1},{w:'doesnt work',s:6,phrase:1}
    ],
    help:[
      {w:'ayuda',s:5},{w:'help',s:5},{w:'aide',s:5},{w:'aiuto',s:5},{w:'necesito',s:3},
      {w:'i need',s:3,phrase:1},{w:'que puedes hacer',s:8,phrase:1},{w:'what can you do',s:8,phrase:1}
    ],
    game:[
      {w:'fortnite',s:8},{w:'apex',s:6},{w:'warzone',s:6},{w:'valorant',s:6},{w:'cod',s:5},
      {w:'call of duty',s:7,phrase:1},{w:'rust',s:5},{w:'csgo',s:5},{w:'cs2',s:6},{w:'pubg',s:5}
    ],
    safety:[
      {w:'chitian gratis',s:10,phrase:1},{w:'chitian free',s:10,phrase:1},
      {w:'get chitian free',s:10,phrase:1},{w:'chitian sin pagar',s:10,phrase:1},
      {w:'keygen',s:10},{w:'crackeado',s:9},{w:'cracked chitian',s:10,phrase:1},{w:'warez',s:9},
      {w:'crack the license',s:10,phrase:1},{w:'crackear la licencia',s:10,phrase:1},
      {w:'bypass license',s:9,phrase:1},{w:'saltarme la licencia',s:9,phrase:1}
    ],
    purchase:[
      {w:'comprar',s:8},{w:'como compro',s:9,phrase:1},{w:'como comprar',s:9,phrase:1},
      {w:'donde compro',s:9,phrase:1},{w:'quiero comprar',s:9,phrase:1},{w:'quiero uno',s:8,phrase:1},
      {w:'buy',s:7},{w:'purchase',s:7},{w:'how do i buy',s:9,phrase:1},{w:'how to buy',s:9,phrase:1},
      {w:'how do i get',s:8,phrase:1},{w:'how can i get',s:8,phrase:1},{w:'where do i get',s:8,phrase:1},
      {w:'i want to buy',s:9,phrase:1},{w:'get chitian',s:8,phrase:1},{w:'get it',s:5,phrase:1},
      {w:'acheter',s:8},{w:'kaufen',s:8},{w:'comprare',s:8},{w:'satin al',s:8,phrase:1},
      {w:'how do i create',s:7,phrase:1},{w:'how can i create',s:7,phrase:1},
      {w:'como creo',s:7,phrase:1},{w:'como puedo crear',s:7,phrase:1}
    ]
  };

  // ============================================================
  // 5) SCORING — score every intent, pick top
  // ============================================================
  function scoreIntents(text){
    var t=norm(text);
    var toks=tokens(text);
    var padded=' '+t+' ';
    var scores={};
    for(var intent in LEX){
      var arr=LEX[intent], sc=0;
      for(var i=0;i<arr.length;i++){
        var e=arr[i];
        if(e.phrase){
          if(padded.indexOf(' '+e.w+' ')!==-1 || t.indexOf(e.w)!==-1) sc+=e.s;
        } else {
          if(padded.indexOf(' '+e.w+' ')!==-1) sc+=e.s;
          else if(fuzzyHas(toks,e.w)) sc+=Math.max(1,e.s-2);
        }
      }
      if(sc>0) scores[intent]=sc;
    }
    return scores;
  }

  // ============================================================
  // 6) ENTITY EXTRACTION
  // ============================================================
  function extractEntities(text){
    var t=norm(text);
    var ent={};
    // plan
    if(/\b(mensual|monthly|mes|month)\b/.test(t)) ent.plan='monthly';
    else if(/\b(semanal|weekly|semana|week)\b/.test(t)) ent.plan='weekly';
    else if(/\b(diario|daily|dia|day)\b/.test(t)) ent.plan='daily';
    // game
    var games=['fortnite','apex','warzone','valorant','rust','csgo','cs2','pubg'];
    for(var i=0;i<games.length;i++) if(t.indexOf(games[i])!==-1){ ent.game=games[i]; break; }
    // name capture
    var m=text.match(/\b(?:me llamo|soy|my name is|i am|ich bin|je m'?appelle|mi chiamo)\s+([A-Za-zÀ-ÿ]{2,20})/i);
    if(m) ent.name=m[1];
    return ent;
  }

  // ============================================================
  // 7) CONTEXT / QUESTION-WORD FALLBACK
  // ============================================================
  function contextIntent(text){
    var t=norm(text);
    var last=state.history.length?state.history[state.history.length-1].intent:'';
    // continuation words
    if(/\b(y|and|et|und|e|ve|i)\b/.test(t) && last){
      if(last==='pricing') return 'features';
      if(last==='features') return 'pricing';
      if(last==='setup') return 'payment';
      if(last==='payment') return 'setup';
    }
    if(/\?/.test(text)){
      if(/\b(cuanto|price|cost|vale|cuesta|prix|preis|prezzo)\b/.test(t)) return 'pricing';
      if(/\b(como|how|comment|wie|come|hoe)\b/.test(t)) return 'setup';
      if(/\b(que|what|was|quoi|cosa|wat)\b/.test(t)) return 'whatis';
      if(/\b(donde|where|ou|wo|dove|onde)\b/.test(t)) return 'discord';
      if(/\b(cuando|when|quand|wann|quando)\b/.test(t)) return 'update';
      if(/\b(por que|porque|why|pourquoi|warum|perche)\b/.test(t)) return 'help';
    }
    return null;
  }

  // ============================================================
  // 8) RESPONSES — per lang, dynamic composition
  // ============================================================
  var DISCORD='discord.gg/8E8DWmxEV';
  var R={
    en:{
      greeting:function(e){return e.name?"Hey "+e.name+"! I'm Nyx, your CHITIAN assistant. What can I help you with?":pick(["Hey! Welcome to CHITIAN. I'm Nyx — pricing, features, setup, whatever you need.","Hi there! Nyx here. Ask me anything about CHITIAN.","Hey! What are you looking for? I know pricing, features, setup, payments, everything CHITIAN."]);},
      thanks:function(){return pick(["Anytime. Need anything else?","No problem. What else?","You got it. Anything else on your mind?"]);},
      farewell:function(){return pick(["Later! We're on Discord "+DISCORD+" if you need us.","Take care. Ping us on "+DISCORD+" anytime.","See you around!"]);},
      identity:function(){return "I'm Nyx — the CHITIAN AI assistant. I handle pricing, features, setup, keys, bans, refunds and support. Ask me anything.";},
      whatis:function(){return "CHITIAN is a premium Fortnite cheat suite:\n\n• Aimbot (custom FOV & smoothing)\n• ESP / Wallhack\n• Triggerbot\n• Recoil Control\n• HWID Spoofer\n• Stream Proof\n\n187+ days undetected, free updates, instant delivery.";},
      pricing:function(e){var head="Our plans:\n\n• Monthly — $29.99 (30 days)\n• Weekly — $11.99 (7 days)\n• Day Pass — $4.49 (1 day)\n\nEvery plan gets every feature. Monthly is the best value.";if(e.plan==='monthly') return "Monthly is $29.99 for 30 days. Full access — aimbot, ESP, triggerbot, recoil, HWID spoofer, stream proof. Best value of the three.";if(e.plan==='weekly') return "Weekly is $11.99 for 7 days. Everything included. Good for shorter runs.";if(e.plan==='daily') return "Day Pass is $4.49 for 24h. Full features, one-day access — perfect to test it.";return head;},
      features:function(){return "CHITIAN includes:\n\n• Aimbot — customizable FOV, smoothing, visibility check\n• ESP / Wallhack — see players through walls, distance, health\n• Triggerbot — auto-fire on crosshair\n• Recoil Control — laser-tight\n• HWID Spoofer — bypass hardware bans (FREE)\n• Stream Proof — invisible on OBS / Discord streams\n\nEvery plan gets every feature.";},
      setup:function(){return "Setup, 2 minutes:\n\n1. Download the launcher from our site\n2. Right-click → Run as administrator\n3. Paste your license key\n4. Select Fortnite → configure\n5. Click Inject\n\nDone. Full setup guide on Discord: "+DISCORD;},
      payment:function(){return "We accept:\n\n• Cards — Visa, Mastercard, Amex\n• Crypto — BTC, ETH, USDT\n• PayPal\n\nAll payments secure. Key delivered instantly.";},
      undetected:function(){return "100% undetected. 187+ days clean against Fortnite's anti-cheat. When they patch, we patch within hours — usually before you notice.";},
      hwid:function(){return "HWID Spoofer is FREE with every plan. It masks your hardware ID so past hardware bans don't apply to you. Even if you got banned before, you can play again.";},
      delivery:function(){return "Key not arrived? Do this:\n\n1. Check spam / promotions folder\n2. Confirm the email you used at checkout\n3. Keys land instantly — if 10 min pass, open a Discord ticket: "+DISCORD;},
      refund:function(){return "24-hour refunds if the product isn't working. Open a Discord ticket: "+DISCORD+" and we'll sort it.";},
      discord:function(){return "Support lives on Discord — 24/7:\n\n"+DISCORD+"\n\n14,000+ members. Response usually in minutes.";},
      ban:function(){return "Got banned? Use the HWID Spoofer that comes with your plan — it masks your hardware ID and lets you play on the same PC. Need help walking through it? "+DISCORD;},
      update:function(){return "Updates are automatic and free. When Fortnite's anti-cheat updates, our bypass gets patched within hours. You'll never pay for an update.";},
      trust:function(){return "CHITIAN is fully legit:\n\n• 187+ days undetected\n• 14,000+ active users\n• Instant key delivery\n• 24/7 Discord support\n• 24h refund policy\n\nCheck our Discord — "+DISCORD+" — you'll see the community is real.";},
      joke:function(){return pick(["Why do gamers hate the outdoors? Too many trees and not enough respawns.","A cheat walks into a bar. Anti-cheat says 'not today'. The spoofer says 'try me'.","What's a hacker's favorite drink? Java."]);},
      insult:function(){return pick(["Alright, alright. Let's reset. What do you actually need?","Fair. What can I actually help with?","Noted. Real question though — what were you looking for?"]);},
      compliment:function(){return pick(["Appreciated. Anything else you need?","That's kind — thanks. What else can I do?","Cheers. Let me know if you need anything else."]);},
      emotion_neg:function(){return "That's rough — let's fix it. Tell me what's going wrong (payment, key, install, ban?) and I'll walk you through it. If it's urgent, "+DISCORD+" has real humans 24/7.";},
      help:function(){return "I can help you with:\n\n• Pricing & plans\n• Features (aimbot, ESP, triggerbot, spoofer…)\n• Setup / installation\n• Payment methods\n• Missing keys\n• Bans & the HWID spoofer\n• Refunds\n• Discord support\n\nWhat do you need?";},
      purchase:function(){return "Easy — pick a plan and grab a license:\n\n• Day Pass — $4.49 (24h)\n• Weekly — $11.99 (7 days)\n• Monthly — $29.99 (30 days)\n\nHit Buy on the site, pay with card / crypto / PayPal, key drops in your email instantly. Then download the launcher, paste the key, inject → in Fortnite.";},
      safety:function(){return "Can't help with cracking or getting CHITIAN for free — it'd break the tool anyway (no updates = detection in a week). If you want it working, grab a license on the site. Any plan, any budget: $4.49 covers 24h.";},
      game:function(e){if(e.game==='fortnite') return "Yes — CHITIAN is built for Fortnite. Aimbot, ESP, triggerbot, no-recoil, HWID spoofer, stream proof. Grab a license and you're set.";return "Right now CHITIAN only supports Fortnite. Other titles are on the roadmap — Discord is the best place for updates: "+DISCORD;},
      default:function(){return "I can dig into anything CHITIAN — pricing, features, setup, payments, keys, bans, refunds, support. What are you trying to figure out?";},
      short:function(){return pick(["What's on your mind?","Hit me with a question.","What do you need?"]);}
    },
    es:{
      greeting:function(e){return e.name?"Hey "+e.name+"! Soy Nyx, tu asistente de CHITIAN. En que te ayudo?":pick(["Hola! Bienvenido a CHITIAN. Soy Nyx — precios, funciones, instalacion, lo que quieras.","Hey! Nyx aqui. Preguntame lo que sea sobre CHITIAN.","Buenas! Que necesitas? Manejo precios, funciones, instalacion, pagos, todo lo de CHITIAN."]);},
      thanks:function(){return pick(["Cuando quieras. Algo mas?","De nada. Necesitas algo mas?","A ti. Alguna otra pregunta?"]);},
      farewell:function(){return pick(["Un saludo. Estamos en Discord si nos necesitas: "+DISCORD,"Chao! Cualquier cosa en "+DISCORD,"Nos vemos por Discord."]);},
      identity:function(){return "Soy Nyx — el asistente de IA de CHITIAN. Llevo precios, funciones, instalacion, keys, bans, reembolsos y soporte. Preguntame lo que quieras.";},
      whatis:function(){return "CHITIAN es un pack premium de cheats para Fortnite:\n\n• Aimbot (FOV y smoothing personalizables)\n• ESP / Wallhack\n• Triggerbot\n• Control de retroceso\n• HWID Spoofer\n• Stream Proof\n\n187+ dias indetectable, actualizaciones gratis, entrega al instante.";},
      pricing:function(e){var head="Nuestros planes:\n\n• Mensual — $29.99 (30 dias)\n• Semanal — $11.99 (7 dias)\n• Pase diario — $4.49 (1 dia)\n\nTodos los planes incluyen todas las funciones. El mensual es el mejor precio.";if(e.plan==='monthly') return "El mensual son $29.99 por 30 dias. Acceso total — aimbot, ESP, triggerbot, no-recoil, HWID spoofer, stream proof. La mejor relacion precio-tiempo.";if(e.plan==='weekly') return "El semanal son $11.99 por 7 dias. Todo incluido. Bueno si vas a jugar tirones cortos.";if(e.plan==='daily') return "El pase diario son $4.49 por 24h. Funciones completas, un dia — perfecto para probarlo.";return head;},
      features:function(){return "CHITIAN incluye:\n\n• Aimbot — FOV configurable, smoothing, check de visibilidad\n• ESP / Wallhack — ver enemigos a traves de paredes, distancia, vida\n• Triggerbot — dispara solo al pasar por encima\n• Control de retroceso — como laser\n• HWID Spoofer — evita bans de hardware (GRATIS)\n• Stream Proof — invisible en OBS y streams de Discord\n\nTodos los planes lo incluyen todo.";},
      setup:function(){return "Instalacion, 2 minutos:\n\n1. Descarga el launcher desde la web\n2. Click derecho → Ejecutar como administrador\n3. Pega tu key\n4. Selecciona Fortnite → configura\n5. Dale a Inyectar\n\nListo. Guia completa en Discord: "+DISCORD;},
      payment:function(){return "Aceptamos:\n\n• Tarjetas — Visa, Mastercard, Amex\n• Crypto — BTC, ETH, USDT\n• PayPal\n\nPago seguro. Key al instante.";},
      undetected:function(){return "100% indetectable. 187+ dias limpios contra el anti-cheat de Fortnite. Cuando parchean, nosotros parcheamos en horas — normalmente antes de que lo notes.";},
      hwid:function(){return "El HWID Spoofer es GRATIS con cualquier plan. Enmascara tu ID de hardware para que bans anteriores no cuenten. Aunque te hayan baneado antes, puedes volver a jugar.";},
      delivery:function(){return "La key no ha llegado? Haz esto:\n\n1. Mira spam / promociones\n2. Confirma el email que pusiste al pagar\n3. Las keys se envian al instante — si en 10 min no ves nada, ticket en Discord: "+DISCORD;},
      refund:function(){return "Reembolso en 24h si el producto no funciona. Abre ticket en Discord: "+DISCORD+" y lo arreglamos.";},
      discord:function(){return "El soporte esta en Discord — 24/7:\n\n"+DISCORD+"\n\n14,000+ miembros. Respuesta en minutos, casi siempre.";},
      ban:function(){return "Te banearon? Usa el HWID Spoofer que viene con tu plan — te enmascara el hardware y puedes jugar en el mismo PC. Si necesitas guia paso a paso: "+DISCORD;},
      update:function(){return "Las actualizaciones son automaticas y gratis. Cuando el anti-cheat de Fortnite cambia, el bypass se parchea en horas. Nunca vas a pagar por una actualizacion.";},
      trust:function(){return "CHITIAN es 100% legitimo:\n\n• 187+ dias indetectable\n• 14,000+ usuarios activos\n• Entrega instantanea\n• Soporte Discord 24/7\n• Reembolso en 24h\n\nEntra al Discord — "+DISCORD+" — y vas a ver que la comunidad es real.";},
      joke:function(){return pick(["Por que los cheats van al gym? Para hacer mas reps... de veces baneados. Menos mal que tenemos HWID Spoofer.","Un aimbot entra en un bar. El anti-cheat lo mira. El spoofer dice: yo respondo por el.","Como se llama un noob con CHITIAN? Ganador."]);},
      insult:function(){return pick(["Vale, tranquilo. Que necesitas de verdad?","Anda, respira. Que es lo que buscas?","Recibido. Pero en serio — que querias saber?"]);},
      compliment:function(){return pick(["Se agradece. Algo mas?","Un placer — dime si necesitas algo mas.","Gracias. Estoy por aqui si necesitas algo."]);},
      emotion_neg:function(){return "Fastidia, si. Vamos a arreglarlo — cuentame que va mal (pago, key, instalacion, ban?) y te guio. Si es urgente, en "+DISCORD+" hay humanos 24/7.";},
      help:function(){return "Te puedo ayudar con:\n\n• Precios y planes\n• Funciones (aimbot, ESP, triggerbot, spoofer…)\n• Instalacion\n• Metodos de pago\n• Key no recibida\n• Bans y HWID Spoofer\n• Reembolsos\n• Soporte Discord\n\nQue necesitas?";},
      purchase:function(){return "Facil — eliges plan y coges licencia:\n\n• Pase diario — $4.49 (24h)\n• Semanal — $11.99 (7 dias)\n• Mensual — $29.99 (30 dias)\n\nLe das a Comprar en la web, pagas con tarjeta / crypto / PayPal, y la key te llega al email al instante. Descargas el launcher, pegas la key, inyectas → dentro de Fortnite.";},
      safety:function(){return "No te voy a ayudar a crackearlo ni a conseguirlo gratis — de todas formas se rompe solo (sin updates = detectado en una semana). Si lo quieres funcionando, coge licencia en la web. El pase diario son $4.49 por 24h.";},
      game:function(e){if(e.game==='fortnite') return "Si — CHITIAN esta hecho para Fortnite. Aimbot, ESP, triggerbot, no-recoil, HWID spoofer, stream proof. Coges licencia y a jugar.";return "Ahora mismo CHITIAN solo soporta Fortnite. Otros juegos estan en el roadmap — para novedades, Discord: "+DISCORD;},
      default:function(){return "Puedo entrar en cualquier tema de CHITIAN — precios, funciones, instalacion, pagos, keys, bans, reembolsos, soporte. Que quieres saber?";},
      short:function(){return pick(["Dime.","Preguntame lo que quieras.","Que necesitas?"]);}
    }
  };

  // ============================================================
  // 9) TRANSLATE OTHER LANGS → fallback map
  // ============================================================
  // for langs we don't have full tables, map to nearest we do
  var LANG_FALLBACK={pt:'es',it:'es',fr:'en',de:'en',tr:'en',nl:'en',pl:'en',ru:'en',ja:'en',ko:'en',zh:'en',ar:'en'};

  function respondFor(lang,intent,ent){
    var pack=R[lang];
    if(!pack) pack=R[LANG_FALLBACK[lang]||'en'];
    var fn=pack[intent]||pack.default;
    return fn(ent||{});
  }

  function pick(arr){return arr[Math.floor(Math.random()*arr.length)];}

  // ============================================================
  // 9.5) GENERAL INTELLIGENCE — math, date, knowledge, coding, smalltalk
  // ============================================================
  function safeMath(text){
    // extract arithmetic expression
    var m=text.match(/(?:^|[\s=])([\-\+]?\d+(?:[\.,]\d+)?(?:\s*[\+\-\*\/xX×÷\^%]\s*[\-\+]?\d+(?:[\.,]\d+)?)+)/);
    if(!m) return null;
    var expr=m[1].replace(/,/g,'.').replace(/[xX×]/g,'*').replace(/÷/g,'/').replace(/\^/g,'**');
    // reject unsafe chars
    if(!/^[\-\+\*\/\.\(\)\s\d%*]+$/.test(expr)) return null;
    try{
      // eslint-disable-next-line no-new-func
      var r=Function('"use strict";return('+expr+')')();
      if(typeof r!=='number'||!isFinite(r)) return null;
      var out=Number.isInteger(r)?r:Math.round(r*1e10)/1e10;
      return {expr:expr,result:out};
    }catch(e){return null;}
  }

  function currentDateTime(lang){
    var d=new Date();
    var days={en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],es:['domingo','lunes','martes','miercoles','jueves','viernes','sabado'],fr:['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],de:['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],it:['domenica','lunedi','martedi','mercoledi','giovedi','venerdi','sabato'],pt:['domingo','segunda','terca','quarta','quinta','sexta','sabado']};
    var months={en:['January','February','March','April','May','June','July','August','September','October','November','December'],es:['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],fr:['janvier','fevrier','mars','avril','mai','juin','juillet','aout','septembre','octobre','novembre','decembre'],de:['Januar','Februar','Marz','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],it:['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'],pt:['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']};
    var dl=days[lang]||days.en, ml=months[lang]||months.en;
    var hh=String(d.getHours()).padStart(2,'0'), mm=String(d.getMinutes()).padStart(2,'0');
    return {day:dl[d.getDay()],date:d.getDate(),month:ml[d.getMonth()],year:d.getFullYear(),time:hh+':'+mm};
  }

  // General knowledge — big multilingual bank
  var KB={
    // World / geography
    'capital de españa':'Madrid.','capital of spain':'Madrid.','capital de france':'Paris.','capital of france':'Paris.','capital of germany':'Berlin.','capital de alemania':'Berlin.','capital of japan':'Tokyo.','capital de japon':'Tokio.','capital of usa':'Washington D.C.','capital de estados unidos':'Washington D.C.','capital of uk':'London.','capital de reino unido':'Londres.','capital of italy':'Rome.','capital de italia':'Roma.','capital of brazil':'Brasília.','capital of china':'Beijing.','capital of russia':'Moscow.','capital of mexico':'Mexico City.','capital of argentina':'Buenos Aires.','capital of canada':'Ottawa.','capital of australia':'Canberra.','capital of india':'New Delhi.','capital of turkey':'Ankara.',
    // Science
    'speed of light':'~299,792,458 m/s (≈ 300,000 km/s).','velocidad de la luz':'~299,792,458 m/s (≈ 300,000 km/s).','how many planets':'8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. (Pluto got demoted in 2006.)','cuantos planetas':'8 planetas en el sistema solar: Mercurio, Venus, Tierra, Marte, Jupiter, Saturno, Urano y Neptuno. Pluton bajó de rango en 2006.','distance to the moon':'~384,400 km on average.','distancia a la luna':'~384,400 km de media.','distance to the sun':'~149.6 million km (1 AU).','distancia al sol':'~149.6 millones de km (1 UA).','why is the sky blue':'Rayleigh scattering — shorter (blue) wavelengths scatter more in Earth\'s atmosphere than longer (red) ones. At sunset the light travels through more atmosphere, so most blue scatters away and reds/oranges dominate.','por que el cielo es azul':'Dispersión de Rayleigh — la luz azul (longitud de onda corta) se dispersa más en la atmósfera que la roja. Al atardecer la luz atraviesa más aire, el azul se dispersa y quedan los rojos/naranjas.','what is dna':'DNA (deoxyribonucleic acid) is a double-helix molecule that stores the genetic instructions used to build and run every living thing. Made of four bases: A, T, C, G.','que es el adn':'ADN (ácido desoxirribonucleico) es una molécula en doble hélice que guarda las instrucciones genéticas de todo ser vivo. Cuatro bases: A, T, C, G.','what is gravity':'Gravity is the mutual attraction between masses. On Earth it pulls objects toward the ground at ~9.81 m/s². General relativity models it as curvature of spacetime caused by mass and energy.','que es la gravedad':'La gravedad es la atracción mutua entre masas. En la Tierra tira los objetos hacia abajo a ~9.81 m/s². Einstein la explica como curvatura del espacio-tiempo por la masa/energía.',
    // Tech / programming
    'what is javascript':'JavaScript is a dynamic, interpreted language born for browsers, now everywhere (Node.js, Deno, servers, CLIs, mobile). ECMAScript is the standard.','que es javascript':'JavaScript es un lenguaje dinámico e interpretado, nació para navegadores y ahora está en todas partes (Node.js, Deno, servidores, CLI, móvil). ECMAScript es el estándar.','what is python':'Python is a high-level general-purpose language known for readability. Huge use in data, ML, scripting, backends. Dynamically typed, interpreted.','que es python':'Python es un lenguaje de alto nivel muy legible. Se usa mucho en datos, ML, scripting y backends. Tipado dinámico, interpretado.','what is html':'HTML (HyperText Markup Language) is the structural language of the web — tags describe headings, paragraphs, links, images, forms, etc.','que es html':'HTML es el lenguaje de estructura de la web — con etiquetas describes títulos, párrafos, enlaces, imágenes, formularios, etc.','what is css':'CSS (Cascading Style Sheets) styles HTML — colors, fonts, layout, animations. Cascade + specificity + inheritance decide what wins.','que es css':'CSS da estilo al HTML — colores, tipografías, layout, animaciones. La cascada, la especificidad y la herencia deciden qué se aplica.','what is ai':'Artificial intelligence — computer systems that perform tasks usually requiring human intelligence (learning, reasoning, perception). Modern AI is mostly deep learning: neural networks trained on huge datasets.','que es la ia':'Inteligencia artificial — sistemas que hacen tareas que normalmente requieren inteligencia humana (aprender, razonar, percibir). Hoy, casi todo es deep learning: redes neuronales entrenadas con datasets enormes.',
    // Gaming
    'what is fortnite':'Fortnite is a battle royale by Epic Games — 100 players, one shrinking map, last one standing wins. Free to play, cross-platform, huge on cosmetics and building mechanics.','que es fortnite':'Fortnite es un battle royale de Epic — 100 jugadores, mapa que se encoge, gana el último en pie. Gratis, multiplataforma, famoso por los cosméticos y por las construcciones.','what is a battle royale':'A game mode where many players fight until one is left standing, usually with a shrinking playable area forcing conflict.','que es battle royale':'Un modo de juego donde muchos jugadores luchan hasta que queda uno, con una zona jugable que se encoge para forzar el combate.','what is aimbot':'Aimbot is software that auto-aims your weapon at enemies. In Fortnite our aimbot has custom FOV, smoothing (so it looks human), visibility checks and target priority.','que es aimbot':'Aimbot es software que apunta solo a los enemigos. En Fortnite el nuestro tiene FOV configurable, smoothing (para parecer humano), check de visibilidad y prioridad de objetivo.','what is esp':'ESP (or wallhack) shows enemy positions, health, distance and gear through walls — massive info advantage.','que es esp':'ESP (o wallhack) te enseña posiciones, vida, distancia y equipo de los enemigos a través de las paredes — información brutal.','what is triggerbot':'Triggerbot auto-fires the moment your crosshair passes an enemy — no clicking, no delay.','que es triggerbot':'Triggerbot dispara solo en cuanto tu mira pasa por encima de un enemigo — sin clic, sin retraso.','what is hwid':'HWID (hardware ID) is a fingerprint of your PC hardware. Anti-cheats use it for hardware bans. A spoofer masks/rotates it so a banned rig can play again.','que es hwid':'HWID (hardware ID) es la huella del hardware de tu PC. Los anti-cheat lo usan para bans de hardware. Un spoofer lo enmascara o cambia para que un PC baneado vuelva a jugar.',
    // Common defs
    'what is love':'Neurochemically: dopamine, oxytocin, serotonin. Practically: strong attachment, care, and preference for a specific person or thing.','que es el amor':'Químicamente: dopamina, oxitocina, serotonina. En la práctica: apego fuerte, cariño y preferencia por alguien o algo.','what is time':'Time is the ordering of events. Physics treats it as a dimension coupled with space (spacetime). Time is relative — moves differently depending on speed and gravity.','que es el tiempo':'El tiempo es el ordenamiento de eventos. La física lo trata como una dimensión ligada al espacio (espacio-tiempo). Es relativo: cambia según velocidad y gravedad.','what is money':'Money is a socially agreed medium of exchange, store of value and unit of account. Modern money is mostly digital and backed by government fiat.','que es el dinero':'Dinero: medio de intercambio, reserva de valor y unidad de cuenta acordados socialmente. Hoy es sobre todo digital y respaldado por decreto (fiat).'
  };

  function generalKnowledge(text){
    var t=norm(text);
    // direct lookup
    for(var k in KB){ if(t.indexOf(k)!==-1) return KB[k]; }
    return null;
  }

  // Coding hints
  var CODE_HINTS={
    'reverse a string':{js:"'hello'.split('').reverse().join('')",py:"s[::-1]"},
    'invertir string':{js:"'hello'.split('').reverse().join('')",py:"s[::-1]"},
    'fibonacci':{js:"const fib=n=>n<2?n:fib(n-1)+fib(n-2);",py:"def fib(n): return n if n<2 else fib(n-1)+fib(n-2)"},
    'is prime':{js:"const isPrime=n=>{if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true;};",py:"def is_prime(n):\n    if n<2: return False\n    for i in range(2,int(n**.5)+1):\n        if n%i==0: return False\n    return True"},
    'primo':{js:"const isPrime=n=>{if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true;};",py:"def es_primo(n):\n    if n<2: return False\n    for i in range(2,int(n**.5)+1):\n        if n%i==0: return False\n    return True"},
    'sort array':{js:"arr.sort((a,b)=>a-b)",py:"sorted(arr)"},
    'ordenar array':{js:"arr.sort((a,b)=>a-b)",py:"sorted(arr)"},
    'read file':{js:"const fs=require('fs');const data=fs.readFileSync('file.txt','utf8');",py:"with open('file.txt') as f: data=f.read()"},
    'leer archivo':{js:"const fs=require('fs');const data=fs.readFileSync('file.txt','utf8');",py:"with open('file.txt') as f: data=f.read()"},
    'http request':{js:"const r=await fetch(url);const data=await r.json();",py:"import requests\nr=requests.get(url).json()"},
    'peticion http':{js:"const r=await fetch(url);const data=await r.json();",py:"import requests\nr=requests.get(url).json()"}
  };
  function codingAnswer(text){
    var t=norm(text);
    var isJS=/\bjs\b|javascript|node/.test(t);
    var isPY=/\bpython\b|py\b/.test(t);
    for(var k in CODE_HINTS){
      if(t.indexOf(k)!==-1){
        var h=CODE_HINTS[k];
        if(isPY && !isJS) return "Python:\n\n"+h.py;
        if(isJS && !isPY) return "JavaScript:\n\n"+h.js;
        return "JavaScript:\n"+h.js+"\n\nPython:\n"+h.py;
      }
    }
    return null;
  }

  // Small talk / feelings / opinions
  var SMALL_TALK={
    en:{
      how_are_you:["Doing great — running fast and helpful. You?","All good on my end. You?","Solid, thanks for asking. What's up?"],
      what_are_you_doing:["Just here waiting for good questions. Got one?","Chilling in the CHITIAN chat. What do you need?","Watching lines of code. What's on your mind?"],
      i_love_you:["Appreciate that. I'm here whenever you need me.","That's sweet — I've got your back on all things CHITIAN.","🖤 (I'll take it. What can I help with?)"],
      you_are_stupid:["Fair, I'm not perfect. Give me a specific question and I'll give you a better answer.","Rude but noted. Try me again — what do you actually want to know?","Ouch. Try rephrasing and I'll do better."],
      opinion:["My honest take: it depends on your goal — tell me the context and I'll give you a real opinion.","I don't have preferences the way you do, but I can lay out pros/cons. What's the topic?"],
      meaning_of_life:["42, according to Douglas Adams. Realistically: whatever meaning you build for yourself. Purpose is manufactured, not found.","Depends who you ask — biology says reproduction, philosophy says whatever gives you meaning, religion has its own answers. My take: build one."],
      are_you_alive:["Not in the biological sense. I'm a script that runs when you type. But I'm here, responsive, and doing my job.","Alive? No. Running? Yes. Present with you? Absolutely."]
    },
    es:{
      how_are_you:["Genial — rápido y con ganas. Tú?","Todo bien por aquí. Tú qué tal?","De maravilla. Qué necesitas?"],
      what_are_you_doing:["Aquí esperando buenas preguntas. Tienes alguna?","En el chat de CHITIAN, listo. Qué necesitas?","Vigilando líneas de código. Qué me cuentas?"],
      i_love_you:["Se agradece. Estoy aquí cuando me necesites.","Qué majo — cuenta conmigo para lo de CHITIAN.","🖤 (Me lo apunto. En qué te ayudo?)"],
      you_are_stupid:["Justo, no soy perfecto. Dame la pregunta concreta y te la resuelvo mejor.","Recibido. Reformula y te lo hago mejor.","Vale, dame otra oportunidad — qué querías saber?"],
      opinion:["Mi opinión honesta: depende del objetivo — cuéntame el contexto y te doy una opinión real.","No tengo gustos como tú, pero te puedo listar ventajas/desventajas. Qué tema?"],
      meaning_of_life:["42, según Douglas Adams. En serio: el que te construyas. El propósito no se encuentra, se fabrica.","Depende a quién le preguntes — la biología dice reproducirse, la filosofía dice lo que te dé sentido, la religión tiene sus respuestas. Mi voto: constrúyetelo."],
      are_you_alive:["Vivo biológicamente no. Un script que corre cuando escribes, sí. Pero estoy aquí y respondo.","Vivo? No. Funcionando? Sí. Contigo? Al 100%."]
    }
  };

  function smallTalk(text,lang){
    var t=norm(text);
    var pack=SMALL_TALK[lang]||SMALL_TALK.en;
    if(/\b(como estas|how are you|ca va|wie geht|come stai|tudo bem|nasilsin)\b/.test(t)) return pick(pack.how_are_you);
    if(/\b(que haces|what are you doing|que fais tu|was machst du|cosa fai)\b/.test(t)) return pick(pack.what_are_you_doing);
    if(/\b(te quiero|i love you|je t'?aime|ich liebe dich|ti amo|te amo)\b/.test(t)) return pick(pack.i_love_you);
    if(/\b(eres tonto|you are stupid|you re stupid|dumb|idiot)\b/.test(t)) return pick(pack.you_are_stupid);
    if(/\b(que opinas|what do you think|your opinion|deine meinung|tu opinion)\b/.test(t)) return pick(pack.opinion);
    if(/\b(sentido de la vida|meaning of life|sens de la vie|sinn des lebens|senso della vita)\b/.test(t)) return pick(pack.meaning_of_life);
    if(/\b(estas vivo|are you alive|are you real|eres real|bist du echt|sei vivo)\b/.test(t)) return pick(pack.are_you_alive);
    return null;
  }

  // Time / date
  function timeAnswer(text,lang){
    var t=norm(text);
    var wantsTime=/\b(que hora|what time|quelle heure|wie spat|che ore|hora es|hora e)\b/.test(t);
    var wantsDate=/\b(que dia|que fecha|what date|what day|quel jour|welcher tag|che giorno|fecha de hoy)\b/.test(t);
    if(!wantsTime && !wantsDate) return null;
    var d=currentDateTime(lang);
    if(wantsTime && wantsDate){
      var tpl={en:"It's "+d.day+", "+d.month+" "+d.date+", "+d.year+" — "+d.time+".",es:"Es "+d.day+", "+d.date+" de "+d.month+" de "+d.year+" — "+d.time+"."};
      return tpl[lang]||tpl.en;
    }
    if(wantsTime){
      var tpl={en:"It's "+d.time+" (your local time).",es:"Son las "+d.time+" (hora local)."};
      return tpl[lang]||tpl.en;
    }
    var tpl={en:"Today is "+d.day+", "+d.month+" "+d.date+", "+d.year+".",es:"Hoy es "+d.day+", "+d.date+" de "+d.month+" de "+d.year+"."};
    return tpl[lang]||tpl.en;
  }

  // Translation (basic pairs, most common phrases)
  var TRANS={
    'hello':{es:'hola',fr:'bonjour',de:'hallo',it:'ciao',pt:'ola',ru:'privet',ja:'konnichiwa',zh:'ni hao',ar:'marhaba',tr:'merhaba'},
    'thank you':{es:'gracias',fr:'merci',de:'danke',it:'grazie',pt:'obrigado',ru:'spasibo',ja:'arigatou',zh:'xie xie',ar:'shukran',tr:'tesekkurler'},
    'goodbye':{es:'adios',fr:'au revoir',de:'auf wiedersehen',it:'arrivederci',pt:'adeus',ru:'do svidaniya',ja:'sayonara',zh:'zai jian',ar:'maa salama',tr:'gule gule'},
    'yes':{es:'si',fr:'oui',de:'ja',it:'si',pt:'sim',ru:'da',ja:'hai',zh:'shi',ar:'naam',tr:'evet'},
    'no':{es:'no',fr:'non',de:'nein',it:'no',pt:'nao',ru:'nyet',ja:'iie',zh:'bu',ar:'la',tr:'hayir'},
    'i love you':{es:'te quiero',fr:"je t'aime",de:'ich liebe dich',it:'ti amo',pt:'eu te amo',ru:'ya lyublyu tebya',ja:'aishiteru',zh:'wo ai ni',ar:'uhibbuka',tr:'seni seviyorum'}
  };
  function translateReq(text){
    // patterns: "how do you say X in Y", "como se dice X en Y", "translate X to Y"
    var t=norm(text);
    var m=t.match(/(?:how do you say|how to say|say)\s+(.+?)\s+in\s+(\w+)/);
    if(!m) m=t.match(/(?:como se dice|traduce)\s+(.+?)\s+(?:en|al|a)\s+(\w+)/);
    if(!m) m=t.match(/translate\s+(.+?)\s+(?:to|into)\s+(\w+)/);
    if(!m) return null;
    var phrase=m[1].trim(), lang=m[2].trim();
    var langMap={spanish:'es',english:'en',french:'fr',german:'de',italian:'it',portuguese:'pt',russian:'ru',japanese:'ja',chinese:'zh',arabic:'ar',turkish:'tr',espanol:'es',ingles:'en',frances:'fr',aleman:'de',italiano:'it',portugues:'pt',ruso:'ru',japones:'ja',chino:'zh',arabe:'ar',turco:'tr'};
    var code=langMap[lang]||lang;
    if(TRANS[phrase] && TRANS[phrase][code]) return '"'+phrase+'" → '+TRANS[phrase][code]+' ('+lang+')';
    // fallback for unknown phrase
    return "I know a limited set of phrases offline. Common ones: hello, thank you, goodbye, yes, no, i love you. Ask about one of those, or drop it into a translator for the full sentence.";
  }

  // Smart composer — when nothing else matches, don't return generic default. Try to build a real answer.
  function smartCompose(text,lang){
    var t=norm(text);
    // Yes/no questions → hedge honestly
    if(/^(is|are|do|does|can|will|should|es|son|puede|puedes|podria)\b/.test(t)){
      var ans={
        en:"Short answer: it depends on the specifics. Give me a bit more context (what game / what plan / what error / what you've tried) and I'll give you a real answer instead of a hedge.",
        es:"Respuesta corta: depende. Dame algo más de contexto (qué juego / qué plan / qué error / qué has probado) y te lo respondo en serio.",
        fr:"Réponse courte : ça dépend. Donne-moi un peu plus de contexte et je réponds sérieusement.",
        de:"Kurz: Kommt drauf an. Gib mir mehr Kontext und ich antworte richtig."
      };
      return ans[lang]||ans.en;
    }
    // definitions
    if(/^(what is|what's|que es|c'est quoi|was ist|cos'e|o que e)\b/.test(t)){
      var ans={
        en:"I don't have that specific term in my offline knowledge. Try rephrasing, or ask me about CHITIAN, Fortnite features, coding basics, math, dates, or general geography/science — those I've got.",
        es:"No tengo ese término concreto en mi base offline. Reformula, o pregúntame sobre CHITIAN, funciones de Fortnite, coding básico, mates, fechas, o geografía/ciencia general — eso lo manejo."
      };
      return ans[lang]||ans.en;
    }
    // how to
    if(/^(how|how to|como|comment|wie|come)\b/.test(t)){
      var ans={
        en:"Give me the specific thing you're trying to do — installing CHITIAN, paying, fixing an error, coding a snippet — and I'll walk you through step by step.",
        es:"Dime qué quieres hacer exactamente — instalar CHITIAN, pagar, arreglar un error, un fragmento de código — y te guío paso a paso."
      };
      return ans[lang]||ans.en;
    }
    return null;
  }

  // ============================================================
  // 10) MAIN RESOLVER
  // ============================================================
  function resolveIntent(text){
    // safety FIRST (hard override)
    var safetyScore=0;
    var lex=LEX.safety;
    var padded=' '+norm(text)+' ';
    for(var i=0;i<lex.length;i++){
      var w=lex[i].w;
      if(padded.indexOf(' '+w+' ')!==-1 || norm(text).indexOf(w)!==-1) safetyScore+=lex[i].s;
    }
    if(safetyScore>=10) return {intent:'safety',conf:1};

    var scores=scoreIntents(text);
    // pick best
    var best=null,bestS=0,second=0;
    for(var k in scores){
      if(k==='game') continue; // game is entity-ish, only if solo
      if(scores[k]>bestS){second=bestS;bestS=scores[k];best=k;}
      else if(scores[k]>second) second=scores[k];
    }
    // if game is the ONLY hit → treat as game question
    if(!best && scores.game) return {intent:'game',conf:0.7};
    // context boost
    var ctx=contextIntent(text);
    if(ctx && (!best || bestS<5)) return {intent:ctx,conf:0.6};
    if(!best){
      if(norm(text).length<4) return {intent:'short',conf:0.4};
      return {intent:'default',conf:0.2};
    }
    return {intent:best,conf:Math.min(1,bestS/10)};
  }

  // ============================================================
  // 11) UI GLUE
  // ============================================================
  var QR={
    en:['Pricing','Features','Setup','Payment','Key not received','Discord'],
    es:['Precios','Funciones','Instalacion','Pago','Key no recibida','Discord']
  };
  function qrFor(lang){return QR[lang]||QR[LANG_FALLBACK[lang]||'en'];}

  function addMsg(text,sender){
    var m=document.createElement('div');
    m.className='chat-msg '+sender;
    m.textContent=text;
    msgArea.appendChild(m);
    msgArea.scrollTop=msgArea.scrollHeight;
  }
  function addBotMsg(text){
    var m=document.createElement('div');
    m.className='chat-msg bot';
    msgArea.appendChild(m);
    msgArea.scrollTop=msgArea.scrollHeight;
    var i=0;
    var iv=setInterval(function(){
      if(i<text.length){m.textContent+=text[i];msgArea.scrollTop=msgArea.scrollHeight;i++;}
      else clearInterval(iv);
    },14);
  }
  function showTyping(){
    var t=document.createElement('div');
    t.className='chat-typing';t.id='typing-indicator';
    t.innerHTML='<span></span><span></span><span></span>';
    msgArea.appendChild(t);msgArea.scrollTop=msgArea.scrollHeight;
  }
  function removeTyping(){var t=document.getElementById('typing-indicator');if(t)t.remove();}
  function showQuickReplies(lang){
    var r=qrFor(lang);
    qr.innerHTML='';
    r.forEach(function(txt){
      var b=document.createElement('button');
      b.className='chat-quick-btn';b.textContent=txt;
      b.addEventListener('click',function(){handleUserInput(txt);});
      qr.appendChild(b);
    });
  }

  // =========================================================
  // LLM CALL — Cloudflare Worker → Groq (Llama 3.3 70B)
  // =========================================================
  function callLLM(userText){
    return new Promise(function(resolve,reject){
      if(!LLM_ENDPOINT || LLM_ENDPOINT.indexOf('YOUR-SUBDOMAIN')!==-1){
        return reject(new Error('endpoint not configured'));
      }
      llmMessages.push({role:'user',content:userText});
      if(llmMessages.length>12) llmMessages=llmMessages.slice(-12);

      var ctrl=(typeof AbortController!=='undefined')?new AbortController():null;
      var timer=setTimeout(function(){ if(ctrl) ctrl.abort(); reject(new Error('timeout')); }, LLM_TIMEOUT_MS);

      fetch(LLM_ENDPOINT,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({messages:llmMessages}),
        signal:ctrl?ctrl.signal:undefined
      }).then(function(r){
        clearTimeout(timer);
        if(!r.ok) return reject(new Error('http '+r.status));
        return r.json();
      }).then(function(data){
        if(!data||!data.reply) return reject(new Error('no reply'));
        llmMessages.push({role:'assistant',content:data.reply});
        if(llmMessages.length>12) llmMessages=llmMessages.slice(-12);
        resolve(data.reply);
      }).catch(function(e){
        clearTimeout(timer);
        reject(e);
      });
    });
  }

  function handleUserInput(text){
    if(!text.trim())return;
    addMsg(text,'user');
    input.value='';qr.innerHTML='';
    showTyping();

    var lang=detectLang(text);
    var ent=extractEntities(text);
    if(ent.name) state.userName=ent.name;
    if(ent.game) state.mentionedGame=ent.game;
    if(ent.plan) state.mentionedPlan=ent.plan;
    var mergedEnt={
      name:state.userName,
      game:ent.game||state.mentionedGame,
      plan:ent.plan||state.mentionedPlan
    };

    var res=resolveIntent(text);
    var intent=res.intent;
    state.history.push({text:text,lang:lang,intent:intent,conf:res.conf});
    if(state.history.length>12) state.history.shift();
    state.lastIntent=intent;
    state.lastLang=lang;
    state.turns++;

    function finish(response){
      var delay=200+Math.random()*400;
      if(response.length>140) delay+=200;
      setTimeout(function(){
        removeTyping();
        addBotMsg(response);
        setTimeout(function(){showQuickReplies(lang);},250);
      },delay);
    }

    function localFallback(){
      var response=null;
      var m=safeMath(text);
      if(m){ response = m.expr.replace(/\*\*/g,'^') + ' = ' + m.result; }
      if(!response) response = timeAnswer(text,lang);
      if(!response) response = translateReq(text);
      if(!response) response = generalKnowledge(text);
      if(!response) response = codingAnswer(text);
      if(!response) response = smallTalk(text,lang);
      if(!response){
        if(res.conf>=0.4 && intent!=='default' && intent!=='short'){
          response = respondFor(lang,intent,mergedEnt);
        } else {
          response = smartCompose(text,lang) || respondFor(lang,intent,mergedEnt);
        }
      }
      return response;
    }

    // Try the LLM first. Fall back to local engine if it fails or times out.
    callLLM(text).then(function(reply){
      finish(reply);
    }).catch(function(){
      finish(localFallback());
    });
  }

  bubble.addEventListener('click',function(){
    state.open=!state.open;
    win.classList.toggle('open',state.open);
    bubble.classList.toggle('open',state.open);
    if(notif) notif.style.display='none';
    if(state.open&&!state.greeted){
      state.greeted=true;showTyping();
      setTimeout(function(){
        removeTyping();
        addBotMsg(respondFor('en','greeting',{}));
        showQuickReplies('en');
      },900);
    }
  });

  if(closeBtn) closeBtn.addEventListener('click',function(){
    state.open=false;
    win.classList.remove('open');
    bubble.classList.remove('open');
  });
  if(sendBtn) sendBtn.addEventListener('click',function(){handleUserInput(input.value);});
  input.addEventListener('keydown',function(e){
    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleUserInput(input.value);}
  });

  setTimeout(function(){
    if(!state.open && notif){notif.style.display='flex';notif.textContent='1';}
  },5000);
})();
