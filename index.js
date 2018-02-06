var prefix = '/raw.githubusercontent.com/mafiaclub/mafiaclub.github.io/master';

var popover = function(name, description, team) {
  return '<button type="button" class="btn btn-default" href="#" data-content="'
    + description
    + '" rel="popover" data-placement="top" data-original-title="'
    + name + ' - ' + team
    + '" data-toggle="popover" data-trigger="hover">'
    + name
    + '<\/button>';
};

var tab = function(tier, active) {
  return '<li class="' + (active ? 'active' : '') + '">'
    + '<a href="#tier-' + tier.version + '" data-toggle="tab" '
    + 'aria-expanded="'
    + (active ? 'true' : 'false') + '">'
    + tier.name
    + '<\/a><\/li>';
};

var tierList = function(tier, active) {
  return '<div class="tab-pane fade' + (active ? ' active in' : '')
    + '" id="tier-' + tier.version + '">'
    + '<p>' + tier.description + '<\/p>'
    + '<div id="tier-' + tier.version + '-list" class="container">'
    + '<\/div>'
    + '<p>For more details see <a href="/detail?' + tier.version + '">here</a>.</p>'
    + '<\/div>';
}

var makeList = function(tier, tiers, roles, active) {
  var tier = tiers.find(x => tier === x.version);
  var roles = roles.filter(x => tier.roles.includes(x.name));
  $('#tier-tabs').append(tab(tier, active));
  $('#tiers').append(tierList(tier, active));
  $.each(roles, function(ix, e) {
    $('#tier-' + tier.version + '-list')
      .append(popover(e.name, e.description, e.team));
  });
};

$.getJSON(prefix + '/tier-manifest.json', function(data) {
  $.getJSON(prefix + '/tiers.json', function(tiers) {
    $.getJSON(prefix + '/roles.json', function(roles) {
      // generate all of the tier lists
      $.each(data, function(ix, e) {
        var active = ix === 0;
        makeList(e, tiers, roles, active);
      });
      // make popovers actually into popovers
      $('[data-toggle="popover"]').popover();
    });
  });
});
