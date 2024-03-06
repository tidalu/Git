// create repo
(function () {
  /**
   * Commit class
   * A single commit.
   *
   * @param {number} id  		 ID of commit.
   * @param {Commit} parent	 Parent Commit.
   * @param {string} message		 Commit message.
   */
  class Commit {
    constructor(id, parent, message) {
      this.id = id;
      this.message = message;
      this.parent = parent;
    }
  }

  /**
   * Branch class.
   * A Branch.
   * @param {string} name 	Branch name.
   * @param {number} commit   Commit it points to.
   */
  class Branch {
    constructor(name, commit) {
      this.name = name;
      this.commit = commit;
    }
  }

  /**
   * Git class
   * Represents a Git repository.
   *
   * @param {string} name Repository name.
   */
  class Git {
    constructor(name) {
      this.name = name;
      this.lastCommitId = -1;
      // Note: In actuall Git , commit id is 40-hexdigit number also calles as "SHA-1 id".
      // but we are simply using integers instead
      this.branches = [];

      var master = new Branch('master', null);
      this.branches.push(master);
      this.HEAD = master;
    }
  }

  /**
   * Make a commit.
   * @param  {string} message Commit message.
   * @return {Commit}         Created commit object.
   */
  Git.prototype.commit = function (message) {
    var commit = new Commit(++this.lastCommitId, this.HEAD?.commit, message);
    this.HEAD.commit = commit;
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

  /**
   * Logs history.
   * @return {Array} Commits in reverse chronological order.
   */
  Git.prototype.log = function () {
    var commit = this.HEAD.commit,
      history = []; // array of commits in reverse order
    while (commit) {
      history.push(commit);
      // keep following the parent
      commit = commit.parent;
    }
    return history;
  }; // > git log and can be use as > repo.log()

  // now ew need to know last commit , and every commit should know what commit was before it

  // we have failing testcase right now
  // let's proceed with the first one

  // git has HEAD. it is simple a pointer to the current branch, you can see that by git 'log command', since we have now covered branches yet, we will relax the definition here, temp

  // what we will is add a property called HEAd in the Git class hich which will reference last commit's Commit Object: check Git class above

  //  now we are in second req, every commit should somehow know which commit was made before it, this brings up the comcept of parent in Git
  console.log('Git.log() test');

  let repo1 = new Git('test');
  repo.commit('Initial commit');
  repo.commit('change 1');

  var log = repo1.log();
  console.assert(log.length == 2); //should have 2 commits
  console.assert(!!log[0] && log[0].id === 1); // Commit 1 should be first
  console.assert(!!log[1] && log[1].id === 0); // and then Commit 0;

  /**
   * Checkout a branch or creates one if not present.
   *
   * @param  {string} branchName Branch to switch to or create.
   * @return {Branch}            Current branch after checkout.
   */
  Git.prototype.checkout = function (branchName) {
    // check first if the branch exist with the branchName
    for (let i = this.branches.length; i--; ) {
      if (this.branches[i].name === branchName) {
        // we found the existing branch
        console.log('Switching to existing branch: ' + branchName);
        this.HEAD = this.branches[i];
        return this;
      }
    }

    var newBranch = new Branch(branchName, this.HEAD.commit);
    this.branches.push(newBranch);
    this.HEAD = newBranch;

    console.log('Switched to new branch: : ' + branchName);
    return this;

    // actual commands:
    // > git checkout existing-branch
    // > git checkout -b new-branch
  };

  console.log('Git.checkout() test');
  var repo2 = new Git('test');
  repo2.commit('Initial commit');

  console.assert(repo.HEAD.name === 'master'); // Should be on master branch.
  repo.checkout('testing');
  console.assert(repo.HEAD.name === 'testing'); // Should be on new testing branch.
  repo.checkout('master');
  console.assert(repo.HEAD.name === 'master'); // Should be on master branch.
  repo.checkout('testing');
  console.assert(repo.HEAD.name === 'testing'); // Should be on testing branch again.

  // now only the last method is left whch ich checkout , it switch the existing branch , if not exist it also creates then switch: check above

  console.log(' Branch Test');

  var repo = new Git('Test');
  repo.commit('initial commit');
  repo.commit('change 1');

  // maps the array of commit if a string of commit ids
  // for [C2, C1, C2] it turns '2-1-0'

  function historyToIdMapper(history) {
    var ids = history.map(function (commit) {
      return commit.id;
    });
    return ids.join('-');
  }

  console.assert(historyToIdMapper(repo.log()) === '1-0'); // Should show 2 commits.

  repo.checkout('testing');
  repo.commit('Change 3');

  console.assert(historyToIdMapper(repo.log()) === '2-1-0'); // Should show 3 commits.

  repo.checkout('master');
  console.assert(historyToIdMapper(repo.log()) === '1-0'); // Should show 2 commits. Master unpolluted.

  repo.commit('Change 3');
  console.assert(historyToIdMapper(repo.log()) === '3-1-0'); // Continue on master with 4th commit.

  // expose to window
  window.Git = Git;
})();
