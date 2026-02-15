/**
 * GEOBIM.APP - Geospatial BIM Viewer
 * © 2026 Christof Lorenz. All rights reserved.
 *
 * License: Personal and non-commercial use only.
 * Commercial use requires written permission.
 * Contact: info@geobim.app
 */

// ===============================
// EDITION CONFIGURATION
// Central feature flag system for Demo/Pro editions
// This file MUST be loaded BEFORE all other scripts
// ===============================
'use strict';

// Edition: 'demo' or 'pro'
window.GEOBIM_EDITION = 'demo';

window.GEOBIM_FEATURES = {
  // Core (both editions)
  viewer:         true,
  clipping:       true,
  measurement:    true,
  lighting:       true,
  savedViews:     true,
  hideFeatures:   true,
  pointCloud:     true,

  // Pro only
  firebaseAuth:     GEOBIM_EDITION === 'pro',
  customIonToken:   GEOBIM_EDITION === 'pro',
  firebaseComments: GEOBIM_EDITION === 'pro',
};

window.isProFeature = function(feature) {
  return GEOBIM_FEATURES[feature] === true;
};

console.log('Edition: ' + GEOBIM_EDITION.toUpperCase());
