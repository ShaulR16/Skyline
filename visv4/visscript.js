


if (typeof cytoscapeDagre !== 'undefined') {
    cytoscape.use(cytoscapeDagre);
}


if (typeof cytoscape('core', 'contextMenus') !== 'function') {
    cytoscape.use(cytoscapeContextMenus);
}


if (typeof cytoscape.use === 'function') {
    try {
        
        const popperExtension = require('cytoscape-popper');
        cytoscape.use(popperExtension);
    } catch (e) {
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const cloudProviderSelect = document.getElementById('cloudProvider');
    const cliCommandDiv = document.getElementById('cliCommand');
    const copyCommandBtn = document.getElementById('copyCommandBtn');
    const parseBtn = document.getElementById('parseBtn');
    const resetBtn = document.getElementById('resetBtn'); 
    const jsonInput = document.getElementById('jsonInput');
    const cyContainer = document.getElementById('cy');
    const actionsContainer = document.getElementById('actionsContainer'); 

    
    let cy = cytoscape({
        container: cyContainer,
        style: [ 
            {
                selector: 'node',
                style: {
                    'label': 'data(label)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'font-size': '14px',
                    'font-weight': 'bold',
                    'color': '#ffffff',
                    'text-wrap': 'wrap',
                    'text-max-width': '120px',
                    'padding': '10px',
                    'border-width': '2px',
                    'border-color': '#ffffff',
                    'background-opacity': 1,
                    'transition-property': 'background-color, border-color, width, height',
                    'transition-duration': '0.3s'
                }
            },
            {
                selector: '.node-attacker',
                style: {
                    'background-color': '#ff3b3f',
                    'shape': 'ellipse',
                    'width': '100px',
                    'height': '100px',
                    'border-width': '2px',
                    'border-color': '#ffffff'
                }
            },
            {
                selector: '.node-normal',
                style: {
                    'background-color': '#3b82f6',
                    'shape': 'round-rectangle',
                    'width': '120px',
                    'height': '80px',
                    'border-width': '2px',
                    'border-color': '#ffffff'
                }
            },
            {
                selector: '.node-offensive',
                style: {
                    'background-color': '#ffbf00',
                    'shape': 'ellipse',
                    'width': '140px',
                    'height': '80px',
                    'border-width': '2px',
                    'border-color': '#ffffff'
                }
            },
            {
                selector: '.step-node',
                style: {
                    'background-color': '#a8d0e6',
                    'shape': 'diamond',
                    'width': '120px',
                    'height': '80px',
                    'border-width': '2px',
                    'border-color': '#ffffff'
                }
            },
            {
                selector: '.node-combined-permissions',
                style: {
                    'background-color': '#6c757d',
                    'shape': 'hexagon',
                    'width': '120px',
                    'height': '80px',
                    'border-width': '2px',
                    'border-color': '#ffffff'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 4,
                    'line-color': '#2A9D8F',
                    'target-arrow-color': '#2A9D8F',
                    'target-arrow-shape': 'triangle',
                    'curve-style': 'bezier',
                    'label': 'data(label)',
                    'font-size': '12px',
                    'text-rotation': 'autorotate',
                    'color': '#ffffff',
                    'font-weight': 'bold',
                    'arrow-scale': 1.5,
                    'transition-property': 'width, line-color, target-arrow-color',
                    'transition-duration': '0.3s'
                }
            },
            {
                selector: '.edge-allowed',
                style: {
                    'line-color': '#2A9D8F',
                    'target-arrow-color': '#2A9D8F',
                    'width': '4px'
                }
            },
            {
                selector: '.edge-critical',
                style: {
                    'line-color': '#E76F51',
                    'target-arrow-color': '#E76F51',
                    'width': '4px'
                }
            },
            {
                selector: '.edge-step',
                style: {
                    'line-color': '#a8d0e6',
                    'target-arrow-color': '#a8d0e6',
                    'width': '4px'
                }
            },
            {
                selector: '.edge-combined-permissions',
                style: {
                    'line-color': '#17a2b8',
                    'target-arrow-color': '#17a2b8',
                    'width': '4px'
                }
            },
            /* Hover and Selection Styles */
            {
                selector: 'node:selected',
                style: {
                    'border-width': '4px',
                    'border-color': '#ffeb3b'
                }
            },
            {
                selector: 'node.hover',
                style: {
                    'border-width': '4px',
                    'border-color': '#ffeb3b'
                }
            },
            {
                selector: 'edge.hover',
                style: {
                    'width': '6px',
                    'line-color': '#ffeb3b',
                    'target-arrow-color': '#ffeb3b',
                    'transition-property': 'width, line-color, target-arrow-color',
                    'transition-duration': '0.3s'
                }
            },
            {
                selector: 'edge:selected',
                style: {
                    'width': '6px',
                    'line-color': '#ffeb3b',
                    'target-arrow-color': '#ffeb3b'
                }
            }
        ],
        elements: [],
        layout: {
            name: 'dagre',
            nodeSep: 80,
            edgeSep: 20,
            rankSep: 100,
            rankDir: 'LR',
            animate: true,
            animationDuration: 500,
            animationEasing: 'ease-in-out'
        },
        wheelSensitivity: 0.1,
        userZoomingEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false,
        autoungrabify: false,
    });

    
    const cliCommands = {
        'AWS': `# AWS Permissions Simulation Command
aws iam simulate-principal-policy \\
    --policy-source-arn $(aws sts get-caller-identity --query Arn --output text) \\
    --action-names '*' \\
    --output json`,

        'Azure': `# Azure Role Assignments Command
az role assignment list \\
    --include-inherited \\
    --include-groups \\
    --output json`,

        'GCP': `# GCP IAM Policy Command
gcloud projects get-iam-policy [PROJECT_ID] \\
    --format=json

# Or for specific role details:
gcloud iam roles describe [ROLE_ID] \\
    --project=[PROJECT_ID] \\
    --format=json`
    };

    
    cloudProviderSelect.addEventListener('change', function () {
        const selectedProvider = this.value;
        if (selectedProvider && cliCommands[selectedProvider]) {
            cliCommandDiv.innerHTML = `<pre class="code">${cliCommands[selectedProvider]}</pre>`;
            copyCommandBtn.style.display = 'inline-block';
        } else {
            cliCommandDiv.innerHTML = '';
            copyCommandBtn.style.display = 'none';
        }
    });

    
    const clipboard = new ClipboardJS('#copyCommandBtn', {
        text: function () {
            const pre = cliCommandDiv.querySelector('pre');
            return pre ? pre.textContent : '';
        }
    });

    clipboard.on('success', function (e) {
        showAlert('Command copied to clipboard!', 'success');
        e.clearSelection();
    });

    clipboard.on('error', function (e) {
        showAlert('Failed to copy command. Please copy manually.', 'danger');
    });

    
    parseBtn.addEventListener('click', function () {
        const selectedProvider = cloudProviderSelect.value;
        const jsonData = jsonInput.value.trim();

        if (!selectedProvider) {
            showAlert('Please select a cloud provider.', 'warning');
            return;
        }

        if (!jsonData) {
            showAlert('Please paste your permissions JSON output.', 'warning');
            return;
        }

        let parsedPermissions;

        try {
            parsedPermissions = JSON.parse(jsonData);
        } catch (error) {
            showAlert('Invalid JSON format. Please check your input.', 'danger');
            return;
        }

        
        fetch(`data/${selectedProvider.toLowerCase()}_permissions.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${selectedProvider.toLowerCase()}_permissions.json`);
                }
                return response.json();
            })
            .then(permissionsData => {
                window.permissionsData = permissionsData; 

                return fetch(`data/${selectedProvider.toLowerCase()}_offensive_actions.json`);
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${selectedProvider.toLowerCase()}_offensive_actions.json`);
                }
                return response.json();
            })
            .then(offensiveActionsData => {
                window.offensiveActionsData = offensiveActionsData; 

                return fetch(`data/${selectedProvider.toLowerCase()}_permission_sets.json`); 
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${selectedProvider.toLowerCase()}_permission_sets.json`);
                }
                return response.json();
            })
            .then(permissionSetsData => {
                window.permissionSetsData = permissionSetsData; 

                
                let actions = parsePermissions(selectedProvider, parsedPermissions);

                
                generateGraph(actions, selectedProvider, window.permissionsData, window.offensiveActionsData, window.permissionSetsData);

                
                identifyOffensiveActions(actions, selectedProvider, window.offensiveActionsData);
            })
            .catch(error => {
                showAlert('Error loading JSON files:', error);
                showAlert('Error loading JSON data. Please ensure JSON files are correctly placed.', 'danger');
            });
    });

    
    resetBtn.addEventListener('click', function () {
        
        jsonInput.value = '';
        
        cliCommandDiv.innerHTML = '';
        copyCommandBtn.style.display = 'none';
        
        cy.elements().remove();
        
        actionsContainer.innerHTML = '';
        
        document.getElementById('attackPathSection').style.display = 'none';
        
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.checked = true;
            const filterClass = checkbox.value;
            cy.nodes().forEach(node => {
                if (node.hasClass(filterClass)) {
                    node.style('display', 'element');
                    node.connectedEdges().forEach(edge => {
                        edge.style('display', 'element');
                    });
                }
            });
        });
        showAlert('Application has been reset.', 'info');
    });

    
    function parsePermissions(provider, data) {
        let actions = [];
        
        switch (provider) {
            case 'AWS':
                if (data.EvaluationResults && Array.isArray(data.EvaluationResults)) {
                    data.EvaluationResults.forEach(evalResult => {
                        actions.push({
                            action: evalResult.EvalActionName,
                            decision: evalResult.EvalDecision.toLowerCase()
                        });
                    });
                }
                break;

            case 'Azure':
                if (Array.isArray(data)) {
                    data.forEach(assignment => {
                        
                        if (assignment.roleDefinitionName) {
                            actions.push({
                                action: assignment.roleDefinitionName,
                                decision: 'allowed' 
                            });
                        }
                        
                        if (assignment.permissions) {
                            assignment.permissions.forEach(permission => {
                                if (permission.actions) {
                                    permission.actions.forEach(action => {
                                        actions.push({
                                            action: action,
                                            decision: 'allowed'
                                        });
                                    });
                                }
                                
                                if (permission.notActions) {
                                    permission.notActions.forEach(action => {
                                        actions.push({
                                            action: action,
                                            decision: 'denied'
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
                break;

            case 'GCP':
                
                if (data.bindings) {
                    
                    data.bindings.forEach(binding => {
                        if (binding.role) {
                            actions.push({
                                action: binding.role,
                                decision: 'allowed'
                            });
                        }
                    });
                } else if (data.includedPermissions) {
                    
                    data.includedPermissions.forEach(permission => {
                        actions.push({
                            action: permission,
                            decision: 'allowed'
                        });
                    });
                }
                break;

            default:
                console.warn('Unsupported cloud provider:', provider);
        }
        
        return actions;
    }

    
    function generateGraph(actions, provider, permissionsData, offensiveActionsData, permissionSetsData) {
        cy.elements().remove();

        
        cy.add([{ data: { id: 'User', label: 'You' }, classes: 'node-attacker' }]);

        
        actions.forEach(actionObj => {
            const action = actionObj.action;
            const decision = actionObj.decision.toLowerCase();

            if (permissionsData.permissions.find(p => p.id === action)) {
                
                if (!cy.getElementById(action).length) {
                    const permission = permissionsData.permissions.find(p => p.id === action);
                    const nodeSize = calculateNodeSize(permission.name);
                    cy.add({
                        data: {
                            id: action,
                            label: permission.name,
                            description: permission.description,
                            service: permission.service
                        },
                        classes: 'node-normal',
                        style: {
                            'width': nodeSize.width + 'px',
                            'height': nodeSize.height + 'px'
                        }
                    });
                }

                
                let edgeClass = 'edge';
                if (decision === 'allowed') {
                    edgeClass = 'edge-allowed';
                } else if (['explicitdeny', 'denied', 'conditional'].includes(decision)) {
                    edgeClass = 'edge-critical';
                }

                
                cy.add({
                    data: {
                        id: `edge-${action}-${Date.now()}`,
                        source: 'User',
                        target: action,
                        label: 'grants',
                        class: edgeClass
                    }
                });
            }
        });

        if (permissionSetsData && permissionSetsData.permission_sets) {
            permissionSetsData.permission_sets.forEach(set => {
                const { id, name, permissions } = set;

                
                const hasAllSetPermissions = permissions.every(permission => 
                    actions.some(actionObj => actionObj.action === permission && actionObj.decision === 'allowed')
                );

                if (hasAllSetPermissions) {

                    if (!cy.getElementById(id).length) {
                        const nodeSize = calculateNodeSize(name);
                        cy.add({
                            data: {
                                id: id,
                                label: name,
                                description: `Includes: ${permissions.map(p => permissionsData.permissions.find(per => per.id === p)?.name || p).join(', ')}`
                            },
                            classes: 'node-permission-set',
                            style: {
                                'width': nodeSize.width + 'px',
                                'height': nodeSize.height + 'px'
                            }
                        });
                    }

                    permissions.forEach(permission => {
                        cy.add({
                            data: {
                                id: `edge-${permission}-${id}-${Date.now()}`,
                                source: permission,
                                target: id,
                                label: 'part of',
                                class: 'edge-combined-permissions'
                            }
                        });
                    });

                    
                    cy.add({
                        data: {
                            id: `edge-${id}-User-${Date.now()}`,
                            source: 'User',
                            target: id,
                            label: 'grants',
                            class: 'edge-allowed'
                        }
                    });
                }
            });
        }

        offensiveActionsData.offensive_actions.forEach(offAction => {
            const { id, name, description, required_permissions, steps } = offAction;

            
            const hasAllPermissions = required_permissions.every(permission => 
                actions.some(actionObj => actionObj.action === permission && actionObj.decision === 'allowed')
            );

            if (hasAllPermissions) {
                
                if (!cy.getElementById(id).length) {
                    const nodeSize = calculateNodeSize(name);
                    cy.add({
                        data: {
                            id: id,
                            label: name,
                            description: description
                        },
                        classes: 'node-offensive',
                        style: {
                            'width': nodeSize.width + 'px',
                            'height': nodeSize.height + 'px'
                        }
                    });
                }

                let connectorNodeId = null;
                if (required_permissions.length > 1) {
                    
                    const combinedId = `combined-${id}`;
                    const combinedLabel = required_permissions.map(p => {
                        const perm = permissionsData.permissions.find(permission => permission.id === p);
                        return perm ? perm.name : p;
                    }).join(' + ');

                    if (!cy.getElementById(combinedId).length) {
                        const nodeSize = calculateNodeSize(combinedLabel);
                        cy.add({
                            data: {
                                id: combinedId,
                                label: combinedLabel,
                                description: `Combination of permissions: ${required_permissions.join(', ')}`
                            },
                            classes: 'node-combined-permissions',
                            style: {
                                'width': nodeSize.width + 'px',
                                'height': nodeSize.height + 'px'
                            }
                        });
                    }

                    required_permissions.forEach(permission => {
                        cy.add({
                            data: {
                                id: `edge-${permission}-${combinedId}-${Date.now()}`,
                                source: permission,
                                target: combinedId,
                                label: 'part of',
                                class: 'edge-combined-permissions'
                            }
                        });
                    });

                    
                    cy.add({
                        data: {
                            id: `edge-${combinedId}-${id}-${Date.now()}`,
                            source: combinedId,
                            target: id,
                            label: 'enables',
                            class: 'edge-allowed'
                        }
                    });

                    connectorNodeId = combinedId;
                } else {
                    
                    cy.add({
                        data: {
                            id: `edge-${required_permissions[0]}-${id}-${Date.now()}`,
                            source: required_permissions[0],
                            target: id,
                            label: 'enables',
                            class: 'edge-allowed'
                        }
                    });
                }
                let previousStepId = null;

                steps.forEach(step => {
                    const stepId = `${id}-step-${step.stepNumber}`;
                    const stepLabel = `Step ${step.stepNumber}: ${step.description}`;

                    
                    if (!cy.getElementById(stepId).length) {
                        const nodeSize = calculateNodeSize(stepLabel);
                        cy.add({
                            data: {
                                id: stepId,
                                label: stepLabel,
                                command: step.command
                            },
                            classes: 'step-node',
                            style: {
                                'width': nodeSize.width + 'px',
                                'height': nodeSize.height + 'px'
                            }
                        });
                    }
                    if (previousStepId === null) {
                        const sourceId = connectorNodeId || id;
                        cy.add({
                            data: {
                                id: `edge-${sourceId}-step-${step.stepNumber}-${Date.now()}`,
                                source: sourceId,
                                target: stepId,
                                label: 'Step',
                                class: 'edge-step'
                            }
                        });
                    } else {
                        
                        cy.add({
                            data: {
                                id: `edge-${previousStepId}-step-${step.stepNumber}-${Date.now()}`,
                                source: previousStepId,
                                target: stepId,
                                label: 'Step',
                                class: 'edge-step'
                            }
                        });
                    }

                    
                    previousStepId = stepId;
                });
            }
        });

        
        const layout = cy.layout({
            name: 'dagre',
            nodeSep: 80,
            edgeSep: 20,
            rankSep: 100,
            rankDir: 'LR',
            animate: true,
            animationDuration: 500,
            animationEasing: 'ease-in-out'
        });

        layout.run();

        
        cy.one('layoutstop', () => {
            initializeTooltips();
        });
    }

    
    function initializeTooltips() {
        cy.nodes().forEach(node => {
            
            let tooltip = document.getElementById('cy-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'cy-tooltip';
                tooltip.className = 'cy-tooltip';
                document.body.appendChild(tooltip);
                
                
                const style = document.createElement('style');
                style.textContent = `
                    .cy-tooltip {
                        position: fixed;
                        display: none;
                        background: white;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        padding: 8px;
                        z-index: 999;
                        max-width: 300px;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                    }
                `;
                document.head.appendChild(style);
            }

            
            node.on('mouseover', (event) => {
                const content = `
                    <strong>${node.data('label')}</strong><br>
                    ${node.data('description') ? node.data('description') + '<br>' : ''}
                    ${node.data('command') ? `<code>${node.data('command')}</code><br>` : ''}
                    ${node.data('reference') ? `<a href="${node.data('reference')}" target="_blank">${node.data('referenceText')}</a>` : ''}
                `;
                
                tooltip.innerHTML = content;
                tooltip.style.display = 'block';
                
                
                const renderedPosition = event.target.renderedPosition();
                const zoom = cy.zoom();
                const pan = cy.pan();
                
                tooltip.style.left = `${renderedPosition.x + pan.x + 20}px`;
                tooltip.style.top = `${renderedPosition.y + pan.y - 20}px`;
            });

            node.on('mouseout', () => {
                tooltip.style.display = 'none';
            });

            
            node.on('position', (event) => {
                if (tooltip.style.display === 'block') {
                    const renderedPosition = event.target.renderedPosition();
                    const pan = cy.pan();
                    tooltip.style.left = `${renderedPosition.x + pan.x + 20}px`;
                    tooltip.style.top = `${renderedPosition.y + pan.y - 20}px`;
                }
            });
        });

        
        cy.on('pan zoom', () => {
            const tooltip = document.getElementById('cy-tooltip');
            if (tooltip && tooltip.style.display === 'block') {
                const hoveredNode = cy.nodes(':hover');
                if (hoveredNode.length > 0) {
                    const renderedPosition = hoveredNode[0].renderedPosition();
                    const pan = cy.pan();
                    tooltip.style.left = `${renderedPosition.x + pan.x + 20}px`;
                    tooltip.style.top = `${renderedPosition.y + pan.y - 20}px`;
                }
            }
        });
    }

    
    cy.on('tap', 'node', function (evt) {
        const node = evt.target;
        const nodeId = node.id();
        const nodeClasses = node.classes();

        
        const details = getNodeDetails(nodeId, 'AWS', window.permissionsData, window.offensiveActionsData); 

        if (details) {
            document.getElementById('nodeTitle').textContent = details.label;
            document.getElementById('nodeDescription').textContent =
                details.description || 'No description available.';
            document.getElementById('nodeCommand').textContent =
                details.command || 'No command available.';
            document.getElementById('nodeReference').href = details.reference || '#';
            document.getElementById('nodeReference').textContent =
                details.referenceText || 'No reference available.';

            
            if (nodeClasses.includes('node-normal') || nodeClasses.includes('node-offensive') || nodeClasses.includes('node-combined-permissions')) {
                if (details.attackPath && details.attackPath.length > 0) {
                    const attackPathSection = document.getElementById('attackPathSection');
                    const attackPathContent = document.getElementById('attackPathContent');
                    attackPathContent.innerHTML = '';

                    details.attackPath.forEach((pathItem, index) => {
                        if (pathItem.action) {
                            const actionHeader = document.createElement('h6');
                            actionHeader.textContent = pathItem.action;
                            actionHeader.style.color = '#2A9D8F'; 
                            attackPathContent.appendChild(actionHeader);

                            if (pathItem.description) {
                                const actionDescription = document.createElement('p');
                                actionDescription.textContent = pathItem.description;
                                attackPathContent.appendChild(actionDescription);
                            }

                            if (pathItem.command) {
                                const commandDiv = document.createElement('div');
                                commandDiv.className = 'code-snippet';

                                const pre = document.createElement('pre');
                                pre.textContent = pathItem.command;
                                pre.className = 'code bg-dark p-2 rounded';

                                const copyBtn = document.createElement('button');
                                copyBtn.className = 'btn btn-sm btn-outline-secondary copy-offensive-btn';
                                copyBtn.textContent = 'Copy Command';

                                commandDiv.appendChild(pre);
                                commandDiv.appendChild(copyBtn);
                                attackPathContent.appendChild(commandDiv);
                            }
                        }
                    });

                    attackPathSection.style.display = 'block';
                } else {
                    document.getElementById('attackPathSection').style.display = 'none';
                }
            } else if (nodeClasses.includes('step-node')) {
                
                if (details.command || details.description) {
                    const attackPathSection = document.getElementById('attackPathSection');
                    const attackPathContent = document.getElementById('attackPathContent');
                    attackPathContent.innerHTML = '';

                    
                    if (details.description) {
                        const descriptionPara = document.createElement('p');
                        descriptionPara.textContent = details.description;
                        attackPathContent.appendChild(descriptionPara);
                    }

                    
                    if (details.command) {
                        const commandDiv = document.createElement('div');
                        commandDiv.className = 'code-snippet';

                        const pre = document.createElement('pre');
                        pre.textContent = details.command;
                        pre.className = 'code bg-light p-2 rounded';

                        const copyBtn = document.createElement('button');
                        copyBtn.className = 'btn btn-sm btn-outline-secondary copy-offensive-btn';
                        copyBtn.textContent = 'Copy Command';

                        commandDiv.appendChild(pre);
                        commandDiv.appendChild(copyBtn);
                        attackPathContent.appendChild(commandDiv);
                    }

                    attackPathSection.style.display = 'block';
                } else {
                    document.getElementById('attackPathSection').style.display = 'none';
                }
            } else {
                document.getElementById('attackPathSection').style.display = 'none';
            }

            
            const nodeModal = new bootstrap.Modal(document.getElementById('nodeModal'));
            nodeModal.show();
        }
    });

    
    function getNodeDetails(nodeId, provider, permissionsData, offensiveActionsData) {
        
        if (provider === 'AWS' && permissionsData.permissions) {
            const permission = permissionsData.permissions.find(p => p.id === nodeId);
            if (permission) {
                const offensiveActions = offensiveActionsData.offensive_actions.filter(offAction =>
                    offAction.required_permissions.includes(nodeId)
                );

                const attackPath = offensiveActions.map(offAction => ({
                    action: offAction.name,
                    description: offAction.description,
                    steps: offAction.steps.map(step => ({
                        action: `Step ${step.stepNumber}: ${step.description}`,
                        command: step.command
                    }))
                }));

                return {
                    label: permission.name,
                    description: permission.description,
                    command: '', 
                    reference: '', 
                    referenceText: '', 
                    attackPath: attackPath
                };
            }
        }

        
        if (provider === 'AWS' && offensiveActionsData.offensive_actions) {
            const offAction = offensiveActionsData.offensive_actions.find(o => o.id === nodeId);
            if (offAction) {
                return {
                    label: offAction.name,
                    description: offAction.description,
                    command: '', 
                    reference: '', 
                    referenceText: '', 
                    attackPath: offAction.steps.map(step => ({
                        action: `Step ${step.stepNumber}: ${step.description}`,
                        command: step.command
                    }))
                };
            }
        }

        
        if (provider === 'AWS' && window.permissionSetsData.permission_sets) {
            const permissionSet = window.permissionSetsData.permission_sets.find(ps => ps.id === nodeId);
            if (permissionSet) {
                return {
                    label: permissionSet.name,
                    description: `Includes: ${permissionSet.permissions.join(', ')}`,
                    command: '', 
                    reference: '', 
                    referenceText: '', 
                    attackPath: offensiveActionsData.offensive_actions.filter(offAction =>
                        offAction.required_permissions.every(p => permissionSet.permissions.includes(p))
                    ).map(offAction => ({
                        action: offAction.name,
                        description: offAction.description,
                        steps: offAction.steps.map(step => ({
                            action: `Step ${step.stepNumber}: ${step.description}`,
                            command: step.command
                        }))
                    }))
                };
            }
        }

        
        if (provider === 'AWS' && offensiveActionsData.offensive_actions) {
            for (let offAction of offensiveActionsData.offensive_actions) {
                const step = offAction.steps.find(s => `${offAction.id}-step-${s.stepNumber}` === nodeId);
                if (step) {
                    return {
                        label: `Step ${step.stepNumber}: ${step.description}`,
                        description: step.description,
                        command: step.command,
                        reference: step.reference || '#',
                        referenceText: step.referenceText || 'No reference available.',
                        attackPath: [] 
                    };
                }
            }
        }

        
        return null;
    }

    
    function identifyOffensiveActions(actions, provider, offensiveActionsData) {
        actionsContainer.innerHTML = '';

        actions.forEach(actionObj => {
            const action = actionObj.action;
            const decision = actionObj.decision.toLowerCase();

            if (offensiveActionsData.offensive_actions) {
                offensiveActionsData.offensive_actions.forEach(offAction => {
                    if (offAction.required_permissions.includes(action) && decision === 'allowed') {
                        
                        const card = document.createElement('div');
                        card.className = 'card action-card mb-3';

                        const cardBody = document.createElement('div');
                        cardBody.className = 'card-body';

                        const cardTitle = document.createElement('h5');
                        cardTitle.className = 'card-title';
                        cardTitle.textContent = offAction.name;

                        const cardText = document.createElement('p');
                        cardText.className = 'card-text';
                        cardText.textContent = offAction.description;

                        const stepsContainer = document.createElement('div');
                        stepsContainer.className = 'steps-container mt-3';

                        offAction.steps.forEach(step => {
                            const stepDiv = document.createElement('div');
                            stepDiv.className = 'step mb-2';

                            const stepHeader = document.createElement('h6');
                            stepHeader.textContent = `Step ${step.stepNumber}: ${step.description}`;
                            stepHeader.style.color = '#2A9D8F'; 

                            const stepCommandDiv = document.createElement('div');
                            stepCommandDiv.className = 'code-snippet';

                            const pre = document.createElement('pre');
                            pre.textContent = step.command;
                            pre.className = 'code bg-light p-2 rounded';

                            const copyBtn = document.createElement('button');
                            copyBtn.className = 'btn btn-sm btn-outline-secondary copy-offensive-btn';
                            copyBtn.textContent = 'Copy Command';

                            stepCommandDiv.appendChild(pre);
                            stepCommandDiv.appendChild(copyBtn);
                            stepDiv.appendChild(stepHeader);
                            stepDiv.appendChild(stepCommandDiv);
                            stepsContainer.appendChild(stepDiv);
                        });

                        cardBody.appendChild(cardTitle);
                        cardBody.appendChild(cardText);
                        cardBody.appendChild(stepsContainer);
                        card.appendChild(cardBody);
                        actionsContainer.appendChild(card);
                    }
                });
            }
        });

        
    }

    
    function showAlert(message, type = 'success') {
        const alertContainer = document.createElement('div');
        alertContainer.className = `alert alert-${type} alert-dismissible fade show`;
        alertContainer.role = 'alert';
        alertContainer.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.body.prepend(alertContainer);

        
        setTimeout(() => {
            alertContainer.classList.remove('show');
            alertContainer.classList.add('hide');
            alertContainer.remove();
        }, 5000);
    }

    
    document.body.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('copy-offensive-btn')) {
            const preElement = e.target.previousElementSibling;
            if (preElement) {
                const commandText = preElement.textContent;
                navigator.clipboard.writeText(commandText)
                    .then(() => showAlert('Command copied to clipboard!', 'success'))
                    .catch(() => showAlert('Failed to copy command. Please copy manually.', 'danger'));
            }
        }
    });

    
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const filterClass = this.value;
            const isChecked = this.checked;
            cy.nodes().forEach(node => {
                if (node.hasClass(filterClass)) {
                    node.style('display', isChecked ? 'element' : 'none');
                    node.connectedEdges().forEach(edge => {
                        edge.style('display', isChecked ? 'element' : 'none');
                    });
                }
            });
        });
    });

    
    cy.contextMenus({
        menuItems: [
            {
                id: 'view-details',
                content: 'View Details',
                selector: 'node',
                onClickFunction: function (event) {
                    const node = event.target;
                    
                    node.trigger('tap');
                },
                hasTrailingDivider: true
            },
            {
                id: 'copy-command',
                content: 'Copy Command',
                selector: 'step-node',
                onClickFunction: function (event) {
                    const node = event.target;
                    const command = node.data('command');
                    if (command) {
                        navigator.clipboard.writeText(command)
                            .then(() => showAlert('Command copied to clipboard!', 'success'))
                            .catch(() => showAlert('Failed to copy command. Please copy manually.', 'danger'));
                    }
                }
            }
        ],
        menuItemClasses: ['custom-context-menu']
    });

    
    function calculateNodeSize(label) {
        const baseWidth = 120; 
        const baseHeight = 80; 
        const charWidth = 8; 
        const maxCharsPerLine = Math.floor((baseWidth - 20) / charWidth); 
        const labelLines = Math.ceil(label.length / maxCharsPerLine);
        const newWidth = baseWidth + Math.max(0, (labelLines - 1)) * 20; 
        const newHeight = baseHeight + (labelLines > 1 ? 20 * labelLines : 0); 

        
        const viewportWidth = window.innerWidth;
        const scaleFactor = viewportWidth < 768 ? 0.8 : 1; 

        return {
            width: newWidth * scaleFactor,
            height: newHeight * scaleFactor
        };
    }

    
    window.addEventListener('resize', function () {
        
        clearTimeout(window.resizedFinished);
        window.resizedFinished = setTimeout(function(){
            if (window.permissionsData && window.offensiveActionsData && window.permissionSetsData) {
                
                const selectedProvider = cloudProviderSelect.value;
                const jsonData = jsonInput.value.trim();

                if (selectedProvider && jsonData) {
                    try {
                        const parsedPermissions = JSON.parse(jsonData);
                        let actions = parsePermissions(selectedProvider, parsedPermissions);
                        generateGraph(actions, selectedProvider, window.permissionsData, window.offensiveActionsData, window.permissionSetsData);
                        identifyOffensiveActions(actions, selectedProvider, window.offensiveActionsData);
                    } catch (error) {
                        console.error('Error parsing JSON on resize:', error);
                    }
                }
            }
        }, 250); 
    });

    
    cy.on('mouseover', 'node', function(e) {
        e.target.addClass('hover');
    });

    cy.on('mouseout', 'node', function(e) {
        e.target.removeClass('hover');
    });

    cy.on('mouseover', 'edge', function(e) {
        e.target.addClass('hover');
    });

    cy.on('mouseout', 'edge', function(e) {
        e.target.removeClass('hover');
    });

});
