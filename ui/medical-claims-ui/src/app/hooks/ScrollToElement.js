
function waitForElement(selector) {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver(mutations => {
			if (document.querySelector(selector)) {
				observer.disconnect();
				resolve(document.querySelector(selector));
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}

export default function scrollToElement(scrollId) {
	setTimeout(
		async () => {
			const element = await waitForElement(`[scroll-id=${scrollId}]`);
			element.scrollIntoView({ behavior: 'smooth' });
		},
	0);
}
