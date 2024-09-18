document.addEventListener('DOMContentLoaded', function () {
    const cy = cytoscape({
        container: document.getElementById('cy'),
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#666',
                    'label': 'data(title)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': '#fff',
                    'font-size': '16px',
                    'width': '100px',
                    'height': '60px',
                    'border-color': '#000',
                    'border-width': '2px',
                    'text-wrap': 'wrap',
                    'text-max-width': '100px',
                    'font-weight': 'bold'
                }
            },
            {
                selector: 'node.node-attacker',
                style: {
                    'background-color': '#b3b3b3',  // Neutral grey color
                    'shape': 'ellipse',
                    'width': '80px',
                    'height': '80px',
                    'border-color': '#ffffff',
                    'border-width': '3px',
                    'text-valign': 'bottom',
                    'text-halign': 'center',
                    'font-size': '14px',
                    'color': '#ffffff',
                    'background-fit': 'cover',
                    'background-clip': 'none',
                    'background-opacity': '1',
                    'font-weight': 'bold',
                    'text-wrap': 'wrap',
                    'text-max-width': '80px'
                }
            },
            {
                selector: 'node.node-normal',
                style: {
                    'background-color': '#3b82f6',
                    'shape': 'round-rectangle',
                    'width': '100px',
                    'height': '60px',
                    'border-color': '#ffffff',
                    'border-width': '2px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'font-size': '12px',
                    'color': '#ffffff',
                    'text-wrap': 'wrap',
                    'text-max-width': '100px',
                    'font-weight': 'bold'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 4,
                    'line-color': '#8e8e8e',
                    'target-arrow-color': '#8e8e8e',
                    'target-arrow-shape': 'triangle'
                }
            },
            {
                selector: 'edge.edge-critical',
                style: {
                    'line-color': '#ff3b3f',
                    'target-arrow-color': '#ff3b3f',
                    'target-arrow-shape': 'triangle'
                }
            }
        ],
        elements: []
    });

    const cloudProviderIcons = {
        Azure: 'https://img.icons8.com/fluency/48/000000/azure-1.png',
        AWS: 'https://img.icons8.com/color/48/000000/amazon-web-services.png',
        GCP: 'https://img.icons8.com/color/48/000000/google-cloud.png'
    };

    const expandedNodes = {};

    document.getElementById('cloudProvider').addEventListener('change', loadProviderData);
    document.getElementById('authMethod').addEventListener('change', loadProviderData);
    document.getElementById('resetBtn').addEventListener('click', resetGraph);

    let currentElements = {}; // To store the current elements based on the selected provider and auth method

    function loadProviderData() {
        const provider = document.getElementById('cloudProvider').value;
        const authMethod = document.getElementById('authMethod').value;
        console.log('Selected provider:', provider);
        console.log('Selected authentication method:', authMethod);
        
        if (provider && authMethod) {
            const providerFile = `data/${provider.toLowerCase()}/${authMethod}.json`;
            console.log('Loading file:', providerFile);
            fetch(providerFile)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    currentElements = data; // Store the loaded elements
                    console.log('Loaded elements for', provider, currentElements);
                    updateGraph(); // Attempt to update the graph
                })
                .catch(error => console.error('Error loading provider data:', error));
        } else {
            console.error('Provider or authentication method not selected');
        }
    }

    function updateGraph() {
        const authMethod = document.getElementById('authMethod').value;
        const provider = document.getElementById('cloudProvider').value;

        console.log('Selected provider:', provider);
        console.log('Selected authentication method:', authMethod);

        if (!provider) {
            console.error('No provider selected');
            return;
        }

        if (!authMethod) {
            console.error('No authentication method selected');
            return;
        }

        if (currentElements.elements && currentElements.elements.length > 0) {
            console.log('Updating graph with elements:', currentElements.elements);
            cy.elements().remove();
            cy.add(currentElements.elements);
            cy.style()
                .selector('node.node-attacker')
                .style({
                    'background-image': cloudProviderIcons[provider],
                    'background-color': '#b3b3b3',  // Neutral grey color
                    'text-valign': 'bottom',        // Move label above the node
                    'font-weight': 'bold'           // Make the label bold
                })
                .update();
            cy.layout({
                name: 'breadthfirst',
                directed: true,
                padding: 10,
                animate: true,
                animationDuration: 500
            }).run();

            cy.on('tap', 'node', function(evt){
                const node = evt.target;
                toggleNode(node.id());
                node.addClass('node-selected');

                // Check if the node is not a category before displaying the modal
                if (!node.data('category')) {
                    // Display modal with detailed information
                    $('#nodeModal').modal('show');
                    document.getElementById('nodeTitle').innerText = node.data('title');
                    document.getElementById('nodeDescription').innerText = node.data('description');
                    document.getElementById('ifSuccussed').innerText = node.data('ifSuccussed');
                    document.getElementById('nodeCommand').innerText = node.data('command');
                    const referenceElement = document.getElementById('nodeReference');
                    referenceElement.href = node.data('reference');
                    referenceElement.innerText = node.data('reference');
                }
            });

            cy.on('tap', function(event){
                if(event.target === cy){
                    cy.nodes().removeClass('node-selected');
                }
            });
        } else {
            console.error('No elements found for the selected authentication method:', authMethod);
        }
    }

    function toggleNode(nodeId) {
        if (expandedNodes[nodeId]) {
            collapseNode(nodeId);
        } else {
            expandNode(nodeId);
        }
    }

    function expandNode(nodeId) {
        if (currentElements[nodeId] && currentElements[nodeId].length > 0) {
            const additionalElements = currentElements[nodeId];
            console.log('Expanding node:', nodeId, additionalElements);

            if (additionalElements.length > 0) {
                cy.add(additionalElements);
                cy.layout({
                    name: 'breadthfirst',
                    directed: true,
                    padding: 10,
                    animate: true,
                    animationDuration: 500
                }).run();
                expandedNodes[nodeId] = additionalElements.map(el => el.data.id);
            }
        }
    }

    function collapseNode(nodeId) {
        if (expandedNodes[nodeId]) {
            const nodesToRemove = expandedNodes[nodeId];
            cy.remove(cy.nodes().filter(node => nodesToRemove.includes(node.id())));
            cy.remove(cy.edges().filter(edge => nodesToRemove.includes(edge.data('source')) || nodesToRemove.includes(edge.data('target'))));
            delete expandedNodes[nodeId];
        }
    }

    function resetGraph() {
        cy.elements().remove();
        document.getElementById('cloudProvider').value = '';
        document.getElementById('authMethod').value = '';
        currentElements = {};
    }

    // Copy command to clipboard
    document.getElementById('copyCommand').addEventListener('click', function() {
        const commandText = document.getElementById('nodeCommand').innerText;
        navigator.clipboard.writeText(commandText).then(() => {
            alert('Command copied to clipboard');
        });
    });
});
