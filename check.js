
(function(){
"use strict";

// ============ DATA ============
const PRODUCTS = [
  {id:'day',name:'Day Pass',price:7,period:'1 Day',features:['Full access to all features','Aimbot + ESP','Instant delivery','24 hour support'],btn:'Get Day Pass'},
  {id:'week',name:'Weekly',price:22,period:'7 Days',features:['Full access to all features','Aimbot + ESP + Misc','Priority support','HWID spoofer'],btn:'Get Weekly'},
  {id:'month',name:'Monthly',price:64,period:'30 Days',features:['Full access to all features','All cheats included','24/7 priority support','HWID spoofer + Updates','Free future updates'],btn:'Get Monthly',featured:true}
];

const FEATURES = [
  {icon:'&#9876;',title:'Aimbot',desc:'Pixel-perfect aiming assistance with customizable FOV, smoothing, and bone targeting.'},
  {icon:'&#128065;',title:'ESP / Wallhack',desc:'See enemies through walls with health bars, distance, weapons, and more.'},
  {icon:'&#9889;',title:'Triggerbot',desc:'Auto-fire when crosshair is on enemy. Configurable reaction time.'},
  {icon:'&#128736;',title:'HWID Spoofer',desc:'Built-in hardware ID spoofer to stay undetected on any system.'},
  {icon:'&#128274;',title:'Anti-Detect',desc:'Advanced bypass for EasyAntiCheat, BattlEye, and custom anti-cheats.'},
  {icon:'&#128640;',title:'Instant Delivery',desc:'Receive your license key instantly after payment. Start cheating in minutes.'},
  {icon:'&#128737;',title:'No Recoil',desc:'Remove weapon recoil completely for laser-like precision.'},
  {icon:'&#127918;',title:'Stream Proof',desc:'Undetectable on stream. Your audience won\'t see anything suspicious.'},
  {icon:'&#128295;',title:'Config System',desc:'Save and load custom configs. Share configs with friends.'}
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
  'FLASH SALE: 15% OFF MONTHLY PLAN - CODE: CHEAT15','UNDETECTED SINCE LAUNCH','INSTANT LICENSE DELIVERY',
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
  coupon: null,
  discount: 0,
  step: 1,
  method: 'card',
  cryptoCoin: 'btc',
  cryptoTimer: null,
  cryptoTime: 900,
  bootDone: false
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
  state.coupon = null;
  state.discount = 0;
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
    <div style="background:var(--bg2);border:1px solid ${p.featured?'var(--red)':'var(--border)'};border-radius:12px;padding:20px;display:flex;flex-direction:column;gap:12px;position:relative;${p.featured?'box-shadow:0 0 30px rgba(255,43,58,.15)'}">
      ${p.featured?'<div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:var(--red);color:#fff;font-size:10px;font-weight:700;padding:3px 12px;border-radius:20px">MAS POPULAR</div>':''}
      <div style="font-size:16px;font-weight:700;color:var(--text)">${p.name}</div>
      <div style="font-size:32px;font-weight:900;color:var(--red)">$${p.price}<span style="font-size:13px;color:var(--text-muted);font-weight:400">/${p.period}</span></div>
      <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;flex:1">${p.features.map(f=>'<li style="color:var(--text-dim);font-size:13px;display:flex;align-items:center;gap:8px"><span style="color:var(--green);font-weight:700">✓</span> '+f+'</li>').join('')}</ul>
      <button onclick="selectPlan('${p.id}');openCheckout();document.getElementById('game-detail-modal').classList.remove('active')" style="width:100%;padding:12px;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;background:${p.featured?'var(--red)':'var(--bg)'};color:${p.featured?'#fff':'var(--text)'};border:1px solid ${p.featured?'var(--red)':'var(--border)'};transition:transform .2s,box-shadow .2s" onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 4px 20px rgba(255,43,58,.3)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">${p.btn}</button>
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
function initCheckout(){
  const modal = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('modal-close');
  closeBtn.addEventListener('click',()=>modal.classList.remove('active'));
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('active');});

  // Step 1
  document.getElementById('step1-next').addEventListener('click',()=>goStep(2));
  document.getElementById('coupon-btn').addEventListener('click',applyCoupon);

  // Step 2
  document.getElementById('step2-next').addEventListener('click',()=>{
    if(validateAccount()) goStep(3);
  });
  document.getElementById('step2-back').addEventListener('click',()=>goStep(1));

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

function openCheckout(){
  state.step = 1;
  updateCheckoutTotals();
  document.getElementById('checkout-modal').classList.add('active');
  goStep(1);
}

function resetCheckout(){
  state.step = 1;
  state.coupon = null;
  state.discount = 0;
  document.getElementById('coupon-input').value = '';
  document.getElementById('coupon-applied').classList.remove('show');
  document.getElementById('discount-line').classList.remove('show');
  document.getElementById('acc-email').value = '';
  document.getElementById('acc-email2').value = '';
  document.getElementById('acc-user').value = '';
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
  let total = plan.price - state.discount;
  if(total < 0) total = 0;
  document.getElementById('checkout-plan-label').textContent = plan.name + ' - $' + plan.price;
  document.getElementById('checkout-total').textContent = '$' + total;
  document.getElementById('pay-card-amount').textContent = '$' + total;
  document.getElementById('paypal-amount').textContent = '$' + total;
}

function applyCoupon(){
  const code = document.getElementById('coupon-input').value.trim().toUpperCase();
  const validCoupons = {CHEAT15:{type:'percent',value:15},WELCOME:{type:'fixed',value:5},SAVE10:{type:'percent',value:10}};
  if(validCoupons[code]){
    const c = validCoupons[code];
    state.coupon = code;
    if(c.type==='percent') state.discount = Math.round(state.plan.price * c.value/100);
    else state.discount = c.value;
    document.getElementById('coupon-name').textContent = code + ' (-$'+state.discount+')';
    document.getElementById('coupon-applied').classList.add('show');
    document.getElementById('discount-line').classList.add('show');
    document.getElementById('discount-amount').textContent = '-$'+state.discount;
    updateCheckoutTotals();
    showToast('Coupon applied! -$'+state.discount, 'success');
  } else {
    showToast('Invalid coupon code','error');
  }
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
function validateAccount(){
  let ok = true;
  const email = document.getElementById('acc-email').value.trim();
  const email2 = document.getElementById('acc-email2').value.trim();
  const user = document.getElementById('acc-user').value.trim();
  document.getElementById('acc-email-error').textContent = '';
  document.getElementById('acc-email2-error').textContent = '';
  document.getElementById('acc-user-error').textContent = '';

  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    document.getElementById('acc-email-error').textContent = 'Valid email required';
    ok = false;
  }
  if(email !== email2){
    document.getElementById('acc-email2-error').textContent = 'Emails do not match';
    ok = false;
  }
  if(!user || user.length < 3){
    document.getElementById('acc-user-error').textContent = 'Username must be at least 3 characters';
    ok = false;
  }
  return ok;
}

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

})();
