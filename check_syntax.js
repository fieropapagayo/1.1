


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
// ============ CHITIAN AI CHAT WIDGET v2 — smart engine ============
// ============ CHITIAN AI CHAT WIDGET v2 — smart engine ============
// ============ CHITIAN AI CHAT WIDGET v2 — smart engine ============
// ============ CHITIAN AI CHAT WIDGET v2 — smart engine ============
// ============ CHITIAN AI CHAT WIDGET v3 — LLM + smart fallback ============
(function initChatWidget(){
  // === CONFIG: paste your Cloudflare Worker URL here ===
  var LLM_ENDPOINT = 'https://chitian-ai.c090167.workers.dev';
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

// ============ COMMUNITY FORUM ============
(function initForum(){
  var FORUM_API='https://chitian-ai.c090167.workers.dev';
  var ADMIN_TOKEN='';// Set your ADMIN_TOKEN here to post as creator
  var feed=document.getElementById('forum-feed');
  var input=document.getElementById('forum-input');
  var nick=document.getElementById('forum-nick');
  var sendBtn=document.getElementById('forum-send');
  var charCount=document.getElementById('forum-char-count');
  var msgCount=document.getElementById('forum-msg-count');
  var onlineCount=document.getElementById('forum-online-count');
  var announcements=document.getElementById('forum-announcements');
  var adminBadge=document.getElementById('forum-admin-badge');
  var refreshBtn=document.getElementById('forum-refresh');
  if(!feed||!input) return;

  var myNick=localStorage.getItem('forum-nick')||'';
  if(nick) nick.value=myNick;
  if(myNick&&adminBadge){adminBadge.style.display='inline-block';}

  function timeAgo(ts){
    var s=Math.floor((Date.now()-ts)/1000);
    if(s<60) return 'just now';
    if(s<3600) return Math.floor(s/60)+'m ago';
    if(s<86400) return Math.floor(s/3600)+'h ago';
    return Math.floor(s/86400)+'d ago';
  }

  function renderMsg(m){
    var d=document.createElement('div');
    d.className='forum-msg'+(m.admin?' is-admin':'');
    d.dataset.id=m.id;
    var initial=(m.nick||'?')[0].toUpperCase();
    d.innerHTML='<div class="forum-msg-avatar">'+initial+'</div>'
      +'<div class="forum-msg-body">'
      +'<div class="forum-msg-head">'
      +'<span class="forum-msg-nick">'+(m.nick||'Anonymous').replace(/[<>]/g,'')+'</span>'
      +'<span class="forum-msg-time">'+timeAgo(m.time)+'</span>'
      +'</div>'
      +'<div class="forum-msg-text">'+(m.text||'').replace(/[<>]/g,'')+'</div>'
      +'</div>'
      +'<div class="forum-msg-actions"><button class="forum-msg-del" title="Delete">✕</button></div>';
    d.querySelector('.forum-msg-del').addEventListener('click',function(){deleteMsg(m.id);});
    return d;
  }

  function renderAll(msgs){
    feed.innerHTML='';
    if(!msgs.length){feed.innerHTML='<div class="forum-empty">No messages yet. Be the first!</div>';return;}
    var pinned=msgs.filter(function(m){return m.admin;});
    var normal=msgs.filter(function(m){return !m.admin;});
    announcements.innerHTML='';
    pinned.forEach(function(m){
      var a=document.createElement('div');
      a.className='forum-announcement';
      a.innerHTML='<div class="forum-announcement-icon">📢</div>'
        +'<div class="forum-announcement-body">'
        +'<div class="forum-announcement-meta"><span class="forum-announcement-nick">'+(m.nick||'CHITIAN').replace(/[<>]/g,'')+'</span><span class="forum-announcement-time">'+timeAgo(m.time)+'</span></div>'
        +'<div class="forum-announcement-text">'+(m.text||'').replace(/[<>]/g,'')+'</div>'
        +'</div>';
      announcements.appendChild(a);
    });
    normal.forEach(function(m){feed.appendChild(renderMsg(m));});
    feed.scrollTop=feed.scrollHeight;
    if(msgCount) msgCount.textContent=msgs.length;
    if(onlineCount) onlineCount.textContent=Math.min(msgs.length+Math.floor(Math.random()*5)+1,42);
  }

  function loadMessages(){
    fetch(FORUM_API+'/forum/list').then(function(r){return r.json();}).then(function(d){
      if(d&&d.messages) renderAll(d.messages);
    }).catch(function(){
      feed.innerHTML='<div class="forum-empty">Could not connect to forum server.</div>';
    });
  }

  function postMsg(){
    var t=input.value.trim();
    var n=(nick.value.trim()||'Anonymous').slice(0,32);
    if(!t) return;
    if(n!==myNick){myNick=n;localStorage.setItem('forum-nick',n);}
    var headers={'Content-Type':'application/json'};
    if(ADMIN_TOKEN) headers['X-Admin-Token']=ADMIN_TOKEN;
    sendBtn.disabled=true;
    fetch(FORUM_API+'/forum/post',{
      method:'POST',headers:headers,
      body:JSON.stringify({nick:n,text:t})
    }).then(function(r){return r.json();}).then(function(d){
      input.value='';sendBtn.disabled=false;
      if(d&&d.messages) renderAll(d.messages);
      else loadMessages();
    }).catch(function(){sendBtn.disabled=false;});
  }

  function deleteMsg(id){
    var headers={'Content-Type':'application/json'};
    if(ADMIN_TOKEN) headers['X-Admin-Token']=ADMIN_TOKEN;
    fetch(FORUM_API+'/forum/delete',{
      method:'POST',headers:headers,
      body:JSON.stringify({id:id})
    }).then(function(){loadMessages();}).catch(function(){});
  }

  if(sendBtn) sendBtn.addEventListener('click',postMsg);
  if(input) input.addEventListener('keydown',function(e){
    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();postMsg();}
  });
  if(input) input.addEventListener('input',function(){
    if(charCount) charCount.textContent=input.value.length+' / 600';
  });
  if(refreshBtn) refreshBtn.addEventListener('click',function(e){e.preventDefault();loadMessages();});

  loadMessages();
  setInterval(loadMessages,15000);
})();

// ============ THEME CUSTOMIZER ============
document.addEventListener('DOMContentLoaded', function initThemeCustomizer(){
  const toggle = document.getElementById('theme-toggle');
  const panel = document.getElementById('theme-panel');
  const root = document.documentElement;
  let current = JSON.parse(localStorage.getItem('chitian-theme')||'{"color":"#ff2b3a","texture":"none","bg":"#05060a","mode":"solid","font":"mono","tilt":true,"scanlines":true,"glow":false}');

  function hexToRgb(h){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return{r,g,b}}
  function rgbToHex(r,g,b){return'#'+[r,g,b].map(x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('')}
  function lighten(hex,amt){const{r,g,b}=hexToRgb(hex);return rgbToHex(r+amt,g+amt,b+amt)}

  const ALL_TEX=['tex-dots','tex-lines','tex-grid','tex-diag','tex-cross','tex-hex','tex-wave','tex-plus','tex-triangles','tex-topo','tex-circuit','tex-noise','tex-matrix'];
  const ALL_MODE=['bg-anim-gradient','bg-radial','bg-aurora'];
  const ALL_FONT=['font-mono','font-grotesk','font-inter','font-rajdhani','font-orbitron','font-chakra','font-audiowide','font-share','font-arcade'];

  function applyTheme(t){
    if(t.color){
      root.style.setProperty('--red',t.color);
      root.style.setProperty('--red-dim',t.color+'80');
      root.style.setProperty('--red-glow',t.color+'40');
      document.querySelectorAll('.theme-color').forEach(c=>c.classList.toggle('active',c.dataset.color===t.color));
      const inp=document.getElementById('theme-custom-color-input'), hx=document.getElementById('theme-custom-color-hex');
      if(inp){inp.value=t.color;hx.textContent=t.color;}
    }
    if(t.bg){
      const rgb=hexToRgb(t.bg);
      root.style.setProperty('--bg',t.bg);
      root.style.setProperty('--bg2',lighten(t.bg,7));
      root.style.setProperty('--bg3',lighten(t.bg,14));
      root.style.setProperty('--bg4',lighten(t.bg,21));
      root.style.setProperty('--bg-rgb',rgb.r+','+rgb.g+','+rgb.b);
      if(!t.mode||t.mode==='solid') document.body.style.backgroundColor=t.bg;
      document.querySelectorAll('.theme-bg-opt').forEach(b=>b.classList.toggle('active',b.dataset.bg===t.bg));
      const inp=document.getElementById('theme-custom-bg-input'), hx=document.getElementById('theme-custom-bg-hex');
      if(inp){inp.value=t.bg;hx.textContent=t.bg;}
    }
    if(typeof t.texture!=='undefined'){
      ALL_TEX.forEach(cl=>document.body.classList.remove(cl));
      if(t.texture!=='none') document.body.classList.add('tex-'+t.texture);
      document.querySelectorAll('.theme-texture').forEach(tx=>tx.classList.toggle('active',tx.dataset.texture===t.texture));
    }
    if(t.mode){
      ALL_MODE.forEach(cl=>document.body.classList.remove(cl));
      if(t.mode==='anim') document.body.classList.add('bg-anim-gradient');
      else if(t.mode==='radial') document.body.classList.add('bg-radial');
      else if(t.mode==='aurora') document.body.classList.add('bg-aurora');
      document.querySelectorAll('.theme-mode-btn').forEach(b=>b.classList.toggle('active',b.dataset.mode===t.mode));
      if(t.mode==='solid' && t.bg) document.body.style.backgroundColor=t.bg;
      else document.body.style.backgroundColor='';
    }
    if(t.font){
      ALL_FONT.forEach(cl=>document.body.classList.remove(cl));
      document.body.classList.add('font-'+t.font);
      document.querySelectorAll('.theme-font-btn').forEach(b=>b.classList.toggle('active',b.dataset.font===t.font));
    }
    document.body.classList.toggle('no-scanlines',t.scanlines===false);
    document.body.classList.toggle('extra-glow',t.glow===true);
    if(typeof t.tilt!=='undefined') window.__tiltEnabled = t.tilt;
    const tiltCk=document.getElementById('theme-tilt'); if(tiltCk) tiltCk.checked=!!t.tilt;
    const scCk=document.getElementById('theme-scanlines'); if(scCk) scCk.checked=t.scanlines!==false;
    const glCk=document.getElementById('theme-glow'); if(glCk) glCk.checked=!!t.glow;
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

  document.getElementById('theme-bgmode').addEventListener('click',e=>{
    const b=e.target.closest('.theme-mode-btn'); if(!b) return;
    current.mode=b.dataset.mode; applyTheme(current);
    showToast('Background mode: '+b.dataset.mode,'success');
  });
  document.getElementById('theme-fonts').addEventListener('click',e=>{
    const b=e.target.closest('.theme-font-btn'); if(!b) return;
    current.font=b.dataset.font; applyTheme(current);
    showToast('Font: '+b.dataset.font,'success');
  });
  const ccIn=document.getElementById('theme-custom-color-input');
  ccIn.addEventListener('input',e=>{
    current.color=e.target.value; applyTheme(current);
  });
  const cbIn=document.getElementById('theme-custom-bg-input');
  cbIn.addEventListener('input',e=>{
    current.bg=e.target.value; applyTheme(current);
  });
  document.getElementById('theme-tilt').addEventListener('change',e=>{current.tilt=e.target.checked;applyTheme(current);showToast('Image tilt '+(e.target.checked?'ON':'OFF'),'success');});
  document.getElementById('theme-scanlines').addEventListener('change',e=>{current.scanlines=e.target.checked;applyTheme(current);showToast('Scanlines '+(e.target.checked?'ON':'OFF'),'success');});
  document.getElementById('theme-glow').addEventListener('change',e=>{current.glow=e.target.checked;applyTheme(current);showToast('Extra glow '+(e.target.checked?'ON':'OFF'),'success');});

  document.getElementById('theme-reset').addEventListener('click',()=>{
    current={color:'#ff2b3a',texture:'none',bg:'#05060a',mode:'solid',font:'mono',tilt:true,scanlines:true,glow:false};
    root.style.removeProperty('--red');
    root.style.removeProperty('--red-dim');
    root.style.removeProperty('--red-glow');
    root.style.removeProperty('--bg');
    root.style.removeProperty('--bg2');
    root.style.removeProperty('--bg3');
    root.style.removeProperty('--bg4');
    root.style.removeProperty('--bg-rgb');
    document.body.style.backgroundColor='';
    ALL_TEX.forEach(cl=>document.body.classList.remove(cl));
    ALL_MODE.forEach(cl=>document.body.classList.remove(cl));
    ALL_FONT.forEach(cl=>document.body.classList.remove(cl));
    applyTheme(current);
    showToast('Theme reset to default!','success');
  });

  // Initial apply on load
  applyTheme(current);

  // =========================================================
  // IMAGE TILT + ZOOM EFFECT (follows cursor)
  // =========================================================
  window.__tiltEnabled = current.tilt !== false;
  function initTiltEffect(){
    var selectors = ['.gameplay-img','.product-card img','.game-card img','.feature-card img','.review-card img','.hover-tilt','.gameplay-preview','.hero-image','.product-media'];
    var targets = [];
    selectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){ if(targets.indexOf(el)===-1) targets.push(el); });
    });
    // Fallback: any large gameplay jpg
    document.querySelectorAll('img').forEach(function(img){
      if(img.src && /gameplay/i.test(img.src) && targets.indexOf(img)===-1) targets.push(img);
    });

    targets.forEach(function(el){
      if(el.__tiltBound) return;
      el.__tiltBound = true;
      var wrap = el;
      // Ensure the element can 3D-transform
      var origTransition = wrap.style.transition;
      wrap.classList.add('tilt-target');
      // Add glare overlay if the element can host one
      var parent = wrap;
      if(getComputedStyle(parent).position==='static') parent.style.position='relative';
      var glare = document.createElement('div');
      glare.className='tilt-glare';
      try{ parent.appendChild(glare); }catch(e){}

      function onMove(e){
        if(!window.__tiltEnabled) return;
        var r = wrap.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        var rx = (0.5 - y) * 16;   // rotateX
        var ry = (x - 0.5) * 20;   // rotateY
        wrap.style.transform = 'perspective(900px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg) scale(1.06)';
        wrap.style.boxShadow = '0 30px 60px rgba(0,0,0,.5), 0 0 40px var(--red-glow)';
        if(glare){
          glare.style.background='linear-gradient('+ (Math.atan2(y-0.5,x-0.5)*180/Math.PI+90).toFixed(0) +'deg, transparent 40%, rgba(255,255,255,.22) 50%, transparent 60%)';
          glare.style.opacity='1';
        }
      }
      function onLeave(){
        wrap.style.transform='';
        wrap.style.boxShadow='';
        if(glare) glare.style.opacity='0';
      }
      wrap.addEventListener('mousemove',onMove);
      wrap.addEventListener('mouseleave',onLeave);
    });
  }
  // Run now and after any late DOM inserts
  initTiltEffect();
  setTimeout(initTiltEffect, 500);
  setTimeout(initTiltEffect, 1500);

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


