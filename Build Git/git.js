// create repo
(function () {
  class Git {
    constructor(name) {
      this.lastCommitId = -1;
      // Note: In actuall Git , commit id is 40-hexdigit number also calles as "SHA-1 id".
      // but we are simply using integers instead
      this.name = name;
    }
  }

  class Commit {
    constructor(id, message) {
      this.id = id;
      this.message = message;
    }
  }

  Git.prototype.commit = (message) => {
    var commit = new Commit(++this.lastCommitId, message);
    return commit;
  };

  // git init
  var repo = new Git('my-repo');

  repo.commit('make commit now'); // > git commit -m 'Make commit now'

  // Commit history - chaining the commits
  // git has a command called log which shows the coomit history in reverse chronological order, first the lastest commit followed  by previous ones.

  // let's implement that
  // to do
  //1. Start from last commit
  // 2. Go backtracking to the first commit
  // 3. push in 'history'
  Git.prototype.log = function () {
    var history = []; // array of commits in reverse order

    return history;
  };

  console.log('Git.log() test');

  let repo1 = new Git('test');
  repo.commit('Initial commit');
  repo.commit('change 1');

  var log = repo1.log();

  console.assert(log.length == 2); //should have 2 commits
  console.assert(!!log[0] && log[0].id === 1); // Commit 1 should be first
  console.assert(!!log[1] && log[1].id === 0); // and then Commit 0;

  // expose to window
  window.Git = Git;
});
