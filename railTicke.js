(function() {
  // Step 1: Click the login/register button
  const loginBtn = document.querySelector('a.search_btn.loginText[aria-label="Click here to Login in application"]');
  if (loginBtn) {
    loginBtn.click();
    console.log("Login/Register button clicked!");
  } else {
    console.warn("Login/Register button not found.");
    return;
  }

  // Step 2: Fill credentials and submit
  const fillCredentials = () => {
    const userField = document.querySelector('input[formcontrolname="userid"]');
    const passField = document.querySelector('input[formcontrolname="password"]');
    const submitBtn = document.querySelector('button.search_btn.train_Search.train_Search_custom_hover[type="submit"]');

    if (userField && passField && submitBtn) {
      userField.value = "SarmilaB";
      passField.value = "Sarmila@2026";
      userField.dispatchEvent(new Event('input', { bubbles: true }));
      passField.dispatchEvent(new Event('input', { bubbles: true }));

      console.log("Credentials filled in!");
      submitBtn.click();
      console.log("Sign In button clicked!");

      // Step 3: After login, fill From/To stations
      const fillStations = () => {
        const fromField = document.querySelector('input[aria-label="Enter From station. Input is Mandatory."]');
        const toField   = document.querySelector('input[aria-label="Enter To station. Input is Mandatory."]');

        if (fromField && toField) {
          fromField.value = "SEALDAH - SDAH (Howrah / Kolkata)";
          toField.value   = "MALDA TOWN - MLDT (MALDA TOWN)";
          fromField.dispatchEvent(new Event('input', { bubbles: true }));
          toField.dispatchEvent(new Event('input', { bubbles: true }));

          console.log("Stations filled: From SDAH → To MLDT");

          // Step 4: Select Journey Quota = TATKAL
          const selectQuota = () => {
            const dropdownTrigger = document.querySelector('#journeyQuota .ui-dropdown-trigger');
            if (dropdownTrigger) {
              dropdownTrigger.click();
              console.log("Quota dropdown opened!");

              setTimeout(() => {
                const tatkalOption = document.querySelector('li[aria-label="TATKAL"]');
                if (tatkalOption) {
                  tatkalOption.click();
                  console.log("Journey Quota set to TATKAL");

                  // Step 5: Select Journey Class = AC 2 Tier (2A)
                  const selectClass = () => {
                    const classDropdownTrigger = document.querySelector('#journeyClass .ui-dropdown-trigger');
                    if (classDropdownTrigger) {
                      classDropdownTrigger.click();
                      console.log("Class dropdown opened!");

                      setTimeout(() => {
                        const ac3eOption = document.querySelector('li[aria-label="AC 2 Tier (2A)"]');
                        if (ac3eOption) {
                          ac3eOption.click();
                          console.log("Journey Class set to AC 2 Tier (2A)");

                          // Step 6: Click Search Trains button
                          const searchBtn = document.querySelector('button.search_btn.train_Search[type="submit"]');
                          if (searchBtn) {
                            searchBtn.click();
                            console.log("Search Trains button clicked!");
                          } else {
                            console.warn("Search Trains button not found.");
                          }
                        } else {
                          console.warn("AC 2 Tier (2A) option not found.");
                        }
                      }, 500);
                    } else {
                      setTimeout(selectClass, 500);
                    }
                  };

                  setTimeout(selectClass, 1000);
                } else {
                  console.warn("TATKAL option not found.");
                }
              }, 500);
            } else {
              setTimeout(selectQuota, 500);
            }
          };

          setTimeout(selectQuota, 1000);
        } else {
          setTimeout(fillStations, 500);
        }
      };

      setTimeout(fillStations, 1500);
    } else {
      setTimeout(fillCredentials, 500);
    }
  };

  fillCredentials();
})();


(function() {
  // Utility: wait for element and run callback
  function waitFor(selector, cb, interval = 500, maxTries = 20) {
    let tries = 0;
    (function check() {
      const el = document.querySelector(selector);
      if (el) cb(el);
      else if (tries++ < maxTries) setTimeout(check, interval);
      else console.warn("Element not found:", selector);
    })();
  }

  // Step 1: Click login/register
  waitFor('a.search_btn.loginText[aria-label="Click here to Login in application"]', btn => {
    btn.click();
    console.log("Login/Register clicked");

    // Step 2: Fill credentials and submit
    waitFor('input[formcontrolname="userid"]', user => {
      const pass = document.querySelector('input[formcontrolname="password"]');
      const submit = document.querySelector('button.search_btn.train_Search.train_Search_custom_hover[type="submit"]');
      if (user && pass && submit) {
        user.value = "SarmilaB";
        pass.value = "Sarmila@2026";
        user.dispatchEvent(new Event('input', { bubbles: true }));
        pass.dispatchEvent(new Event('input', { bubbles: true }));
        submit.click();
        console.log("Signed in");

        // Step 3: Fill stations
        waitFor('input[aria-label="Enter From station. Input is Mandatory."]', from => {
          const to = document.querySelector('input[aria-label="Enter To station. Input is Mandatory."]');
          if (to) {
            from.value = "SEALDAH - SDAH (Howrah / Kolkata)";
            to.value = "MALDA TOWN - MLDT (MALDA TOWN)";
            from.dispatchEvent(new Event('input', { bubbles: true }));
            to.dispatchEvent(new Event('input', { bubbles: true }));
            console.log("Stations filled");

            // Step 4: Select quota
            waitFor('#journeyQuota .ui-dropdown-trigger', dq => {
              dq.click();
              waitFor('li[aria-label="TATKAL"]', opt => {
                opt.click();
                console.log("Quota set to TATKAL");

                // Step 5: Select class
                waitFor('#journeyClass .ui-dropdown-trigger', dc => {
                  dc.click();
                  waitFor('li[aria-label="AC 2 Tier (2A)"]', opt => {
                    opt.click();
                    console.log("Class set to AC 2 Tier (2A)");

                    // Step 6: Click Search Trains
                    waitFor('button.search_btn.train_Search[type="submit"]', sb => {
                      sb.click();
                      sb.dispatchEvent(new Event('submit', { bubbles: true }));
                      console.log("Search Trains clicked!");
                    });
                  });
                });
              });
            });
          }
        });
      }
    });
  });
})();

(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms)),
          // Helper utility function to perfectly simulate a complete manual human click interaction pattern
          simulateHumanClick = el => {
              const opts = { bubbles: true, cancelable: true, view: window };
              el.dispatchEvent(new PointerEvent('pointerdown', opts));
              el.dispatchEvent(new MouseEvent('mousedown', opts));
              el.focus();
              el.dispatchEvent(new PointerEvent('pointerup', opts));
              el.dispatchEvent(new MouseEvent('mouseup', opts));
              el.click();
          };

    // 1. Wait until the form layout name input target renders
    let input = null;
    for (let i = 0; i < 40; i++) {
        input = document.querySelector('input[placeholder*="Full Name"]');
        if (input) break;
        await sleep(250);
    }
    if (!input) return;

    // 2. Execute a hardware-identical manual click sequence on the target text block input element
    simulateHumanClick(input);

    // 3. Wait for the dynamic autocomplete option card container to appear and click "Dhiman"
    for (let i = 0; i < 30; i++) {
        await sleep(200);
        const targetOption = [...document.querySelectorAll('li[role="option"], .ui-autocomplete-list-item')]
            .find(el => el.textContent.toLowerCase().includes('dhiman'));
            
        if (targetOption) {
            simulateHumanClick(targetOption);
            break;
        }
    }
})();
// final code block without payment
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

