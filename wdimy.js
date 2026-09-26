(() => {
    console.log("Starting course completion...");

    // Expand all curriculum sections
    document.querySelectorAll('.js-panel-toggler').forEach(btn => {
        if (btn.getAttribute('aria-expanded') === 'false') {
            btn.click();
        }
    });

    // Wait for the sections to expand before finding checkboxes
    setTimeout(() => {
        const checkboxes = document.querySelectorAll('input[data-purpose="progress-toggle-button"]');
        console.log(Found ${checkboxes.length} items);
        
        let completed = 0;

        checkboxes.forEach(cb => {
            try {
                // Skip already completed items
                if (cb.checked) return;

                // Enable checkbox
                cb.disabled = false;
                cb.removeAttribute('disabled');

                // Get parent label
                const label = cb.closest('label');
                if (label) {
                    label.classList.remove('ud-toggle-input-disabled');
                    // Click label first (React apps often listen here)
                    label.click();
                }

                // Fallback click on checkbox
                cb.click();

                // Fire events manually
                cb.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                cb.dispatchEvent(new Event('change', { bubbles: true }));
                
                completed++;
            } catch (err) {
                console.error(err);
            }
        });

        console.log(Processed ${completed} items);
    }, 1000);
})();
