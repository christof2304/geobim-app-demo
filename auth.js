/**
 * GEOBIM.APP - Geospatial BIM Viewer
 * © 2026 Christof Lorenz. All rights reserved.
 *
 * License: Personal and non-commercial use only.
 * Commercial use requires written permission.
 * Contact: info@geobim.app
 */

// ===============================
// CESIUM BIM VIEWER - FIREBASE AUTH MODULE v1.2
// With Cesium Ion Token Support
// ===============================
'use strict';

(function() {

  console.log('Loading Firebase Auth module v1.2 (with Ion Token)...');

  // =====================================
  // FIREBASE AUTH CONFIG
  // =====================================

  const FIREBASE_AUTH_CONFIG = {
    apiKey: "AIzaSyAL409coGn10I8afll2aae5vuvog_qVWZA",
    authDomain: "publictwin-ad6c7.firebaseapp.com",
    projectId: "publictwin-ad6c7",
    storageBucket: "publictwin-ad6c7.firebasestorage.app",
    messagingSenderId: "151464184627",
    appId: "1:151464184627:web:4de03973466ef510eecc46"
  };

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
    app: null,
    ionToken: null,
    currentAccountId: null,

    // Initialize Firebase Auth
    init: function() {
      if (this.initialized) {
        console.log('Auth already initialized');
        return;
      }

      if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded!');
        this.showError('Firebase SDK not loaded');
        return;
      }

      try {
        if (firebase.apps.length === 0) {
          this.app = firebase.initializeApp(FIREBASE_AUTH_CONFIG);
        } else {
          this.app = firebase.apps[0];
        }

        this.initialized = true;
        console.log('Firebase Auth initialized');

        firebase.auth().onAuthStateChanged((user) => {
          this.currentUser = user;

          if (user) {
            console.log('User logged in:', user.email);
            this.hideLoginScreen();
            this.checkIonToken();
          } else {
            console.log('No user logged in');
            this.showLoginScreen();
            this.hideApp();
          }
        });

      } catch (error) {
        console.error('Firebase Auth init error:', error);
        this.showError('Firebase initialization failed: ' + error.message);
      }
    },

    // Check for Ion Token - auto-apply demo token
    checkIonToken: function() {
      // Auto-apply demo token
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
        // Cesium not loaded yet, set it globally
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

    // Login with email/password
    login: async function(email, password) {
      if (!this.initialized) {
        this.showError('Auth not initialized');
        return false;
      }

      this.showLoginLoading(true);
      this.hideError();

      try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        console.log('Login successful:', userCredential.user.email);
        return true;

      } catch (error) {
        console.error('Login error:', error);

        let message = 'Login failed';
        switch(error.code) {
          case 'auth/user-not-found':
            message = 'User not found';
            break;
          case 'auth/wrong-password':
            message = 'Wrong password';
            break;
          case 'auth/invalid-email':
            message = 'Invalid email address';
            break;
          case 'auth/too-many-requests':
            message = 'Too many attempts. Please try again later.';
            break;
          case 'auth/invalid-credential':
            message = 'Invalid credentials';
            break;
          case 'auth/network-request-failed':
            message = 'Network error. Please check your connection.';
            break;
        }

        this.showError(message);
        return false;

      } finally {
        this.showLoginLoading(false);
      }
    },

    // Logout
    logout: async function() {
      try {
        this.clearIonToken();
        await firebase.auth().signOut();
        console.log('Logout successful');
        return true;
      } catch (error) {
        console.error('Logout error:', error);
        return false;
      }
    },

    // UI Functions
    showLoginScreen: function() {
      const loginScreen = document.getElementById('loginScreen');
      if (loginScreen) {
        loginScreen.style.display = 'flex';
      }
    },

    hideLoginScreen: function() {
      const loginScreen = document.getElementById('loginScreen');
      if (loginScreen) {
        loginScreen.style.display = 'none';
      }
    },

    showApp: function() {
      const cesiumContainer = document.getElementById('cesiumContainer');
      const toolbar = document.getElementById('toolbar');

      if (cesiumContainer) cesiumContainer.style.display = 'block';
      if (toolbar) toolbar.style.display = 'block';

      // Initialize Comments module after login
      setTimeout(() => {
        if (typeof BimViewer !== 'undefined' && typeof BimViewer.initFirebase === 'function') {
          console.log('Initializing Comments module after login...');
          BimViewer.initFirebase();
        } else {
          setTimeout(() => {
            if (typeof BimViewer !== 'undefined' && typeof BimViewer.initFirebase === 'function') {
              BimViewer.initFirebase();
            }
          }, 500);
        }
      }, 100);
    },

    hideApp: function() {
      const cesiumContainer = document.getElementById('cesiumContainer');
      const toolbar = document.getElementById('toolbar');

      if (cesiumContainer) cesiumContainer.style.display = 'none';
      if (toolbar) toolbar.style.display = 'none';

      document.querySelectorAll('.mode-indicator, .status-indicator, #commentDialog, #infoBoxCustom').forEach(el => {
        if (el.classList.contains('active')) {
          el.classList.remove('active');
        }
      });
    },

    showError: function(message) {
      const errorEl = document.getElementById('loginError');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
    },

    hideError: function() {
      const errorEl = document.getElementById('loginError');
      if (errorEl) {
        errorEl.style.display = 'none';
      }
    },

    showLoginLoading: function(show) {
      const btn = document.getElementById('loginBtn');
      const spinner = document.getElementById('loginSpinner');
      const btnText = document.getElementById('loginBtnText');

      if (btn) btn.disabled = show;
      if (spinner) spinner.style.display = show ? 'inline-block' : 'none';
      if (btnText) btnText.textContent = show ? 'Signing in...' : 'Sign In';
    },

    updateUserBadge: function(user) {
      const badge = document.getElementById('userBadge');
      const emailSpan = document.getElementById('userEmail');

      if (badge && user) {
        badge.style.display = 'flex';
        if (emailSpan) {
          emailSpan.textContent = user.email;
        }
      } else if (badge) {
        badge.style.display = 'none';
      }
    },

    getCurrentUser: function() {
      return this.currentUser;
    },

    isLoggedIn: function() {
      return this.currentUser !== null;
    },

    resetPassword: async function(email) {
      if (!email) {
        this.showError('Please enter email address');
        return false;
      }

      try {
        await firebase.auth().sendPasswordResetEmail(email);
        alert('Password reset email has been sent!');
        return true;
      } catch (error) {
        console.error('Password reset error:', error);

        let message = 'Error resetting password';
        switch(error.code) {
          case 'auth/user-not-found':
            message = 'Email address not found';
            break;
          case 'auth/invalid-email':
            message = 'Invalid email address';
            break;
        }

        this.showError(message);
        return false;
      }
    }
  };

  // =====================================
  // SETUP LOGIN FORM
  // =====================================

  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
          BimAuth.showError('Please enter email and password');
          return;
        }

        await BimAuth.login(email, password);
      });
    }

    setTimeout(() => {
      BimAuth.init();
    }, 100);
  });

  console.log('Firebase Auth module loaded (v1.3 - demo token flow)');
  console.log('Usage:');
  console.log('   - BimAuth.login(email, password)');
  console.log('   - BimAuth.logout()');
  console.log('   - BimAuth.getIonToken()');

})();
