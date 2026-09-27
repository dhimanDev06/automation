(async () => {
  // --- STEP 1: Runs immediately on initial load ---
  if (!sessionStorage.getItem("firstStepComplete")) {
    
    // 1. First IIFE completes fully
    const result1 = await (async () => {
  const config = {
    credentials: { username: 'SarmilaB', password: 'Sarmila@2026' },
    journey: {
      fromStation: 'SEALDAH - SDAH (Howrah / Kolkata)',
      toStation: 'MALDA TOWN - MLDT (MALDA TOWN)',
      quota: 'TATKAL',
      travelClass: 'Sleeper (SL)',
      trainName: 'GOUR EXPRESS (13153)',
      dateOffsetDays: 1
    },
    passengers: ['Dhiman','Susmita','Arun']
  };

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const waitFor = (sel, interval=200, max=15) => new Promise((res, rej) => {
    let tries=0;
    (function check(){
      const el=document.querySelector(sel);
      if(el) res(el);
      else if(tries++<max) setTimeout(check, interval);
      else rej("Not found: "+sel);
    })();
  });

  async function selectPassenger(input, keyword) {
    input.focus();
    input.value = keyword[0];
    input.dispatchEvent(new Event('input',{bubbles:true}));
    for(let i=0;i<15;i++){
      await sleep(100);
      const opt=[...document.querySelectorAll('li[role="option"], .ui-autocomplete-list-item')]
        .find(el=>el.textContent.toLowerCase().includes(keyword.toLowerCase()));
      if(opt){ opt.click(); console.log(`✔ ${keyword}`); return; }
    }
    console.warn(`Passenger ${keyword} not found`);
  }

  try {
    // LOGIN
    (await waitFor('a.search_btn.loginText[aria-label="Click here to Login in application"]')).click();
    const user=await waitFor('input[formcontrolname="userid"]');
    const pass=await waitFor('input[formcontrolname="password"]');
    user.value=config.credentials.username;
    pass.value=config.credentials.password;
    user.dispatchEvent(new Event('input',{bubbles:true}));
    pass.dispatchEvent(new Event('input',{bubbles:true}));
    (await waitFor('button.search_btn.train_Search.train_Search_custom_hover[type="submit"]')).click();

    // STATIONS
    const [from,to]=await Promise.all([
      waitFor('input[aria-label="Enter From station. Input is Mandatory."]'),
      waitFor('input[aria-label="Enter To station. Input is Mandatory."]')
    ]);
    from.value=config.journey.fromStation;
    to.value=config.journey.toStation;
    from.dispatchEvent(new Event('input',{bubbles:true}));
    to.dispatchEvent(new Event('input',{bubbles:true}));

    // DATE
    (await waitFor('span.ui-calendar input[placeholder]')).click();
    await sleep(200);
    const d=new Date(); d.setDate(d.getDate()+config.journey.dateOffsetDays);
    const targetDay=d.getDate(), targetMonth=d.toLocaleString('default',{month:'long'}), targetYear=d.getFullYear();
    for(let i=0;i<6;i++){
      const m=document.querySelector('.ui-datepicker-month');
      const y=document.querySelector('.ui-datepicker-year');
      if(m?.textContent.includes(targetMonth) && y?.textContent.includes(targetYear)) break;
      document.querySelector('.ui-datepicker-next')?.click();
      await sleep(150);
    }
    [...document.querySelectorAll('.ui-datepicker-calendar td a')]
      .find(el=>el.textContent.trim()===targetDay.toString())?.click();

    // QUOTA & CLASS
    (await waitFor('#journeyQuota .ui-dropdown-trigger')).click();
    (await waitFor(`li[aria-label="${config.journey.quota}"]`)).click();
    (await waitFor('#journeyClass .ui-dropdown-trigger')).click();
    (await waitFor(`li[aria-label="${config.journey.travelClass}"]`)).click();

    // SEARCH TRAINS
    const sb=await waitFor('button.search_btn.train_Search[type="submit"]');
    sb.click();

    // AVAILABILITY
    let card;
    for(let i=0;i<20;i++){
      await sleep(250);
      card=[...document.querySelectorAll('app-train-avl-enq')]
        .find(el=>el.textContent.includes(config.journey.trainName));
      if(card) break;
    }
    if(!card) throw "Train card not found";
    [...card.querySelectorAll('.pre-avl')]
      .find(el=>el.textContent.includes(config.journey.travelClass))?.click();
    for(let i=0;i<20;i++){
      await sleep(200);
      const match=[...card.querySelectorAll('.pre-avl')]
        .find(el=>el.textContent.includes('AVAILABLE') && !el.textContent.includes('NOT'));
      if(match){ match.click(); card.querySelector('button.btnDefault.train_Search')?.click(); break; }
    }

    // PASSENGERS
    for(let i=0;i<config.passengers.length;i++){
      if(i===0){
        const input=await waitFor('input[placeholder*="Full Name"]');
        await selectPassenger(input,config.passengers[i]);
      } else {
        [...document.querySelectorAll('a span.prenext')]
          .find(el=>el.textContent.includes('+ Add Passenger'))?.click();
        await sleep(200);
        const inputs=document.querySelectorAll('input[placeholder*="Full Name"]');
        await selectPassenger(inputs[i],config.passengers[i]);
      }
      await sleep(200);
    }

    // CONTINUE
    [...document.querySelectorAll('button[type="submit"]')]
      .find(el=>el.textContent.includes('Continue'))?.click();

  } catch(err){ console.error("Script failed:",err); }
      return "First Done";
    })();
    console.log(result1);

    // Flag that step 1 is done
    sessionStorage.setItem("firstStepComplete", "true");
    console.log("First step complete. Monitoring URL for automatic redirect...");
  }

  // --- STEP 2: Continuously watch for the redirect path ---
  // Replace "/second-endpoint" with your actual target path
  const targetPath = '/nget/booking/reviewBooking';

  const checkRedirectLoop = setInterval(async () => {
    const currentPath = window.location.pathname;

    // Check if we hit the target URL AND the first step completed
    if (currentPath === targetPath && sessionStorage.getItem("firstStepComplete") === "true") {
      
      // Stop the loop immediately so it doesn't execute multiple times
      clearInterval(checkRedirectLoop);

      // 2. Second IIFE starts automatically upon detecting the redirect
      const result2 = await (async () => {
  
          const sleep = ms => new Promise(r => setTimeout(r, ms));

  const config = {
    selectors: {
      summaryContinue: 'button.btnDefault.train_Search[type="submit"]',
      paymentCategory: '#pay-type .bank-type',
      walletOption: 'span.col-pad',
      payBook: 'button.btn-primary'
    },
    payment: {
      category: 'Wallets / Cash Card',
      wallet: 'Amazonpay Wallet'
    },
    labels: {
      summaryContinue: 'Continue',
      payBook: 'Pay & Book'
    },
    retries: 50,
    delay: 250
  };

  console.log("🚀 Starting continuous IRCTC/Booking checkout automation...");

  // Generic retry helper
  async function clickWithRetry(selector, matchText, label) {
    let element = null;
    for (let i = 0; i < config.retries; i++) {
      await sleep(config.delay);
      element = [...document.querySelectorAll(selector)]
        .find(el => el.textContent.includes(matchText));
      if (element) {
        element.click();
        console.log(`✔ ${label} clicked.`);
        return element;
      }
    }
    console.error(`❌ ${label} not found.`);
    return null;
  }

  // Step 1: Summary Continue
  const finalContinueBtn = await clickWithRetry(
    config.selectors.summaryContinue,
    config.labels.summaryContinue,
    "Summary Continue button"
  );
  if (!finalContinueBtn) return;

  // Step 2: Payment category
  const walletBtn = await clickWithRetry(
    config.selectors.paymentCategory,
    config.payment.category,
    `${config.payment.category} category option`
  );
  if (!walletBtn) return;

  await sleep(400); // allow Angular view switch

  // Step 3: Specific wallet option
  let walletOptionBtn = null;
  for (let i = 0; i < config.retries; i++) {
    await sleep(config.delay);
    const spanEl = [...document.querySelectorAll(config.selectors.walletOption)]
      .find(el => el.textContent.includes(config.payment.wallet));
    if (spanEl) {
      walletOptionBtn = spanEl.closest('.link') || spanEl.closest('.bank-text') || spanEl;
      walletOptionBtn.click();
      console.log(`✔ ${config.payment.wallet} option successfully selected.`);
      break;
    }
  }
  if (!walletOptionBtn) return console.error(`❌ ${config.payment.wallet} option not found.`);

  await sleep(300);

  // Step 4: Pay & Book
  const payBookBtn = await clickWithRetry(
    config.selectors.payBook,
    config.labels.payBook,
    "Pay & Book button"
  );
  if (!payBookBtn) return "Second Done";
      })();
      console.log(result2);

      // Clean up storage for future runs
      sessionStorage.removeItem("firstStepComplete");
    }
  }, 200); // Checks the URL path every 200 milliseconds
})();
