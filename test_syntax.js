
(function(){
"use strict";

// ============ DATA ============
const PRODUCTS = [
  {id:'day',name:'Day Pass',price:4.49,period:'1 Day',features:['Full access to all features','Aimbot + ESP','Instant delivery','24 hour support'],btn:'Get Day Pass'},
  {id:'week',name:'Weekly',price:11.99,period:'7 Days',features:['Full access to all features','Aimbot + ESP + Misc','Priority support','HWID spoofer'],btn:'Get Weekly'},
  {id:'month',name:'Monthly',price:29.99,period:'30 Days',features:['Full access to all features','All cheats included','24/7 priority support','HWID spoofer + Updates','Free future updates'],btn:'Get Monthly',featured:true}
];

const FEATURES = [
  {icon:'&#9876;',title:'Aimbot',desc:'Pixel-perfect aiming assistance with customizable FOV, smoothing, and bone targeting.'},
  {icon:'&#128065;',title:'ESP / Wallhack',desc:'See enemies through walls with health bars, distance, weapons, and more.'},
  {icon:'&#9889;',title:'Triggerbot',desc:'Auto-fire when crosshair is on enemy. Configurable reaction time.'},
  {icon:'&#128736;',title:'HWID Spoofer',desc:'Built-in hardware ID spoofer to stay undetected on any system.'},
  {icon:'&#128274;',title:'Anti-Detect',desc:'Advanced bypass for EasyAntiCheat, BattlEye, and custom anti-cheats.'},
  {icon:'&#128640;',title:'Instant Delivery',desc:'Receive your license key instantly after payment. Start cheating in minutes.'},
  {icon:'&#128737;',title:'Recoil Control',desc:'Automatic recoil compensation for laser-like precision on every weapon.'},
  {icon:'&#127918;',title:'Stream Proof',desc:'Undetectable on stream. Your audience won\'t see anything suspicious.'},
  {icon:'&#128295;',title:'Config System',desc:'Save and load custom configs. Share configs with friends.'},
  {icon:'&#128165;',title:'Spinbot',desc:'Auto-spin to dodge headshots and make yourself a harder target to hit.'}
];

const REVIEWS = [
  {stars:5,text:'Best cheat I\'ve ever used. Undetected for months, insane aimbot.',author:'xShadowFN'},
  {stars:5,text:'Got banned on other cheats, this one is still working. Worth every penny.',author:'ProBuilder420'},
  {stars:5,text:'The ESP is insane. Won every single game since I started using it.',author:'TTV_Viper'},
  {stars:4,text:'Good overall, occasional crash on update day but support fixed it quickly.',author:'BuildKing99'},
  {stars:5,text:'HWID spoofer saved me. Was banned on hardware level, now I\'m back.',author:'CrankGod'},
  {stars:5,text:'Support team is goated. Responded in 2 minutes and helped me set up.',author:'NoobSlayer'}
];

const FAQ_DATA = [
  {q:'Is this undetected?',a:'Yes. Our cheats are constantly updated to bypass the latest anti-cheat systems including EasyAntiCheat and BattlEye.'},
  {q:'How fast is delivery?',a:'License keys are delivered instantly after payment confirmation. You can start using it within minutes.'},
  {q:'What payment methods do you accept?',a:'We accept Credit/Debit cards (Visa, Mastercard, Amex), Bitcoin, Ethereum, USDT, and PayPal.'},
  {q:'Do you offer refunds?',a:'Due to the digital nature of our product, refunds are offered within 24 hours if the product is not working as intended.'},
  {q:'Is the HWID spoofer included?',a:'Yes, the HWID spoofer is included with all plans. It will protect your hardware ID from being banned.'},
  {q:'How do I set it up?',a:'After purchase, you receive a license key. Download our launcher, enter the key, configure your settings, and inject.'}
];

const DISCORD_MEMBERS = [
  {name:'CHITIAN Staff',status:'on'},{name:'xShadowFN',status:'on'},{name:'ProBuilder420',status:'on'},
  {name:'TTV_Viper',status:'on'},{name:'BuildKing99',status:'off'},{name:'CrankGod',status:'on'},
  {name:'NoobSlayer',status:'off'},{name:'LootGoblin',status:'on'},{name:'SweatLord',status:'on'},
  {name:'DefaultSkin',status:'off'},{name:'RustLord',status:'on'},{name:'BushCamper',status:'on'}
];

const TICKER_MSGS = [
  'UNDETECTED SINCE LAUNCH','INSTANT LICENSE DELIVERY',
  '24/7 SUPPORT ON DISCORD','OVER 12,000 ACTIVE USERS','FREE UPDATES INCLUDED','JOIN DISCORD.GG/8E8DWmxEV'
];

const BOOT_LINES = [
  '> Initializing CHITIAN kernel...',
  '> Loading anti-detect modules... OK',
  '> Bypassing EasyAntiCheat... OK',
  '> Bypassing BattlEye... OK',
  '> Loading aimbot engine... OK',
  '> Loading ESP renderer... OK',
  '> Loading HWID spoofer... OK',
  '> Verifying system integrity... OK',
  '> Establishing secure tunnel... OK',
  '> All systems operational.',
  '> Welcome to CHITIAN.'
];

const FLOATING_CODES = [
  'if(eac.running){bypass.init()}','const aimbot = new Aimbot(fov:120)',
  'esp.render(enemies)','memory.write(0x7FF8,0x9090)',
  'hook.detour(fnAimAssist)','setProcessAffinity(0x01)',
  'virtualAlloc(0x10000,PROTECT)','CreateRemoteThread(hProc)',
  'bypass.eac_scan()','aimbot.smooth=0.85','esp.box=true',
  'config.save("pro.cfg")','recoil补偿=0.0','triggerbot.delay=50ms'
];

const CRYPTO_ADDRS = {
  btc:'1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  eth:'0x742d35Cc6634C0532925a3b844Bc9e7595f2bD78',
  usdt:'TN5w3o1xJHzmTt7yKt2o3V4Lz6N8pQrSs'
};

// ============ STATE ============
let state = {
  plan: PRODUCTS[2],
  step: 1,
  method: 'card',
  cryptoCoin: 'btc',
  cryptoTimer: null,
  cryptoTime: 900,
  bootDone: false,
  verifyCode: '',
  verifyEmail: '',
  codeTimer: null,
  codeTime: 120
};

// ============ DOM READY ============
document.addEventListener('DOMContentLoaded', ()=>{ boot(); initAll(); });

// ============ BOOT ============
function boot(){
  const bootEl = document.getElementById('boot');
  const textEl = document.getElementById('boot-text');
  const fillEl = document.getElementById('boot-fill');
  let i = 0;
  const iv = setInterval(()=>{
    if(i < BOOT_LINES.length){
      textEl.textContent += BOOT_LINES[i] + '\n';
      fillEl.style.width = ((i+1)/BOOT_LINES.length*100) + '%';
      i++;
    } else {
      clearInterval(iv);
      setTimeout(()=>{ bootEl.classList.add('hidden'); state.bootDone = true; },600);
    }
  }, 350);
}

// ============ INIT ALL ============
function initAll(){
  initTicker();
  renderProducts();
  renderFeatures();
  renderReviews();
  renderFAQ();
  renderDiscordMembers();
  initNav();
  initScrollProgress();
  initLetterEntrance();
  initTextScramble();
  initFloatingCode();
  initCursorTrail();
  initParticleCanvas();
  initMatrixRain();
  initCounters();
  initFAQ();
  initCheckout();
  initGameDetailModal();
  initDiscordCounters();
}

// ============ TICKER ============
function initTicker(){
  const t = document.getElementById('ticker');
  const msgs = [...TICKER_MSGS, ...TICKER_MSGS];
  t.innerHTML = msgs.map(m=>'<div class="ticker-item">'+m+'</div>').join('');
}

// ============ RENDER PRODUCTS ============
function renderProducts(){
  const g = document.getElementById('products-grid');
  g.innerHTML = PRODUCTS.map(p=>`
    <div class="product-card ${p.featured?'featured':''}" data-id="${p.id}">
      <div class="product-name">${p.name}</div>
      <div class="product-price">$${p.price}</div>
      <div class="product-period">${p.period}</div>
      <ul class="product-features">${p.features.map(f=>'<li>'+f+'</li>').join('')}</ul>
      <button class="product-btn buy" data-plan="${p.id}">${p.btn}</button>
    </div>
  `).join('');
  g.querySelectorAll('.product-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.stopPropagation();
      const pid = btn.dataset.plan;
      selectPlan(pid);
      openCheckout();
    });
  });
  g.querySelectorAll('.product-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const pid = card.dataset.id;
      selectPlan(pid);
      openCheckout();
    });
  });
}

function selectPlan(id){
  state.plan = PRODUCTS.find(p=>p.id===id);
  updateCheckoutTotals();
}

// ============ RENDER FEATURES ============
function renderFeatures(){
  const g = document.getElementById('features-grid');
  g.innerHTML = FEATURES.map(f=>`
    <div class="feature-card">
      <div class="feature-icon">${f.icon}</div>
      <h3>${f.title}</h3>
      <p>${f.desc}</p>
    </div>
  `).join('');
}

// ============ RENDER REVIEWS ============
function renderReviews(){
  const g = document.getElementById('reviews-grid');
  g.innerHTML = REVIEWS.map(r=>`
    <div class="review-card">
      <div class="review-stars">${'&#9733;'.repeat(r.stars)}${'&#9734;'.repeat(5-r.stars)}</div>
      <div class="review-text">"${r.text}"</div>
      <div class="review-author">- ${r.author}</div>
    </div>
  `).join('');
}

