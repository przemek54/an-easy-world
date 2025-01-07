// ==UserScript==
// @name         An Easy World: Tips
// @namespace    https://www.geoguessr.com
// @version      1.0.3
// @description  Display tips on An Easy World, fetched from the database
// @author       54
// @match        https://www.geoguessr.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/508765/An%20Easy%20World%3A%20Tips.user.js
// @updateURL https://update.greasyfork.org/scripts/508765/An%20Easy%20World%3A%20Tips.meta.js
// ==/UserScript==

// URLs for Google Sheets
const locationsSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQclsDyN6aq9eY0SYyKI4X66wXWT1eB5tfMgdBsTIKfI97QE4N9u-GOFY5u9T_tWgp2MvlaIPskmKnJ/pub?gid=0&single=true&output=tsv';
const metasSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQclsDyN6aq9eY0SYyKI4X66wXWT1eB5tfMgdBsTIKfI97QE4N9u-GOFY5u9T_tWgp2MvlaIPskmKnJ/pub?gid=581949462&single=true&output=tsv';

// Main logic for the script
function runScript() {

    //// STARTING VARIABLES
    let globalCoordinates = {
        lat: 0,
        lng: 0
    };
    let revealMode = false;
    let countryData = {};
    let errorDisplayed = false; // Global flag to indicate if an error message is displayed

    //// STYLE ELEMENTS
    // Basic UI
    function setupHintsUI() {
        // Create and style the "Hints" button
        const hintsButton = document.createElement('button');
        hintsButton.textContent = 'Hints';
        hintsButton.style.position = 'absolute';
        hintsButton.style.top = '10px';
        hintsButton.style.left = '10px';
        hintsButton.style.backgroundColor = 'yellow';
        hintsButton.style.border = 'none';
        hintsButton.style.padding = '10px';
        hintsButton.style.cursor = 'pointer';
        hintsButton.style.zIndex = '10000';
    
        // Create and style the hints container
        const hintsContainer = document.createElement('div');
        hintsContainer.style.position = 'absolute';
        hintsContainer.style.top = '50px'; // Positioned below the button
        hintsContainer.style.left = '10px';
        hintsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        hintsContainer.style.color = 'white';
        hintsContainer.style.padding = '10px';
        hintsContainer.style.display = 'none'; // Start hidden
        hintsContainer.style.zIndex = '10000';
        hintsContainer.style.width = '300px'; // Set width to prevent shrinking
        hintsContainer.style.maxHeight = '400px';
        hintsContainer.style.overflowY = 'auto'; // Allow scrolling if content is too large
    
        // Create the slider toggle for "Reveal Info"
        const revealInfoContainer = document.createElement('div');
        revealInfoContainer.style.marginBottom = '10px'; // Add some space below the slider
    
        const revealInfoText = document.createElement('div');
        revealInfoText.innerHTML = '<b><i>REVEAL INFO</i></b>';
        revealInfoText.style.textAlign = 'left';
        revealInfoText.style.marginBottom = '5px';
        revealInfoText.style.fontSize = '16px';
    
        const revealInfoLabel = document.createElement('label');
        revealInfoLabel.className = 'switch';
    
        const revealInfoInput = document.createElement('input');
        revealInfoInput.type = 'checkbox';
    
        const revealInfoSlider = document.createElement('span');
        revealInfoSlider.className = 'slider';
    
        revealInfoLabel.appendChild(revealInfoInput);
        revealInfoLabel.appendChild(revealInfoSlider);
        revealInfoContainer.appendChild(revealInfoText);
        revealInfoContainer.appendChild(revealInfoLabel);
    
        // Append the slider to the hints container
        hintsContainer.appendChild(revealInfoContainer);
    
        // Create a content section to hold the metas
        const hintsContent = document.createElement('div');
        hintsContent.style.marginTop = '10px'; // Add space for the carousel controls
        hintsContent.style.display = 'flex';
        hintsContent.style.alignItems = 'center';
        hintsContent.style.justifyContent = 'center';
        hintsContent.style.height = '100%'; // Ensure the container takes full height
        hintsContent.style.textAlign = 'center'; // Center text horizontally
        hintsContent.innerHTML = '<b><i>LOADING...</i></b>'; // Initial loading message
        hintsContainer.appendChild(hintsContent); // Append content section to the container
    
        // Create and style the carousel controls
        const carouselControls = document.createElement('div');
        carouselControls.style.position = 'absolute';
        carouselControls.style.top = '10px'; // Fix the controls to the top of the container
        carouselControls.style.left = '50%';
        carouselControls.style.transform = 'translateX(-50%)'; // Center the controls horizontally
        carouselControls.style.textAlign = 'center';
        carouselControls.style.color = 'white'; // Make the arrows white
    
        // Create and style the counter element
        const counter = document.createElement('div');
        counter.style.textAlign = 'center';
        counter.style.color = 'white';
        counter.style.marginBottom = '0px'; // Space between counter and controls
        counter.style.fontSize = '11px';
    
        const prevButton = document.createElement('button');
        prevButton.textContent = '←';
        prevButton.style.marginRight = '10px';
        prevButton.style.cursor = 'pointer';
        prevButton.style.backgroundColor = 'transparent';
        prevButton.style.border = 'none';
        prevButton.style.color = 'white';
    
        const nextButton = document.createElement('button');
        nextButton.textContent = '→';
        nextButton.style.marginLeft = '10px';
        nextButton.style.cursor = 'pointer';
        nextButton.style.backgroundColor = 'transparent';
        nextButton.style.border = 'none';
        nextButton.style.color = 'white';
    
        carouselControls.appendChild(counter);
        carouselControls.appendChild(prevButton);
        carouselControls.appendChild(nextButton);
    
        // Append the carousel controls and content section to the container
        hintsContainer.appendChild(carouselControls);
    
        // Append the button and hints container to the body
        document.body.appendChild(hintsButton);
        document.body.appendChild(hintsContainer);
    
        // Store references for later use
        window.hintsContainer = hintsContainer;
        window.hintsContent = hintsContent; // Reference for metas content
        window.prevButton = prevButton;
        window.nextButton = nextButton;
        window.counter = counter; // Store reference to counter
    
        // Toggle hints container visibility
        hintsButton.addEventListener('click', () => {
            if (hintsContainer.style.display === 'none') {
                hintsContainer.style.display = 'block';
                hintsButton.textContent = 'Hide Hints';
            } else {
                hintsContainer.style.display = 'none';
                hintsButton.textContent = 'Hints';
            }
        });
    
        // Close the modal if the hints container is clicked
        hintsContainer.addEventListener('click', () => {
            const modal = document.getElementById('imageModal');
            if (modal.style.display === 'flex') {
                modal.style.display = 'none'; // Close the modal if it's open
            }
        });
    
        // Toggle the mode when the slider is changed
        revealInfoInput.addEventListener('change', () => {
            // Check if an error message is displayed
            if (errorDisplayed) {
                return; // Skip refreshing metas if an error message is displayed
            }
            const currentIndex = window.currentIndex || 0; // Store the current index
            revealMode = revealInfoInput.checked;
            displayMetas(window.currentMetas); // Refresh the display with the current mode
            showMeta(currentIndex); // Restore the carousel to the previous index
        });
    
        // Store the input reference for later use
        window.revealInfoInput = revealInfoInput;
        window.currentIndex = 0; // Initialize the global currentIndex
    }

    // Loading CSS style for flag functionality
    function injectCSS(url) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        document.head.appendChild(link);

        // Fetch the JSON file
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://przemek54.github.io/an-easy-world/country-data.json',
            onload: function(response) {
                countryData = JSON.parse(response.responseText);
            },
            onerror: function(error) {
                console.error('Error fetching flags.json:', error);
            }
        });
    }

    // Modal for enlarging images
    function addModal() {
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'modal';

        // Create close button
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close';
        closeBtn.innerHTML = '&times;';

        // Create modal image
        const modalImg = document.createElement('img');
        modalImg.className = 'modal-content';
        modalImg.id = 'modalImage';

        // Append elements to modal
        modal.appendChild(closeBtn);
        modal.appendChild(modalImg);

        // Append modal to body
        document.body.appendChild(modal);

        // Add CSS styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .modal {
                display: none; /* Hidden by default */
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background-color: rgba(0,0,0,0.9);
            }
            .modal-content {
                transform: scale(0.75); /* Scale the image to 75% of its original size */
                max-width: 100%;
                max-height: 100%;
                margin: auto;
                display: block;
            }
            .close {
                position: absolute;
                top: 15px;
                right: 35px;
                color: #f1f1f1;
                font-size: 40px;
                font-weight: bold;
                transition: 0.3s;
            }
            .close:hover,
            .close:focus {
                color: #bbb;
                text-decoration: none;
                cursor: pointer;
            }
            .switch {
            position: relative;
            display: inline-block;
            width: 30px;
            height: 17px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 17px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 13px;
                width: 13px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .slider {
                background-color: #2196F3;
            }

            input:checked + .slider:before {
                transform: translateX(13px);
            }
        `;
        document.head.appendChild(style);
    }

    // Checking the map name
    function checkMap() {
        let mapNameElement = document.querySelector('div.status_value__w_Nh0');

        if (mapNameElement) {
            let mapName = mapNameElement.textContent.trim();
            if (mapName === 'An Easy World (alpha)') {
                console.log("Correct map! Running script...");
                setupHintsUI();
                addModal();
            } else {
                console.log("This script only works for the map 'An Easy World (alpha)'.");
            }
        } else {
            console.log("Could not find the map name element. Retrying...");
            setTimeout(checkMap, 1000);
        }
    }

    //// DISTANCE CALCULATION
    // Calculate the distance between two sets of coordinates (Haversine formula)
    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    }

    // Create a bounding box around the user's location
    function getBoundingBox(lat, lng, distanceKm) {
        const R = 6371; // Radius of the Earth in kilometers

        // Latitude and longitude offsets in degrees
        const latOffset = distanceKm / R * (180 / Math.PI);
        const lngOffset = distanceKm / (R * Math.cos(lat * Math.PI / 180)) * (180 / Math.PI);

        return {
            minLat: lat - latOffset,
            maxLat: lat + latOffset,
            minLng: lng - lngOffset,
            maxLng: lng + lngOffset
        };
    }

    // Check if a location is within the bounding box
    function isWithinBoundingBox(lat, lng, boundingBox) {
        return (lat >= boundingBox.minLat && lat <= boundingBox.maxLat &&
                lng >= boundingBox.minLng && lng <= boundingBox.maxLng);
    }

    //// TASK ROUTINE EVERY ROUND
    // Intercept the API call to get coordinates from Google Maps
    function interceptGoogleMapsAPI() {
        var originalOpen = XMLHttpRequest.prototype.open;
        let urlIntercepted = false;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (method.toUpperCase() === 'POST' &&
                (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
                 url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {

                urlIntercepted = true; // Mark that the expected URL has been intercepted

                this.addEventListener('load', function () {
                    try {
                        let interceptedResult = this.responseText;
                        const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
                        let match = interceptedResult.match(pattern);

                        if (match && match[0]) {
                            let split = match[0].split(",");
                            globalCoordinates.lat = Number.parseFloat(split[0]);
                            globalCoordinates.lng = Number.parseFloat(split[1]);

                            // Check if coordinates are (0, 0)
                            if (globalCoordinates.lat === 0 && globalCoordinates.lng === 0) {
                                displayError("Coordinates are (0, 0), indicating an error in fetching.");
                                return;
                            }

                            // Once the coordinates are intercepted, fetch the location data from the spreadsheet
                            fetchSheetsData(globalCoordinates);
                        } else {
                            throw new Error("Coordinates not found in the intercepted response.");
                        }
                    } catch (error) {
                        console.error("Error fetching coordinates:", error);
                        displayError("Error fetching coordinates.");
                    }
                });
            }
            return originalOpen.apply(this, arguments);
        };

        // Set a timeout to display an error if the expected URL isn't intercepted within 5 seconds
        setTimeout(() => {
            if (!urlIntercepted) {
                displayError("Couldn't get location.");
            }
        }, 5000);
    }

    // Display errors if location can't be found
    function displayError(message) {
        if (window.hintsContent) {
            window.hintsContent.textContent = message;
            errorDisplayed = true; // Set the error flag
        }
    }

    // Find location in the sheet and obtain its data
    function fetchSheetsData(coordinates) {
        const lat = parseFloat(coordinates.lat);
        const lng = parseFloat(coordinates.lng);
        const thresholdDistance = 0.1; // Set threshold distance in kilometers (100m)

        if (isNaN(lat) || isNaN(lng)) {
            displayError("Coordinates are not valid numbers");
            return;
        }

        // Declare timeoutId in the correct scope
        const timeoutId = setTimeout(() => {
            displayError("Location fetching timed out. Please try again.");
        }, 5000); // 5 seconds timeout

        GM_xmlhttpRequest({
            method: 'GET',
            url: locationsSheetUrl,
            onload: function(response) {
                try {
                    let locationsRows = parseTSV(response.responseText);
                    let closestLocation = null;
                    let smallestDistance = Infinity;
                    let matchingLocations = [];

                    // Pre-calculate bounding box based on threshold distance
                    let boundingBox = getBoundingBox(lat, lng, thresholdDistance);

                    // Iterate over the rows and calculate the distance only for locations within the bounding box
                    locationsRows.forEach(row => {
                        const sheetLat = parseFloat(row[1]);
                        const sheetLng = parseFloat(row[2]);

                        if (!isNaN(sheetLat) && !isNaN(sheetLng) && isWithinBoundingBox(sheetLat, sheetLng, boundingBox)) {
                            const distance = calculateDistance(lat, lng, sheetLat, sheetLng);

                            if (distance < thresholdDistance) {
                                matchingLocations.push(row);
                            }

                            if (distance < smallestDistance) {
                                smallestDistance = distance;
                                closestLocation = row;
                            }
                        }
                    });

                    // Clear the timeout if a location is found
                    clearTimeout(timeoutId);

                    if (matchingLocations.length > 1) {
                        displayError("Multiple matching locations found.");
                    } else if (closestLocation) {
                        console.log(`Closest location (${closestLocation[0]}) found at distance: ${smallestDistance} km`);
                        let metaIds = closestLocation[3] ? closestLocation[3].split(", ") : [];
                        if (metaIds.length > 0) {
                            fetchMetas(metaIds);
                        } else {
                            displayError("No meta IDs found for the closest location.");
                        }
                    } else {
                        displayError("No matching location found within the bounding box.");
                    }
                } catch (error) {
                    clearTimeout(timeoutId);
                    displayError('Error processing location data.');
                }
            },
            onerror: function(error) {
                clearTimeout(timeoutId);
                displayError('Error fetching location data.');
            }
        });
    }

    // Fetch metas based on the Meta IDs
    // The meta ID column are: 1) Meta ID, 2) Level, 3) Type, 4) Content, 5) Note, 6) Image (raw), 7) Image, 8) Examples, 9) Number of examples, 10) Country
    function fetchMetas(metaIds) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: metasSheetUrl,
            onload: function(response) {
                let metasRows = parseTSV(response.responseText);
                let metasToDisplay = [];
    
                // Loop through each Meta ID and match it with the rows in the metas sheet
                metaIds.forEach(metaId => {
                    metasRows.forEach(row => {
                        let sheetMetaId = row[0]; // Meta ID
                        if (sheetMetaId === metaId) {
                            metasToDisplay.push({
                                level: row[1],
                                type: row[2],
                                content: row[3],
                                note: row[4],
                                image: row[6],
                                country: row[9], // Add country information
                            });
                        }
                    });
                });
    
                displayMetas(metasToDisplay);
            },
            onerror: function(error) {
                console.error('Error fetching metas:', error);
            }
        });
    }

    // Parse the TSV response into an array of rows
    function parseTSV(tsv) {
        let lines = tsv.split("\n");
        return lines.map(line => line.split("\t"));
    }

    // Detect when the round is over
    function observeRoundChange() {
        let currentRoundText = null; // Store the current round text to detect changes

        const observer = new MutationObserver(() => {
            const roundNumberElement = document.querySelector('div[data-qa="round-number"] .status_value__w_Nh0');

            if (roundNumberElement) {
                const newRoundText = roundNumberElement.textContent;

                if (newRoundText !== currentRoundText) {
                    console.log(`Round changed: ${currentRoundText} -> ${newRoundText}`);
                    currentRoundText = newRoundText; // Update current round
                    resetHintsContent(); // Reset hints content when a new round starts
                }
            }
        });

        // Observe changes in the main container
        observer.observe(document.querySelector('#__next'), { subtree: true, childList: true });
    }

    // Reset hints when the round is over
    function resetHintsContent() {
        if (window.hintsContent) {
            window.hintsContent.style.display = 'flex';
            window.hintsContent.style.alignItems = 'center';
            window.hintsContent.style.justifyContent = 'center';
            window.hintsContent.style.height = '100%'; // Ensure the container takes full height
            window.hintsContent.innerHTML = '<b><i>LOADING...</i></b>';
        }
        window.currentIndex = 0; // Reset the global currentIndex
    }

    //// DISPLAY
    // Display an individual meta
    function showMeta(index) {
        window.currentIndex = index; // Update the global currentIndex
        const metasElements = window.hintsContent.querySelectorAll('div');
        metasElements.forEach((el, i) => el.style.display = (i === index) ? 'block' : 'none');
        if (window.counter) {
            window.counter.textContent = `${index + 1}/${metasElements.length}`;
        }
    }

    // Displaying the metas
    function displayMetas(metas) {
        if (window.hintsContent) {
            // Check if an error message is displayed
            if (errorDisplayed) {
                return; // Skip refreshing metas if an error message is displayed
            }
            window.hintsContent.innerHTML = ''; // Clear only the content area
        }
    
        window.hintsContent.style.display = 'block'; // Change from flex to block for normal flow
        window.hintsContent.style.textAlign = 'left'; // Align text to the left
    
        metas.forEach(meta => {
            let metaElement = document.createElement('div');
            metaElement.style.marginBottom = '10px';
            metaElement.style.fontSize = '12px';
    
            let contentElement = document.createElement('p');
            if (window.revealInfoInput && window.revealInfoInput.checked) {
                // Reveal mode: show original content
                contentElement.innerHTML = meta.content.replace(/[\{\}]/g, '');
            } else {
                // Hide mode: replace text within curly brackets with a single line
                contentElement.innerHTML = meta.content.replace(/\{([^}]*)\}/g, match => 
                    `<span style="border-bottom: 1.5px solid white; display: inline-block; width: ${6}ch; height: 2px; vertical-align: 0.25px;"></span>`);
            }
            metaElement.appendChild(contentElement);
    
            // Add Notes section
            if (meta.note) {
                let noteElement = document.createElement('p');
                noteElement.style.color = 'lightgray'; // Make Notes golden
                if (window.revealInfoInput && window.revealInfoInput.checked) {
                    // Reveal mode: show original note
                    noteElement.innerHTML = `<b>NOTE</b>: ${meta.note.replace(/[\{\}]/g, '')}`;
                    noteElement.style.fontSize = '10px';
                } else {
                    // Hide mode: replace text within curly brackets with a single line
                    noteElement.innerHTML = `<b>NOTE</b>: ${meta.note.replace(/\{([^}]*)\}/g, match => 
                        `<span style="border-bottom: 1.5px solid lightgray; display: inline-block; width: ${4.5}ch; height: 2px; vertical-align: 0.25px;"></span>`)}`;
                    noteElement.style.fontSize = '10px';
                }
                metaElement.appendChild(noteElement);
            }
    
            if (meta.image) {
                let imageElement = document.createElement('img');
                imageElement.src = meta.image;
                imageElement.style.maxWidth = '100%';
                imageElement.style.marginTop = '5px';
                imageElement.style.cursor = 'pointer';
    
                // Add instruction text below the image
                let instructionText = document.createElement('p');
                instructionText.textContent = 'Click on the image to enlarge it';
                instructionText.style.fontSize = '10px';
                instructionText.style.color = 'lightgray';
                instructionText.style.textAlign = 'center';
    
                if (window.revealInfoInput && window.revealInfoInput.checked) {
                    // Reveal mode: show images
                    imageElement.style.display = 'block';
                    instructionText.style.display = 'block';
                } else {
                    // Hide mode: hide images
                    imageElement.style.display = 'none';
                    instructionText.style.display = 'none';
                }
    
                imageElement.addEventListener('click', (event) => {
                    event.stopPropagation();
                    openModal(meta.image);
                });
    
                metaElement.appendChild(imageElement);
                metaElement.appendChild(instructionText);
            }
    
            // Add Credits section
            if (meta.country && window.revealInfoInput && window.revealInfoInput.checked) {
                let creditsElement = document.createElement('p');
                creditsElement.style.color = 'white'; // Style for credits
                let countries = meta.country.split(', ');
    
                let creditsContent = 'Learn more about ';
                countries.forEach((country, index) => {
                    let countryInfo = countryData[country];
                    if (countryInfo) {
                        creditsContent += `<font color="#42aaf5"><a href="${countryInfo.url}" target="_blank"><b>${country}</b></a></font>`;
                        if (countryInfo.code) {
                            creditsContent += `<span class="fi fi-${countryInfo.code}" style="vertical-align: 0.25px; margin-right: 4px; margin-left: 4px"></span>`;
                        }
                    } else {
                        creditsContent += `<b>${country}</b>`;
                    }
                    if (index < countries.length - 1) {
                        creditsContent += ' and ';
                    }
                });
                creditsContent += ' on PlonkIt!';
                creditsElement.innerHTML = `<i>${creditsContent}</i>`;
                metaElement.appendChild(creditsElement);
            }
    
            window.hintsContent.appendChild(metaElement);
        });
    
        // Reset the error flag when metas are successfully displayed
        errorDisplayed = false;
    
        // Store the current metas for refreshing
        window.currentMetas = metas;
    
        // Initialize carousel index
        const metasElements = window.hintsContent.querySelectorAll('div');
    
        // Show the current meta
        showMeta(window.currentIndex);
    
        // Add carousel functionality to cycle through metas
        if (window.prevButton && window.nextButton) {
            window.prevButton.onclick = () => {
                window.currentIndex = (window.currentIndex > 0) ? window.currentIndex - 1 : metasElements.length - 1;
                showMeta(window.currentIndex);
            };
    
            window.nextButton.onclick = () => {
                window.currentIndex = (window.currentIndex < metasElements.length - 1) ? window.currentIndex + 1 : 0;
                showMeta(window.currentIndex);
            };
        }
    }

    // Picture enlargement
    function openModal(imageSrc) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const closeBtn = document.querySelector('.close');

        modal.style.display = 'flex'; // Set display to flex when showing the modal
        modalImg.src = imageSrc;

        // Add instruction text for closing the modal
        let instructionText = document.getElementById('modalInstructionText');
        if (!instructionText) {
            instructionText = document.createElement('div');
            instructionText.id = 'modalInstructionText';
            instructionText.textContent = 'Click anywhere outside the image or on the "X" to close';
            instructionText.style.position = 'absolute';
            instructionText.style.bottom = '20px';
            instructionText.style.width = '100%';
            instructionText.style.textAlign = 'center';
            instructionText.style.color = 'white';
            instructionText.style.fontSize = '14px';
            modal.appendChild(instructionText);
        }

        function closeModal() {
            modal.style.display = 'none';
            if (instructionText) {
                instructionText.remove(); // Remove instruction text when closing
            }
        }

        closeBtn.onclick = closeModal;

        modal.onclick = function(event) {
            if (event.target === modal) {
                closeModal();
            }
        };

        // Close the modal if the hints container is clicked
        window.hintsContainer.addEventListener('click', closeModal);
    }

    //// MISCELLANEOUS
    // Global error handler
    window.onerror = function(message, source, lineno, colno, error) {
        console.error("An error occurred:", message, "at", source, ":", lineno, ":", colno, error);
    };

    //// ACTUAL ACTIONS
    // Obtain first location (must be before map-checking to guarantee functionality after refreshing)
    interceptGoogleMapsAPI();

    // Initialize UI
    checkMap();
    injectCSS('https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css');

    // Start observing round changes
    observeRoundChange();
    }

// Run
runScript();