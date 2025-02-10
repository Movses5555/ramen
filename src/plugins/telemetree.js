
export async function initTelemetree() {
  const telemetreeScript = document.createElement('script');
  telemetreeScript.src = 'https://cdn.jsdelivr.net/gh/TONSolutions/telemetree-pixel@main/telemetree-pixel.js';
  telemetreeScript.async = true;

  telemetreeScript.onload = () => {
    console.log('Telemetree script loaded');
    console.log('window.telemetree', window.telemetree);

    if (window.telemetree) {
      // Initialize telemetree here
      const telemetreeBuilder = window.telemetree({
        projectId: '9eae83fd-f995-4e5b-b541-a5e9e818aa75',
        apiKey: '34ad722b-2a0c-42bf-a172-39a70cd028dc',
        appName: 'radem.wallet',
        isTelegramContext: false,
      });
      console.log('Telemetree initialized:', telemetreeBuilder);
      const urlParams = new URLSearchParams(window.location.search);
      const startapp = urlParams.get('startapp');
      if (startapp) {
        // Split the 'startapp' value by '__' delimiter
        const utmArray = startapp.split('__');

        // Initialize an empty object to hold the dynamic UTM parameters
        const utmParams = {};
        console.log('utmArray', utmArray);
        // Loop through the array and build the object dynamically
        utmArray.forEach((param, index) => {
          console.log('params', param);
          if (index === 0) return; // Skip the first part which is the 'id' (or any other identifier)
          console.log('param.split(0, 3)', param.slice(0, 3));
          
          if (param.slice(0, 3) === 'utm') {
            const paramArray = param.split('_');
            console.log('paramArray',paramArray);
            // Extract the UTM parameter name (utm_source, utm_medium, etc.)
            const paramName = paramArray[0];
            console.log('paramName',paramName);
            utmParams[paramName] = paramArray[1] || ''; // Set the value for each UTM parameter
          }
        });

        console.log('utmParams:', utmParams);
        localStorage.setItem('utmData', JSON.stringify(utmParams));


        // Send UTM data to Telemetree
        // telemetreeBuilder.setUTMParams(utmParams);
      } else {
        console.error('No startapp parameter found in URL.');
      }
      // const utmParams = {
      //   utm_source: urlParams.get('utm_source'),
      //   utm_medium: urlParams.get('utm_medium'),
      //   utm_campaign: urlParams.get('utm_campaign'),
      //   utm_term: urlParams.get('utm_term'),
      //   utm_content: urlParams.get('utm_content'),
      // };


      // console.log('utmParams----', utmParams);
      // localStorage.setItem('utmData', JSON.stringify(utmParams));
      console.log('Tracking event with UTM parameters');
      // telemetreeBuilder.track('Pageview', {
      //   eventCategory: 'UTM Parameters',
      //   eventAction: 'Visit',
      //   eventLabel: JSON.stringify(utmParams),
      //   ...utmParams,
      // });
      
      // Verify if the event was successfully tracked
      console.log('Event tracking initiated');

      function removeCircularReferences(obj) {
        const seen = new Set();
        return JSON.stringify(obj, (key, value) => {
          if (value != null && typeof value === 'object') {
            if (seen.has(value)) {
              return; // Remove the circular reference
            }
            seen.add(value);
          }
          return value;
        });
      }

      // Usage
      // const jsonString = removeCircularReferences(telemetreeBuilder);
      // console.log('jsonString', jsonString);
    } else {
      console.error('Telemetree library failed to load.');
    }
  };

  telemetreeScript.onerror = (error) => {
    console.error('Failed to load Telemetree script:', error);
  };

  document.head.appendChild(telemetreeScript);
}

export function trackUserAction(telemetreeBuilder, actionName, data) {
  telemetreeBuilder.track('User Action', {
    [actionName]: data,
  });
}

export function trackUserJoinField(telemetreeBuilder, fieldName) {
  telemetreeBuilder.track('User Joined Field', {
    'Field': fieldName,
    'Action': 'Joined',
  });
}