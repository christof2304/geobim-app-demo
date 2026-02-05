/**
 * GEOBIM.APP - Geospatial BIM Viewer
 * © 2026 Christof Lorenz. All rights reserved.
 *
 * License: Personal and non-commercial use only.
 * Commercial use requires written permission.
 * Contact: info@geobim.app
 */

// ===============================
// CESIUM BIM VIEWER - MODERN UI MODULE v3.2 (INTEGRATED Z-OFFSET) - COMPLETE
// Minimalist Design with Collapsible Sections
// NEW: Z-Offset controls directly in asset list (-70m to +70m)
// ===============================
'use strict';

const BimViewerUI = {
  // Track expanded sections
  expandedSections: new Set(['assets']), // Only assets open by default
  
  // Initialize UI
  init() {
    try {
      this.createModernToolbar();
      this.initEventHandlers();
      this.initCollapseHandlers();
      console.log('✅ Modern BIM Viewer UI initialized v3.2 (Integrated Z-Offset -70m to +70m)');
    } catch (error) {
      console.error('❌ Failed to initialize UI:', error);
    }
  },

  // Create modern minimalist toolbar
  createModernToolbar() {
    const toolbar = document.getElementById("toolbar");
    if (!toolbar) {
      console.error('❌ Toolbar element not found');
      return;
    }
    
    // Clear existing content
    toolbar.innerHTML = '';
    
    // Header
    toolbar.appendChild(this.createHeader());
    
    // Collapsible sections
    // NOTE: Lighting section is provided by ui-lighting-standalone.js
    toolbar.appendChild(this.createSection('assets', '📦', 'Assets', this.getAssetsContent()));
    toolbar.appendChild(this.createSection('pointcloud', '☁️', 'Point Cloud Settings', this.getPointCloudContent()));
    toolbar.appendChild(this.createSection('drawing', '✏️', 'Drawing & Clipping', this.getDrawingContent()));
    toolbar.appendChild(this.createSection('comments', '💬', 'Comments', this.getCommentsContent()));
    toolbar.appendChild(this.createSection('visibility', '👁️', 'Visibility', this.getVisibilityContent()));
    toolbar.appendChild(this.createSection('ifc', '🏗️', 'IFC Filter', this.getIFCContent()));
    toolbar.appendChild(this.createSection('revit', '🏢', 'Revit Filter', this.getRevitContent()));
    toolbar.appendChild(this.createSection('views', '📷', 'Saved Views', this.getViewsContent()));
    toolbar.appendChild(this.createSection('settings', '⚙️', 'Settings', this.getSettingsContent()));
  },

  // Create header
  createHeader() {
    const header = document.createElement('div');
    header.className = 'modern-header';

    header.innerHTML = `
      <div class="modern-header-content">
        <div class="modern-logo">
          <span class="modern-logo-icon">🏗️</span>
          <div class="modern-logo-text">
            <div class="modern-logo-title">CESIUM BIM</div>
            <div class="modern-logo-subtitle">Ultra Viewer</div>
          </div>
        </div>
      </div>
      <div id="userBadge">
        <span id="userEmail"></span>
        <button id="logoutBtn" onclick="BimAuth.logout()">Logout</button>
      </div>
    `;
    return header;
  },

  // Create collapsible section
  createSection(id, icon, title, content) {
    const isExpanded = this.expandedSections.has(id);
    
    const section = document.createElement('div');
    section.className = 'modern-section';
    section.innerHTML = `
      <div class="modern-section-header" data-section="${id}">
        <div class="modern-section-title">
          <span class="modern-section-icon">${icon}</span>
          <span>${title}</span>
        </div>
        <span class="modern-section-toggle">${isExpanded ? '▼' : '▶'}</span>
      </div>
      <div class="modern-section-content ${isExpanded ? 'expanded' : 'collapsed'}">
        ${content}
      </div>
    `;
    return section;
  },

  // Assets content
  getAssetsContent() {
    return `
      <div class="modern-group">
        <div class="modern-label">🌍 Cesium Ion Assets</div>
        <div id="ionAssetsLoading" class="modern-hint" style="text-align: center; padding: 12px;">
          <span>⏳ Loading assets...</span>
        </div>

        <select id="ionAssetSelector" class="modern-select" style="display: none;">
          <option value="">-- Select an asset to import --</option>
        </select>

        <button id="importSelectedAsset" class="modern-btn modern-btn-primary" style="display: none;">
          <span class="modern-btn-icon">➕</span>
          <span>Import Selected</span>
        </button>

        <!-- Hidden button for manual reload if needed -->
        <button id="loadIonAssets" style="display: none;"></button>
      </div>

      <div class="modern-divider">
        <span class="modern-divider-text">Loaded Assets</span>
      </div>

      <div id="loadedAssetsList" class="modern-assets-list">
        <div class="modern-empty-state">No assets loaded yet</div>
      </div>
    `;
  },

  // Point Cloud Settings content
  getPointCloudContent() {
    return `
      <div class="modern-group">
        <div class="modern-label">Presets</div>
        <div class="modern-btn-group-3">
          <button class="modern-btn modern-btn-small" onclick="BimViewer.applyPointCloudPreset('quality')">
            <span class="modern-btn-icon">💎</span>
            <span>Quality</span>
          </button>
          <button class="modern-btn modern-btn-small" onclick="BimViewer.applyPointCloudPreset('performance')">
            <span class="modern-btn-icon">⚡</span>
            <span>Speed</span>
          </button>
          <button class="modern-btn modern-btn-small" onclick="BimViewer.applyPointCloudPreset('detailed')">
            <span class="modern-btn-icon">🔍</span>
            <span>Detail</span>
          </button>
        </div>
      </div>
      
      <div class="modern-divider">
        <span class="modern-divider-text">Color Mode</span>
      </div>
      
      <div class="modern-group">
        <div class="modern-label">Point Colors</div>
        <select id="colorModeSelect" class="modern-select" onchange="BimViewer.setColorMode(this.value)">
          <option value="rgb" selected>🎨 Original RGB Colors</option>
          <option value="height">📏 Height-based</option>
          <option value="intensity">💡 Intensity-based</option>
          <option value="classification">🏷️ Classification</option>
        </select>
      </div>
      
      <div class="modern-divider">
        <span class="modern-divider-text">Eye Dome Lighting (EDL)</span>
      </div>
      
      <div class="modern-group">
        <button id="toggleEDL" class="modern-toggle-btn active" onclick="BimViewer.setEyeDomeLighting(!BimViewer.pointCloudSettings.edlEnabled)" title="Eye Dome Lighting - enhances depth perception">
          <span class="modern-btn-icon">💡</span>
          <span>Enable EDL</span>
        </button>
        
        <div class="modern-slider-group">
          <label class="modern-label-small">EDL Strength</label>
          <input type="range" id="edlStrengthSlider" min="0" max="3" step="0.1" value="1" 
                 oninput="BimViewer.setEDLStrength(this.value); document.getElementById('edlStrengthValue').textContent = parseFloat(this.value).toFixed(1)" 
                 class="modern-slider-small">
          <span id="edlStrengthValue" class="modern-value-small">1.0</span>
        </div>
        
        <div class="modern-slider-group">
          <label class="modern-label-small">EDL Radius</label>
          <input type="range" id="edlRadiusSlider" min="0.5" max="3" step="0.1" value="1" 
                 oninput="BimViewer.setEDLRadius(this.value); document.getElementById('edlRadiusValue').textContent = parseFloat(this.value).toFixed(1)" 
                 class="modern-slider-small">
          <span id="edlRadiusValue" class="modern-value-small">1.0</span>
        </div>
      </div>
      
      <div class="modern-divider">
        <span class="modern-divider-text">Point Appearance</span>
      </div>
      
      <div class="modern-group">
        <div class="modern-slider-group">
          <label class="modern-label-small">Point Size</label>
          <input type="range" id="pointSizeSlider" min="0.5" max="10" step="0.5" value="2"
                 oninput="BimViewer.setPointSize(this.value); document.getElementById('pointSizeValue').textContent = parseFloat(this.value).toFixed(1)"
                 class="modern-slider-small"
                 title="Adjust point size">
          <span id="pointSizeValue" class="modern-value-small">2.0</span>
        </div>
      </div>
      
      <div class="modern-divider">
        <span class="modern-divider-text">Distance Attenuation</span>
      </div>
      
      <div class="modern-group">
        <button id="toggleAttenuation" class="modern-toggle-btn active" onclick="BimViewer.setAttenuation(!BimViewer.pointCloudSettings.attenuationEnabled)" title="Scale points by distance">
          <span class="modern-btn-icon">📐</span>
          <span>Enable Attenuation</span>
        </button>
        
        <div class="modern-slider-group">
          <label class="modern-label-small">Maximum Attenuation</label>
          <input type="range" id="maxAttenuationSlider" min="1" max="10" step="0.5" value="1" 
                 oninput="BimViewer.setMaximumAttenuation(this.value); document.getElementById('maxAttenuationValue').textContent = this.value == 1 ? 'None' : parseFloat(this.value).toFixed(1)" 
                 class="modern-slider-small">
          <span id="maxAttenuationValue" class="modern-value-small">None</span>
        </div>
      </div>
      
      <div class="modern-divider">
        <span class="modern-divider-text">Advanced</span>
      </div>
      
      <div class="modern-group">
        <div class="modern-slider-group">
          <label class="modern-label-small">Geometric Error Scale</label>
          <input type="range" id="geometricErrorSlider" min="0.5" max="3" step="0.1" value="1" 
                 oninput="BimViewer.setGeometricErrorScale(this.value); document.getElementById('geometricErrorValue').textContent = parseFloat(this.value).toFixed(1)" 
                 class="modern-slider-small">
          <span id="geometricErrorValue" class="modern-value-small">1.0</span>
        </div>
        
        <button id="toggleBackFaceCulling" class="modern-toggle-btn" onclick="BimViewer.setBackFaceCulling(!BimViewer.pointCloudSettings.backFaceCulling)">
          <span class="modern-btn-icon">🔄</span>
          <span>Back Face Culling</span>
        </button>
        
        <button class="modern-btn modern-btn-danger" onclick="BimViewer.resetPointCloudSettings()">
          <span class="modern-btn-icon">🔄</span>
          <span>Reset to Defaults</span>
        </button>
      </div>
      
      <div class="modern-hint">
        <strong>🎨 RGB Colors</strong> are preserved by default<br>
        <strong>💡 EDL</strong> improves depth perception<br>
        <strong>📐 Attenuation</strong> adjusts point size by distance<br>
        <strong>⚙️ Geometric Error</strong> controls detail level
      </div>
    `;
  },

  // Drawing & Clipping content
  getDrawingContent() {
    return `
      <div class="modern-group">
        <button id="startDrawing" class="modern-btn modern-btn-accent" title="Right-click to draw clipping polygon">
          <span class="modern-btn-icon">✏️</span>
          <span>Start Drawing</span>
        </button>
        <button id="stopDrawing" class="modern-btn modern-btn-success hidden" title="Cut through model with polygon">
          <span class="modern-btn-icon">✅</span>
          <span>Apply Clipping</span>
        </button>
      </div>

      <div class="modern-group">
        <button id="togglePolygon" class="modern-btn modern-btn-secondary" title="Show/hide clipping polygon">
          <span class="modern-btn-icon">👁️</span>
          <span>Toggle Polygon</span>
        </button>
        <button id="clearPolygon" class="modern-btn modern-btn-danger" title="Remove clipping polygon">
          <span class="modern-btn-icon">🗑️</span>
          <span>Clear Polygon</span>
        </button>
      </div>

      <div class="modern-info-box">
        <div class="modern-label">Clipping Mode:</div>
        <button id="toggleClipMode" class="modern-toggle-btn" title="Include/exclude terrain in clipping">
          <span class="modern-btn-icon">🏙️</span>
          <span>Buildings Only</span>
        </button>
      </div>
      
      <div class="modern-hint">
        <strong>Usage:</strong> Click map to add points • ESC to exit
      </div>
    `;
  },

  // Comments content
  getCommentsContent() {
    return `
      <div class="modern-group">
        <button id="toggleCommentMode" class="modern-btn modern-btn-primary" title="Click to place a comment marker">
          <span class="modern-btn-icon">💬</span>
          <span>Add Comment</span>
          <span id="commentsCount" class="modern-badge" style="display: none;">0</span>
        </button>
        
        <button id="initFirebaseBtn" class="modern-btn modern-btn-success" style="display: none;">
          <span class="modern-btn-icon">🔥</span>
          <span>Initialize Firebase</span>
        </button>
      </div>
      
      <div class="modern-hint">
        <strong>RIGHT-CLICK</strong> on 3D model to place comment<br>
        <strong>LEFT-CLICK</strong> for element info • <strong>C</strong> to toggle • <strong>ESC</strong> to cancel
      </div>
      
      <div class="modern-label" style="margin-top: 12px;">
        Recent Comments
        <span id="commentsListStatus" class="modern-status">Loading...</span>
      </div>
      <div id="commentsList" class="modern-comments-list">
        <div class="modern-empty-state">Initializing...</div>
      </div>
    `;
  },

  // Visibility content (Hidden Elements + Hide Mode)
  getVisibilityContent() {
    return `
      <div class="modern-group">
        <button id="toggleHideMode" class="modern-btn modern-btn-danger">
          <span class="modern-btn-icon">🙈</span>
          <span>Hide Elements</span>
          <span id="hiddenFeaturesCount" class="modern-badge" style="display: none;">0</span>
        </button>
        
        <button id="showAllHidden" class="modern-btn modern-btn-success">
          <span class="modern-btn-icon">👁️</span>
          <span>Show All Hidden</span>
        </button>
      </div>
      
      <div class="modern-hint">
        <strong>H</strong> to toggle hide mode • <strong>Shift+H</strong> to show all
      </div>
      
      <div class="modern-label" style="margin-top: 12px;">Hidden Elements</div>
      <div id="hiddenFeaturesList" class="modern-hidden-list">
        <div class="modern-empty-state">No hidden elements</div>
      </div>
    `;
  },

  // IFC Filter content
  getIFCContent() {
    return `
      <div class="modern-group">
        <button id="selectAllIFC" class="modern-btn modern-btn-secondary">
          <span class="modern-btn-icon">✅</span>
          <span>Select All</span>
        </button>
        <button id="deselectAllIFC" class="modern-btn modern-btn-secondary">
          <span class="modern-btn-icon">❌</span>
          <span>Deselect All</span>
        </button>
      </div>

      <div id="ifcFiltersList" class="modern-ifc-filters">
        <!-- Will be populated dynamically -->
      </div>
    `;
  },

  // Revit Filter content
  getRevitContent() {
    return `
      <div class="modern-group">
        <button id="selectAllRevit" class="modern-btn modern-btn-secondary">
          <span class="modern-btn-icon">✅</span>
          <span>Select All</span>
        </button>
        <button id="deselectAllRevit" class="modern-btn modern-btn-secondary">
          <span class="modern-btn-icon">❌</span>
          <span>Deselect All</span>
        </button>
      </div>

      <div id="revitFiltersList" class="modern-ifc-filters">
        <!-- Will be populated dynamically -->
      </div>
    `;
  },

  // Saved Views content
  getViewsContent() {
    return `
      <div class="modern-group">
        <button id="saveCurrentView" class="modern-btn modern-btn-success">
          <span class="modern-btn-icon">💾</span>
          <span>Save Current View</span>
        </button>
      </div>
      
      <div class="modern-hint">
        <strong>Ctrl+1-9</strong> to save • <strong>1-9</strong> to load
      </div>
      
      <div id="savedViewsList" class="modern-views-list"></div>
    `;
  },

  // Settings content
  getSettingsContent() {
    return `
      <div class="modern-group">
        <div class="modern-label">Performance Preset</div>
        <select id="performancePreset" class="modern-select">
          <option value="PERFORMANCE" selected>⚡ Performance</option>
          <option value="BALANCED">⚖️ Balanced</option>
          <option value="QUALITY">💎 Quality</option>
          <option value="ULTRA">🌟 Ultra</option>
        </select>
      </div>

      <div class="modern-group">
        <div class="modern-label">Base Layers</div>
        <button id="toggleOSMBuildings" class="modern-toggle-btn active">
          <span class="modern-btn-icon">🏙️</span>
          <span>OSM Buildings</span>
        </button>
        <button id="toggleGoogle3DTiles" class="modern-toggle-btn">
          <span class="modern-btn-icon">🌍</span>
          <span>Google 3D Tiles</span>
        </button>
      </div>

      <div class="modern-group">
        <div class="modern-label">Globe Transparency</div>
        <button id="toggleGlobeTransparency" class="modern-toggle-btn">
          <span class="modern-btn-icon">🌐</span>
          <span>Enable Transparency</span>
        </button>

        <div id="globeTransparencyControls" style="display: none;">
          <div class="modern-slider-group">
            <label class="modern-label-small">Alpha</label>
            <input type="range" id="globeAlphaSlider" min="0" max="1" step="0.1" value="0.5" class="modern-slider-small">
            <span id="globeAlphaValue" class="modern-value-small">50%</span>
          </div>
        </div>
      </div>

      <div class="modern-group">
        <div class="modern-label">Anti-Aliasing</div>
        <button id="toggleFXAA" class="modern-toggle-btn">
          <span class="modern-btn-icon">✨</span>
          <span>FXAA</span>
        </button>
      </div>

      <div class="modern-group">
        <div class="modern-label">Silhouette Selection</div>
        <button id="toggleSilhouette" class="modern-toggle-btn">
          <span class="modern-btn-icon">🔲</span>
          <span>Enable Silhouette</span>
        </button>

        <div id="silhouetteControls" style="display: none; margin-top: 8px;">
          <div class="modern-slider-group">
            <label class="modern-label-small">Strength</label>
            <input type="range" id="silhouetteStrengthSlider" min="0.01" max="0.05" step="0.005" value="0.025" class="modern-slider-small">
            <span id="silhouetteStrengthValue" class="modern-value-small">0.025</span>
          </div>

          <div class="modern-label-small" style="margin-top: 8px;">Color</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
            <button class="modern-icon-btn silhouette-color-btn active" data-color="#FFFF00" style="background: #FFFF00; width: 28px; height: 28px; border-radius: 50%;" title="Yellow"></button>
            <button class="modern-icon-btn silhouette-color-btn" data-color="#00FF00" style="background: #00FF00; width: 28px; height: 28px; border-radius: 50%;" title="Green"></button>
            <button class="modern-icon-btn silhouette-color-btn" data-color="#00FFFF" style="background: #00FFFF; width: 28px; height: 28px; border-radius: 50%;" title="Cyan"></button>
            <button class="modern-icon-btn silhouette-color-btn" data-color="#FF6600" style="background: #FF6600; width: 28px; height: 28px; border-radius: 50%;" title="Orange"></button>
            <button class="modern-icon-btn silhouette-color-btn" data-color="#FF0000" style="background: #FF0000; width: 28px; height: 28px; border-radius: 50%;" title="Red"></button>
            <button class="modern-icon-btn silhouette-color-btn" data-color="#FF00FF" style="background: #FF00FF; width: 28px; height: 28px; border-radius: 50%;" title="Magenta"></button>
          </div>
        </div>
      </div>

      <div class="modern-group">
        <div class="modern-label">Ambient Occlusion</div>
        <button id="toggleAO" class="modern-toggle-btn">
          <span class="modern-btn-icon">🌑</span>
          <span>Enable SSAO</span>
        </button>

        <div id="aoControls" style="display: none; margin-top: 8px;">
          <button id="toggleAOOnly" class="modern-toggle-btn" style="margin-bottom: 8px;">
            <span class="modern-btn-icon">👁️</span>
            <span>AO Only (Debug)</span>
          </button>

          <div class="modern-slider-group">
            <label class="modern-label-small">Intensity</label>
            <input type="range" id="aoIntensitySlider" min="0.5" max="10" step="0.1" value="3.0" class="modern-slider-small">
            <span id="aoIntensityValue" class="modern-value-small">3.0</span>
          </div>
          <div class="modern-slider-group">
            <label class="modern-label-small">Bias</label>
            <input type="range" id="aoBiasSlider" min="0" max="1" step="0.01" value="0.1" class="modern-slider-small">
            <span id="aoBiasValue" class="modern-value-small">0.10</span>
          </div>
          <div class="modern-slider-group">
            <label class="modern-label-small">Length Cap</label>
            <input type="range" id="aoLengthCapSlider" min="0.01" max="1" step="0.01" value="0.26" class="modern-slider-small">
            <span id="aoLengthCapValue" class="modern-value-small">0.26</span>
          </div>
          <div class="modern-slider-group">
            <label class="modern-label-small">Directions</label>
            <input type="range" id="aoDirectionSlider" min="1" max="32" step="1" value="8" class="modern-slider-small">
            <span id="aoDirectionValue" class="modern-value-small">8</span>
          </div>
          <div class="modern-slider-group">
            <label class="modern-label-small">Steps</label>
            <input type="range" id="aoStepSlider" min="1" max="64" step="1" value="32" class="modern-slider-small">
            <span id="aoStepValue" class="modern-value-small">32</span>
          </div>
        </div>
      </div>

      <div class="modern-group">
        <div class="modern-label">Advanced</div>
        <button id="toggleUndergroundView" class="modern-toggle-btn">
          <span class="modern-btn-icon">🕳️</span>
          <span>Underground Mode</span>
        </button>
      </div>
    `;
  },

  // Initialize section collapse handlers
  initCollapseHandlers() {
    document.querySelectorAll('.modern-section-header').forEach(header => {
      header.addEventListener('click', () => {
        const sectionId = header.dataset.section;
        const content = header.nextElementSibling;
        const toggle = header.querySelector('.modern-section-toggle');
        
        if (content.classList.contains('expanded')) {
          content.classList.remove('expanded');
          content.classList.add('collapsed');
          toggle.textContent = '▶';
          this.expandedSections.delete(sectionId);
        } else {
          content.classList.remove('collapsed');
          content.classList.add('expanded');
          toggle.textContent = '▼';
          this.expandedSections.add(sectionId);
        }
      });
    });
  },

  // ✅ COMPLETE: Initialize all event handlers
  initEventHandlers() {
    // Ion Assets Loading (manual reload - hidden by default)
    document.getElementById('loadIonAssets')?.addEventListener('click', async () => {
      const btn = document.getElementById('loadIonAssets');
      const selector = document.getElementById('ionAssetSelector');
      const importBtn = document.getElementById('importSelectedAsset');
      
      if (!btn || !selector) return;
      
      try {
        btn.innerHTML = '<span class="modern-btn-icon">⏳</span><span>Loading...</span>';
        btn.disabled = true;
        
        // Call the fetchAvailableAssets function from core.js
        const assets = await BimViewer.fetchAvailableAssets();
        
        // Clear and populate selector
        selector.innerHTML = '<option value="">-- Select an asset --</option>';
        
        assets.forEach(asset => {
          const option = document.createElement('option');
          option.value = asset.id;
          option.textContent = `${asset.name} (ID: ${asset.id})`;
          selector.appendChild(option);
        });
        
        importBtn.disabled = false;
        btn.innerHTML = '<span class="modern-btn-icon">✅</span><span>Assets Loaded</span>';
        
        setTimeout(() => {
          btn.innerHTML = '<span class="modern-btn-icon">🌍</span><span>Load Ion Assets</span>';
          btn.disabled = false;
        }, 2000);
        
        BimViewer.updateStatus(`${assets.length} assets loaded`, 'success');
        
      } catch (error) {
        console.error('Failed to load assets:', error);
        btn.innerHTML = '<span class="modern-btn-icon">❌</span><span>Failed</span>';
        setTimeout(() => {
          btn.innerHTML = '<span class="modern-btn-icon">🌍</span><span>Load Ion Assets</span>';
          btn.disabled = false;
        }, 2000);
        BimViewer.updateStatus('Failed to load assets', 'error');
      }
    });

    document.getElementById('importSelectedAsset')?.addEventListener('click', () => {
      const selector = document.getElementById('ionAssetSelector');
      const assetId = selector.value;
      const assetName = selector.options[selector.selectedIndex].text;
      if (assetId) BimViewer.loadSelectedAsset(assetId, assetName);
    });

    // Drawing
    document.getElementById('startDrawing')?.addEventListener('click', () => {
      BimViewer.enterDrawingMode();
      document.getElementById('startDrawing').classList.add('hidden');
      document.getElementById('stopDrawing').classList.remove('hidden');
    });

    document.getElementById('stopDrawing')?.addEventListener('click', () => {
      BimViewer.exitDrawingMode();
      document.getElementById('stopDrawing').classList.add('hidden');
      document.getElementById('startDrawing').classList.remove('hidden');
    });

    document.getElementById('togglePolygon')?.addEventListener('click', () => {
      BimViewer.drawing.visible = !BimViewer.drawing.visible;
      if (BimViewer.drawing.polygon) {
        BimViewer.drawing.polygon.show = BimViewer.drawing.visible;
      }
    });

    document.getElementById('clearPolygon')?.addEventListener('click', () => {
      BimViewer.clearClipping();
      if (BimViewer.drawing.polygon) {
        BimViewer.viewer.entities.remove(BimViewer.drawing.polygon);
        BimViewer.drawing.polygon = null;
      }
      BimViewer.drawing.positions = [];
      BimViewer.updateStatus('Polygon cleared', 'success');
    });

    document.getElementById('toggleClipMode')?.addEventListener('click', () => {
      BimViewer.drawing.clipBoth = !BimViewer.drawing.clipBoth;
      BimViewer.updateClippingModeUI();
      if (BimViewer.drawing.positions.length > 2) {
        BimViewer.applyClipping();
      }
    });

    // Comments
    document.getElementById('toggleCommentMode')?.addEventListener('click', () => {
      BimViewer.toggleCommentMode();
    });

    document.getElementById('initFirebaseBtn')?.addEventListener('click', () => {
      BimViewer.initFirebase();
    });

    // Visibility
    document.getElementById('toggleHideMode')?.addEventListener('click', () => {
      BimViewer.toggleHideMode();
    });

    document.getElementById('showAllHidden')?.addEventListener('click', () => {
      BimViewer.showAllHiddenFeatures();
    });

    // IFC Filter
    document.getElementById('selectAllIFC')?.addEventListener('click', () => {
      BimViewer.selectAllIFCTypes();
    });

    document.getElementById('deselectAllIFC')?.addEventListener('click', () => {
      BimViewer.deselectAllIFCTypes();
    });

    // Revit Filter
    document.getElementById('selectAllRevit')?.addEventListener('click', () => {
      BimViewer.selectAllRevitCategories();
    });

    document.getElementById('deselectAllRevit')?.addEventListener('click', () => {
      BimViewer.deselectAllRevitCategories();
    });

    // Views
    document.getElementById('saveCurrentView')?.addEventListener('click', () => {
      BimViewer.saveView();
    });

    // Settings
    document.getElementById('performancePreset')?.addEventListener('change', (e) => {
      const preset = CONFIG.performance.presets[e.target.value];
      if (preset) {
        BimViewer.applyPerformanceSettings(preset);
        BimViewer.updateStatus(`Performance: ${preset.name}`, 'success');
      }
    });

    document.getElementById('toggleOSMBuildings')?.addEventListener('click', (e) => {
      BimViewer.toggleOSMBuildings();
      e.target.classList.toggle('active');
    });

    document.getElementById('toggleGoogle3DTiles')?.addEventListener('click', (e) => {
      BimViewer.toggleGoogle3DTiles();
      e.target.classList.toggle('active');
    });

    document.getElementById('toggleGlobeTransparency')?.addEventListener('click', (e) => {
      BimViewer.toggleGlobeTransparency();
      e.target.classList.toggle('active');
      const controls = document.getElementById('globeTransparencyControls');
      controls.style.display = BimViewer.globeTransparency.enabled ? 'block' : 'none';
    });

    document.getElementById('toggleUndergroundView')?.addEventListener('click', (e) => {
      BimViewer.toggleUndergroundView();
      e.target.classList.toggle('active');
    });

    // Ambient Occlusion
    document.getElementById('toggleAO')?.addEventListener('click', function() {
      const ao = BimViewer.viewer?.scene?.postProcessStages?.ambientOcclusion;
      if (!ao) {
        BimViewer.updateStatus('Ambient Occlusion not supported', 'error');
        return;
      }
      ao.enabled = !ao.enabled;
      this.classList.toggle('active');
      const controls = document.getElementById('aoControls');
      if (controls) controls.style.display = ao.enabled ? 'block' : 'none';

      if (ao.enabled) {
        this.innerHTML = '<span class="modern-btn-icon">🌑</span><span>SSAO ON</span>';
      } else {
        this.innerHTML = '<span class="modern-btn-icon">🌑</span><span>Enable SSAO</span>';
        // Also disable AO-only mode
        ao.uniforms.ambientOcclusionOnly = false;
        document.getElementById('toggleAOOnly')?.classList.remove('active');
      }
    });

    document.getElementById('toggleAOOnly')?.addEventListener('click', function() {
      const ao = BimViewer.viewer?.scene?.postProcessStages?.ambientOcclusion;
      if (!ao) return;
      ao.uniforms.ambientOcclusionOnly = !ao.uniforms.ambientOcclusionOnly;
      this.classList.toggle('active');
    });

    document.getElementById('aoIntensitySlider')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const ao = BimViewer.viewer?.scene?.postProcessStages?.ambientOcclusion;
      if (ao) ao.uniforms.intensity = val;
      document.getElementById('aoIntensityValue').textContent = val.toFixed(1);
    });

    document.getElementById('aoBiasSlider')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const ao = BimViewer.viewer?.scene?.postProcessStages?.ambientOcclusion;
      if (ao) ao.uniforms.bias = val;
      document.getElementById('aoBiasValue').textContent = val.toFixed(2);
    });

    document.getElementById('aoLengthCapSlider')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      const ao = BimViewer.viewer?.scene?.postProcessStages?.ambientOcclusion;
      if (ao) ao.uniforms.lengthCap = val;
      document.getElementById('aoLengthCapValue').textContent = val.toFixed(2);
    });

    document.getElementById('aoDirectionSlider')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      const ao = BimViewer.viewer?.scene?.postProcessStages?.ambientOcclusion;
      if (ao) ao.uniforms.directionCount = val;
      document.getElementById('aoDirectionValue').textContent = val;
    });

    document.getElementById('aoStepSlider')?.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      const ao = BimViewer.viewer?.scene?.postProcessStages?.ambientOcclusion;
      if (ao) ao.uniforms.stepCount = val;
      document.getElementById('aoStepValue').textContent = val;
    });

    document.getElementById('globeAlphaSlider')?.addEventListener('input', (e) => {
      const alpha = parseFloat(e.target.value);
      BimViewer.setGlobeTransparency(alpha);
      document.getElementById('globeAlphaValue').textContent = Math.round(alpha * 100) + '%';
    });

    // FXAA Anti-Aliasing
    document.getElementById('toggleFXAA')?.addEventListener('click', function() {
      const fxaa = BimViewer.viewer?.scene?.postProcessStages?.fxaa;
      if (!fxaa) {
        BimViewer.updateStatus('FXAA not available', 'error');
        return;
      }
      fxaa.enabled = !fxaa.enabled;
      this.classList.toggle('active');
      if (fxaa.enabled) {
        this.innerHTML = '<span class="modern-btn-icon">✨</span><span>FXAA ON</span>';
        BimViewer.updateStatus('FXAA enabled', 'success');
      } else {
        this.innerHTML = '<span class="modern-btn-icon">✨</span><span>FXAA</span>';
        BimViewer.updateStatus('FXAA disabled', 'success');
      }
    });

    // Silhouette Selection
    document.getElementById('toggleSilhouette')?.addEventListener('click', function() {
      if (!BimViewer.silhouette.supported) {
        BimViewer.updateStatus('Silhouette not supported on this device', 'error');
        return;
      }
      const enabled = !BimViewer.silhouette.enabled;
      BimViewer.enableSilhouette(enabled);
      this.classList.toggle('active');
      const controls = document.getElementById('silhouetteControls');
      if (controls) controls.style.display = enabled ? 'block' : 'none';
      if (enabled) {
        this.innerHTML = '<span class="modern-btn-icon">🔲</span><span>Silhouette ON</span>';
        BimViewer.updateStatus('Silhouette enabled', 'success');
      } else {
        this.innerHTML = '<span class="modern-btn-icon">🔲</span><span>Enable Silhouette</span>';
        BimViewer.updateStatus('Silhouette disabled', 'success');
      }
    });

    document.getElementById('silhouetteStrengthSlider')?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      BimViewer.setSilhouetteStrength(val);
      document.getElementById('silhouetteStrengthValue').textContent = val.toFixed(3);
    });

    document.querySelectorAll('.silhouette-color-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        // Remove active from all
        document.querySelectorAll('.silhouette-color-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const hex = this.dataset.color;
        const cesiumColor = Cesium.Color.fromCssColorString(hex);
        BimViewer.setSilhouetteColor(cesiumColor);
        BimViewer.updateStatus('Silhouette color updated', 'success');
      });
    });

  },

  // ⭐ NEW: Create asset control WITH INTEGRATED Z-OFFSET
  createAssetControls(assetId) {
    const container = document.getElementById('loadedAssetsList');
    if (!container) return;

    const assetData = BimViewer.loadedAssets.get(assetId.toString());
    if (!assetData) return;

    const assetDiv = document.createElement('div');
    assetDiv.id = `asset_${assetId}`;
    assetDiv.className = 'modern-asset-item';
    
    if (assetData.type === 'ITWIN') {
      assetDiv.classList.add('modern-asset-itwin');
    }
    
    // Get current offset value if any
    const hasIndividualOffset = BimViewer.zOffset && BimViewer.zOffset.individualOffsets.has(assetData.tileset);
    const currentOffset = hasIndividualOffset ? 
      BimViewer.zOffset.individualOffsets.get(assetData.tileset) : 0;
    
    assetDiv.innerHTML = `
      <!-- Asset Header -->
      <div class="modern-asset-header">
        <div class="modern-asset-name" title="${assetData.name}">${assetData.name}</div>
        <div class="modern-asset-controls">
          <button class="modern-icon-btn" onclick="BimViewer.zoomToAsset('${assetId}')" title="Fly to asset">📍</button>
          <button class="modern-icon-btn" onclick="BimViewer.toggleAssetVisibility('${assetId}')" title="Show/hide asset">👁️</button>
          <button class="modern-icon-btn modern-icon-btn-danger" onclick="BimViewer.unloadAsset('${assetId}')" title="Remove asset from viewer">🗑️</button>
        </div>
      </div>

      <!-- Opacity Control -->
      <div class="modern-asset-opacity">
        <label class="modern-label-small">Opacity</label>
        <input type="range" min="0" max="1" step="0.1" value="1"
               oninput="BimViewer.updateAssetOpacity('${assetId}', this.value)"
               class="modern-slider-small"
               title="Adjust transparency">
        <span id="opacityValue_${assetId}" class="modern-value-small">100%</span>
      </div>
      
      <!-- 🏔️ Z-OFFSET CONTROLS (COMPACT VERSION -5m to +5m) -->
      <div class="modern-asset-zoffset">
        <div class="zoffset-label-row">
          <label class="modern-label-small">🏔️ Z-Offset</label>
          <span class="zoffset-value" id="zoffset_value_${assetId}">${currentOffset >= 0 ? '+' : ''}${currentOffset.toFixed(2)} m</span>
        </div>
        
        <!-- Slider with color gradient (-5m to +5m) -->
        <input type="range"
               id="zoffset_slider_${assetId}"
               class="zoffset-slider"
               min="-5"
               max="5"
               step="0.01"
               value="${currentOffset}"
               oninput="BimViewerUI.updateAssetZOffset('${assetId}', this.value)"
               title="Move asset up/down">
        
        <!-- Input Box for explicit value -->
        <div class="zoffset-input-row">
          <input type="number" 
                 id="zoffset_input_${assetId}"
                 class="zoffset-input-box"
                 min="-5" 
                 max="5" 
                 step="0.01" 
                 value="${currentOffset.toFixed(2)}"
                 placeholder="0.00"
                 onchange="BimViewerUI.setAssetZOffsetFromInput('${assetId}', this.value)">
          <button class="zoffset-reset-btn" 
                  onclick="BimViewerUI.setAssetZOffsetFromInput('${assetId}', 0)"
                  title="Reset to 0">
            ↺
          </button>
        </div>
      </div>
    `;

    container.appendChild(assetDiv);
  },

  // ⭐ NEW: Update asset Z-Offset (with debouncing)
  updateAssetZOffset(assetId, value) {
    const offsetValue = parseFloat(value);
    const valueDisplay = document.getElementById(`zoffset_value_${assetId}`);
    const inputBox = document.getElementById(`zoffset_input_${assetId}`);
    
    if (valueDisplay) {
      valueDisplay.textContent = `${offsetValue >= 0 ? '+' : ''}${offsetValue.toFixed(2)} m`;
      
      // Color coding based on value (adjusted for -5 to +5 range)
      if (offsetValue < -3) {
        valueDisplay.style.color = '#f44336'; // Red (deep)
      } else if (offsetValue < -1) {
        valueDisplay.style.color = '#ff9800'; // Orange
      } else if (offsetValue >= -1 && offsetValue <= 1) {
        valueDisplay.style.color = '#4caf50'; // Green (near zero)
      } else if (offsetValue <= 3) {
        valueDisplay.style.color = '#2196f3'; // Blue
      } else {
        valueDisplay.style.color = '#9c27b0'; // Purple (high)
      }
    }
    
    // Update input box to match slider
    if (inputBox) {
      inputBox.value = offsetValue.toFixed(2);
    }
    
    // SMOOTH live updates - use requestAnimationFrame for 60fps
    if (this._zoffsetAnimationFrame) {
      cancelAnimationFrame(this._zoffsetAnimationFrame);
    }
    
    this._zoffsetAnimationFrame = requestAnimationFrame(() => {
      if (typeof BimViewer.applyIndividualZOffset === 'function') {
        // Pass isLiveUpdate=true to reduce console logging during slider movement
        BimViewer.applyIndividualZOffset(assetId, offsetValue, true);
      }
    });
  },

  // ⭐ NEW: Set Z-Offset from input box
  setAssetZOffsetFromInput(assetId, value) {
    let offsetValue = parseFloat(value);
    
    // Clamp to valid range
    if (isNaN(offsetValue)) {
      offsetValue = 0;
    } else if (offsetValue < -5) {
      offsetValue = -5;
    } else if (offsetValue > 5) {
      offsetValue = 5;
    }
    
    const slider = document.getElementById(`zoffset_slider_${assetId}`);
    const inputBox = document.getElementById(`zoffset_input_${assetId}`);
    const valueDisplay = document.getElementById(`zoffset_value_${assetId}`);
    
    // Update all controls
    if (slider) {
      slider.value = offsetValue;
    }
    
    if (inputBox) {
      inputBox.value = offsetValue.toFixed(2);
    }
    
    if (valueDisplay) {
      valueDisplay.textContent = `${offsetValue >= 0 ? '+' : ''}${offsetValue.toFixed(2)} m`;
      
      // Color coding
      if (offsetValue < -3) {
        valueDisplay.style.color = '#f44336';
      } else if (offsetValue < -1) {
        valueDisplay.style.color = '#ff9800';
      } else if (offsetValue >= -1 && offsetValue <= 1) {
        valueDisplay.style.color = '#4caf50';
      } else if (offsetValue <= 3) {
        valueDisplay.style.color = '#2196f3';
      } else {
        valueDisplay.style.color = '#9c27b0';
      }
    }
    
    // Apply Z-offset
    if (typeof BimViewer.applyIndividualZOffset === 'function') {
      BimViewer.applyIndividualZOffset(assetId, offsetValue, false);
      BimViewer.updateStatus(`Z-Offset set to ${offsetValue >= 0 ? '+' : ''}${offsetValue.toFixed(2)}m`, 'success');
    }
  },

  // ⭐ NEW: Set asset Z-Offset preset
  setAssetZOffsetPreset(assetId, value) {
    const slider = document.getElementById(`zoffset_slider_${assetId}`);
    const valueDisplay = document.getElementById(`zoffset_value_${assetId}`);
    
    if (slider) {
      slider.value = value;
    }
    
    // Update display
    if (valueDisplay) {
      valueDisplay.textContent = `${value >= 0 ? '+' : ''}${value.toFixed(1)} m`;
      
      // Color coding
      if (value < -30) {
        valueDisplay.style.color = '#f44336';
      } else if (value < -10) {
        valueDisplay.style.color = '#ff9800';
      } else if (value < 10) {
        valueDisplay.style.color = '#4caf50';
      } else if (value < 40) {
        valueDisplay.style.color = '#2196f3';
      } else {
        valueDisplay.style.color = '#9c27b0';
      }
    }
    
    // Preset buttons are explicit user actions, so log them (isLiveUpdate=false)
    if (typeof BimViewer.applyIndividualZOffset === 'function') {
      BimViewer.applyIndividualZOffset(assetId, value, false);
    }
  },

  // Auto-load Ion assets on startup
  async autoLoadIonAssets() {
    const loadingEl = document.getElementById('ionAssetsLoading');
    const selector = document.getElementById('ionAssetSelector');
    const importBtn = document.getElementById('importSelectedAsset');

    if (!selector) {
      console.log('Ion asset selector not found, retrying...');
      setTimeout(() => this.autoLoadIonAssets(), 500);
      return;
    }

    try {
      console.log('Auto-loading Ion assets...');

      // Fetch assets from Ion account
      const assets = await BimViewer.fetchAvailableAssets();

      // Hide loading, show selector
      if (loadingEl) loadingEl.style.display = 'none';
      selector.style.display = 'block';
      if (importBtn) importBtn.style.display = 'block';

      // Clear and populate selector
      selector.innerHTML = '<option value="">-- Select an asset to import --</option>';

      assets.forEach(asset => {
        const option = document.createElement('option');
        option.value = asset.id;
        option.textContent = `${asset.name} (ID: ${asset.id})`;
        selector.appendChild(option);
      });

      console.log(`Loaded ${assets.length} Ion assets`);
      BimViewer.updateStatus(`${assets.length} assets available`, 'success');

    } catch (error) {
      console.error('Failed to auto-load Ion assets:', error);
      if (loadingEl) {
        loadingEl.innerHTML = '<span style="color: #f44336;">Failed to load assets. Check console.</span>';
      }
      BimViewer.updateStatus('Failed to load Ion assets', 'error');
    }
  }
};

// Expose globally
window.BimViewerUI = BimViewerUI;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => BimViewerUI.init(), 100);
  });
} else {
  setTimeout(() => BimViewerUI.init(), 100);
}

console.log('✅ Modern UI module v3.2 (COMPLETE) loaded - Integrated Z-Offset Controls (-70m to +70m)');
