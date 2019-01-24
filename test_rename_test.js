

import sys
def main():
  fileName = sys.argv[0]
  fileOutputName = fileName[:-3] + "_test.js"
  file = open(fileName,'r')
  fileOutput = open(fileOutputName,'w')
  for line in file:
    print(line)
