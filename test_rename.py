

import sys
def main():
  fileName = sys.argv[1]
  fileOutputName = fileName[:-3] + "_test.js"
  file = open(fileName,'r')
  fileOutput = open(fileOutputName,'w')
  funNames = []
  for line in file:
    #print(line)
    if "export function" in line:
      temp = line.split(" ")[2].split("(")
      funName = temp[0]
      funNames.append(funName)
      newName = "exports." + funName + " = function(" + temp[1] + "\n"
      fileOutput.write(newName)
    elif any(fName in line for fName in funNames):
     # print("here")
      for fName in funNames:
        if fName in line:
         # print("found",fName,"in",line)
          line = line.replace(fName, "this." + fName)
          break;
      #print("line being writen",line)
      fileOutput.write(line)
    else:
      fileOutput.write(line)


if __name__ == '__main__':
  main()