// ============ RENDER FAQ ============
function renderFAQ(){
  const g = document.getElementById('faq-list');
  g.innerHTML = FAQ_DATA.map((f,i)=>`
    <div class="faq-item" data-i="${i}">
      <div class="faq-q">${f.q}<span class="arrow">&#9660;</span></div>
      <div class="faq-a"><p>${f.a}</p></div>
    </div>
  `).join('');
}

function initFAQ(){
  document.querySelectorAll('.faq-q').forEach(q=>{
    q.addEventListener('click',()=>{
      const item = q.parentElement;
      item.classList.toggle('open');
    });
  });
}

// ============ GAME DETAIL MODAL ============
function openGameDetail(){
  const modal = document.getElementById('game-detail-modal');
  const plans = document.getElementById('game-detail-plans');
  plans.innerHTML = PRODUCTS.map(p=>`
    <div style="background-color:var(--bg2);border:1px solid ${p.featured?'var(--red)':'var(--border)'};border-radius:12px;padding:20px;display:flex;flex-direction:column;gap:12px;position:relative;${p.featured?'box-shadow:0 0 30px rgba(255,43,58,.15)':''}">
      ${p.featured?'<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:var(--red);color:#fff;font-size:10px;font-weight:700;padding:3px 12px;border-radius:20px">MAS POPULAR</div>':''}
      <div style="font-size:16px;font-weight:700;color:var(--text)">${p.name}</div>
      <div style="font-size:32px;font-weight:900;color:var(--red)">$${p.price}<span style="font-size:13px;color:var(--text-muted);font-weight:400">/${p.period}</span></div>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;flex:1">${p.features.map(f=>'<li style="color:var(--text-dim);font-size:13px;display:flex;align-items:center;gap:8px"><span style="color:var(--green);font-weight:700">✓</span> '+f+'</li>').join('')}</ul>
      <button onclick="selectPlan('${p.id}');openCheckout();document.getElementById('game-detail-modal').classList.remove('active')" style="width:100%;padding:12px;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:none;background:${p.featured?'var(--red)':'var(--bg)'};color:${p.featured?'#fff':'var(--text)'};border:1px solid ${p.featured?'var(--red)':'var(--border)'};transition:transform .2s,box-shadow .2s" onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 20px rgba(255,43,58,.3)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">${p.btn}</button>
    </div>
  `).join('');
  modal.classList.add('active');
}

function initGameDetailModal(){
  const modal = document.getElementById('game-detail-modal');
  const closeBtn = document.getElementById('game-detail-close');
  closeBtn.addEventListener('click',()=>modal.classList.remove('active'));
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('active');});
}

// ============ RENDER DISCORD ============
function renderDiscordMembers(){
  const list = document.getElementById('discord-members-list');
  list.innerHTML = DISCORD_MEMBERS.map(m=>`
    <li><span class="dot ${m.status==='on'?'on':'off'}"></span>${m.name}</li>
  `).join('');
}

// ============ DISCORD COUNTERS ============
function initDiscordCounters(){
  setTimeout(()=>{
    document.getElementById('d-members').textContent = '14,293';
    document.getElementById('d-online').textContent = '3,847';
    document.getElementById('discord-status').textContent = '3,847 Online';
  }, 2000);
}

// ============ NAV ============
function initNav(){
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('mobile-toggle');
  const links = document.getElementById('nav-links');
  window.addEventListener('scroll',()=>{
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
  toggle.addEventListener('click',()=>links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
}

// ============ SCROLL PROGRESS ============
function initScrollProgress(){
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll',()=>{
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  });
}

// ============ LETTER ENTRANCE ============
function initLetterEntrance(){
  const letters = document.querySelectorAll('.hero h1 .letter');
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const els = entry.target.querySelectorAll ? [entry.target] : [];
        letters.forEach((l,i)=>{
          setTimeout(()=>l.classList.add('visible'), i*80);
          setTimeout(()=>l.classList.add(l.dataset.anim), i*80+600);
        });
        observer.disconnect();
      }
    });
  },{threshold:0.3});
  const h1 = document.querySelector('.hero h1');
  if(h1) observer.observe(h1);
}

// ============ TEXT SCRAMBLE ON SCROLL ============
function initTextScramble(){
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?01';
  function scramble(el){
    const orig = el.dataset.orig || el.textContent;
    el.dataset.orig = orig;
    let iterations = 0;
    const maxIter = orig.length;
    const iv = setInterval(()=>{
      el.textContent = orig.split('').map((c,i)=>{
        if(i < iterations) return c;
        return c === ' ' ? ' ' : chars[Math.floor(Math.random()*chars.length)];
      }).join('');
      iterations++;
      if(iterations > maxIter) clearInterval(iv);
    }, 30);
  }
  const targets = document.querySelectorAll('.section-title');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ scramble(e.target); obs.unobserve(e.target); }
    });
  },{threshold:0.5});
  targets.forEach(t=>obs.observe(t));
}

// ============ FLOATING CODE ============
function initFloatingCode(){
  function spawn(){
    const el = document.createElement('div');
    el.className = 'floating-code';
    el.textContent = FLOATING_CODES[Math.floor(Math.random()*FLOATING_CODES.length)];
    el.style.left = Math.random()*100 + '%';
    el.style.animationDuration = (6+Math.random()*6) + 's';
    document.body.appendChild(el);
    el.addEventListener('animationend',()=>el.remove());
  }
  setInterval(spawn, 2500);
  for(let i=0;i<3;i++) setTimeout(spawn, i*800);
}

// ============ CURSOR TRAIL ============
function initCursorTrail(){
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove',e=>{
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx-4+'px';
    dot.style.top = my-4+'px';
  });
  function animateRing(){
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx-18+'px';
    ring.style.top = ry-18+'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
  document.querySelectorAll('a, button, .product-card, .faq-q').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ring.style.transform='scale(1.5)';ring.style.borderColor='var(--green)';});
    el.addEventListener('mouseleave',()=>{ring.style.transform='scale(1)';ring.style.borderColor='var(--red)';});
  });
}

