var tierID = window.location.search.substring(1);
tierID = tierID.replace(/\./, '-');
// it would be good to validate the tier string a little bit more

$.getJSON(prefix + '/tiers/' + tierID + '.json', function(tier) {
  $.getJSON(prefix + '/roles.json', function(allRoles) {
    console.log(tier);
    $('#tier-heading').text(tier.name);
    $('#tier-description').text(tier.description);
    var roles = allRoles.filter(x => tier.roles.includes(x.name));
    var townRoles = [];
    var mafiaRoles = [];
    var thirdPartyRoles = [];
    $.each(roles, function(ix, e) {
      console.log(ix, e);
      switch (e.team) {
        case "Town":
          townRoles.push(e);
          break;
        case "Mafia":
          mafiaRoles.push(e);
          break;
        case "Third Party":
          thirdPartyRoles.push(e);
          break;
        default:
          throw "Invalid team!";
      }
    });

    // divide town roles into two parts to have more even ui
    var townRoles1 = [];
    var townRoles2 = [];
    // dividing by 2 is somewhat dependent on the json content; it would
    // look really ugly if there was more stuff in the second column than the
    // first
    var split = (townRoles.length + 1) / 2;
    $.each(townRoles, function(ix, e) {
      if (ix < split) {
        townRoles1.push(e);
      } else {
        townRoles2.push(e);
      }
    });

    var townRoleList1 = new List('town-role-list-1', {
      item: 'single-col-item',
      valueNames: ['name', 'description']
    }, townRoles1);
    var townRoleList2 = new List('town-role-list-2', {
      item: 'single-col-item',
      valueNames: ['name', 'description']
    }, townRoles2);
    var mafiaRoleList = new List('mafia-role-list', {
      item: 'single-col-item',
      valueNames: ['name', 'description']
    }, mafiaRoles);
    var thirdPartyRoleList = new List('third-party-role-list', {
      item: 'single-col-item',
      valueNames: ['name', 'description']
    }, thirdPartyRoles);

  });
});
