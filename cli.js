#!/usr/bin/env node
"use strict";

const git = require("simple-git/promise")();
const { MultiSelect } = require("enquirer");
const { bold, red } = require("kleur");

// Check if there are any branches
const hasBranches = (summary) => {
	const { all, current } = summary;
	if (summary.all.length < 1) Promise.reject("No branches found");
	else if (summary.all.length < 2) Promise.reject("You have only one branch");
	else return { branches: all, current };
};

//
const format = (branches) => {
	let choices = [];
	branches.branches.forEach((branch) => {
		choices.push({
			name: branch,
			value: branch
		});
	});
	return choices;
};

const questions = async (choices) => {
	const prompt = new MultiSelect({
		name: "value",
		message: "Which branches do you want to delete?",
		choices: choices,
		pointer: " → ",
		indicator: "✕"
	});

	return prompt
		.run()
		.then((answer) => answer)
		.catch(console.error);
};

const removeBranches = (branches) => {
	if (!branches.length) return logg("You didn't select any branches");
	branches.map((branch) => removeSingleBranch(branch));
};

const removeSingleBranch = (branch) => {
	git.branch(["-D", branch]);
	logg(`${bold(branch)} ${red("deleted")}`);
};

const logg = (msg) => {
	console.log(`\n\t${msg}\n`);
};

git
	.branchLocal()
	.then(hasBranches)
	.then(format)
	.then(questions)
	.then(removeBranches)
	.catch(logg);
