# MAP673 FINAL PROJECT PROPOSAL - CRASH DATA VISUALIZER 

<!-- TOC -->

- [Project Description](#project-description)
- [Map Objectives](#map-description)
- [Data Sources and Technology Stack](#data-sources-tech-stack)

<!-- /TOC -->

## Project Description

This was a final project developed for MAP673: Design for Interactive Web Mapping. The data was sourced from [CrashInformationKY.org](https://crashinformationky.org/AdvancedSearch) for individual months of 2023 in Fayette County, Kentucky. The intent was to develop a way to interactively view crashes in multiple ways: crash density, crash fatalities (via KABCO classification), and the manner of collision. Crash records also have a temporal aspect to it (the time of each incident is recorded) and crashes can be filtered by time of day. This allows for a dynamic and comprehensive understanding to see spatial and temporal distribution of crashes in a variety of ways. 

The ultimate goal for this visualization is to develop things in such a way that a user can upload a prepared geojson or a CSV and that data be dynamically added to the map for project engineers to visualize their own data for analysis. However, given that this is a beta version to understand the capabilities and extent of what can be done, crash data is pre-loaded and initialized in this map. 

To view this crash data, please visit this URL: [crash-map-visualizer](https://geodood19.github.io/crash-map-visualizer/).

## Map Description

The crash data was initially manipulated using Microsoft Excel, and the map elements are generated via the D3 and MapLibre JavaScript libraries. The map is a simple dot map, but with the ability to be toggled/viewed in multiple ways. The map shows crashes on the KABCO property (which was pre-calculated in Excel through the multiple tabs/spreadsheets in the aforementioned data source) initially and is overlain by crash density (heat map). The crash density layer intensity is weighed by the crash severity (greater crash severity skews the density towards those attributes). A chart is drawn via D3 and can be opened/closed in a "Crash Statistics" button. When the user hovers over any indiviual bar in the chart, the data is filtered dynamically in the map to highlight those manner of collisions. Alternatively, a combined use of the time slider and the crash severity checkbox can give the user a better understanding of crash data in multiple ways. 

For the use in transportation planning, crashes inside of parking lots/parking structures were filtered from this analysis/visualization. 

While it is generated and displayed, disadvantaged communities (in magenta polygons) in Fayette County (categorized via the [Justice40 initiative](https://screeningtool.geoplatform.gov/en/#3.56/31.3/-95.16)) typically experience more crashes than non-disadvantaged communities. Eventually this map will be updated with a choropleth layer on all the census tracts for Fayette County, where crash totals in each census tract will be normalized to the total number of crashes displayed in this crash map visualizer. 

## Data Sources and Technology Stack

- Crash data will be sourced from [CrashInformationKY.org](https://crashinformationky.org/AdvancedSearch)
- Census Tract with climate and economic justice screening data was sourced from [Justice40 initiative](https://screeningtool.geoplatform.gov/en/#3.56/31.3/-95.16)
- Technology used:
    - Python via ArcGIS Pro (using integrated ArcGIS Notebooks) to calculate data about KABCO from multiple spreadsheets and then convert it to a CSV
    - Data will be accessed in a CSV
    - JS Libraries include MapLibre and D3. 
    - Will also be developing a web page using HTML with common styles in CSS, and eventually integrating the CSS styles in a common format.
    - Hosting platform will initially be on GitHub, but could eventually be moved to its own web page with a custom URL. 