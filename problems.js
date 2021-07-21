const fs = require('fs');

const main = () => {
  const target = "src/problems_build";

  let list = JSON.parse(fs.readFileSync(`${target}/list.json`, { encoding: "utf-8" }));

  // console.log(JSON.stringify(list, "", "  "));

  for (const problemSet of list.problem_set) {
    for (const problem of problemSet.problems) {
      const p = JSON.parse(fs.readFileSync(`${target}/${problem.tid}/problem.json`, { encoding: 'utf-8' }));
      list.problem_set[list.problem_set.indexOf(problemSet)].problems[problemSet.problems.indexOf(problem)].content = p.content;
    }
  }

  // console.log(JSON.stringify(list, "", "  "));

  fs.writeFileSync(`${target}/problems.json`, JSON.stringify(list, "", "  "));
}

try {
  main();
  console.log('Generate OK.');
} catch (e) {
  console.error('Generate error: ', e);
}
