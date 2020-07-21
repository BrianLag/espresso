const fs = require('fs');
const jarvis = require("readline-sync");

const templateName = jarvis.question('which template do you want to use?\n-> ');

fs.readFile(`./templates/${templateName}.js`, 'utf8', (err, fileContent) => {
  if (err) throw err;

  const tokenKeys = [...new Set( // remove duplicates
    // find tokens in the template, matching the  pattern {{key}}
    [...fileContent.matchAll(/{{(\w+)}}/g)].map(([,key]) => key)
  )];

  const tokens = tokenKeys.reduce((previousTokens, tokenKey) => {
    const tokenValue = jarvis.question(`What value for ${tokenKey}?\n-> `);
    return [...previousTokens, {key: tokenKey, value: tokenValue}];
  }, []);

  const newFileContent = tokens.reduce((newFileContent, {key, value}) => (
    newFileContent.replace(new RegExp(`{{${key}}}`, 'g'), value)
  ), fileContent);

  fs.writeFile(`./outputs/${templateName}.js`, newFileContent, 'utf8', (err) => {
    if (err) throw err;

    console.log('your espresso is served ;)');
  })
});
