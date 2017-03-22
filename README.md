# Restaurant Finder with Algolia Search API

## Demo Details

Our sales team has recently been contacted by a large restaurant reservation website, for whom they have identified it to be strategic to build a demo. They need a small prototype that&mdash;using the dataset and UI they have provided us&mdash;highlights the benefits of a great search experience using the [Algolia Search API](https://www.algolia.com/doc/).

### Steps

- Setup an Algolia account and push the provided dataset to an Algolia index.
- Produce the HTML markup and CSS needed to reproduce the UI provided by the client.
- Implement an as-you-type search experience that enables users to easily find restaurants: both by passing a search query and/or filtering on the &ldquo;type of cuisine&rdquo;
- Leverage the user&rsquo;s location to show restaurants closer to them higher in the results&mdash;with a fallback if they dont&rsquo;t allow for geolocation permissions in the browser

![Screenshot](/_resources/mockups/full-version.png)

*Screenshot of a target UI*

#### Important Notes about the dataset

- They have been able to extract 5000 restaurants from their database: `restaurants_list.json`. Unfortunately, because of some system complexity on their side, they haven&rsquo;t been able to provide everything in one file only. They have sent us another file named `restaurants_info.csv` that contains additional information for all the extracted restaurants.
  - Both data files need to be manipulated in order to have access to the &ldquo;type of cuisine.&rdquo;
  - For payment options, we should **only** have: AMEX/American Express, Visa, Discover, and MasterCard
  - For our purpose, Diners Club and Carte Blanche are Discover cards

Note: The provided dataset has been created using the https://github.com/sosedoff/opentable project.
