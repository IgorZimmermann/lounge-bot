const inquirer = require('inquirer')
const { readdirSync, writeFile } = require('fs')

let commands = readdirSync('./commands/').filter(f => f.endsWith('.js'))

let questions = [
	{
		type: 'input',
		name: 'name',
		message: 'The name of the command: ',
		validate: v => {
			let available = !commands.includes(v)
			return available || console.log('Command already exists!')
		}
	},
	{
		type: 'input',
		name: 'aliases',
		message: 'The aliases (separated by ,): ',
		filter: v => {
			return v.split(',')
		}
	},
	{
		type: 'input',
		name: 'description',
		message: 'Describe the command: '
	},
	{
		type: 'list',
		name: 'hasAccess',
		message: 'Who has access?',
		choices: ['Everyone', 'Admin', 'Owner']
	},
	{
		type: 'input',
		name: 'usage',
		message: 'Usage of the command: '
	}
]

inquirer.prompt(questions).then(a => {
	let cmdFile = `module.exports.run = async (bot, message, args) => {}\n\nmodule.exports.help = ${JSON.stringify(
		a
	)}`
	writeFile(`./commands/${a.name}.js`, cmdFile, () =>
		console.log(`Created ${a.name} command!`)
	)
})
