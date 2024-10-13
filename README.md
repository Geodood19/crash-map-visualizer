# MAP673 FINAL PROJECT PROPOSAL - CRASH DATA VISUALIZER 

<!-- TOC -->

- [Project Description](#project-description)
- [Map Objectives](#map-description)
- [Data Sources and Technology Stack](#data-sources-tech-stack)

<!-- /TOC -->

## Project Description

The final project I am going to propose for MAP673 is going to be a comprehensive digital map showcasing crashes. While ultimately, I would like to have more of a focus on user input where they prompt the map to be created by importing their own crash data, I will have to settle on something that is loaded via a CSV form the repository. A big goal is to have something generated that can be duplicated across multiple projects - change which CSV the JS is pointing to, and viola! The crash data should still display. 

I want to have a crash data visualizer that is both aesthetic but also informative in a multitude of ways. A need that I have identified in my company is to move away from static maps and into digital maps for visualizing crashes. Project Managers specifically want to view all crashes within a specific time-frame and within specific mile point measurements in three ways: manner of collision, crash fatalities/injuries, and crash density via a classic heat map. But there is the classic restriction static maps have is that there is zero additional information afforded by showing this data, which has a host of valuable information associated with it. What crashes exist in the data where a pedestrian was struck? What about any hit-and-run crash incidents? What manner of collisions resulted in a serious or fatal injury? Typically, a CSV/Excel spreadsheet is submitted with all static crash maps, and Project Managers can visualize the text information that way, but it would be *much* more valuable to have a way for project managers to view crashes interactively in a map. 

## Map Description

The map will be a simple dot map, but with the ability to be toggled/viewed in multiple ways - crash density, manner of collision, KABCO (crash severity classification), pedestrian/bicycle crashes, fatal crashes *only*, hit-and-run, and more. Upon startup, the map should load, snap to the view extent of the data, and show each crash record, in a black/charcoal-gray dot with a very thin white stroke, and a transparent heat layer, which shows teh crash density that dynamically updates the "heat" when the user zooms in/out. A dropdown that shows different ways of visualizing the crash data will be on the map, with a prompt to encourage the user to click and update the map with different attributes. For each view, the total counts of each type in any attribute will be shown (total fatal crashes, total angle crashes, total pedestrian crashes, etc.). The base map will be a dark, monochromatic base layer so that the focus is entirely on the data and map elements (user interactive elements). 

## Data Sources and Technology Stack

- Crash data will be sourced from [CrashInformationKY.org](https://crashinformationky.org/AdvancedSearch)
- Technology used:
    - Python via ArcGIS Pro (using integrated ArcGIS Notebooks) to calculate data about KABCO from multiple spreadsheets and then convert it to a CSV
    - Data will be accessed in a CSV only - no need for a GeoJSON 
    - JS Libraries include MapLibre and D3. 
    - Will also be developing a web page using HTML with common styles in CSS, and eventually integrating the CSS styles in a common format.
    - Hosting platform will initially be on GitHub, but could eventually be moved to its own web page with a custom URL. 