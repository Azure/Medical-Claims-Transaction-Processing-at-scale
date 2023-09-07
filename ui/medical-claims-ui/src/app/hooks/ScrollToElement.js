
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
		() => waitForElement(`[scroll-id=${scrollId}]`).then((element) => {
			element.scrollIntoView({ behavior: 'smooth' });
	}), 0);
}
