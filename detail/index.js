var tierID = window.location.search.substring(1);
tierID = tierID.replace(/\./, '-');
// it would be good to validate the tier string a little bit more

$.getJSON(prefix + '/tiers/' + tierID + '.json', function(tier) {
  $.getJSON(prefix + '/roles.json', function(allRoles) {
    console.log(tier);
    $('#tier-name').text(tier.name);
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

// global state for the history explorer
var global = {
  history: null,
  currentChange: null,
  detailed: false,
};

function dateString() {
  if (global.currentChange == null || global.currentChange < 1) {
    throw "Invalid currentChange while trying to compute dateString()";
  } else if (global.currentChange == 1) {
    var date = new Date(global.history[0].date);
    return 'on ' + date.toDateString();
  } else {
    var date = new Date(global.history[global.currentChange].date);
    return 'since ' + date.toDateString();
  }
}

function changesWidget(changes) {
  return '<span class="text-success">+' + changes.added.length + '<\/span>'
    + '<span class="text-danger">-' + changes.removed.length + '<\/span>';
}

function older(text) {
  return moveHistory('global.currentChange++;', text);
}

function newer(text) {
  return moveHistory('global.currentChange--;', text);
}

function moveHistory(move, text) {
  return '<a href="#" onclick="'
    + move
    + 'updateHistoryExplorer();'
    + 'return false;'
    + '">'
    + text
    + '</a>';
}

function historyWidget(changes) {
  switch (global.currentChange) {
    case null:
      throw "Invalid currentChange in historyWidget";
    case 0:
      return older("Show changes");
    case 1:
      return changesWidget(changes)
        + ' ' + dateString()
        + ' ' + older("Older")
        + ' ' + newer("Hide changes");
    case global.history.length - 1:
      return changesWidget(changes)
        + ' ' + dateString()
        + ' ' + newer("Newer");
    default:
      return changesWidget(changes)
        + ' ' + dateString()
        + ' ' + older("Older")
        + ' ' + newer("Newer");
  }
}

// renders the state stored in global
function updateHistoryExplorer() {
  // if we don't have a current change we can't show the history
  if (global.currentChange == null) { return; }

  var shaNew = global.history[0].sha;
  console.log(global.history[global.currentChange]);
  console.log(global.currentChange);
  console.log(global.history);
  var shaOld = global.history[global.currentChange].sha;
  withTierChanges(tierID, shaNew, shaOld, function(changes) {
    console.log(changes);
    $('#tier-changes').html(historyWidget(changes));
    // update colors if necessary on roles
  });
}

withTierHistory(tierID, function(history) {
  global.history = history;
  console.log(history);

  // if there is no history don't bother displaying the history explorer
  if (history.length <= 1) { return; }
  console.log(history);

  global.currentChange = 0;
  // idea start current change at 0; which just displays a thing that says
  // show history
  updateHistoryExplorer();
});
