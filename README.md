# Mixtape: A music recommendation platform

## Introduction

This project was completed as an independent study during the last term of my senior year (Spring 2026) at Carleton College. My goal for this web app was to get practice working with APIs. My primary objectives were to practice calling external APIs and to build my own API. I listen to and think about music a lot, so I decided to work with Spotify data for this project. I had a lot of fun learning more about music throughout the development process, and it was fufilling to apply API exploration to a topic I am passionate about.

## Project phases

This project was split into five different phases, each with individual objectives. They are described below.

1. I selected an arbitary set of ten artists and hard coded them into the web app. Users had an option to choose an artist from the provided selection and click on two buttons to see facts about them. One button displayed the number of Spotify followers the artist had and the other button displayed the artist's most popular song. The data displayed by the buttons came from Spotify's API.
2. I sourced a Spotify dataset from Kaggle with thousands of rows of data from 2025. Using this dataset, I upgraded the set of ten artists to include all artists featured in the dataset. I kept the same two buttons from before, but I added a popularity rating when displaying the artist's most popular song.
3. Next, I made the switch to working with APIs. I enabled the user to provide a search term and select their desired music genre from a dropdown of options. Using these pieces of information, I made a call to Spotify's /search API to find artists that match the user's query. These recommended artists were displayed on the page for the user.
4. As an extention of the fourth phase, 



1 - hard coded list of artists, get random facts about them
2 - get the spotift dataset, update the dropdown to have a ton of artists to choose from, get random facts about them
3 - switch to /search API and display artists
4 - link returned artists to external spotify page
5 - experiment with also generating playlists and fail, research into limited Spotify developer environment

## Learnings


## Limitations

Spotify API limitations

## Future scope

Do clustering and make actual legit recommendations based on multiple variables collected about the user and their taste
