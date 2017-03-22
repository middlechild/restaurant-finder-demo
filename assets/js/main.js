var self,
    settings,
    client,
    helper,
    RestaurantSearch = {

  settings: {

    applicationID: 'AZZ840SW44',
    apiKey: 'bd3c34a38733c721f6ed4f621a093fb5',
    indexName: 'restaurants',
    facetNames: {
      'food_type': 'Cuisine/Food Type',
      'stars_count': 'Rating',
      'payment_options': 'Payment Options'
    }
  },


  events: function() {

    client = algoliasearch(settings.applicationID, settings.apiKey);

    helper = algoliasearchHelper(client, settings.indexName, {
      // Algolia helper configuration
      maxValuesPerFacet: 10,
      disjunctiveFacets: ['food_type', 'stars_count', 'payment_options'],
      aroundLatLngViaIP: true
    });

    var $facets = $('#facets-list'),
        $input = $('#search-input'),
        $loadMoreBtn = $('#load-more-btn');

    // Bind events
    helper.on('result', self.searchCallback);
    $facets.on('click', self.handleFacetClick);
    $loadMoreBtn.on('click', self.loadMoreRecords);

    $input.on('keyup', function() {
      helper.setQuery($(this).val()).search();
    });

    // Trigger first search
    helper.search();
  },


  searchCallback: function(results) {

    var $hits = $('#results-list'),
        $facets = $('#facets-list'),
        $loadMoreBtn = $('#load-more-btn');

    if (results.hits.length === 0) {
      $hits.empty();
      self.updateProcessInfo(0, results.processingTimeMS);
      return;
    }

    // Render hits & facets
    self.renderHits($hits, results);
    self.renderFacets($facets, results);

    // Add *Load More* button if necessary
    if (results.page >= (results.nbPages-1)) {
      $loadMoreBtn.addClass('hidden');
    } else {
      $loadMoreBtn.removeClass('hidden');
    }
  },


  handleFacetClick: function(e) {

    e.preventDefault();
    var target = e.target,
        attribute = target.dataset.attribute,
        value = target.dataset.value;

    // Make user is not clicking where there is nothing
    if(!attribute || !value) return;

    // Refine search
    helper.toggleRefine(attribute, value).search();
  },


  loadMoreRecords: function(e) {

    e.preventDefault();
    self.appendingRecords = true;
    helper.setPage(helper.getPage()).nextPage().getPage();
    helper.search();
  },


  renderHits: function($hits, results) {

    // Processing info
    self.updateProcessInfo(results.nbHits, results.processingTimeMS);

    // Get template
    var $template = $('#result-item-template');

    var hits = results.hits.map(function renderHit(hit) {

      var starRound = hit.stars_count * 10;

      return $template.html()
          .replace(/{{ name }}/ig, hit.name)
          .replace(/{{ image }}/ig, hit.image_url)
          .replace(/{{ rating }}/ig, hit.stars_count)
          .replace(/{{ star }}/ig, starRound)
          .replace(/{{ reviews }}/ig, hit.reviews_count)
          .replace(/{{ type }}/ig, hit.food_type)
          .replace(/{{ price }}/ig, hit.price_range)
          .replace(/{{ neighborhood }}/ig, hit.neighborhood);
    }).join('');

    // Append records when loading more records
    if (self.appendingRecords === true) {
      $hits.append(hits);
    } else {
      $hits.html(hits);
    }
    self.appendingRecords = false;
  },


  renderFacets: function($facets, results) {

    // Get template
    var $facetTemplate = $('#facet-item-template');

    // Disjunctive facets
    var facets = results.disjunctiveFacets.map(function(facet) {

      var name = facet.name,
          header = '<h4 class="facet-name">' + settings.facetNames[name] + '</h4>',
          facetValues = results.getFacetValues(name);

      if (name === 'food_type' || name === 'payment_options') {
        var facetsValuesList = $.map(facetValues, function(facetValue) {

          var facetValueClass = facetValue.isRefined ? 'refined'  : '';

          // Look ma! No Handlebars! :P
          return $facetTemplate.html()
              .replace(/{{ class }}/ig, facetValueClass)
              .replace(/{{ attribute }}/ig, name)
              .replace(/{{ value }}/ig, facetValue.name)
              .replace(/{{ count }}/ig, facetValue.count);
        })
        return header + '<ul>' + facetsValuesList.join('') + '</ul>';
      } else {
        // Add Ratings placeholder for now
        // ToDo: Implement stars_count facet (outside the scope of this exercise)
        var $ratingTemplate = $('#temp-rating-template').html();
        return $ratingTemplate;
      }
    });

    $facets.html(facets.join(''));
  },


  updateProcessInfo: function(total, time) {

    $('#total-records').text(total + ' results found ');
    $('#processing-time').text('in ' + (time / 1000) + ' seconds');
  },


  init: function () {

    self = this;
    settings = this.settings;
    this.events();
  }

};


$(function () {
  console.log('Page Loaded');
  RestaurantSearch.init();
});
