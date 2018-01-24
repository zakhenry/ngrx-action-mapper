#!/usr/bin/env node

const {sync: globSync }= require("glob");
const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const assert = require('assert');

// options is optional
globSync("**/*.expect-failure.ts")
  .forEach((file) => {

    try {
      execSync(`./node_modules/.bin/tsc ./${file} --lib es2016,dom --noEmit`);
    } catch (e) {

      const stdout = e.stdout.toString();

      const fileRaw = readFileSync(file).toString();

      const match = fileRaw.match(/\*\*[^]\s\*\sExpect:(?:[^/*][^*]*\*+)*/);

      if (!match) {
        throw new Error(`Expected to find docblock asserting an expected error in the following format:
        
        /**
         * Expect: 
         * <expected error message goes here>
         */`);
      }

      const [expectMatch] = match;

      const lineRe = /^\s\*\s(.*)$/gm;
      const lines = [];

      let matches;
      while ((matches = lineRe.exec(expectMatch)) !== null) {
        lines.push(matches[1]);
      }

      lines.shift(); // shift the `Expect:` line off

      const expect = lines.join('\n');

      try {
        assert.ok(stdout.indexOf(expect) > -1);
      } catch (e) {
        console.error(`Expected TS Error:`, expect);
        console.error(`Got TS Error:     `, stdout);
      }

      return;
    }

    throw new Error(`Expected ${file} to have compilation errors, but it had none`);

  });
