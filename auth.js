/**
 * GEOBIM.APP - Geospatial BIM Viewer
 * © 2026 Christof Lorenz. All rights reserved.
 *
 * License: Personal and non-commercial use only.
 * Commercial use requires written permission.
 * Contact: info@geobim.app
 */

// ===============================
// CESIUM BIM VIEWER - AUTH MODULE (DEMO MODE)
// No login required - auto-applies demo token
// ===============================
'use strict';

(function() {

  console.log('Loading Auth module (Demo Mode)...');

  // =====================================
  // DEMO ION TOKEN
  // =====================================
  const SAVED_ION_ACCOUNTS = {
    'demo': {
      name: 'geobim.app Demo',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZGM1ZDdlNi02ZDFhLTRkMGItYTNhNy0wZTRiM2RhZWFlNWUiLCJpZCI6Mzg3NDE4LCJpYXQiOjE3NzAyOTk1MTR9.kdRP3yJ-1NV3Y0vccI14W8-1oeVKOVoOUQAfkjeBCg0'
    }
  };

  // =====================================
  // AUTH STATE
  // =====================================

  window.BimAuth = {
    currentUser: null,
    initialized: false,
    ionToken: null,
    currentAccountId: null,

    // Initialize - Demo mode (no login required)
    init: function() {
      if (this.initialized) {
        console.log('Auth already initialized');
        return;
      }

      this.initialized = true;
      console.log('Demo mode initialized - no login required');

      // Set demo user
      this.currentUser = { email: 'demo@geobim.app', displayName: 'Demo User' };

      // Auto-apply demo token and show app
      this.checkIonToken();
    },

    // Check for Ion Token - auto-apply demo token
    checkIonToken: function() {
      const demoToken = SAVED_ION_ACCOUNTS['demo'].token;
      this.ionToken = demoToken;
      this.currentAccountId = 'demo';
      this.applyToken(demoToken);
      this.showApp();
      console.log('Demo token applied automatically');
    },

    // Apply Token to Cesium
    applyToken: function(token) {
      if (typeof Cesium !== 'undefined') {
        Cesium.Ion.defaultAccessToken = token;
        console.log('Cesium Ion token set');
      } else {
        window.CESIUM_ION_TOKEN = token;
        console.log('Cesium Ion token stored for later use');
      }
    },

    // Get Ion Token
    getIonToken: function() {
      return this.ionToken || SAVED_ION_ACCOUNTS['demo'].token;
    },

    // Clear Ion Token (resets to demo)
    clearIonToken: function() {
      this.ionToken = SAVED_ION_ACCOUNTS['demo'].token;
      this.currentAccountId = 'demo';
      console.log('Ion Token reset to demo');
    },

    // Show App
    showApp: function() {
      const cesiumContainer = document.getElementById('cesiumContainer');
      const toolbar = document.getElementById('toolbar');

      if (cesiumContainer) cesiumContainer.style.display = 'block';
      if (toolbar) toolbar.style.display = 'block';

      // Initialize Comments module
      setTimeout(() => {
        if (typeof BimViewer !== 'undefined' && typeof BimViewer.initFirebase === 'function') {
          console.log('Initializing Comments module...');
          BimViewer.initFirebase();
        }
      }, 100);
    },

    // Hide App
    hideApp: function() {
      const cesiumContainer = document.getElementById('cesiumContainer');
      const toolbar = document.getElementById('toolbar');

      if (cesiumContainer) cesiumContainer.style.display = 'none';
      if (toolbar) toolbar.style.display = 'none';
    },

    // Get current user (demo user)
    getCurrentUser: function() {
      return this.currentUser;
    },

    // Check if logged in (always true in demo mode)
    isLoggedIn: function() {
      return this.initialized;
    },

    // Logout (just resets to initial state in demo mode)
    logout: function() {
      this.clearIonToken();
      this.hideApp();
      // Show splash screen again
      const splash = document.getElementById('splashScreen');
      if (splash) {
        splash.classList.remove('hidden');
      }
      this.initialized = false;
      this.currentUser = null;
      console.log('Logged out - showing splash screen');
    }
  };

  console.log('Auth module loaded (Demo Mode)');
  console.log('Usage:');
  console.log('   - BimAuth.init() - Initialize demo mode');
  console.log('   - BimAuth.getIonToken() - Get Cesium Ion token');
  console.log('   - BimAuth.logout() - Return to splash screen');

})();
