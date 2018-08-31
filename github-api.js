var apiBase = 'https://api.github.com';
var token = 'cebda1c0ce331c9e31824b35fe6ca1000ccb9e9e';
var repository = 'mafiaclub/mafiaclub.github.io';
var fileBase = 'https://raw.githubusercontent.com/mafiaclub/mafiaclub.github.io';

function makeApiCall(url, callback) {
  $.ajax({
    url: apiBase + url,
    dataType: 'json',
    data: null,
    success: callback,
    headers: {
      'Authorization' : 'Bearer ' + token,
    }
  });
}

// data commit = {
//    sha :: sha1
//    author :: name of author
//    date :: date of change
// }

// marshall a commit api response from github to a commit object as specified
// above
function toCommit(githubCommit) {
  return {
    sha: githubCommit.sha,
    author: githubCommit.commit.author.name,
    date: githubCommit.commit.author.date,
  }
}

// callback :: [commit] -> ()
// commits are ordered from newest (the current commit) to oldest known change
function withTierHistory(tierID, callback) {
  return makeApiCall(
    '/repos/' + repository + '/commits'
    + '?path=' + tierFileFor(tierID),
    function (result) {
      callback(result.map(toCommit));
    }
  );
}

function withTier(tierID, callback) {
  withTierSha(tierID, "master", callback);
}

function withTierSha(tierID, sha, callback) {
  $.getJSON(fileBase + '/' + sha + '/' + tierFileFor(tierID), callback);
}

// data tierDiff = {
//    added :: [role]
//    removed :: [role]
//    -- this is only best effort; it is valid for this to be empty for any case
//    changed :: [role]
// }

// callback :: tierDiff -> ()
function withTierChanges(tier, shaNew, shaOld, callback) {
  withTierSha(tier, shaNew, function(tierNew) {
    withTierSha(tier, shaOld, function(tierOld) {
      var tierDiff = {
        added: tierNew.roles.filter(x => ! tierOld.roles.includes(x)),
        removed: tierOld.roles.filter(x => ! tierNew.roles.includes(x)),
        changed: []
      };
      callback(tierDiff);
    });
  });
}
