It is important to remember that each feature should be created in a different branch. e.g. if you have to create a new movement and a new attack. Create a branch for movement and another one for attack.
Useful commands:

git branch
-shows current branch you are working on

git checkout <branch name>
-changes to the branch you selected. If you have untracked or uncomitted files it will not let you changes

git checkout -b <branch name>
-creates a new branch and changes to it. If you have untracked or uncomitted files it will not let you changes

git add -A
-Adds all untracked files. It prepares them to commit

git commit -m "<message>"
-commits the code to the branch with the message selected

git log
-shows a log of the commits

git push -u origin <branch>
-pushes all the changes to our online repo from the branch selected. Never push direct to the master branch

git fetch origin <branch>
-fetches the latest changes from the online repo from the selected branch

git pull origin <branch>
-fetches and merges the latest changes from the online repo from the selected branch.

