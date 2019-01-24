# bc19-g8
Group 8 code for Battlecode 19
## Members
- David Munoz Constantine
- Jason Brewer
- Divya Sravani
### Git Help
For help with git commands take a look at the git-help-readme.txt file
### Running the code
First install the bc19 
- npm install -g bc19
- Then run on our root repo folder
- bc19run -b bots/blue -r bots/red --chi 1000

## Testing
- We are using mocha and unit.js to do unit testing
- Unit.js is located in the node_modules folder
- Need to intall mocha in your folder by using commnad "sudo npm install -g mocha"
- Tests are located in test folder. Feel free to add more folders and tests
- Need to run test_rename.py python script to convert our .js files to .js node test files
- Run by using "python test_rename.py bots/red/file.js"
- Have to make sure the functions start with "export function" and that there are no spaces in between arguments
- Have to make sure there are no imports on top
- Run test by issuing command on root folder "mocha test"

### Useful Links
- Trello board: https://trello.com/b/Osda0zr5
- Battlecode docs: https://battlecode.org/dash/docs
- Example bot logic: https://github.com/npfoss/examplefuncsplayer
- Battlecode source: https://github.com/battlecode/battlecode19
- Clairvoyance: https://github.com/hgarrereyn/Clairvoyance
