# Mixtape: A music recommendation platform

## Introduction

This project was completed as an independent study during the last term of my senior year (Spring 2026) at Carleton College. My goal for this web app was to get practice working with APIs. My primary objectives were to practice calling external APIs and to build my own API. I listen to and think about music a lot, so I decided to work with Spotify data for this project. I had a lot of fun learning more about music throughout the development process, and it was fufilling to apply API exploration to a topic I am passionate about.

## Project phases

This project was split into four different phases, each with individual objectives. They are described below.

1. I selected an arbitary set of ten artists and hard coded them into the web app. Users had an option to choose an artist from the provided selection and click on two buttons to see facts about them. One button displayed the number of Spotify followers the artist had and the other button displayed the artist's most popular song. The data displayed by the buttons came from Spotify's API.
2. I sourced a Spotify dataset from Kaggle with thousands of rows of data from 2025. Using this dataset, I upgraded the set of ten artists to include all artists featured in the dataset. I kept the same two buttons from before, but I added a popularity rating when displaying the artist's most popular song.
3. Next, I made the switch to working with APIs. I enabled the user to provide a search term and select their desired music genre from a dropdown of options. I chose nine of the most popular music genres as listed on [Every Noise at Once](https://everynoise.com/engenremap.html), a very cool sound project. Using these pieces of information, I made a call to [Spotify's /search API](https://developer.spotify.com/documentation/web-api/reference/search) to find artists that match the user's query. A button displayed these recommended artists for the user.
4. As an extension of the fourth phase, I linked each recommended artist to their external Spotify page. This provides a way for users to listen to these artists' music directly from the web app.  

## Learnings

The iterative, phase-based nature of this project allowed me to learn about the benefits and drawbacks of APIs in small pieces. Building Mixtape taught me that APIs are really just tools to enable to flow of data between devices. All APIs are fundamentally methods of raw JSON communication. This realization demystified APIs and made it clear to me how powerful and useful they are, given that the internet is based on the sharing of information across networks.

This project also made me realize how helpful APIs are in the context of microservices. Being able to have various APIs for fetching distinct pieces of information allows complex systems of software to be broken down into maintainable, scalable parts each with a singular purpose. In this way, APIs are the foundation for modular microservices that compartmentalize logic and functionality. 

## Limitations

There were a few obstacles and limitations that I ran into over the course of this project. First, Spotify's Development Mode was reduced in scope beginning in Feburary 2026. This meant that many of the Spotify API endpoints I wanted to use for this project had been recently deprecated. As a result, it was challenging to find endpoints that returned helpful and interesting information for generating music recommendations. Furthermore, I found the Spotify /search API to be somewhat limited in its capabilities. It was unable to return nonempty responses for many basic search queries.

While researching these limitations with Spotify Development Mode, I found some intriguing discourse online about the overall trend towards restricting Spotify's developer toolkit and public API offerings. The overwhelming public opinion seems to be one of concern for the future of what a Reddit user calls "indie development." [This Spotify changelog](https://developer.spotify.com/documentation/web-api/references/changes/february-2026) lists the specific endpoints that were removed, added, renamed, or kept unchanged as of February 2026. Most of the changes were to remove available endpoints.

I would like to acknowledge that I had limited time for this project and did not get the opportunity to explore the majority of Spotify's public APIs, so my reflections on Spotify's Development Mode are not comprehensive. 

## Future scope

Do clustering and make actual legit recommendations based on multiple variables collected about the user and their taste
