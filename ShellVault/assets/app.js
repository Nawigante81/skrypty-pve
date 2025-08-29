/* assets/app.js */
document.addEventListener('DOMContentLoaded', () => {
	const path = window.location.pathname;
	if (path.endsWith('/') || path.endsWith('index.html')) {
		initIndexPage();
	} else if (path.endsWith('script.html')) {
		initScriptPage();
	}
	initTooltips();
});

async function fetchScripts() {
	try {
		const response = await fetch('data/scripts.json');
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		return await response.json();
	} catch (error) {
		console.error("Could not fetch scripts data:", error);
		return null;
	}
}

async function initIndexPage() {
	const data = await fetchScripts();
	if (!data) return;

	const categoriesList = document.getElementById('categoriesList');
	const scriptGrid = document.getElementById('scriptGrid');
	const searchInput = document.getElementById('searchInput');
	const noResults = document.getElementById('noResults');
	const clearSearchBtn = document.getElementById('clearSearch');
	const allScripts = data.categories.flatMap(cat => cat.items.map(item => ({ ...item, categoryId: cat.id })));

	function renderCategories(categories) {
		categoriesList.innerHTML = `<li><a href="#" class="category-filter active" data-category-id="all">Wszystkie</a></li>`;
		categories.forEach(cat => {
			categoriesList.innerHTML += `<li><a href="#" class="category-filter" data-category-id="${cat.id}">${cat.name}</a></li>`;
		});
	}

	function renderScripts(scripts) {
		scriptGrid.innerHTML = '';
		noResults.style.display = scripts.length === 0 ? 'block' : 'none';
		if (scripts.length === 0) scriptGrid.appendChild(noResults);

		scripts.forEach(script => {
			const tagsHTML = script.tags.map(tag => `<span class="script-tag">${tag}</span>`).join('');
			const card = document.createElement('div');
			card.className = 'script-card';
			card.innerHTML = `
				<h3>${script.name}</h3>
				<p class="script-short-desc">${script.short}</p>
				<div class="script-tags">${tagsHTML}</div>
				<div class="script-checksum" data-tooltip="Sprawdź: sha256sum ${script.filename}">
					SHA256: <code>${script.sha256.substring(0, 8)}...</code>
				</div>
				<div class="script-actions">
					<a href="script.html?slug=${script.slug}" class="neon-button secondary small">Szczegóły</a>
					<a href="files/${script.filename}" download class="neon-button small">Pobierz</a>
				</div>
			`;
			scriptGrid.appendChild(card);
		});
		initTooltips();
	}

	function filterAndRender() {
		const searchTerm = searchInput.value.toLowerCase();
		const activeCategory = document.querySelector('.category-filter.active').dataset.categoryId;
		let filtered = allScripts;

		if (activeCategory !== 'all') {
			filtered = filtered.filter(s => s.categoryId === activeCategory);
		}
		if (searchTerm) {
			filtered = filtered.filter(s =>
				s.name.toLowerCase().includes(searchTerm) ||
				s.short.toLowerCase().includes(searchTerm) ||
				s.tags.some(tag => tag.toLowerCase().includes(searchTerm))
			);
		}
		renderScripts(filtered);
	}

	searchInput.addEventListener('input', filterAndRender);
	document.addEventListener('keydown', e => { if (e.key === '/') { e.preventDefault(); searchInput.focus(); } });
	categoriesList.addEventListener('click', e => {
		if (e.target.classList.contains('category-filter')) {
			e.preventDefault();
			document.querySelector('.category-filter.active').classList.remove('active');
			e.target.classList.add('active');
			filterAndRender();
		}
	});
	clearSearchBtn.addEventListener('click', () => {
		searchInput.value = '';
		document.querySelector('.category-filter.active').classList.remove('active');
		document.querySelector('.category-filter[data-category-id="all"]').classList.add('active');
		filterAndRender();
	});

	renderCategories(data.categories);
	renderScripts(allScripts);
}

async function initScriptPage() {
	const data = await fetchScripts();
	if (!data) return;

	const urlParams = new URLSearchParams(window.location.search);
	const slug = (urlParams.get('slug') || '').replace(/[^a-zA-Z0-9-]/g, '');
	const script = data.categories.flatMap(c => c.items).find(s => s.slug === slug);

	if (script) {
		document.getElementById('scriptDetailsContainer').style.display = 'flex';
		await displayScriptDetails(script);
	} else {
		document.getElementById('notFoundMessage').style.display = 'block';
	}
}

async function displayScriptDetails(script) {
	document.title = `${script.name} - ShellVault`;
	document.getElementById('scriptName').textContent = script.name;
	document.getElementById('scriptHeaderSubtitle').textContent = `Szczegóły: ${script.filename}`;
	document.getElementById('scriptFullDescription').textContent = script.short;
	document.getElementById('scriptSize').textContent = `${(script.size_bytes / 1024).toFixed(2)} KB`;
	document.getElementById('scriptSha256').textContent = script.sha256;
	document.getElementById('scriptTags').innerHTML = script.tags.map(tag => `<span class="script-tag">${tag}</span>`).join('');
	document.getElementById('scriptUsage').innerHTML = `<pre><code>${script.usage.join('\n')}</code></pre>`;
	document.getElementById('downloadButton').href = `files/${script.filename}`;

	const codePreview = document.getElementById('scriptCodePreview');
	try {
		const response = await fetch(`files/${script.filename}`);
		const code = await response.text();
		codePreview.textContent = code;
		hljs.highlightElement(codePreview);
	} catch (error) {
		codePreview.textContent = 'Błąd podczas ładowania podglądu skryptu.';
	}
	initCopyButtons();
}

function initTooltips() {
	const tooltipElements = document.querySelectorAll('[data-tooltip]');
	const tooltip = document.getElementById('tooltip');
	tooltipElements.forEach(el => {
		el.addEventListener('mousemove', e => {
			tooltip.textContent = el.getAttribute('data-tooltip');
			tooltip.style.left = `${e.pageX + 15}px`;
			tooltip.style.top = `${e.pageY + 15}px`;
		});
		el.addEventListener('mouseenter', () => tooltip.classList.add('visible'));
		el.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
	});
}

function initCopyButtons() {
	document.querySelectorAll('.copy-button').forEach(button => {
		button.addEventListener('click', () => {
			const targetId = button.dataset.copyTarget;
			const textToCopy = document.getElementById(targetId).textContent;
			navigator.clipboard.writeText(textToCopy).then(() => {
				const feedback = button.nextElementSibling;
				if (feedback && feedback.classList.contains('copy-feedback')) {
					feedback.classList.add('show');
					setTimeout(() => feedback.classList.remove('show'), 2000);
				}
			});
		});
	});
}
