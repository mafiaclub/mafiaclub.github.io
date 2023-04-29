// COPIED FROM index.js in main folder
var popover = function(name, description, team) {
    return '<button type="button" class="btn btn-default" href="#" data-content="'
      + quoteattr(description)
      + '" rel="popover" data-placement="top" data-original-title="'
      + quoteattr(name + ' - ' + team)
      + '" data-toggle="popover" data-trigger="hover">'
      + quoteattr(name)
      + '<\/button>';
  };
  
  var tabPlaceholder = function(tierID) {
    var id = 'tab-placeholder-' + tierID;
    return {
      html: '<div id="' + id + '"><\/div>',
      id: id
    };
  }
  
  var tab = function(tier, active) {
    return '<li class="' + (active ? 'active' : '') + '">'
      + '<a href="#tier-' + quoteattr(tier.version) + '" data-toggle="tab" '
      + 'aria-expanded="'
      + (active ? 'true' : 'false') + '">'
      + quoteattr(tier.name)
      + '<\/a><\/li>';
  };
  
  var tierList = function(tier, active) {
    return '<div class="tab-pane fade' + (active ? ' active in' : '')
      + '" id="tier-' + quoteattr(tier.version) + '">'
      + '<p>' + quoteattr(tier.description) + '<\/p>'
      + '<div id="tier-' + quoteattr(tier.version) + '-list" class="container">'
      + '<\/div>'
      + '<p><a href="/detail?' + tier.version + '">Expand role descriptions.</a></p>'
      + '<\/div>';
  }
  
  var makeList = function(tierID, allRoles, active) {
    // in order to avoid out of order initialization of tabs we put a placeholder
    // before initializing it with the correct data
    var placeholder = tabPlaceholder(tierID);
    $('#tier-tabs').append(placeholder.html);
    $.getJSON(prefix + '/' + tierFileFor(tierID), function(tier) {
      var roles = tier.roles.flatMap(x => toArray(getRoleData(allRoles, x)));
      $('#' + placeholder.id).replaceWith(tab(tier, active));
      $('#tiers').append(tierList(tier, active));
      $.each(roles, function(ix, e) {
        $('#tier-' + tier.version + '-list')
          .append(popover(e.name, e.description, e.team));
      });
      // make popovers actually into popovers
      // Note: we need to do this initialization here because otherwise the
      // elements might not have been created yet first
      $('[data-toggle="popover"]').popover();
    });
  };
  
  $.getJSON(prefix + '/tier-manifest.json', function(tiers) {
    $.getJSON(prefix + '/roles.json', function(roles) {
      // generate all of the tier lists
      $.each(tiers, function(ix, e) {
        var active = ix === 0;
        makeList(e, roles, active);
      });
    });
  });
  