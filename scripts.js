document.getElementById('category-filter').addEventListener('change', function (e) {
    const category = e.target.value;
    const categoryDivs = document.querySelectorAll('#tool-section div h3');

    categoryDivs.forEach(div => {
        if (category === 'all' || div.innerText.toLowerCase() === category.toLowerCase()) {
            div.parentElement.style.display = '';
        } else {
            div.parentElement.style.display = 'none';
        }
    });
});

const tools = {
    // (Your existing tools object)
};

const toolSection = document.getElementById('tool-section');

for (const platform in tools) {
    const platformDiv = document.createElement('div');
    platformDiv.innerHTML = `<h2>${platform.toUpperCase()}</h2>`;
    for (const category in tools[platform]) {
        const categoryDiv = document.createElement('div');
        categoryDiv.innerHTML = `<h3>${category}</h3>`;
        const commands = tools[platform][category];
        commands.forEach(cmd => {
            const commandDiv = document.createElement('div');
            commandDiv.innerHTML = `<p><code>${cmd.command}</code> - ${cmd.description}</p>`;
            categoryDiv.appendChild(commandDiv);
        });
        platformDiv.appendChild(categoryDiv);
    }
    toolSection.appendChild(platformDiv);
}
