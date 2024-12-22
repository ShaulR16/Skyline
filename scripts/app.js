document.addEventListener('DOMContentLoaded', () => {
    // Load cloud providers and services data from external JSON files
    let cloudProviders = [];
    let services = {};
    
    // Fetch cloud provider data
    fetch('cloudProviders.json')
      .then(response => response.json())
      .then(data => {
        cloudProviders = data;
        populateCloudProviders();
      })
      .catch(error => console.error('Error fetching cloud providers:', error));
    
    // Fetch services data
    fetch('services.json')
      .then(response => response.json())
      .then(data => {
        services = data;
      })
      .catch(error => console.error('Error fetching services:', error));

    const cloudProvidersContainer = document.getElementById('cloud-providers');
    const attackPathContainer = document.getElementById('attack-path');
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    const modalBodyContent = document.getElementById('modal-body-content');
    const attackPathsContainer = document.createElement('div');
    attackPathsContainer.className = 'attack-path-container';  // Ensure the container has the correct class

    // Function to populate cloud providers
    function populateCloudProviders() {
      cloudProvidersContainer.innerHTML = '';
      cloudProviders.forEach(provider => {
        const providerCard = document.createElement('div');
        providerCard.className = 'card';  // Use card class for cloud providers
        providerCard.innerHTML = `
            <img src="${provider.icon}" alt="${provider.name}" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">${provider.name}</h5>
            </div>
        `;
        providerCard.onclick = () => selectProvider(provider.name);
        cloudProvidersContainer.appendChild(providerCard);
      });
    }

    function selectProvider(providerName) {
        // Services data will be loaded from the external JSON file
    // const services = { ... };

        cloudProvidersContainer.innerHTML = '';
        attackPathContainer.innerHTML = '';
        attackPathsContainer.innerHTML = '';

        services[providerName].forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';  // Use service-card class for services
            serviceCard.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${service}</h5>
                </div>
            `;
            serviceCard.onclick = () => selectService(providerName, service);
            cloudProvidersContainer.appendChild(serviceCard);
        });

        // Add "What I have" option
        const whatIHaveCard = document.createElement('div');
        whatIHaveCard.className = 'service-card';  // Use service-card class for "What I have"
        whatIHaveCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">What I have</h5>
            </div>
        `;
        whatIHaveCard.onclick = () => selectWhatIHave(providerName);
        cloudProvidersContainer.appendChild(whatIHaveCard);
    }

    async function selectService(providerName, serviceName) {
        const folderPath = `data/${providerName.toLowerCase()}/${serviceName.toLowerCase().replace(/ /g, '-')}/`;
        const fileList = await getJsonFileList(folderPath);

        try {
            attackPathsContainer.innerHTML = '';
            const fetchPromises = fileList.map(file => fetch(folderPath + file).then(response => response.json()));
            const dataArray = await Promise.all(fetchPromises);

            dataArray.forEach(data => {
                if (data && data.nodes) {
                    const attackPathCard = document.createElement('div');
                    attackPathCard.className = 'attack-path-card';  // Use attack-path-card class for attack paths
                    attackPathCard.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">${data.title}</h5>
                            <img src="${data.icon}" alt="${data.title}" class="card-img-top">
                        </div>
                    `;
                    attackPathCard.onclick = () => renderAttackPath(data.nodes);
                    attackPathsContainer.appendChild(attackPathCard);
                } else {
                    console.error('Invalid data structure:', data);
                }
            });
            attackPathContainer.appendChild(attackPathsContainer);
        } catch (error) {
            console.error('Error loading service data:', error);
        }
    }

    async function getJsonFileList(folderPath) {
        // Manually list JSON files for demonstration purposes
        const files = {
            'aws': {
                'ec2': ['ec2-1.json', 'ec2-2.json', 'ec2-3.json', 'ec2-4.json', 'ec2-5.json', 'ec2-6.json', 'ec2-7.json'],
                's3': ['s3-1.json', 's3-2.json', 's3-3.json', 's3-4.json', 's3-5.json', 's3-6.json', 's3-7.json'],
                'rds': ['rds-1.json', 'rds-2.json', 'rds-3.json', 'rds-4.json', 'rds-5.json', 'rds-6.json', 'rds-7.json'],
                'lambda': ['lambda-1.json', 'lambda-2.json', 'lambda-3.json', 'lambda-4.json', 'lambda-5.json', 'lambda-6.json', 'lambda-7.json'],
                'vpc': ['vpc-1.json', 'vpc-2.json', 'vpc-3.json', 'vpc-4.json', 'vpc-5.json', 'vpc-6.json', 'vpc-7.json'],
                'dynamodb': ['dynamodb-1.json', 'dynamodb-2.json', 'dynamodb-3.json', 'dynamodb-4.json', 'dynamodb-5.json', 'dynamodb-6.json'],
                'cloudfront': ['cloudfront-1.json', 'cloudfront-2.json', 'cloudfront-3.json', 'cloudfront-4.json', 'cloudfront-5.json'],
                'cloudwatch': ['cloudwatch-1.json', 'cloudwatch-2.json', 'cloudwatch-3.json', 'cloudwatch-4.json', 'cloudwatch-5.json'],
                'sns': ['sns-1.json', 'sns-2.json', 'sns-3.json', 'sns-4.json', 'sns-5.json', 'sns-6.json'],
                'guardduty': ['guardduty-1.json', 'guardduty-2.json'],
                'iam': ['iam-1.json', 'iam-2.json', 'iam-3.json', 'iam-4.json', 'iam-5.json', 'iam-6.json', 'iam-7.json']
            },
            'azure': {
                'key-vault': ['key-vault-1.json', 'key-vault-2.json', 'key-vault-3.json', 'key-vault-4.json', 'key-vault-5.json', 'key-vault-6.json'],
                'blob-storage': ['blob-storage-1.json', 'blob-storage-2.json', 'blob-storage-3.json', 'blob-storage-4.json', 'blob-storage-5.json'],
                'app-services': ['app-service-1.json', 'app-service-2.json', 'app-service-3.json', 'app-service-4.json', 'app-service-5.json', 'app-service-6.json'],
                'azure-functions': ['azure-function-1.json', 'azure-function-2.json', 'azure-function-3.json', 'azure-function-4.json', 'azure-function-5.json', 'azure-function-6.json'],
                'cosmos-db': ['cosmos-db-1.json', 'cosmos-db-2.json', 'cosmos-db-3.json', 'cosmos-db-4.json', 'cosmos-db-5.json', 'cosmos-db-6.json'],
                'monitor': ['monitor-1.json', 'monitor-2.json', 'monitor-3.json', 'monitor-4.json', 'monitor-5.json', 'monitor-6.json'],
                'sql-database': ['sql-database-1.json', 'sql-database-2.json', 'sql-database-3.json', 'sql-database-4.json', 'sql-database-5.json'],
                'virtual-network': ['virtual-network-1.json', 'virtual-network-2.json','virtual-network-3.json','virtual-network-4.json','virtual-network-5.json','virtual-network-6.json','virtual-network-7.json'],
                'azure-active-directory': ['entra-id-1.json', 'entra-id-2.json', 'entra-id-3.json', 'entra-id-4.json', 'entra-id-5.json', 'entra-id-6.json'],
                'virtual-machines': ['vm-1.json', 'vm-2.json', 'vm-3.json', 'vm-4.json', 'vm-5.json', 'vm-6.json']
            },
            'gcp': {
                'compute-engine': ['compute-engine-1.json', 'compute-engine-2.json', 'compute-engine-3.json', 'compute-engine-4.json', 'compute-engine-5.json', 'compute-engine-6.json'],
                'cloud-storage': ['cloud-storage-1.json', 'cloud-storage-2.json', 'cloud-storage-3.json', 'cloud-storage-4.json', 'cloud-storage-5.json', 'cloud-storage-6.json'],
                'cloud-sql': ['cloud-sql-1.json', 'cloud-sql-2.json', 'cloud-sql-3.json', 'cloud-sql-4.json', 'cloud-sql-5.json', 'cloud-sql-6.json'],
                'bigquery': ['bigquery-1.json', 'bigquery-2.json', 'bigquery-3.json', 'bigquery-4.json', 'bigquery-5.json', 'bigquery-6.json'],
                'cloud-functions': ['cloud-functions-1.json', 'cloud-functions-2.json', 'cloud-functions-3.json', 'cloud-functions-4.json', 'cloud-functions-5.json', 'cloud-functions-6.json'],
                'vpc': ['vpc-1.json', 'vpc-2.json', 'vpc-3.json', 'vpc-4.json', 'vpc-5.json'],
                'iam': ['iam-1.json', 'iam-2.json', 'iam-3.json', 'iam-4.json'],
                'firestore': ['firestore-1.json', 'firestore-2.json', 'firestore-3.json', 'firestore-4.json', 'firestore-5.json'],
                'app-engine': ['app-engine-1.json', 'app-engine-2.json', 'app-engine-3.json', 'app-engine-4.json', 'app-engine-5.json'],
                'cloud-monitoring': ['cloud-monitoring-1.json', 'cloud-monitoring-2.json', 'cloud-monitoring-3.json', 'cloud-monitoring-4.json', 'cloud-monitoring-5.json']
            },
            'oracle': {
                'compute': ['compute-1.json'],
                'object-storage': ['object-storage-1.json'],
                'autonomous-database': ['autonomous-database-1.json'],
                'functions': ['functions-1.json'],
                'vcn': ['vcn-1.json'],
                'iam': ['iam-1.json'],
                'monitoring': ['monitoring-1.json'],
                'events': ['events-1.json'],
                'notifications': ['notifications-1.json'],
                'api-gateway': ['api-gateway-1.json']
            },
            'alicloud': {
                'elastic-compute-service': ['elastic-compute-service-1.json'],
                'object-storage-service': ['object-storage-service-1.json'],
                'apsaradb-rds': ['apsaradb-rds-1.json'],
                'function-compute': ['function-compute-1.json'],
                'virtual-private-cloud': ['virtual-private-cloud-1.json'],
                'resource-access-management': ['resource-access-management-1.json'],
                'cloud-monitor': ['cloud-monitor-1.json'],
                'eventbridge': ['eventbridge-1.json'],
                'message-service': ['message-service-1.json'],
                'api-gateway': ['api-gateway-1.json']
            }

        };

        const provider = folderPath.split('/')[1];
        const service = folderPath.split('/')[2];

        return files[provider][service] || [];
    }
    

    function renderAttackPath(nodes) {
        attackPathContainer.innerHTML = ''; // Clear previous nodes

        nodes.forEach((node, index) => {
            const nodeContainer = document.createElement('div');
            nodeContainer.className = 'node-container';
            
            const nodeElement = document.createElement('div');
            nodeElement.className = 'node';
            nodeElement.innerHTML = `
                <img src="${node.icon}" alt="${node.label}">
            `;
            
            const nodeTitle = document.createElement('div');
            nodeTitle.className = 'node-title';
            nodeTitle.innerText = node.label;
            
            nodeContainer.appendChild(nodeElement);
            nodeContainer.appendChild(nodeTitle);
            nodeContainer.onclick = () => showDetails(node.details);
            attackPathContainer.appendChild(nodeContainer);

            if (index < nodes.length - 1) {
                const linkElement = document.createElement('div');
                linkElement.className = 'link';
                linkElement.innerText = '➔';
                attackPathContainer.appendChild(linkElement);
            }
        });
    }

    function showDetails(details) {
        const modalContent = `
            <h5>${details.command || ''}</h5>
            <p>${details.description || ''}</p>
            <p><strong>Services:</strong> ${(details.services || []).join(', ')}</p>
            <p><strong>Attack Types:</strong> ${(details.attack_types || []).join(', ')}</p>
            <p><strong>References:</strong> <a href="${details.references || '#'}" target="_blank">${details.references || ''}</a></p>
            <div class="snippet-container">
                <pre><code id="command-snippet">${details.command || ''}</code></pre>
                <button class="copy-btn">
                    <img src="https://img.icons8.com/?size=100&id=pOSgnZrQOs6P&format=png&color=000000" alt="Copy">
                </button>
            </div>
        `;
        modalBodyContent.innerHTML = modalContent;
        detailsModal.show();

        document.querySelector('.copy-btn').addEventListener('click', () => {
            copyToClipboard(details.command || '');
        });
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Command copied to clipboard!');
        }).catch(err => {
            console.error('Could not copy text: ', err);
        });
    }

    // Placeholder function for "What I have" option
    function selectWhatIHave(providerName) {
        // Implement logic for "What I have" option
        alert(`Selected "What I have" for ${providerName}`);
    }
});
