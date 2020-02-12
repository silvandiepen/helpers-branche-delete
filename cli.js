#!/usr/bin/env node
"use strict";

const git = require("simple-git/promise")();
const inquirer = require("inquirer");

// Check if there are any branches
const hasBranches = (summary) => {
	const { all, current } = summary;

	return !all || all === 0
		? Promise.reject("[delete-branches] No branches found")
		: { branches: all, current };
};

// Check if there are more tahn 1 branches
const hasMultibranches = (summary) => {
	const { branches, current } = summary;

	return branches.length === 1
		? Promise.reject("[delete-branches] You have only one branch")
		: branches.filter((b) => b !== "master" && b !== current);
};

//
const format = (branches) => {
	return branches.reduce((list, name) => [...list, { name }], []);
};

//
const list = (choices) => {
	return inquirer.prompt([
		{
			type: "checkbox",
			name: "branches",
			message: "Select branches you want to delete",
			choices
		}
	]);
};

const removeBranches = (values) => {
	const { branches } = values;

	if (!branches.length) return console.log("You didn't select any branches");

	branches.map((branch) => removeSingleBranch(branch));
};

const removeSingleBranch = (branch) => {
	git.branch(["-D", branch]);
	console.log(`branch: ${branch} deleted`);
};

const getBranches = async () => {
	const branches = await git.branchLocal();
	console.log(branches.branches);
};

getBranches();

// console.log(git.branchLocal());

// git
// 	.branchLocal()
// 	.then(hasBranches)
// 	.then(hasMultibranches)
// 	.then(format)
// 	.then(list)
// 	.then(removeBranches)
// 	.catch(console.log);