// ============ PARTICLE CANVAS ============
function initParticleCanvas(){
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  resize(); window.addEventListener('resize',resize);
  class Particle {
    constructor(){this.reset();}
    reset(){
      this.x=Math.random()*canvas.width;
      this.y=Math.random()*canvas.height;
      this.vx=(Math.random()-.5)*.3;
      this.vy=(Math.random()-.5)*.3;
      this.size=Math.random()*2+.5;
      this.alpha=Math.random()*.3+.1;
      this.color = Math.random()>.5 ? '255,43,58' : '182,255,60';
    }
    update(){
      this.x+=this.vx;this.y+=this.vy;
      if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height)this.reset();
    }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
      ctx.fillStyle=`rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }
  for(let i=0;i<60;i++)particles.push(new Particle());
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{p.update();p.draw();});
    requestAnimationFrame(loop);
  }
  loop();
}

// ============ MATRIX RAIN ============
function initMatrixRain(){
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  resize(); window.addEventListener('resize',resize);
  const cols = Math.floor(canvas.width/14);
  const drops = new Array(cols).fill(1);
  const chars = '01アイウエオカキクケコサシスセソタチツテト';
  function draw(){
    ctx.fillStyle='rgba(5,6,10,0.05)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='rgba(255,43,58,0.08)';
    ctx.font='12px monospace';
    for(let i=0;i<drops.length;i++){
      const ch = chars[Math.floor(Math.random()*chars.length)];
      ctx.fillText(ch,i*14,drops[i]*14);
      if(drops[i]*14>canvas.height&&Math.random()>.975)drops[i]=0;
      drops[i]++;
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ============ COUNTERS ============
function initCounters(){
  const nums = document.querySelectorAll('.hero-stat .num');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target;
        const target = parseInt(el.dataset.target);
        let current = 0;
        const step = Math.ceil(target / 60);
        const iv = setInterval(()=>{
          current += step;
          if(current >= target){current=target;clearInterval(iv);}
          el.textContent = current.toLocaleString();
        },30);
        obs.unobserve(el);
      }
    });
  },{threshold:0.5});
  nums.forEach(n=>obs.observe(n));
}

// ============ CHECKOUT ============
const GOOGLE_CLIENT_ID = '1027855357412-ikbc0foce867u0gol327s9ol0h2migik.apps.googleusercontent.com';
const SOCIAL_PROVIDERS = {
  github: {name:'GitHub',color:'#8b5cf6',users:['dev_nyx','root@chitian','cheatengineer','nullbyte_dev']},
  discord: {name:'Discord',color:'#5865F2',users:['xShadowFN#0001','ProBuilder420','TTV_Viper','CrankGod']}
};

function initGoogleAuth(){
  if(typeof google==='undefined'||!google.accounts){
    setTimeout(initGoogleAuth,200);
    return;
  }
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
    auto_select: false,
    cancel_on_tap_outside: true
  });
  google.accounts.id.renderButton(
    document.getElementById('google-signin-btn'),
    {theme:'outline',size:'large',text:'continue_with',width:'100%',shape:'rectangular',logo_alignment:'left'}
  );
}

function handleGoogleCredential(response){
  const overlay = document.getElementById('google-loading-overlay');
  overlay.style.display='block';
  setTimeout(()=>{
    try{
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      document.getElementById('social-avatar').innerHTML='<img src="'+payload.picture+'" style="width:100%;height:100%;border-radius:50%;object-fit:cover">';
      document.getElementById('social-username').textContent=payload.name+' ('+payload.email+')';
      document.getElementById('verify-identity-view').style.display='none';
      document.getElementById('verify-success-view').style.display='';
      overlay.style.display='none';
      showToast('Signed in with Google!','success');
    }catch(e){
      overlay.style.display='none';
      showToast('Google login failed. Try again.','error');
    }
  },1200);
}

function initCheckout(){
  const modal = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('modal-close');
  closeBtn.addEventListener('click',()=>{modal.classList.remove('active');clearCodeTimer();});
  modal.addEventListener('click',e=>{if(e.target===modal){modal.classList.remove('active');clearCodeTimer();}});

  // Step 1
  document.getElementById('step1-next').addEventListener('click',()=>goStep(2));

  // Step 2 - Google (real OAuth)
  initGoogleAuth();

  // Step 2 - Social logins (simulated)
  document.getElementById('login-github').addEventListener('click',()=>socialLogin('github'));
  document.getElementById('login-discord').addEventListener('click',()=>socialLogin('discord'));
  document.getElementById('social-continue-btn').addEventListener('click',()=>goStep(3));
  document.getElementById('social-back-btn').addEventListener('click',()=>{
    document.getElementById('verify-success-view').style.display='none';
    document.getElementById('verify-identity-view').style.display='';
    document.querySelectorAll('.social-btn').forEach(b=>{b.classList.remove('loading');});
  });

  // Step 2 - Email fallback
  document.getElementById('send-code-btn').addEventListener('click',sendVerifyCode);
  document.getElementById('verify-code-btn').addEventListener('click',verifyCode);
  document.getElementById('verify-back-btn').addEventListener('click',()=>{
    document.getElementById('verify-code-view').style.display='none';
    document.getElementById('verify-identity-view').style.display='';
  });
  document.getElementById('resend-code-btn').addEventListener('click',sendVerifyCode);
  initCodeInputs();

  // Step 3
  document.getElementById('step3-back').addEventListener('click',()=>goStep(2));

  // Payment tabs
  document.querySelectorAll('.pay-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.pay-tab').forEach(t=>t.classList.remove('active'));
      tab.classList.add('active');
      state.method = tab.dataset.method;
      document.querySelectorAll('.pay-method').forEach(m=>{
        m.style.display = m.dataset.method===state.method ? 'block' : 'none';
      });
      if(state.method==='crypto') startCryptoTimer();
    });
  });

  // Card inputs
  document.getElementById('card-number').addEventListener('input',onCardNumberInput);
  document.getElementById('card-name').addEventListener('input',onCardNameInput);
  document.getElementById('card-expiry').addEventListener('input',onCardExpiryInput);
  document.getElementById('card-cvc').addEventListener('input',onCardCvcInput);

  // Card pay
  document.getElementById('pay-card-btn').addEventListener('click',()=>{
    if(validateCard()) processPayment();
  });

  // Crypto coins
  document.querySelectorAll('.crypto-coin').forEach(c=>{
    c.addEventListener('click',()=>{
      document.querySelectorAll('.crypto-coin').forEach(x=>x.classList.remove('active'));
      c.classList.add('active');
      state.cryptoCoin = c.dataset.coin;
      updateCryptoAddress();
    });
  });

  // Copy address
  document.getElementById('copy-addr-btn').addEventListener('click',()=>{
    navigator.clipboard.writeText(CRYPTO_ADDRS[state.cryptoCoin]).then(()=>showToast('Address copied!','success'));
  });

  // PayPal
  document.getElementById('paypal-btn').addEventListener('click',()=>processPayment());

  // Success
  document.getElementById('copy-license-btn').addEventListener('click',()=>{
    navigator.clipboard.writeText(document.getElementById('license-key').textContent).then(()=>showToast('License key copied!','success'));
  });
  document.getElementById('success-done').addEventListener('click',()=>{
    document.getElementById('checkout-modal').classList.remove('active');
    resetCheckout();
  });
}

function socialLogin(provider){
  const btn = document.getElementById('login-'+provider);
  if(btn.classList.contains('loading')) return;
  btn.classList.add('loading');

  setTimeout(()=>{
    const users = SOCIAL_PROVIDERS[provider].users;
    const user = users[Math.floor(Math.random()*users.length)];
    const avatarEmoji = provider==='google'?'📧':provider==='github'?'💻':'🎮';

    document.getElementById('social-avatar').textContent = avatarEmoji;
    document.getElementById('social-username').textContent = user;
    document.getElementById('verify-identity-view').style.display='none';
    document.getElementById('verify-success-view').style.display='';
    btn.classList.remove('loading');
    showToast('Signed in with '+SOCIAL_PROVIDERS[provider].name+'!','success');
  },1500+Math.random()*1000);
}

function openCheckout(){
  state.step = 1;
  updateCheckoutTotals();
  document.getElementById('checkout-modal').classList.add('active');
  goStep(1);
}

function resetCheckout(){
  state.step = 1;
  state.verifyCode = '';
  state.verifyEmail = '';
  if(state.codeTimer) clearInterval(state.codeTimer);
  document.getElementById('acc-email').value = '';
  document.getElementById('acc-email-error').textContent = '';
  document.getElementById('verify-identity-view').style.display='';
  document.getElementById('verify-code-view').style.display='none';
  document.getElementById('verify-success-view').style.display='none';
  document.getElementById('google-loading-overlay').style.display='none';
  document.getElementById('code-error').textContent = '';
  document.querySelectorAll('.code-digit').forEach(d=>{d.value='';d.classList.remove('filled');});
  document.querySelectorAll('.social-btn').forEach(b=>b.classList.remove('loading'));
  document.getElementById('card-number').value = '';
  document.getElementById('card-name').value = '';
  document.getElementById('card-expiry').value = '';
  document.getElementById('card-cvc').value = '';
  document.getElementById('card-number-display').textContent = '**** **** **** ****';
  document.getElementById('card-holder-display').textContent = 'FULL NAME';
  document.getElementById('card-expiry-display').textContent = 'MM/YY';
  document.getElementById('card-brand').textContent = 'VISA';
  document.getElementById('processing-view').style.display = 'block';
  document.getElementById('success-view').style.display = 'none';
  document.getElementById('processing-log').innerHTML = '';
  if(state.cryptoTimer) clearInterval(state.cryptoTimer);
}

function updateCheckoutTotals(){
  const plan = state.plan;
  document.getElementById('checkout-plan-label').textContent = plan.name + ' - $' + plan.price;
  document.getElementById('checkout-total').textContent = '$' + plan.price;
  document.getElementById('pay-card-amount').textContent = '$' + plan.price;
  document.getElementById('paypal-amount').textContent = '$' + plan.price;
  document.getElementById('plan-summary-name').textContent = plan.name;
  document.getElementById('plan-summary-price').textContent = '$' + plan.price;
}

// ============ EMAIL VERIFICATION ============
function generateCode(){
  let code = '';
  for(let i=0;i<6;i++) code += Math.floor(Math.random()*10);
  return code;
}

function sendVerifyCode(){
  const email = document.getElementById('acc-email').value.trim();
  const err = document.getElementById('acc-email-error');
  err.textContent = '';

  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    err.textContent = 'Please enter a valid email address';
    return;
  }

  state.verifyCode = generateCode();
  state.verifyEmail = email;

  document.getElementById('verify-email-display').textContent = email;
  document.getElementById('verify-identity-view').style.display = 'none';
  document.getElementById('verify-code-view').style.display = '';
  document.getElementById('code-error').textContent = '';
  document.querySelectorAll('.code-digit').forEach(d=>{d.value='';d.classList.remove('filled');});
  document.querySelector('.code-digit[data-idx="0"]').focus();

  showToast('Verification code sent!','success');
  startCodeTimer();
}

function startCodeTimer(){
  state.codeTime = 120;
  if(state.codeTimer) clearInterval(state.codeTimer);
  const el = document.getElementById('code-countdown');
  state.codeTimer = setInterval(()=>{
    state.codeTime--;
    if(state.codeTime<=0){clearInterval(state.codeTimer);el.textContent='00:00';return;}
    const m = Math.floor(state.codeTime/60);
    const s = state.codeTime%60;
    el.textContent = String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  },1000);
}

function clearCodeTimer(){
  if(state.codeTimer) clearInterval(state.codeTimer);
}

function initCodeInputs(){
  const digits = document.querySelectorAll('.code-digit');
  digits.forEach((d,i)=>{
    d.addEventListener('input',e=>{
      const v = e.target.value.replace(/\D/g,'');
      e.target.value = v;
      if(v && i<5) digits[i+1].focus();
      updateCodeDigitState();
    });
    d.addEventListener('keydown',e=>{
      if(e.key==='Backspace' && !d.value && i>0){
        digits[i-1].focus();
        digits[i-1].value = '';
      }
    });
    d.addEventListener('paste',e=>{
      e.preventDefault();
      const pasted = (e.clipboardData||window.clipboardData).getData('text').replace(/\D/g,'').slice(0,6);
      pasted.split('').forEach((ch,j)=>{
        if(digits[j]) digits[j].value = ch;
      });
      if(pasted.length>0) digits[Math.min(pasted.length,5)].focus();
      updateCodeDigitState();
    });
  });
}

function updateCodeDigitState(){
  document.querySelectorAll('.code-digit').forEach(d=>{
    d.classList.toggle('filled', d.value.length>0);
  });
}

function getCodeValue(){
  return Array.from(document.querySelectorAll('.code-digit')).map(d=>d.value).join('');
}

function verifyCode(){
  const entered = getCodeValue();
  const err = document.getElementById('code-error');
  err.textContent = '';

  if(entered.length!==6){
    err.textContent = 'Please enter the full 6-digit code';
    return;
  }
  if(entered !== state.verifyCode){
    err.textContent = 'Invalid code. Please try again.';
    document.querySelectorAll('.code-digit').forEach(d=>{d.value='';d.classList.remove('filled');});
    document.querySelector('.code-digit[data-idx="0"]').focus();
    return;
  }

  clearCodeTimer();
  showToast('Email verified!','success');
  goStep(3);
}

function goStep(n){
  state.step = n;
  document.querySelectorAll('.step-content').forEach(s=>s.classList.remove('active'));
  const target = document.querySelector(`.step-content[data-step="${n}"]`);
  if(target) target.classList.add('active');

  document.querySelectorAll('.step').forEach(s=>{
    const sn = parseInt(s.dataset.step);
    s.classList.remove('active','done');
    if(sn===n) s.classList.add('active');
    else if(sn<n) s.classList.add('done');
  });
  document.querySelectorAll('.step-line').forEach((l,i)=>{
    l.classList.toggle('done', i < n-1);
  });

  if(n===3 && state.method==='crypto') startCryptoTimer();
}

// ============ CARD INPUTS ============
function detectCardBrand(num){
  const n = num.replace(/\s/g,'');
  if(/^4/.test(n)) return 'VISA';
  if(/^5[1-5]/.test(n)) return 'MASTERCARD';
  if(/^3[47]/.test(n)) return 'AMEX';
  if(/^6(?:011|5)/.test(n)) return 'DISCOVER';
  return '';
}

function formatCardNumber(val){
  const n = val.replace(/\D/g,'');
  const brand = detectCardBrand(n);
  const max = brand==='AMEX' ? 15 : 16;
  const truncated = n.slice(0,max);
  if(brand==='AMEX'){
    return truncated.replace(/(\d{4})(\d{6})(\d{5})/,'$1 $2 $3').replace(/\s+$/,'');
  }
  return truncated.replace(/(\d{4})/g,'$1 ').trim();
}

function onCardNumberInput(e){
  const formatted = formatCardNumber(e.target.value);
  e.target.value = formatted;
  const display = formatted || '**** **** **** ****';
  document.getElementById('card-number-display').textContent = display;
  const brand = detectCardBrand(formatted);
  document.getElementById('card-brand').textContent = brand || 'CARD';
}

function onCardNameInput(e){
  document.getElementById('card-holder-display').textContent = e.target.value.toUpperCase() || 'FULL NAME';
}

function onCardExpiryInput(e){
  let v = e.target.value.replace(/\D/g,'');
  if(v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2,4);
  e.target.value = v;
  document.getElementById('card-expiry-display').textContent = v || 'MM/YY';
}

function onCardCvcInput(e){
  e.target.value = e.target.value.replace(/\D/g,'');
}

// ============ LUHN ============
function luhn(num){
  const digits = num.replace(/\D/g,'').split('').reverse().map(Number);
  let sum = 0;
  for(let i=0;i<digits.length;i++){
    let d = digits[i];
    if(i%2===1){d*=2;if(d>9)d-=9;}
    sum+=d;
  }
  return sum%10===0;
}

// ============ VALIDATIONS ============

function validateCard(){
  let ok = true;
  const num = document.getElementById('card-number').value.replace(/\s/g,'');
  const exp = document.getElementById('card-expiry').value;
  const cvc = document.getElementById('card-cvc').value;
  document.getElementById('card-number-error').textContent = '';
  document.getElementById('card-expiry-error').textContent = '';
  document.getElementById('card-cvc-error').textContent = '';

  const brand = detectCardBrand(num);
  const expectedLen = brand==='AMEX' ? 15 : 16;
  if(num.length !== expectedLen || !luhn(num)){
    document.getElementById('card-number-error').textContent = 'Invalid card number';
    ok = false;
  }
  if(!/^\d{2}\/\d{2}$/.test(exp)){
    document.getElementById('card-expiry-error').textContent = 'Invalid expiry (MM/YY)';
    ok = false;
  } else {
    const [mm,yy] = exp.split('/').map(Number);
    if(mm<1||mm>12){document.getElementById('card-expiry-error').textContent='Invalid month';ok=false;}
    const now = new Date();
    const expDate = new Date(2000+yy, mm);
    if(expDate < now){document.getElementById('card-expiry-error').textContent='Card expired';ok=false;}
  }
  if(cvc.length < 3){
    document.getElementById('card-cvc-error').textContent = 'Invalid CVC';
    ok = false;
  }
  return ok;
}

// ============ CRYPTO ============
function updateCryptoAddress(){
  document.getElementById('crypto-address').textContent = CRYPTO_ADDRS[state.cryptoCoin];
  generateQR(CRYPTO_ADDRS[state.cryptoCoin]);
}

function generateQR(text){
  const canvas = document.getElementById('qr-canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const size = 12;
  const modules = Math.ceil(Math.sqrt(text.length*4));
  const totalSize = Math.min(modules*size, canvas.width-16);
  const offset = (canvas.width - totalSize)/2;
  ctx.fillStyle='#000';
  // Generate a deterministic QR-like pattern from the text
  const hash = simpleHash(text);
  for(let r=0;r<Math.floor(totalSize/size);r++){
    for(let c=0;c<Math.floor(totalSize/size);c++){
      const idx = r*Math.floor(totalSize/size)+c;
      // Always draw finder patterns in corners
      const inCorner = (r<7&&c<7)||(r<7&&c>=Math.floor(totalSize/size)-7)||(r>=Math.floor(totalSize/size)-7&&c<7);
      if(inCorner||(hash[idx%hash.length]%3===0)){
        ctx.fillRect(offset+c*size,offset+r*size,size-1,size-1);
      }
    }
  }
}

function simpleHash(str){
  const arr = [];
  for(let i=0;i<256;i++){
    let h = 0;
    for(let j=0;j<str.length;j++){
      h = ((h<<5)-h)+str.charCodeAt(j);
      h|=0;
    }
    arr.push(Math.abs(h+i));
  }
  return arr;
}

function startCryptoTimer(){
  updateCryptoAddress();
  state.cryptoTime = 900;
  if(state.cryptoTimer) clearInterval(state.cryptoTimer);
  const timerEl = document.getElementById('crypto-countdown');
  state.cryptoTimer = setInterval(()=>{
    state.cryptoTime--;
    if(state.cryptoTime<=0){clearInterval(state.cryptoTimer);timerEl.textContent='00:00';return;}
    const m = Math.floor(state.cryptoTime/60);
    const s = state.cryptoTime%60;
    timerEl.textContent = String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  },1000);
}

// ============ PROCESSING ============
function processPayment(){
  goStep(4);
  const log = document.getElementById('processing-log');
  log.innerHTML = '';
  const lines = [
    'Connecting to payment gateway...',
    'Verifying transaction details...',
    'Encrypting payment data...',
    'Processing payment...',
    'Verifying funds...',
    'Transaction confirmed.',
    'Generating license key...',
    'Activating subscription...',
    'Done!'
  ];
  let i = 0;
  const iv = setInterval(()=>{
    if(i < lines.length){
      const p = document.createElement('p');
      p.textContent = '> ' + lines[i];
      p.style.animationDelay = '0s';
      log.appendChild(p);
      log.scrollTop = log.scrollHeight;
      i++;
    } else {
      clearInterval(iv);
      setTimeout(()=>{
        document.getElementById('processing-view').style.display = 'none';
        document.getElementById('success-view').style.display = 'block';
        const key = generateLicenseKey();
        document.getElementById('license-key').textContent = key;
        spawnConfetti();
      },500);
    }
  },400);
}

function generateLicenseKey(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = [];
  for(let s=0;s<4;s++){
    let seg = '';
    for(let i=0;i<4;i++) seg += chars[Math.floor(Math.random()*chars.length)];
    segments.push(seg);
  }
  return 'CHITIAN-'+segments.join('-');
}

// ============ CONFETTI ============
function spawnConfetti(){
  const colors = ['#ff2b3a','#b6ff3c','#5865F2','#f5a623','#fff'];
  for(let i=0;i<50;i++){
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random()*100+'%';
    el.style.top = '-10px';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.width = (4+Math.random()*8)+'px';
    el.style.height = (4+Math.random()*8)+'px';
    el.style.borderRadius = Math.random()>.5?'50%':'2px';
    el.style.animationDuration = (2+Math.random()*2)+'s';
    el.style.animationDelay = Math.random()*1+'s';
    document.body.appendChild(el);
    el.addEventListener('animationend',()=>el.remove());
  }
}

// ============ TOASTS ============
function showToast(msg,type='info'){
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translateX(100px)';setTimeout(()=>toast.remove(),300);},3000);
}

// ============ DARK / LIGHT MODE ============
(function initDarkLightMode(){
  const toggle = document.getElementById('mode-toggle');
  const saved = localStorage.getItem('chitian-mode') || 'dark';
  if(saved==='light') document.body.classList.add('light');
  toggle.textContent = saved==='light' ? '🌙' : '☀️';

  toggle.addEventListener('click',()=>{
    const isLight = document.body.classList.toggle('light');
    toggle.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('chitian-mode', isLight ? 'light' : 'dark');
    showToast(isLight ? 'Light mode activated' : 'Dark mode activated', 'success');
  });
})();

// ============ RECENT PURCHASES TOAST ============
(function initSocialProof(){
  const FAKE_USERS = [
    'xShadowFN','ProBuilder420','TTV_Viper','BuildKing99','CrankGod',
    'NoobSlayer','LootGoblin','SweatLord','RustLord','BushCamper',
    'FazeKid','SnipeGod','BuildDiff','ZoneWarrior','PeelyConga',
    'SoccerSkin','DefaultOG','RenegadeFN','BreezyBuild','ClutchKing'
  ];
  const FAKE_PLANS = [
    {name:'Monthly',emoji:'📦'},
    {name:'Weekly',emoji:'📅'},
    {name:'Day Pass',emoji:'⚡'}
  ];
  const AVATARS = ['🎮','🎯','🏗️','⚔️','🔥','💀','👁️','🤖','👾','🏆'];

  const container = document.getElementById('social-proof-container');
  let lastShow = 0;

  function showPurchase(){
    const now = Date.now();
    if(now - lastShow < 15000) return; // min 15s between toasts
    lastShow = now;

    const user = FAKE_USERS[Math.floor(Math.random()*FAKE_USERS.length)];
    const plan = FAKE_PLANS[Math.floor(Math.random()*FAKE_PLANS.length)];
    const avatar = AVATARS[Math.floor(Math.random()*AVATARS.length)];
    const times = ['just now','1 min ago','2 min ago','3 min ago','5 min ago'];
    const time = times[Math.floor(Math.random()*times.length)];

    const toast = document.createElement('div');
    toast.className = 'social-proof-toast';
    toast.innerHTML = `
      <div class="sp-avatar">${avatar}</div>
      <div class="sp-info">
        <span class="sp-name">${user} purchased</span>
        <span class="sp-plan">${plan.emoji} ${plan.name}</span>
        <span class="sp-time">${time}</span>
      </div>
    `;
    container.appendChild(toast);

    setTimeout(()=>{
      toast.classList.add('hiding');
      setTimeout(()=>toast.remove(),400);
    },5000);
  }

  // First toast after 8-15 seconds
  setTimeout(showPurchase, 8000 + Math.random()*7000);

  // Then every 30-60 seconds
  setInterval(showPurchase, 30000 + Math.random()*30000);
})();

// ============ AI CHAT WIDGET ============
(function initChatWidget(){
  const bubble = document.getElementById('chat-bubble');
  const win = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const msgArea = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const quickReplies = document.getElementById('chat-quick-replies');
  const notifBadge = document.getElementById('chat-notif');

  let isOpen = false;
  let hasGreeted = false;

  // ── Language Detection ──
  function detectLang(text){
    const t = text.toLowerCase();
    const patterns = {
      es: /\b(hola|que|como|cuanto|precio|quiero|necesito|donde|gracias|vale|tienes|puedo|hay|bueno|buenas|hey|dame|dime|habla|español|latino|comprar|pago|tarjeta|paypal|crypto|fortnite|cheat|aimbot|esp|funciona|undetected|ban|hwid|spoofer|launcher|descargar|instalar|key|licencia)\b/,
      fr: /\b(bonjour|salut|comment|combien|prix|je veux|j'ai besoin|merci|oui|non|tu as|peux|est-ce|bon|soir|donne|parle|français|acheter|paiement|carte|paypal|crypto|fortnite|triche|aimbot|esp|marche|indétectable|ban|hwid|spoofer|launcher|télécharger|installer|clé|licence)\b/,
      pt: /\b(olá|oi|como|quanto|preço|quero|preciso|obrigado|obrigada|sim|não|tenho|posso|bom|boa|fala|português|comprar|pagamento|cartão|paypal|crypto|fortnite|trapaceira|aimbot|esp|funciona|indetectável|ban|hwid|spoofer|launcher|baixar|instalar|chave|licença)\b/,
      de: /\b(hallo|wie|viel|preis|ich will|ich brauche|danke|ja|nein|guten|morgen|sprechen|deutsch|kaufen|bezahlung|karte|paypal|crypto|fortnite|cheat|aimbot|esp|funktioniert|undetected|ban|hwid|spoofer|launcher|herunterladen|installieren|schlüssel|lizenz)\b/,
      it: /\b(ciao|come|quanto|prezzo|voglio|ho bisogno|grazie|si|no|buono|buongiorno|parla|italiano|comprare|pagamento|carta|paypal|crypto|fortnite|cheat|aimbot|esp|funziona|rilevato|ban|hwid|spoofer|launcher|scaricare|installare|chiave|licenza)\b/,
      ja: /\b(こんにちは|ありがとう|いくら|価格|欲しい|fortnite|チート|aimbot|esp|機能|検出|ban| hwid|spoofer|ランチャー|ダウンロード|インストール|鍵|ライセンス|お支払い|カード|paypal|crypto)\b/,
      ko: /\b(안녕|감사|얼마|가격|원하는|fortnite|치트|aimbot|esp|기능|탐지|ban|hwid|spoofer|런처|다운로드|설치|키|라이선스|결제|카드|paypal|crypto)\b/,
      ar: /\b(مرحبا|شكرا|كم|سعر|أريد|fortnite|غش|aimbot|esp|يعمل|غير مكتشف|ban|hwid|spoofer|محمل|تنزيل|تثبيت|مفتاح|رخصة|دفع|بطاقة|paypal|crypto)\b/,
      ru: /\b(привет|спасибо|сколько|цена|хочу|fortnite|чит|aimbot|esp|работает|обнаружение|ban|hwid|spoofer|загрузчик|скачать|установить|ключ|лицензия|оплата|карта|paypal|crypto)\b/,
      tr: /\b(merhaba|nasıl|kaç|fiyat|istiyorum|fortnite|hile|aimbot|esp|çalışıyor|tespit|ban|hwid|spoofer|launcher|indir|kur|anahtar|lisans|ödeme|kart|paypal|crypto)\b/,
      nl: /\b(hoi|hoe|hoeveel|prijs|ik wil|fortnite|cheat|aimbot|esp|werkt|ontdekt|ban|hwid|spoofer|launcher|downloaden|installeren|sleutel|licentie|betaling|kaart|paypal|crypto)\b/
    };
    let best = 'en';
    let bestScore = 0;
    for(const [lang,re] of Object.entries(patterns)){
      const matches = t.match(re);
      if(matches && matches.length > bestScore){bestScore = matches.length; best = lang;}
    }
    return best;
  }

  // ── AI Responses (multilingual) ──
  const AI = {
    en: {
      greeting: "Hey! 👋 Welcome to CHITIAN. I'm here to help you with anything — pricing, features, setup, payment. What do you need?",
      pricing: "We have 3 plans:\n\n📦 **Monthly** — $29.99 (30 days)\n📅 **Weekly** — $11.99 (7 days)\n⚡ **Day Pass** — $4.49 (1 day)\n\nAll plans include the same features. The Monthly plan is the best value — most users go with that one.",
      features: "CHITIAN includes:\n\n🎯 **Aimbot** — pixel-perfect, customizable FOV & smoothing\n👁️ **ESP / Wallhack** — see enemies through walls\n⚡ **Triggerbot** — auto-fire on crosshair\n🔄 **Recoil Control** — laser precision\n🛡️ **HWID Spoofer** — stay unbanned\n🚀 **Stream Proof** — undetectable on stream\n\nAll included in every plan.",
      setup: "Super easy setup:\n\n1️⃣ Download the launcher from our site\n2️⃣ Run it as admin\n3️⃣ Paste your license key\n4️⃣ Select Fortnite and configure settings\n5️⃣ Click Inject and launch the game\n\nTakes about 2 minutes. If you need help, I'm here.",
      payment: "We accept:\n\n💳 **Credit/Debit Cards** — Visa, Mastercard, Amex\n₿ **Crypto** — Bitcoin, Ethereum, USDT\n🅿️ **PayPal**\n\nAll payments are processed securely. License key is delivered instantly after payment.",
      undetected: "Yes, CHITIAN is **fully undetected**. We've been running clean for 187+ days. Our team updates the bypass within hours of any anti-cheat update. You're safe.",
      hwid: "The HWID Spoofer is **included free** with every plan. It masks your hardware ID so even if you were previously banned, you can play again safely.",
      refund: "We offer refunds within 24 hours if the product isn't working as intended. Just open a ticket on our Discord server and the team will help you out.",
      discord: "Join our Discord for 24/7 support, updates, and a community of 14,000+ users:\n\n🔗 discord.gg/8E8DWmxEV\n\nOur support team responds in minutes.",
      download: "Download the launcher here:\n\n⬇️ Click the **Download Launcher** button on our site\n\nWindows 10/11 supported. Run as admin for best results.",
      hello: "Hey! 😊 How can I help you today?",
      thanks: "You're welcome! Is there anything else you need help with?",
      default: "I'm not sure I understand that fully, but here's what I can help with:\n\n• Pricing & plans\n• Features & capabilities\n• Setup & installation\n• Payment methods\n• Anti-cheat / undetected status\n• HWID Spoofer\n• Refunds\n• Discord support\n\nJust ask about any of these!"
    },
    es: {
      greeting: "¡Hola! 👋 Bienvenido a CHITIAN. Estoy aquí para ayudarte con todo — precios, funciones, instalación, pagos. ¿Qué necesitas?",
      pricing: "Tenemos 3 planes:\n\n📦 **Mensual** — $29.99 (30 días)\n📅 **Semanal** — $11.99 (7 días)\n⚡ **Pase diario** — $4.49 (1 día)\n\nTodos los planes incluyen las mismas funciones. El mensual es el mejor precio.",
      features: "CHITIAN incluye:\n\n🎯 **Aimbot** — puntería perfecta, FOV personalizable\n👁️ **ESP / Wallhack** — ver enemigos a través de paredes\n⚡ **Triggerbot** — disparo automático\n🔄 **Control de retroceso** — precisión láser\n🛡️ **HWID Spoofer** — mantente sin ban\n🚀 **Stream Proof** — indetectable en stream\n\nTodo incluido en cada plan.",
      setup: "Instalación súper fácil:\n\n1️⃣ Descarga el launcher desde nuestra web\n2️⃣ Ejecútalo como admin\n3️⃣ Pega tu licencia\n4️⃣ Selecciona Fortnite y configura\n5️⃣ Click en Inyectar y abre el juego\n\nTarda 2 minutos. Si necesitas ayuda, aquí estoy.",
      payment: "Aceptamos:\n\n💳 **Tarjetas** — Visa, Mastercard, Amex\n₿ **Crypto** — Bitcoin, Ethereum, USDT\n🅿️ **PayPal**\n\nPago seguro. Licencia entregada al instante.",
      undetected: "Sí, CHITIAN está **totalmente indetectable**. Llevamos 187+ días sin bans. Nuestro equipo actualiza el bypass en horas.",
      hwid: "El HWID Spoofer viene **gratis** con todos los planes. Enmascara tu ID de hardware para que puedas jugar aunque antes te hayan baneado.",
      refund: "Ofrecemos reembolsos dentro de 24 horas si el producto no funciona. Abre un ticket en nuestro Discord y te ayudamos.",
      discord: "Únete a nuestro Discord para soporte 24/7:\n\n🔗 discord.gg/8E8DWmxEV\n\nRespondemos en minutos.",
      download: "Descarga el launcher aquí:\n\n⬇️ Haz click en **Download Launcher** en nuestra web\n\nWindows 10/11. Ejecuta como admin.",
      hello: "¡Hola! 😊 ¿En qué puedo ayudarte hoy?",
      thanks: "¡De nada! ¿Necesitas algo más?",
      default: "No estoy seguro de entender eso, pero puedo ayudarte con:\n\n• Precios y planes\n• Funciones\n• Instalación\n• Métodos de pago\n• Estado anti-cheat\n• HWID Spoofer\n• Reembolsos\n• Soporte en Discord\n\n¡Pregunta sobre cualquiera de estos!"
    },
    fr: {
      greeting: "Salut ! 👋 Bienvenue sur CHITIAN. Je suis là pour t'aider avec tout — prix, fonctionnalités, installation, paiement. Qu'est-ce que tu need?",
      pricing: "On a 3 plans :\n\n📦 **Mensuel** — 29,99$ (30 jours)\n📅 **Hebdomadaire** — 11,99$ (7 jours)\n⚡ **Pass journalier** — 4,49$ (1 jour)\n\nTous les plans ont les mêmes fonctionnalités. Le mensuel est le meilleur prix.",
      features: "CHITIAN comprend :\n\n🎯 **Aimbot** — visée parfaite, FOV personnalisable\n👁️ **ESP / Wallhack** — voir les ennemis à travers les murs\n⚡ **Triggerbot** — tir automatique\n🔄 **Contrôle du recul** — précision laser\n🛡️ **HWID Spoofer** — reste non-détecté\n🚀 **Stream Proof** — indétectable en stream\n\nTout inclus dans chaque plan.",
      setup: "Installation super facile :\n\n1️⃣ Télécharge le launcher\n2️⃣ Lance-le en admin\n3️⃣ Colle ta clé de licence\n4️⃣ Sélectionne Fortnite et configure\n5️⃣ Clique sur Injecter et lance le jeu\n\nÇa prend 2 minutes.",
      payment: "On accepte :\n\n💳 **Cartes** — Visa, Mastercard, Amex\n₿ **Crypto** — Bitcoin, Ethereum, USDT\n🅿️ **PayPal**\n\nPaiement sécurisé. Licence livrée instantanément.",
      undetected: "Oui, CHITIAN est **totalement indétectable**. On est clean depuis 187+ jours. Notre équipe met à jour le bypass en quelques heures.",
      hello: "Salut ! 😊 Comment je peux t'aider ?",
      thanks: "De rien ! Besoin d'autre chose ?",
      default: "Je ne suis pas sûr de comprendre, mais je peux aider avec :\n\n• Prix et plans\n• Fonctionnalités\n• Installation\n• Paiements\n• Anti-cheat\n• HWID Spoofer\n• Remboursements\n• Support Discord\n\nDemande sur n'importe quoi !"
    },
    pt: {
      greeting: "Olá! 👋 Bem-vindo ao CHITIAN. Estou aqui para te ajudar com tudo — preços, funções, instalação, pagamento. O que precisas?",
      pricing: "Temos 3 planos:\n\n📦 **Mensal** — $29.99 (30 dias)\n📅 **Semanal** — $11.99 (7 dias)\n⚡ **Passe diário** — $4.49 (1 dia)\n\nTodos os planos incluem as mesmas funções. O mensal é o melhor preço.",
      features: "CHITIAN inclui:\n\n🎯 **Aimbot** — mira perfeita, FOV personalizável\n👁️ **ESP / Wallhack** — ver inimigos através das paredes\n⚡ **Triggerbot** — tiro automático\n🔄 **Controlo de recoil** — precisão laser\n🛡️ **HWID Spoofer** — fica sem ban\n🚀 **Stream Proof** — indetetável em stream\n\nTudo incluído em cada plano.",
      setup: "Instalação super fácil:\n\n1️⃣ Descarrega o launcher\n2️⃣ Executa como admin\n3️⃣ Cola a tua chave de licença\n4️⃣ Seleciona Fortnite e configura\n5️⃣ Clica em Injetar e abre o jogo\n\nDemora 2 minutos.",
      hello: "Olá! 😊 Como posso ajudar?",
      thanks: "De nada! Precisas de mais alguma coisa?",
      default: "Não tenho a certeza se percebi, mas posso ajudar com:\n\n• Preços e planos\n• Funções\n• Instalação\n• Pagamentos\n• Anti-cheat\n• HWID Spoofer\n• Reembolsos\n• Suporte Discord\n\nPergunta sobre qualquer um!"
    },
    de: {
      greeting: "Hallo! 👋 Willkommen bei CHITIAN. Ich bin hier um dir zu helfen — Preise, Funktionen, Setup, Zahlung. Was brauchst du?",
      pricing: "Wir haben 3 Pläne:\n\n📦 **Monatlich** — $29.99 (30 Tage)\n📅 **Wöchentlich** — $11.99 (7 Tage)\n⚡ **Tagespass** — $4.49 (1 Tag)\n\nAlle Pläne haben die gleichen Funktionen. Monatlich ist am besten.",
      features: "CHITIAN beinhaltet:\n\n🎯 **Aimbot** — perfektes Zielen, anpassbarer FOV\n👁️ **ESP / Wallhack** — Gegner durch Wände sehen\n⚡ **Triggerbot** — automatisches Schießen\n🔄 **Recoil-Kontrolle** — Laser-Präzision\n🛡️ **HWID Spoofer** — bleib unentdeckt\n🚀 **Stream Proof** — unsichtbar im Stream\n\nAlles inklusive.",
      setup: "Super einfaches Setup:\n\n1️⃣ Launcher herunterladen\n2️⃣ Als Admin ausführen\n3️⃣ Lizenzschlüssel einfügen\n4️⃣ Fortnite auswählen und konfigurieren\n5️⃣ Auf Injizieren klicken und Spiel starten\n\nDauert 2 Minuten.",
      hello: "Hallo! 😊 Wie kann ich dir helfen?",
      thanks: "Kein Problem! Brauchst du noch was?",
      default: "Ich bin mir nicht sicher, aber ich kann helfen mit:\n\n• Preise & Pläne\n• Funktionen\n• Setup\n• Zahlungsmethoden\n• Anti-Cheat\n• HWID Spoofer\n• Erstattungen\n• Discord-Support\n\nFrag einfach!"
    },
    it: {
      greeting: "Ciao! 👋 Benvenuto su CHITIAN. Sono qui per aiutarti con tutto — prezzi, funzionalità, installazione, pagamento. Di cosa hai bisogno?",
      pricing: "Abbiamo 3 piani:\n\n📦 **Mensile** — $29.99 (30 giorni)\n📅 **Settimanale** — $11.99 (7 giorni)\n⚡ **Pass giornaliero** — $4.49 (1 giorno)\n\nTutti i piani hanno le stesse funzionalità. Il mensile è il miglior prezzo.",
      hello: "Ciao! 😊 Come posso aiutarti?",
      thanks: "Prego! Hai bisogno di qualcos'altro?",
      default: "Non sono sicuro, ma posso aiutarti con:\n\n• Prezzi e piani\n• Funzionalità\n• Installazione\n• Pagamenti\n• Anti-cheat\n• HWID Spoofer\n• Rimborsi\n• Supporto Discord\n\nChiedi pure!"
    },
    ja: {
      greeting: "こんにちは！ 👋 CHITIANへようこそ。価格、機能、セットアップ、お支払いについてお手伝いします。何が必要ですか？",
      pricing: "3つのプランがあります：\n\n📦 **月額** — $29.99（30日）\n📅 **週額** — $11.99（7日）\n⚡ **1日パス** — $4.49（1日）\n\nすべてのプランに同じ機能が含まれています。月額が最もお得です。",
      hello: "こんにちは！ 😊 お手伝いできることはありますか？",
      thanks: "どういたしまして！他にお手伝いすることはありますか？",
      default: "申し訳ありませんが、以下の方面でお手伝いできます：\n\n• 価格とプラン\n• 機能\n• セットアップ\n• お支払い方法\n• アンチチート\n• HWID Spoofer\n• 返金\n• Discordサポート\n\n何でもお聞きください！"
    },
    ko: {
      greeting: "안녕하세요! 👋 CHITIAN에 오신 것을 환영합니다. 가격, 기능, 설정, 결제에 대해 도와드리겠습니다. 무엇이 필요하신가요?",
      pricing: "3가지 플랜이 있습니다:\n\n📦 **월간** — $29.99 (30일)\n📅 **주간** — $11.99 (7일)\n⚡ **1일 패스** — $4.49 (1일)\n\n모든 플랜에 동일한 기능이 포함되어 있습니다.",
      hello: "안녕하세요! 😊 무엇을 도와드릴까요?",
      thanks: "천만에요! 다른 것이 필요하신가요?",
      default: "확실하지 않지만 다음과 같이 도와드릴 수 있습니다:\n\n• 가격 및 플랜\n• 기능\n• 설정\n• 결제 방법\n• 안티치트\n• HWID Spoofer\n• 환불\n• Discord 지원\n\n무엇이든 물어보세요!"
    },
    ar: {
      greeting: "مرحبا! 👋 أهلاً بك في CHITIAN. أنا هنا لمساعدتك في كل شيء — الأسعار، الميزات، التثبيت، الدفع. ماذا تحتاج؟",
      pricing: "لدينا 3 خطط:\n\n📦 **شهري** — $29.99 (30 يوم)\n📅 **أسبوعي** — $11.99 (7 أيام)\n⚡ **تذكرة يومية** — $4.49 (1 يوم)\n\nجميع الخطط تشمل نفس الميزات.",
      hello: "مرحبا! 😊 كيف يمكنني مساعدتك؟",
      thanks: "على الرحب والسعة! هل تحتاج شيء آخر؟",
      default: "لست متأكداً، لكن يمكنني المساعدة في:\n\n• الأسعار والخطط\n• الميزات\n• التثبيت\n• طرق الدفع\n• مكافح الغش\n• HWID Spoofer\n• الاسترداد\n• دعم Discord\n\nاسأل عن أي شيء!"
    },
    ru: {
      greeting: "Привет! 👋 Добро пожаловать в CHITIAN. Я здесь чтобы помочь с чем угодно — цены, функции, установка, оплата. Что тебе нужно?",
      pricing: "У нас 3 плана:\n\n📦 **Месячный** — $29.99 (30 дней)\n📅 **Недельный** — $11.99 (7 дней)\n⚡ **Дневной** — $4.49 (1 день)\n\nВсе планы включают одинаковые функции.",
      hello: "Привет! 😊 Чем могу помочь?",
      thanks: "Пожалуйста! Нужно ещё что-нибудь?",
      default: "Не уверен, но могу помочь с:\n\n• Цены и планы\n• Функции\n• Установка\n• Оплата\n• Античит\n• HWID Spoofer\n• Возврат\n• Поддержка Discord\n\nСпрашивай!"
    },
    tr: {
      greeting: "Merhaba! 👋 CHITIAN'a hoş geldin. Fiyatlar, özellikler, kurulum, ödeme konusunda yardımcı olabilirim. Neye ihtiyacın var?",
      pricing: "3 planımız var:\n\n📦 **Aylık** — $29.99 (30 gün)\n📅 **Haftalık** — $11.99 (7 gün)\n⚡ **Günlük** — $4.49 (1 gün)\n\nTüm planlar aynı özellikleri içeriyor.",
      hello: "Merhaba! 😊 Nasıl yardımcı olabilirim?",
      thanks: "Rica ederim! Başka bir şeye ihtiyacın var mı?",
      default: "Emin değilim ama şunlarda yardımcı olabilirim:\n\n• Fiyatlar ve planlar\n• Özellikler\n• Kurulum\n• Ödeme yöntemleri\n• Anti-cheat\n• HWID Spoofer\n• İadeler\n• Discord desteği\n\nSor!"
    },
    nl: {
      greeting: "Hoi! 👋 Welkom bij CHITIAN. Ik ben hier om je te helpen met alles — prijzen, functies, setup, betaling. Wat heb je nodig?",
      pricing: "We hebben 3 plannen:\n\n📦 **Maandelijks** — $29.99 (30 dagen)\n📅 **Wekelijks** — $11.99 (7 dagen)\n⚡ **Dagpas** — $4.49 (1 dag)\n\nAlle plannen hebben dezelfde functies.",
      hello: "Hoi! 😊 Hoe kan ik je helpen?",
      thanks: "Graag gedaan! Heb je nog iets anders nodig?",
      default: "Ik weet het niet zeker, maar ik kan helpen met:\n\n• Prijzen en plannen\n• Functies\n• Setup\n• Betaalmethoden\n• Anti-cheat\n• HWID Spoofer\n• Terugbetalingen\n• Discord-ondersteuning\n\nVraag maar raak!"
    }
  };

  // ── Intent Detection ──
  function detectIntent(text){
    const t = text.toLowerCase();
    if(/\b(hi|hello|hey|hola|salut|olá|hallo|ciao|merhaba|привет|안녕|こんにちは|مرحبا|hoi)\b/.test(t)) return 'greeting';
    if(/\b(price|precio|prix|preço|preis|prezzo|価格|가격|سعر|цена|fiyat|prijs|plan|passe|pass)\b/.test(t)) return 'pricing';
    if(/\b(feature|functionality|aimbot|esp|wallhack|triggerbot|recoil|stream proof|función|fonction|funkcja|funzionalità|機能|기능|ميزة|функция|özellik|functie)\b/.test(t)) return 'features';
    if(/\b(setup|install|how to|como|comment|wie|come|nasıl|インストール|설치|تثبيت|установка|kurulum|installeren)\b/.test(t)) return 'setup';
    if(/\b(pay|payment|card|tarjeta|carte|karte|carta|カード|카드|بطاقة|карта|kaart|paypal|crypto|bitcoin)\b/.test(t)) return 'payment';
    if(/\b(undetected|detect|ban|safe|security|indetectable|indétecté|und entdeckt|non rilevato|検出|탐지|غير مكتشف|обнаружение|tespit|ontdekt)\b/.test(t)) return 'undetected';
    if(/\b(hwid|spoofer|hardware|ban|banned|baneado|banni|gebannt|ban| 밴| حظر|бан|banlanma)\b/.test(t)) return 'hwid';
    if(/\b(refund|reembolso|remboursement|erstattung|rimborso|返金|환불|استرداد|возврат|iade|terugbetaling)\b/.test(t)) return 'refund';
    if(/\b(discord|support|soporte|soporte|hilfe|support|サポート|지원|دعم|поддержка|destek|ondersteuning)\b/.test(t)) return 'discord';
    if(/\b(download|descargar|télécharger|herunterladen|scaricare|ダウンロード|다운로드|تنزيل|скачать|indir|downloaden)\b/.test(t)) return 'download';
    if(/\b(thanks|thank you|gracias|merci|danke|grazie|ありがとう|감사|شكرا|спасибо|teşekkür|bedankt)\b/.test(t)) return 'thanks';
    if(/\b(hi|hello|hey|hola|salut|olá|hallo|ciao|merhaba|привет|안녕|こんにちは|مرحبا|hoi|buenas|bueno|bonjour|bonsoir)\b/.test(t)) return 'hello';
    return 'default';
  }

  // ── Get Response ──
  function getResponse(text){
    const lang = detectLang(text);
    const intent = detectIntent(text);
    const responses = AI[lang] || AI.en;
    return responses[intent] || responses.default || AI.en.default;
  }

  // ── Quick Replies Config ──
  const QUICK_REPLIES = {
    en: ['💰 Pricing','🎯 Features','📥 Setup','💳 Payment','🛡️ Undetected?','💬 Discord'],
    es: ['💰 Precios','🎯 Funciones','📥 Instalación','💳 Pago','🛡️ Indetectable','💬 Discord'],
    fr: ['💰 Prix','🎯 Fonctionnalités','📥 Installation','💳 Paiement','🛡️ Indétectable','💬 Discord'],
    pt: ['💰 Preços','🎯 Funções','📥 Instalação','💳 Pagamento','🛡️ Indetetável','💬 Discord'],
    de: ['💰 Preise','🎯 Funktionen','📥 Setup','💳 Zahlung','🛡️ Unentdeckt','💬 Discord'],
    it: ['💰 Prezzi','🎯 Funzionalità','📥 Installazione','💳 Pagamento','🛡️ Non rilevato','💬 Discord'],
    default: ['💰 Pricing','🎯 Features','📥 Setup','💳 Payment','🛡️ Undetected?','💬 Discord']
  };

  // ── DOM Helpers ──
  function addMsg(text, sender){
    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + sender;
    msg.textContent = text;
    msgArea.appendChild(msg);
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  function addBotMsg(text){
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot';
    msgArea.appendChild(msg);
    msgArea.scrollTop = msgArea.scrollHeight;
    // Typewriter effect
    let i = 0;
    const type = setInterval(()=>{
      if(i < text.length){
        msg.textContent += text[i];
        msgArea.scrollTop = msgArea.scrollHeight;
        i++;
      } else {
        clearInterval(type);
      }
    }, 18);
  }

  function showTyping(){
    const t = document.createElement('div');
    t.className = 'chat-typing';
    t.id = 'typing-indicator';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgArea.appendChild(t);
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  function removeTyping(){
    const t = document.getElementById('typing-indicator');
    if(t) t.remove();
  }

  function showQuickReplies(lang){
    const replies = QUICK_REPLIES[lang] || QUICK_REPLIES.default;
    quickReplies.innerHTML = '';
    replies.forEach(r=>{
      const btn = document.createElement('button');
      btn.className = 'chat-quick-btn';
      btn.textContent = r;
      btn.addEventListener('click',()=>{
        handleUserInput(r.replace(/^[^\s]+\s/,'')); // remove emoji prefix
      });
      quickReplies.appendChild(btn);
    });
  }

  // ── Handle Input ──
  function handleUserInput(text){
    if(!text.trim()) return;
    addMsg(text, 'user');
    input.value = '';
    quickReplies.innerHTML = '';

    showTyping();
    const delay = 800 + Math.random() * 1200;
    setTimeout(()=>{
      removeTyping();
      const response = getResponse(text);
      const lang = detectLang(text);
      addBotMsg(response);
      setTimeout(()=>showQuickReplies(lang), 300);
    }, delay);
  }

  // ── Event Listeners ──
  bubble.addEventListener('click',()=>{
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    bubble.classList.toggle('open', isOpen);
    notifBadge.style.display = 'none';

    if(isOpen && !hasGreeted){
      hasGreeted = true;
      showTyping();
      setTimeout(()=>{
        removeTyping();
        addBotMsg(AI.en.greeting);
        showQuickReplies('en');
      }, 1000);
    }
  });

  closeBtn.addEventListener('click',()=>{
    isOpen = false;
    win.classList.remove('open');
    bubble.classList.remove('open');
  });

  sendBtn.addEventListener('click',()=>handleUserInput(input.value));

  input.addEventListener('keydown',e=>{
    if(e.key==='Enter'&&!e.shiftKey'){
      e.preventDefault();
      handleUserInput(input.value);
    }
  });

  // Auto-open bubble hint after 5 seconds
  setTimeout(()=>{
    if(!isOpen){
      notifBadge.style.display = 'flex';
      notifBadge.textContent = '1';
    }
  }, 5000);
})();

// ============ THEME CUSTOMIZER ============
document.addEventListener('DOMContentLoaded', function initThemeCustomizer(){
  const toggle = document.getElementById('theme-toggle');
  const panel = document.getElementById('theme-panel');
  const root = document.documentElement;
  let current = JSON.parse(localStorage.getItem('chitian-theme')||'{"color":"#ff2b3a","texture":"none","bg":"#05060a"}');

  function hexToRgb(h){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return{r,g,b}}
  function rgbToHex(r,g,b){return'#'+[r,g,b].map(x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('')}
  function lighten(hex,amt){const{r,g,b}=hexToRgb(hex);return rgbToHex(r+amt,g+amt,b+amt)}

  function applyTheme(t){
    if(t.color){
      root.style.setProperty('--red',t.color);
      root.style.setProperty('--red-dim',t.color+'80');
      root.style.setProperty('--red-glow',t.color+'40');
      document.querySelectorAll('.theme-color').forEach(c=>c.classList.toggle('active',c.dataset.color===t.color));
    }
    if(t.bg){
      const rgb=hexToRgb(t.bg);
      root.style.setProperty('--bg',t.bg);
      root.style.setProperty('--bg2',lighten(t.bg,7));
      root.style.setProperty('--bg3',lighten(t.bg,14));
      root.style.setProperty('--bg4',lighten(t.bg,21));
      root.style.setProperty('--bg-rgb',rgb.r+','+rgb.g+','+rgb.b);
      document.body.style.backgroundColor=t.bg;
      document.querySelectorAll('.theme-bg-opt').forEach(b=>b.classList.toggle('active',b.dataset.bg===t.bg));
    }
    if(typeof t.texture!=='undefined'){
      document.body.classList.remove('tex-dots','tex-lines','tex-grid','tex-diag','tex-cross');
      if(t.texture!=='none') document.body.classList.add('tex-'+t.texture);
      document.querySelectorAll('.theme-texture').forEach(tx=>tx.classList.toggle('active',tx.dataset.texture===t.texture));
    }
    localStorage.setItem('chitian-theme',JSON.stringify(current));
  }

  toggle.addEventListener('click',()=>panel.classList.toggle('open'));
  document.addEventListener('click',e=>{
    if(!panel.contains(e.target)&&!toggle.contains(e.target)) panel.classList.remove('open');
  });

  document.getElementById('theme-colors').addEventListener('click',e=>{
    const c=e.target.closest('.theme-color');
    if(!c)return;
    current.color=c.dataset.color;
    applyTheme(current);
    showToast('Accent color updated!','success');
  });

  document.getElementById('theme-textures').addEventListener('click',e=>{
    const t=e.target.closest('.theme-texture');
    if(!t)return;
    current.texture=t.dataset.texture;
    applyTheme(current);
    showToast('Texture updated!','success');
  });

  document.getElementById('theme-bg').addEventListener('click',e=>{
    const b=e.target.closest('.theme-bg-opt');
    if(!b)return;
    current.bg=b.dataset.bg;
    applyTheme(current);
    showToast('Background updated!','success');
  });

  document.getElementById('theme-reset').addEventListener('click',()=>{
    current={color:'#ff2b3a',texture:'none',bg:'#05060a'};
    root.style.removeProperty('--red');
    root.style.removeProperty('--red-dim');
    root.style.removeProperty('--red-glow');
    root.style.removeProperty('--bg');
    root.style.removeProperty('--bg2');
    root.style.removeProperty('--bg3');
    root.style.removeProperty('--bg4');
    root.style.removeProperty('--bg-rgb');
    document.body.style.backgroundColor='';
    document.body.classList.remove('tex-dots','tex-lines','tex-grid','tex-diag','tex-cross');
    applyTheme(current);
    showToast('Theme reset to default!','success');
  });

  applyTheme(current);
});

// ============ ADMIN PANEL (Ctrl+Shift+A) ============
document.addEventListener('DOMContentLoaded', function initAdmin(){
  const today = new Date().toISOString().slice(0,10);
  const now = Date.now();
  const stats = JSON.parse(localStorage.getItem('chitian-stats')||'{"days":{},"total":0,"log":[]}');

  if(!stats.days[today]) stats.days[today] = 0;
  stats.days[today]++;
  stats.total++;

  const entry = {date:today,time:new Date().toLocaleTimeString(),ua:navigator.userAgent.slice(0,60)};
  stats.log.unshift(entry);
  if(stats.log.length > 100) stats.log = stats.log.slice(0,100);

  const sessions = parseInt(sessionStorage.getItem('chitian-sessions')||'0') + 1;
  sessionStorage.setItem('chitian-sessions', sessions);

  localStorage.setItem('chitian-stats',JSON.stringify(stats));

  if(location.hash==='#admin'){
    openAdminPanel(stats, sessions);
  }

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      document.getElementById('admin-overlay').style.display='none';
    }
  });

  function openAdminPanel(stats, sessions){
    const overlay = document.getElementById('admin-overlay');
    overlay.style.display='block';

    const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
    document.getElementById('stat-today').textContent = (stats.days[today]||0).toLocaleString();
    document.getElementById('stat-yesterday').textContent = (stats.days[yesterday]||0).toLocaleString();
    document.getElementById('stat-total').textContent = stats.total.toLocaleString();
    document.getElementById('stat-sessions').textContent = sessions;

    const keys = Object.keys(stats.days).sort().slice(-14);
    const maxVisit = Math.max(...keys.map(k=>stats.days[k]),1);
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const barsEl = document.getElementById('stats-bars');

    barsEl.innerHTML = keys.map(k=>{
      const dt = new Date(k+'T12:00:00');
      const label = dayNames[dt.getDay()];
      const v = stats.days[k];
      const h = Math.max(4, (v/maxVisit)*100);
      return `<div class="stats-bar-wrap">
        <div class="stats-bar-val">${v}</div>
        <div class="stats-bar" style="height:${h}%"></div>
        <div class="stats-bar-label">${label}</div>
      </div>`;
    }).join('');

    const logEl = document.getElementById('admin-log');
    logEl.innerHTML = stats.log.map(l=>
      `<div style="padding:6px 0;border-bottom:1px solid var(--border);display:flex;gap:16px">
        <span style="color:var(--green);min-width:70px">${l.time}</span>
        <span>${l.date}</span>
        <span style="color:var(--text-muted);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${l.ua}</span>
      </div>`
    ).join('');
  }
});

// ============ ENHANCED ANIMATIONS PACK ============
function initEnhancedAnimations(){
  // NOISE OVERLAY
  const noise = document.createElement('div');
  noise.className = 'noise-overlay';
  document.body.appendChild(noise);

  // SECTION TITLE GRADIENT
  document.querySelectorAll('.section-title').forEach(t=>{
    t.classList.add('text-gradient-anim');
  });

  // 3D CARD TILT on product cards and game cards
  document.querySelectorAll('.product-card, .game-card').forEach(card=>{
    card.classList.add('card-3d');
    card.addEventListener('mousemove',e=>{
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width/2;
      const cy = rect.height/2;
      const rotateX = ((y-cy)/cy) * -6;
      const rotateY = ((x-cx)/cx) * 6;
      card.style.transform = 'perspective(800px) rotateX('+rotateX+'deg) rotateY('+rotateY+'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // MAGNETIC BUTTONS
  document.querySelectorAll('.btn, .product-btn').forEach(btn=>{
    btn.classList.add('magnetic');
    btn.addEventListener('mousemove',e=>{
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      btn.style.transform = 'translate('+x*.2+'px, '+y*.2+'px)';
    });
    btn.addEventListener('mouseleave',()=>{
      btn.style.transform = 'translate(0,0)';
    });
  });

  // RIPPLE EFFECT on buttons
  document.addEventListener('click',e=>{
    const btn = e.target.closest('.btn, .product-btn, .nav-cta, .faq-q');
    if(!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size+'px';
    ripple.style.left = (e.clientX - rect.left - size/2)+'px';
    ripple.style.top = (e.clientY - rect.top - size/2)+'px';
    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend',()=>ripple.remove());
  });

  // HERO PARALLAX on mouse
  var hero = document.querySelector('.hero');
  if(hero){
    hero.addEventListener('mousemove',e=>{
      var cx = window.innerWidth/2;
      var cy = window.innerHeight/2;
      var dx = (e.clientX - cx)/cx;
      var dy = (e.clientY - cy)/cy;
      hero.querySelectorAll('.hero-stat').forEach((s,i)=>{
        s.style.transform = 'translate('+(dx*(8+i*4))+'px, '+(dy*(6+i*3))+'px)';
      });
      hero.querySelectorAll('.hero-btns .btn').forEach((b,i)=>{
        b.style.transform = 'translate('+(dx*(4+i*3))+'px, '+(dy*(3+i*2))+'px)';
      });
    });
    hero.addEventListener('mouseleave',()=>{
      hero.querySelectorAll('.hero-stat, .hero-btns .btn').forEach(el=>{
        el.style.transform = 'translate(0,0)';
      });
    });
  }

  // NAV SCROLL INDICATOR
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll',()=>{
    var current = '';
    sections.forEach(s=>{
      var top = s.offsetTop - 200;
      if(window.scrollY >= top) current = s.getAttribute('id');
    });
    navLinks.forEach(a=>{
      if(a.getAttribute('href')==='#'+current) a.classList.add('active');
      else a.classList.remove('active');
    });
  });
}

// Add to initAll
// Patch initAll to include enhanced animations
document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(initEnhancedAnimations, 100);
});

})();

