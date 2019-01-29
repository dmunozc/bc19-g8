

import sys
def main():
  fileName = sys.argv[1]
  fileOutputName = fileName[:-3] + "_test.js"
  file = open(fileName,'r')
  fileOutput = open(fileOutputName,'w')
  for line in file:
    #print(line)
    if "export function" in line:
      temp = line.split(" ")[2].split("(")
      funName = temp[0]
      newName = "exports." + funName + " = function(" + temp[1] + "\n"
      fileOutput.write(newName)
    else:
      fileOutput.write(line)


if __name__ == '__main__':
  main()
