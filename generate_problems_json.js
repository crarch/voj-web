const fs = require('fs');
const join = require('path').join;

function getFiles(targetPath, ext, raw) {
  let resFiles = [];
  function findFiles(path) {
    let files = fs.readdirSync(path);
    files.forEach(function (item, index) {
      let fPath = join(path, item);
      let stat = fs.statSync(fPath);
      if (stat.isDirectory() === true) {
        findFiles(fPath);
      }
      if (stat.isFile() === true && (ext && fPath.endsWith(`.${ext}`))) {
        resFiles.push(raw ? fPath : (fPath.slice(targetPath.length + 1)));
      }
    });
  }
  findFiles(targetPath);
  return resFiles;
}

function list2json(fileList, target) {
  split = '\\';
  let js = {};
  function getJsPath(jsData, path) {
    let j = jsData;
    for (const p of path) {
      if (j[p] !== undefined) {
        j = j[p];
      } else {
        return undefined;
      }
    }
    return j;
  }
  function setJsPath(jsData, path, data) {
    let j = jsData;
    for (const p of path) {
      if (j[p] === undefined) j[p] = (p === path.slice(-1)[0] ? data : {});
      j = j[p];
    }
    return jsData;
  }
  for (const file of fileList) {
    const path = file.split(split).slice(0, -1);
    const tail = file.split(split).slice(-1)[0];
    if (getJsPath(js, path) === undefined) {
      let content = fs.readFileSync(`${target}/${file}`, { encoding: "utf-8" });

      js = setJsPath(js, path, {
        problem: tail,
        filePath: file,
        content: content
      });
    }
  }
  return js;
}

const target = "src/problems";
const paths = getFiles(target, 'md');
// console.log(paths);
const js2 = list2json(paths, target);
// console.log(js2);
fs.writeFileSync(`${target}/problems.json`, JSON.stringify(js2, "", "  "), function (error) {
  if (error) {
    console.error('Generate file error!');
  } else {
    console.log('Generate OK.');
  }
});