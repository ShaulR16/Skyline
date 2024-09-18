document.addEventListener('DOMContentLoaded', () => {
  const cloudProviders = [
      { name: 'AWS', icon: 'https://img.icons8.com/?size=100&id=wU62u24brJ44&format=png&color=000000' },
      { name: 'Azure', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
      { name: 'GCP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' }
  ];

  const cloudProvidersContainer = document.getElementById('cloud-providers');

  cloudProviders.forEach(provider => {
      const providerCard = document.createElement('div');
      providerCard.className = 'card';
      providerCard.innerHTML = `
          <img src="${provider.icon}" alt="${provider.name}" class="card-img-top">
          <div class="card-body">
              <h5 class="card-title">${provider.name}</h5>
          </div>
      `;
      providerCard.onclick = () => selectProvider(provider.name);
      cloudProvidersContainer.appendChild(providerCard);
  });

  function selectProvider(providerName) {
      // Clear existing content
      cloudProvidersContainer.innerHTML = '';
      // For example, showing the "Vault" service for Azure
      if (providerName === 'Azure') {
          const serviceCard = document.createElement('div');
          serviceCard.className = 'card';
          serviceCard.innerHTML = `
              <div class="card-body">
                  <h5 class="card-title">Vault</h5>
              </div>
          `;
          cloudProvidersContainer.appendChild(serviceCard);
      }
  }
});
