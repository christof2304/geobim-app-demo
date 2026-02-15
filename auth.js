/**
 * GEOBIM.APP - Geospatial BIM Viewer
 * © 2026 Christof Lorenz. All rights reserved.
 *
 * License: Personal and non-commercial use only.
 * Commercial use requires written permission.
 * Contact: info@geobim.app
 */

// ===============================
// CESIUM BIM VIEWER - AUTH MODULE
// Supports Demo mode (no login) and Pro mode (Firebase Auth)
// ===============================
'use strict';

(function() {

  console.log('Loading Auth module (' + (window.GEOBIM_EDITION || 'demo').toUpperCase() + ' Mode)...');

  // =====================================
  // DEMO ION TOKEN
  // =====================================
  const DEMO_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4ZGM1ZDdlNi02ZDFhLTRkMGItYTNhNy0wZTRiM2RhZWFlNWUiLCJpZCI6Mzg3NDE4LCJpYXQiOjE3NzAyOTk1MTR9.kdRP3yJ-1NV3Y0vccI14W8-1oeVKOVoOUQAfkjeBCg0';

  // =====================================
  // FIREBASE CONFIG (Pro only)
  // =====================================
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAL409coGn10I8afll2aae5vuvog_qVWZA",
    authDomain: "publictwin-ad6c7.firebaseapp.com",
    projectId: "publictwin-ad6c7",
    storageBucket: "publictwin-ad6c7.firebasestorage.app",
    messagingSenderId: "151464184627",
    appId: "1:151464184627:web:4de03973466ef510eecc46",
    measurementId: "G-FWHRLCGJ4G"
  };

  // =====================================
  // AUTH STATE
  // =====================================

  window.BimAuth = {
    currentUser: null,
    initialized: false,
    ionToken: null,
    currentAccountId: null,

    // Initialize - dispatches to Demo or Pro mode
    init: function() {
      if (this.initialized) {
        console.log('Auth already initialized');
        return;
      }

      if (isProFeature('firebaseAuth')) {
        this.initFirebaseAuth();
      } else {
        this.initDemoMode();
      }
    },

    // === DEMO MODE (no login required) ===
    initDemoMode: function() {
      this.initialized = true;
      this.currentUser = { email: 'demo@geobim.app', displayName: 'Demo User' };
      this.ionToken = DEMO_TOKEN;
      this.currentAccountId = 'demo';
      this.applyToken(DEMO_TOKEN);
      this.showApp();
      console.log('Demo mode initialized - no login required');
    },

    // === PRO MODE (Firebase Auth) ===
    initFirebaseAuth: function() {
      if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded - falling back to Demo mode');
        this.initDemoMode();
        return;
      }

      // Initialize Firebase (only once)
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }

      var self = this;
      var auth = firebase.auth();

      auth.onAuthStateChanged(function(user) {
        if (user) {
          self.currentUser = user;
          self.initialized = true;
          self.checkIonToken();
          self.showApp();
          self.hideLoginScreen();
          console.log('Firebase Auth: signed in as', user.email);
        } else {
          self.initialized = true;
          self.showLoginScreen();
        }
      });

      // Attach login button handler
      var loginBtn = document.getElementById('loginBtn');
      if (loginBtn) {
        loginBtn.addEventListener('click', function() {
          var email = document.getElementById('loginEmail').value;
          var password = document.getElementById('loginPassword').value;
          var errorEl = document.getElementById('loginError');

          if (errorEl) {
            errorEl.style.display = 'none';
          }

          firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(function(err) {
              if (errorEl) {
                errorEl.textContent = err.message;
                errorEl.style.display = 'block';
              }
            });
        });
      }
    },

    // === ION TOKEN HANDLING ===
    checkIonToken: function() {
      if (isProFeature('customIonToken')) {
        // Pro: Token from localStorage (user-provided)
        var savedToken = localStorage.getItem('geobim_ion_token');
        if (savedToken) {
          this.ionToken = savedToken;
          this.currentAccountId = 'custom';
          this.applyToken(savedToken);
          return;
        }
        // No saved token - use demo token as fallback
        this.ionToken = DEMO_TOKEN;
        this.currentAccountId = 'demo';
        this.applyToken(DEMO_TOKEN);
      } else {
        // Demo: hardcoded token
        this.ionToken = DEMO_TOKEN;
        this.currentAccountId = 'demo';
        this.applyToken(DEMO_TOKEN);
      }
    },

    // Custom Ion Token (Pro)
    setCustomIonToken: function(token) {
      if (!token || !token.trim()) {
        console.warn('Empty Ion token provided');
        return;
      }
      this.ionToken = token.trim();
      this.currentAccountId = 'custom';
      localStorage.setItem('geobim_ion_token', token.trim());
      this.applyToken(token.trim());
      console.log('Custom Ion token applied');
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
      return this.ionToken || DEMO_TOKEN;
    },

    // Clear Ion Token (resets to demo)
    clearIonToken: function() {
      this.ionToken = DEMO_TOKEN;
      this.currentAccountId = 'demo';
      localStorage.removeItem('geobim_ion_token');
      console.log('Ion Token reset to demo');
    },

    // Login Screen (Pro only)
    showLoginScreen: function() {
      var loginScreen = document.getElementById('loginScreen');
      if (loginScreen) loginScreen.style.display = 'flex';
    },

    hideLoginScreen: function() {
      var loginScreen = document.getElementById('loginScreen');
      if (loginScreen) loginScreen.style.display = 'none';
    },

    // Show App
    showApp: function() {
      var cesiumContainer = document.getElementById('cesiumContainer');
      var toolbar = document.getElementById('toolbar');
      var sidebarToggle = document.getElementById('sidebarToggle');

      if (cesiumContainer) cesiumContainer.style.display = 'block';
      if (toolbar) toolbar.style.display = 'block';
      if (sidebarToggle) sidebarToggle.style.display = 'block';
    },

    // Hide App
    hideApp: function() {
      var cesiumContainer = document.getElementById('cesiumContainer');
      var toolbar = document.getElementById('toolbar');

      if (cesiumContainer) cesiumContainer.style.display = 'none';
      if (toolbar) toolbar.style.display = 'none';
    },

    // Get current user
    getCurrentUser: function() {
      return this.currentUser;
    },

    // Check if logged in
    isLoggedIn: function() {
      return this.initialized && this.currentUser !== null;
    },

    // Logout
    logout: function() {
      var self = this;

      if (isProFeature('firebaseAuth') && typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().signOut().then(function() {
          self._resetState();
        });
      } else {
        this._resetState();
      }
    },

    _resetState: function() {
      this.clearIonToken();
      this.hideApp();
      this.currentUser = null;
      this.initialized = false;
      // Show splash screen again
      var splash = document.getElementById('splashScreen');
      if (splash) {
        splash.classList.remove('hidden');
      }
      console.log('Logged out - showing splash screen');
    }
  };

  console.log('Auth module loaded (' + (window.GEOBIM_EDITION || 'demo').toUpperCase() + ' Mode)');

})();
