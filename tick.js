(async function() {
  // Utility: wait for element
  function waitFor(selector, interval = 500, maxTries = 20) {
    return new Promise((resolve, reject) => {
      let tries = 0;
      (function check() {
        const el = document.querySelector(selector);
        if (el) resolve(el);
        else if (tries++ < maxTries) setTimeout(check, interval);
        else reject("Element not found: " + selector);
      })();
    });
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  try {
    // Step 1: Login/Register
    const loginBtn = await waitFor('a.search_btn.loginText[aria-label="Click here to Login in application"]');
    loginBtn.click();
    console.log("Login/Register clicked");

    // Step 2: Credentials
    const user = await waitFor('input[formcontrolname="userid"]');
    const pass = await waitFor('input[formcontrolname="password"]');
    const submit = await waitFor('button.search_btn.train_Search.train_Search_custom_hover[type="submit"]');
    user.value = "SarmilaB";
    pass.value = "Sarmila@2026";
    user.dispatchEvent(new Event('input', { bubbles: true }));
    pass.dispatchEvent(new Event('input', { bubbles: true }));
    submit.click();
    console.log("Signed in");

    // Step 3: Stations
    const from = await waitFor('input[aria-label="Enter From station. Input is Mandatory."]');
    const to = await waitFor('input[aria-label="Enter To station. Input is Mandatory."]');
    from.value = "SEALDAH - SDAH (Howrah / Kolkata)";
    to.value = "MALDA TOWN - MLDT (MALDA TOWN)";
    from.dispatchEvent(new Event('input', { bubbles: true }));
    to.dispatchEvent(new Event('input', { bubbles: true }));
    console.log("Stations filled");

    // Step 4: Quota
    const dq = await waitFor('#journeyQuota .ui-dropdown-trigger');
    dq.click();
    const quotaOpt = await waitFor('li[aria-label="TATKAL"]');
    quotaOpt.click();
    console.log("Quota set to TATKAL");

    // Step 5: Class
    const dc = await waitFor('#journeyClass .ui-dropdown-trigger');
    dc.click();
    const classOpt = await waitFor('li[aria-label="AC 2 Tier (2A)"]');
    classOpt.click();
    console.log("Class set to AC 2 Tier (2A)");

    // Step 6: Search Trains
    const sb = await waitFor('button.search_btn.train_Search[type="submit"]');
    sb.click();
    sb.dispatchEvent(new Event('submit', { bubbles: true }));
    console.log("Search Trains clicked!");

    // Step 7: Availability loop
    let card;
    for (let i = 0; i < 30; i++) {
      await sleep(500);
      card = [...document.querySelectorAll('app-train-avl-enq')]
        .find(el => el.textContent.includes('GOUR EXPRESS (13153)'));
      if (card) break;
    }
    if (!card) throw "Train card not found";

    [...card.querySelectorAll('.pre-avl')]
      .find(el => el.textContent.includes('AC 2 Tier (2A)'))?.click();

    for (let i = 0; i < 30; i++) {
      await sleep(300);
      const match = [...card.querySelectorAll('.pre-avl')]
        .find(el => el.textContent.includes('AVAILABLE') && !el.textContent.includes('#'));
      if (match) {
        match.click();
        await sleep(150);
        card.querySelector('button.btnDefault.train_Search')?.click();
        console.log("Availability selected and booking initiated!");
        break;
      }
    }

    // Step 8: Passenger 1 (Dhiman)
    let input1 = null;
    for (let i = 0; i < 40; i++) {
      input1 = document.querySelector('input[placeholder*="Full Name"]');
      if (input1) break;
      await sleep(250);
    }
    if (!input1) throw "Passenger input not found";

    input1.focus();
    input1.value = 'd';
    input1.dispatchEvent(new Event('input', { bubbles: true }));

    for (let i = 0; i < 30; i++) {
      await sleep(200);
      const opt = [...document.querySelectorAll('li[role="option"], .ui-autocomplete-list-item')]
        .find(el => el.textContent.toLowerCase().includes('dhiman'));
      if (opt) {
        opt.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        opt.click();
        console.log("Passenger Dhiman selected!");
        break;
      }
    }

    await sleep(400);

    // Step 9: Add second passenger
    const addBtn = [...document.querySelectorAll('a span.prenext')]
      .find(el => el.textContent.includes('+ Add Passenger'));
    if (!addBtn) throw "Add Passenger button not found";
    addBtn.click();
    console.log("Add Passenger clicked");

    // Step 10: Passenger 2 (Susmita)
    await sleep(500);
    const inputs = document.querySelectorAll('input[placeholder*="Full Name"]');
    const input2 = inputs[1];
    if (!input2) throw "Second passenger input not found";

    input2.focus();
    input2.value = 's';
    input2.dispatchEvent(new Event('input', { bubbles: true }));

    for (let i = 0; i < 30; i++) {
      await sleep(200);
      const opt = [...document.querySelectorAll('li[role="option"], .ui-autocomplete-list-item')]
        .find(el => el.textContent.toLowerCase().includes('susmita'));
      if (opt) {
        opt.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        opt.click();
        console.log("Passenger Susmita selected!");
        break;
      }
    }

    // Step 11: Continue
    await sleep(400);
    const continueBtn = [...document.querySelectorAll('button[type="submit"]')]
      .find(el => el.textContent.includes('Continue'));
    if (continueBtn) {
      continueBtn.click();
      console.log("✔ Continue button successfully clicked.");
    } else {
      throw "Continue button not found";
    }

  } catch (err) {
    console.error("Script failed:", err);
  }
})();


(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    
    console.log("🚀 Starting continuous IRCTC/Booking checkout automation...");

    // ==========================================
    // STEP 1: Click the summary page Continue button
    // ==========================================
    let finalContinueBtn = null;
    for (let i = 0; i < 50; i++) {
        await sleep(250);
        finalContinueBtn = [...document.querySelectorAll('button.btnDefault.train_Search[type="submit"]')]
            .find(el => el.textContent.includes('Continue'));
        
        if (finalContinueBtn) {
            finalContinueBtn.click();
            console.log("✔ Summary Continue button clicked.");
            break;
        }
    }
    if (!finalContinueBtn) return console.error("❌ Summary Continue button not found.");

    // ==========================================
    // STEP 2: Select the "Wallets / Cash Card" category panel
    // ==========================================
    let walletBtn = null;
    for (let i = 0; i < 50; i++) {
        await sleep(250);
        walletBtn = [...document.querySelectorAll('#pay-type .bank-type')]
            .find(el => el.textContent.includes('Wallets / Cash Card'));
        
        if (walletBtn) {
            walletBtn.click();
            console.log("✔ Wallets / Cash Card category option clicked.");
            break;
        }
    }
    if (!walletBtn) return console.error("❌ Wallets option timeline timeout.");

    // Optional brief sleep step to accommodate Angular view switching states
    await sleep(400);

    // ==========================================
    // STEP 3: Select the specific "Amazonpay Wallet" option
    // ==========================================
    let amazonPayBtn = null;
    for (let i = 0; i < 50; i++) {
        await sleep(250);
        const spanEl = [...document.querySelectorAll('span.col-pad')]
            .find(el => el.textContent.includes('Amazonpay Wallet'));
        
        if (spanEl) {
            // Safe fallback checking outer wrapper elements carrying framework click event configurations
            amazonPayBtn = spanEl.closest('.link') || spanEl.closest('.bank-text') || spanEl;
            amazonPayBtn.click();
            console.log("✔ Amazonpay Wallet option successfully selected.");
            break;
        }
    }
    if (!amazonPayBtn) return console.error("❌ Amazonpay Wallet option not found.");

    await sleep(300);

    // ==========================================
    // STEP 4: Click the final "Pay & Book" button
    // ==========================================
    let payBookBtn = null;
    for (let i = 0; i < 50; i++) {
        await sleep(250);
        payBookBtn = [...document.querySelectorAll('button.btn-primary')]
            .find(el => el.textContent.includes('Pay & Book'));
        
        if (payBookBtn) {
            payBookBtn.click();
            console.log("✔ Pay & Book button successfully clicked.");
            break;
        }
    }
    if (!payBookBtn) console.error("❌ Pay & Book button not found.");
})();